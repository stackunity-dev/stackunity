import axios from 'axios';
import * as cheerio from 'cheerio';
import { createError, defineEventHandler, H3Event, readBody } from 'h3';
import { performance } from 'perf_hooks';
import {
  analyzeAccessibility as analyzeAccessibilityUtil,
  analyzeImages as analyzeImagesUtil,
  analyzeLinks as analyzeLinksUtil,
  calculateCLS,
  calculateKeywordDensity,
  calculateReadabilityScore,
  checkResponsiveness,
  generateSEOIssues as generateSEOIssuesUtil
} from './analyze-functions';
import type { SecurityIssue, SiteAnalysisResult, StructuredData, WebsiteAnalysisResult } from './analyzer-types';
import {
  checkRobotsTxt,
  checkSitemap,
  crawlWebsite,
  createFallbackResult,
  findContactInfo,
  rankPages
} from './crawl-functions';
import { analyzeUserEngagement } from './engagement-analyzer';
import { analyzeSecurityVulnerabilities } from './security-analyzer';

export default defineEventHandler(async (event: H3Event): Promise<SiteAnalysisResult> => {
  try {
    const body = await readBody(event);
    const { url, maxPages = 50, focusOnContact = false, checkSitemap: checkSitemapFlag = true, checkRobotsTxt: checkRobotsTxtFlag = true } = body;

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL required'
      });
    }

    try {
      new URL(url);
    } catch (urlError) {
      throw createError({
        statusCode: 400,
        message: 'Invalid URL'
      });
    }

    let urls: string[] = [];
    try {
      urls = await crawlWebsite(url, maxPages);
    } catch (crawlError) {
      console.error('Error during crawl:', crawlError);
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
          console.error('Error during URL sorting:', e);
          return 0;
        }
      });
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

    const urlsToAnalyze = new Set<string>();
    const seen = new Set<string>();

    urlsToAnalyze.add(url);

    for (const pageUrl of prioritizedUrls) {
      try {
        const normalizedUrl = new URL(pageUrl).href.toLowerCase();
        if (!seen.has(normalizedUrl)) {
          urlsToAnalyze.add(pageUrl);
          seen.add(normalizedUrl);

          if (urlsToAnalyze.size >= 20) break;
        }
      } catch (e) {
        console.error(`Invalid URL in crawl results: ${pageUrl}`);
      }
    }

    for (const pageUrl of urlsToAnalyze) {
      try {
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
        console.error(`Error during analysis of ${pageUrl}:`, pageError);
      }
    }

    if (Object.keys(results).length === 0) {
      try {
        const fallbackResult = await createFallbackResult(url);
        results[url] = fallbackResult;
      } catch (fallbackError) {
        console.error('Error during fallback result creation:', fallbackError);
        throw createError({
          statusCode: 500,
          message: 'Unable to analyze the site'
        });
      }
    }

    const pageCount = Object.keys(results).length || 1;

    let extractedContactInfo: Record<string, string> = {};
    try {
      if (focusOnContact) {
        extractedContactInfo = await findContactInfo(url, Object.keys(results));
      }
    } catch (contactError) {
      console.error('Error during contact information extraction:', contactError);
    }

    const imagesData: Record<string, any> = {};
    for (const [url, result] of Object.entries(results)) {
      if (result && result.seo && result.seo.images) {
        imagesData[url] = {
          images: result.seo.images
        };
      }
    }

    let sitemapResult = { found: false };
    let robotsTxtResult = { found: false };

    if (checkSitemapFlag) {
      sitemapResult = await checkSitemap(url);
    }

    if (checkRobotsTxtFlag) {
      robotsTxtResult = await checkRobotsTxt(url);
    }

    const sitemap = checkSitemapFlag ? generateSitemap(urls, imagesData) : '';

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
    console.error('Error during analysis:', error);
    throw createError({
      statusCode: 500,
      message: `Error during site analysis: ${error.message || 'Unknown error'}`
    });
  }
});

