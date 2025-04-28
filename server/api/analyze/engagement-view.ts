import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { analyzeUserEngagement } from './engagement-analyzer';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL is required');
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

  const urlList = await crawlUrl(body.url);
  const engagementAnalysis = await Promise.all(urlList.map(async (url) => {
    try {
      const response = await axios.get(url);
      const engagement = await analyzeUserEngagement(response.data);

      // Calculer le score global sur 100
      const engagementScore = Math.min(100, Math.round(
        Math.min(engagement.ctaCount * 5, 50) +
        Math.min(engagement.interactiveElements * 2, 20) +
        Math.min(engagement.visualElements * 2, 20) +
        Math.min(engagement.navigationScore * 0.1, 10)
      ));

      return {
        url,
        score: engagementScore,
        ctaCount: engagement.ctaCount,
        interactiveElements: engagement.interactiveElements,
        visualElements: engagement.visualElements,
        socialElements: engagement.socialElements,
        navigationScore: engagement.navigationScore,
        readabilityScore: engagement.readabilityScore,
        engagementTechniques: engagement.engagementTechniques,
        ctaDetails: engagement.ctaDetails,
        interactiveElementsDetails: engagement.interactiveElementsDetails,
        socialElementsDetails: engagement.socialElementsDetails,
        issues: engagement.issues
      };
    } catch (error) {
      console.error(`Error analyzing ${url}: ${error.message}`);
      return {
        url,
        error: error.message,
        score: 0,
        ctaCount: 0,
        interactiveElements: 0,
        visualElements: 0,
        socialElements: 0,
        navigationScore: 0,
        readabilityScore: 0,
        engagementTechniques: {
          hasSocialLinks: false,
          hasCtaButtons: false,
          hasFormsOrInputs: false,
          hasVideos: false,
          hasImages: false,
          hasInteractiveElements: false,
          hasFeedbackMechanisms: false
        },
        issues: []
      };
    }
  }));

  return engagementAnalysis;
});

