import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { createError, defineEventHandler, readBody } from 'h3';

export interface SEOAuditResult {
  url: string;
  title: string;
  description: string;
  h1: string[];
  h2: string[];
  h3: string[];
  metaTags: Array<{ name: string; content: string }>;
  robotsMeta: {
    index: boolean;
    follow: boolean;
    noindex: boolean;
    nofollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noodp: boolean;
  };
  imageAlt: Array<{
    src: string;
    alt: string | null;
    title?: string;
    width?: string;
    height?: string;
    hasDimensions: boolean;
  }>;
  videoInfo: Array<{
    src: string;
    type: string;
    width?: string;
    height?: string;
    title?: string;
    description?: string;
    thumbnail?: string;
  }>;
  loadTime: number;
  statusCode: number;
  internalLinks: string[];
  externalLinks: string[];
  warnings: Array<Warning | string>;
  coreWebVitals: {
    FCP: number;
    LCP: number;
    TTFB: number;
    domLoad: number;
  };
  headingStructure: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  structuredData: any[];
  socialTags: {
    ogTags: Array<{ property: string | null; content: string | null }>;
    twitterTags: Array<{ name: string | null; content: string | null }>;
  };
  mobileCompatibility: {
    hasViewport: boolean;
    viewportContent: string;
    smallTouchTargets: number;
  };
  securityChecks: {
    https: boolean;
    validCertificate: boolean;
    securityHeaders: Array<{ name: string; value: string }>;
  };
  links: {
    internal: string[];
    external: string[];
  };
  contentStats: {
    wordCount: number;
    keywordDensity: number;
    readabilityScore: number;
  };
  technicalSEO: {
    sitemapFound: boolean;
    sitemapUrl: string;
    sitemapUrls: number;
    robotsTxtFound: boolean;
    robotsTxtContent: string;
    schemaTypeCount: Record<string, number>;
  };
  isHomePage?: boolean;
}

export interface Warning {
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'meta' | 'content' | 'performance' | 'security' | 'mobile' | 'general' | 'loading' | 'title' | 'description' | 'h1' | 'image' | 'social' | 'structured-data';
}

export interface CrawlReport {
  urlMap: Record<string, string[]>;
  visitedURLs: string[];
  seoResults: Record<string, SEOAuditResult>;
  summary: {
    totalPages: number;
    averageLoadTime: number;
    totalWarnings: number;
    missingTitles: number;
    missingDescriptions: number;
    missingAltTags: number;
    averageFCP: number;
    averageLCP: number;
    averageTTFB: number;
    pagesWithStructuredData: number;
    pagesWithSocialTags: number;
    mobileCompatiblePages: number;
    securePages: number;
  };
  generatedSitemap?: string;
  rankedUrls?: string[];
}

// Fonctions d'extraction HTML par regex
function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractMetaDescription(html: string): string {
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  return metaMatch ? metaMatch[1].trim() : '';
}

function extractAllHeadings(html: string): { [key: string]: string[] } {
  const headings: { [key: string]: string[] } = {
    h1: [], h2: [], h3: [], h4: [], h5: [], h6: []
  };

  for (let i = 1; i <= 6; i++) {
    const regex = new RegExp(`<h${i}[^>]*>(.*?)<\/h${i}>`, 'gi');
    let match;
    while ((match = regex.exec(html)) !== null) {
      // Nettoyer les balises HTML à l'intérieur du titre
      const content = match[1].replace(/<[^>]*>/g, '').trim();
      headings[`h${i}`].push(content);
    }
  }

  return headings;
}

