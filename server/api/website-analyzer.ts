import axios from 'axios';
import { CheerioAPI as CheerioAPIType, load as cheerioLoad } from 'cheerio';
import * as dns from 'dns';
import { createError, defineEventHandler, H3Event, readBody } from 'h3';
import { performance } from 'perf_hooks';
import type { Page } from 'puppeteer';
import { promisify } from 'util';
import { WebsiteAnalysisResult } from './analyzer-types';

const dnsResolve = promisify(dns.resolve);
const dnsReverse = promisify(dns.reverse);

async function analyzePerformance(url: string, page: Page): Promise<WebsiteAnalysisResult['performance']> {
  const startTime = performance.now();

  // Activer la collecte des métriques de performance
  await page.evaluateOnNewDocument(() => {
    window.performance.setResourceTimingBufferSize(500);
  });

  // Charger la page et collecter les métriques
  const response = await page.goto(url, { waitUntil: 'networkidle0' });
  const loadTime = performance.now() - startTime;

  // Collecter les métriques de performance
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

  // Calculer le CLS
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

  const totalSize = Object.values(performanceMetrics.resourceStats).reduce((acc, curr) => acc + curr.size, 0);

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
  // Extraire les informations de base
  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const metaKeywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()) || [];
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || url;

  // Extraire les headings
  const headings = {
    h1: $('h1').map((_, el) => $(el).text().trim()).get(),
    h2: $('h2').map((_, el) => $(el).text().trim()).get(),
    h3: $('h3').map((_, el) => $(el).text().trim()).get(),
    h4: $('h4').map((_, el) => $(el).text().trim()).get(),
    h5: $('h5').map((_, el) => $(el).text().trim()).get(),
    h6: $('h6').map((_, el) => $(el).text().trim()).get()
  };

  // Analyser les images
  const images = {
    total: $('img').length,
    withAlt: $('img[alt]').length,
    withoutAlt: $('img:not([alt])').length,
    data: await Promise.all($('img').map(async (_, el) => {
      const $img = $(el);
      const src = $img.attr('src') || '';
      const size = await getImageSize(src);

      return {
        src,
        alt: $img.attr('alt') || '',
        title: $img.attr('title') || '',
        dimensions: {
          width: parseInt($img.attr('width') || '0'),
          height: parseInt($img.attr('height') || '0')
        }
      };
    }).get())
  };

  // Analyser les liens
  const links = {
    internal: [] as string[],
    external: [] as string[],
    broken: [] as string[],
    nofollow: [] as string[]
  };

  const urlObj = new URL(url);
  const baseHost = urlObj.hostname;

  $('a').each((_, el) => {
    const $link = $(el);
    const href = $link.attr('href');
    const rel = $link.attr('rel');

    if (href) {
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === baseHost) {
          links.internal.push(href);
        } else {
          links.external.push(href);
        }
        if (rel?.includes('nofollow')) {
          links.nofollow.push(href);
        }
      } catch (e) {
        links.broken.push(href);
      }
    }
  });

  // Extraire les données structurées
  const structuredData = {
    data: [],
    count: 0,
    types: {} as Record<string, number>
  };

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data: any = JSON.parse($(el).html() || '');
      structuredData.data.push(data);
      structuredData.count++;
      if (data['@type']) {
        structuredData.types[data['@type']] = (structuredData.types[data['@type']] || 0) + 1;
      }
    } catch (e) {
      console.error('Erreur parsing JSON-LD:', e);
    }
  });

  // Extraire les balises sociales
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

  // Calculer le ratio texte/HTML
  const text = $('body').text().trim();
  const textToHtmlRatio = text.length / html.length;

  // Compter les mots
  const wordCount = text.split(/\s+/).length;

  // Calculer le score de lisibilité
  const readabilityScore = calculateReadabilityScore(text);

  // Calculer la densité des mots-clés
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

interface ExtendedResponse {
  headers: Record<string, string | string[] | undefined>;
  status?: number;
}

async function analyzeTechnical(url: string, response: ExtendedResponse, $: CheerioAPIType, html: string): Promise<WebsiteAnalysisResult['technical']> {
  const headers = response.headers;

  return {
    statusCode: response.status || 200,
    https: url.startsWith('https'),
    mobile: {
      viewport: $('meta[name="viewport"]').length > 0,
      responsive: true
    },
    security: {
      headers: headers as Record<string, string>,
      certificate: url.startsWith('https')
    }
  };
}

