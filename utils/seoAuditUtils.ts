export interface WarningItem {
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'meta' | 'content' | 'performance' | 'security' | 'mobile' | 'general' | 'loading' | 'title' | 'description' | 'h1' | 'image' | 'social' | 'structured-data';
}

export interface ActionItem {
  title: string;
  description: string;
  code?: string;
  icon?: string;
}


export const calculateOverallScore = (result: any): number => {
  let score = 100;

  const warningCount = result.warnings?.length || 0;
  if (warningCount > 0) {
    score -= warningCount * 5;

    result.warnings.forEach((warning: any) => {
      if (typeof warning === 'string') return;

      switch (warning.severity) {
        case 'critical':
          score -= 15;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });
  }

  if (!result.title) score -= 20;
  if (!result.description) score -= 15;
  if (result.headingStructure.h1.length === 0) score -= 15;
  if (result.imageAlt.some((img: any) => !img.alt)) score -= 10;

  if (result.coreWebVitals.FCP > 3000) score -= 10;
  if (result.coreWebVitals.LCP > 4000) score -= 10;
  if (result.coreWebVitals.TTFB > 1500) score -= 10;

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

export const getCriticalIssues = (result: any): any[] => {
  const issues = [];

  if (!result.title) {
    issues.push({
      title: 'Missing title',
      description: 'The title tag is required for SEO',
      severity: 'error'
    });
  }

  if (!result.description) {
    issues.push({
      title: 'Missing description',
      description: 'Meta description is important for SEO',
      severity: 'error'
    });
  }

  if (result.headingStructure.h1.length === 0) {
    issues.push({
      title: 'Missing H1',
      description: 'The page must have an H1 heading',
      severity: 'error'
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

export const getReadabilityScore = (result: any): number => {
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

    if (result.headingStructure.h2.length > 0) score += 5;
    if (result.headingStructure.h3.length > 0) score += 5;

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

export const getPerformanceScore = (result: any): number => {
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
      value: result.headingStructure?.h2?.length >= 2,
      weight: 4,
      description: 'At least 2 H2s'
    },
    {
      value: result.headingStructure?.h3?.length >= 1,
      weight: 3,
      description: 'At least 1 H3'
    },

    {
      value: !result.imageAlt.some((img: any) => !img.alt),
      weight: 8,
      description: 'Images with alt'
    },
    {
      value: result.imageAlt.some((img: any) => img.hasDimensions),
      weight: 4,
      description: 'Images with dimensions'
    },
    {
      value: result.videoInfo?.length > 0,
      weight: 3,
      description: 'Video content'
    },

    {
      value: result.coreWebVitals.LCP <= 2500,
      weight: 6,
      description: 'Optimal LCP'
    },
    {
      value: result.coreWebVitals.FCP <= 1000,
      weight: 4,
      description: 'Optimal FCP'
    },
    {
      value: result.coreWebVitals.TTFB <= 500,
      weight: 5,
      description: 'Optimal TTFB'
    },

    {
      value: result.mobileCompatibility.hasViewport,
      weight: 4,
      description: 'Mobile viewport'
    },
    {
      value: result.mobileCompatibility.smallTouchTargets === 0,
      weight: 3,
      description: 'Optimal touch targets'
    },
    {
      value: result.securityChecks.https,
      weight: 3,
      description: 'HTTPS'
    },

    {
      value: result.socialTags.ogTags.length > 0,
      weight: 5,
      description: 'Open Graph tags'
    },
    {
      value: result.socialTags.twitterTags.length > 0,
      weight: 5,
      description: 'Twitter tags'
    },
    {
      value: result.structuredData.length > 0,
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

  return Math.round((score / totalWeight) * 100);
};

export const getMobileScore = (result: any): number => {
  let score = 0;
  let totalWeight = 0;

  const factors = [
    {
      value: result.mobileCompatibility.hasViewport,
      weight: 25,
      description: 'Mobile viewport'
    },
    {
      value: result.mobileCompatibility.smallTouchTargets === 0,
      weight: 20,
      description: 'Optimal touch targets'
    },
    {
      value: result.coreWebVitals.LCP <= 2500,
      weight: 15,
      description: 'Optimal LCP'
    },
    {
      value: result.coreWebVitals.FCP <= 1000,
      weight: 15,
      description: 'Optimal FCP'
    },
    {
      value: result.imageAlt.some((img: any) => img.hasDimensions),
      weight: 15,
      description: 'Responsive images'
    },
    {
      value: result.mobileCompatibility.viewportContent.includes('width=device-width'),
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

  const mobileWarnings = result.warnings?.filter((w: any) =>
    w.type === 'mobile'
  ).length || 0;

  if (mobileWarnings > 0) {
    const warningPenalty = Math.min(20, mobileWarnings * 4);
    score = Math.max(0, score - warningPenalty);
  }

  return Math.round((score / totalWeight) * 100);
};

export const getSEOScore = (result: any): number => {
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
      value: result.headingStructure?.h2?.length >= 2,
      weight: 4,
      description: 'At least 2 H2s'
    },
    {
      value: result.headingStructure?.h3?.length >= 1,
      weight: 3,
      description: 'At least 1 H3'
    },

    {
      value: !result.imageAlt.some((img: any) => !img.alt),
      weight: 8,
      description: 'Images with alt'
    },
    {
      value: result.imageAlt.some((img: any) => img.hasDimensions),
      weight: 4,
      description: 'Images with dimensions'
    },
    {
      value: result.videoInfo?.length > 0,
      weight: 3,
      description: 'Video content'
    },

    {
      value: result.coreWebVitals.LCP <= 2500,
      weight: 6,
      description: 'Optimal LCP'
    },
    {
      value: result.coreWebVitals.FCP <= 1000,
      weight: 4,
      description: 'Optimal FCP'
    },
    {
      value: result.coreWebVitals.TTFB <= 500,
      weight: 5,
      description: 'Optimal TTFB'
    },

    {
      value: result.mobileCompatibility.hasViewport,
      weight: 4,
      description: 'Mobile viewport'
    },
    {
      value: result.mobileCompatibility.smallTouchTargets === 0,
      weight: 3,
      description: 'Optimal touch targets'
    },
    {
      value: result.securityChecks.https,
      weight: 3,
      description: 'HTTPS'
    },

    {
      value: result.socialTags.ogTags.length > 0,
      weight: 5,
      description: 'Open Graph tags'
    },
    {
      value: result.socialTags.twitterTags.length > 0,
      weight: 5,
      description: 'Twitter tags'
    },
    {
      value: result.structuredData.length > 0,
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

  return Math.round((score / totalWeight) * 100);
};

export const getPerformanceColor = (score: number): string => {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
};

export const getActionItems = (result: any): { high: ActionItem[], medium: ActionItem[], low: ActionItem[] } => {
  const actions = {
    high: [] as ActionItem[],
    medium: [] as ActionItem[],
    low: [] as ActionItem[]
  };

  if (!result.title) {
    actions.high.push({
      title: 'Add a title tag',
      description: 'This page has no defined title, which is crucial for SEO and user experience.',
      code: '<title>Descriptive title of your page (55-65 characters)</title>',
      icon: 'mdi-format-title'
    });
  } else if (result.title.length < 30 || result.title.length > 65) {
    actions.medium.push({
      title: 'Optimize title length',
      description: `Your title is ${result.title.length} characters. The ideal length is between 30 and 65 characters.`,
      icon: 'mdi-format-title'
    });
  }

  if (!result.description) {
    actions.high.push({
      title: 'Add a meta description',
      description: 'This page has no meta description, which is important for click-through rates in search results.',
      code: '<meta name="description" content="Concise and attractive description of your page (150-160 characters)">',
      icon: 'mdi-text-box'
    });
  } else if (result.description.length < 70 || result.description.length > 160) {
    actions.medium.push({
      title: 'Optimize description length',
      description: `Your description is ${result.description.length} characters. The ideal length is between 70 and 160 characters.`,
      icon: 'mdi-text-box'
    });
  }

  if (result.headingStructure.h1.length === 0) {
    actions.high.push({
      title: 'Add an H1 heading',
      description: 'This page has no H1 heading, which is essential for content hierarchy and SEO.',
      code: '<h1>Main title of your page</h1>',
      icon: 'mdi-format-header-1'
    });
  } else if (result.headingStructure.h1.length > 1) {
    actions.medium.push({
      title: 'Reduce the number of H1 headings',
      description: `Your page has ${result.headingStructure.h1.length} H1 headings. Ideally, a page should have only one H1.`,
      icon: 'mdi-format-header-1'
    });
  }

  const imagesWithoutAlt = result.imageAlt.filter((img: any) => !img.alt);
  if (imagesWithoutAlt.length > 0) {
    actions.high.push({
      title: `Add alt attributes to ${imagesWithoutAlt.length} image(s)`,
      description: 'Images without alt attributes harm accessibility and SEO.',
      code: `<img src="example.jpg" alt="Relevant description of the image">`,
      icon: 'mdi-image'
    });
  }

  if (!result.mobileCompatibility.hasViewport) {
    actions.high.push({
      title: 'Add a viewport meta tag',
      description: 'Your page has no viewport tag, which is essential for mobile display.',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      icon: 'mdi-cellphone'
    });
  }

  return actions;
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