function extractImages(html: string, baseUrl: string): any[] {
  const images: Array<{
    src: string;
    alt: string | null;
    title: string | null;
    width: string;
    height: string;
    hasDimensions: boolean;
  }> = [];
  const regex = /<img[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const imgTag = match[0];

    const srcMatch = imgTag.match(/src=["']([^"']*)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const titleMatch = imgTag.match(/title=["']([^"']*)["']/i);
    const widthMatch = imgTag.match(/width=["']([^"']*)["']/i);
    const heightMatch = imgTag.match(/height=["']([^"']*)["']/i);

    const src = srcMatch ? srcMatch[1] : '';

    // Construire l'URL complète si nécessaire
    let fullSrc = src;
    if (src && !src.startsWith('data:') && !src.match(/^(http|https):\/\//)) {
      if (src.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        fullSrc = `${urlObj.protocol}//${urlObj.hostname}${src}`;
      } else {
        fullSrc = new URL(src, baseUrl).href;
      }
    }

    images.push({
      src: fullSrc,
      alt: altMatch ? altMatch[1] : null,
      title: titleMatch ? titleMatch[1] : null,
      width: widthMatch ? widthMatch[1] : '',
      height: heightMatch ? heightMatch[1] : '',
      hasDimensions: !!(widthMatch && heightMatch)
    });
  }

  return images;
}

function extractLinks(html: string, url: string): { internal: string[], external: string[] } {
  const links: { internal: string[], external: string[] } = {
    internal: [],
    external: []
  };

  const urlObj = new URL(url);
  const baseHost = urlObj.hostname;

  const regex = /<a[^>]*href=["']([^"']*)["'][^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1];

    // Ignorer les liens javascript: et les ancres
    if (!href || href.startsWith('javascript:') || href === '#' || href.startsWith('mailto:')) {
      continue;
    }

    try {
      // Si c'est une URL relative, la convertir en absolue
      let fullUrl: string;
      if (href.startsWith('/')) {
        fullUrl = `${urlObj.protocol}//${baseHost}${href}`;
      } else if (!href.match(/^(http|https):\/\//)) {
        fullUrl = new URL(href, url).href;
      } else {
        fullUrl = href;
      }

      // Déterminer si le lien est interne ou externe
      const linkUrl = new URL(fullUrl);
      if (linkUrl.hostname === baseHost) {
        if (!links.internal.includes(fullUrl)) {
          links.internal.push(fullUrl);
        }
      } else {
        if (!links.external.includes(fullUrl)) {
          links.external.push(fullUrl);
        }
      }
    } catch (e) {
      // URL invalide, l'ignorer
      console.error(`URL invalide: ${href}`);
    }
  }

  return links;
}

function extractMetaTags(html: string): Array<{ name: string, content: string }> {
  const metaTags: Array<{ name: string, content: string }> = [];
  const regex = /<meta[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const metaTag = match[0];

    // Extraire le nom et le contenu
    const nameMatch = metaTag.match(/name=["']([^"']*)["']/i);
    const contentMatch = metaTag.match(/content=["']([^"']*)["']/i);

    if (nameMatch && contentMatch) {
      metaTags.push({
        name: nameMatch[1],
        content: contentMatch[1]
      });
    }
  }

  return metaTags;
}

function extractSocialTags(html: string): { ogTags: any[], twitterTags: any[] } {
  const ogTags: Array<{ property: string, content: string }> = [];
  const twitterTags: Array<{ name: string, content: string }> = [];

  // Extraire les balises Open Graph
  const ogRegex = /<meta[^>]*property=["']og:([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  let ogMatch;

  while ((ogMatch = ogRegex.exec(html)) !== null) {
    ogTags.push({
      property: `og:${ogMatch[1]}`,
      content: ogMatch[2]
    });
  }

  // Extraction alternative pour OG (ordre différent des attributs)
  const ogRegexAlt = /<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:([^"']*)["'][^>]*>/gi;
  let ogMatchAlt;

  while ((ogMatchAlt = ogRegexAlt.exec(html)) !== null) {
    ogTags.push({
      property: `og:${ogMatchAlt[2]}`,
      content: ogMatchAlt[1]
    });
  }

  // Extraire les balises Twitter
  const twitterRegex = /<meta[^>]*name=["']twitter:([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
  let twitterMatch;

  while ((twitterMatch = twitterRegex.exec(html)) !== null) {
    twitterTags.push({
      name: `twitter:${twitterMatch[1]}`,
      content: twitterMatch[2]
    });
  }

  // Extraction alternative pour Twitter (ordre différent des attributs)
  const twitterRegexAlt = /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']twitter:([^"']*)["'][^>]*>/gi;
  let twitterMatchAlt;

  while ((twitterMatchAlt = twitterRegexAlt.exec(html)) !== null) {
    twitterTags.push({
      name: `twitter:${twitterMatchAlt[2]}`,
      content: twitterMatchAlt[1]
    });
  }

  return { ogTags, twitterTags };
}

function extractStructuredData(html: string): any[] {
  const structuredData: any[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const jsonContent = match[1].trim();
      const parsed = JSON.parse(jsonContent);
      if (parsed) {
        structuredData.push(parsed);
      }
    } catch (e) {
      console.error('Erreur lors de l\'analyse JSON-LD:', e);
    }
  }

  return structuredData;
}

function extractViewportMeta(html: string): { hasViewport: boolean, viewportContent: string } {
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["'][^>]*>/i);

  return {
    hasViewport: !!viewportMatch,
    viewportContent: viewportMatch ? viewportMatch[1] : ''
  };
}

function countWords(text: string): number {
  // Extraire uniquement le texte du HTML
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return cleanText.split(/\s+/).length;
}

function extractRobotsMeta(metaTags: Array<{ name: string, content: string }>): any {
  const robotsMeta = {
    index: true,
    follow: true,
    noindex: false,
    nofollow: false,
    noarchive: false,
    nosnippet: false,
    noodp: false
  };

  const robotsTag = metaTags.find(tag => tag.name.toLowerCase() === 'robots');
  if (robotsTag) {
    const content = robotsTag.content.toLowerCase();

    robotsMeta.noindex = content.includes('noindex');
    robotsMeta.nofollow = content.includes('nofollow');
    robotsMeta.noarchive = content.includes('noarchive');
    robotsMeta.nosnippet = content.includes('nosnippet');
    robotsMeta.noodp = content.includes('noodp');

    robotsMeta.index = !robotsMeta.noindex;
    robotsMeta.follow = !robotsMeta.nofollow;
  }

  return robotsMeta;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url;
  const options = body.options || {};

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL manquante'
    });
  }

  const MAX_DEPTH = options.maxDepth || 2;
  const SAME_DOMAIN_ONLY = options.sameDomainOnly !== false;
  const TIMEOUT = options.timeout || 30000;
  const USE_RAPID_API = options.useRapidApi !== false;
  const ANALYZE_MULTIPLE_PAGES = options.analyzeMultiplePages || false;
  const SCRAPE_ALL_URLS = options.scrapeAllUrls || false;
  const MAX_URLS_TO_ANALYZE = options.maxUrlsToAnalyze || 20;

  try {
    console.log('Démarrage de l\'audit SEO pour', url);
    const startTime = Date.now();

    // Scraper toutes les URLs du domaine si demandé
    if (SCRAPE_ALL_URLS) {
      return await scrapeDomainAndAnalyze(url, MAX_URLS_TO_ANALYZE, USE_RAPID_API, TIMEOUT);
    }

    // Analyser plusieurs pages si demandé
    if (ANALYZE_MULTIPLE_PAGES) {
      return await performMultiPageAudit(url, MAX_DEPTH, SAME_DOMAIN_ONLY, USE_RAPID_API, TIMEOUT);
    }

    // Utiliser RapidAPI si demandé
    if (USE_RAPID_API) {
      try {
        const report = await performRapidApiAudit(url);
        return report;
      } catch (rapidApiError) {
        console.error('Erreur avec RapidAPI, basculement vers la méthode standard:', rapidApiError.message);
        // Continuer avec la méthode standard en cas d'échec
      }
    }

    // Récupération du contenu HTML
    const siteResponse = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://devunity.tech)'
      }
    }).catch(error => {
      console.error('Erreur lors de la récupération du site:', error.message);
      throw createError({
        statusCode: 500,
        message: `Impossible d'accéder au site: ${error.message}`
      });
    });

    const html = siteResponse.data;
    const loadTime = Date.now() - startTime;

    // Extraire les informations de base
    const title = extractTitle(html);
    const description = extractMetaDescription(html);
    const headings = extractAllHeadings(html);
    const imageAlt = extractImages(html, url);
    const links = extractLinks(html, url);
    const metaTags = extractMetaTags(html);
    const robotsMeta = extractRobotsMeta(metaTags);
    const socialTags = extractSocialTags(html);
    const structuredData = extractStructuredData(html);
    const viewport = extractViewportMeta(html);
    const wordCount = countWords(html);

    // Récupérer robots.txt et sitemap
    let robotsTxtContent = '';
    let robotsTxtFound = false;
    let sitemapFound = false;
    let sitemapUrl = '';
    let sitemapUrls = 0;

    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      const robotsUrl = `${baseUrl}/robots.txt`;

      const robotsResponse = await axios.get(robotsUrl, { timeout: 5000 });
      if (robotsResponse.status === 200) {
        robotsTxtContent = robotsResponse.data;
        robotsTxtFound = true;

        // Extraire l'URL du sitemap du robots.txt
        const sitemapMatches = robotsTxtContent.match(/Sitemap:\s*(.+)/gi);
        if (sitemapMatches && sitemapMatches.length > 0) {
          const sitemapLine = sitemapMatches[0];
          sitemapUrl = sitemapLine.replace(/Sitemap:\s*/i, '').trim();
          sitemapFound = true;

          // Récupérer le contenu du sitemap
          try {
            const sitemapResponse = await axios.get(sitemapUrl, { timeout: 10000 });
            if (sitemapResponse.status === 200) {
              const xmlData = sitemapResponse.data;
              const parser = new XMLParser({ ignoreAttributes: false });
              const parsedXml = parser.parse(xmlData);

              if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
                const sitemaps = Array.isArray(parsedXml.sitemapindex.sitemap)
                  ? parsedXml.sitemapindex.sitemap
                  : [parsedXml.sitemapindex.sitemap];
                sitemapUrls = sitemaps.length;
              }
              else if (parsedXml.urlset && parsedXml.urlset.url) {
                const urls = Array.isArray(parsedXml.urlset.url)
                  ? parsedXml.urlset.url
                  : [parsedXml.urlset.url];
                sitemapUrls = urls.length;
              }
            }
          } catch (error) {
            console.error('Erreur lors de l\'analyse du sitemap:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du robots.txt:', error.message);
    }

    // Analyser les schémas structurés et compter les types
    const schemaTypeCount: Record<string, number> = {};
    for (const schema of structuredData) {
      try {
        if (schema && schema['@type']) {
          const type = schema['@type'];
          if (Array.isArray(type)) {
            type.forEach(t => {
              schemaTypeCount[t] = (schemaTypeCount[t] || 0) + 1;
            });
          } else {
            schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1;
          }
        }
      } catch (error) {
        console.error('Erreur d\'analyse du type de schéma:', error.message);
      }
    }

    // Construire les résultats
    const result: SEOAuditResult = {
      url,
      title,
      description,
      h1: headings.h1,
      h2: headings.h2,
      h3: headings.h3,
      metaTags,
      robotsMeta,
      imageAlt,
      videoInfo: [],
      loadTime,
      statusCode: siteResponse.status,
      internalLinks: links.internal,
      externalLinks: links.external,
      warnings: [],
      coreWebVitals: {
        FCP: 0,
        LCP: 0,
        TTFB: 0,
        domLoad: loadTime
      },
      headingStructure: {
        h1: headings.h1 || [],
        h2: headings.h2 || [],
        h3: headings.h3 || [],
        h4: headings.h4 || [],
        h5: headings.h5 || [],
        h6: headings.h6 || []
      },
      structuredData,
      socialTags,
      mobileCompatibility: {
        hasViewport: viewport.hasViewport,
        viewportContent: viewport.viewportContent,
        smallTouchTargets: 0
      },
      securityChecks: {
        https: url.startsWith('https'),
        validCertificate: true,
        securityHeaders: []
      },
      links,
      contentStats: {
        wordCount,
        keywordDensity: calculateKeywordDensity(html),
        readabilityScore: calculateReadabilityScore(html)
      },
      technicalSEO: {
        sitemapFound,
        sitemapUrl,
        sitemapUrls,
        robotsTxtFound,
        robotsTxtContent,
        schemaTypeCount
      }
    };

    // Générer les avertissements
    if (!result.title) {
      result.warnings.push({
        message: 'Titre manquant',
        severity: 'high',
        type: 'title'
      });
    }

    if (!result.description) {
      result.warnings.push({
        message: 'Meta description manquante',
        severity: 'high',
        type: 'description'
      });
    }

    if (result.h1.length === 0) {
      result.warnings.push({
        message: 'Balise H1 manquante',
        severity: 'high',
        type: 'h1'
      });
    }

    if (result.h1.length > 1) {
      result.warnings.push({
        message: 'Plusieurs balises H1 détectées',
        severity: 'medium',
        type: 'h1'
      });
    }

    result.imageAlt.forEach(img => {
      if (!img.alt) {
        result.warnings.push({
          message: `Image sans attribut alt: ${img.src}`,
          severity: 'medium',
          type: 'image'
        });
      }
    });

    if (!result.mobileCompatibility.hasViewport) {
      result.warnings.push({
        message: 'Balise viewport manquante',
        severity: 'high',
        type: 'mobile'
      });
    }

    if (!result.securityChecks.https) {
      result.warnings.push({
        message: 'Site n\'utilisant pas HTTPS',
        severity: 'high',
        type: 'security'
      });
    }

    if (result.socialTags.ogTags.length === 0 && result.socialTags.twitterTags.length === 0) {
      result.warnings.push({
        message: 'Balises pour réseaux sociaux manquantes (Open Graph / Twitter Cards)',
        severity: 'medium',
        type: 'social'
      });
    }

    if (result.coreWebVitals.LCP > 2500) {
      result.warnings.push({
        message: 'Largest Contentful Paint (LCP) trop lent (> 2.5s)',
        severity: 'high',
        type: 'performance'
      });
    }

    if (result.coreWebVitals.FCP > 1000) {
      result.warnings.push({
        message: 'First Contentful Paint (FCP) trop lent (> 1s)',
        severity: 'medium',
        type: 'performance'
      });
    }

    // Avertissements pour des problèmes SEO techniques
    if (!sitemapFound) {
      result.warnings.push({
        message: 'Pas de sitemap.xml trouvé',
        severity: 'medium',
        type: 'general'
      });
    }

    if (!robotsTxtFound) {
      result.warnings.push({
        message: 'Pas de robots.txt trouvé',
        severity: 'medium',
        type: 'general'
      });
    }

    if (Object.keys(schemaTypeCount).length === 0) {
      result.warnings.push({
        message: 'Aucun balisage Schema.org trouvé',
        severity: 'medium',
        type: 'structured-data'
      });
    }

    if (robotsMeta.noindex) {
      result.warnings.push({
        message: 'La page est configurée pour ne pas être indexée (noindex)',
        severity: 'high',
        type: 'meta'
      });
    }

    if (robotsMeta.nofollow) {
      result.warnings.push({
        message: 'La page est configurée pour ne pas suivre les liens (nofollow)',
        severity: 'medium',
        type: 'meta'
      });
    }

    // Construire le rapport final
    const urlMap: Record<string, string[]> = {};
    urlMap[url] = result.internalLinks;

    const report: CrawlReport = {
      urlMap,
      visitedURLs: [url],
      seoResults: {
        [url]: result
      },
      summary: {
        totalPages: 1,
        averageLoadTime: result.loadTime,
        totalWarnings: result.warnings.length,
        missingTitles: !result.title ? 1 : 0,
        missingDescriptions: !result.description ? 1 : 0,
        missingAltTags: result.imageAlt.filter(img => !img.alt).length,
        averageFCP: result.coreWebVitals.FCP,
        averageLCP: result.coreWebVitals.LCP,
        averageTTFB: result.coreWebVitals.TTFB,
        pagesWithStructuredData: result.structuredData.length > 0 ? 1 : 0,
        pagesWithSocialTags: (result.socialTags.ogTags.length > 0 || result.socialTags.twitterTags.length > 0) ? 1 : 0,
        mobileCompatiblePages: result.mobileCompatibility.hasViewport ? 1 : 0,
        securePages: result.securityChecks.https ? 1 : 0
      }
    };

    console.log('Audit SEO terminé avec succès');
    return report;

  } catch (error) {
    console.error('Erreur pendant l\'analyse SEO:', error);
    throw createError({
      statusCode: 500,
      message: `Erreur pendant l'analyse SEO: ${error.message}`
    });
  }
});

/**
 * Effectue un audit SEO sur plusieurs pages en parcourant le site
 */
async function performMultiPageAudit(
  startUrl: string,
  maxDepth: number,
  sameDomainOnly: boolean,
  useRapidApi: boolean,
  timeout: number
): Promise<CrawlReport> {
  const urlObj = new URL(startUrl);
  const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

  // Initialiser les structures de données
  const visitedURLs: string[] = [];
  const urlMap: Record<string, string[]> = {};
  const seoResults: Record<string, SEOAuditResult> = {};
  let urlsToVisit: string[] = [startUrl];
  let currentDepth = 0;

  // Minimum de pages à analyser (même si nous n'arrivons pas à la profondeur maximale)
  const MIN_PAGES = 5;
  let analyzedPagesCount = 0;

  console.log(`Démarrage de l'analyse multi-pages avec profondeur max: ${maxDepth}`);

  // Obtenir d'abord le sitemap si disponible pour prioritiser les URLs
  const sitemapUrls = await getSitemapUrls(baseUrl);
  if (sitemapUrls.length > 0) {
    console.log(`Sitemap trouvé avec ${sitemapUrls.length} URLs`);
    // Prendre les 20 premières URLs du sitemap pour éviter une analyse trop longue
    const limitedSitemapUrls = sitemapUrls.slice(0, 20);
    // Ajouter les URLs du sitemap à celles à visiter (en les dédupliquant)
    urlsToVisit = [...new Set([...urlsToVisit, ...limitedSitemapUrls])];
  } else {
    // Si pas de sitemap, explorer quelques URLs communes
    console.log("Pas de sitemap trouvé, exploration des URLs communes");
    const commonPaths = [
      "/about", "/contact", "/services", "/products", "/blog", "/faq",
      "/privacy-policy", "/terms", "/sitemap", "/news", "/support"
    ];

    commonPaths.forEach(path => {
      urlsToVisit.push(`${baseUrl}${path}`);
    });
  }

  // Parcourir le site jusqu'à la profondeur maximale ou jusqu'à atteindre MIN_PAGES
  while ((urlsToVisit.length > 0 && currentDepth < maxDepth) || analyzedPagesCount < MIN_PAGES) {
    console.log(`Analyse de la profondeur ${currentDepth + 1}/${maxDepth} avec ${urlsToVisit.length} URLs à visiter`);
    const nextUrls: string[] = [];

    // Limiter le nombre d'URLs par niveau pour éviter une explosion
    const urlsForThisDepth = urlsToVisit.slice(0, 10);

    // Analyser toutes les URLs de ce niveau en parallèle
    const analysisPromises = urlsForThisDepth.map(async (url) => {
      if (visitedURLs.includes(url)) {
        return null; // URL déjà visitée
      }

      try {
        // Ajouter l'URL à la liste des URLs visitées
        visitedURLs.push(url);

        // Analyser la page en combinant les données de RapidAPI et l'analyse standard
        let result: SEOAuditResult;

        if (useRapidApi) {
          try {
            // Tenter d'utiliser RapidAPI pour cette URL
            const rapidApiReport = await performRapidApiAudit(url);
            const rapidApiResult = rapidApiReport.seoResults[url];

            // Compléter avec l'analyse standard pour avoir des données plus complètes
            const standardResult = await analyzePageStandard(url, timeout);

            // Fusionner les deux résultats en privilégiant RapidAPI pour certaines métriques
            result = {
              ...standardResult,
              // Utiliser les métriques de performance de RapidAPI si disponibles
              coreWebVitals: rapidApiResult.coreWebVitals.FCP > 0 ?
                rapidApiResult.coreWebVitals : standardResult.coreWebVitals,
              // Combiner les warnings des deux sources
              warnings: [...new Set([...rapidApiResult.warnings, ...standardResult.warnings])],
              // Prendre le plus grand nombre de liens internes/externes
              internalLinks: rapidApiResult.internalLinks.length > standardResult.internalLinks.length ?
                rapidApiResult.internalLinks : standardResult.internalLinks,
              externalLinks: rapidApiResult.externalLinks.length > standardResult.externalLinks.length ?
                rapidApiResult.externalLinks : standardResult.externalLinks,
              links: {
                internal: rapidApiResult.links.internal.length > standardResult.links.internal.length ?
                  rapidApiResult.links.internal : standardResult.links.internal,
                external: rapidApiResult.links.external.length > standardResult.links.external.length ?
                  rapidApiResult.links.external : standardResult.links.external
              }
            };
          } catch (e) {
            console.error(`Erreur avec RapidAPI pour ${url}, utilisation de la méthode standard uniquement`);
            result = await analyzePageStandard(url, timeout);
          }
        } else {
          result = await analyzePageStandard(url, timeout);
        }

        // Enrichir le résultat avec la détection d'une page d'accueil
        result.isHomePage = url === startUrl || url === `${baseUrl}/` || url === baseUrl;

        // Stocker le résultat
        seoResults[url] = result;
        analyzedPagesCount++;

        // Mettre à jour la carte des URLs
        urlMap[url] = result.internalLinks;

        // Extraire et stocker tous les liens pour la prochaine profondeur
        if (currentDepth < maxDepth - 1) {
          // Collecter tous les liens trouvés
          let allLinks = [...result.internalLinks];

          // Filtrer pour ne garder que les liens valides et uniques
          allLinks = allLinks.filter(link => {
            try {
              const linkUrl = new URL(link);
              // Ne visiter que les pages du même domaine si sameDomainOnly est vrai
              return (!sameDomainOnly || linkUrl.hostname === urlObj.hostname) &&
                // Exclure les liens vers des ressources non HTML
                !link.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js|xml)$/i) &&
                // Exclure les liens déjà visités ou dans la file
                !visitedURLs.includes(link) &&
                !urlsToVisit.includes(link) &&
                !nextUrls.includes(link);
            } catch (e) {
              return false; // URL invalide
            }
          });

          // Ajouter les nouveaux liens à la liste des URLs à visiter
          nextUrls.push(...allLinks);
        }

        return result;
      } catch (error) {
        console.error(`Erreur lors de l'analyse de ${url}:`, error);
        // Même en cas d'erreur, considérer l'URL comme visitée
        if (!visitedURLs.includes(url)) {
          visitedURLs.push(url);
        }
        return null;
      }
    });

    await Promise.all(analysisPromises.filter(p => p !== null));

    // Préparer les URLs pour la prochaine profondeur
    urlsToVisit = nextUrls;
    currentDepth++;

    // Si nous avons analysé suffisamment de pages et qu'il n'y a plus d'URLs à visiter
    if (analyzedPagesCount >= MIN_PAGES && urlsToVisit.length === 0) {
      break;
    }
  }

  console.log(`Analyse terminée: ${analyzedPagesCount} pages analysées sur ${visitedURLs.length} URLs visitées`);

  // Si aucune page n'a été analysée avec succès, analyser au moins la page de départ
  if (Object.keys(seoResults).length === 0) {
    console.log("Aucune page analysée avec succès, analyse de la page de départ");
    try {
      const result = await analyzePageStandard(startUrl, timeout);
      seoResults[startUrl] = result;
      urlMap[startUrl] = result.internalLinks;
    } catch (error) {
      console.error(`Erreur lors de l'analyse de la page de départ:`, error);
    }
  }

  // Calculer les statistiques globales
  const summary = calculateSummaryStats(seoResults);

  // Générer un sitemap XML
  const generatedSitemap = generateSitemapXML(Object.keys(seoResults));

  const report: CrawlReport = {
    urlMap,
    visitedURLs,
    seoResults,
    summary,
    generatedSitemap
  };

  console.log(`Audit multi-pages terminé: ${Object.keys(seoResults).length} pages analysées avec succès`);
  return report;
}

