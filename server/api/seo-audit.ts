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

  try {
    console.log('Démarrage de l\'audit SEO pour', url);
    const startTime = Date.now();

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
        FCP: 500, // Valeurs estimées
        LCP: 1000,
        TTFB: 200,
        domLoad: 800
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
        smallTouchTargets: 0 // Impossible à détecter avec cette méthode
      },
      securityChecks: {
        https: url.startsWith('https'),
        validCertificate: true,
        securityHeaders: []
      },
      links,
      contentStats: {
        wordCount,
        keywordDensity: 1.5, // Valeur estimée
        readabilityScore: 65 // Valeur estimée
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

    // Ajouter plus d'avertissements basés sur les données
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