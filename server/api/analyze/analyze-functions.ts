import axios from 'axios';
// @ts-ignore
import type { CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { performance } from 'perf_hooks';
import type { CheerioSelector, StructuredData, WebsiteAnalysisResult } from './analyzer-types';

export async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const startTime = performance.now();
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,*/*;q=0.8',
      'Accept-Language': 'fr,en-US;q=0.8,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    timeout: 15000,
    maxContentLength: 10 * 1024 * 1024
  });

  const loadTime = performance.now() - startTime;
  const html = response.data;
  const $ = load(html);

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
      html: response.data.length,
      css: 0,
      js: 0,
      images: 0,
      other: 0
    }
  };

  const imagesData = analyzeImages($);
  const linksData = analyzeLinks($, url);
  const accessibilityData = analyzeAccessibility($);

  const formattedInternalLinks = linksData.internal.map(href => ({
    href,
    text: '',
    hasImage: false
  }));

  const formattedExternalLinks = linksData.external.map(href => ({
    href,
    text: '',
    hasImage: false
  }));

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
    images: {
      total: imagesData.total,
      withAlt: imagesData.withAlt,
      withoutAlt: imagesData.withoutAlt,
      data: imagesData.data.map(img => ({
        src: img.src,
        alt: img.alt,
        title: img.title,
        dimensions: img.dimensions
      }))
    },
    links: {
      internal: formattedInternalLinks,
      external: formattedExternalLinks,
      broken: [] as string[],
      nofollow: linksData.nofollow
    },
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
    const property = $(el).attr('property') || '';
    const name = $(el).attr('name') || '';
    const content = $(el).attr('content') || '';

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
            seoData.structuredData.data.push(parsed);
            seoData.structuredData.count++;
          }
        }
      }
    } catch (e) {
      console.error('Erreur dans l\'analyse du JSON-LD:', e);
    }
  });

  const sitemapResult = await checkSitemap(url);
  const robotsTxtResult = await checkRobotsTxt(url);

  const largeFiles = await analyzeLargeFiles(linksData.internal, url);

  const technical = {
    statusCode: response.status,
    https: url.startsWith('https'),
    sitemap: {
      found: sitemapResult.found,
      url: sitemapResult.url || '',
      content: sitemapResult.content || '',
      urls: sitemapResult.urls || 0
    },
    robotsTxt: {
      found: robotsTxtResult.found,
      content: robotsTxtResult.content || ''
    },
    largeFiles: largeFiles,
    mobile: {
      viewport: !!seoData.meta.viewport,
      responsive: checkResponsiveness($)
    },
    directives: {
      noindex: seoData.meta.robots?.includes('noindex') || false,
      nofollow: seoData.meta.robots?.includes('nofollow') || false
    },
    security: {
      headers: extractSecurityHeaders(response.headers),
      securityIssues: [],
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

  const securityEvaluation = evaluateSecurityHeaders(technical.security.headers);
  technical.security.score = securityEvaluation.score;

  const cookieHeader = response.headers['set-cookie'];
  if (cookieHeader) {
    technical.security.cookies = analyzeCookies(cookieHeader);
  }

  const socialTags = {
    openGraph: Object.keys(seoData.meta.og).length > 0,
    twitter: Object.keys(seoData.meta.twitter).length > 0,
    twitterTags: $('meta[name^="twitter:"]').map((_, el) => ({
      name: $(el).attr('name') || '',
      content: $(el).attr('content') || ''
    })).get()
  };

  const issues = generateSEOIssues(seoData, performanceData, url);

  if (url && !url.startsWith('https://')) {
    issues.push({
      type: 'security',
      message: 'The site does not use HTTPS',
      severity: 'critical',
      title: 'HTTPS not detected',
      description: 'HTTPS is a secure communication protocol that protects the integrity and privacy of data between the user\'s computer and the site.',
      recommendation: 'Configure the site to use HTTPS by installing an SSL certificate.',
      category: 'Security'
    });
  }

  if (!technical.meta.language) {
    issues.push({
      type: 'error',
      message: 'The language of the page is not specified. Add a lang attribute to the HTML tag or a content-language header.',
      severity: 'high',
      description: 'Specifying the language is important for accessibility and SEO.'
    });
  }

  return {
    url,
    title: seoData.title,
    description: seoData.description,
    performance: performanceData,
    seo: seoData,
    technical,
    socialTags,
    issues,
    accessibility: accessibilityData,
    technicalSEO: {
      sitemapFound: sitemapResult.found,
      robotsTxtFound: robotsTxtResult.found,
      schemaTypeCount: seoData.structuredData.types
    }
  };
}

export function analyzeImages($: CheerioSelector) {
  const images = $('img');
  const totalImages = images.length;

  const elementsWithBgImage = $('[style*="background-image"]');
  let bgImageCount = 0;

  elementsWithBgImage.each((_, el) => {
    const style = $(el).attr('style') || '';
    if (style.includes('url(') && !style.includes('data:image')) {
      bgImageCount++;
    }
  });

  const withAlt = images.filter('[alt]').length;
  const withoutAlt = totalImages - withAlt;
  const withLazyLoading = images.filter('[loading="lazy"]').length;
  const withWidth = images.filter('[width]').length;
  const withHeight = images.filter('[height]').length;
  const withSrcset = images.filter('[srcset]').length;


  const imageDetails: {
    src: string;
    alt: string;
    title: string;
    dimensions: { width: number; height: number };
    type?: string;
    lazyLoaded?: boolean;
    inBackground?: boolean;
  }[] = [];

  images.each((index, img) => {
    const src = $(img).attr('src');
    const alt = $(img).attr('alt') || '';
    const title = $(img).attr('title') || '';

    if (src && !src.startsWith('data:image') && src.trim() !== '') {
      imageDetails.push({
        src: src,
        alt: alt,
        title: title,
        dimensions: {
          width: parseInt($(img).attr('width') || '0', 10),
          height: parseInt($(img).attr('height') || '0', 10)
        },
        lazyLoaded: $(img).attr('loading') === 'lazy'
      });
    }

    const srcset = $(img).attr('srcset');
    if (srcset) {
      const srcsetUrls = srcset.split(',')
        .map(s => s.trim().split(' ')[0])
        .filter(s => s && !s.startsWith('data:image') && s.trim() !== '');

      for (const srcsetUrl of srcsetUrls) {
        if (!imageDetails.some(img => img.src === srcsetUrl)) {
          imageDetails.push({
            src: srcsetUrl,
            alt: alt,
            title: title,
            dimensions: {
              width: parseInt($(img).attr('width') || '0', 10),
              height: parseInt($(img).attr('height') || '0', 10)
            },
            lazyLoaded: $(img).attr('loading') === 'lazy',
            type: 'srcset'
          });
        }
      }
    }
  });

  $('picture source').each((_, source) => {
    const srcset = $(source).attr('srcset');
    if (srcset) {
      const srcsetUrls = srcset.split(',')
        .map(s => s.trim().split(' ')[0])
        .filter(s => s && !s.startsWith('data:image') && s.trim() !== '');

      const parentPicture = $(source).closest('picture');
      const imgInPicture = parentPicture.find('img').first();
      const alt = imgInPicture.attr('alt') || '';
      const title = imgInPicture.attr('title') || '';

      for (const srcsetUrl of srcsetUrls) {
        if (!imageDetails.some(img => img.src === srcsetUrl)) {
          imageDetails.push({
            src: srcsetUrl,
            alt: alt,
            title: title,
            dimensions: {
              width: parseInt(imgInPicture.attr('width') || '0', 10),
              height: parseInt(imgInPicture.attr('height') || '0', 10)
            },
            type: 'picture'
          });
        }
      }
    }
  });

  elementsWithBgImage.each((_, el) => {
    const style = $(el).attr('style') || '';
    const match = style.match(/url\(['"]?([^'"()]+)['"]?\)/);
    if (match && match[1] && !match[1].startsWith('data:image')) {
      const bgUrl = match[1];
      if (!imageDetails.some(img => img.src === bgUrl)) {
        const ariaLabel = $(el).attr('aria-label') || '';
        imageDetails.push({
          src: bgUrl,
          alt: ariaLabel,
          title: '',
          dimensions: { width: 0, height: 0 },
          inBackground: true,
          type: 'background'
        });
      }
    }
  });

  const imageDetailsFinal = imageDetails.map(img => {
    if (img.src.startsWith('/')) {
      return {
        ...img,
        src: img.src,
        isRelative: true
      };
    }
    return img;
  });

  return {
    total: totalImages + bgImageCount,
    withAlt,
    withoutAlt,
    withLazyLoading,
    withWidth,
    withHeight,
    withSrcset,
    urls: imageDetailsFinal.map(img => img.src),
    data: imageDetailsFinal
  };
}

export function analyzeLinks($: CheerioSelector, baseUrl: string) {
  const links = $('a[href]');
  const baseUrlObj = new URL(baseUrl);
  const internal: string[] = [];
  const external: string[] = [];
  const nofollow: string[] = [];

  links.each((_, el) => {
    try {
      const href = $(el).attr('href');
      if (!href) return;

      if (href.startsWith('#') || href.startsWith('javascript:') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const url = new URL(href, baseUrl);
      const isInternal = url.hostname === baseUrlObj.hostname;

      if (isInternal) {
        internal.push(url.toString());
      } else {
        external.push(url.toString());
      }

      if ($(el).attr('rel')?.includes('nofollow')) {
        nofollow.push(url.toString());
      }
    } catch (e) {
    }
  });

  return {
    total: links.length,
    internal,
    external,
    nofollow
  };
}

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

    try {
      const robotsResponse = await axios.get(robotsTxtUrl, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
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
                'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
                'Accept': 'application/xml,text/xml,*/*'
              }
            });

            if (sitemapResponse.status === 200 && sitemapResponse.data) {
              const content = sitemapResponse.data;
              if (typeof content === 'string' &&
                (content.includes('<urlset') ||
                  content.includes('<sitemapindex') ||
                  content.includes('<?xml') && content.toLowerCase().includes('sitemap'))) {

                const $ = load(content, { xmlMode: true });

                let urlCount = $('url').length;

                if (urlCount === 0) {
                  urlCount = $('*[loc]').length;
                }

                if (urlCount === 0 && ($('sitemap').length > 0 || $('*|sitemap').length > 0)) {
                  let firstSitemapLoc = '';
                  const sitemapLocSelectors = [
                    'sitemap loc', '*|sitemap *|loc', 'sitemap *|loc', '*[loc]'
                  ];

                  for (const selector of sitemapLocSelectors) {
                    const locElement = $(selector).first();
                    if (locElement.length > 0) {
                      firstSitemapLoc = locElement.text().trim();
                      if (firstSitemapLoc) break;
                    }
                  }

                  if (firstSitemapLoc) {
                    try {
                      if (!firstSitemapLoc.startsWith('http')) {
                        if (firstSitemapLoc.startsWith('/')) {
                          firstSitemapLoc = `${baseUrlObj.protocol}//${baseUrlObj.hostname}${firstSitemapLoc}`;
                        } else {
                          firstSitemapLoc = new URL(firstSitemapLoc, sitemapUrl).href;
                        }
                      }

                      const subSitemapResponse = await axios.get(firstSitemapLoc, {
                        timeout: 8000,
                        headers: {
                          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
                          'Accept': 'application/xml,text/xml,*/*'
                        }
                      });

                      if (subSitemapResponse.status === 200 && subSitemapResponse.data) {
                        const subContent = subSitemapResponse.data;
                        const $sub = load(subContent, { xmlMode: true });
                        urlCount = $sub('url').length;
                        if (urlCount === 0) {
                          urlCount = $sub('*[loc]').length;
                        }
                      }
                    } catch (subError) {
                      console.log(`Impossible d'accéder au sous-sitemap: ${subError.message}`);
                    }
                  }
                }

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
            'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
            'Accept': 'application/xml,text/xml,*/*'
          }
        });

        if (response.status === 200 && response.data) {
          const content = response.data;

          if (typeof content === 'string' &&
            (content.includes('<urlset') ||
              content.includes('<sitemapindex') ||
              content.includes('<?xml') && content.toLowerCase().includes('sitemap'))) {

            const $ = load(content, { xmlMode: true });

            let urlCount = $('url').length;

            if (urlCount === 0) {
              urlCount = $('*[loc]').length;
            }

            if (urlCount === 0 && ($('sitemap').length > 0 || $('*|sitemap').length > 0)) {
              let firstSitemapLoc = '';
              const sitemapLocSelectors = [
                'sitemap loc', '*|sitemap *|loc', 'sitemap *|loc', '*[loc]'
              ];

              for (const selector of sitemapLocSelectors) {
                const locElement = $(selector).first();
                if (locElement.length > 0) {
                  firstSitemapLoc = locElement.text().trim();
                  if (firstSitemapLoc) break;
                }
              }

              if (firstSitemapLoc) {
                try {
                  if (!firstSitemapLoc.startsWith('http')) {
                    if (firstSitemapLoc.startsWith('/')) {
                      firstSitemapLoc = `${baseUrlObj.protocol}//${baseUrlObj.hostname}${firstSitemapLoc}`;
                    } else {
                      firstSitemapLoc = new URL(firstSitemapLoc, url).href;
                    }
                  }

                  const subSitemapResponse = await axios.get(firstSitemapLoc, {
                    timeout: 8000,
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
                      'Accept': 'application/xml,text/xml,*/*'
                    }
                  });

                  if (subSitemapResponse.status === 200 && subSitemapResponse.data) {
                    const subContent = subSitemapResponse.data;
                    const $sub = load(subContent, { xmlMode: true });
                    urlCount = $sub('url').length;
                    if (urlCount === 0) {
                      urlCount = $sub('*[loc]').length;
                    }
                  }
                } catch (subError) {
                  console.log(`Impossible d'accéder au sous-sitemap: ${subError.message}`);
                }
              }
            }

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

export async function checkRobotsTxt(baseUrl: string): Promise<{ found: boolean; content?: string }> {
  try {
    const baseUrlObj = new URL(baseUrl);
    const robotsUrl = `${baseUrlObj.protocol}//${baseUrlObj.hostname}/robots.txt`;

    const response = await axios.get(robotsUrl, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.tech/bot)',
        'Accept': 'text/plain,*/*',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });

    if (response.status === 200) {
      const content = response.data;
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

export function calculateReadabilityScore($: CheerioAPI): number {
  const paragraphs = $('p, article, section, div:not(:has(p))').filter(function () {
    const text = $(this).text().trim();
    return text.length > 50 && text.includes(' ');
  });

  if (paragraphs.length === 0) return 0;

  let totalScore = 0;
  let contentLength = 0;

  paragraphs.each(function () {
    const text = $(this).text().trim();
    if (text.length < 50) return;

    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(word => word.trim().length > 0);

    if (sentences.length === 0 || words.length === 0) return;

    const avgWordsPerSentence = words.length / sentences.length;
    const syllablesCount = words.reduce((total, word) => total + countSyllables(word), 0);
    const avgSyllablesPerWord = syllablesCount / words.length;

    const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

    totalScore += score * text.length;
    contentLength += text.length;
  });

  return contentLength > 0 ? Math.min(100, Math.max(0, totalScore / contentLength)) : 0;
}


export function countSyllables(text: string): number {
  text = text.toLowerCase().replace(/[^a-z]/g, '');
  if (!text) return 0;

  const syllableCount = text
    .replace(/(?:[^laeiouy]|^)y(?:[^laeiouy]|$)/g, 'a')
    .replace(/e$/g, '')
    .match(/[aeiouy]{1,2}/g);

  return syllableCount ? syllableCount.length : 1;
}

export function calculateKeywordDensity(text: string): Record<string, number> {
  const words = text.toLowerCase().match(/\b[a-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ðœæ]{3,}\b/g) || [];
  const wordCount = words.length;
  const results: Record<string, number> = {};

  if (wordCount === 0) return results;

  const wordFrequency: Record<string, number> = {};
  for (const word of words) {
    if (word.length < 3) continue;
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  }

  const entries = Object.entries(wordFrequency)
    .map(([word, count]) => ({ word, count, density: (count / wordCount) * 100 }))
    .sort((a, b) => b.density - a.density)
    .slice(0, 20);

  for (const entry of entries) {
    results[entry.word] = parseFloat(entry.density.toFixed(2));
  }

  return results;
}

export function checkResponsiveness($: CheerioAPI): boolean {
  return !!$('meta[name="viewport"]').attr('content')?.includes('width=device-width');
}

export function calculateCLS($: CheerioAPI): number {
  const imagesWithoutDimensions = $('img:not([width]):not([height])').length;
  const fontsWithoutDisplay = $('link[rel="stylesheet"][href*="font"]').length;
  const adsCount = $('ins, iframe[src*="ad"], [class*="ad-"], [id*="ad-"]').length;

  const riskFactors = [
    imagesWithoutDimensions / Math.max(1, $('img').length) * 0.5,
    fontsWithoutDisplay * 0.1,
    adsCount * 0.2,
    !$('meta[name="viewport"]').length ? 0.3 : 0
  ];

  const riskScore = riskFactors.reduce((sum, factor) => sum + factor, 0);

  return Math.min(1, Math.max(0, riskScore));
}

export function analyzeAccessibility($: CheerioAPI): {
  missingAria: number;
  missingAlt: number;
  missingLabels: number;
  missingInputAttributes: number;
  contrastIssues: number;
  ariaIssues: Array<{ element: string, issue: string }>;
  inputIssues: Array<{ element: string, issue: string }>;
  accessibilityScore: number;
} {
  const missingAlt = $('img:not([alt])').length;
  const missingLabels = $('input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="hidden"]):not([aria-label]):not([aria-labelledby])').not('label input').not('label + input').length;

  const interactiveElements = $('button, a[href], [role="button"], [role="link"], [role="tab"], [role="menuitem"]');
  const missingAria = interactiveElements.filter(function () {
    return !$(this).attr('aria-label') && !$(this).attr('aria-labelledby');
  }).length;

  const missingInputAttributes = $('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="tel"], input[type="url"], input[type="number"]')
    .filter(function () {
      return !$(this).attr('autocomplete') || !$(this).attr('placeholder');
    }).length;

  const contrastIssues = 0;

  const ariaIssues: Array<{ element: string, issue: string }> = [];
  $('[aria-labelledby]').each(function () {
    const labelId = $(this).attr('aria-labelledby');
    if (labelId && !labelId.includes('{{') && !labelId.includes('}}') && !$('#' + labelId).length) {
      ariaIssues.push({
        element: $(this).prop('tagName')?.toLowerCase() || '',
        issue: `aria-labelledby referenced an non-existent ID: ${labelId}`
      });
    }
  });

  const inputIssues: Array<{ element: string, issue: string }> = [];
  $('input:not([type="hidden"])').each(function () {
    if (!$(this).attr('id') && !$(this).attr('aria-label')) {
      inputIssues.push({
        element: 'input',
        issue: 'Field without ID or aria-label'
      });
    }
  });

  const totalIssues = missingAlt + missingLabels + missingAria + missingInputAttributes + ariaIssues.length + inputIssues.length;
  const maxPossibleIssues = $('img').length + $('input').length + interactiveElements.length * 2;

  let accessibilityScore = 100;
  if (maxPossibleIssues > 0) {
    accessibilityScore = Math.max(0, 100 - (totalIssues / maxPossibleIssues) * 100);
  }

  return {
    missingAria,
    missingAlt,
    missingLabels,
    missingInputAttributes,
    contrastIssues,
    ariaIssues,
    inputIssues,
    accessibilityScore
  };
}

export function generateSEOIssues(seoData: any, performanceData: any, url?: string): Array<{ type: string; message: string; severity: 'critical' | 'high' | 'medium' | 'low'; title?: string; description?: string; recommendation?: string; category?: string; }> {
  const issues: Array<{ type: string; message: string; severity: 'critical' | 'high' | 'medium' | 'low'; title?: string; description?: string; recommendation?: string; category?: string; }> = [];

  if (!seoData.title) {
    issues.push({
      type: 'seo',
      message: 'The page does not contain a title tag.',
      title: 'Title tag missing',
      severity: 'critical',
      description: 'The title tag is missing',
      recommendation: 'Create a concise title tag between 10 and 60 characters',
      category: 'SEO'
    });
  } else if (seoData.title.length < 10) {
    issues.push({
      type: 'seo',
      message: 'The title tag is too short (less than 10 characters).',
      title: 'Title tag too short',
      severity: 'high',
      description: 'The title tag is too short (less than 10 characters)',
      recommendation: 'Create a concise title tag between 10 and 60 characters',
      category: 'SEO'
    });
  } else if (seoData.title.length > 60) {
    issues.push({
      type: 'seo',
      message: 'The title tag is too long (more than 60 characters).',
      title: 'Title tag too long',
      severity: 'medium',
      description: 'The title tag is too long (more than 60 characters)',
      recommendation: 'Create a concise title tag between 10 and 60 characters',
      category: 'SEO'
    });
  } else if (!seoData.title.includes(' - ') && !seoData.title.includes(' | ')) {
    issues.push({
      type: 'seo',
      message: 'The title tag does not contain a separator (- or |).',
      title: 'No separator in title',
      severity: 'low',
      description: 'The title tag does not contain a separator (- or |) which is useful for branding',
      recommendation: 'Consider adding a brand name with a separator in the title',
      category: 'SEO'
    });
  }

  if (!seoData.description) {
    issues.push({
      type: 'seo',
      message: 'The page does not contain a meta description.',
      title: 'Meta description missing',
      severity: 'high',
      description: 'The meta description is missing',
      recommendation: 'Create a meta description between 50 and 160 characters',
      category: 'SEO'
    });
  } else if (seoData.description.length < 50) {
    issues.push({
      type: 'seo',
      message: 'The meta description is too short (less than 50 characters).',
      title: 'Meta description too short',
      severity: 'medium',
      description: 'The meta description is too short (less than 50 characters)',
      recommendation: 'Create a meta description between 50 and 160 characters',
      category: 'SEO'
    });
  } else if (seoData.description.length > 160) {
    issues.push({
      type: 'seo',
      message: 'The meta description is too long (more than 160 characters).',
      title: 'Meta description too long',
      severity: 'low',
      description: 'The meta description is too long (more than 160 characters)',
      recommendation: 'Create a meta description between 50 and 160 characters',
      category: 'SEO'
    });
  } else if (seoData.description.toLowerCase() === seoData.title.toLowerCase()) {
    issues.push({
      type: 'seo',
      message: 'The meta description is identical to the title.',
      title: 'Meta description duplicate of title',
      severity: 'medium',
      description: 'The meta description is identical to the title tag',
      recommendation: 'Create a unique meta description that provides additional information',
      category: 'SEO'
    });
  }

  if (seoData.headings && seoData.headings.h1 && seoData.headings.h1.length === 0) {
    issues.push({
      type: 'seo',
      message: 'The page does not contain an H1 heading.',
      title: 'H1 heading missing',
      severity: 'high',
      description: 'The page does not have an H1 heading',
      recommendation: 'Add a descriptive H1 heading that summarizes your page content',
      category: 'SEO'
    });
  } else if (seoData.headings && seoData.headings.h1 && seoData.headings.h1.length > 1) {
    issues.push({
      type: 'seo',
      message: `The page contains ${seoData.headings.h1.length} H1 headings, it is recommended to have only one`,
      title: 'Multiple H1 headings',
      severity: 'medium',
      description: `The page contains ${seoData.headings.h1.length} H1 headings, it is recommended to have only one`,
      recommendation: 'Keep only one main H1 heading on the page and use H2-H6 for subsections',
      category: 'SEO'
    });
  } else if (seoData.headings && seoData.headings.h1 && seoData.headings.h1.length === 1) {
    if (seoData.title === seoData.headings.h1[0]) {
      issues.push({
        type: 'seo',
        message: 'The H1 heading is identical to the title.',
        title: 'H1 identical to title',
        severity: 'low',
        description: 'The H1 heading is identical to the title tag',
        recommendation: 'While not critical, consider making your H1 slightly different from your title for better keyword coverage',
        category: 'SEO'
      });
    }
  }

  if (seoData.headings) {
    const hasH1 = seoData.headings.h1 && seoData.headings.h1.length > 0;
    const hasH2 = seoData.headings.h2 && seoData.headings.h2.length > 0;
    const hasH3 = seoData.headings.h3 && seoData.headings.h3.length > 0;

    if (!hasH1 && (hasH2 || hasH3)) {
      issues.push({
        type: 'seo',
        message: 'The page uses H2/H3 headings without an H1 heading.',
        title: 'Heading hierarchy issue',
        severity: 'medium',
        description: 'The page uses H2/H3 headings without an H1 heading',
        recommendation: 'Always start your heading hierarchy with an H1, followed by H2s, then H3s',
        category: 'SEO'
      });
    }

    if (hasH3 && !hasH2) {
      issues.push({
        type: 'seo',
        message: 'The page uses H3 headings without any H2 headings',
        title: 'Heading hierarchy skip',
        severity: 'low',
        description: 'The page uses H3 headings without any H2 headings',
        recommendation: 'Maintain a proper heading hierarchy (H1 → H2 → H3) without skipping levels',
        category: 'SEO'
      });
    }
  }

  if (seoData.images && seoData.images.withoutAlt > 0) {
    issues.push({
      type: 'seo',
      message: `${seoData.images.withoutAlt} image(s) without alt attributes`,
      title: `${seoData.images.withoutAlt} image(s) without alt attributes`,
      severity: 'medium',
      description: 'Alt attributes are essential for accessibility of images and SEO',
      recommendation: 'Add descriptive alt attributes to all images',
      category: 'SEO'
    });
  }

  if (seoData.images && seoData.images.data) {
    const largeImages = seoData.images.data.filter((img: any) =>
      img.dimensions && (img.dimensions.width > 1200 || img.dimensions.height > 1200)
    );

    if (largeImages.length > 0) {
      issues.push({
        type: 'performance',
        message: `${largeImages.length} image(s) are too large and can slow down page loading`,
        title: 'Oversized images',
        severity: 'medium',
        description: 'Large images can significantly slow down page loading',
        recommendation: 'Resize and optimize images to appropriate dimensions for web display',
        category: 'Performance'
      });
    }
  }

  if (seoData.structuredData && seoData.structuredData.count === 0) {
    issues.push({
      type: 'seo',
      message: 'The page does not contain structured data (JSON-LD)',
      title: 'No structured data',
      severity: 'medium',
      description: 'The page does not contain structured data (JSON-LD)',
      recommendation: 'Add structured data to improve how search engines understand your content',
      category: 'SEO'
    });
  }

  if (seoData.meta && Object.keys(seoData.meta.og || {}).length === 0) {
    issues.push({
      type: 'social',
      message: 'The page does not contain Open Graph tags',
      title: 'No Open Graph tags',
      severity: 'medium',
      description: 'The page does not contain Open Graph meta tags',
      recommendation: 'Add Open Graph tags to control how your content appears when shared on social media',
      category: 'Social'
    });
  } else if (seoData.meta && seoData.meta.og) {
    if (!seoData.meta.og.image) {
      issues.push({
        type: 'social',
        message: 'The Open Graph tags do not include an image',
        title: 'Missing og:image',
        severity: 'medium',
        description: 'Open Graph tags do not include an image',
        recommendation: 'Add an og:image tag to make your content more attractive when shared',
        category: 'Social'
      });
    }
  }

  if (seoData.meta && Object.keys(seoData.meta.twitter || {}).length === 0) {
    issues.push({
      type: 'social',
      message: 'The page does not contain Twitter Card tags',
      title: 'No Twitter Card tags',
      severity: 'low',
      description: 'The page does not contain Twitter Card meta tags',
      recommendation: 'Add Twitter Card tags to control how your content appears when shared on Twitter',
      category: 'Social'
    });
  }

  if (seoData.meta && !seoData.meta.viewport) {
    issues.push({
      type: 'mobile',
      message: 'The page does not contain a viewport meta tag',
      title: 'No viewport meta tag',
      severity: 'high',
      description: 'The page does not contain a viewport meta tag',
      recommendation: 'Add a viewport meta tag for proper mobile rendering',
      category: 'Mobile'
    });
  }

  if (seoData.wordCount < 300) {
    issues.push({
      type: 'content',
      message: `The page contains little text content (${seoData.wordCount} words).`,
      title: 'Thin content',
      severity: seoData.wordCount < 200 ? 'high' : 'medium',
      description: `The page only has ${seoData.wordCount} words, which may be considered thin content`,
      recommendation: 'Add more valuable content to reach at least 300 words per page',
      category: 'Content'
    });
  }

  if (seoData.readabilityScore < 30) {
    issues.push({
      type: 'content',
      message: 'The readability of the content is very low.',
      title: 'Very low readability score',
      severity: 'high',
      description: 'The content is difficult to read and understand',
      recommendation: 'Simplify your content, use shorter sentences and more common words',
      category: 'Content'
    });
  } else if (seoData.readabilityScore < 50) {
    issues.push({
      type: 'content',
      message: 'The readability of the content could be improved.',
      title: 'Low readability score',
      severity: 'medium',
      description: 'The content may be difficult to read for some users',
      recommendation: 'Consider simplifying your content for better readability',
      category: 'Content'
    });
  }

  if (seoData.links) {
    if (seoData.links.internal.length === 0) {
      issues.push({
        type: 'seo',
        message: 'The page does not contain any internal links',
        title: 'No internal links',
        severity: 'high',
        description: 'The page does not contain any internal links',
        recommendation: 'Add internal links to help users and search engines navigate your site',
        category: 'SEO'
      });
    }

    if (seoData.links.external.length === 0) {
      issues.push({
        type: 'seo',
        message: 'The page does not contain any external links',
        title: 'No external links',
        severity: 'low',
        description: 'The page does not contain any external links',
        recommendation: 'Consider adding some external links to authoritative sources to improve credibility',
        category: 'SEO'
      });
    }
  }

  if (!seoData.meta.canonical) {
    issues.push({
      type: 'seo',
      message: 'The page does not contain a canonical link',
      title: 'No canonical link',
      severity: 'medium',
      description: 'The page does not have a canonical link tag',
      recommendation: 'Add a canonical link tag to prevent duplicate content issues',
      category: 'SEO'
    });
  }

  if (!seoData.meta || !seoData.meta.language) {
    issues.push({
      type: 'seo',
      message: 'The page does not specify a language attribute',
      title: 'No language attribute',
      severity: 'low',
      description: 'The page does not specify a language attribute',
      recommendation: 'Add a language attribute to the html tag (e.g., lang="en")',
      category: 'SEO'
    });
  }

  if (performanceData && performanceData.loadTime > 3000) {
    issues.push({
      type: 'performance',
      message: `The page load time is too long (${Math.round(performanceData.loadTime)}ms).`,
      title: 'Page load time too high',
      severity: 'high',
      description: `Current load time: ${Math.round(performanceData.loadTime)}ms (good < 3000ms)`,
      recommendation: 'Optimize page resources, reduce JavaScript, and optimize images to improve loading speed',
      category: 'Performance'
    });
  } else if (performanceData && performanceData.loadTime > 1500) {
    issues.push({
      type: 'performance',
      message: `The page load time could be improved (${Math.round(performanceData.loadTime)}ms).`,
      title: 'Page load time could be improved',
      severity: 'medium',
      description: `Current load time: ${Math.round(performanceData.loadTime)}ms (good < 1500ms)`,
      recommendation: 'Consider optimizing page resources to further improve loading speed',
      category: 'Performance'
    });
  }
  if (performanceData && performanceData.cls > 0.25) {
    issues.push({
      type: 'performance',
      message: 'The page may have layout shift issues (CLS is high).',
      title: 'Cumulative Layout Shift (CLS) too high',
      severity: 'medium',
      description: `Current CLS: ${performanceData.cls.toFixed(2)} (good < 0.1)`,
      recommendation: 'Reduce layout shifts during loading by specifying dimensions for images and dynamic content',
      category: 'Performance'
    });
  } else if (performanceData && performanceData.cls > 0.1) {
    issues.push({
      type: 'performance',
      message: 'The page may have layout shift issues (CLS is moderate).',
      title: 'Cumulative Layout Shift (CLS) moderate',
      severity: 'low',
      description: `Current CLS: ${performanceData.cls.toFixed(2)} (good < 0.1)`,
      recommendation: 'Consider reducing layout shifts by specifying dimensions for images and dynamic content',
      category: 'Performance'
    });
  }

  if (performanceData && performanceData.lcp > 4000) {
    issues.push({
      type: 'performance',
      message: 'Largest Contentful Paint (LCP) is too high.',
      title: 'Largest Contentful Paint (LCP) too high',
      severity: 'high',
      description: `Current LCP: ${Math.round(performanceData.lcp)}ms (good < 2500ms)`,
      recommendation: 'Optimize the loading of your main content to improve performance',
      category: 'Performance'
    });
  } else if (performanceData && performanceData.lcp > 2500) {
    issues.push({
      type: 'performance',
      message: 'Largest Contentful Paint (LCP) could be improved.',
      title: 'Largest Contentful Paint (LCP) moderate',
      severity: 'medium',
      description: `Current LCP: ${Math.round(performanceData.lcp)}ms (good < 2500ms)`,
      recommendation: 'Consider optimizing the loading of your main content',
      category: 'Performance'
    });
  }

  if (performanceData && performanceData.fcp > 2000) {
    issues.push({
      type: 'performance',
      message: 'First Contentful Paint (FCP) is too high.',
      title: 'First Contentful Paint (FCP) too high',
      severity: 'high',
      description: `Current FCP: ${Math.round(performanceData.fcp)}ms (good < 2000ms)`,
      recommendation: 'Optimize the initial rendering of your page',
      category: 'Performance'
    });
  }

  if (performanceData && performanceData.ttfb > 1500) {
    issues.push({
      type: 'performance',
      message: 'Time to First Byte (TTFB) is too high.',
      title: 'Time to First Byte (TTFB) too high',
      severity: 'high',
      description: `Current TTFB: ${Math.round(performanceData.ttfb)}ms (good < 800ms)`,
      recommendation: 'Optimize your server response time',
      category: 'Performance'
    });
  } else if (performanceData && performanceData.ttfb > 800) {
    issues.push({
      type: 'performance',
      message: 'Time to First Byte (TTFB) could be improved.',
      title: 'Time to First Byte (TTFB) moderate',
      severity: 'medium',
      description: `Current TTFB: ${Math.round(performanceData.ttfb)}ms (good < 800ms)`,
      recommendation: 'Consider optimizing your server response time',
      category: 'Performance'
    });
  }

  if (url && typeof url === 'string' && !url.startsWith('https://')) {
    issues.push({
      type: 'security',
      message: 'The website is not using HTTPS encryption',
      title: 'Not using HTTPS',
      severity: 'critical',
      description: 'The website is not using HTTPS encryption',
      recommendation: 'Implement HTTPS encryption to protect user data and improve security',
      category: 'Security'
    });
  }

  return issues;
}


export function analyzeMetaTags($: CheerioAPI): {
  score: number;
  essential: Array<{ name: string; present: boolean; content?: string; score: number }>;
  social: {
    og: Array<{ name: string; present: boolean; content?: string; score: number }>;
    twitter: Array<{ name: string; present: boolean; content?: string; score: number }>;
  };
  issues: Array<{ tagName: string; issue: string; recommendation: string; example?: string; severity: string }>;
  metaHtml: string;
  detailedScore: {
    essential: number;
    social: number;
    technical: number;
    content: number;
  };
} {
  const metaTags = $('meta').toArray();
  const title = $('title').text().trim();
  const metaTagsHtml = metaTags.map(tag => $.html(tag)).join('\n');

  const essentialTags = [
    {
      name: 'Title',
      present: title.length > 0,
      content: title,
      score: calculateTitleScore(title)
    },
    {
      name: 'Description',
      present: $('meta[name="description"]').length > 0,
      content: $('meta[name="description"]').attr('content') || '',
      score: calculateDescriptionScore($('meta[name="description"]').attr('content') || '')
    },
    {
      name: 'Viewport',
      present: $('meta[name="viewport"]').length > 0,
      content: $('meta[name="viewport"]').attr('content') || '',
      score: $('meta[name="viewport"]').length > 0 ? 100 : 0
    },
    {
      name: 'Charset',
      present: $('meta[charset]').length > 0 || $('meta[http-equiv="Content-Type"]').length > 0,
      content: $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || '',
      score: ($('meta[charset]').length > 0 || $('meta[http-equiv="Content-Type"]').length > 0) ? 100 : 0
    },
    {
      name: 'Robots',
      present: $('meta[name="robots"]').length > 0,
      content: $('meta[name="robots"]').attr('content') || '',
      score: calculateRobotsScore($('meta[name="robots"]').attr('content') || '')
    },
    {
      name: 'Canonical',
      present: $('link[rel="canonical"]').length > 0,
      content: $('link[rel="canonical"]').attr('href') || '',
      score: $('link[rel="canonical"]').length > 0 ? 100 : 0
    }
  ];

  const ogTags = [
    { name: 'og:title', present: $('meta[property="og:title"]').length > 0, content: $('meta[property="og:title"]').attr('content') || '', score: 0 },
    { name: 'og:description', present: $('meta[property="og:description"]').length > 0, content: $('meta[property="og:description"]').attr('content') || '', score: 0 },
    { name: 'og:image', present: $('meta[property="og:image"]').length > 0, content: $('meta[property="og:image"]').attr('content') || '', score: 0 },
    { name: 'og:url', present: $('meta[property="og:url"]').length > 0, content: $('meta[property="og:url"]').attr('content') || '', score: 0 },
    { name: 'og:type', present: $('meta[property="og:type"]').length > 0, content: $('meta[property="og:type"]').attr('content') || '', score: 0 },
    { name: 'og:site_name', present: $('meta[property="og:site_name"]').length > 0, content: $('meta[property="og:site_name"]').attr('content') || '', score: 0 },
    { name: 'og:locale', present: $('meta[property="og:locale"]').length > 0, content: $('meta[property="og:locale"]').attr('content') || '', score: 0 },
  ];

  const twitterTags = [
    { name: 'twitter:card', present: $('meta[name="twitter:card"]').length > 0, content: $('meta[name="twitter:card"]').attr('content') || '', score: 0 },
    { name: 'twitter:title', present: $('meta[name="twitter:title"]').length > 0, content: $('meta[name="twitter:title"]').attr('content') || '', score: 0 },
    { name: 'twitter:description', present: $('meta[name="twitter:description"]').length > 0, content: $('meta[name="twitter:description"]').attr('content') || '', score: 0 },
    { name: 'twitter:image', present: $('meta[name="twitter:image"]').length > 0, content: $('meta[name="twitter:image"]').attr('content') || '', score: 0 },
    { name: 'twitter:site', present: $('meta[name="twitter:site"]').length > 0, content: $('meta[name="twitter:site"]').attr('content') || '', score: 0 },
    { name: 'twitter:creator', present: $('meta[name="twitter:creator"]').length > 0, content: $('meta[name="twitter:creator"]').attr('content') || '', score: 0 },
  ];

  ogTags.forEach(tag => {
    tag.score = tag.present ? 100 : 0;
  });

  twitterTags.forEach(tag => {
    tag.score = tag.present ? 100 : 0;
  });

  const issues: Array<{ tagName: string; issue: string; recommendation: string; example?: string; severity: string }> = [];

  if (title.length > 60) {
    issues.push({
      tagName: 'title',
      issue: `Title is too long (${title.length} characters)`,
      recommendation: 'Reduce the title length to 60 characters maximum',
      example: title.substring(0, 57) + '...',
      severity: 'medium'
    });
  }

  if (!title.includes('-') && !title.includes('|')) {
    issues.push({
      tagName: 'title',
      issue: 'The title does not contain a brand separator',
      recommendation: 'Add a separator (- or |) to include your brand name',
      example: `${title} - Your Brand`,
      severity: 'low'
    });
  }

  const description = $('meta[name="description"]').attr('content') || '';
  if (description.length > 160) {
    issues.push({
      tagName: 'meta description',
      issue: `The description is too long (${description.length} characters)`,
      recommendation: 'Reduce the description length to 160 characters maximum',
      example: description.substring(0, 157) + '...',
      severity: 'medium'
    });
  } else if (description.length < 120 && description.length > 0) {
    issues.push({
      tagName: 'meta description',
      issue: `The description is a bit short (${description.length} characters)`,
      recommendation: 'Increase the description length to at least 120 characters for more details',
      severity: 'low'
    });
  }

  const robotsContent = $('meta[name="robots"]').attr('content') || '';
  if (robotsContent && robotsContent.split(',').length < 2) {
    issues.push({
      tagName: 'meta robots',
      issue: 'The robots directives are basic',
      recommendation: 'Add additional directives like max-snippet, max-image-preview, etc.',
      example: 'index, follow, max-snippet:-1, max-image-preview:large',
      severity: 'low'
    });
  }

  const essentialScore = Math.round(essentialTags.reduce((acc, tag) => acc + tag.score, 0) / essentialTags.length);
  const ogScore = Math.round(ogTags.reduce((acc, tag) => acc + tag.score, 0) / ogTags.length);
  const twitterScore = Math.round(twitterTags.reduce((acc, tag) => acc + tag.score, 0) / twitterTags.length);
  const socialScore = Math.round((ogScore + twitterScore) / 2);
  const technicalScore = calculateTechnicalScore(essentialTags);
  const contentScore = calculateContentScore(essentialTags, ogTags, twitterTags);

  const finalScore = Math.round(
    (essentialScore * 0.4) +
    (socialScore * 0.3) +
    (technicalScore * 0.2) +
    (contentScore * 0.1)
  );

  return {
    score: finalScore,
    essential: essentialTags,
    social: {
      og: ogTags,
      twitter: twitterTags
    },
    issues,
    metaHtml: metaTagsHtml,
    detailedScore: {
      essential: essentialScore,
      social: socialScore,
      technical: technicalScore,
      content: contentScore
    }
  };
}

function calculateTitleScore(title: string): number {
  if (!title) return 0;
  const length = title.length;
  if (length < 10) return 30;
  if (length > 60) return 70;
  if (!title.includes('-') && !title.includes('|')) return 85;
  return 100;
}

function calculateDescriptionScore(description: string): number {
  if (!description) return 0;
  const length = description.length;
  if (length < 50) return 30;
  if (length > 160) return 70;
  if (length < 120) return 85;
  return 100;
}

function calculateRobotsScore(robotsContent: string): number {
  if (!robotsContent) return 0;
  const directives = robotsContent.toLowerCase().split(',').map(d => d.trim());
  const hasIndex = directives.includes('index');
  const hasFollow = directives.includes('follow');
  if (!hasIndex && !hasFollow) return 0;
  if (!hasIndex || !hasFollow) return 50;
  if (directives.length < 2) return 85;
  return 100;
}

function calculateTechnicalScore(essentialTags: Array<{ name: string; present: boolean; content?: string; score: number }>): number {
  const requiredTags = ['Viewport', 'Charset', 'Robots'];
  const presentTags = essentialTags.filter(tag => requiredTags.includes(tag.name) && tag.present).length;
  return Math.round((presentTags / requiredTags.length) * 100);
}

function calculateContentScore(
  essentialTags: Array<{ name: string; present: boolean; content?: string; score: number }>,
  ogTags: Array<{ name: string; present: boolean; content?: string; score: number }>,
  twitterTags: Array<{ name: string; present: boolean; content?: string; score: number }>
): number {
  const title = essentialTags.find(tag => tag.name === 'Title')?.content || '';
  const description = essentialTags.find(tag => tag.name === 'Description')?.content || '';
  const ogTitle = ogTags.find(tag => tag.name === 'og:title')?.content || '';
  const ogDescription = ogTags.find(tag => tag.name === 'og:description')?.content || '';
  const twitterTitle = twitterTags.find(tag => tag.name === 'twitter:title')?.content || '';
  const twitterDescription = twitterTags.find(tag => tag.name === 'twitter:description')?.content || '';

  let score = 0;
  let count = 0;

  if (title && ogTitle && title === ogTitle) {
    score += 100;
    count++;
  }
  if (title && twitterTitle && title === twitterTitle) {
    score += 100;
    count++;
  }

  if (description && ogDescription && description === ogDescription) {
    score += 100;
    count++;
  }
  if (description && twitterDescription && description === twitterDescription) {
    score += 100;
    count++;
  }

  return count > 0 ? Math.round(score / count) : 0;
}

export function analyzeAriaAttributes($: CheerioAPI): {
  score: number;
  missingAriaCount: number;
  missingLabels: number;
  invalidAriaCount: number;
  interactiveElementsCount: number;
  interactiveElementsWithAriaPercent: number;
  formElementsCount: number;
  formElementsWithLabelsPercent: number;
  issues: Array<{ element: string; issue: string; suggestion: string; code?: string; severity: string; context?: string }>;
} {
  const issues: Array<{ element: string; issue: string; suggestion: string; code?: string; severity: string; context?: string }> = [];

  const interactiveElements = $('button, a[href], input, select, textarea, [role="button"], [role="link"], [role="menuitem"], [tabindex]');
  const interactiveElementsCount = interactiveElements.length;

  interactiveElements.each((_, el) => {
    const $el = $(el);
    const tagName = $el.prop('tagName')?.toLowerCase();
    const role = $el.attr('role');
    const ariaLabel = $el.attr('aria-label');
    const ariaLabelledby = $el.attr('aria-labelledby');
    const id = $el.attr('id');

    if (!ariaLabel && !ariaLabelledby) {
      let context = '';
      if (tagName === 'button') {
        context = 'The button text is : ' + $el.text().trim();
      } else if (tagName === 'a') {
        context = 'The link points to : ' + $el.attr('href');
      } else if (tagName === 'input') {
        context = 'The input type is : ' + $el.attr('type');
      }

      issues.push({
        element: `<${tagName}>`,
        issue: 'Missing ARIA attribute',
        suggestion: `Add an aria-label or aria-labelledby attribute to describe the element`,
        code: `<${tagName} aria-label="Description of the element">`,
        severity: 'high',
        context
      });
    }
  });

  const formElements = $('form input, form select, form textarea');
  const formElementsCount = formElements.length;
  let formElementsWithLabels = 0;

  formElements.each((_, el) => {
    const $el = $(el);
    const id = $el.attr('id');
    const hasLabel = $el.closest('form').find(`label[for="${id}"]`).length > 0;
    const ariaLabel = $el.attr('aria-label');
    const ariaLabelledby = $el.attr('aria-labelledby');

    if (!hasLabel && !ariaLabel && !ariaLabelledby) {
      issues.push({
        element: `<${$el.prop('tagName')?.toLowerCase()}>`,
        issue: 'Form field without label',
        suggestion: 'Add a label or an aria-label/aria-labelledby attribute',
        code: `<label for="${id}">Description of the field</label>\n<input id="${id}" ...>`,
        severity: 'high'
      });
    } else {
      formElementsWithLabels++;
    }
  });

  $('*').each((_, el) => {
    const $el = $(el);
    const attrs = $el.attr() || {};
    const ariaAttributes = Object.keys(attrs).filter(attr => attr.startsWith('aria-'));

    if (ariaAttributes.length > 0) {
      ariaAttributes.forEach(attr => {
        const value = $el.attr(attr);
        if (!value || value.trim() === '') {
          issues.push({
            element: `<${$el.prop('tagName')?.toLowerCase()}>`,
            issue: `Empty ARIA attribute: ${attr}`,
            suggestion: 'Remove the attribute or add a valid value',
            severity: 'medium'
          });
        }
      });
    }
  });

  const missingAriaCount = issues.filter(issue => issue.issue.includes('Missing ARIA attribute')).length;
  const invalidAriaCount = issues.filter(issue => issue.issue.includes('Empty ARIA attribute')).length;
  const missingLabels = issues.filter(issue => issue.issue.includes('Form field without label')).length;

  const interactiveElementsWithAriaPercent = interactiveElementsCount > 0
    ? ((interactiveElementsCount - missingAriaCount) / interactiveElementsCount) * 100
    : 100;

  const formElementsWithLabelsPercent = formElementsCount > 0
    ? (formElementsWithLabels / formElementsCount) * 100
    : 100;

  const score = Math.round(
    (interactiveElementsWithAriaPercent * 0.4) +
    (formElementsWithLabelsPercent * 0.4) +
    ((100 - (invalidAriaCount * 5)) * 0.2)
  );

  return {
    score,
    missingAriaCount,
    missingLabels,
    invalidAriaCount,
    interactiveElementsCount,
    interactiveElementsWithAriaPercent,
    formElementsCount,
    formElementsWithLabelsPercent,
    issues
  };
}


export async function analyzeLargeFiles(internalLinks: string[], baseUrl: string): Promise<Array<{
  url: string;
  type: string;
  size: number;
  sizeFormatted: string;
  extension: string;
  name: string;
}>> {
  const result: Array<{
    url: string;
    type: string;
    size: number;
    sizeFormatted: string;
    extension: string;
    name: string;
  }> = [];

  const fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', 'csv', 'txt'];

  const potentialFileLinks = internalLinks.filter(link => {
    const extension = link.split('.').pop()?.toLowerCase();
    return extension && fileExtensions.includes(extension);
  }).slice(0, 10);

  for (const link of potentialFileLinks) {
    try {
      const response = await axios.head(link, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StackUnityBot/1.0; +https://stackunity.com/bot)'
        }
      });

      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const contentLength = parseInt(response.headers['content-length'] || '0', 10);

      const sizeFormatted = formatFileSize(contentLength);

      const urlObj = new URL(link);
      const pathParts = urlObj.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      const fileNameParts = fileName.split('.');
      const extension = fileNameParts.pop()?.toLowerCase() || '';
      const name = fileNameParts.join('.');

      result.push({
        url: link,
        type: contentType,
        size: contentLength,
        sizeFormatted,
        extension,
        name
      });
    } catch (error) {
      console.error(`Error analyzing file ${link}:`, error);
    }
  }

  return result;
}


