import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';
import * as dns from 'dns';
import { createError, defineEventHandler, H3Event, readBody } from 'h3';
import { performance } from 'perf_hooks';
import { promisify } from 'util';
import type { CheerioSelector, ExtendedResponse, SiteAnalysisResult, StructuredData, WebsiteAnalysisResult } from './analyzer-types';

const dnsResolve = promisify(dns.resolve);
const dnsReverse = promisify(dns.reverse);

interface Page {
  evaluateOnNewDocument: (fn: () => void) => Promise<void>;
  goto: (url: string, options?: { waitUntil: string }) => Promise<any>;
  evaluate: <T>(fn: () => T) => Promise<T>;
}

async function analyzePerformance(url: string, page: Page): Promise<WebsiteAnalysisResult['performance']> {
  const startTime = performance.now();

  await page.evaluateOnNewDocument(() => {
    window.performance.setResourceTimingBufferSize(500);
  });

  const response = await page.goto(url, { waitUntil: 'networkidle0' });
  const loadTime = performance.now() - startTime;

  const performanceMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation' as any)[0];
    const paint = performance.getEntriesByType('paint' as any);
    const resources = performance.getEntriesByType('resource' as any);

    const resourceStats = {
      html: { time: 0, size: 0 },
      css: { time: 0, size: 0 },
      js: { time: 0, size: 0 },
      images: { time: 0, size: 0 },
      other: { time: 0, size: 0 }
    };

    resources.forEach((resource) => {
      const url = resource.name;
      const duration = resource.duration;
      const size = (resource as PerformanceResourceTiming).transferSize;

      if (url.endsWith('.css')) {
        resourceStats.css.time += duration;
        resourceStats.css.size += size;
      } else if (url.endsWith('.js')) {
        resourceStats.js.time += duration;
        resourceStats.js.size += size;
      } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        resourceStats.images.time += duration;
        resourceStats.images.size += size;
      } else {
        resourceStats.other.time += duration;
        resourceStats.other.size += size;
      }
    });

    return {
      ttfb: (navigation as PerformanceNavigationTiming).responseStart - (navigation as PerformanceNavigationTiming).requestStart,
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      resourceStats
    };
  });

  const cls = await page.evaluate(() => {
    let clsValue = 0;
    let firstFrame = true;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!firstFrame) {
          clsValue += (entry as any).value;
        }
        firstFrame = false;
      }
    }).observe({ entryTypes: ['layout-shift'] });

    return clsValue;
  });

  const totalSize = Object.values(performanceMetrics.resourceStats).reduce((acc, curr: any) => acc + curr.size, 0);

  return {
    ttfb: performanceMetrics.ttfb,
    fcp: performanceMetrics.fcp,
    lcp: performanceMetrics.fcp * 1.5, // Estimation
    cls,
    speedIndex: performanceMetrics.fcp * 0.8, // Estimation
    totalBlockingTime: loadTime - performanceMetrics.fcp,
    loadTime,
    resourceLoadTimes: {
      total: loadTime,
      html: performanceMetrics.resourceStats.html.time,
      css: performanceMetrics.resourceStats.css.time,
      js: performanceMetrics.resourceStats.js.time,
      images: performanceMetrics.resourceStats.images.time,
      other: performanceMetrics.resourceStats.other.time
    },
    resourceSizes: {
      total: totalSize,
      html: performanceMetrics.resourceStats.html.size,
      css: performanceMetrics.resourceStats.css.size,
      js: performanceMetrics.resourceStats.js.size,
      images: performanceMetrics.resourceStats.images.size,
      other: performanceMetrics.resourceStats.other.size
    }
  };
}

async function analyzeSEO(url: string, html: string, $: ReturnType<typeof cheerioLoad>): Promise<WebsiteAnalysisResult['seo']> {
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || url;

  const headings = {
    h1: $('h1').map((_, el) => $(el).text().trim()).get(),
    h2: $('h2').map((_, el) => $(el).text().trim()).get(),
    h3: $('h3').map((_, el) => $(el).text().trim()).get(),
    h4: $('h4').map((_, el) => $(el).text().trim()).get(),
    h5: $('h5').map((_, el) => $(el).text().trim()).get(),
    h6: $('h6').map((_, el) => $(el).text().trim()).get()
  };

  const images = {
    total: $('img').length,
    withAlt: $('img[alt]').length,
    withoutAlt: $('img:not([alt])').length,
    data: await Promise.all($('img').map(async (_, el) => {
      const $img = $(el);
      const src = $img.attr('src') || '';
      const size = await getImageSize(src);
      console.log("HEREEEEEE", size);

      const parentElement = $img.closest('a');
      const parentLink = parentElement.length ? parentElement.attr('href') : '';

      console.log("HEREEEEEE", parentLink);
      console.log("HEREEEEEE", $img);
      console.log("HEREEEEEE", $img.attr('alt'));
      console.log("HEREEEEEE", $img.attr('title'));
      console.log("HEREEEEEE", $img.attr('width'));
      console.log("HEREEEEEE", $img.attr('height'));

      return {
        src,
        size,
        alt: $img.attr('alt') || '',
        title: $img.attr('title') || '',
        dimensions: {
          width: parseInt($img.attr('width') || '0'),
          height: parseInt($img.attr('height') || '0')
        }
      };
    }).get())
  };

  console.log("HEREEEEEE", images);

  const links = {
    internal: [] as string[],
    external: [] as string[],
    broken: [] as string[],
    nofollow: [] as string[]
  };

  const enhancedLinks = {
    internal: [] as Array<{ href: string, text: string, hasImage: boolean }>,
    external: [] as Array<{ href: string, text: string, hasImage: boolean }>
  };

  const urlObj = new URL(url);
  const baseHost = urlObj.hostname;

  $('a').each((_, el) => {
    const $link = $(el);
    const href = $link.attr('href');
    const rel = $link.attr('rel');
    const text = $link.text().trim();
    const hasImage = $link.find('img').length > 0;

    if (href) {
      try {
        const linkUrl = new URL(href, url);

        if (linkUrl.hostname === baseHost) {
          links.internal.push(href);
          enhancedLinks.internal.push({ href, text: text || (hasImage ? '[Image]' : ''), hasImage });
        } else {
          links.external.push(href);
          enhancedLinks.external.push({ href, text: text || (hasImage ? '[Image]' : ''), hasImage });
        }

        if (rel?.includes('nofollow')) {
          links.nofollow.push(href);
        }
      } catch (e) {
        links.broken.push(href);
      }
    }
  });

  const structuredData = {
    data: [],
    count: 0,
    types: {} as Record<string, number>
  };

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html() || '{}';
      const data = JSON.parse(content);
      if (data && typeof data === 'object' && '@type' in data) {
        const structuredData = data as StructuredData;
        (structuredData.data as StructuredData[]).push(structuredData);
        structuredData.count++;
        const type = structuredData['@type'];
        if (Array.isArray(type)) {
          type.forEach(t => {
            structuredData.types[t] = (structuredData.types[t] || 0) + 1;
          });
        } else {
          structuredData.types[type] = (structuredData.types[type] || 0) + 1;
        }
      }
    } catch (e) {
      console.error('Erreur parsing JSON-LD:', e);
    }
  });

  const socialTags = {
    openGraph: {} as Record<string, string>,
    twitter: {} as Record<string, string>
  };

  $('meta').each((_, el) => {
    const $meta = $(el);
    const property = $meta.attr('property');
    const name = $meta.attr('name');
    const content = $meta.attr('content');

    if (property?.startsWith('og:') && content) {
      socialTags.openGraph[property.replace('og:', '')] = content;
    } else if (name?.startsWith('twitter:') && content) {
      socialTags.twitter[name.replace('twitter:', '')] = content;
    }
  });

  const text = $('body').text().trim();
  const textToHtmlRatio = text.length / html.length;

  const wordCount = text.split(/\s+/).length;

  const readabilityScore = calculateReadabilityScore(text);

  const keywordDensity = calculateKeywordDensity(text);

  return {
    title,
    description: metaDescription,
    headings,
    images,
    links,
    structuredData,
    meta: {
      viewport: $('meta[name="viewport"]').attr('content') || false,
      robots: $('meta[name="robots"]').attr('content'),
      canonical: canonicalUrl,
      og: socialTags.openGraph,
      twitter: socialTags.twitter
    },
    wordCount,
    readabilityScore,
    keywordDensity: {}
  };
}

