export interface SEOResult {
  score: number;
  title?: string;
  description?: string;
  headingStructure?: any;
  coreWebVitals?: {
    lcp?: number;
    fcp?: number;
    cls?: number;
    ttfb?: number;
  };
  loadTime?: number;
  performance?: {
    lcp?: number;
    fcp?: number;
    cls?: number;
    loadingTime?: number;
    ttfb?: number;
    speedIndex?: number;
    firstMeaningfulPaint?: number;
    timeToInteractive?: number;
  };
  technicalSEO?: {
    title?: string;
    metaDescription?: string;
    h1?: string;
    headingStructure?: string;
  };
  images?: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    data?: Array<{
      url: string;
      alt?: string;
    }>;
  };
  largeFiles?: Array<{
    url: string;
    type: string;
    size: number;
  }>;
  accessibility?: {
    accessibilityScore: number;
    missingAria: number;
    missingAlt: number;
    missingLabels: number;
    contrastIssues: number;
    ariaIssues: string[];
    inputIssues: string[];
  };
}

export interface SEOReport {
  seoResults: Record<string, SEOResult>;
  visitedURLs: string[];
  summary?: {
    score: number;
    issues: string[];
    recommendations: string[];
    totalPages: number;
    averageLoadTime: number;
    totalWarnings: number;
    missingTitles: number;
    missingDescriptions: number;
    missingAltTags: number;
    averageFCP: number;
    averageLCP: number;
    averageCLS: number;
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
    ariaIssues: any[];
    inputIssues: any[];
    accessibilityScore: number;
  };
} 