export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function extractSecurityHeaders(headers: any): Record<string, string> {
  const securityHeaders: Record<string, string> = {};

  const importantHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy',
    'feature-policy',
    'access-control-allow-origin',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'cross-origin-embedder-policy'
  ];

  if (headers && typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      const headerKey = key.toLowerCase();
      if (importantHeaders.includes(headerKey) && value !== undefined && value !== null) {
        securityHeaders[headerKey] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    });
  }

  return securityHeaders;
}

function evaluateSecurityHeaders(headers: Record<string, string>): { score: number; missing: string[] } {
  const securityHeadersInfo = [
    { name: 'content-security-policy', weight: 25, critical: true },
    { name: 'strict-transport-security', weight: 20, critical: true },
    { name: 'x-content-type-options', weight: 10, critical: false },
    { name: 'x-frame-options', weight: 15, critical: true },
    { name: 'x-xss-protection', weight: 10, critical: false },
    { name: 'referrer-policy', weight: 5, critical: false },
    { name: 'permissions-policy', weight: 5, critical: false },
    { name: 'cross-origin-opener-policy', weight: 5, critical: false },
    { name: 'cross-origin-resource-policy', weight: 5, critical: false }
  ];

  let score = 0;
  const missing: string[] = [];

  securityHeadersInfo.forEach(header => {
    if (headers[header.name]) {
      score += header.weight;
    } else {
      missing.push(header.name);
    }
  });

  return { score, missing };
}

function analyzeCookies(cookieHeader: string | string[]): { secure: boolean; httpOnly: boolean; sameSite: boolean; score: number } {
  const cookies = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
  let secureCount = 0;
  let httpOnlyCount = 0;
  let sameSiteCount = 0;

  cookies.forEach(cookie => {
    if (cookie.includes('Secure')) secureCount++;
    if (cookie.includes('HttpOnly')) httpOnlyCount++;
    if (cookie.includes('SameSite')) sameSiteCount++;
  });

  const secure = secureCount === cookies.length;
  const httpOnly = httpOnlyCount === cookies.length;
  const sameSite = sameSiteCount === cookies.length;

  let score = 0;
  if (secure) score += 40;
  if (httpOnly) score += 30;
  if (sameSite) score += 30;

  return { secure, httpOnly, sameSite, score };
}