/**
 * Analyse une page individuelle avec la méthode standard (sans RapidAPI)
 */
async function analyzePageStandard(url: string, timeout: number): Promise<SEOAuditResult> {
  console.log(`Analyse standard de la page: ${url}`);
  const startTime = Date.now();

  // Récupération du contenu HTML
  const siteResponse = await axios.get(url, {
    timeout,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://devunity.tech)'
    }
  });

  const html = siteResponse.data;
  const loadTime = Date.now() - startTime;

  // Extraire les informations de base avec les fonctions existantes
  const title = extractTitle(html);
  const description = extractMetaDescription(html);
  const headings = extractAllHeadings(html);
  const imageAlt = extractImages(html, url);
  const links = extractLinks(html, url);
  const metaTags = extractMetaTags(html);
  const robotsMeta = extractRobotsMeta(metaTags);
  const socialTags = extractSocialTags(html);
  const structuredData = extractStructuredData(html);
  const viewport = extractViewportMeta(html);
  const wordCount = countWords(html);

  // Récupérer robots.txt et sitemap
  let robotsTxtContent = '';
  let robotsTxtFound = false;
  let sitemapFound = false;
  let sitemapUrl = '';
  let sitemapUrls = 0;

  try {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    const robotsUrl = `${baseUrl}/robots.txt`;

    const robotsResponse = await axios.get(robotsUrl, { timeout: 5000 });
    if (robotsResponse.status === 200) {
      robotsTxtContent = robotsResponse.data;
      robotsTxtFound = true;

      // Extraire l'URL du sitemap du robots.txt
      const sitemapMatches = robotsTxtContent.match(/Sitemap:\s*(.+)/gi);
      if (sitemapMatches && sitemapMatches.length > 0) {
        const sitemapLine = sitemapMatches[0];
        sitemapUrl = sitemapLine.replace(/Sitemap:\s*/i, '').trim();
        sitemapFound = true;

        // Récupérer le contenu du sitemap
        try {
          const sitemapResponse = await axios.get(sitemapUrl, { timeout: 10000 });
          if (sitemapResponse.status === 200) {
            const xmlData = sitemapResponse.data;
            const parser = new XMLParser({ ignoreAttributes: false });
            const parsedXml = parser.parse(xmlData);

            if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
              const sitemaps = Array.isArray(parsedXml.sitemapindex.sitemap)
                ? parsedXml.sitemapindex.sitemap
                : [parsedXml.sitemapindex.sitemap];
              sitemapUrls = sitemaps.length;
            }
            else if (parsedXml.urlset && parsedXml.urlset.url) {
              const urls = Array.isArray(parsedXml.urlset.url)
                ? parsedXml.urlset.url
                : [parsedXml.urlset.url];
              sitemapUrls = urls.length;
            }
          }
        } catch (error) {
          console.error('Erreur lors de l\'analyse du sitemap:', error);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du robots.txt:', error);
  }

  // Analyser les schémas structurés et compter les types
  const schemaTypeCount: Record<string, number> = {};
  for (const schema of structuredData) {
    try {
      if (schema && schema['@type']) {
        const type = schema['@type'];
        if (Array.isArray(type)) {
          type.forEach(t => {
            schemaTypeCount[t] = (schemaTypeCount[t] || 0) + 1;
          });
        } else {
          schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1;
        }
      }
    } catch (error) {
      console.error('Erreur d\'analyse du type de schéma:', error);
    }
  }

  // Construire le résultat
  const result: SEOAuditResult = {
    url,
    title,
    description,
    h1: headings.h1,
    h2: headings.h2,
    h3: headings.h3,
    metaTags,
    robotsMeta,
    imageAlt,
    videoInfo: [],
    loadTime,
    statusCode: siteResponse.status,
    internalLinks: links.internal,
    externalLinks: links.external,
    warnings: [],
    coreWebVitals: {
      FCP: 0,
      LCP: 0,
      TTFB: 0,
      domLoad: loadTime
    },
    headingStructure: {
      h1: headings.h1 || [],
      h2: headings.h2 || [],
      h3: headings.h3 || [],
      h4: headings.h4 || [],
      h5: headings.h5 || [],
      h6: headings.h6 || []
    },
    structuredData,
    socialTags,
    mobileCompatibility: {
      hasViewport: viewport.hasViewport,
      viewportContent: viewport.viewportContent,
      smallTouchTargets: 0
    },
    securityChecks: {
      https: url.startsWith('https'),
      validCertificate: true,
      securityHeaders: []
    },
    links,
    contentStats: {
      wordCount,
      keywordDensity: calculateKeywordDensity(html),
      readabilityScore: calculateReadabilityScore(html)
    },
    technicalSEO: {
      sitemapFound,
      sitemapUrl,
      sitemapUrls,
      robotsTxtFound,
      robotsTxtContent,
      schemaTypeCount
    }
  };

  // Générer les avertissements
  generateStandardWarnings(result);

  return result;
}

function calculateKeywordDensity(html: string): number {
  // Nettoyer le HTML et extraire le texte
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  const words = text.split(/\s+/);

  // Compter la fréquence des mots (en excluant les mots communs)
  const wordFrequency: Record<string, number> = {};
  const commonWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'de', 'à', 'en', 'dans', 'sur', 'pour']);

  words.forEach(word => {
    if (word.length > 2 && !commonWords.has(word)) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });

  // Trouver le mot le plus fréquent et calculer sa densité
  const maxFrequency = Math.max(...Object.values(wordFrequency));
  return (maxFrequency / words.length) * 100;
}

