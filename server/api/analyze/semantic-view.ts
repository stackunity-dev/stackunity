import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { analyzeAriaAttributes, analyzeMetaTags } from './analyze-functions';
import { analyzeSemanticStructure } from './semantic-analyzer';
import { crawlWebsite } from './utils/crawler';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL is required');
  }
  const urlList = await crawlWebsite(body.url, 15);
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


