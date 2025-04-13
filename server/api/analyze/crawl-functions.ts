import axios from 'axios';
import * as cheerio from 'cheerio';
import type { WebsiteAnalysisResult } from './analyzer-types';

/**
 * Crawle un site web en suivant les liens à partir de l'URL de base
 */
export async function crawlWebsite(baseUrl: string, maxPages: number = 50): Promise<string[]> {
  const visitedUrls = new Set<string>();
  const queue: string[] = [];
  const baseUrlObj = new URL(baseUrl);
  const domain = baseUrlObj.hostname;
  const failedUrls = new Set<string>(); // Pour suivre les URL qui ont échoué
  const normalizedUrls = new Set<string>(); // Pour éviter les doublons après normalisation

  // Définir les fonctions utilitaires internes
  function shouldKeepWithoutVisiting(url: string): boolean {
    try {
      // Si l'URL a déjà échoué, ne pas réessayer
      if (failedUrls.has(url)) {
        return true;
      }

      // Extraire les extensions de fichier
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const extension = path.split('.').pop()?.toLowerCase();

      // Liste des extensions de fichiers à exclure (on va réduire la liste pour autoriser plus de fichiers)
      const excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'webm', 'mp3', 'wav', 'zip', 'rar', 'exe', 'dll'];
      // Autoriser les fichiers PDF, DOC, DOCX, XLS, XLSX qui peuvent contenir du contenu important
      const largeFilesAllowed = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'pptx', 'ppt', 'txt', 'csv'];

      if (extension && excludedExtensions.includes(extension) && !largeFilesAllowed.includes(extension)) {
        return true;
      }

      // Autoriser quand même les URL avec des paramètres de pagination (mais limiter à page=1)
      if (urlObj.search.includes('page=') && !urlObj.search.includes('page=1')) {
        return true;
      }

      // Exclure les URL avec des paramètres de filtrage spécifiques mais pas toutes
      if ((urlObj.search.includes('filter=') && !urlObj.pathname.includes('/filter/')) ||
        (urlObj.search.includes('sort=') && !urlObj.pathname.includes('/sort/')) ||
        (urlObj.search.includes('tag=') && !urlObj.pathname.includes('/tag/'))) {
        return true;
      }

      // Augmenter la limite de longueur d'URL et le nombre de paramètres
      if (url.length > 250 || urlObj.search.split('&').length > 8) {
        return true;
      }

      // Être moins restrictif sur l'exclusion de certaines URLs
      if (url.includes('/cdn-cgi/') ||
        url.includes('email-protection') ||
        url.includes('/wp-json/wp/') || // Exclure uniquement API WordPress spécifiques, pas toutes
        (url.includes('/api/') && !urlObj.pathname.endsWith('/api/') &&
          !urlObj.pathname.includes('/api/products') && // Autoriser les API produits
          !urlObj.pathname.includes('/api/content'))) { // Autoriser les API de contenu
        return true;
      }

      return false;
    } catch (error) {
      return true;
    }
  }

  function normalizeUrl(href: string, currentUrl: string, baseUrlObj: URL): string | null {
    if (!href) return null;

    try {
      let fullUrl: string;

      if (href.startsWith('http')) {
        const urlObj = new URL(href);
        if (urlObj.hostname !== domain) return null;
        fullUrl = href;
      } else if (href.startsWith('/')) {
        fullUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}${href}`;
      } else if (!href.startsWith('#') && !href.startsWith('javascript:') &&
        !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        fullUrl = new URL(href, currentUrl).toString();
      } else {
        return null;
      }

      // Normaliser l'URL (supprimer les fragments # et normaliser)
      let normalizedUrl = fullUrl.split('#')[0];

      // Cas spécial pour la page d'accueil
      if (normalizedUrl === `${baseUrlObj.protocol}//${baseUrlObj.host}`) {
        normalizedUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}/`;
      }

      // Pour les autres pages, supprimer le trailing slash pour éviter les doublons
      else if (normalizedUrl.endsWith('/') && normalizedUrl !== `${baseUrlObj.protocol}//${baseUrlObj.host}/`) {
        normalizedUrl = normalizedUrl.slice(0, -1);
      }

      return normalizedUrl;
    } catch (error) {
      return null;
    }
  }

  const extractLinks = ($: cheerio.CheerioAPI, pageUrl: string): string[] => {
    const links: string[] = [];

    // Récupérer tous les liens <a>
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      if (!href) return;

      const normalizedUrl = normalizeUrl(href, pageUrl, baseUrlObj);
      if (normalizedUrl) {
        links.push(normalizedUrl);
      }
    });

    // Récupérer les liens dans les menus de navigation (souvent masqués sur mobile ou dynamiques)
    $('nav a, .menu a, .navigation a, header a, footer a, [role="navigation"] a').each((_, element) => {
      const href = $(element).attr('href')?.trim();
      if (!href) return;

      const normalizedUrl = normalizeUrl(href, pageUrl, baseUrlObj);
      if (normalizedUrl && !links.includes(normalizedUrl)) {
        links.push(normalizedUrl);
      }
    });

    // Prioriser les pages importantes
    return links.sort((a, b) => {
      // Prioriser la page d'accueil
      const rootUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}/`;
      if (a === rootUrl) return -1;
      if (b === rootUrl) return 1;

      // Prioriser les pages de contact, à propos, etc.
      const importantKeywords = ['contact', 'about', 'services', 'products', 'blog', 'pricing', 'legal', 'privacy'];
      const aIsImportant = importantKeywords.some(kw => a.toLowerCase().includes(kw));
      const bIsImportant = importantKeywords.some(kw => b.toLowerCase().includes(kw));

      if (aIsImportant && !bIsImportant) return -1;
      if (!aIsImportant && bIsImportant) return 1;

      // Prioriser les URL plus courtes
      return a.length - b.length;
    });
  };

  // Assurons-nous que la page d'accueil soit incluse
  const rootUrl = `${baseUrlObj.protocol}//${baseUrlObj.host}/`;
  queue.push(rootUrl);

  // Définir un délai maximum pour le crawl
  const MAX_CRAWL_TIME = 60000; // 60 secondes pour avoir plus de temps pour crawler
  const startTime = Date.now();

  // Utiliser des promesses parallèles pour accélérer le crawl
  const MAX_CONCURRENT_REQUESTS = 3; // Réduire le nombre de requêtes simultanées pour éviter les problèmes
  let activeRequests = 0;

  // Garder une trace des pages en cours d'analyse
  const inProgress = new Set<string>();

  while (queue.length > 0 && visitedUrls.size < maxPages && (Date.now() - startTime) < MAX_CRAWL_TIME) {
    if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
      // Attendre qu'une requête se termine avant de continuer
      await new Promise(resolve => setTimeout(resolve, 100));
      continue;
    }

    const currentUrl = queue.shift();
    if (!currentUrl) continue;

    // Vérifier si l'URL a déjà été visitée ou est en cours d'analyse
    if (visitedUrls.has(currentUrl) || inProgress.has(currentUrl) || shouldKeepWithoutVisiting(currentUrl)) {
      continue;
    }

    // Marquer l'URL comme en cours d'analyse
    inProgress.add(currentUrl);
    activeRequests++;

    try {
      console.log(`Crawling: ${currentUrl}`);
      const response = await axios.get(currentUrl, {
        timeout: 10000, // Augmenter le timeout pour les pages plus lentes
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'fr,en-US;q=0.8,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      });

      // Vérifier que c'est bien du HTML
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        console.log(`Not HTML: ${currentUrl}`);
        continue;
      }

      // Analyse réussie, marquer comme visitée
      visitedUrls.add(currentUrl);

      // Extraire et ajouter les liens
      const $ = cheerio.load(response.data);
      const links = extractLinks($, currentUrl);

      // Ajouter les liens à la file d'attente
      for (const link of links) {
        const normalizedLink = link.toLowerCase(); // Normaliser en minuscules pour éviter les doublons

        if (!normalizedUrls.has(normalizedLink) &&
          !visitedUrls.has(link) &&
          !queue.includes(link) &&
          !inProgress.has(link) &&
          !failedUrls.has(link) &&
          new URL(link).hostname === domain &&
          queue.length + visitedUrls.size < maxPages * 2) {

          queue.push(link);
          normalizedUrls.add(normalizedLink);
        }
      }
    } catch (error) {
      console.error(`Error crawling ${currentUrl}: ${error.message}`);
      failedUrls.add(currentUrl);
    } finally {
      inProgress.delete(currentUrl);
      activeRequests--;
    }
  }

  // S'assurer que la page d'accueil est toujours incluse
  if (!visitedUrls.has(rootUrl) && !failedUrls.has(rootUrl)) {
    try {
      console.log(`Forcing crawl of root URL: ${rootUrl}`);
      const response = await axios.get(rootUrl, {
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });

      if (response.headers['content-type']?.includes('text/html')) {
        visitedUrls.add(rootUrl);
      }
    } catch (error) {
      console.error(`Error crawling root URL: ${error.message}`);
    }
  }

  // Ajouter la page d'accueil même si elle a échoué
  if (!visitedUrls.has(rootUrl)) {
    visitedUrls.add(rootUrl);
  }

  return Array.from(visitedUrls);
}

