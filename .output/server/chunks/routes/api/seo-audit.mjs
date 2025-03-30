globalThis.__timing__.logStart('Load chunks/routes/api/seo-audit');import { d as defineEventHandler, r as readBody, c as createError } from '../../_/nitro.mjs';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import puppeteer from 'puppeteer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';

const seoAudit = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url;
  const options = body.options || {};
  if (!url) {
    throw createError({
      statusCode: 400,
      message: "Missing URL"
    });
  }
  const MAX_DEPTH = options.maxDepth || 2;
  const SAME_DOMAIN_ONLY = options.sameDomainOnly !== false;
  const TIMEOUT = options.timeout || 3e4;
  const visitedURLs = /* @__PURE__ */ new Set();
  const urlMap = {};
  const seoResults = {};
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const protocol = urlObj.protocol;
  const baseUrl = `${protocol}//${domain}`;
  let robotsTxtContent = "";
  let robotsTxtFound = false;
  try {
    const robotsUrl = `${baseUrl}/robots.txt`;
    const robotsResponse = await axios.get(robotsUrl, { timeout: 5e3 });
    if (robotsResponse.status === 200) {
      robotsTxtContent = robotsResponse.data;
      robotsTxtFound = true;
    }
  } catch (error) {
    console.error("Error fetching robots.txt:", error);
  }
  let sitemapFound = false;
  let sitemapUrl = "";
  let sitemapUrls = 0;
  if (robotsTxtFound) {
    const sitemapMatches = robotsTxtContent.match(/Sitemap:\s*(.+)/gi);
    if (sitemapMatches && sitemapMatches.length > 0) {
      const sitemapLine = sitemapMatches[0];
      sitemapUrl = sitemapLine.replace(/Sitemap:\s*/i, "").trim();
      sitemapFound = true;
    }
  }
  if (!sitemapFound) {
    const commonSitemapPaths = [
      "/sitemap.xml",
      "/sitemap_index.xml",
      "/sitemap-index.xml",
      "/sitemap.php",
      "/sitemap.txt"
    ];
    for (const path of commonSitemapPaths) {
      try {
        const potentialSitemapUrl = `${baseUrl}${path}`;
        const response = await axios.get(potentialSitemapUrl, { timeout: 5e3 });
        if (response.status === 200 && response.data && (response.data.includes("<urlset") || response.data.includes("<sitemapindex"))) {
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
      const sitemapResponse = await axios.get(sitemapUrl, { timeout: 1e4 });
      if (sitemapResponse.status === 200) {
        const xmlData = sitemapResponse.data;
        try {
          const parser = new XMLParser({ ignoreAttributes: false });
          const parsedXml = parser.parse(xmlData);
          if (parsedXml.sitemapindex && parsedXml.sitemapindex.sitemap) {
            const sitemaps = Array.isArray(parsedXml.sitemapindex.sitemap) ? parsedXml.sitemapindex.sitemap : [parsedXml.sitemapindex.sitemap];
            sitemapUrls = sitemaps.length;
          } else if (parsedXml.urlset && parsedXml.urlset.url) {
            const urls = Array.isArray(parsedXml.urlset.url) ? parsedXml.urlset.url : [parsedXml.urlset.url];
            sitemapUrls = urls.length;
          }
        } catch (error) {
          console.error("Error parsing sitemap XML:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching sitemap:", error);
    }
  }
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920x1080"
    ]
  });
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(TIMEOUT);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const resourceType = request.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });
    const analyzePage = async (pageUrl) => {
      var _a;
      const startTime = Date.now();
      let response;
      try {
        response = await page.goto(pageUrl, {
          waitUntil: "networkidle0",
          timeout: TIMEOUT
        });
      } catch (error) {
        console.error(`Error loading ${pageUrl}:`, error.message);
        return {
          url: pageUrl,
          title: "",
          description: "",
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
            severity: "high",
            type: "loading"
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
            viewportContent: "",
            smallTouchTargets: 0
          },
          securityChecks: {
            https: pageUrl.startsWith("https"),
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
      const result = {
        url: pageUrl,
        title: "",
        description: "",
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
          viewportContent: "",
          smallTouchTargets: 0
        },
        securityChecks: {
          https: pageUrl.startsWith("https"),
          validCertificate: response ? !((_a = response.securityDetails()) == null ? void 0 : _a.validTo) : false,
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
      result.description = await page.$eval('meta[name="description"]', (el) => el.getAttribute("content") || "").catch(() => "");
      result.h1 = await page.$$eval("h1", (elements) => elements.map((el) => el.textContent || ""));
      result.h2 = await page.$$eval("h2", (elements) => elements.map((el) => el.textContent || ""));
      result.h3 = await page.$$eval("h3", (elements) => elements.map((el) => el.textContent || ""));
      result.metaTags = await page.$$eval(
        "meta",
        (elements) => elements.map((el) => ({
          name: el.getAttribute("name") || "",
          content: el.getAttribute("content") || ""
        })).filter((tag) => tag.name && tag.content)
      );
      result.imageAlt = await page.$$eval("img", (elements, pageUrl2) => {
        return elements.map((el) => {
          const src = el.getAttribute("src") || "";
          const alt = el.getAttribute("alt") || "";
          const title = el.getAttribute("title") || "";
          const width = el.getAttribute("width") || "";
          const height = el.getAttribute("height") || "";
          let fullSrc = src;
          if (src && !src.startsWith("data:") && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith("/")) {
                const urlObj2 = new URL(pageUrl2);
                fullSrc = `${urlObj2.protocol}//${urlObj2.host}${src}`;
              } else {
                const baseUrl2 = pageUrl2.endsWith("/") ? pageUrl2 : pageUrl2.substring(0, pageUrl2.lastIndexOf("/") + 1);
                fullSrc = new URL(src, baseUrl2).href;
              }
            } catch (e) {
              console.error("Error resolving image URL:", e);
              fullSrc = src;
            }
          }
          return {
            src: fullSrc,
            alt,
            title: title || alt,
            width,
            height,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);
      result.videoInfo = await page.$$eval("video", (elements, pageUrl2) => {
        return elements.map((el) => {
          const src = el.getAttribute("src") || "";
          const type = el.getAttribute("type") || "";
          const width = el.getAttribute("width") || "";
          const height = el.getAttribute("height") || "";
          const title = el.getAttribute("title") || "";
          const description = el.getAttribute("data-description") || "";
          const thumbnail = el.getAttribute("poster") || "";
          let fullSrc = src;
          if (src && !src.startsWith("data:") && !src.match(/^(http|https):\/\//)) {
            try {
              if (src.startsWith("/")) {
                const urlObj2 = new URL(pageUrl2);
                fullSrc = `${urlObj2.protocol}//${urlObj2.host}${src}`;
              } else {
                const baseUrl2 = pageUrl2.endsWith("/") ? pageUrl2 : pageUrl2.substring(0, pageUrl2.lastIndexOf("/") + 1);
                fullSrc = new URL(src, baseUrl2).href;
              }
            } catch (e) {
              console.error("Error resolving video URL:", e);
              fullSrc = src;
            }
          }
          return {
            src: fullSrc,
            type,
            width,
            height,
            title,
            description,
            thumbnail,
            hasDimensions: !!(width && height)
          };
        });
      }, pageUrl);
      const links = await page.$$eval(
        "a",
        (elements) => elements.map((el) => el.href).filter((href) => href && !href.startsWith("javascript:"))
      );
      const pageUrlObj = new URL(pageUrl);
      result.internalLinks = links.filter((link) => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === pageUrlObj.hostname;
        } catch {
          return false;
        }
      });
      result.externalLinks = links.filter((link) => !result.internalLinks.includes(link));
      result.coreWebVitals = await page.evaluate(() => {
        var _a2;
        const performanceEntries = performance.getEntriesByType("navigation");
        const paintEntries = performance.getEntriesByType("paint");
        const FCP = ((_a2 = paintEntries.find((entry) => entry.name === "first-contentful-paint")) == null ? void 0 : _a2.startTime) || 0;
        const navEntry = performanceEntries[0];
        const LCP = (navEntry == null ? void 0 : navEntry.domContentLoadedEventEnd) || 0;
        return {
          FCP,
          LCP,
          TTFB: (navEntry == null ? void 0 : navEntry.responseStart) || 0,
          domLoad: (navEntry == null ? void 0 : navEntry.domContentLoadedEventEnd) || 0
        };
      });
      result.headingStructure = await page.evaluate(() => {
        const headings = {};
        ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
          headings[tag] = Array.from(document.querySelectorAll(tag)).map((el) => {
            var _a2;
            return ((_a2 = el.textContent) == null ? void 0 : _a2.trim()) || "";
          }).filter((text) => text);
        });
        return headings;
      });
      result.structuredData = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((script) => {
          try {
            return JSON.parse(script.textContent || "{}");
          } catch (e) {
            return null;
          }
        }).filter((data) => data);
      });
      const schemaTypeCount = {};
      for (const schema of result.structuredData) {
        try {
          if (schema && schema["@type"]) {
            const type = schema["@type"];
            if (Array.isArray(type)) {
              type.forEach((t) => {
                schemaTypeCount[t] = (schemaTypeCount[t] || 0) + 1;
              });
            } else {
              schemaTypeCount[type] = (schemaTypeCount[type] || 0) + 1;
            }
          }
        } catch (error) {
          console.error("Error parsing schema type:", error);
        }
      }
      result.technicalSEO.schemaTypeCount = schemaTypeCount;
      result.socialTags = await page.evaluate(() => {
        const ogTags = Array.from(document.querySelectorAll('meta[property^="og:"]')).map((tag) => ({
          property: tag.getAttribute("property"),
          content: tag.getAttribute("content")
        }));
        const twitterTags = Array.from(document.querySelectorAll('meta[name^="twitter:"]')).map((tag) => ({
          name: tag.getAttribute("name"),
          content: tag.getAttribute("content")
        }));
        return { ogTags, twitterTags };
      });
      result.mobileCompatibility = await page.evaluate(() => {
        const viewport = document.querySelector('meta[name="viewport"]');
        const touchTargets = document.querySelectorAll("a, button, input, select, textarea");
        const smallTouchTargets = Array.from(touchTargets).filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length;
        return {
          hasViewport: !!viewport,
          viewportContent: (viewport == null ? void 0 : viewport.getAttribute("content")) || "",
          smallTouchTargets
        };
      });
      if (response) {
        const headers = response.headers();
        result.securityChecks.securityHeaders = Object.entries(headers).filter(([name]) => [
          "content-security-policy",
          "strict-transport-security",
          "x-content-type-options",
          "x-frame-options",
          "x-xss-protection"
        ].includes(name.toLowerCase())).map(([name, value]) => ({ name, value }));
      }
      const robotsMeta = result.metaTags.filter((tag) => tag.name.toLowerCase() === "robots");
      if (robotsMeta.length > 0) {
        const content = robotsMeta[0].content.toLowerCase();
        const hasIndex = !content.includes("noindex");
        const hasFollow = !content.includes("nofollow");
        if (!hasIndex) {
          result.warnings.push({
            message: "The page is configured to not be indexed (noindex)",
            severity: "high",
            type: "meta"
          });
        }
        if (!hasFollow) {
          result.warnings.push({
            message: "The page is configured to not follow links (nofollow)",
            severity: "medium",
            type: "meta"
          });
        }
      }
      if (!result.title) result.warnings.push({
        message: "Missing title",
        severity: "high",
        type: "title"
      });
      if (!result.description) result.warnings.push({
        message: "Missing meta description",
        severity: "high",
        type: "description"
      });
      if (result.h1.length === 0) result.warnings.push({
        message: "Missing H1 tag",
        severity: "high",
        type: "h1"
      });
      if (result.h1.length > 1) result.warnings.push({
        message: "Multiple H1 tags detected",
        severity: "medium",
        type: "h1"
      });
      result.imageAlt.forEach((img) => {
        if (!img.alt) result.warnings.push({
          message: `Image without alt attribute: ${img.src}`,
          severity: "medium",
          type: "image"
        });
      });
      if (!result.mobileCompatibility.hasViewport) result.warnings.push({
        message: "Missing viewport meta tag",
        severity: "high",
        type: "mobile"
      });
      if (result.mobileCompatibility.smallTouchTargets > 0) {
        result.warnings.push({
          message: `${result.mobileCompatibility.smallTouchTargets} touch targets too small for mobile`,
          severity: "medium",
          type: "mobile"
        });
      }
      if (!result.securityChecks.https) result.warnings.push({
        message: "Site not using HTTPS",
        severity: "high",
        type: "security"
      });
      if (result.socialTags.ogTags.length === 0 && result.socialTags.twitterTags.length === 0) {
        result.warnings.push({
          message: "Missing social media tags (Open Graph / Twitter Cards)",
          severity: "medium",
          type: "social"
        });
      }
      if (result.structuredData.length === 0) {
        result.warnings.push({
          message: "No structured data (Schema.org) detected",
          severity: "medium",
          type: "structured-data"
        });
      }
      if (result.coreWebVitals.LCP > 2500) {
        result.warnings.push({
          message: "Largest Contentful Paint (LCP) too slow (> 2.5s)",
          severity: "high",
          type: "performance"
        });
      }
      if (result.coreWebVitals.FCP > 1e3) {
        result.warnings.push({
          message: "First Contentful Paint (FCP) too slow (> 1s)",
          severity: "medium",
          type: "performance"
        });
      }
      const bodyText = await page.$eval("body", (el) => el.textContent || "");
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      let keywordDensity = 1.5;
      if (result.title) {
        const titleWords = result.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const h1Words = result.h1.join(" ").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const potentialKeywords = [...titleWords, ...h1Words];
        if (potentialKeywords.length > 0 && wordCount > 0) {
          const keywordCounts = potentialKeywords.reduce((acc, word) => {
            const regex = new RegExp(`\\b${word}\\b`, "gi");
            const matches = bodyText.match(regex) || [];
            return acc + matches.length;
          }, 0);
          keywordDensity = Math.min(4, Math.max(0.5, keywordCounts / wordCount * 100));
        }
      }
      const readabilityScore = 65 + (result.headingStructure.h2.length > 1 ? 10 : 0) + (result.headingStructure.h3.length > 2 ? 5 : 0) + (result.description ? 10 : 0) + (result.headingStructure.h2.length > 0 && result.headingStructure.h3.length > 0 ? 10 : 0);
      result.contentStats = {
        wordCount,
        keywordDensity,
        readabilityScore: Math.min(100, readabilityScore)
      };
      result.links = {
        internal: result.internalLinks,
        external: result.externalLinks
      };
      if (!sitemapFound) {
        result.warnings.push({
          message: "No sitemap.xml found",
          severity: "medium",
          type: "general"
        });
      }
      if (!robotsTxtFound) {
        result.warnings.push({
          message: "No robots.txt found",
          severity: "medium",
          type: "general"
        });
      }
      if (Object.keys(schemaTypeCount).length === 0) {
        result.warnings.push({
          message: "No Schema.org markup found",
          severity: "medium",
          type: "structured-data"
        });
      }
      return result;
    };
    const crawlPage = async (pageUrl, depth = 0) => {
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
    const missingTitles = Object.values(seoResults).filter((result) => !result.title).length;
    const missingDescriptions = Object.values(seoResults).filter((result) => !result.description).length;
    const missingAltTags = Object.values(seoResults).reduce(
      (sum, result) => sum + result.imageAlt.filter((img) => !img.alt).length,
      0
    );
    const totalFCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.FCP, 0);
    const totalLCP = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.LCP, 0);
    const totalTTFB = Object.values(seoResults).reduce((sum, result) => sum + result.coreWebVitals.TTFB, 0);
    const pagesWithStructuredData = Object.values(seoResults).filter((result) => result.structuredData.length > 0).length;
    const pagesWithSocialTags = Object.values(seoResults).filter(
      (result) => result.socialTags.ogTags.length > 0 || result.socialTags.twitterTags.length > 0
    ).length;
    const mobileCompatiblePages = Object.values(seoResults).filter((result) => result.mobileCompatibility.hasViewport).length;
    const securePages = Object.values(seoResults).filter((result) => result.securityChecks.https).length;
    const report = {
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
  } finally {
    await browser.close();
  }
});

export { seoAudit as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/seo-audit');
