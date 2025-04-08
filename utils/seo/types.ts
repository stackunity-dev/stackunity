export interface SEOResult {
  seoResults?: Record<string, any>;
  url?: string;
  title?: string;
  description?: string;
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4?: string[];
    h5?: string[];
    h6?: string[];
  };
  meta?: {
    viewport?: string;
    robots?: string;
    og?: Record<string, string> | Array<{ property: string; content: string }>;
    twitter?: Record<string, string> | Array<{ name: string; content: string }>;
  };
  images?: {
    withAlt: number;
    withoutAlt: number;
    total: number;
    data?: Array<{
      alt?: string;
      src?: string;
      title?: string;
      width?: number;
      height?: number;
      hasDimensions?: boolean;
    }>;
  };
  technical?: {
    statusCode?: number;
    mobile?: {
      viewport?: boolean;
    };
    https?: boolean;
    schema?: {
      data: any[];
    };
    robots?: {
      found: boolean;
    };
    sitemap?: {
      found: boolean;
    };
    security?: {
      headers?: Array<{ name: string; value: string }>;
      securityIssues?: SecurityIssue[];
    };
    meta?: {
      viewport?: string;
      robots?: string;
      og?: Record<string, string> | Array<{ property: string; content: string }>;
      twitter?: Record<string, string> | Array<{ name: string; content: string }>;
    };
  };
  performance?: {
    ttfb?: number;
    fcp?: number;
    lcp?: number;
    cls?: number;
    speedIndex?: number;
    loadTime?: number;
  };
  accessibility?: {
    missingAria: number;
    missingAlt: number;
    missingLabels: number;
    missingInputAttributes: number;
    contrastIssues: number;
    ariaIssues?: Array<{
      element: string;
      issue: string;
      suggestion?: string;
      code?: string;
      severity?: string;
    }>;
    inputIssues?: Array<{
      element: string;
      issue: string;
      suggestion?: string;
      code?: string;
      severity?: string;
    }>;
    accessibilityScore: number;
  };
  wordCount?: number;
  readability?: number;
  links?: {
    broken: number;
    external: number;
    internal: number;
    nofollow?: number;
    brokenLinks?: Array<{ url: string; text: string }>;
    externalLinks?: Array<{ url: string; text: string }>;
    internalLinks?: Array<{ url: string; text: string }>;
    nofollowLinks?: Array<{ url: string; text: string }>;
  };
  loadTime?: number;
  totalIssues?: number;
  framework?: {
    name: string;
    confidence: number
  };
  hosting?: string | {
    provider: string;
    type?: string;
    confidence?: number
  };
  domainProvider?: string | {
    provider: string;
    confidence?: number
  };
  headingStructure?: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4?: string[];
    h5?: string[];
    h6?: string[];
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
    CLS?: number;
    FID?: number;
    TTFB?: number;
  };
  mobileCompatibility?: {
    hasViewport: boolean;
    smallTouchTargets: number;
    viewportContent?: string;
  };
  securityChecks?: {
    https: boolean;
    securityHeaders: Array<{ name: string; value: string }>;
    securityIssues?: SecurityIssue[];
  };
  socialTags?: {
    ogTags: Array<{ property: string; content: string }>;
    twitterTags: Array<{ name: string; content: string }>;
  };
  technicalSEO?: {
    sitemapFound: boolean;
    sitemapUrl?: string;
    sitemapUrls?: number;
    robotsTxtFound: boolean;
    robotsTxtContent?: string;
    schemaTypeCount: Record<string, number>;
  };
  structuredData?: any[];
  warnings?: Warning[];
  contentStats?: {
    readabilityScore: number;
    wordCount: number;
    keywordDensity: number | Record<string, number>;
  };
  issues?: Array<{
    type: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low'
  }>;

  // Structure imbriquée spécifique à l'API
  seo?: {
    title?: string;
    description?: string;
    headings?: {
      h1: string[];
      h2: string[];
      h3: string[];
      h4?: string[];
      h5?: string[];
      h6?: string[];
    };
    images?: {
      withAlt?: number;
      withoutAlt?: number;
      total?: number;
      data?: Array<{
        alt?: string;
        src?: string;
        title?: string;
        width?: number;
        height?: number;
        hasDimensions?: boolean;
      }>;
    };
    links?: {
      broken: number;
      external: number;
      internal: number;
      nofollow?: number;
      brokenLinks?: Array<any>;
      externalLinks?: Array<any>;
      internalLinks?: Array<any>;
      nofollowLinks?: Array<any>;
    };
    readabilityScore?: number;
    wordCount?: number;
    keywordDensity?: Record<string, number>;
    meta?: {
      viewport?: string;
      robots?: string;
      og?: Record<string, string> | Array<{ property: string; content: string }>;
      twitter?: Record<string, string> | Array<{ name: string; content: string }>;
    };
    structuredData?: {
      data?: any[];
      count?: number;
      types?: Record<string, number>;
    };
    largeFiles?: Array<{
      url: string;
      type: string;
      size: number;
      impact: number;
    }>;
    accessibility?: {
      missingAria: number;
      missingAlt: number;
      missingLabels: number;
      missingInputAttributes: number;
      contrastIssues: number;
      ariaIssues: Array<{ element: string, issue: string }>;
      inputIssues: Array<{ element: string, issue: string }>;
      accessibilityScore: number;
    };
  };

  largeFiles?: Array<{
    url: string;
    type: string;
    size: number;
    impact: number;
  }>;

  resources?: {
    css?: {
      total?: number;
      minified?: number;
      recommendations?: string[];
    };
    js?: {
      total?: number;
      minified?: number;
      recommendations?: string[];
    };
    images?: {
      total?: number;
      optimized?: number;
      unoptimized?: number;
      totalSize?: number;
      recommendations?: string[];
    };
  };
}