async function analyzeTechnical(url: string, response: ExtendedResponse, $: CheerioSelector, html: string): Promise<WebsiteAnalysisResult['technical']> {
  const headers = response.headers;

  return {
    statusCode: response.status || 200,
    https: url.startsWith('https'),
    mobile: {
      viewport: $('meta[name="viewport"]').length > 0,
      responsive: checkResponsiveness($)
    },
    security: {
      headers: headers as Record<string, string>,
      certificate: url.startsWith('https')
    }
  };
}

export default defineEventHandler(async (event: H3Event): Promise<SiteAnalysisResult> => {
  try {
    const body = await readBody(event);
    const { url, maxPages = 50, focusOnContact = false, checkSitemap = true, checkRobotsTxt = true } = body;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL requise'
      });
    }

    console.log(`Démarrage de l'analyse pour: ${url}, options:`, JSON.stringify({
      maxPages,
      focusOnContact,
      checkSitemap,
      checkRobotsTxt
    }, null, 2));

    try {
      new URL(url);
    } catch (urlError) {
      throw createError({
        statusCode: 400,
        message: 'URL invalide'
      });
    }

    let urls: string[] = [];
    try {
      urls = await crawlWebsite(url, maxPages);
      console.log(`Analyse de ${urls.length} pages...`);
    } catch (crawlError) {
      console.error('Erreur lors du crawl:', crawlError);
      urls = [url];
    }

    let prioritizedUrls = [...urls];
    if (focusOnContact) {
      const contactKeywords = ['contact', 'about', 'nous', 'about-us', 'a-propos'];
      prioritizedUrls = urls.sort((a, b) => {
        try {
          const aIsContact = contactKeywords.some(keyword => a.toLowerCase().includes(keyword));
          const bIsContact = contactKeywords.some(keyword => b.toLowerCase().includes(keyword));
          if (aIsContact && !bIsContact) return -1;
          if (!aIsContact && bIsContact) return 1;
          return 0;
        } catch (e) {
          console.error('Erreur lors du tri des URLs:', e);
          return 0;
        }
      });

      prioritizedUrls = prioritizedUrls.slice(0, Math.min(5, prioritizedUrls.length));
    }

    const results: Record<string, WebsiteAnalysisResult> = {};
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

    const pagesToAnalyze = prioritizedUrls.slice(0, Math.min(5, prioritizedUrls.length));
    console.log('Pages à analyser prioritairement:', pagesToAnalyze);

    for (const pageUrl of pagesToAnalyze) {
      try {
        console.log(`Analyse de la page: ${pageUrl}`);
        const result = await analyzeWebsite(pageUrl);
        results[pageUrl] = result;

        totalLoadTime += result.performance.loadTime;
        totalWarnings += result.issues.length;
        if (!result.seo.title) missingTitles++;
        if (!result.seo.description) missingDescriptions++;
        missingAltTags += result.seo.images.withoutAlt;
        totalFCP += result.performance.fcp;
        totalLCP += result.performance.lcp;
        totalTTFB += result.performance.ttfb;
        if (result.seo.structuredData.count > 0) pagesWithStructuredData++;
        if (Object.keys(result.seo.meta.og).length > 0 || Object.keys(result.seo.meta.twitter).length > 0) {
          pagesWithSocialTags++;
        }
        if (result.technical.mobile.viewport) mobileCompatiblePages++;
        if (result.technical.https) securePages++;
      } catch (pageError) {
        console.error(`Erreur lors de l'analyse de ${pageUrl}:`, pageError);
      }
    }

    if (Object.keys(results).length === 0) {
      console.log('Aucun résultat d\'analyse disponible, création d\'un résultat de secours');
      try {
        const fallbackResult = await createFallbackResult(url);
        results[url] = fallbackResult;
      } catch (fallbackError) {
        console.error('Erreur lors de la création du résultat de secours:', fallbackError);
        throw createError({
          statusCode: 500,
          message: 'Impossible d\'analyser le site'
        });
      }
    }

    const pageCount = Object.keys(results).length || 1;

    let extractedContactInfo: Record<string, string> = {};
    try {
      if (focusOnContact) {
        for (const pageUrl of Object.keys(results).slice(0, 2)) {
          try {
            const contactInfo = await findContactInfo(url, Object.keys(results));
            if (Object.keys(contactInfo).length > 0) {
              extractedContactInfo = contactInfo;
              break;
            }
          } catch (contactError) {
            console.error(`Erreur lors de l'extraction des informations de contact de ${pageUrl}:`, contactError);
          }
        }
      }
    } catch (contactError) {
      console.error('Erreur lors de l\'extraction des informations de contact:', contactError);
    }

    const imagesData: Record<string, any> = {};
    for (const [url, result] of Object.entries(results)) {
      if (result && result.seo && result.seo.images) {
        console.log(`Extraction des images pour ${url}:`, JSON.stringify(result.seo.images, null, 2));
        imagesData[url] = {
          images: result.seo.images
        };
      }
    }

    const sitemap = checkSitemap ? generateSitemap(urls, imagesData) : '';

    return {
      urlMap: { [url]: urls },
      visitedURLs: urls,
      seoResults: results,
      summary: {
        totalPages: pageCount,
        averageLoadTime: totalLoadTime / pageCount,
        totalWarnings,
        missingTitles,
        missingDescriptions,
        missingAltTags,
        averageFCP: totalFCP / pageCount,
        averageLCP: totalLCP / pageCount,
        averageTTFB: totalTTFB / pageCount,
        pagesWithStructuredData,
        pagesWithSocialTags,
        mobileCompatiblePages,
        securePages
      },
      generatedSitemap: sitemap,
      rankedUrls: rankPages(results),
      schemaOrg: {
        contactInfo: extractedContactInfo
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    throw createError({
      statusCode: 500,
      message: `Erreur lors de l'analyse du site: ${error.message || 'Erreur inconnue'}`
    });
  }
});

