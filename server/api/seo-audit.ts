import chromium from '@sparticuz/chromium-min';
import axios from 'axios';
import { execSync } from 'child_process';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import { createError, defineEventHandler, readBody } from 'h3';
import puppeteer from 'puppeteer-core';

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

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url;
  const options = body.options || {};

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'Missing URL'
    });
  }

  const MAX_DEPTH = options.maxDepth || 2;
  const SAME_DOMAIN_ONLY = options.sameDomainOnly !== false;
  const TIMEOUT = options.timeout || 30000;

  const visitedURLs = new Set<string>();
  const urlMap: Record<string, string[]> = {};
  const seoResults: Record<string, SEOAuditResult> = {};

  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const protocol = urlObj.protocol;
  const baseUrl = `${protocol}//${domain}`;

  let robotsTxtContent = '';
  let robotsTxtFound = false;
  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const robotsResponse = await axios.get(robotsUrl, { timeout: 5000 });
    if (robotsResponse.status === 200) {
      robotsTxtContent = robotsResponse.data;
      robotsTxtFound = true;
    }
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
  }

  let sitemapFound = false;
  let sitemapUrl = '';
  let sitemapUrls = 0;

  if (robotsTxtFound) {
    const sitemapMatches = robotsTxtContent.match(/Sitemap:\s*(.+)/gi);
    if (sitemapMatches && sitemapMatches.length > 0) {
      const sitemapLine = sitemapMatches[0];
      sitemapUrl = sitemapLine.replace(/Sitemap:\s*/i, '').trim();
      sitemapFound = true;
    }
  }

  if (!sitemapFound) {
    const commonSitemapPaths = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap-index.xml',
      '/sitemap.php',
      '/sitemap.txt'
    ];

    for (const path of commonSitemapPaths) {
      try {
        const potentialSitemapUrl = `${baseUrl}${path}`;
        const response = await axios.get(potentialSitemapUrl, { timeout: 5000 });
        if (response.status === 200 && response.data &&
          (response.data.includes('<urlset') || response.data.includes('<sitemapindex'))) {
          sitemapUrl = potentialSitemapUrl;
          sitemapFound = true;
          break;
        }
      } catch (error) {
      }
    }
  }

  if (sitemapFound && sitemapUrl) {
    try {
      const sitemapResponse = await axios.get(sitemapUrl, { timeout: 10000 });
      if (sitemapResponse.status === 200) {
        const xmlData = sitemapResponse.data;
        try {
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
        } catch (error) {
          console.error('Error parsing sitemap XML:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching sitemap:', error);
    }
  }

  let browser;
  try {
    console.log('Lancement du navigateur pour l\'audit SEO...');

    if (process.env.NODE_ENV === 'production') {
      console.log('Configuration de Chromium en production...');

      try {
        // Configuration spécifique pour environnement serverless
        console.log('Configuration pour environnement serverless...');

        // Préparation du répertoire avec permissions explicites
        const chromiumDir = '/tmp/chromium-executable';
        if (!fs.existsSync(chromiumDir)) {
          execSync(`mkdir -p ${chromiumDir}`);
          execSync(`chmod 777 ${chromiumDir}`);
          console.log(`Répertoire créé: ${chromiumDir}`);
        }

        try {
          // Utiliser directement chromium-min qui gère l'installation et les permissions
          console.log("Utilisation de @sparticuz/chromium-min pour l'environnement serverless");

          // Configurer les aspects critiques
          chromium.setGraphicsMode = false;
          chromium.setHeadlessMode = true;

          // Forcer la régénération/redécompression du binaire si nécessaire
          await chromium.font('/tmp/fonts');

          // Obtenir le chemin d'exécution et appliquer les permissions correctes
          const execPath = await chromium.executablePath();
          if (fs.existsSync(execPath)) {
            console.log(`Vérification des permissions sur ${execPath}`);
            // S'assurer que tous les répertoires parents sont accessibles
            const pathParts = execPath.split('/').filter(Boolean);
            let currentPath = '';

            for (const part of pathParts) {
              currentPath += '/' + part;
              try {
                const stats = fs.statSync(currentPath);
                const mode = stats.mode & parseInt('777', 8);
                console.log(`Permissions de ${currentPath}: ${mode.toString(8)}`);

                if ((mode & parseInt('111', 8)) !== parseInt('111', 8)) {
                  console.log(`Ajout des permissions d'exécution pour ${currentPath}`);
                  execSync(`chmod a+x ${currentPath}`);
                }
              } catch (e) {
                console.log(`Impossible de vérifier ${currentPath}: ${e.message}`);
              }
            }

            // Assurer que le binaire est exécutable
            execSync(`chmod 755 ${execPath}`);
            console.log(`Permissions du binaire chromium mises à jour: ${execPath}`);
          }

          // Tenter le lancement avec les options recommandées
          browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: execPath,
            headless: chromium.headless
          });

          console.log("Navigateur lancé avec succès via chromium-min");

        } catch (chromeError) {
          console.error(`Erreur avec chromium-min: ${chromeError.message}`);

          // Solution de secours - utiliser un navigateur compatible WSL ou autre
          console.log("Tentative alternative avec configuration manuelle...");

          // Vérifier différents emplacements de Chrome
          const possiblePaths = [
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/bin/chromium',
            '/bin/chromium-browser'
          ];

          let executablePath: string | null = null;
          for (const path of possiblePaths) {
            if (fs.existsSync(path)) {
              executablePath = path;
              console.log(`Chrome trouvé à: ${executablePath}`);
              execSync(`chmod 755 ${executablePath}`);
              break;
            }
          }

          if (executablePath) {
            browser = await puppeteer.launch({
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process'
              ],
              executablePath,
              ignoreHTTPSErrors: true,
              headless: true
            });
          } else {
            throw new Error("Impossible de trouver un binaire Chrome utilisable");
          }
        }

      } catch (error) {
        console.error('Erreur lors du lancement personnalisé de Chromium:', error);

        try {
          // Fallback sur la méthode standard de chromium-min
          console.log('Utilisation du binaire standard de @sparticuz/chromium-min...');

          // Définir le chemin d'exécution fourni par chromium-min
          const execPath = await chromium.executablePath();
          console.log(`Chemin fourni par chromium-min: ${execPath}`);

          // Assurer que le fichier a les bonnes permissions
          if (fs.existsSync(execPath)) {
            execSync(`chmod 755 ${execPath}`);
            console.log(`Permissions mises à jour pour: ${execPath}`);
          }

          // Lancer puppeteer avec les options de chromium-min
          browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: execPath,
            ignoreHTTPSErrors: true,
            headless: true
          });

        } catch (fallbackError) {
          console.error('Échec de toutes les méthodes de lancement de Chromium:', fallbackError);

          // Dernière tentative sans utiliser require dynamique
          try {
            console.log('Dernière tentative avec une configuration minimale...');

            // Utilisation du chemin le plus probable sans dépendre de bibliothèques externes
            const possiblePaths = [
              '/tmp/chromium',
              '/tmp/chromium-executable/chromium',
              process.env.CHROME_BIN,
              process.platform === 'win32'
                ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
                : '/usr/bin/google-chrome'
            ];

            // Trouver le premier chemin qui existe
            let executablePath: string | null = null;
            for (const path of possiblePaths) {
              if (path && fs.existsSync(path)) {
                executablePath = path;
                console.log(`Chemin Chrome trouvé: ${executablePath}`);
                break;
              }
            }

            if (!executablePath) {
              throw new Error('Aucun exécutable Chrome trouvé dans les chemins standards');
            }

            browser = await puppeteer.launch({
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
              ],
              executablePath,
              ignoreHTTPSErrors: true,
              headless: true
            });

          } catch (finalError) {
            console.error('Échec de toutes les méthodes:', finalError);
            throw new Error(`Impossible de lancer le navigateur Chrome malgré plusieurs tentatives: ${finalError.message}`);
          }
        }
      }
    } else {
      const executablePath = process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : '/usr/bin/google-chrome';

      browser = await puppeteer.launch({
        headless: "new",
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage'
        ],
        executablePath: executablePath
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(TIMEOUT);
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const analyzePage = async (pageUrl: string): Promise<SEOAuditResult> => {
      const startTime = Date.now();
      let response;
      try {
        response = await page.goto(pageUrl, {
          waitUntil: 'networkidle0',
          timeout: TIMEOUT
        });
      } catch (error: any) {
        console.error(`Error loading ${pageUrl}:`, error.message);
        return {
          url: pageUrl,
          title: '',
          description: '',
          h1: [],
          h2: [],
          h3: [],
          metaTags: [],
          robotsMeta: {
            index: true,
            follow: true,
            noindex: false,
            nofollow: false,
            noarchive: false,
            nosnippet: false,
            noodp: false
          },
          imageAlt: [],
          videoInfo: [],
          loadTime: 0,
          statusCode: 0,
          internalLinks: [],
          externalLinks: [],
          warnings: [{
            message: `Loading error: ${error.message}`,
            severity: 'high',
            type: 'loading'
          }],
          coreWebVitals: {
            FCP: 0,
            LCP: 0,
            TTFB: 0,
            domLoad: 0
          },
          headingStructure: {
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: []
          },
          structuredData: [],
          socialTags: {
            ogTags: [],
            twitterTags: []
          },
          mobileCompatibility: {
            hasViewport: false,
            viewportContent: '',
            smallTouchTargets: 0
          },
          securityChecks: {
            https: pageUrl.startsWith('https'),
            validCertificate: false,
            securityHeaders: []
          },
          links: {
            internal: [],
            external: []
          },
          contentStats: {
            wordCount: 0,
            keywordDensity: 0,
            readabilityScore: 0
          },
          technicalSEO: {
            sitemapFound,
            sitemapUrl,
            sitemapUrls,
            robotsTxtFound,
            robotsTxtContent,
            schemaTypeCount: {}
          }
        };
      }

      const loadTime = Date.now() - startTime;

      const result: SEOAuditResult = {
        url: pageUrl,
        title: '',
        description: '',
        h1: [],
        h2: [],
        h3: [],
        metaTags: [],
        robotsMeta: {
          index: true,
          follow: true,
          noindex: false,
          nofollow: false,
          noarchive: false,
          nosnippet: false,
          noodp: false
        },
        imageAlt: [],
        videoInfo: [],
        loadTime,
        statusCode: response ? response.status() : 0,
        internalLinks: [],
        externalLinks: [],
        warnings: [],
        coreWebVitals: {
          FCP: 0,
          LCP: 0,
          TTFB: 0,
          domLoad: 0
        },
        headingStructure: {
          h1: [],
          h2: [],
          h3: [],
          h4: [],
          h5: [],
          h6: []
        },
        structuredData: [],
        socialTags: {
          ogTags: [],
          twitterTags: []
        },
        mobileCompatibility: {
          hasViewport: false,
          viewportContent: '',
          smallTouchTargets: 0
        },
        securityChecks: {
          https: pageUrl.startsWith('https'),
          validCertificate: response ? !response.securityDetails()?.validTo : false,
          securityHeaders: []
        },
        links: {
          internal: [],
          external: []
        },
        contentStats: {
          wordCount: 0,
          keywordDensity: 0,
          readabilityScore: 0
        },
        technicalSEO: {
          sitemapFound,
          sitemapUrl,
          sitemapUrls,
          robotsTxtFound,
          robotsTxtContent,
          schemaTypeCount: {}
        }
      };

      result.title = await page.title();
      result.description = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content') || '')
        .catch(() => '');
      result.h1 = await page.$$eval('h1', (elements) => elements.map(el => el.textContent || ''));
      result.h2 = await page.$$eval('h2', (elements) => elements.map(el => el.textContent || ''));
      result.h3 = await page.$$eval('h3', (elements) => elements.map(el => el.textContent || ''));
      result.metaTags = await page.$$eval('meta', (elements) =>
        elements.map(el => ({
          name: el.getAttribute('name') || '',
          content: el.getAttribute('content') || ''
        })).filter(tag => tag.name && tag.content)
      );

      result.imageAlt = await page.$$eval('img', (elements, pageUrl) => {
        return elements.map(el => {
          const src = el.getAttribute('src') || '';
          const alt = el.getAttribute('alt') || '';
          const title = el.getAttribute('title') || '';
          const width = el.getAttribute('width') || '';
          const height = el.getAttribute('height') || '';

          let fullSrc = src;
          if (src && !src.startsWith('data:') && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith('/')) {
                const urlObj = new URL(pageUrl);
                fullSrc = `${urlObj.protocol}//${urlObj.host}${src}`;
              }
              else {
                const baseUrl = pageUrl.endsWith('/') ? pageUrl : pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1);
                fullSrc = new URL(src, baseUrl).href;
              }
            } catch (e) {
              console.error('Error resolving image URL:', e);
              fullSrc = src;
            }
          }

          return {
            src: fullSrc,
            alt: alt,
            title: title || alt,
            width: width,
            height: height,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);

      result.videoInfo = await page.$$eval('video', (elements, pageUrl) => {
        return elements.map(el => {
          const src = el.getAttribute('src') || '';
          const type = el.getAttribute('type') || '';
          const width = el.getAttribute('width') || '';
          const height = el.getAttribute('height') || '';
          const title = el.getAttribute('title') || '';
          const description = el.getAttribute('data-description') || '';
          const thumbnail = el.getAttribute('poster') || '';

          let fullSrc = src;
          if (src && !src.startsWith('data:') && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith('/')) {
                const urlObj = new URL(pageUrl);
                fullSrc = `${urlObj.protocol}//${urlObj.host}${src}`;
              }
              else {
                const baseUrl = pageUrl.endsWith('/') ? pageUrl : pageUrl.substring(0, pageUrl.lastIndexOf('/') + 1);
                fullSrc = new URL(src, baseUrl).href;
              }
            } catch (e) {
              console.error('Error resolving video URL:', e);
              fullSrc = src;
            }
          }

          return {
            src: fullSrc,
            type: type,
            width: width,
            height: height,
            title: title,
            description: description,
            thumbnail: thumbnail,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);

      const links = await page.$$eval('a', (elements) =>
        elements.map(el => el.href).filter(href => href && !href.startsWith('javascript:'))
      );

      const pageUrlObj = new URL(pageUrl);
      result.internalLinks = links.filter(link => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === pageUrlObj.hostname;
        } catch {
          return false;
        }
      });
      result.externalLinks = links.filter(link => !result.internalLinks.includes(link));

      result.coreWebVitals = await page.evaluate(() => {
        const performanceEntries = performance.getEntriesByType('navigation');
        const paintEntries = performance.getEntriesByType('paint');

        const FCP = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
        const navEntry = performanceEntries[0] as any;
        const LCP = navEntry?.domContentLoadedEventEnd || 0;

        return {
          FCP: FCP,
          LCP: LCP,
          TTFB: navEntry?.responseStart || 0,
          domLoad: navEntry?.domContentLoadedEventEnd || 0
        };
      });

      result.headingStructure = await page.evaluate(() => {
        const headings: any = {};
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
          headings[tag] = Array.from(document.querySelectorAll(tag))
            .map((el: Element) => el.textContent?.trim() || '')
            .filter((text: string) => text);
        });
        return headings;
      });

      result.structuredData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
          .map((script: Element) => {
            try {
              return JSON.parse(script.textContent || '{}');
            } catch (e) {
              return null;
            }
          })
          .filter((data: any) => data);
      });

      // Count schema.org types
      const schemaTypeCount: Record<string, number> = {};
      for (const schema of result.structuredData) {
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
          console.error('Error parsing schema type:', error);
        }
      }
      result.technicalSEO.schemaTypeCount = schemaTypeCount;

      result.socialTags = await page.evaluate(() => {
        const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]'))
          .map((tag: Element) => ({
            property: tag.getAttribute('property') || null,
            content: tag.getAttribute('content') || null
          }));

        const twitterTags = Array.from(document.querySelectorAll('meta[name^="twitter:"]'))
          .map((tag: Element) => ({
            name: tag.getAttribute('name') || null,
            content: tag.getAttribute('content') || null
          }));

        return { ogTags, twitterTags };
      });

      result.mobileCompatibility = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        const touchTargets = document.querySelectorAll('a, button, input, select, textarea');
        const smallTouchTargets = Array.from(touchTargets).filter((el: Element) => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length;

        return {
          hasViewport: !!viewport,
          viewportContent: viewport?.getAttribute('content') || '',
          smallTouchTargets
        };
      });

      if (response) {
        const headers = response.headers();
        result.securityChecks.securityHeaders = Object.entries(headers)
          .filter(([name]) => [
            'content-security-policy',
            'strict-transport-security',
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection'
          ].includes(name.toLowerCase()))
          .map(([name, value]) => ({ name, value: String(value) }));
      }

      const robotsMeta = result.metaTags.filter(tag => tag.name.toLowerCase() === 'robots');
      if (robotsMeta.length > 0) {
        const content = robotsMeta[0].content.toLowerCase();
        const hasIndex = !content.includes('noindex');
        const hasFollow = !content.includes('nofollow');

        if (!hasIndex) {
          result.warnings.push({
            message: 'The page is configured to not be indexed (noindex)',
            severity: 'high',
            type: 'meta'
          });
        }

        if (!hasFollow) {
          result.warnings.push({
            message: 'The page is configured to not follow links (nofollow)',
            severity: 'medium',
            type: 'meta'
          });
        }
      }

      if (!result.title) result.warnings.push({
        message: 'Missing title',
        severity: 'high',
        type: 'title'
      });
      if (!result.description) result.warnings.push({
        message: 'Missing meta description',
        severity: 'high',
        type: 'description'
      });
      if (result.h1.length === 0) result.warnings.push({
        message: 'Missing H1 tag',
        severity: 'high',
        type: 'h1'
      });
      if (result.h1.length > 1) result.warnings.push({
        message: 'Multiple H1 tags detected',
        severity: 'medium',
        type: 'h1'
      });
      result.imageAlt.forEach(img => {
        if (!img.alt) result.warnings.push({
          message: `Image without alt attribute: ${img.src}`,
          severity: 'medium',
          type: 'image'
        });
      });
      if (!result.mobileCompatibility.hasViewport) result.warnings.push({
        message: 'Missing viewport meta tag',
        severity: 'high',
        type: 'mobile'
      });
      if (result.mobileCompatibility.smallTouchTargets > 0) {
        result.warnings.push({
          message: `${result.mobileCompatibility.smallTouchTargets} touch targets too small for mobile`,
          severity: 'medium',
          type: 'mobile'
        });
      }
      if (!result.securityChecks.https) result.warnings.push({
        message: 'Site not using HTTPS',
        severity: 'high',
        type: 'security'
      });
      if (result.socialTags.ogTags.length === 0 && result.socialTags.twitterTags.length === 0) {
        result.warnings.push({
          message: 'Missing social media tags (Open Graph / Twitter Cards)',
          severity: 'medium',
          type: 'social'
        });
      }
      if (result.structuredData.length === 0) {
        result.warnings.push({
          message: 'No structured data (Schema.org) detected',
          severity: 'medium',
          type: 'structured-data'
        });
      }
      if (result.coreWebVitals.LCP > 2500) {
        result.warnings.push({
          message: 'Largest Contentful Paint (LCP) too slow (> 2.5s)',
          severity: 'high',
          type: 'performance'
        });
      }
      if (result.coreWebVitals.FCP > 1000) {
        result.warnings.push({
          message: 'First Contentful Paint (FCP) too slow (> 1s)',
          severity: 'medium',
          type: 'performance'
        });
      }

      const bodyText = await page.$eval('body', el => el.textContent || '');
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

      let keywordDensity = 1.5;
      if (result.title) {
        const titleWords = result.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const h1Words = result.h1.join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const potentialKeywords = [...titleWords, ...h1Words];

        if (potentialKeywords.length > 0 && wordCount > 0) {
          const keywordCounts = potentialKeywords.reduce((acc, word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = bodyText.match(regex) || [];
            return acc + matches.length;
          }, 0);

          keywordDensity = Math.min(4, Math.max(0.5, (keywordCounts / wordCount) * 100));
        }
      }

      const readabilityScore = 65 +
        (result.headingStructure.h2.length > 1 ? 10 : 0) +
        (result.headingStructure.h3.length > 2 ? 5 : 0) +
        (result.description ? 10 : 0) +
        (result.headingStructure.h2.length > 0 && result.headingStructure.h3.length > 0 ? 10 : 0);

      result.contentStats = {
        wordCount,
        keywordDensity,
        readabilityScore: Math.min(100, readabilityScore)
      };

      result.links = {
        internal: result.internalLinks,
        external: result.externalLinks
      };

      // Add warnings for technical SEO issues
      if (!sitemapFound) {
        result.warnings.push({
          message: 'No sitemap.xml found',
          severity: 'medium',
          type: 'general'
        });
      }

      if (!robotsTxtFound) {
        result.warnings.push({
          message: 'No robots.txt found',
          severity: 'medium',
          type: 'general'
        });
      }

      if (Object.keys(schemaTypeCount).length === 0) {
        result.warnings.push({
          message: 'No Schema.org markup found',
          severity: 'medium',
          type: 'structured-data'
        });
      }

      return result;
    };

    const crawlPage = async (pageUrl: string, depth: number = 0) => {
      if (depth > MAX_DEPTH || visitedURLs.has(pageUrl)) return;

      try {
        visitedURLs.add(pageUrl);
        const result = await analyzePage(pageUrl);
        seoResults[pageUrl] = result;
        urlMap[pageUrl] = result.internalLinks;

        if (depth < MAX_DEPTH) {
          const linksToVisit = SAME_DOMAIN_ONLY ? result.internalLinks : [...result.internalLinks, ...result.externalLinks];
          for (const link of linksToVisit) {
            if (!visitedURLs.has(link)) {
              await crawlPage(link, depth + 1);
            }
          }
        }
      } catch (error) {
        console.error(`Error crawling ${pageUrl}:`, error);
      }
    };

    await crawlPage(url);

    const totalPages = Object.keys(seoResults).length;
    const totalLoadTime = Object.values(seoResults).reduce((sum, result) => sum + result.loadTime, 0);
    const totalWarnings = Object.values(seoResults).reduce((sum, result) => sum + result.warnings.length, 0);
    const missingTitles = Object.values(seoResults).filter(result => !result.title).length;
    const missingDescriptions = Object.values(seoResults).filter(result => !result.description).length;
    const missingAltTags = Object.values(seoResults).reduce(
      (sum, result) => sum + result.imageAlt.filter(img => !img.alt).length,
      0
    );

    const totalFCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.FCP, 0);
    const totalLCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.LCP, 0);
    const totalTTFB = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.TTFB, 0);
    const pagesWithStructuredData = Object.values(seoResults).filter(result => result.structuredData.length > 0).length;
    const pagesWithSocialTags = Object.values(seoResults).filter(
      result => result.socialTags.ogTags.length > 0 || result.socialTags.twitterTags.length > 0
    ).length;
    const mobileCompatiblePages = Object.values(seoResults).filter(result => result.mobileCompatibility.hasViewport).length;
    const securePages = Object.values(seoResults).filter(result => result.securityChecks.https).length;

    const report: CrawlReport = {
      urlMap,
      visitedURLs: Array.from(visitedURLs),
      seoResults,
      summary: {
        totalPages,
        averageLoadTime: totalPages > 0 ? totalLoadTime / totalPages : 0,
        totalWarnings,
        missingTitles,
        missingDescriptions,
        missingAltTags,
        averageFCP: totalPages > 0 ? totalFCP / totalPages : 0,
        averageLCP: totalPages > 0 ? totalLCP / totalPages : 0,
        averageTTFB: totalPages > 0 ? totalTTFB / totalPages : 0,
        pagesWithStructuredData,
        pagesWithSocialTags,
        mobileCompatiblePages,
        securePages
      }
    };

    return report;
  } catch (error) {
    console.error('Erreur pendant l\'analyse SEO:', error);
    throw createError({
      statusCode: 500,
      message: `Erreur pendant l'analyse SEO: ${error.message}`
    });
  } finally {
    // S'assurer que le navigateur est toujours fermé
    if (browser) {
      try {
        await browser.close();
        console.log('Navigateur fermé avec succès');
      } catch (closeError) {
        console.error('Erreur lors de la fermeture du navigateur:', closeError);
      }
    }
  }
}); 