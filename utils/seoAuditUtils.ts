export interface WarningItem {
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'meta' | 'content' | 'performance' | 'security' | 'mobile' | 'general' | 'loading' | 'title' | 'description' | 'h1' | 'image' | 'social' | 'structured-data';
}

export interface ActionItem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low' | 'error';
}

export interface Warning {
  severity: string;
  message: string;
  type?: string;
}

export interface SEOResult {
  title?: string;
  description?: string;
  loadTime?: number;
  headingStructure?: {
    h1?: string[];
    h2?: string[];
    h3?: string[];
  };
  imageAlt?: Array<{
    alt?: string;
    src?: string;
    title?: string;
    width?: number;
    height?: number;
    hasDimensions?: boolean;
  }>;
  videoInfo?: Array<{
    src: string;
    length?: number;
    thumbnail?: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
  }>;
  coreWebVitals?: {
    LCP?: number;
    FCP?: number;
    TTFB?: number;
    performanceScore?: number;
  };
  mobileCompatibility?: {
    hasViewport?: boolean;
    smallTouchTargets?: number;
    viewportContent?: string;
  };
  securityChecks?: {
    https?: boolean;
    securityHeaders?: Array<{ name: string; value: string }>;
  };
  socialTags?: {
    ogTags?: Array<{ property: string; content: string }>;
    twitterTags?: Array<{ name: string; content: string }>;
  };
  technicalSEO?: {
    sitemapFound?: boolean;
    sitemapUrl?: string;
    sitemapUrls?: number;
    robotsTxtFound?: boolean;
    robotsTxtContent?: string;
    schemaTypeCount?: Record<string, number>;
  };
  structuredData?: any[];
  warnings?: Array<string | Warning>;
  contentStats?: {
    readabilityScore?: number;
    wordCount?: number;
    keywordDensity?: number;
  };
}

export const calculateOverallScore = (result: SEOResult): number => {
  if (!result) return 0;
  let score = 100;

  const warningCount = result.warnings?.length || 0;
  if (warningCount > 0) {
    score -= warningCount * 5;

    result.warnings?.forEach((warning: Warning | string) => {
      if (typeof warning === 'string') return;

      switch (warning?.severity) {
        case 'high':
          score -= 15;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
        case 'error':
          score -= 2;
          break;
      }
    });
  }

  if (!result.title) score -= 20;
  if (!result.description) score -= 15;
  if (!result.headingStructure?.h1?.length) score -= 15;
  if (result.imageAlt?.some(img => !img?.alt)) score -= 10;

  if ((result.coreWebVitals?.FCP || 0) > 3000) score -= 10;
  if ((result.coreWebVitals?.LCP || 0) > 4000) score -= 10;
  if ((result.coreWebVitals?.TTFB || 0) > 1500) score -= 10;

  if (score > 90) score = 90;
  if (warningCount > 5) score = Math.min(score, 70);
  if (warningCount > 10) score = Math.min(score, 50);

  return Math.max(0, Math.min(100, score));
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

export const getScoreStatus = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Improvement';
};

export const getScoreDescription = (score: number): string => {
  if (score >= 80) return 'Your page is well optimized';
  if (score >= 60) return 'Some possible improvements';
  return 'Significant improvements are needed';
};

export const getCriticalIssues = (result: SEOResult): ActionItem[] => {
  const issues: ActionItem[] = [];

  // Check for missing title
  if (!result.title) {
    const issue: ActionItem = {
      title: 'Missing title',
      description: 'The title tag is required for SEO',
      severity: 'error' as const
    };
    issues.push(issue);
    if (!result.warnings) result.warnings = [];
    result.warnings.push({
      type: 'title',
      message: 'Missing title tag',
      severity: 'high'
    });
  }

  if (!result.description) {
    const issue: ActionItem = {
      title: 'Missing description',
      description: 'Meta description is important for SEO',
      severity: 'error' as const
    };
    issues.push(issue);
    if (!result.warnings) result.warnings = [];
    result.warnings.push({
      type: 'description',
      message: 'Missing meta description',
      severity: 'high'
    });
  }

  if (result.headingStructure?.h1?.length === 0) {
    const issue: ActionItem = {
      title: 'Missing H1',
      description: 'The page must have an H1 heading',
      severity: 'error' as const
    };
    issues.push(issue);
    if (!result.warnings) result.warnings = [];
    result.warnings.push({
      type: 'h1',
      message: 'Missing H1 heading',
      severity: 'high'
    });
  }

  return issues;
};