async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const startTime = performance.now();
  const response = await axios.get(url);
  const loadTime = performance.now() - startTime;
  const html = response.data;
  const $ = cheerioLoad(html);

  const performanceData = {
    ttfb: loadTime * 0.2,
    fcp: loadTime * 0.4,
    lcp: loadTime * 0.6,
    cls: 0.1,
    speedIndex: loadTime * 0.5,
    totalBlockingTime: loadTime * 0.3,
    loadTime,
    resourceLoadTimes: {
      total: loadTime,
      html: loadTime * 0.1,
      css: loadTime * 0.2,
      js: loadTime * 0.3,
      images: loadTime * 0.2,
      other: loadTime * 0.2
    },
    resourceSizes: {
      total: response.data.length,
      html: response.data.length,
      css: 0,
      js: 0,
      images: 0,
      other: 0
    }
  };

  const imagesData = analyzeImages($);

  const linksData = analyzeLinks($, url);

  const seoData = {
    title: $('title').text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    headings: {
      h1: $('h1').map((_, el) => $(el).text().trim()).get() as string[],
      h2: $('h2').map((_, el) => $(el).text().trim()).get() as string[],
      h3: $('h3').map((_, el) => $(el).text().trim()).get() as string[],
      h4: $('h4').map((_, el) => $(el).text().trim()).get() as string[],
      h5: $('h5').map((_, el) => $(el).text().trim()).get() as string[],
      h6: $('h6').map((_, el) => $(el).text().trim()).get() as string[]
    },
    images: imagesData,
    links: {
      internal: linksData.internal,
      external: linksData.external,
      broken: [] as string[],
      nofollow: [] as string[]
    },
    meta: {
      viewport: $('meta[name="viewport"]').attr('content') || false,
      robots: $('meta[name="robots"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
      og: {} as Record<string, string>,
      twitter: {} as Record<string, string>
    },
    wordCount: $('body').text().trim().split(/\s+/).length,
    readabilityScore: calculateReadabilityScore($('body').text()),
    keywordDensity: calculateKeywordDensity($('body').text()),
    structuredData: {
      data: [] as StructuredData[],
      count: 0,
      types: {} as Record<string, number>
    }
  };

  $('meta').each((_, el) => {
    const $meta = $(el);
    const property = $meta.attr('property');
    const name = $meta.attr('name');
    const content = $meta.attr('content');

    if (property?.startsWith('og:') && content) {
      seoData.meta.og[property.replace('og:', '')] = content;
    } else if (name?.startsWith('twitter:') && content) {
      seoData.meta.twitter[name.replace('twitter:', '')] = content;
    }
  });

  $('a[rel*="nofollow"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      seoData.links.nofollow.push(href);
    }
  });

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html() || '{}';
      const data = JSON.parse(content);
      if (data && typeof data === 'object' && '@type' in data) {
        const structuredData = data as StructuredData;
        (seoData.structuredData.data as StructuredData[]).push(structuredData);
        seoData.structuredData.count++;
        const type = structuredData['@type'];
        if (Array.isArray(type)) {
          type.forEach(t => {
            seoData.structuredData.types[t] = (seoData.structuredData.types[t] || 0) + 1;
          });
        } else {
          seoData.structuredData.types[type] = (seoData.structuredData.types[type] || 0) + 1;
        }
      }
    } catch (e) {
      console.error('Erreur parsing JSON-LD:', e);
    }
  });

  const technicalData = {
    statusCode: response.status,
    https: url.startsWith('https'),
    mobile: {
      viewport: $('meta[name="viewport"]').length > 0,
      responsive: checkResponsiveness($)
    },
    security: {
      headers: response.headers as Record<string, string>,
      certificate: url.startsWith('https')
    }
  };

  const urlObj = new URL(url);
  const isRootUrl = urlObj.pathname === '/' || urlObj.pathname === '';
  let technicalSEO: WebsiteAnalysisResult['technicalSEO'] | undefined = undefined;

  if (isRootUrl) {
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;

    const sitemapStatus = await checkSitemap(baseUrl);

    const robotsTxtStatus = await checkRobotsTxt(baseUrl);

    technicalSEO = {
      sitemapFound: sitemapStatus.found,
      sitemapUrl: sitemapStatus.url,
      sitemapUrls: sitemapStatus.urls,
      robotsTxtFound: robotsTxtStatus.found,
      robotsTxtContent: robotsTxtStatus.content,
      schemaTypeCount: seoData.structuredData.types
    };
  }

  const issues: WebsiteAnalysisResult['issues'] = [];

  if (!seoData.title) {
    issues.push({
      type: 'error',
      message: 'Titre manquant',
      code: 'NO_TITLE'
    });
  }

  if (!seoData.description) {
    issues.push({
      type: 'warning',
      message: 'Description meta manquante',
      code: 'NO_META_DESC'
    });
  }

  if (seoData.images.withoutAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${seoData.images.withoutAlt} image(s) sans attribut alt`,
      code: 'MISSING_ALT'
    });
  }

  if (performanceData.loadTime > 3000) {
    issues.push({
      type: 'warning',
      message: 'Temps de chargement élevé',
      code: 'HIGH_LOAD_TIME'
    });
  }

  let contactInfo: Record<string, string> = {};
  try {
    contactInfo = await findContactInfo(url, linksData.internal);
    console.log('Informations de contact trouvées:', contactInfo);
  } catch (error) {
    console.error('Erreur lors de la recherche des informations de contact:', error);
  }

  const schemaData = analyzeSchemaOrg(url, html, $, seoData as any, contactInfo);

  const result: ExtendedWebsiteAnalysisResult = {
    url,
    performance: performanceData,
    seo: seoData as any,
    technical: technicalData,
    technicalSEO: technicalSEO,
    schemaOrg: schemaData,
    issues
  };

  const endTime = performance.now();
  return result;
}

function analyzeImages($: CheerioSelector) {
  console.log("Analyzing images...");
  const images = $('img').map((_, el) => {
    const $img = $(el);
    const src = $img.attr('src') || '';
    const alt = $img.attr('alt');
    const title = $img.attr('title');
    const widthAttr = $img.attr('width');
    const heightAttr = $img.attr('height');

    const width = widthAttr ? parseInt(widthAttr) : undefined;
    const height = heightAttr ? parseInt(heightAttr) : undefined;

    return {
      src,
      alt,
      title,
      dimensions: {
        width,
        height
      },
      hasDimensions: !!(width || height)
    };
  }).get();

  const withAlt = images.filter(img => !!img.alt).length;
  const withoutAlt = images.filter(img => !img.alt).length;


  return {
    total: images.length,
    withAlt,
    withoutAlt,
    data: images
  };
}

function analyzeLinks($: CheerioSelector, baseUrl: string) {
  const internal: string[] = [];
  const external: string[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {
      if (href.startsWith('http')) {
        if (href.includes(new URL(baseUrl).hostname)) {
          internal.push(href);
        } else {
          external.push(href);
        }
      } else if (href.startsWith('/')) {
        internal.push(new URL(href, baseUrl).href);
      }
    }
  });

  return { internal, external };
}

function extractStructuredData($: CheerioSelector) {
  const data: Record<string, any>[] = [];
  const types: Record<string, number> = {};

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = JSON.parse($(el).html() || '{}');
      data.push(content);
      if (content['@type']) {
        const type = content['@type'];
        if (Array.isArray(type)) {
          type.forEach(t => {
            types[t] = (types[t] || 0) + 1;
          });
        } else {
          types[type] = (types[type] || 0) + 1;
        }
      }
    } catch (e) {
      console.error('Erreur parsing JSON-LD:', e);
    }
  });

  return {
    data,
    count: data.length,
    types
  };
}

function extractMetaTags($: CheerioSelector) {
  const viewport = $('meta[name="viewport"]').attr('content');
  return {
    viewport: viewport || false,
    robots: $('meta[name="robots"]').attr('content'),
    canonical: $('link[rel="canonical"]').attr('href'),
    og: extractSocialTags($, 'og'),
    twitter: extractSocialTags($, 'twitter')
  };
}

function extractSocialTags($: CheerioSelector, prefix: string) {
  const tags: Record<string, string> = {};
  $(`meta[property^="${prefix}:"]`).each((_, el) => {
    const property = $(el).attr('property')?.replace(`${prefix}:`, '');
    if (property) {
      tags[property] = $(el).attr('content') || '';
    }
  });
  return tags;
}

function analyzeContent($: CheerioSelector) {
  const text = $('body').text().trim();
  const words = text.split(/\s+/);
  const wordCount = words.length;

  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    word = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (word.length > 3) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  return {
    wordCount,
    textHtmlRatio: text.length / ($('body').html() || '').length,
    readabilityScore: calculateReadabilityScore(text),
    keywords: Object.entries(wordFreq)
      .map(([word, count]) => ({
        word,
        count,
        density: count / wordCount
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  };
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = countSyllables(text);

  return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
}

function countSyllables(text: string): number {
  return text.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[^aeiouy]+/g, ' ')
    .trim()
    .split(' ')
    .length;
}

function generateIssues(result: WebsiteAnalysisResult) {
  const issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    code: string;
  }> = [];

  if (!result.seo.title) {
    issues.push({
      type: 'error',
      message: 'Titre manquant',
      code: 'NO_TITLE'
    });
  }
  if (!result.seo.description) {
    issues.push({
      type: 'warning',
      message: 'Description meta manquante',
      code: 'NO_META_DESC'
    });
  }
  if (result.seo.headings.h1.length === 0) {
    issues.push({
      type: 'error',
      message: 'H1 manquant',
      code: 'NO_H1'
    });
  }

  const imagesWithoutAlt = result.seo.images.data.filter(img => !img.alt).length;
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${imagesWithoutAlt} image(s) sans attribut alt`,
      code: 'MISSING_ALT'
    });
  }

  if (result.performance.loadTime > 3000) {
    issues.push({
      type: 'warning',
      message: 'Temps de chargement élevé',
      code: 'HIGH_LOAD_TIME'
    });
  }

  if (!result.technical.https) {
    issues.push({
      type: 'warning',
      message: 'Site non sécurisé (pas de HTTPS)',
      code: 'NO_HTTPS'
    });
  }
  if (!result.technical.mobile.viewport) {
    issues.push({
      type: 'error',
      message: 'Viewport meta tag manquant pour mobile',
      code: 'NO_VIEWPORT'
    });
  }

  return issues;
}

