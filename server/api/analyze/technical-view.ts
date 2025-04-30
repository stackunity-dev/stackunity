import { defineEventHandler, readBody } from 'h3';
import { checkRobotsTxt, checkSitemap } from './analyze-functions';
import { crawlWebsite } from './utils/crawler';

interface TechnicalAnalysisResult {
  url: string;
  robotsTxt: {
    found: boolean;
    content?: string;
    issues?: Array<{
      type: string;
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
  sitemap: {
    found: boolean;
    url?: string;
    content?: string;
    urls?: number;
    issues?: Array<{
      type: string;
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL is required');
  }

  try {
    const urlList = await crawlWebsite(body.url, 15);
    const technicalAnalysis: TechnicalAnalysisResult[] = [];

    for (const url of urlList) {
      try {
        const baseUrl = new URL(url).origin;

        const robotsTxtResult = await checkRobotsTxt(baseUrl);
        const sitemapResult = await checkSitemap(baseUrl);

        technicalAnalysis.push({
          url,
          robotsTxt: robotsTxtResult,
          sitemap: sitemapResult
        });
      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
      }
    }

    return technicalAnalysis;
  } catch (error) {
    console.error('Error in technical analysis:', error);
    throw error;
  }
}); 