export const getCoreWebVitalName = (name: string): string => {
  const names: { [key: string]: string } = {
    FCP: 'First Contentful Paint',
    LCP: 'Largest Contentful Paint',
    TTFB: 'Time to First Byte',
    domLoad: 'DOM Load'
  };
  return names[name] || name;
};

export const getCoreWebVitalThresholds = (name: string): { good: number; poor: number } => {
  const thresholds: { [key: string]: { good: number; poor: number } } = {
    FCP: { good: 1000, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 500, poor: 1500 },
    domLoad: { good: 1000, poor: 3000 }
  };
  return thresholds[name] || { good: 0, poor: 0 };
};

export const getCoreWebVitalStatus = (value: number, good: number, poor: number): string => {
  if (value < good) return 'Good';
  if (value < poor) return 'Needs Improvement';
  return 'Critical';
};

export const getCoreWebVitalColor = (value: number, good: number, poor: number): string => {
  if (value < good) return 'success';
  if (value < poor) return 'warning';
  return 'error';
};

export const getContentKeywordDensity = (result: any): number => {
  if (!result.contentStats || result.contentStats.keywordDensity === undefined) {
    const content = `${result.title || ''} ${result.description || ''} ${result.h1.join(' ')}`;
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));

    const totalWords = words.length;
    const uniqueWordCount = uniqueWords.size;

    if (totalWords === 0) return 0;

    return Math.round(((totalWords - uniqueWordCount) / totalWords) * 100 * 10) / 10;
  }

  return result.contentStats.keywordDensity;
};

export const getKeywordDensityColor = (density: number): string => {
  if (density >= 1 && density <= 3) return 'success';
  if (density > 3 && density <= 4) return 'warning';
  if (density > 4) return 'error';
  return 'warning';
};

export const getKeywordDensityStatus = (density: number): string => {
  if (density >= 1 && density <= 3) return 'Optimal density';
  if (density > 3 && density <= 4) return 'Density to monitor';
  if (density > 4) return 'Density too high';
  return 'Density too low';
};

export const getReadabilityScore = (result: SEOResult): number => {
  if (!result) return 0;

  if (!result.contentStats || result.contentStats.readabilityScore === undefined) {
    const content = result.description || '';
    const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim().length > 0);
    const words = content.split(/\s+/).filter((w: string) => w.length > 0);

    if (sentences.length === 0) return 50;

    const avgWordsPerSentence = words.length / sentences.length;
    const longWords = words.filter((w: string) => w.length > 6).length;
    const longWordsPercentage = (longWords / words.length) * 100;

    let score = 100;

    if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;

    if (longWordsPercentage > 20) score -= 20;
    else if (longWordsPercentage > 10) score -= 10;

    if ((result.headingStructure?.h2?.length || 0) > 0) score += 5;
    if ((result.headingStructure?.h3?.length || 0) > 0) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  return result.contentStats.readabilityScore;
};

export const getReadabilityColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

export const getReadabilityStatus = (score: number): string => {
  if (score >= 80) return 'Easy to read';
  if (score >= 60) return 'Medium';
  return 'Difficult';
};

export const getExternalLinksColor = (count: number): string => {
  if (count === 0) return 'warning';
  if (count > 5) return 'error';
  return 'success';
};

export const getExternalLinksStatus = (count: number): string => {
  if (count === 0) return 'No external links';
  if (count > 5) return 'Too many external links';
  return 'Optimal number of external links';
};

export const getWarningSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'warning';
  }
};

export const getWarningSeverityIcon = (severity: string): string => {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'mdi-alert-circle';
    case 'medium':
      return 'mdi-alert';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-alert';
  }
};

export const getWarningImpactDescription = (type: string): string => {
  const impacts: Record<string, string> = {
    'title': 'Strong impact on search ranking and click-through rate',
    'description': 'Impact on visibility in search results',
    'h1': 'Impact on semantic structure and content understanding',
    'image': 'Impact on accessibility and image SEO',
    'performance': 'Impact on user experience and mobile ranking',
    'mobile': 'Impact on mobile-first indexing',
    'security': 'Impact on site trust and security',
    'link': 'Impact on navigation and site structure',
    'content': 'Impact on content quality and relevance',
    'social': 'Impact on social sharing and visibility',
    'structured-data': 'Impact on rich snippets in search results'
  };

  return impacts[type] || 'Impact on overall site quality';
};