/**
 * Vérifie l'existence et le contenu du sitemap
 */
export async function checkSitemap(baseUrl: string): Promise<{ found: boolean; url?: string; content?: string; urls?: number }> {
  try {
    const possibleLocations = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap/',
      '/sitemap.php',
      '/sitemap.txt',
      '/sitemap/sitemap.xml',
      '/wp-sitemap.xml',
      '/index-sitemap.xml'
    ];

    const baseUrlObj = new URL(baseUrl);
    const robotsTxtUrl = `${baseUrlObj.protocol}//${baseUrlObj.hostname}/robots.txt`;

    // Vérifier d'abord le robots.txt pour trouver le sitemap
    try {
      const robotsResponse = await axios.get(robotsTxtUrl, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
          'Accept': 'text/plain,*/*'
        }
      });

      if (robotsResponse.status === 200 && robotsResponse.data) {
        const robotsContent = robotsResponse.data.toString();
        const sitemapMatch = robotsContent.match(/Sitemap:\s*(.+)/i);
        if (sitemapMatch && sitemapMatch[1]) {
          const sitemapUrl = sitemapMatch[1].trim();
          try {
            const sitemapResponse = await axios.get(sitemapUrl, {
              timeout: 8000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
                'Accept': 'application/xml,text/xml,*/*'
              }
            });

            if (sitemapResponse.status === 200 && sitemapResponse.data) {
              const content = sitemapResponse.data;
              if (typeof content === 'string' &&
                (content.includes('<urlset') || content.includes('<sitemapindex'))) {

                const $ = cheerio.load(content, { xmlMode: true });
                const urlCount = $('url').length;

                return {
                  found: true,
                  url: sitemapUrl,
                  content,
                  urls: urlCount
                };
              }
            }
          } catch (error) {
            console.log(`Sitemap indiqué dans robots.txt introuvable: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`Erreur lors de la lecture du robots.txt: ${error.message}`);
    }

    for (const location of possibleLocations) {
      try {
        const url = new URL(location, baseUrl).href;
        const response = await axios.get(url, {
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
            'Accept': 'application/xml,text/xml,*/*'
          }
        });

        if (response.status === 200 && response.data) {
          const content = response.data;

          if (typeof content === 'string' &&
            (content.includes('<urlset') || content.includes('<sitemapindex'))) {

            const $ = cheerio.load(content, { xmlMode: true });
            const urlCount = $('url').length;

            return {
              found: true,
              url,
              content,
              urls: urlCount
            };
          }
        }
      } catch (error) {
        console.log(`Sitemap non trouvé à ${location}: ${error.message}`);
      }
    }

    return { found: false };
  } catch (error) {
    console.error('Erreur lors de la vérification du sitemap:', error);
    return { found: false };
  }
}

/**
 * Vérifie l'existence et le contenu du robots.txt
 */
export async function checkRobotsTxt(baseUrl: string): Promise<{ found: boolean; content?: string }> {
  try {
    const baseUrlObj = new URL(baseUrl);
    const robotsUrl = `${baseUrlObj.protocol}//${baseUrlObj.hostname}/robots.txt`;

    const response = await axios.get(robotsUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
        'Accept': 'text/plain,*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    if (response.status === 200) {
      const content = response.data;
      // Vérifier que le contenu ressemble à un fichier robots.txt
      if (typeof content === 'string' &&
        (content.includes('User-agent:') ||
          content.includes('Disallow:') ||
          content.includes('Allow:') ||
          content.includes('Sitemap:'))) {
        return {
          found: true,
          content: content
        };
      }
    }

    // Si on a une réponse mais pas le bon contenu, on vérifie quand même
    if (response.status === 200 && response.data) {
      return {
        found: true,
        content: String(response.data)
      };
    }

    return { found: false };
  } catch (error) {
    console.error('Erreur lors de la vérification du robots.txt:', error);
    return { found: false };
  }
}

/**
 * Trouve les informations de contact sur le site
 */
export async function findContactInfo(baseUrl: string, links: string[]): Promise<Record<string, string>> {
  if (!links || links.length === 0) {
    return {};
  }

  try {
    const contactKeywords = ['contact', 'about', 'about-us', 'a-propos', 'qui-sommes-nous', 'equipe', 'team'];

    const baseUrlObj = new URL(baseUrl);
    const baseHostname = baseUrlObj.hostname;

    const prioritizedUrls: string[] = [];

    links.forEach(link => {
      try {
        const url = new URL(link);
        if (url.hostname !== baseHostname) return;

        const path = url.pathname.toLowerCase();
        if (contactKeywords.some(keyword => path.includes(keyword))) {
          prioritizedUrls.push(link);
        }
      } catch (e) {
        // Ignorer les URL invalides
      }
    });

    if (prioritizedUrls.length === 0) {
      prioritizedUrls.push(baseUrl);
    }

    const contactInfo: Record<string, string> = {};

    const pagesToCheck = prioritizedUrls.slice(0, 3);

    for (const url of pagesToCheck) {
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)'
          }
        });

        if (response.status !== 200) {
          continue;
        }

        const html = response.data;
        if (!html) continue;

        const $ = cheerio.load(html);

        if (!contactInfo.telephone) {
          $('a[href^="tel:"]').each((_, element) => {
            const tel = $(element).attr('href')?.replace('tel:', '') || '';
            if (tel && tel.length > 5) {
              contactInfo.telephone = tel;
              return false;
            }
          });

          if (!contactInfo.telephone) {
            const phoneRegex = /(?:\+\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|(?:\+\d{1,3}[\s.-]?)?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/g;
            const bodyText = $('body').text();
            const matches = bodyText.match(phoneRegex);

            if (matches && matches.length > 0) {
              contactInfo.telephone = matches[0].replace(/\s+/g, ' ').trim();
            }
          }
        }

        if (!contactInfo.email) {
          $('a[href^="mailto:"]').each((_, element) => {
            const email = $(element).attr('href')?.replace('mailto:', '')?.split('?')[0] || '';
            if (email && email.includes('@') && email.includes('.')) {
              contactInfo.email = email;
              return false;
            }
          });

          if (!contactInfo.email) {
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const bodyText = $('body').text();
            const matches = bodyText.match(emailRegex);

            if (matches && matches.length > 0) {
              const validEmail = matches.find(email =>
                !email.includes('example') &&
                !email.includes('nom@') &&
                !email.includes('votre') &&
                !email.includes('user')
              );

              if (validEmail) {
                contactInfo.email = validEmail;
              }
            }
          }
        }

        if (!contactInfo.address) {
          $('[itemtype*="PostalAddress"], [itemprop="address"], [itemprop="streetAddress"], .address, .contact-address').each((_, element) => {
            const addressText = $(element).text().trim();
            if (addressText && addressText.length > 10) {
              contactInfo.address = addressText.replace(/\s+/g, ' ');
              return false;
            }
          });

          if (!contactInfo.address) {
            $('p, div').each((_, element) => {
              const text = $(element).text().trim();
              if (
                (text.match(/\d{5}/) || text.match(/\d{2,4}\s+\w+/)) &&
                (text.includes('rue') || text.includes('avenue') || text.includes('boulevard') ||
                  text.includes('chemin') || text.includes('place') || text.includes('route'))
              ) {
                if (text.length > 10 && text.length < 200) {
                  contactInfo.address = text.replace(/\s+/g, ' ');
                  return false;
                }
              }
            });
          }
        }

        if (!contactInfo.name) {
          $('[itemtype*="Organization"], [itemtype*="Person"]').each((_, element) => {
            const nameEl = $(element).find('[itemprop="name"]');
            if (nameEl.length > 0) {
              contactInfo.name = nameEl.first().text().trim();
              return false;
            }
          });

          if (!contactInfo.name) {
            const siteName = $('title').text().split('|')[0].split('-')[0].trim();
            if (siteName && siteName.length > 1) {
              contactInfo.name = siteName;
            }
          }

          if (!contactInfo.name) {
            contactInfo.name = baseHostname.replace('www.', '');
          }
        }

        if (contactInfo.telephone && contactInfo.email && contactInfo.address && contactInfo.name) {
          break;
        }
      } catch (error) {
        console.error(`Error analyzing ${url} for contacts:`, error.message);
      }
    }

    return contactInfo;
  } catch (error) {
    console.error('General error when searching for contacts:', error);
    return {};
  }
}

