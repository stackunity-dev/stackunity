import { createError, defineEventHandler, H3Event, readBody } from 'h3';
import { analyzeSitePerformance, calculateAveragePerformanceScore, getOptimizationTips, PerformanceMetrics } from './performance';
import { crawlWebsite } from './utils/crawler';

async function processUrlsInBatches(urls: string[], batchSize: number = 5, delayBetweenRequests: number = 2000): Promise<PerformanceMetrics[]> {
  const results: PerformanceMetrics[] = [];
  const maxUrls = 20;

  for (let i = 0; i < Math.min(urls.length, maxUrls); i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(url =>
      analyzeSitePerformance(url).catch(error => {
        console.error(`Error analyzing ${url}:`, error);
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

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const { url, maxUrls = 15, delayBetweenRequests = 3000 } = body;
    if (!url) {
      throw new Error('URL required');
    }

    const urls = await crawlWebsite(url, maxUrls);
    const results = await processUrlsInBatches(
      urls,
      body.batchSize || 5,
      body.delayBetweenRequests || 2000
    );

    if (!Array.isArray(results) || results.length === 0) {
      try {
        const mainResult = await analyzeSitePerformance(url);
        return {
          urlsAnalyzed: [url],
          performanceResults: [mainResult],
          averageScore: mainResult.overallScore,
          optimizationTips: getOptimizationTips(mainResult)
        };
      } catch (mainError) {
        throw createError({
          statusCode: 500,
          message: 'Unable to analyze the page. Please check that the URL is accessible.'
        });
      }
    }

    const averageScore = calculateAveragePerformanceScore(results);
    const mainPageResult = results.find(r => r.url === url) || results[0];
    const optimizationTips = getOptimizationTips(mainPageResult);

    return {
      urlsAnalyzed: urls.slice(0, 20),
      performanceResults: results,
      averageScore,
      optimizationTips
    };
  } catch (error) {
    console.error('Error during performance analysis:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