export const getPerformanceScore = (result: SEOResult): number => {
  if (!result) return 0;
  let score = 0;
  let totalWeight = 0;

  const factors = [
    {
      value: !!result.title,
      weight: 10,
      description: 'Title presence'
    },
    {
      value: result.title ? (result.title.length >= 30 && result.title.length <= 65) : false,
      weight: 5,
      description: 'Optimal title length'
    },
    {
      value: !!result.description,
      weight: 10,
      description: 'Description presence'
    },
    {
      value: result.description ? (result.description.length >= 70 && result.description.length <= 160) : false,
      weight: 5,
      description: 'Optimal description length'
    },
    {
      value: result.headingStructure?.h1?.length === 1,
      weight: 8,
      description: 'Single H1'
    },
    {
      value: (result.headingStructure?.h2?.length || 0) >= 2,
      weight: 4,
      description: 'At least 2 H2s'
    },
    {
      value: (result.headingStructure?.h3?.length || 0) >= 1,
      weight: 3,
      description: 'At least 1 H3'
    },
    {
      value: result.imageAlt?.every(img => img?.alt) ?? false,
      weight: 8,
      description: 'Images with alt'
    },
    {
      value: result.imageAlt?.some(img => img?.hasDimensions) ?? false,
      weight: 4,
      description: 'Images with dimensions'
    },
    {
      value: (result.videoInfo?.length || 0) > 0,
      weight: 3,
      description: 'Video content'
    },
    {
      value: (result.coreWebVitals?.LCP ?? Infinity) <= 2500,
      weight: 6,
      description: 'Optimal LCP'
    },
    {
      value: (result.coreWebVitals?.FCP ?? Infinity) <= 1000,
      weight: 4,
      description: 'Optimal FCP'
    },
    {
      value: (result.coreWebVitals?.TTFB ?? Infinity) <= 500,
      weight: 5,
      description: 'Optimal TTFB'
    },
    {
      value: result.mobileCompatibility?.hasViewport ?? false,
      weight: 4,
      description: 'Mobile viewport'
    },
    {
      value: (result.mobileCompatibility?.smallTouchTargets ?? Infinity) === 0,
      weight: 3,
      description: 'Optimal touch targets'
    },
    {
      value: result.securityChecks?.https ?? false,
      weight: 3,
      description: 'HTTPS'
    },
    {
      value: (result.socialTags?.ogTags?.length || 0) > 0,
      weight: 5,
      description: 'Open Graph tags'
    },
    {
      value: (result.socialTags?.twitterTags?.length || 0) > 0,
      weight: 5,
      description: 'Twitter tags'
    },
    {
      value: (result.structuredData?.length || 0) > 0,
      weight: 5,
      description: 'Structured data'
    }
  ];

  factors.forEach(factor => {
    if (factor.value) {
      score += factor.weight;
      totalWeight += factor.weight;
    }
  });

  const warningCount = result.warnings?.length || 0;
  if (warningCount > 0) {
    const warningPenalty = Math.min(20, warningCount * 2);
    score = Math.max(0, score - warningPenalty);
  }

  return Math.round((score / (totalWeight || 1)) * 100);
};

export const getMobileScore = (result: SEOResult): number => {
  if (!result) return 0;
  let score = 0;
  let totalWeight = 0;

  const factors = [
    {
      value: result.mobileCompatibility?.hasViewport || false,
      weight: 25,
      description: 'Mobile viewport'
    },
    {
      value: (result.mobileCompatibility?.smallTouchTargets || 0) === 0,
      weight: 20,
      description: 'Optimal touch targets'
    },
    {
      value: (result.coreWebVitals?.LCP || 0) <= 2500,
      weight: 15,
      description: 'Optimal LCP'
    },
    {
      value: (result.coreWebVitals?.FCP || 0) <= 1000,
      weight: 15,
      description: 'Optimal FCP'
    },
    {
      value: result.imageAlt?.some(img => img?.hasDimensions) || false,
      weight: 15,
      description: 'Responsive images'
    },
    {
      value: typeof result.mobileCompatibility?.viewportContent === 'string' &&
        result.mobileCompatibility.viewportContent.includes('width=device-width'),
      weight: 10,
      description: 'Properly configured viewport'
    }
  ];

  factors.forEach(factor => {
    if (factor.value) {
      score += factor.weight;
      totalWeight += factor.weight;
    }
  });

  const mobileWarnings = result.warnings?.filter((w: Warning | string) => typeof w === 'object' && w?.type === 'mobile').length || 0;

  if (mobileWarnings > 0) {
    const warningPenalty = Math.min(20, mobileWarnings * 4);
    score = Math.max(0, score - warningPenalty);
  }

  return Math.round((score / (totalWeight || 1)) * 100);
};