function calculateReadabilityScore(html: string): number {
  // Nettoyer le HTML et extraire le texte
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Compter les phrases
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Compter les mots
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);

  // Compter les syllabes (estimation simple)
  const syllables = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  // Calculer le score de Flesch-Kincaid
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);

  // Normaliser le score entre 0 et 100
  return Math.max(0, Math.min(100, score));
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Compter les voyelles consécutives comme une syllabe
  const vowels = 'aeiouy';
  let count = 0;
  let wasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !wasVowel) {
      count++;
    }
    wasVowel = isVowel;
  }

  // Ajustements pour les règles communes en français
  if (word.endsWith('e')) count--;
  if (word.endsWith('es')) count--;
  if (word.endsWith('ent')) count--;

  return Math.max(1, count);
}

/**
 * Génère des avertissements standards pour un résultat SEO
 */
function generateStandardWarnings(result: SEOAuditResult): void {
  // Reproduire la logique existante
  if (!result.title) {
    result.warnings.push({
      message: 'Titre manquant',
      severity: 'high',
      type: 'title'
    });
  }

  if (!result.description) {
    result.warnings.push({
      message: 'Meta description manquante',
      severity: 'high',
      type: 'description'
    });
  }

  if (result.h1.length === 0) {
    result.warnings.push({
      message: 'Balise H1 manquante',
      severity: 'high',
      type: 'h1'
    });
  }

  if (result.h1.length > 1) {
    result.warnings.push({
      message: 'Plusieurs balises H1 détectées',
      severity: 'medium',
      type: 'h1'
    });
  }

  result.imageAlt.forEach(img => {
    if (!img.alt) {
      result.warnings.push({
        message: `Image sans attribut alt: ${img.src}`,
        severity: 'medium',
        type: 'image'
      });
    }
  });

  if (!result.mobileCompatibility.hasViewport) {
    result.warnings.push({
      message: 'Balise viewport manquante',
      severity: 'high',
      type: 'mobile'
    });
  }

  if (!result.securityChecks.https) {
    result.warnings.push({
      message: 'Site n\'utilisant pas HTTPS',
      severity: 'high',
      type: 'security'
    });
  }

  if (result.socialTags.ogTags.length === 0 && result.socialTags.twitterTags.length === 0) {
    result.warnings.push({
      message: 'Balises pour réseaux sociaux manquantes (Open Graph / Twitter Cards)',
      severity: 'medium',
      type: 'social'
    });
  }
}

