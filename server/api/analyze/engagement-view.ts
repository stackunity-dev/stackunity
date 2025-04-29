import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { analyzeUserEngagement } from './engagement-analyzer';

async function processUrlsInBatches(urls: string[], batchSize: number = 5): Promise<any[]> {
  const results: any[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url =>
      analyzeUserEngagement(url).catch(error => {
        console.error(`Erreur lors de l'analyse de l'engagement de ${url}:`, error);
        return null;
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(result => result !== null));

    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL requise');
  }

  function normalizeUrl(url: string): string {
    return url.replace(/\/+$/, '') || '/';
  }

  async function crawlUrl(url: string) {
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
            console.error(`URL invalide: ${link}`);
          }
        }
      } catch (e) {
        console.error(`Erreur lors du crawl de ${currentUrl}: ${e.message}`);
      }
    }

    return Array.from(visitedUrls);
  }

  try {
    const urls = await crawlUrl(body.url);
    const results = await processUrlsInBatches(urls);

    return {
      statusCode: 200,
      body: {
        urlsAnalyzed: urls,
        results
      }
    };
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'engagement:', error);
    return {
      statusCode: 500,
      body: {
        error: 'Échec de l\'analyse de l\'engagement',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    };
  }
});