async function getImageSize(url: string): Promise<number> {
  try {
    const response = await axios.head(url);
    console.log("HEREEEEEE", response.headers['content-length'], response);
    return parseInt(response.headers['content-length'] || '0');
  } catch {
    return 0;
  }
}

function checkResponsiveness($: CheerioSelector): boolean {
  return $('meta[name="viewport"]').length > 0 &&
    $('img[srcset], picture, source[srcset]').length > 0;
}

function checkTouchTargets($: CheerioSelector): boolean {
  const minSize = 44;
  let validTargets = true;

  $('a, button, [role="button"], input, select, textarea').each((_, el) => {
    const $el = $(el);
    const width = parseInt($el.css('width')) || 0;
    const height = parseInt($el.css('height')) || 0;

    if (width < minSize || height < minSize) {
      validTargets = false;
      return false;
    }
  });

  return validTargets;
}

function checkFontSizes($: CheerioSelector): boolean {
  const minFontSize = 16;
  let validFonts = true;

  $('*').each((_, el) => {
    const $el = $(el);
    const fontSize = parseInt($el.css('font-size')) || 16;

    if (fontSize < minFontSize) {
      validFonts = false;
      return false;
    }
  });

  return validFonts;
}

function checkAriaLabels($: CheerioSelector): boolean {
  const interactiveElements = $('button, a, input, select, textarea, [role]');
  let hasLabels = true;

  interactiveElements.each((_, el) => {
    const $el = $(el);
    if (!$el.attr('aria-label') && !$el.attr('aria-labelledby')) {
      hasLabels = false;
      return false;
    }
  });

  return hasLabels;
}