/**
 * Calcule les statistiques globales à partir des résultats SEO
 */
function calculateSummaryStats(seoResults: Record<string, SEOAuditResult>): CrawlReport['summary'] {
  const pages = Object.values(seoResults);
  const totalPages = pages.length;

  if (totalPages === 0) {
    return {
      totalPages: 0,
      averageLoadTime: 0,
      totalWarnings: 0,
      missingTitles: 0,
      missingDescriptions: 0,
      missingAltTags: 0,
      averageFCP: 0,
      averageLCP: 0,
      averageTTFB: 0,
      pagesWithStructuredData: 0,
      pagesWithSocialTags: 0,
      mobileCompatiblePages: 0,
      securePages: 0
    };
  }

  let totalLoadTime = 0;
  let totalWarnings = 0;
  let missingTitles = 0;
  let missingDescriptions = 0;
  let missingAltTags = 0;
  let totalFCP = 0;
  let totalLCP = 0;
  let totalTTFB = 0;
  let pagesWithStructuredData = 0;
  let pagesWithSocialTags = 0;
  let mobileCompatiblePages = 0;
  let securePages = 0;

  for (const page of pages) {
    totalLoadTime += page.loadTime;
    totalWarnings += page.warnings.length;

    if (!page.title) missingTitles++;
    if (!page.description) missingDescriptions++;

    missingAltTags += page.imageAlt.filter(img => !img.alt).length;

    totalFCP += page.coreWebVitals.FCP;
    totalLCP += page.coreWebVitals.LCP;
    totalTTFB += page.coreWebVitals.TTFB;

    if (page.structuredData.length > 0) pagesWithStructuredData++;
    if (page.socialTags.ogTags.length > 0 || page.socialTags.twitterTags.length > 0) pagesWithSocialTags++;
    if (page.mobileCompatibility.hasViewport) mobileCompatiblePages++;
    if (page.securityChecks.https) securePages++;
  }

  return {
    totalPages,
    averageLoadTime: totalLoadTime / totalPages,
    totalWarnings,
    missingTitles,
    missingDescriptions,
    missingAltTags,
    averageFCP: totalFCP / totalPages,
    averageLCP: totalLCP / totalPages,
    averageTTFB: totalTTFB / totalPages,
    pagesWithStructuredData,
    pagesWithSocialTags,
    mobileCompatiblePages,
    securePages
  };
}