/**
 * Crée un résultat d'analyse de secours 
 */
export async function createFallbackResult(url: string): Promise<WebsiteAnalysisResult> {
  try {
    return {
      url,
      title: '',
      description: '',
      performance: {
        ttfb: 0,
        fcp: 0,
        lcp: 0,
        cls: 0,
        speedIndex: 0,
        totalBlockingTime: 0,
        loadTime: 0,
        resourceLoadTimes: {
          total: 0,
          html: 0,
          css: 0,
          js: 0,
          images: 0,
          other: 0
        },
        resourceSizes: {
          total: 0,
          html: 0,
          css: 0,
          js: 0,
          images: 0,
          other: 0
        }
      },
      seo: {
        title: '',
        description: '',
        headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
        images: { total: 0, withAlt: 0, withoutAlt: 0, data: [] },
        links: {
          internal: [],
          external: [],
          broken: [],
          nofollow: []
        },
        structuredData: { data: [], count: 0, types: {} },
        meta: {
          viewport: false,
          robots: '',
          canonical: '',
          og: {},
          twitter: {}
        },
        wordCount: 0,
        readabilityScore: 0,
        keywordDensity: {}
      },
      technical: {
        statusCode: 0,
        https: url.startsWith('https'),
        mobile: {
          viewport: false,
          responsive: false
        },
        security: {
          headers: {},
          securityIssues: []
        },
        meta: {
          charset: '',
          language: ''
        },
        response: {
          headers: {},
          size: 0,
          time: 0
        }
      },
      accessibility: {
        missingAria: 0,
        missingAlt: 0,
        missingLabels: 0,
        missingInputAttributes: 0,
        contrastIssues: 0,
        ariaIssues: [],
        inputIssues: [],
        accessibilityScore: 0
      },
      socialTags: {
        openGraph: false,
        twitter: false,
        twitterTags: []
      },
      issues: []
    } as WebsiteAnalysisResult;
  } catch (e) {
    console.error('Error creating fallback result:', e);
    throw e;
  }
}