function checkAltTexts($: CheerioSelector): boolean {
  const images = $('img');
  let hasAlt = true;

  images.each((_, el) => {
    const $el = $(el);
    if (!$el.attr('alt')) {
      hasAlt = false;
      return false;
    }
  });

  return hasAlt;
}

function findDeprecatedTags($: CheerioSelector): string[] {
  const deprecatedTags = ['font', 'center', 'strike', 'marquee', 'frame', 'frameset'];
  const found: string[] = [];

  deprecatedTags.forEach(tag => {
    if ($(tag).length > 0) {
      found.push(tag);
    }
  });

  return found;
}

function getDoctype(html: string): string {
  const match = html.match(/<!DOCTYPE[^>]*>/i);
  return match ? match[0] : 'No DOCTYPE found';
}

function getEncoding($: CheerioSelector): string {
  return $('meta[charset]').attr('charset') ||
    $('meta[http-equiv="Content-Type"]').attr('content')?.match(/charset=([^;]*)/)?.[1] ||
    'Unknown';
}

async function resolveHostIP(url: string): Promise<string> {
  try {
    const hostname = new URL(url).hostname;
    const addresses = await dnsResolve(hostname);
    return addresses[0] || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

interface SchemaOrgSuggestion {
  type: string;
  properties: Record<string, any>;
  template: string;
}

interface SchemaOrg {
  suggestions: SchemaOrgSuggestion[];
}

interface ExtendedWebsiteAnalysisResult extends WebsiteAnalysisResult {
  schemaOrg: SchemaOrg;
}

function analyzeSchemaOrg(url: string, html: string, $: CheerioSelector, seo: any, contactInfo: Record<string, string> = {}): any {
  try {
    const existing = seo.structuredData || [];
    const suggestions: SchemaOrgSuggestion[] = [];

    const escapeJsonString = (str: string): string => {
      if (!str) return '';
      try {
        return str
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
      } catch (e) {
        console.error('Erreur lors de l\'échappement de chaîne JSON:', e);
        return '';
      }
    };

    try {
      if ($('body').text().toLowerCase().includes('entreprise') ||
        $('body').text().toLowerCase().includes('société') ||
        $('body').text().toLowerCase().includes('company')) {

        let orgName = '';
        try {
          orgName = $('meta[property="og:site_name"]').attr('content') || '';

          if (!orgName) {
            const titleParts = seo.title ? seo.title.split(/[|,-]/) : [];
            orgName = titleParts.length > 1 ? titleParts[1]?.trim() : '';
          }

          if (contactInfo?.name && !orgName) {
            orgName = contactInfo.name;
          }
        } catch (e) {
          console.error('Erreur lors de l\'extraction du nom de l\'organisation:', e);
        }

        let logo = '';
        try {
          logo = $('link[rel="icon"]').attr('href') || '';
        } catch (e) {
          console.error('Erreur lors de l\'extraction du logo:', e);
        }

        let phone = '';
        try {
          const phoneMatch = $('body').text().match(/(\+\d{1,3}[-\.\s]??)?\(?\d{3}\)?[-\.\s]??\d{3}[-\.\s]??\d{4}/);
          phone = phoneMatch ? phoneMatch[0] : '';

          if (contactInfo?.telephone && !phone) {
            phone = contactInfo.telephone;
          }
        } catch (e) {
          console.error('Erreur lors de l\'extraction du téléphone:', e);
        }

        const properties: Record<string, any> = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": escapeJsonString(orgName || 'Organisation'),
          "url": url
        };

        if (logo) {
          try {
            properties.logo = new URL(logo, url).toString();
          } catch (e) {
            console.error('URL de logo invalide:', logo);
          }
        }

        if (phone) {
          properties.telephone = escapeJsonString(phone);
        }

        if (contactInfo?.email) {
          properties.email = escapeJsonString(contactInfo.email);
        }

        if (contactInfo?.address) {
          properties.address = {
            "@type": "PostalAddress",
            "streetAddress": escapeJsonString(contactInfo.address)
          };
        }

        try {
          const template = `<script type="application/ld+json">\n${JSON.stringify(properties, null, 2)}\n</script>`;

          suggestions.push({
            type: 'Organization',
            properties,
            template
          });
        } catch (e) {
          console.error('Erreur lors de la génération du template JSON pour Organization:', e);
        }
      }
    } catch (orgError) {
      console.error('Erreur lors de l\'analyse des données Organization:', orgError);
    }

    try {
      const websiteProperties: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": escapeJsonString(seo.title || 'Site web'),
        "description": escapeJsonString(seo.description || ''),
        "url": url
      };

      if (contactInfo?.email || contactInfo?.telephone) {
        websiteProperties.potentialAction = {
          "@type": "ContactAction",
          "name": "Contact",
          "target": contactInfo?.email ? `mailto:${escapeJsonString(contactInfo.email)}` : url
        };
      }

      const websiteTemplate = `<script type="application/ld+json">\n${JSON.stringify(websiteProperties, null, 2)}\n</script>`;

      suggestions.push({
        type: 'WebSite',
        properties: websiteProperties,
        template: websiteTemplate
      });
    } catch (websiteError) {
      console.error('Erreur lors de la génération du template JSON pour WebSite:', websiteError);
    }

    try {
      if (contactInfo?.address && (contactInfo?.telephone || contactInfo?.email)) {
        const businessName = contactInfo.name || seo.title || 'Entreprise locale';
        const businessProperties: Record<string, any> = {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": escapeJsonString(businessName),
          "url": url
        };

        if (contactInfo.telephone) {
          businessProperties.telephone = escapeJsonString(contactInfo.telephone);
        }

        if (contactInfo.email) {
          businessProperties.email = escapeJsonString(contactInfo.email);
        }

        if (contactInfo.address) {
          businessProperties.address = {
            "@type": "PostalAddress",
            "streetAddress": escapeJsonString(contactInfo.address)
          };
        }

        const localBusinessTemplate = `<script type="application/ld+json">\n${JSON.stringify(businessProperties, null, 2)}\n</script>`;

        suggestions.push({
          type: 'LocalBusiness',
          properties: businessProperties,
          template: localBusinessTemplate
        });
      }
    } catch (localBusinessError) {
      console.error('Erreur lors de la génération du template JSON pour LocalBusiness:', localBusinessError);
    }

    return { suggestions };
  } catch (e) {
    console.error('Erreur lors de l\'analyse Schema.org:', e);
    return { suggestions: [] };
  }
}

