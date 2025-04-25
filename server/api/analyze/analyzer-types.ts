import { load } from 'cheerio';

export interface StructuredData {
  '@type': string | string[];
  '@context'?: string;
  [key: string]: any;
}

export interface SecurityIssue {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface EngagementIssue {
  issue: string;
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low' | 'info';
}

export interface EngagementData {
  ctaCount: number;
  interactiveElements: number;
  visualElements: number;
  socialElements: number;
  navigationScore: number;
  readabilityScore: number;
  engagementTechniques: {
    hasSocialLinks: boolean;
    hasCtaButtons: boolean;
    hasFormsOrInputs: boolean;
    hasVideos: boolean;
    hasImages: boolean;
    hasInteractiveElements: boolean;
    hasFeedbackMechanisms: boolean;
  };
  issues: EngagementIssue[];
}

export interface WebsiteAnalysisResult {
  url: string;
  title?: string;
  description?: string;
  performance: {
    ttfb: number;
    fcp: number;
    lcp: number;
    cls: number;
    speedIndex: number;
    totalBlockingTime: number;
    loadTime: number;
    resourceLoadTimes: {
      total: number;
      html: number;
      css: number;
      js: number;
      images: number;
      other: number;
    };
    resourceSizes: {
      total: number;
      html: number;
      css: number;
      js: number;
      images: number;
      other: number;
    };
  };
  seo: {
    title: string;
    description: string;
    headings: {
      h1: string[];
      h2: string[];
      h3: string[];
      h4: string[];
      h5: string[];
      h6: string[];
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
      data: Array<{
        src: string;
        alt: string;
        title: string;
        size?: number;
        dimensions: {
          width: number;
          height: number;
        };
      }>;
    };
    links: {
      internal: Array<{ href: string; text: string; hasImage: boolean }>;
      external: Array<{ href: string; text: string; hasImage: boolean }>;
      broken: string[];
      nofollow: string[];
    };
    meta: {
      viewport: string | boolean;
      robots?: string;
      canonical?: string;
      og: Record<string, string>;
      twitter: Record<string, string>;
    };
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    structuredData: {
      data: StructuredData[];
      count: number;
      types: Record<string, number>;
    };
    semanticStructure?: {
      score: number;
      issues: Array<{ element: string; issue: string; suggestion: string }>;
      structure: {
        hasHeader: boolean;
        hasMain: boolean;
        hasFooter: boolean;
        hasNav: boolean;
        hasArticle: boolean;
        hasSection: boolean;
        hasAside: boolean;
        hasFigure: boolean;
        validH1Usage: boolean;
        validHeadingStructure: boolean;
      };
      headingStructure: Array<{ level: number; text: string; order: number }>;
      readabilityAnalysis: {
        score: number;
        grade: string;
        wordCount: number;
        sentenceCount: number;
        complexWordCount: number;
        paragraphCount: number;
        averageSentenceLength: number;
        averageWordLength: number;
        suggestion: string;
      };
    };
  };
  technical: {
    statusCode: number;
    https: boolean;
    sitemap?: {
      found: boolean;
      url?: string;
      content?: string;
      urls?: number;
    };
    robotsTxt?: {
      found: boolean;
      content?: string;
    };
    largeFiles?: Array<{
      url: string;
      type: string;
      size: number;
      sizeFormatted: string;
      extension: string;
      name: string;
    }>;
    mobile: {
      viewport: boolean;
      responsive: boolean;
    };
    security: {
      headers: Record<string, string>;
      securityIssues: SecurityIssue[];
    };
    meta: {
      charset?: string;
      language?: string;
      viewport?: string;
      themeColor?: string;
    };
    response: {
      headers: Record<string, string>;
      size: number;
      time: number;
    };
  };
  accessibility: {
    missingAria: number;
    missingAlt: number;
    missingLabels: number;
    missingInputAttributes: number;
    contrastIssues: number;
    ariaIssues: Array<{ element: string, issue: string }>;
    inputIssues: Array<{ element: string, issue: string }>;
    accessibilityScore: number;
  };
  technicalSEO?: {
    sitemapFound: boolean;
    sitemapUrl?: string;
    sitemapUrls?: number;
    robotsTxtFound: boolean;
    robotsTxtContent?: string;
    schemaTypeCount: Record<string, number>;
  };
  socialTags?: {
    openGraph: boolean;
    twitter: boolean;
    twitterTags: Array<{ name: string; content: string }>;
  };
  issues: Array<{
    type: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description?: string;
    recommendation?: string;
  }>;
  engagement?: EngagementData;
}

export interface ExtendedResponse {
  headers: Record<string, string | string[] | undefined>;
  status?: number;
}

export type CheerioSelector = ReturnType<typeof load>;

export interface SiteAnalysisResult {
  urlMap: Record<string, string[]>;
  visitedURLs: string[];
  seoResults: Record<string, WebsiteAnalysisResult>;
  summary: {
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
  };
  generatedSitemap: string;
  rankedUrls: string[];
  schemaOrg?: {
    contactInfo?: Record<string, string>;
    suggestions?: SchemaOrgSuggestion[];
  };
}

export interface SchemaOrgSuggestion {
  type: string;
  properties: Record<string, any>;
  template: string;
}

export interface SchemaOrg {
  suggestions: SchemaOrgSuggestion[];
}

export interface ResourceAnalysis {
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
}

export interface ExtendedWebsiteAnalysisResult extends WebsiteAnalysisResult {
  resources: ResourceAnalysis;
  framework: { name: string; version?: string; confidence: number };
  hosting: { provider: string; type: string; confidence: number };
  domainProvider: { provider: string; confidence: number };
  largeFiles: Array<{ url: string; type: string; size: number; impact: number }>;
}