export const getSEOScore = (result: SEOResult): number => {
  if (!result) return 0;
  let score = 0;
  let totalWeight = 0;

  const factors = [
    {
      value: !!result.title,
      weight: 10,
      description: 'Title presence'
    },
    {
      value: result.title && result.title.length >= 30 && result.title.length <= 65,
      weight: 5,
      description: 'Optimal title length'
    },
    {
      value: !!result.description,
      weight: 10,
      description: 'Description presence'
    },
    {
      value: result.description && result.description.length >= 70 && result.description.length <= 160,
      weight: 5,
      description: 'Optimal description length'
    },
    {
      value: result.headingStructure?.h1?.length === 1,
      weight: 8,
      description: 'Single H1'
    },
    {
      value: (result.headingStructure?.h2?.length || 0) >= 2,
      weight: 4,
      description: 'At least 2 H2s'
    },
    {
      value: (result.headingStructure?.h3?.length || 0) >= 1,
      weight: 3,
      description: 'At least 1 H3'
    },
    {
      value: !result.imageAlt?.some(img => !img?.alt),
      weight: 8,
      description: 'Images with alt'
    },
    {
      value: result.imageAlt?.some(img => img?.hasDimensions) || false,
      weight: 4,
      description: 'Images with dimensions'
    },
    {
      value: (result.videoInfo?.length || 0) > 0,
      weight: 3,
      description: 'Video content'
    },
    {
      value: (result.coreWebVitals?.LCP || 0) <= 2500,
      weight: 6,
      description: 'Optimal LCP'
    },
    {
      value: (result.coreWebVitals?.FCP || 0) <= 1000,
      weight: 4,
      description: 'Optimal FCP'
    },
    {
      value: (result.coreWebVitals?.TTFB || 0) <= 500,
      weight: 5,
      description: 'Optimal TTFB'
    },
    {
      value: result.mobileCompatibility?.hasViewport || false,
      weight: 4,
      description: 'Mobile viewport'
    },
    {
      value: (result.mobileCompatibility?.smallTouchTargets || 0) === 0,
      weight: 3,
      description: 'Optimal touch targets'
    },
    {
      value: result.securityChecks?.https || false,
      weight: 3,
      description: 'HTTPS'
    },
    {
      value: (result.socialTags?.ogTags?.length || 0) > 0,
      weight: 5,
      description: 'Open Graph tags'
    },
    {
      value: (result.socialTags?.twitterTags?.length || 0) > 0,
      weight: 5,
      description: 'Twitter tags'
    },
    {
      value: (result.structuredData?.length || 0) > 0,
      weight: 5,
      description: 'Structured data'
    }
  ];

  factors.forEach(factor => {
    if (factor.value) {
      score += factor.weight;
      totalWeight += factor.weight;
    }
  });

  const warningCount = result.warnings?.length || 0;
  if (warningCount > 0) {
    const warningPenalty = Math.min(20, warningCount * 2);
    score = Math.max(0, score - warningPenalty);
  }

  return Math.round((score / (totalWeight || 1)) * 100);
};

interface ActionItems {
  high: ActionItem[];
  medium: ActionItem[];
  low: ActionItem[];
}

