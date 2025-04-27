import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { analyzeAriaAttributes, analyzeMetaTags } from './analyze-functions';
import { analyzeSemanticStructure } from './semantic-analyzer';

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
  const semanticAnalysis = await Promise.all(urlList.map(async (url) => {
    const response = await axios.get(url);
    const $ = load(response.data);
    const semantic = analyzeSemanticStructure($);
    const aria = analyzeAriaAttributes($);
    const meta = analyzeMetaTags($);

    return {
      url,
      ...semantic,
      accessibility: {
        ariaScore: aria.score,
        missingAriaCount: aria.missingAriaCount,
        missingLabels: aria.missingLabels,
        invalidAriaCount: aria.invalidAriaCount,
        interactiveElementsCount: aria.interactiveElementsCount,
        interactiveElementsWithAriaPercent: aria.interactiveElementsWithAriaPercent,
        formElementsCount: aria.formElementsCount,
        formElementsWithLabelsPercent: aria.formElementsWithLabelsPercent,
        issues: aria.issues
      },
      metaTags: {
        score: meta.score,
        essential: meta.essential,
        social: meta.social,
        issues: meta.issues,
        metaHtml: meta.metaHtml,
        detailedScore: meta.detailedScore
      }
    };
  }));
  return semanticAnalysis;
});


