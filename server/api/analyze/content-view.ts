import axios from 'axios';
import { load } from 'cheerio';
import { createError, defineEventHandler, readBody } from 'h3';
import { analyzeImages, analyzeLinks } from './analyze-functions';
import { CheerioSelector } from './analyzer-types';
import { analyzeSemanticStructure } from './semantic-analyzer';
import { crawlWebsite } from './utils/crawler';

export interface ContentStats {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  paragraphCount: number;
}

export interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
}

export interface ContentIssue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

interface ContentAnalysisResult {
  url: string;
  title: string;
  description?: string;
  headingStructure: HeadingStructure;
  contentStats: ContentStats;
  images: any;
  links: any;
  semanticStructure: any;
  contentIssues: ContentIssue[];
  urlList?: string[];
}

function calculateReadabilityScore(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);

  if (sentences.length === 0 || words.length === 0) return 0;

  const avgWordsPerSentence = words.length / sentences.length;

  const longWords = words.filter(w => w.length > 6).length;
  const longWordsPercentage = (longWords / words.length) * 100;

  let score = 100;

  if (avgWordsPerSentence > 25) score -= 30;
  else if (avgWordsPerSentence > 20) score -= 20;
  else if (avgWordsPerSentence > 15) score -= 10;

  if (longWordsPercentage > 30) score -= 30;
  else if (longWordsPercentage > 20) score -= 20;
  else if (longWordsPercentage > 15) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function extractHeadingStructure($: CheerioSelector): HeadingStructure {
  const headings: HeadingStructure = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: []
  };

  for (let i = 1; i <= 6; i++) {
    $(`h${i}`).each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        headings[`h${i}` as keyof HeadingStructure].push(text);
      }
    });
  }

  return headings;
}

function analyzeContentStats($: CheerioSelector): ContentStats {
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const paragraphs = $('p').length;

  const words = bodyText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  const averageWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    const normalized = word.toLowerCase();
    if (normalized.length > 3) {
      wordFrequency[normalized] = (wordFrequency[normalized] || 0) + 1;
    }
  });

  const uniqueWords = Object.keys(wordFrequency).length;
  const keywordDensity = wordCount > 0 ? ((wordCount - uniqueWords) / wordCount) * 100 : 0;

  const readabilityScore = calculateReadabilityScore(bodyText);

  return {
    wordCount,
    readabilityScore,
    keywordDensity,
    sentenceCount,
    averageWordsPerSentence,
    paragraphCount: paragraphs
  };
}

function identifyContentIssues(
  stats: ContentStats,
  headings: HeadingStructure,
  images: any,
  links: any
): ContentIssue[] {
  const issues: ContentIssue[] = [];

  if (headings.h1.length === 0) {
    issues.push({
      title: 'Missing H1 title',
      description: 'Add a main H1 title to improve the structure of your page and SEO',
      severity: 'high'
    });
  } else if (headings.h1.length > 1) {
    issues.push({
      title: 'Multiple H1 titles',
      description: 'A page should generally contain only one H1 title',
      severity: 'medium'
    });
  }

  if (stats.wordCount < 300) {
    issues.push({
      title: 'Content too short',
      description: 'The content is too short. Aim for at least 300 words for better relevance',
      severity: 'medium'
    });
  }

  if (images && images.withoutAlt > 0) {
    issues.push({
      title: 'Images without alt attribute',
      description: `${images.withoutAlt} image(s) have no alt attribute, which is important for accessibility and SEO`,
      severity: 'medium'
    });
  }

  if (headings.h1.length > 0 && headings.h2.length === 0) {
    issues.push({
      title: 'Missing H2 subtitles',
      description: 'Use H2 subtitles to structure your content',
      severity: 'low'
    });
  }

  if (!links || !links.internal || links.internal.length === 0) {
    issues.push({
      title: 'Missing internal links',
      description: 'Add internal links to improve navigation and SEO',
      severity: 'low'
    });
  }

  return issues;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    });
  }

  try {
    const response = await axios.get(body.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const $ = load(response.data);

    const headingStructure = extractHeadingStructure($);
    const contentStats = analyzeContentStats($);
    const images = analyzeImages($);
    const links = analyzeLinks($, body.url);
    const semanticStructure = analyzeSemanticStructure($);
    const contentIssues = identifyContentIssues(contentStats, headingStructure, images, links);

    const result: ContentAnalysisResult = {
      url: body.url,
      title: $('title').text(),
      description: $('meta[name="description"]').attr('content'),
      headingStructure,
      contentStats,
      images,
      links,
      semanticStructure,
      contentIssues
    };

    if (body.crawl) {
      const urlList = await crawlWebsite(body.url, 30);
      result.urlList = urlList;
    }

    return result;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error analyzing content: ${error.message}`
    });
  }
});

