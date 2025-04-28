import { SEOResult } from './types';

export interface ContentStats {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  paragraphCount: number;
}

export interface ContentIssue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

export const calculateContentScore = (result: SEOResult): number => {
  if (!result) return 0;

  let score = 0;
  let total = 100;

  const wordCount = result?.contentStats?.wordCount || 0;
  if (wordCount >= 800) {
    score += 20;
  } else if (wordCount >= 500) {
    score += 15;
  } else if (wordCount >= 300) {
    score += 10;
  } else if (wordCount > 0) {
    score += 5;
  }

  if (result?.headingStructure?.h1 && result.headingStructure.h1.length > 0) {
    score += 10;
    if (result.headingStructure.h2 && result.headingStructure.h2.length > 0) {
      score += 5;
      if (result.headingStructure.h3 && result.headingStructure.h3.length > 0) {
        score += 5;
      }
    }
  }

  const imagesTotal = result?.images?.total || 0;
  const imagesWithAlt = result?.images?.withAlt || 0;

  if (imagesTotal > 0) {
    const altRatio = imagesWithAlt / imagesTotal;
    score += Math.floor(altRatio * 20);
  }

  const internalLinks = Array.isArray(result?.links?.internal) ? result.links.internal.length : 0;
  const externalLinks = Array.isArray(result?.links?.external) ? result.links.external.length : 0;

  if (internalLinks > 0) {
    score += Math.min(10, internalLinks * 2);
  }

  if (externalLinks > 0) {
    score += Math.min(10, externalLinks * 2);
  }

  const readabilityScore = result?.contentStats?.readabilityScore || 0;
  score += Math.floor(readabilityScore * 0.2);

  return Math.min(100, Math.max(0, Math.floor(score)));
};

export const getContentScoreColor = (score: number): string => {
  if (score < 50) return 'error';
  if (score < 75) return 'warning';
  return 'success';
};

export const getContentScoreLabel = (score: number): string => {
  if (score < 30) return 'Insufficient content';
  if (score < 50) return 'Basic content';
  if (score < 75) return 'Good content';
  if (score < 90) return 'Very good content';
  return 'Excellent content';
};

export const getWordCountRating = (count: number): string => {
  if (count < 300) return 'Insufficient';
  if (count < 500) return 'Basic';
  if (count < 800) return 'Good';
  if (count < 1200) return 'Very good';
  return 'Excellent';
};

export const getWordCountColor = (count: number): string => {
  if (count < 300) return 'error';
  if (count < 500) return 'warning';
  if (count < 800) return 'info';
  return 'success';
};

export const getReadabilityRating = (score: number): string => {
  if (score < 30) return 'Difficult';
  if (score < 50) return 'Medium';
  if (score < 70) return 'Good';
  if (score < 90) return 'Very good';
  return 'Excellent';
};

export const getReadabilityColor = (score: number): string => {
  if (score < 30) return 'error';
  if (score < 50) return 'warning';
  if (score < 70) return 'info';
  return 'success';
};

export const checkContentBestPractices = (result: SEOResult): ContentIssue[] => {
  if (result && result.contentIssues && Array.isArray(result.contentIssues)) {
    return result.contentIssues;
  }

  const issues: ContentIssue[] = [];

  if (!result?.headingStructure?.h1 || result.headingStructure.h1.length === 0) {
    issues.push({
      title: 'H1 missing',
      description: 'Add a main H1 title to improve the structure of your page and SEO',
      severity: 'high'
    });
  } else if (result.headingStructure.h1.length > 1) {
    issues.push({
      title: 'Multiple H1 titles',
      description: 'A page should generally contain only one H1 title',
      severity: 'medium'
    });
  }

  if (result?.contentStats?.wordCount !== undefined && result.contentStats.wordCount < 300) {
    issues.push({
      title: 'Content too short',
      description: 'The content is too short. Aim for at least 300 words for better relevance',
      severity: 'medium'
    });
  }

  if (result?.images?.withoutAlt !== undefined && result.images.withoutAlt > 0) {
    issues.push({
      title: 'Images without alt attribute',
      description: `${result.images.withoutAlt} image(s) have no alt attribute, which is important for accessibility and SEO`,
      severity: 'medium'
    });
  }

  if (result?.headingStructure?.h1 && result.headingStructure.h1.length > 0 &&
    (!result.headingStructure.h2 || result.headingStructure.h2.length === 0)) {
    issues.push({
      title: 'Missing H2 subtitles',
      description: 'Use H2 subtitles to structure your content',
      severity: 'low'
    });
  }

  if (!result?.links?.internal ||
    !Array.isArray(result.links.internal) ||
    result.links.internal.length === 0) {
    issues.push({
      title: 'Missing internal links',
      description: 'Add internal links to improve navigation and SEO',
      severity: 'low'
    });
  }

  return issues;
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'grey';
  }
};

export const getSeverityIcon = (severity: string): string => {
  switch (severity) {
    case 'high': return 'mdi-alert-circle';
    case 'medium': return 'mdi-alert';
    case 'low': return 'mdi-information';
    default: return 'mdi-information-outline';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const truncateUrl = (url: string, maxLength: number): string => {
  if (!url) return '';
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
};

export default {
  calculateContentScore,
  getContentScoreColor,
  getContentScoreLabel,
  getWordCountRating,
  getWordCountColor,
  getReadabilityRating,
  getReadabilityColor,
  checkContentBestPractices,
  getSeverityColor,
  getSeverityIcon,
  truncateText,
  truncateUrl
}; 