import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { analyzeSitePerformance, calculateAveragePerformanceScore, getOptimizationTips, PerformanceMetrics } from './performance';

async function processUrlsInBatches(urls: string[], batchSize: number = 5, delayBetweenRequests: number = 2000): Promise<PerformanceMetrics[]> {
  const results: PerformanceMetrics[] = [];
  const maxUrls = 20;

  for (let i = 0; i < Math.min(urls.length, maxUrls); i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url =>
      analyzeSitePerformance(url).catch(error => {
        console.error(`Erreur lors de l'analyse de ${url}:`, error);
        return null;
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((result): result is PerformanceMetrics => result !== null));

    if (i + batchSize < Math.min(urls.length, maxUrls)) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
    }
  }

  return results;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL requise');
  }

  try {
    const urls = await crawlWebsite(body.url, 20); // Limite à 20 URLs
    const results = await processUrlsInBatches(
      urls,
      body.batchSize || 5,
      body.delayBetweenRequests || 2000
    );

    if (results.length === 0) {
      throw new Error('Failed to analyze any URLs');
    }

    const averageScore = calculateAveragePerformanceScore(results);
    const mainPageResult = results.find(r => r.url === body.url) || results[0];
    const optimizationTips = getOptimizationTips(mainPageResult);

    return {
      statusCode: 200,
      body: {
        urlsAnalyzed: urls.slice(0, 20), // Limite à 20 URLs
        results,
        averageScore,
        optimizationTips
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse des performances:', error);
    return {
      statusCode: 500,
      body: {
        error: 'Échec de l\'analyse des performances',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
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
      const response = await axios.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 30000,
        maxContentLength: 50 * 1024 * 1024,
        maxRedirects: 5
      });
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
