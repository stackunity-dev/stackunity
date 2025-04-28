import axios from 'axios';
import { defineEventHandler, readBody } from 'h3';
import { analyzeSitePerformance, calculateAveragePerformanceScore, getOptimizationTips, PerformanceMetrics } from './performance';
import { load } from 'cheerio';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.url) {
      return {
        statusCode: 400,
        body: { error: 'URL is required' }
      };
    }

    const mainUrl = body.url;
    const maxUrls = body.maxUrls || 5;

    const urlsToCrawl = await crawlWebsite(mainUrl, maxUrls);

    const performanceResults: PerformanceMetrics[] = [];
    for (const url of urlsToCrawl) {
      try {
        const result = await analyzeSitePerformance(url);
        performanceResults.push(result);
      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
      }
    }

    if (performanceResults.length === 0) {
      throw new Error('Failed to analyze any URLs');
    }

    const averageScore = calculateAveragePerformanceScore(performanceResults);

    const mainPageResult = performanceResults.find(r => r.url === mainUrl) || performanceResults[0];
    const optimizationTips = getOptimizationTips(mainPageResult);

    return {
      url: mainUrl,
      urlsAnalyzed: urlsToCrawl,
      performanceResults,
      averageScore,
      optimizationTips
    };
  } catch (error) {
    console.error('Error analyzing website performance:', error);

    return {
      statusCode: 500,
      body: {
        error: 'Failed to analyze website performance',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
});

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '') || '/';
}

async function crawlWebsite(url: string, maxUrls: number) {
  const visitedUrls = new Set<string>();
  const urlsToVisit = [normalizeUrl(url)];
  const baseUrl = new URL(url).origin;
  const excludePatterns = [
    'cdn-cgi',
    'assets',
    'images',
    'media',
    '#',
    'mailto:',
    'tel:',
    '.pdf',
    '.jpg',
    '.png',
    '.gif',
    '.svg',
    '.css',
    '.js',
    '.ico'
  ];

  while (urlsToVisit.length > 0) {
    const currentUrl = urlsToVisit.pop();
    if (!currentUrl || visitedUrls.has(currentUrl)) continue;

    if (excludePatterns.some(pattern => currentUrl.includes(pattern))) {
      continue;
    }

    try {
      const response = await axios.get(currentUrl);
      visitedUrls.add(currentUrl);

      const $ = load(response.data);
      const links = $('a[href]')
        .map((_, el) => $(el).attr('href'))
        .get();

      for (const link of links) {
        try {
          let fullUrl = link;
          if (link.startsWith('/')) {
            fullUrl = `${baseUrl}${link}`;
          } else if (!link.startsWith('http')) {
            fullUrl = `${baseUrl}/${link}`;
          }

          fullUrl = normalizeUrl(fullUrl);

          const linkUrl = new URL(fullUrl);
          if (
            linkUrl.origin === baseUrl &&
            !visitedUrls.has(fullUrl) &&
            !excludePatterns.some(pattern => fullUrl.includes(pattern))
          ) {
            urlsToVisit.push(fullUrl);
          }
        } catch (e) {
          console.error(`Invalid URL: ${link}`);
        }
      }
    } catch (e) {
      console.error(`Error crawling ${currentUrl}: ${e.message}`);
    }
  }

  return Array.from(visitedUrls);
}
