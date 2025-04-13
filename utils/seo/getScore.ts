import { ActionItem, ActionItems, SEOResult, Warning } from "./types";

interface AccessibilityIssue {
  element: string;
  issue: string;
  suggestion?: string;
  code?: string;
  severity?: string;
}

export const getScoreColor = (score: number): string => {
  if (score < 50) return 'error';
  if (score < 75) return 'warning';
  return 'success';
};


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

  if (result.accessibility) {
    const accessibilityScore = calculateAccessibilityScore(result.accessibility);
    score = (score * 0.8) + (accessibilityScore * 0.2);
  }

  if (score > 90) score = 90;
  if (warningCount > 5) score = Math.min(score, 70);
  if (warningCount > 10) score = Math.min(score, 50);

  return Math.max(0, Math.min(100, Math.round(score)));
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

export function calculateAccessibilityScore(accessibility: {
  missingAria: number;
  missingAlt: number;
  missingLabels: number;
  missingInputAttributes: number;
  contrastIssues: number;
  ariaIssues?: AccessibilityIssue[];
  inputIssues?: AccessibilityIssue[];
}): number {
  if (!accessibility) return 100;

  const totalIssues = accessibility.missingAria +
    accessibility.missingAlt +
    accessibility.missingLabels +
    accessibility.missingInputAttributes +
    accessibility.contrastIssues +
    (accessibility.ariaIssues?.length || 0) +
    (accessibility.inputIssues?.length || 0);

  if (totalIssues === 0) return 100;

  const pointsPerIssue = 5;
  const maxDeduction = 50;
  const deduction = Math.min(totalIssues * pointsPerIssue, maxDeduction);

  return Math.max(100 - deduction, 0);
}

export const getAccessibilityScoreColor = (score: number): string => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warning';
  return 'error';
};

export const getAccessibilityScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Medium';
  return 'To improve';
};

export const getAccessibilityIssues = (result: SEOResult): ActionItem[] => {
  const issues: ActionItem[] = [];

  if (!result || !result.accessibility) return issues;

  if (result.accessibility.missingAria > 0) {
    issues.push({
      title: `${result.accessibility.missingAria} missing ARIA attributes`,
      description: 'Add ARIA attributes to improve accessibility',
      severity: 'medium'
    });
  }

  if (result.accessibility.missingAlt > 0) {
    issues.push({
      title: `${result.accessibility.missingAlt} images without alt attributes`,
      description: 'Add descriptive alt attributes to all images',
      severity: 'high'
    });
  }

  if (result.accessibility.missingLabels > 0) {
    issues.push({
      title: `${result.accessibility.missingLabels} fields without associated labels`,
      description: 'Associate labels with all form fields',
      severity: 'high'
    });
  }

  if (result.accessibility.missingInputAttributes > 0) {
    issues.push({
      title: `${result.accessibility.missingInputAttributes} fields with missing attributes`,
      description: 'Add required attributes (name, id, etc.) to all form fields',
      severity: 'medium'
    });
  }

  if (result.accessibility.contrastIssues > 0) {
    issues.push({
      title: `${result.accessibility.contrastIssues} contrast issues detected`,
      description: 'Improve the contrast between text and background',
      severity: 'medium'
    });
  }

  return issues;
}; 