export interface SEOReport {
  seoResults: Record<string, SEOResult>;
  summary?: {
    totalPages: number;
    averageLoadTime: number;
    totalWarnings: number;
    missingTitles: number;
    missingDescriptions: number;
    missingAltTags: number;
    averageFCP: number;
    averageLCP: number;
    averageTTFB: number;
    pagesWithStructuredData: number;
    pagesWithSocialTags: number;
    mobileCompatiblePages: number;
    securePages: number;
    missingAria: number;
    missingAlt: number;
    missingLabels: number;
    missingInputAttributes: number;
    contrastIssues: number;
    ariaIssues: Array<{ element: string, issue: string }>;
    inputIssues: Array<{ element: string, issue: string }>;
    accessibilityScore: number;
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    framework?: { name: string, confidence: number },
    hosting?: string,
    domainProvider?: string,
    largeFiles?: Array<{ url: string; type: string; size: number; impact: number }>;
    resourceIssues?: {
      css: number;
      js: number;
      images: number;
    };
  };
  visitedURLs: string[];
  urlMap?: Record<string, string[]>;
  generatedSitemap?: string;
  rankedUrls?: string[];
  issues?: Array<{
    type: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  resources?: {
    css: {
      total: number;
      minified: number;
      recommendations: string[];
    };
    js: {
      total: number;
      minified: number;
      recommendations: string[];
    };
    images: {
      total: number;
      optimized: number;
      unoptimized: number;
      totalSize: number;
      recommendations: string[];
    };
  };
}

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

export interface AccessibilityData {
  missingAria: number;
  missingAlt: number;
  missingLabels: number;
  missingInputAttributes: number;
  contrastIssues: number;
  ariaIssues: Array<{ element: string, issue: string }>;
  inputIssues: Array<{ element: string, issue: string }>;
  accessibilityScore: number;
}

export interface ActionItems {
  high: ActionItem[];
  medium: ActionItem[];
  low: ActionItem[];
}

export interface SecurityIssue {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}