// Fonction principale d'analyse
export default defineEventHandler(async (event: H3Event) => {
  const { url } = await readBody(event);
  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL requise'
    });
  }

  const $ = cheerioLoad(await (await axios.get(url)).data);
  return await analyzeWebsite(url);
});

async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const startTime = performance.now();
  const response = await axios.get(url);
  const loadTime = performance.now() - startTime;
  const html = response.data;
  const $ = cheerioLoad(html);

  const result: WebsiteAnalysisResult = {
    url,
    performance: {
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
    },
    seo: {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      headings: {
        h1: $('h1').map((_, el) => $(el).text().trim()).get(),
        h2: $('h2').map((_, el) => $(el).text().trim()).get(),
        h3: $('h3').map((_, el) => $(el).text().trim()).get(),
        h4: $('h4').map((_, el) => $(el).text().trim()).get(),
        h5: $('h5').map((_, el) => $(el).text().trim()).get(),
        h6: $('h6').map((_, el) => $(el).text().trim()).get()
      },
      images: {
        total: $('img').length,
        withAlt: $('img[alt]').length,
        withoutAlt: $('img:not([alt])').length,
        data: $('img').map((_, el) => ({
          src: $(el).attr('src') || '',
          alt: $(el).attr('alt'),
          title: $(el).attr('title'),
          dimensions: {
            width: parseInt($(el).attr('width') || '0'),
            height: parseInt($(el).attr('height') || '0')
          }
        })).get()
      },
      links: {
        internal: [],
        external: [],
        broken: [],
        nofollow: []
      },
      structuredData: {
        data: [],
        count: 0,
        types: {}
      },
      meta: {
        viewport: $('meta[name="viewport"]').attr('content') || false,
        robots: $('meta[name="robots"]').attr('content'),
        canonical: $('link[rel="canonical"]').attr('href'),
        og: {},
        twitter: {}
      }
    },
    technical: {
      statusCode: response.status,
      https: url.startsWith('https'),
      mobile: {
        viewport: $('meta[name="viewport"]').length > 0,
        responsive: true
      },
      security: {
        headers: response.headers as Record<string, string>,
        certificate: url.startsWith('https')
      }
    },
    content: {
      ...analyzeContent($),
      readabilityScore: calculateReadabilityScore($('body').text())
    },
    issues: []
  };

  result.issues = generateIssues(result);
  return result;
}

function analyzeImages($: cheerio.CheerioAPI) {
  const images = $('img').map((_, el) => ({
    src: $(el).attr('src') || '',
    alt: $(el).attr('alt'),
    title: $(el).attr('title'),
    dimensions: {
      width: parseInt($(el).attr('width') || '0'),
      height: parseInt($(el).attr('height') || '0')
    }
  })).get();

  return {
    total: images.length,
    withAlt: images.filter(img => !!img.alt).length,
    withoutAlt: images.filter(img => !img.alt).length,
    data: images
  };
}

function analyzeLinks($: cheerio.CheerioAPI, baseUrl: string) {
  const internal: string[] = [];
  const external: string[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http')) {
      if (href.includes(new URL(baseUrl).hostname)) {
        internal.push(href);
      } else {
        external.push(href);
      }
    } else if (href.startsWith('/')) {
      internal.push(new URL(href, baseUrl).href);
    }
  });

  return { internal, external };
}