async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const startTime = performance.now();
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*;q=0.8',
      'Accept-Language': 'fr,en-US;q=0.8,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    },
    timeout: 15000,
    maxContentLength: 10 * 1024 * 1024,
    maxRedirects: 5,
    responseType: 'arraybuffer'
  });

  const loadTime = performance.now() - startTime;

  const contentType = response.headers['content-type'] || '';
  let html = '';
  let isHtml = contentType.includes('text/html') || contentType.includes('application/xhtml+xml');

  if (isHtml) {
    const encoding = getCharset(contentType) || 'utf-8';
    try {
      html = Buffer.from(response.data).toString(encoding as BufferEncoding);
    } catch (e) {
      console.error(`Erreur lors du décodage du contenu avec l'encodage ${encoding}:`, e);
      html = Buffer.from(response.data).toString('utf-8');
    }
  } else {
    html = `<html><head><title>${url}</title></head><body><p>Contenu non-HTML (${contentType})</p></body></html>`;
  }

  const $ = cheerio.load(html);

  const cls = calculateCLS($);

  const performanceData = {
    ttfb: loadTime * 0.2,
    fcp: loadTime * 0.4,
    lcp: loadTime * 0.6,
    cls: cls,
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
      html: isHtml ? response.data.length : 0,
      css: 0,
      js: 0,
      images: 0,
      other: isHtml ? 0 : response.data.length
    }
  };

  const imagesData = analyzeImagesUtil($);
  const linksData = analyzeLinksUtil($, url);
  const accessibilityData = analyzeAccessibilityUtil($);

  const formattedImagesData = {
    total: imagesData.total,
    withAlt: imagesData.withAlt,
    withoutAlt: imagesData.withoutAlt,
    data: imagesData.data
  };

  const formattedLinksData = {
    internal: linksData.internal.map(href => ({
      href,
      text: '',
      hasImage: false
    })),
    external: linksData.external.map(href => ({
      href,
      text: '',
      hasImage: false
    })),
    broken: [] as string[],
    nofollow: linksData.nofollow
  };

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
    images: formattedImagesData,
    links: formattedLinksData,
    meta: {
      viewport: $('meta[name="viewport"]').attr('content') || false,
      robots: $('meta[name="robots"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
      og: {} as Record<string, string>,
      twitter: {} as Record<string, string>
    },
    wordCount: $('body').text().trim().split(/\s+/).length,
    readabilityScore: calculateReadabilityScore($),
    keywordDensity: calculateKeywordDensity($('body').text()),
    structuredData: {
      data: [] as StructuredData[],
      count: 0,
      types: {} as Record<string, number>
    }
  };

  $('meta').each((_, el) => {
    const property = $(el).attr('property');
    const name = $(el).attr('name');
    const content = $(el).attr('content');

    if (property && property.startsWith('og:') && content) {
      const key = property.replace('og:', '');
      seoData.meta.og[key] = content;
    }

    if (name && name.startsWith('twitter:') && content) {
      const key = name.replace('twitter:', '');
      seoData.meta.twitter[key] = content;
    }
  });

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const jsonContent = $(el).html();
      if (jsonContent) {
        const parsed = JSON.parse(jsonContent);
        if (parsed) {
          const type = parsed['@type'] || (Array.isArray(parsed['@graph']) && parsed['@graph'][0] && parsed['@graph'][0]['@type']);
          if (type) {
            if (typeof type === 'string') {
              seoData.structuredData.types[type] = (seoData.structuredData.types[type] || 0) + 1;
            } else if (Array.isArray(type)) {
              type.forEach(t => {
                seoData.structuredData.types[t] = (seoData.structuredData.types[t] || 0) + 1;
              });
            }
            seoData.structuredData.data.push(parsed as StructuredData);
            seoData.structuredData.count++;
          }
        }
      }
    } catch (e) {
      console.error('Erreur dans l\'analyse du JSON-LD:', e);
    }
  });

  const technical = {
    statusCode: response.status,
    https: url.startsWith('https'),
    mobile: {
      viewport: !!seoData.meta.viewport,
      viewportContent: seoData.meta.viewport || '',
      responsive: checkResponsiveness($)
    },
    security: {
      headers: {},
      securityIssues: [] as SecurityIssue[],
      score: 0,
      cookies: {
        secure: false,
        httpOnly: false,
        sameSite: false,
        score: 0
      }
    },
    meta: {
      charset: $('meta[charset]').attr('charset') || '',
      language: $('html').attr('lang') || ''
    },
    response: {
      headers: response.headers as Record<string, string>,
      size: response.data.length,
      time: loadTime
    }
  };

  const urlString = typeof url === 'string' ? url : String(url);

  // Utiliser la fonction async/await correctement
  try {
    const securityAnalysis = await analyzeSecurityVulnerabilities(html, urlString, response.headers as Record<string, string>);



    // Convertir les en-têtes de sécurité au format attendu par le frontend
    // Format attendu: Array<{ name: string; value: string }>
    const formattedHeaders = Object.entries(securityAnalysis.headerAnalysis.present || {}).map(([name, value]) => {
      return {
        name,
        value: String(value || '')
      };
    });

    technical.security.headers = formattedHeaders;

    // Ajouter le score de sécurité
    technical.security.score = securityAnalysis.score;

    // Ajouter les informations sur les cookies
    technical.security.cookies = securityAnalysis.cookieAnalysis;

    // Collecter les issues de sécurité dans la propriété securityIssues de technical.security
    for (const vuln of securityAnalysis.xssVulnerabilities) {
      technical.security.securityIssues.push({
        type: 'xss',
        description: vuln.description,
        severity: vuln.severity
      });
    }

    for (const vuln of securityAnalysis.csrfVulnerabilities) {
      technical.security.securityIssues.push({
        type: 'csrf',
        description: vuln.description,
        severity: vuln.severity
      });
    }

    for (const vuln of securityAnalysis.injectionVulnerabilities) {
      technical.security.securityIssues.push({
        type: 'injection',
        description: vuln.description,
        severity: vuln.severity
      });
    }

    for (const vuln of securityAnalysis.infoLeakVulnerabilities) {
      technical.security.securityIssues.push({
        type: 'info-leak',
        description: vuln.description,
        severity: vuln.severity
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'analyse de sécurité:", error);
    technical.security.score = 0;
  }

  const socialTags = {
    openGraph: Object.keys(seoData.meta.og).length > 0,
    twitter: Object.keys(seoData.meta.twitter).length > 0,
    twitterTags: $('meta[name^="twitter:"]').map((_, el) => ({
      name: $(el).attr('name') || '',
      content: $(el).attr('content') || ''
    })).get()
  };

  // Générer les issues SEO
  const seoIssues = generateSEOIssuesUtil(seoData, performanceData);

  // Collecter toutes les issues
  const allIssues = [...seoIssues];

  // Ajouter les issues d'accessibilité
  if (accessibilityData) {
    // Convertir les issues d'accesibilité au format standard
    if (accessibilityData.ariaIssues) {
      for (const issue of accessibilityData.ariaIssues) {
        allIssues.push({
          type: 'accessibility',
          title: `ARIA issue: ${issue.element}`,
          message: `ARIA issue in the element ${issue.element}: ${issue.issue}`,
          description: issue.issue,
          recommendation: 'Check that the ARIA references point to existing elements',
          category: 'Accessibility',
          severity: 'medium'
        });
      }
    }

    if (accessibilityData.inputIssues) {
      for (const issue of accessibilityData.inputIssues) {
        allIssues.push({
          type: 'accessibility',
          title: `Form issue: ${issue.element}`,
          message: `Form issue in the element ${issue.element}: ${issue.issue}`,
          description: issue.issue,
          recommendation: 'Ensure that all form fields have appropriate labels',
          category: 'Accessibility',
          severity: 'medium'
        });
      }
    }

    if (accessibilityData.missingAlt > 0) {
      allIssues.push({
        type: 'accessibility',
        title: `${accessibilityData.missingAlt} image(s) without alt attribute`,
        message: `${accessibilityData.missingAlt} image(s) without alt attribute for accessibility`,
        description: 'The alt attribute is essential for accessibility of images',
        recommendation: 'Add descriptive alt attributes to all images',
        category: 'Accessibility',
        severity: 'high'
      });
    }

    if (accessibilityData.missingAria > 0) {
      allIssues.push({
        type: 'accessibility',
        title: `${accessibilityData.missingAria} interactive element(s) without ARIA attributes`,
        message: `${accessibilityData.missingAria} interactive element(s) without ARIA attributes`,
        description: 'ARIA attributes allow to improve accessibility for users of screen readers',
        recommendation: 'Add aria-label or aria-labelledby attributes to interactive elements',
        category: 'Accessibility',
        severity: 'medium'
      });
    }

    if (accessibilityData.missingLabels > 0) {
      allIssues.push({
        type: 'accessibility',
        title: `${accessibilityData.missingLabels} field(s) without associated label`,
        message: `${accessibilityData.missingLabels} field(s) of form without associated label`,
        description: 'Form fields must have associated labels',
        recommendation: 'Associate labels to all form fields',
        category: 'Accessibility',
        severity: 'high'
      });
    }
  }

  // Ajouter les issues de sécurité
  for (const issue of technical.security.securityIssues) {
    allIssues.push({
      type: 'security',
      title: issue.description || 'Security issue',
      message: issue.description,
      description: issue.description,
      recommendation: 'Solve this security issue',
      category: 'Security',
      severity: issue.severity
    });
  }

  // Ajout de l'analyse d'engagement utilisateur
  const engagementResult = await analyzeUserEngagement(html);
  const engagementData = {
    ctaCount: engagementResult.ctaCount,
    interactiveElements: engagementResult.interactiveElements,
    visualElements: engagementResult.visualElements,
    socialElements: engagementResult.socialElements,
    navigationScore: engagementResult.navigationScore,
    readabilityScore: engagementResult.readabilityScore,
    engagementTechniques: engagementResult.engagementTechniques,
    issues: engagementResult.issues
  };

  // Et en bas, ajouter les problèmes d'engagement aux problèmes globaux
  for (const issue of engagementData.issues) {
    allIssues.push({
      type: 'engagement',
      title: issue.issue,
      message: issue.issue,
      description: issue.description || '',
      recommendation: issue.recommendation || '',
      category: 'Engagement',
      severity: issue.severity === 'info' ? 'low' : issue.severity
    });
  }

  const result: WebsiteAnalysisResult = {
    url,
    performance: performanceData,
    seo: seoData,
    technical,
    socialTags,
    issues: allIssues,
    accessibility: accessibilityData,
    technicalSEO: {
      sitemapFound: false,
      robotsTxtFound: false,
      schemaTypeCount: seoData.structuredData.types
    },
    engagement: engagementData
  };

  result.title = seoData.title;
  result.description = seoData.description;

  return result;
}

function standardizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);

    // Normaliser le protocole en minuscules
    const protocol = urlObj.protocol.toLowerCase();

    // Normaliser le hostname en minuscules
    const hostname = urlObj.hostname.toLowerCase();

    // Normaliser le chemin en supprimant les slashes de fin
    let pathname = urlObj.pathname;
    if (pathname !== "/" && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }

    // Reconstruire l'URL normalisée
    const normalizedUrl = `${protocol}//${hostname}${pathname}${urlObj.search}${urlObj.hash}`;
    return normalizedUrl;
  } catch (e) {
    return url;
  }
}

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

  Object.entries(imagesData).forEach(([pageUrl, data]) => {
    try {
      if (data && data.images) {
        if (data.images.data && Array.isArray(data.images.data)) {

          imageUrls[pageUrl] = data.images.data
            .filter(img => {
              if (!img || !img.src) {
                return false;
              }
              return true;
            })
            .map(img => {
              const absoluteUrl = getAbsoluteImageUrl(img.src, pageUrl);
              return {
                url: absoluteUrl,
                title: img.title || undefined,
                alt: img.alt || undefined
              };
            });
        }
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


      const imageSection = uniquePageImages.length > 0
        ? uniquePageImages.map(img => {
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

  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries}
</urlset>`;

  return sitemap;
}

function getCharset(contentType: string): string | null {
  const match = contentType.match(/charset=([^;]+)/i);
  return match ? match[1].trim() : null;
}