function calculateKeywordDensity(text: string): Record<string, number> {
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const density: Record<string, number> = {};

  words.forEach(word => {
    word = word.replace(/[^a-z0-9]/g, '');
    if (word.length > 3) {
      density[word] = ((density[word] || 0) + 1) / wordCount;
    }
  });

  return density;
}

async function checkSitemap(baseUrl: string): Promise<{ found: boolean; url?: string; content?: string; urls?: number }> {
  try {
    const possibleLocations = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap/',
      '/sitemap.php',
      '/sitemap.txt'
    ];

    for (const location of possibleLocations) {
      try {
        const url = new URL(location, baseUrl).href;
        const response = await axios.get(url, { timeout: 5000 });

        if (response.status === 200 && response.data) {
          const content = response.data;

          if (typeof content === 'string' &&
            (content.includes('<urlset') || content.includes('<sitemapindex'))) {

            const $ = cheerioLoad(content);
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

async function checkRobotsTxt(baseUrl: string): Promise<{ found: boolean; content?: string }> {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    const response = await axios.get(robotsUrl, { timeout: 5000 });

    if (response.status === 200 && response.data) {
      return {
        found: true,
        content: response.data
      };
    }

    return { found: false };
  } catch (error) {
    console.error('Erreur lors de la vérification du robots.txt:', error);
    return { found: false };
  }
}

function standardizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname !== "/" && urlObj.pathname.endsWith("/")) {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    return urlObj.toString();
  } catch (e) {
    return url;
  }
}

function toggleSlash(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname === "/") {
      return url.replace(/\/$/, "");
    } else if (!urlObj.pathname.endsWith("/")) {
      return url + "/";
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function crawlWebsite(baseUrl: string, maxPages: number = 50): Promise<string[]> {
  console.log(`Démarrage du crawl de ${baseUrl}, limite de ${maxPages} pages`);

  try {
    let normalizedUrl = standardizeUrl(baseUrl);
    console.log(`URL standardisée: ${normalizedUrl}`);

    const protectedRoutes = [
      '/dashboard',
      '/profile',
      '/settings',
      '/projects',
      '/account',
      '/admin',
      '/user',
      '/workspace',
      '/billing',
      '/analytics',
      '/notifications'
    ];

    const allDiscoveredUrls = new Set<string>();
    const visited = new Set<string>();

    allDiscoveredUrls.add(normalizedUrl);
    visited.add(normalizedUrl);

    const alternateUrl = toggleSlash(normalizedUrl);
    if (alternateUrl) {
      allDiscoveredUrls.add(alternateUrl);
      visited.add(alternateUrl);
      console.log(`Version alternative ajoutée: ${alternateUrl}`);
    }

    let mainPageHtml = '';
    try {
      const checkResponse = await axios.get(normalizedUrl, {
        timeout: 5000,
        maxRedirects: 3,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (checkResponse.status !== 200) {
        console.log(`URL principale inaccessible: ${normalizedUrl}, statut: ${checkResponse.status}`);
        return [normalizedUrl];
      }

      mainPageHtml = checkResponse.data;
    } catch (initialError) {
      console.error(`URL principale inaccessible: ${normalizedUrl}`, initialError.message);
      return [normalizedUrl];
    }

    const queue: string[] = [];
    const skippedUrls: string[] = [];

    try {
      const baseUrlObj = new URL(normalizedUrl);
      const baseHostname = baseUrlObj.hostname;

      function shouldKeepWithoutVisiting(url: string): boolean {
        try {
          const urlObj = new URL(url);
          const path = urlObj.pathname.toLowerCase();

          const authProtectedPaths = [
            '/dashboard',
            '/admin',
            '/account',
            '/profile',
            '/user',
            '/member',
            '/login',
            '/signin',
            '/signup',
            '/register',
            '/checkout',
            '/cart',
            '/orders',
            '/settings'
          ];

          return authProtectedPaths.some(protectedPath => path.includes(protectedPath));
        } catch (e) {
          return false;
        }
      }

      const extractLinks = ($: CheerioSelector, pageUrl: string): string[] => {
        const links: string[] = [];

        $('a[href]').each((_, element) => {
          const href = $(element).attr('href');
          if (href) {
            try {
              const url = normalizeUrl(href, pageUrl, baseUrlObj);
              if (url) links.push(url);
            } catch (e) { }
          }
        });

        $('[to], [href], [data-href], [data-to], [routerlink]').each((_, element) => {
          const $el = $(element);
          if ($el.is('a')) return;

          const linkAttr = $el.attr('to') || $el.attr('data-href') ||
            $el.attr('data-to') || $el.attr('routerlink') ||
            $el.attr('data-routerlink');

          if (linkAttr) {
            try {
              const url = normalizeUrl(linkAttr, pageUrl, baseUrlObj);
              if (url) links.push(url);
            } catch (e) { }
          }
        });

        const scriptTags = $('script').filter((_, el) => {
          const content = $(el).html() || '';
          return (content.includes('__NUXT__') || content.includes('__NEXT_DATA__') ||
            content.includes('window.__PRELOADED_STATE__') || content.includes('routes'));
        });

        scriptTags.each((_, script) => {
          const content = $(script).html() || '';
          const urlMatches = content.match(/"(\/[^"]*?)"/g) || [];
          const httpMatches = content.match(/"(https?:\/\/[^"]*?)"/g) || [];

          [...urlMatches, ...httpMatches].forEach(match => {
            try {
              const cleanMatch = match.replace(/^"|"$/g, '');
              const url = normalizeUrl(cleanMatch, pageUrl, baseUrlObj);
              if (url) links.push(url);
            } catch (e) { }
          });
        });

        $('nav a, .nav a, .menu a, .navigation a, header a, footer a').each((_, element) => {
          const href = $(element).attr('href');
          if (href) {
            try {
              const url = normalizeUrl(href, pageUrl, baseUrlObj);
              if (url) links.push(url);
            } catch (e) { }
          }
        });

        return [...new Set(links)];
      };

      const normalizeUrl = (href: string, currentUrl: string, baseUrlObj: URL): string | null => {
        if (!href) return null;

        try {
          let fullUrl: string;

          if (href.startsWith('http')) {
            const urlObj = new URL(href);
            if (urlObj.hostname !== baseHostname) return null;
            fullUrl = href;
          } else if (href.startsWith('/')) {
            fullUrl = new URL(href, baseUrl).toString();
          } else if (!href.startsWith('#') && !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            fullUrl = new URL(href, currentUrl).toString();
          } else {
            return null;
          }

          const cleanUrl = fullUrl.split('#')[0];

          return standardizeUrl(cleanUrl);
        } catch (e) {
          return null;
        }
      };

      if (mainPageHtml) {
        const $ = cheerioLoad(mainPageHtml);
        const mainPageLinks = extractLinks($, normalizedUrl);

        mainPageLinks.forEach(link => {
          const standardizedLink = standardizeUrl(link);
          allDiscoveredUrls.add(standardizedLink);

          if (shouldKeepWithoutVisiting(standardizedLink)) {
            skippedUrls.push(standardizedLink);
            console.log(`URL protégée détectée (non visitée): ${standardizedLink}`);
          } else if (!visited.has(standardizedLink) && !queue.includes(standardizedLink)) {
            queue.push(standardizedLink);
          }
        });

        console.log(`${mainPageLinks.length} liens trouvés sur la page principale`);
      }

      const timeoutPromise = new Promise<string[]>((resolve) => {
        setTimeout(() => {
          console.log(`Timeout du crawl atteint après 15 secondes`);
          return resolve([...Array.from(visited), ...skippedUrls]);
        }, 15000);
      });

      const crawlPromise = new Promise<string[]>(async (resolve) => {
        let crawlCount = 0;
        const maxCrawlAttempts = Math.min(10, maxPages);

        while (queue.length > 0 && visited.size < maxPages && crawlCount < maxCrawlAttempts) {
          const currentUrl = queue.shift() as string;

          if (visited.has(currentUrl)) {
            continue;
          }

          crawlCount++;
          console.log(`Analyse de ${currentUrl} (${visited.size}/${maxPages}, tentative ${crawlCount}/${maxCrawlAttempts})`);

          try {
            const response = await axios.get(currentUrl, {
              timeout: 5000,
              maxRedirects: 3,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              },
              validateStatus: (status) => status === 200
            });

            const html = response.data;
            if (!html) continue;

            visited.add(currentUrl);

            const $ = cheerioLoad(html);
            const pageLinks = extractLinks($, currentUrl);

            pageLinks.forEach(link => {
              const standardizedLink = standardizeUrl(link);
              allDiscoveredUrls.add(standardizedLink);

              if (shouldKeepWithoutVisiting(standardizedLink)) {
                if (!visited.has(standardizedLink) && !skippedUrls.includes(standardizedLink)) {
                  skippedUrls.push(standardizedLink);
                  console.log(`URL protégée détectée (non visitée): ${standardizedLink}`);
                }
              } else if (!visited.has(standardizedLink) && !queue.includes(standardizedLink) &&
                queue.length + visited.size < maxPages) {
                queue.push(standardizedLink);
              }
            });

            console.log(`${pageLinks.length} liens trouvés sur ${currentUrl}`);
          } catch (error) {
            console.error(`Erreur lors de l'analyse de ${currentUrl}: ${error.message}`);
          }
        }

        resolve([...Array.from(visited), ...skippedUrls]);
      });

      const result = await Promise.race([crawlPromise, timeoutPromise]);
      return result.length > 0 ? result : [normalizedUrl];
    } catch (e) {
      console.error(`Erreur générale lors du crawl:`, e);
      return [normalizedUrl];
    }



  } catch (error) {
    console.error('Erreur fatale dans crawlWebsite:', error);
    return [baseUrl];
  }
}

function generateSitemap(urls: string[], imagesData: Record<string, any> = {}): string {
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

  const imageUrls: Record<string, Array<{ url: string, title?: string, alt?: string }>> = {};

  const getAbsoluteImageUrl = (imgSrc: string, pageUrl: string): string => {
    try {
      if (imgSrc.startsWith('http')) {
        return imgSrc;
      } else if (imgSrc.startsWith('//')) {
        const pageUrlObj = new URL(pageUrl);
        return `${pageUrlObj.protocol}${imgSrc}`;
      } else if (imgSrc.startsWith('/')) {
        return `${baseDomain}${imgSrc}`;
      } else {
        return new URL(imgSrc, pageUrl).toString();
      }
    } catch (e) {
      console.error(`Erreur lors de la conversion de l'URL d'image ${imgSrc}:`, e);
      return imgSrc;
    }
  };

  console.log("Extraction des images pour le sitemap...");
  console.log("Structure d'imagesData:", Object.keys(imagesData));

  Object.entries(imagesData).forEach(([pageUrl, data]) => {
    try {
      console.log(`Traitement des images pour ${pageUrl}:`, JSON.stringify(data, null, 2));

      if (data && data.images) {
        console.log(`Structure de 'images' pour ${pageUrl}:`, Object.keys(data.images));

        if (data.images.data && Array.isArray(data.images.data)) {
          console.log(`Nombre d'images trouvées: ${data.images.data.length}`);

          imageUrls[pageUrl] = data.images.data
            .filter(img => {
              if (!img || !img.src) {
                console.log("Image ignorée (pas de src):", img);
                return false;
              }
              console.log(`Image trouvée: ${img.src}`);
              return true;
            })
            .map(img => {
              const absoluteUrl = getAbsoluteImageUrl(img.src, pageUrl);
              console.log(`  - URL transformée: ${img.src} -> ${absoluteUrl}`);
              return {
                url: absoluteUrl,
                title: img.title || undefined,
                alt: img.alt || undefined
              };
            });

          console.log(`${imageUrls[pageUrl].length} images ajoutées pour ${pageUrl}`);
        } else {
          console.log(`Pas de tableau 'data' dans 'images' pour ${pageUrl}`);
        }
      } else {
        console.log(`Pas de structure 'images' valide pour ${pageUrl}`);
      }
    } catch (e) {
      console.error(`Erreur lors du traitement des images pour ${pageUrl}:`, e);
    }
  });

  const directImageUrls = uniqueUrls.filter(url => isImageUrl(url));
  if (directImageUrls.length > 0) {
    imageUrls['directImages'] = directImageUrls.map(url => ({
      url,
      title: undefined,
      alt: undefined
    }));
  }

  const sitemapEntries = uniqueUrls
    .filter(url => {
      try {
        if (url.match(/\.(css|js|ico|woff|woff2|ttf|eot|pdf|zip|rar|exe|dll|docx?|xlsx?|pptx?)(\?.*)?$/i)) {
          return false;
        }

        if (url.includes('/api/') || url.includes('/wp-json/')) {
          return false;
        }

        if (url.includes('/404') || url.includes('/500') || url.includes('/error')) {
          return false;
        }

        return true;
      } catch (e) {
        return true;
      }
    })
    .map(url => {
      const { priority, changefreq } = getPriorityAndChangefreq(url);
      const urlImages = imageUrls[url] || [];
      const isImage = isImageUrl(url);

      console.log(`Génération du sitemap pour ${url}, nombre d'images: ${urlImages.length}`);

      if (isImage) {
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <image:image>
      <image:loc>${url}</image:loc>
    </image:image>
  </url>`;
      }

      const directImages = imageUrls['directImages'] || [];

      const pageImages = [...urlImages];

      if (url.endsWith('/') || url.split('/').length <= 3) {
        pageImages.push(...directImages);
      }

      for (const [pageUrl, imgs] of Object.entries(imageUrls)) {
        if (pageUrl !== 'directImages' && pageUrl !== url) {
          pageImages.push(...imgs);
        }
      }

      const uniquePageImages = pageImages.filter((img, index, self) =>
        index === self.findIndex(i => i.url === img.url)
      );

      console.log(`Après fusion, nombre total d'images pour ${url}: ${uniquePageImages.length}`);

      const imageSection = uniquePageImages.length > 0
        ? uniquePageImages.map(img => {
          console.log(`  - Ajout de l'image au sitemap: ${img.url}`);
          return `
    <image:image>
      <image:loc>${img.url}</image:loc>${img.title ? `
      <image:title>${img.title}</image:title>` : ''}${img.alt ? `
      <image:caption>${img.alt}</image:caption>` : ''}
    </image:image>`;
        }).join('')
        : '';

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageSection}
  </url>`;
    }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries}
</urlset>`;

  console.log('Sitemap généré avec succès, contenant des références aux images');
  return sitemap;
}

function rankPages(results: Record<string, WebsiteAnalysisResult>): string[] {
  return Object.entries(results)
    .sort(([, a], [, b]) => {
      const getScore = (result: WebsiteAnalysisResult) => {
        let score = 0;
        score += (1000 - result.performance.loadTime) / 10;
        score += (100 - result.performance.ttfb) / 2;

        if (result.seo.title) score += 10;
        if (result.seo.description) score += 10;
        score += result.seo.images.withAlt * 2;
        score -= result.issues.length * 5;

        score += result.seo.wordCount / 100;
        score += Object.keys(result.seo.structuredData.types).length * 5;

        return score;
      };

      return getScore(b) - getScore(a);
    })
    .map(([url]) => url);
}

async function findContactInfo(baseUrl: string, links: string[]): Promise<Record<string, string>> {

  if (!links || links.length === 0) {
    console.log('Aucun lien fourni pour la recherche de contact');
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
        console.log(`URL invalide ignorée: ${link}`);
      }
    });

    console.log(`${prioritizedUrls.length} liens potentiels de contact trouvés`);

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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (response.status !== 200) {
          console.log(`Page inaccessible: ${url}, statut: ${response.status}`);
          continue;
        }

        const html = response.data;
        if (!html) continue;

        const $ = cheerioLoad(html);

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
        console.error(`Erreur lors de l'analyse de ${url} pour les contacts:`, error.message);
      }
    }

    console.log('Informations de contact trouvées:', contactInfo);
    return contactInfo;
  } catch (error) {
    console.error('Erreur générale lors de la recherche de contacts:', error);
    return {};
  }
}

async function createFallbackResult(url: string): Promise<WebsiteAnalysisResult> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    return {
      url,
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
        title: domain,
        description: '',
        headings: { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
        images: { total: 0, withAlt: 0, withoutAlt: 0, data: [] as any[] },
        links: { internal: [] as string[], external: [] as string[], broken: [] as string[], nofollow: [] as string[] },
        structuredData: { data: [] as any[], count: 0, types: {} },
        meta: {
          viewport: false,
          robots: '',
          canonical: url,
          og: {},
          twitter: {}
        },
        wordCount: 0,
        readabilityScore: 0,
        keywordDensity: {}
      },
      technical: {
        statusCode: 200,
        https: url.startsWith('https'),
        mobile: {
          viewport: false,
          responsive: false
        },
        security: {
          headers: {},
          certificate: url.startsWith('https')
        }
      },
      technicalSEO: {
        sitemapFound: false,
        sitemapUrl: '',
        sitemapUrls: 0,
        robotsTxtFound: false,
        robotsTxtContent: '',
        schemaTypeCount: {}
      },
      issues: []
    };
  } catch (e) {
    console.error('Erreur lors de la création du résultat de secours:', e);
    throw e;
  }
}