/**
 * Génère un sitemap XML à partir d'une liste d'URLs
 */
export function generateSitemap(urls: string[], imagesData: Record<string, any> = {}): string {
  const date = new Date().toISOString();
  let baseDomain = '';

  try {
    if (urls.length > 0) {
      const firstUrl = urls[0];
      const urlObj = new URL(firstUrl);
      baseDomain = `${urlObj.protocol}//${urlObj.host}`;
    }
  } catch (e) {
    console.error("Erreur lors de l'extraction du domaine de base:", e);
  }

  const standardizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol.toLowerCase();
      const hostname = urlObj.hostname.toLowerCase();
      let pathname = urlObj.pathname;
      if (pathname !== "/" && pathname.endsWith("/")) {
        pathname = pathname.slice(0, -1);
      }
      return `${protocol}//${hostname}${pathname}${urlObj.search}${urlObj.hash}`;
    } catch (e) {
      return url;
    }
  };

  const uniqueUrls = [...new Set(urls.map(url => standardizeUrl(url)))];

  uniqueUrls.sort((a, b) => {
    try {
      const segmentsA = new URL(a).pathname.split('/').filter(Boolean).length;
      const segmentsB = new URL(b).pathname.split('/').filter(Boolean).length;

      if (segmentsA !== segmentsB) {
        return segmentsA - segmentsB;
      }

      return a.localeCompare(b);
    } catch (e) {
      return 0;
    }
  });

  const getPriorityAndChangefreq = (url: string): { priority: string, changefreq: string } => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      const segments = path.split('/').filter(Boolean);

      if (path === '/' || path === '') {
        return { priority: '1.0', changefreq: 'daily' };
      }

      if (segments.length === 1) {
        if (['about', 'contact', 'services', 'products', 'blog'].includes(segments[0])) {
          return { priority: '0.8', changefreq: 'weekly' };
        }
        return { priority: '0.7', changefreq: 'weekly' };
      }

      if (segments.includes('dashboard') || segments.includes('admin') ||
        segments.includes('profile') || segments.includes('account')) {
        return { priority: '0.9', changefreq: 'daily' };
      }

      if (segments.length === 2) {
        if (segments[0] === 'blog' || segments[0] === 'products' || segments[0] === 'product') {
          return { priority: '0.6', changefreq: 'monthly' };
        }
        return { priority: '0.5', changefreq: 'monthly' };
      }

      return { priority: '0.3', changefreq: 'monthly' };
    } catch (e) {
      return { priority: '0.5', changefreq: 'monthly' };
    }
  };

  const isImageUrl = (url: string): boolean => {
    return !!url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i);
  };

  const sitemapEntries = uniqueUrls
    .filter(url => !url.match(/\.(css|js|ico|woff|woff2|ttf|eot|pdf|zip|rar|exe|dll|docx?|xlsx?|pptx?)(\?.*)?$/i) &&
      !url.includes('/api/') && !url.includes('/wp-json/') &&
      !url.includes('/404') && !url.includes('/500') && !url.includes('/error'))
    .map(url => {
      const { priority, changefreq } = getPriorityAndChangefreq(url);
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries}
</urlset>`;
}

/**
 * Classe les pages par importance selon des critères SEO
 */
export function rankPages(results: Record<string, WebsiteAnalysisResult>): string[] {
  return Object.entries(results)
    .sort(([, a], [, b]) => {
      const getScore = (result: WebsiteAnalysisResult) => {
        let score = 0;

        // Performance
        score += (1000 - result.performance.loadTime) / 10;
        score += (100 - result.performance.ttfb) / 2;

        // SEO
        if (result.seo.title) score += 10;
        if (result.seo.description) score += 10;
        if (result.seo.images && result.seo.images.withAlt)
          score += result.seo.images.withAlt * 2;

        // Issues
        score -= result.issues.length * 5;

        // Content
        score += result.seo.wordCount / 100;
        if (result.seo.structuredData && result.seo.structuredData.types)
          score += Object.keys(result.seo.structuredData.types).length * 5;

        return score;
      };

      return getScore(b) - getScore(a);
    })
    .map(([url]) => url);
} 