export const getActionItems = (result: SEOResult): ActionItems => {
  const actionItems: ActionItems = {
    high: [] as ActionItem[],
    medium: [] as ActionItem[],
    low: [] as ActionItem[]
  };

  if (!result) return actionItems;

  // Title checks
  if (!result.title) {
    actionItems.high.push({
      title: 'Missing Page Title',
      description: 'Page title is missing. Add a descriptive title tag.',
      severity: 'high'
    } as ActionItem);
  } else if (result.title.length < 30 || result.title.length > 65) {
    actionItems.medium.push({
      title: 'Suboptimal Title Length',
      description: 'Page title should be between 30-65 characters for optimal display in search results.',
      severity: 'medium'
    } as ActionItem);
  }

  // Description checks
  if (!result.description) {
    actionItems.high.push({
      title: 'Missing Meta Description',
      description: 'Meta description is missing. Add a compelling description to improve click-through rates.',
      severity: 'high'
    } as ActionItem);
  } else if (result.description.length < 70 || result.description.length > 160) {
    actionItems.medium.push({
      title: 'Suboptimal Description Length',
      description: 'Meta description should be between 70-160 characters for optimal display in search results.',
      severity: 'medium'
    } as ActionItem);
  }

  // Heading structure checks
  if (!result.headingStructure?.h1 || result.headingStructure.h1.length === 0) {
    actionItems.high.push({
      title: 'Missing H1 Heading',
      description: 'Page is missing a main H1 heading. Add one to improve content hierarchy.',
      severity: 'high'
    } as ActionItem);
  } else if (result.headingStructure.h1.length > 1) {
    actionItems.medium.push({
      title: 'Multiple H1 Headings',
      description: 'Page has multiple H1 headings. Consider using only one main heading.',
      severity: 'medium'
    } as ActionItem);
  }

  // Image checks
  if (result.imageAlt?.some(img => !img?.alt)) {
    actionItems.medium.push({
      title: 'Missing Alt Text',
      description: 'Some images are missing alt text. Add descriptive alt text for accessibility and SEO.',
      severity: 'medium'
    } as ActionItem);
  }

  // Mobile compatibility checks
  if (!result.mobileCompatibility?.hasViewport) {
    actionItems.high.push({
      title: 'Missing Viewport Meta Tag',
      description: 'Page is missing viewport meta tag for mobile responsiveness.',
      severity: 'high'
    } as ActionItem);
  }

  // Performance checks
  if ((result.coreWebVitals?.LCP ?? 0) > 2500) {
    actionItems.medium.push({
      title: 'Slow Largest Contentful Paint',
      description: 'LCP is above 2.5 seconds. Optimize page loading performance.',
      severity: 'medium'
    } as ActionItem);
  }

  // Security checks
  if (!result.securityChecks?.https) {
    actionItems.high.push({
      title: 'Missing HTTPS',
      description: 'Site is not using HTTPS. Implement secure connection for better security and SEO.',
      severity: 'high'
    } as ActionItem);
  }

  // Social media checks
  if (!result.socialTags?.ogTags?.length) {
    actionItems.low.push({
      title: 'Missing Open Graph Tags',
      description: 'Add Open Graph tags to improve social media sharing.',
      severity: 'low'
    } as ActionItem);
  }

  // Add warnings as action items
  result.warnings?.forEach((warning: Warning | string) => {
    if (typeof warning === 'string') return;
    actionItems.medium.push({
      title: warning.type,
      description: warning.message,
      severity: 'medium'
    } as ActionItem);
  });

  return actionItems;
};

export const getRankingImpactColor = (result: any): string => {
  const score = calculateOverallScore(result);
  if (score >= 85) return 'success';
  if (score >= 65) return 'warning';
  return 'error';
};

export const getRankingImpactIcon = (result: any): string => {
  const score = calculateOverallScore(result);
  if (score >= 85) return 'mdi-arrow-up-bold-circle';
  if (score >= 65) return 'mdi-arrow-right-bold-circle';
  return 'mdi-arrow-down-bold-circle';
};

export const getRankingImpactTitle = (result: any): string => {
  const score = calculateOverallScore(result);
  if (score >= 85) return 'Good ranking potential';
  if (score >= 65) return 'Average ranking potential';
  return 'Low ranking potential';
};

export const getRankingImpactDescription = (result: any): string => {
  const score = calculateOverallScore(result);
  const highIssues = getActionItems(result).high.length;

  if (score >= 85) {
    return 'This page is well optimized and has good chances of ranking well for relevant queries.';
  }
  if (score >= 65) {
    return `With ${highIssues} major issues to fix, this page has average ranking potential that can be improved.`;
  }
  return `This page has ${highIssues} major issues that seriously limit its organic search potential.`;
};

export const getRobotsMeta = (result: any): { index: boolean; follow: boolean } => {
  const robotsTag = result.metaTags?.find((tag: any) => tag.name?.toLowerCase() === 'robots');
  if (!robotsTag) {
    return { index: true, follow: true };
  }

  const content = robotsTag.content.toLowerCase();
  return {
    index: !content.includes('noindex'),
    follow: !content.includes('nofollow')
  };
};

export const parseUrl = (url: string): { pathname: string; host: string } => {
  try {
    const parsedUrl = new URL(url);
    return {
      pathname: parsedUrl.pathname || '/',
      host: parsedUrl.host
    };
  } catch {
    return {
      pathname: '/',
      host: ''
    };
  }
};

export const getPercentageColor = (percentage: number): string => {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'warning';
  return 'error';
};

export const getPerformanceColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}; 