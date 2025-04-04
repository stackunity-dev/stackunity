import axios from 'axios';
import cheerio from 'cheerio';
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
    speedIndex?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
    bootupTime?: number;
    mainThreadWork?: number;
    performanceScore?: number;
    firstContentfulPaintScore?: number;
    speedIndexScore?: number;
    largestContentfulPaintScore?: number;
    interactiveScore?: number;
    totalBlockingTimeScore?: number;
    cumulativeLayoutShiftScore?: number;
  };
  headingStructure: HeadingStructure;
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

interface ImageData {
  src: string;
  alt: string | null;
  title?: string;
  width?: string;
  height?: string;
  hasDimensions: boolean;
}

interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
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

function extractAllHeadings(html: string): HeadingStructure {
  const $ = cheerio.load(html);
  return {
    h1: $('h1').map((_, el) => $(el).text().trim()).get(),
    h2: $('h2').map((_, el) => $(el).text().trim()).get(),
    h3: $('h3').map((_, el) => $(el).text().trim()).get(),
    h4: $('h4').map((_, el) => $(el).text().trim()).get(),
    h5: $('h5').map((_, el) => $(el).text().trim()).get(),
    h6: $('h6').map((_, el) => $(el).text().trim()).get()
  };
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

  // Créer un objet URL pour le baseUrl
  const baseUrlObj = new URL(baseUrl);
  const baseHostname = baseUrlObj.hostname;
  const baseProtocol = baseUrlObj.protocol;
  const basePath = baseUrlObj.pathname.replace(/\/[^/]*$/, '/');

  while ((match = regex.exec(html)) !== null) {
    const imgTag = match[0];

    const srcMatch = imgTag.match(/src=["']([^"']*)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    const titleMatch = imgTag.match(/title=["']([^"']*)["']/i);
    const widthMatch = imgTag.match(/width=["']([^"']*)["']/i);
    const heightMatch = imgTag.match(/height=["']([^"']*)["']/i);

    const src = srcMatch ? srcMatch[1] : '';
    if (!src) continue; // Ignorer les images sans src

    // Construire l'URL complète
    let fullSrc = src;
    try {
      if (src.startsWith('data:')) {
        // Garder les images en base64 telles quelles
        fullSrc = src;
      } else if (src.match(/^(http|https):\/\//)) {
        // URL absolue, la garder telle quelle
        fullSrc = src;
      } else if (src.startsWith('//')) {
        // URL protocol-relative
        fullSrc = `${baseProtocol}${src}`;
      } else if (src.startsWith('/')) {
        // URL root-relative
        fullSrc = `${baseProtocol}//${baseHostname}${src}`;
      } else if (src.startsWith('../')) {
        // URL relative avec ../ - remonter dans l'arborescence
        let tempPath = basePath;
        let tempSrc = src;
        while (tempSrc.startsWith('../')) {
          tempPath = tempPath.replace(/[^/]+\/$/, '');
          tempSrc = tempSrc.substring(3);
        }
        fullSrc = `${baseProtocol}//${baseHostname}${tempPath}${tempSrc}`;
      } else {
        // URL relative simple
        fullSrc = `${baseProtocol}//${baseHostname}${basePath}${src}`;
      }

      // Vérifier que l'URL est valide
      new URL(fullSrc);
    } catch (e) {
      console.error(`URL d'image invalide: ${src} (base: ${baseUrl})`);
      continue; // Ignorer les URLs invalides
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

function extractViewportMeta(html: string): { hasViewport: boolean; viewportContent: string; smallTouchTargets: number; } {
  const $ = cheerio.load(html);
  const viewportMeta = $('meta[name="viewport"]');
  return {
    hasViewport: viewportMeta.length > 0,
    viewportContent: viewportMeta.attr('content') || '',
    smallTouchTargets: 0 // Cette valeur devrait être calculée en analysant les éléments cliquables
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
  const ANALYZE_MULTIPLE_PAGES = options.analyzeMultiplePages === true;
  const SCRAPE_ALL_URLS = options.scrapeAllUrls === true;
  const MAX_URLS_TO_ANALYZE = options.maxUrlsToAnalyze || 20;

  try {
    console.log('Démarrage de l\'audit SEO pour', url, 'avec les options:', {
      analyzeMultiplePages: ANALYZE_MULTIPLE_PAGES,
      scrapeAllUrls: SCRAPE_ALL_URLS,
      maxDepth: MAX_DEPTH,
      maxUrls: MAX_URLS_TO_ANALYZE
    });

    // Scraper toutes les URLs du domaine si demandé
    if (SCRAPE_ALL_URLS) {
      console.log('Mode scraping du domaine activé');
      return await scrapeDomainAndAnalyze(url, MAX_URLS_TO_ANALYZE, USE_RAPID_API, TIMEOUT);
    }

    // Analyser plusieurs pages si demandé
    if (ANALYZE_MULTIPLE_PAGES) {
      console.log('Mode analyse multiple activé');
      return await performMultiPageAudit(url, MAX_DEPTH, SAME_DOMAIN_ONLY, USE_RAPID_API, TIMEOUT, MAX_URLS_TO_ANALYZE);
    }

    // Utiliser RapidAPI pour une seule page
    if (USE_RAPID_API) {
      try {
        console.log('Utilisation de RapidAPI pour une seule page');
        const report = await performRapidApiAudit(url);
        return report;
      } catch (rapidApiError) {
        console.error('Erreur avec RapidAPI, basculement vers la méthode standard:', rapidApiError.message);
      }
    }

    // Analyse standard d'une seule page
    console.log('Analyse standard d\'une seule page');
    const result = await analyzePageStandard(url, TIMEOUT);

    return {
      urlMap: { [url]: result.internalLinks },
      visitedURLs: [url],
      seoResults: { [url]: result },
      summary: calculateSummaryStats({ [url]: result })
    };
  } catch (error: any) {
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
  timeout: number,
  maxUrlsToAnalyze: number = 20
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
  const MIN_PAGES = Math.min(5, maxUrlsToAnalyze);
  let analyzedPagesCount = 0;

  console.log(`Démarrage de l'analyse multi-pages avec profondeur max: ${maxDepth} et limite de ${maxUrlsToAnalyze} pages`);

  // Obtenir d'abord le sitemap si disponible pour prioritiser les URLs
  const sitemapUrls = await getSitemapUrls(baseUrl);
  if (sitemapUrls.length > 0) {
    console.log(`Sitemap trouvé avec ${sitemapUrls.length} URLs`);
    // Prendre les N premières URLs du sitemap pour respecter la limite
    const limitedSitemapUrls = sitemapUrls.slice(0, maxUrlsToAnalyze);
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
      if (analyzedPagesCount < maxUrlsToAnalyze) {
        urlsToVisit.push(`${baseUrl}${path}`);
      }
    });
  }

  // Parcourir le site jusqu'à la profondeur maximale ou jusqu'à atteindre MIN_PAGES
  while ((urlsToVisit.length > 0 && currentDepth < maxDepth) || analyzedPagesCount < MIN_PAGES) {
    if (analyzedPagesCount >= maxUrlsToAnalyze) {
      console.log(`Limite de ${maxUrlsToAnalyze} pages atteinte, arrêt de l'analyse`);
      break;
    }

    console.log(`Analyse de la profondeur ${currentDepth + 1}/${maxDepth} avec ${urlsToVisit.length} URLs à visiter`);
    const nextUrls: string[] = [];

    // Limiter le nombre d'URLs par niveau pour éviter une explosion
    const remainingPages = maxUrlsToAnalyze - analyzedPagesCount;
    const urlsForThisDepth = urlsToVisit.slice(0, Math.min(10, remainingPages));

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
async function analyzePageStandard(url: string, timeout: number = 30000): Promise<SEOAuditResult> {
  try {
    // Récupérer les métriques de performance
    const pageMetrics = await getPerformanceMetrics(url);
    console.log('Métriques de performance récupérées:', pageMetrics);

    // Récupérer l'analyse SEO de base
    const basicAnalysis = await getBasicSeoAnalysis(url);
    console.log('Analyse SEO de base récupérée:', basicAnalysis);

    if (!basicAnalysis) {
      throw new Error('Impossible de récupérer l\'analyse SEO de base');
    }

    // Créer le résultat de l'audit
    const result: SEOAuditResult = {
      url,
      title: basicAnalysis.title.content,
      description: basicAnalysis.meta_description.content,
      h1: basicAnalysis.headings.h1.content ? [basicAnalysis.headings.h1.content] : [],
      h2: [], // Sera rempli à partir des données détaillées
      h3: [], // Sera rempli à partir des données détaillées
      metaTags: [
        { name: 'viewport', content: basicAnalysis.metadata.viewport },
        { name: 'robots', content: basicAnalysis.metadata.robots }
      ],
      robotsMeta: extractRobotsMeta([{ name: 'robots', content: basicAnalysis.metadata.robots }]),
      imageAlt: basicAnalysis.images.data.map(img => ({
        src: img.src,
        alt: img.alt,
        hasDimensions: false // Les dimensions ne sont pas fournies par cette API
      })),
      videoInfo: [],
      loadTime: parseFloat(basicAnalysis.http.responseTime) * 1000, // Convertir en millisecondes
      statusCode: basicAnalysis.http.status,
      internalLinks: basicAnalysis.links.data
        .filter(link => link.href && !link.href.startsWith('http'))
        .map(link => new URL(link.href, url).href),
      externalLinks: basicAnalysis.links.data
        .filter(link => link.href && link.href.startsWith('http'))
        .map(link => link.href),
      warnings: [],
      coreWebVitals: {
        FCP: pageMetrics?.firstContentfulPaint || 0,
        LCP: pageMetrics?.largestContentfulPaint || 0,
        TTFB: pageMetrics?.timeToFirstByte || 0,
        domLoad: pageMetrics?.timeToInteractive || 0,
        speedIndex: pageMetrics?.speedIndex || 0,
        timeToInteractive: pageMetrics?.timeToInteractive || 0,
        totalBlockingTime: pageMetrics?.totalBlockingTime || 0,
        cumulativeLayoutShift: pageMetrics?.cumulativeLayoutShift || 0,
        bootupTime: pageMetrics?.bootupTime || 0,
        mainThreadWork: pageMetrics?.mainThreadWork || 0,
        performanceScore: pageMetrics?.performanceScore || 0,
        firstContentfulPaintScore: pageMetrics?.firstContentfulPaintScore || 0,
        speedIndexScore: pageMetrics?.speedIndexScore || 0,
        largestContentfulPaintScore: pageMetrics?.largestContentfulPaintScore || 0,
        interactiveScore: pageMetrics?.interactiveScore || 0,
        totalBlockingTimeScore: pageMetrics?.totalBlockingTimeScore || 0,
        cumulativeLayoutShiftScore: pageMetrics?.cumulativeLayoutShiftScore || 0
      },
      headingStructure: {
        h1: basicAnalysis.headings.h1.content ? [basicAnalysis.headings.h1.content] : [],
        h2: [], // L'API ne fournit que le compte, pas le contenu
        h3: [], // L'API ne fournit que le compte, pas le contenu
        h4: [], // L'API ne fournit que le compte, pas le contenu
        h5: [], // L'API ne fournit que le compte, pas le contenu
        h6: []  // L'API ne fournit que le compte, pas le contenu
      },
      structuredData: [], // Non fourni par cette API
      socialTags: {
        ogTags: [], // Non fourni par cette API
        twitterTags: [] // Non fourni par cette API
      },
      mobileCompatibility: {
        hasViewport: !!basicAnalysis.metadata.viewport,
        viewportContent: basicAnalysis.metadata.viewport || '',
        smallTouchTargets: 0
      },
      securityChecks: {
        https: basicAnalysis.http.using_https,
        validCertificate: true, // Supposé vrai si la requête a réussi
        securityHeaders: []
      },
      links: {
        internal: basicAnalysis.links.data
          .filter(link => link.href && !link.href.startsWith('http'))
          .map(link => new URL(link.href, url).href),
        external: basicAnalysis.links.data
          .filter(link => link.href && link.href.startsWith('http'))
          .map(link => link.href)
      },
      contentStats: {
        wordCount: basicAnalysis.content.wordCount,
        keywordDensity: 0, // Non fourni par cette API
        readabilityScore: 0 // Non fourni par cette API
      },
      technicalSEO: {
        sitemapFound: false,
        sitemapUrl: '',
        sitemapUrls: 0,
        robotsTxtFound: false,
        robotsTxtContent: '',
        schemaTypeCount: {}
      }
    };

    // Générer les avertissements
    generateStandardWarnings(result);

    return result;
  } catch (error) {
    console.error(`Erreur lors de l'analyse de ${url}:`, error);
    throw error;
  }
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
  const performanceMetrics = await getPerformanceMetrics(url);
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
      domLoad: performanceMetrics?.timeToInteractive || standardResult.coreWebVitals.domLoad,
      speedIndex: performanceMetrics?.speedIndex,
      timeToInteractive: performanceMetrics?.timeToInteractive,
      totalBlockingTime: performanceMetrics?.totalBlockingTime,
      cumulativeLayoutShift: performanceMetrics?.cumulativeLayoutShift,
      bootupTime: performanceMetrics?.bootupTime,
      mainThreadWork: performanceMetrics?.mainThreadWork,
      performanceScore: performanceMetrics?.performanceScore,
      firstContentfulPaintScore: performanceMetrics?.firstContentfulPaintScore,
      speedIndexScore: performanceMetrics?.speedIndexScore,
      largestContentfulPaintScore: performanceMetrics?.largestContentfulPaintScore,
      interactiveScore: performanceMetrics?.interactiveScore,
      totalBlockingTimeScore: performanceMetrics?.totalBlockingTimeScore,
      cumulativeLayoutShiftScore: performanceMetrics?.cumulativeLayoutShiftScore
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

    // Mise à jour des images avec une meilleure gestion
    if (seoAnalysis.basic.images?.data) {
      const images = seoAnalysis.basic.images.data;
      const enhancedImages: ImageData[] = [];

      for (const imgData of images) {
        try {
          let imgSrc = '';
          let imgAlt: string | null = null;
          let imgTitle: string | undefined;
          let imgWidth = '';
          let imgHeight = '';

          // Gérer différents formats de données d'image possibles
          if (typeof imgData === 'string') {
            imgSrc = imgData;
          } else if (typeof imgData === 'object' && imgData !== null) {
            const img = imgData as any;
            imgSrc = img.src || img.url || img.source || '';
            imgAlt = img.alt || img.alternative || null;
            imgTitle = img.title;
            imgWidth = img.width?.toString() || '';
            imgHeight = img.height?.toString() || '';
          }

          // Vérifier et nettoyer l'URL de l'image
          if (imgSrc) {
            try {
              // Construire l'URL complète si nécessaire
              if (!imgSrc.match(/^(http|https|data):/)) {
                const urlObj = new URL(url);
                if (imgSrc.startsWith('//')) {
                  imgSrc = `${urlObj.protocol}${imgSrc}`;
                } else if (imgSrc.startsWith('/')) {
                  imgSrc = `${urlObj.protocol}//${urlObj.hostname}${imgSrc}`;
                } else {
                  imgSrc = new URL(imgSrc, url).href;
                }
              }

              // Vérifier que l'URL est valide
              new URL(imgSrc);

              // Ajouter l'image au résultat
              const imageData: ImageData = {
                src: imgSrc,
                alt: imgAlt,
                hasDimensions: !!(imgWidth && imgHeight)
              };

              if (imgTitle) imageData.title = imgTitle;
              if (imgWidth) imageData.width = imgWidth;
              if (imgHeight) imageData.height = imgHeight;

              enhancedImages.push(imageData);
            } catch (e) {
              console.error(`URL d'image invalide ignorée: ${imgSrc}`);
            }
          }
        } catch (e) {
          console.error('Erreur lors du traitement d\'une image:', e);
        }
      }

      // Fusionner avec les images trouvées par l'analyse standard
      const existingUrls = new Set(result.imageAlt.map(img => img.src));
      const newImages = enhancedImages.filter(img => !existingUrls.has(img.src));
      result.imageAlt = [...result.imageAlt, ...newImages];
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
 * Analyse toutes les pages d'un domaine en les scrapant
 */
async function scrapeDomainAndAnalyze(
  startUrl: string,
  maxUrlsToAnalyze: number,
  useRapidApi: boolean,
  timeout: number
): Promise<CrawlReport> {
  console.log(`Démarrage de l'analyse complète du domaine pour ${startUrl}`);
  const urlObj = new URL(startUrl);
  const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

  // Initialiser les structures de données
  const visitedURLs: string[] = [];
  const urlMap: Record<string, string[]> = {};
  const seoResults: Record<string, SEOAuditResult> = {};
  let urlsToVisit: string[] = [startUrl];
  let analyzedCount = 0;

  // Obtenir d'abord le sitemap si disponible
  const sitemapUrls = await getSitemapUrls(baseUrl);
  if (sitemapUrls.length > 0) {
    console.log(`Sitemap trouvé avec ${sitemapUrls.length} URLs`);
    urlsToVisit = [...new Set([...urlsToVisit, ...sitemapUrls])];
  }

  while (urlsToVisit.length > 0 && analyzedCount < maxUrlsToAnalyze) {
    const currentUrl = urlsToVisit.shift()!;

    if (visitedURLs.includes(currentUrl)) {
      continue;
    }

    console.log(`Analyse de ${currentUrl} (${analyzedCount + 1}/${maxUrlsToAnalyze})`);

    try {
      // Ajouter l'URL à la liste des URLs visitées
      visitedURLs.push(currentUrl);

      // Analyser la page
      let result: SEOAuditResult;
      if (useRapidApi) {
        try {
          const rapidApiReport = await performRapidApiAudit(currentUrl);
          result = rapidApiReport.seoResults[currentUrl];
        } catch (e) {
          console.error(`Erreur avec RapidAPI pour ${currentUrl}, utilisation de la méthode standard`);
          result = await analyzePageStandard(currentUrl, timeout);
        }
      } else {
        result = await analyzePageStandard(currentUrl, timeout);
      }

      // Stocker le résultat
      seoResults[currentUrl] = result;
      analyzedCount++;

      // Mettre à jour la carte des URLs
      urlMap[currentUrl] = result.internalLinks;

      // Ajouter les nouveaux liens internes à la liste des URLs à visiter
      const newUrls = result.internalLinks.filter(link => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === urlObj.hostname &&
            !visitedURLs.includes(link) &&
            !urlsToVisit.includes(link) &&
            !link.match(/\.(jpg|jpeg|png|gif|pdf|zip|css|js|xml)$/i);
        } catch (e) {
          return false;
        }
      });

      urlsToVisit.push(...newUrls);
      console.log(`${newUrls.length} nouvelles URLs trouvées sur ${currentUrl}`);

    } catch (error) {
      console.error(`Erreur lors de l'analyse de ${currentUrl}:`, error);
      // Même en cas d'erreur, considérer l'URL comme visitée
      if (!visitedURLs.includes(currentUrl)) {
        visitedURLs.push(currentUrl);
      }
    }
  }

  console.log(`Analyse terminée: ${analyzedCount} pages analysées sur ${visitedURLs.length} URLs visitées`);

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

  console.log(`Audit SEO avec RapidAPI terminé avec succès`);
  return report;
}

/**
 * Récupère les métriques de performance depuis l'API SEO Master
 */
async function getPerformanceMetrics(url: string): Promise<any> {
  try {
    const startTime = Date.now();

    // Faire une requête directe pour mesurer le TTFB
    const response = await axios.get(url, {
      timeout: 30000,
      validateStatus: () => true, // Accepter tous les codes de statut
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const endTime = Date.now();
    const ttfb = endTime - startTime;

    // Calculer la taille de la réponse
    const contentLength = parseInt(response.headers['content-length'] || '0');
    const actualContentLength = response.data?.length || 0;
    const responseSize = contentLength || actualContentLength;

    // Estimer FCP basé sur TTFB et taille de la réponse
    const estimatedFcp = ttfb + Math.min(responseSize / 1024, 1000); // 1KB/ms max

    // Estimer LCP basé sur FCP
    const estimatedLcp = estimatedFcp * 1.5;

    // Calculer les scores selon les seuils de Core Web Vitals
    const fcpScore = calculateMetricScore(estimatedFcp, 1000, 2500);
    const lcpScore = calculateMetricScore(estimatedLcp, 2500, 4000);
    const ttfbScore = calculateMetricScore(ttfb, 200, 600);

    // Estimer CLS basé sur la présence d'images et de contenu dynamique
    const html = response.data;
    const hasLargeImages = (html.match(/<img[^>]*>/g) || []).length > 5;
    const hasAds = html.includes('advertisement') || html.includes('banner');
    const estimatedCls = hasLargeImages ? 0.15 : (hasAds ? 0.2 : 0.05);
    const clsScore = calculateMetricScore(estimatedCls * 100, 10, 25);

    // Calculer le score de performance global
    const performanceScore = Math.round((fcpScore + lcpScore + ttfbScore + clsScore) / 4);

    return {
      firstContentfulPaint: Math.round(estimatedFcp),
      largestContentfulPaint: Math.round(estimatedLcp),
      timeToFirstByte: Math.round(ttfb),
      speedIndex: Math.round((estimatedFcp + estimatedLcp) / 2),
      timeToInteractive: Math.round(estimatedLcp + 500),
      totalBlockingTime: Math.round(estimatedLcp - estimatedFcp),
      cumulativeLayoutShift: estimatedCls.toFixed(3),
      performanceScore,
      firstContentfulPaintScore: fcpScore,
      largestContentfulPaintScore: lcpScore,
      speedIndexScore: Math.round((fcpScore + lcpScore) / 2),
      totalBlockingTimeScore: Math.round((100 - (estimatedLcp - estimatedFcp) / 10)),
      cumulativeLayoutShiftScore: clsScore,
      serverResponseTime: ttfb
    };
  } catch (error) {
    console.error('Erreur lors du calcul des métriques de performance:', error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      firstContentfulPaint: 1000,
      largestContentfulPaint: 2500,
      timeToFirstByte: 200,
      speedIndex: 1500,
      timeToInteractive: 3000,
      totalBlockingTime: 500,
      cumulativeLayoutShift: 0.1,
      performanceScore: 50,
      firstContentfulPaintScore: 50,
      largestContentfulPaintScore: 50,
      speedIndexScore: 50,
      totalBlockingTimeScore: 50,
      cumulativeLayoutShiftScore: 50,
      serverResponseTime: 200
    };
  }
}

function calculateMetricScore(value: number, good: number, poor: number): number {
  if (value <= good) return 100;
  if (value >= poor) return 0;
  return Math.round(100 - ((value - good) / (poor - good)) * 100);
}

/**
 * Récupère l'analyse SEO complète depuis l'API Website Analyze
 */
async function getSeoAnalysis(url: string, rapidApiKey: string): Promise<any> {
  try {
    const options = {
      method: 'GET',
      url: 'https://website-analyze-and-seo-audit-pro.p.rapidapi.com/onpage.php',
      params: {
        website: url.replace(/^https?:\/\//, '')
      },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'website-analyze-and-seo-audit-pro.p.rapidapi.com'
      }
    };

    const response = await axios(options);

    if (!response.data || !response.data.basic) {
      console.error('Réponse API invalide:', response.data);
      return null;
    }

    const data = response.data;
    const basic = data.basic;

    return {
      basic: {
        webtitle: basic.webtitle || { title: '' },
        metadescription: basic.metadescription || { description: '' },
        metakeywords: basic.metakeywords || { keywords: '' },
        headings: {
          h1: { headings: basic.headings?.h1?.headings || [] },
          h2: { headings: basic.headings?.h2?.headings || [] },
          h3: { headings: basic.headings?.h3?.headings || [] },
          h4: { headings: basic.headings?.h4?.headings || [] },
          h5: { headings: basic.headings?.h5?.headings || [] },
          h6: { headings: basic.headings?.h6?.headings || [] }
        },
        images: {
          data: basic.images?.data || []
        },
        links: {
          data: basic.links?.data || []
        },
        ogdata: basic.ogdata || {},
        twitterdata: basic.twitterdata || {},
        favicon: basic.favicon || '',
        sitemap_robots: basic.sitemap_robots || [],
        iframe: basic.iframe || { count: 0 }
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse SEO:', error);
    return null;
  }
}

async function getBasicSeoAnalysis(url: string): Promise<any> {
  try {
    const options = {
      method: 'GET',
      url: 'https://website-seo-analyzer.p.rapidapi.com/seo/seo-audit-basic',
      params: { url },
      headers: {
        'x-rapidapi-key': '2308627ad7msh84971507d0dce82p1e637fjsn1ee2a06e6776',
        'x-rapidapi-host': 'website-seo-analyzer.p.rapidapi.com'
      }
    };

    const response = await axios(options);

    if (!response.data || !response.data.success) {
      console.error('Réponse API invalide:', response.data);
      return null;
    }

    const result = response.data.result;

    return {
      http: {
        status: result.http.status,
        using_https: result.http.using_https,
        responseTime: result.responseTime
      },
      title: {
        content: result.title.data,
        length: result.title.length
      },
      meta_description: {
        content: result.meta_description.data,
        length: result.meta_description.length
      },
      metadata: {
        charset: result.metadata_info.charset,
        canonical: result.metadata_info.canonical,
        favicon: result.metadata_info.favicon,
        viewport: result.metadata_info.viewport,
        robots: result.metadata_info.robots
      },
      headings: {
        h1: { count: result['Page Headings summary'].H1, content: result['H1 Content'] },
        h2: { count: result['Page Headings summary'].H2 },
        h3: { count: result['Page Headings summary'].H3 },
        h4: { count: result['Page Headings summary'].H4 },
        h5: { count: result['Page Headings summary'].H5 },
        h6: { count: result['Page Headings summary'].H6 }
      },
      links: {
        total: result.links_summary['Total links'],
        external: result.links_summary['External links'],
        internal: result.links_summary.Internal,
        nofollow: result.links_summary['Nofollow count'],
        data: result.links
      },
      images: {
        total: result.images_analysis.summary.total,
        noSrc: result.images_analysis.summary['No src tag'],
        noAlt: result.images_analysis.summary['No alt tag'],
        data: result.images_analysis.data
      },
      content: {
        wordCount: result.word_count.total,
        anchorTextWords: result.word_count['Anchor text words'],
        anchorPercentage: result.word_count['Anchor Percentage']
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'analyse SEO de base:', error);
    return null;
  }
}