function extractStructuredData($: cheerio.CheerioAPI) {
  const data: any[] = [];
  const types: Record<string, number> = {};

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = JSON.parse($(el).html() || '');
      data.push(content);
      if (content['@type']) {
        types[content['@type']] = (types[content['@type']] || 0) + 1;
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

function extractMetaTags($: cheerio.CheerioAPI) {
  return {
    viewport: $('meta[name="viewport"]').attr('content'),
    robots: $('meta[name="robots"]').attr('content'),
    canonical: $('link[rel="canonical"]').attr('href'),
    og: extractSocialTags($, 'og'),
    twitter: extractSocialTags($, 'twitter')
  };
}

function extractSocialTags($: cheerio.CheerioAPI, prefix: string) {
  const tags: Record<string, string> = {};
  $(`meta[property^="${prefix}:"]`).each((_, el) => {
    const property = $(el).attr('property')?.replace(`${prefix}:`, '');
    if (property) {
      tags[property] = $(el).attr('content') || '';
    }
  });
  return tags;
}

function analyzeContent($: CheerioAPI) {
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

  // Flesch Reading Ease score
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

  // Vérifications SEO
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

  // Vérifications performance
  if (result.performance.loadTime > 3000) {
    issues.push({
      type: 'warning',
      message: 'Temps de chargement élevé',
      code: 'HIGH_LOAD_TIME'
    });
  }

  // Vérifications techniques
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

// Fonctions utilitaires
async function getImageSize(url: string): Promise<number> {
  try {
    const response = await axios.head(url);
    return parseInt(response.headers['content-length'] || '0');
  } catch {
    return 0;
  }
}

function checkResponsiveness($: ReturnType<typeof cheerioLoad>): boolean {
  return $('meta[name="viewport"]').length > 0 &&
    $('img[srcset], picture, source[srcset]').length > 0;
}

function checkTouchTargets($: ReturnType<typeof cheerioLoad>): boolean {
  // Vérifier la taille des éléments cliquables
  const minSize = 44; // Recommandation WCAG
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

function checkFontSizes($: ReturnType<typeof cheerioLoad>): boolean {
  const minFontSize = 16; // Taille minimale recommandée en pixels
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

function checkAriaLabels($: ReturnType<typeof cheerioLoad>): boolean {
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

function checkAltTexts($: ReturnType<typeof cheerioLoad>): boolean {
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

function checkContrast($: ReturnType<typeof cheerioLoad>): boolean {
  // Implémentation simplifiée - une vérification plus précise nécessiterait
  // une analyse des couleurs avec puppeteer
  return true;
}

function checkKeyboardNav($: ReturnType<typeof cheerioLoad>): boolean {
  return $('[tabindex="-1"]').length === 0;
}

function calculateAccessibilityScore($: ReturnType<typeof cheerioLoad>): number {
  let score = 100;

  if (!checkAriaLabels($)) score -= 25;
  if (!checkAltTexts($)) score -= 25;
  if (!checkKeyboardNav($)) score -= 25;
  if (!checkTouchTargets($)) score -= 25;

  return Math.max(0, score);
}

async function validateHtml(html: string): Promise<boolean> {
  // Implémentation simplifiée - une validation complète nécessiterait
  // l'utilisation d'un validateur HTML
  return true;
}

function findDeprecatedTags($: ReturnType<typeof cheerioLoad>): string[] {
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

function getEncoding($: ReturnType<typeof cheerioLoad>): string {
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

function analyzeSchemaOrg(
  url: string,
  html: string,
  $: ReturnType<typeof cheerioLoad>,
  seo: WebsiteAnalysisResult['seo']
): SchemaOrg {
  try {
    const existing = seo.structuredData || [];
    const suggestions: SchemaOrgSuggestion[] = [];

    // Suggestion de schéma Organization
    if ($('body').text().toLowerCase().includes('entreprise') || $('body').text().toLowerCase().includes('société') || $('body').text().toLowerCase().includes('company')) {
      let orgName = $('meta[property="og:site_name"]').attr('content') || '';
      if (!orgName) {
        orgName = seo.title.split('|')[1]?.trim() || seo.title.split('-')[1]?.trim() || '';
      }

      const logo = $('link[rel="icon"]').attr('href') || '';
      const phone = $('body').text().match(/(\+\d{1,3}[-\.\s]??)?\(?\d{3}\)?[-\.\s]??\d{3}[-\.\s]??\d{4}/)?.[0] || '';

      suggestions.push({
        type: 'Organization',
        properties: {
          name: orgName,
          url: url,
          logo: new URL(logo, url).toString(),
          telephone: phone
        },
        template: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${orgName}",
  "url": "${url}",
  "logo": "${new URL(logo, url).toString()}",
  "telephone": "${phone}"
}
</script>`
      });
    }

    // Suggestion de schéma WebSite
    suggestions.push({
      type: 'WebSite',
      properties: {
        name: seo.title,
        description: seo.description,
        url: url
      },
      template: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${seo.title}",
  "description": "${seo.description}",
  "url": "${url}"
}
</script>`
    });

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