/**
 * Récupère les URLs du sitemap d'un site
 */
async function getSitemapUrls(baseUrl: string): Promise<string[]> {
  try {
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    console.log(`Tentative de récupération du sitemap: ${sitemapUrl}`);

    const response = await axios.get(sitemapUrl, { timeout: 10000 });
    if (response.status !== 200) {
      return [];
    }

    const xmlData = response.data;
    const parser = new XMLParser({ ignoreAttributes: false });
    const parsedXml = parser.parse(xmlData);

    const urls: string[] = [];

    // Vérifier s'il s'agit d'un sitemap index
    if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
      const sitemaps = Array.isArray(parsedXml.sitemapindex.sitemap)
        ? parsedXml.sitemapindex.sitemap
        : [parsedXml.sitemapindex.sitemap];

      // Récupérer chaque sitemap référencé
      for (const sitemap of sitemaps.slice(0, 3)) { // Limiter à 3 sitemaps pour éviter les surcharges
        if (sitemap.loc) {
          try {
            const subsitemapResponse = await axios.get(sitemap.loc, { timeout: 10000 });
            const subsitemapXml = parser.parse(subsitemapResponse.data);

            if (subsitemapXml.urlset && subsitemapXml.urlset.url) {
              const sitemapUrls = Array.isArray(subsitemapXml.urlset.url)
                ? subsitemapXml.urlset.url
                : [subsitemapXml.urlset.url];

              for (const url of sitemapUrls) {
                if (url.loc) {
                  urls.push(url.loc);
                }
              }
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération du sous-sitemap ${sitemap.loc}:`, error);
          }
        }
      }
    }
    // Vérifier s'il s'agit d'un sitemap simple
    else if (parsedXml.urlset && parsedXml.urlset.url) {
      const sitemapUrls = Array.isArray(parsedXml.urlset.url)
        ? parsedXml.urlset.url
        : [parsedXml.urlset.url];

      for (const url of sitemapUrls) {
        if (url.loc) {
          urls.push(url.loc);
        }
      }
    }

    return urls;
  } catch (error) {
    console.error('Erreur lors de la récupération du sitemap:', error);
    return [];
  }
}

/**
 * Génère un sitemap XML à partir des URLs visitées
 */
function generateSitemapXML(urls: string[]): string {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const url of urls) {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>monthly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>';

  return sitemap;
}

/**
 * Effectue un audit SEO complet en utilisant les API RapidAPI
 */
async function performRapidApiAudit(url: string): Promise<CrawlReport> {
  console.log(`Démarrage de l'analyse RapidAPI pour ${url}`);

  // Récupérer les clés API depuis les variables d'environnement
  const rapidApiKey = process.env.RAPID_API_KEY || '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776';

  // Obtenir les métriques de performance avec la première API
  const performanceMetrics = await getPerformanceMetrics(url, rapidApiKey);
  console.log(`Métriques de performance récupérées: FCP=${performanceMetrics?.firstContentfulPaint || 'N/A'}`);

  // Obtenir l'analyse SEO complète avec la deuxième API
  const seoAnalysis = await getSeoAnalysis(url, rapidApiKey);
  console.log(`Analyse SEO récupérée: ${seoAnalysis.basic?.webtitle?.title || 'Titre non trouvé'}`);

  // Faire une analyse standard pour compléter les informations manquantes
  const standardResult = await analyzePageStandard(url, 30000);

  // Construire le résultat de l'audit en combinant les données
  const result: SEOAuditResult = {
    ...standardResult,
    coreWebVitals: {
      FCP: performanceMetrics?.firstContentfulPaint ? parseInt(performanceMetrics.firstContentfulPaint) : standardResult.coreWebVitals.FCP,
      LCP: performanceMetrics?.largestContentfulPaint ? parseInt(performanceMetrics.largestContentfulPaint) : standardResult.coreWebVitals.LCP,
      TTFB: performanceMetrics?.serverResponseTime ? parseInt(performanceMetrics.serverResponseTime) : standardResult.coreWebVitals.TTFB,
      domLoad: performanceMetrics?.domContentLoadedTime ? parseInt(performanceMetrics.domContentLoadedTime) : standardResult.coreWebVitals.domLoad
    },
    contentStats: {
      ...standardResult.contentStats,
      readabilityScore: performanceMetrics?.readabilityScore ? parseInt(performanceMetrics.readabilityScore) : standardResult.contentStats.readabilityScore
    }
  };

  // Ajouter les informations spécifiques de l'API SEO si disponibles
  if (seoAnalysis.basic) {
    // Mise à jour du titre et de la description si disponibles
    if (seoAnalysis.basic.webtitle?.title) {
      result.title = seoAnalysis.basic.webtitle.title;
    }
    if (seoAnalysis.basic.metadescription?.description) {
      result.description = seoAnalysis.basic.metadescription.description;
    }

    // Mise à jour des headings
    if (seoAnalysis.basic.headings) {
      result.headingStructure = {
        h1: seoAnalysis.basic.headings.h1?.headings || [],
        h2: seoAnalysis.basic.headings.h2?.headings || [],
        h3: seoAnalysis.basic.headings.h3?.headings || [],
        h4: seoAnalysis.basic.headings.h4?.headings || [],
        h5: seoAnalysis.basic.headings.h5?.headings || [],
        h6: seoAnalysis.basic.headings.h6?.headings || []
      };
      result.h1 = result.headingStructure.h1;
      result.h2 = result.headingStructure.h2;
      result.h3 = result.headingStructure.h3;
    }

    // Mise à jour des images
    if (seoAnalysis.basic.images?.data) {
      result.imageAlt = seoAnalysis.basic.images.data.map((src: string) => ({
        src,
        alt: null,
        title: undefined,
        width: '',
        height: '',
        hasDimensions: false
      }));
    }

    // Mise à jour des liens
    if (seoAnalysis.basic.links?.data) {
      const internalLinks: string[] = [];
      const externalLinks: string[] = [];
      const urlObj = new URL(url);
      const baseHost = urlObj.hostname;

      seoAnalysis.basic.links.data.forEach((linkObj: any) => {
        if (linkObj && linkObj.link) {
          try {
            const linkUrl = new URL(linkObj.link, url);
            if (linkUrl.hostname === baseHost) {
              if (!internalLinks.includes(linkUrl.href)) {
                internalLinks.push(linkUrl.href);
              }
            } else {
              if (!externalLinks.includes(linkUrl.href)) {
                externalLinks.push(linkUrl.href);
              }
            }
          } catch (e) {
            // Ignorer les URLs invalides
          }
        }
      });

      result.internalLinks = internalLinks;
      result.externalLinks = externalLinks;
      result.links = { internal: internalLinks, external: externalLinks };
    }

    // Mise à jour des balises sociales
    if (seoAnalysis.basic.ogdata || seoAnalysis.basic.twitterdata) {
      result.socialTags = {
        ogTags: [],
        twitterTags: []
      };

      if (seoAnalysis.basic.ogdata) {
        Object.entries(seoAnalysis.basic.ogdata).forEach(([key, value]) => {
          result.socialTags.ogTags.push({
            property: `og:${key}`,
            content: value as string
          });
        });
      }

      if (seoAnalysis.basic.twitterdata) {
        Object.entries(seoAnalysis.basic.twitterdata).forEach(([key, value]) => {
          result.socialTags.twitterTags.push({
            name: `twitter:${key}`,
            content: value as string
          });
        });
      }
    }

    // Mise à jour des méta tags
    if (seoAnalysis.basic.metakeywords?.keywords) {
      result.metaTags.push({
        name: 'keywords',
        content: seoAnalysis.basic.metakeywords.keywords
      });
    }
  }

  // Ajouter plus d'avertissements basés sur les métriques de performance
  if (performanceMetrics) {
    const warnings = [...result.warnings];

    if (parseInt(performanceMetrics.largestContentfulPaint) > 2500) {
      warnings.push({
        message: 'Largest Contentful Paint (LCP) trop lent (> 2.5s)',
        severity: 'high',
        type: 'performance'
      });
    }

    if (parseInt(performanceMetrics.firstContentfulPaint) > 1000) {
      warnings.push({
        message: 'First Contentful Paint (FCP) trop lent (> 1s)',
        severity: 'medium',
        type: 'performance'
      });
    }

    if (parseInt(performanceMetrics.totalBlockingTime) > 300) {
      warnings.push({
        message: 'Temps de blocage total trop élevé (> 300ms)',
        severity: 'high',
        type: 'performance'
      });
    }

    if (parseFloat(performanceMetrics.cumulativeLayoutShift) > 0.1) {
      warnings.push({
        message: 'Cumulative Layout Shift trop élevé (> 0.1)',
        severity: 'medium',
        type: 'performance'
      });
    }

    result.warnings = warnings;
  }

  // Construire le rapport final
  const urlMap: Record<string, string[]> = {};
  urlMap[url] = result.internalLinks;

  const report: CrawlReport = {
    urlMap,
    visitedURLs: [url],
    seoResults: {
      [url]: result
    },
    summary: {
      totalPages: 1,
      averageLoadTime: result.loadTime,
      totalWarnings: result.warnings.length,
      missingTitles: !result.title ? 1 : 0,
      missingDescriptions: !result.description ? 1 : 0,
      missingAltTags: result.imageAlt.filter(img => !img.alt).length,
      averageFCP: result.coreWebVitals.FCP,
      averageLCP: result.coreWebVitals.LCP,
      averageTTFB: result.coreWebVitals.TTFB,
      pagesWithStructuredData: result.structuredData.length > 0 ? 1 : 0,
      pagesWithSocialTags: (result.socialTags.ogTags.length > 0 || result.socialTags.twitterTags.length > 0) ? 1 : 0,
      mobileCompatiblePages: result.mobileCompatibility.hasViewport ? 1 : 0,
      securePages: result.securityChecks.https ? 1 : 0
    }
  };

  console.log('Audit SEO avec RapidAPI terminé avec succès');
  return report;
}

/**
 * Scrape un domaine complet et analyse toutes les URLs trouvées
 */
async function scrapeDomainAndAnalyze(
  startUrl: string,
  maxUrlsToAnalyze: number,
  useRapidApi: boolean,
  timeout: number
): Promise<CrawlReport> {
  console.log(`Démarrage du scraping complet du domaine pour ${startUrl}`);

  // Extraire le domaine de base
  const urlObj = new URL(startUrl);
  const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
  const baseDomain = urlObj.hostname;

  // Structures de données pour stocker les résultats
  const allUrls: string[] = [];
  const visitedURLs: string[] = [];
  const urlMap: Record<string, string[]> = {};
  const seoResults: Record<string, SEOAuditResult> = {};

  // Récupérer d'abord le sitemap pour avoir une base d'URLs
  console.log("Recherche et analyse du sitemap principal...");
  const sitemapUrls = await getSitemapUrls(baseUrl);
  if (sitemapUrls.length > 0) {
    console.log(`Sitemap trouvé avec ${sitemapUrls.length} URLs`);
    allUrls.push(...sitemapUrls);
  }

  // Chercher des sitemaps supplémentaires courants
  const commonSitemapPaths = [
    "/sitemap_index.xml",
    "/sitemap-index.xml",
    "/sitemap/sitemap.xml",
    "/sitemaps/sitemap.xml",
    "/sitemap_news.xml",
    "/sitemap-news.xml",
    "/sitemap_products.xml",
    "/sitemap-products.xml",
    "/sitemap_categories.xml",
    "/sitemap-categories.xml",
    "/sitemap_pages.xml",
    "/sitemap-pages.xml",
    "/post-sitemap.xml", // WordPress
    "/page-sitemap.xml", // WordPress
    "/product-sitemap.xml", // WooCommerce
    "/category-sitemap.xml", // WordPress
  ];

  // Rechercher des sitemaps additionnels
  for (const sitemapPath of commonSitemapPaths) {
    try {
      const additionalSitemapUrls = await getSitemapUrls(`${baseUrl}${sitemapPath}`);
      if (additionalSitemapUrls.length > 0) {
        console.log(`Sitemap supplémentaire trouvé à ${sitemapPath} avec ${additionalSitemapUrls.length} URLs`);
        allUrls.push(...additionalSitemapUrls);
      }
    } catch (error) {
      // Ignorer les erreurs pour les sitemaps non trouvés
    }
  }

  // Si aucun sitemap n'est trouvé, commencer par crawler la page d'accueil
  if (allUrls.length === 0) {
    console.log("Aucun sitemap trouvé, démarrage du crawl depuis la page d'accueil");
    allUrls.push(startUrl);

    // Ajouter également quelques chemins communs pour accélérer la découverte
    const commonPaths = [
      "/about", "/about-us", "/contact", "/services", "/products", "/blog",
      "/faq", "/privacy-policy", "/terms", "/sitemap", "/news", "/support"
    ];

    commonPaths.forEach(path => {
      allUrls.push(`${baseUrl}${path}`);
    });
  }

  // Supprimer les doublons dans la liste des URLs
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`Total d'URLs uniques à analyser: ${uniqueUrls.length}`);

  // Queue de crawl et ensemble pour suivre les URLs déjà vues
  let crawlQueue = [...uniqueUrls];
  const seenUrls = new Set(uniqueUrls);
  const startTime = Date.now();
  const MAX_CRAWL_TIME = 180000; // 3 minutes maximum pour éviter de bloquer trop longtemps

  // Scraper toutes les URLs jusqu'à atteindre le maximum ou jusqu'à ce que la queue soit vide
  while (crawlQueue.length > 0 && visitedURLs.length < maxUrlsToAnalyze) {
    // Vérifier si on a dépassé le temps maximum
    if (Date.now() - startTime > MAX_CRAWL_TIME) {
      console.log(`Temps maximum de crawl atteint après ${visitedURLs.length} URLs visitées`);
      break;
    }

    // Prendre la prochaine URL de la queue
    const currentUrl = crawlQueue.shift()!;

    if (visitedURLs.includes(currentUrl)) {
      continue; // URL déjà visitée
    }

    console.log(`Analyse de ${visitedURLs.length + 1}/${maxUrlsToAnalyze}: ${currentUrl}`);

    try {
      // Ajouter l'URL à la liste des URLs visitées
      visitedURLs.push(currentUrl);

      // Analyser la page avec l'approche appropriée
      let result: SEOAuditResult;

      if (useRapidApi) {
        try {
          // Essayer d'utiliser RapidAPI
          const rapidApiReport = await performRapidApiAudit(currentUrl);
          result = rapidApiReport.seoResults[currentUrl];

          // Si c'est un succès, ajouter les nouveaux liens à la queue
          result.internalLinks.forEach(link => {
            try {
              const linkUrl = new URL(link);
              // Vérifier que le lien est sur le même domaine
              if (linkUrl.hostname === baseDomain) {
                // Ignorer les fichiers non HTML
                if (!link.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js|xml|ico)$/i) && !seenUrls.has(link)) {
                  crawlQueue.push(link);
                  seenUrls.add(link);
                }
              }
            } catch (error) {
              // Ignorer les URLs invalides
            }
          });
        } catch (error) {
          console.log(`Erreur avec RapidAPI pour ${currentUrl}, utilisation de la méthode standard`);
          result = await analyzePageStandard(currentUrl, timeout);
        }
      } else {
        // Utiliser l'analyse standard uniquement
        result = await analyzePageStandard(currentUrl, timeout);
      }

      // Enrichir avec l'information de page d'accueil
      result.isHomePage = currentUrl === startUrl || currentUrl === `${baseUrl}/` || currentUrl === baseUrl;

      // Stocker le résultat
      seoResults[currentUrl] = result;

      // Mettre à jour la carte des URLs
      urlMap[currentUrl] = result.internalLinks;

      // Ajouter les nouveaux liens internes à la queue de crawl
      result.internalLinks.forEach(link => {
        try {
          const linkUrl = new URL(link);
          // Vérifier que le lien est sur le même domaine
          if (linkUrl.hostname === baseDomain) {
            // Ignorer les fichiers non HTML
            if (!link.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js|xml|ico)$/i) && !seenUrls.has(link)) {
              crawlQueue.push(link);
              seenUrls.add(link);
            }
          }
        } catch (error) {
          // Ignorer les URLs invalides
        }
      });
    } catch (error) {
      console.error(`Erreur lors de l'analyse de ${currentUrl}:`, error);
    }
  }

  // Calculer les statistiques globales
  const summary = calculateSummaryStats(seoResults);

  // Générer un sitemap XML
  const generatedSitemap = generateSitemapXML(Object.keys(seoResults));

  // Trier les URLs selon leur valeur SEO (celles avec le moins d'avertissements en premier)
  const rankedUrls = Object.keys(seoResults).sort((a, b) => {
    const warningsA = seoResults[a].warnings.length;
    const warningsB = seoResults[b].warnings.length;
    return warningsA - warningsB;
  });

  const report: CrawlReport = {
    urlMap,
    visitedURLs,
    seoResults,
    summary,
    generatedSitemap,
    rankedUrls
  };

  console.log(`Scraping complet du domaine terminé: ${Object.keys(seoResults).length} pages analysées`);
  return report;
}

/**
 * Récupère les métriques de performance depuis l'API SEO Master
 */
async function getPerformanceMetrics(url: string, rapidApiKey: string): Promise<any> {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://seo-master-scan-website-analysis-performance-reporting.p.rapidapi.com/analyze?noqueue=1',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'seo-master-scan-website-analysis-performance-reporting.p.rapidapi.com'
      },
      data: {
        url,
        sections: ['performanceMetrics']
      }
    });

    return response.data.content.performanceMetrics;
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques de performance:', error);
    return null;
  }
}

/**
 * Récupère l'analyse SEO complète depuis l'API Website Analyze
 */
async function getSeoAnalysis(url: string, rapidApiKey: string): Promise<any> {
  try {
    // Retirer le protocole (http:// ou https://) de l'URL
    const domain = url.replace(/^https?:\/\//, '');

    const response = await axios({
      method: 'GET',
      url: `https://website-analyze-and-seo-audit-pro.p.rapidapi.com/onpage.php?website=${domain}`,
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'website-analyze-and-seo-audit-pro.p.rapidapi.com'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse SEO:', error);
    return {};
  }
} 