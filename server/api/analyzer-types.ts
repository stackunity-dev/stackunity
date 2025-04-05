import { load } from 'cheerio';

export interface StructuredData {
  '@type': string | string[];
  '@context'?: string;
  [key: string]: any;
}

export interface WebsiteAnalysisResult {
  url: string;
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
        alt?: string;
        title?: string;
        dimensions?: {
          width?: number;
          height?: number;
        };
      }>;
    };
    links: {
      internal: string[];
      external: string[];
      broken: string[];
      nofollow: string[];
    };
    meta: {
      viewport: string | false;
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
  };
  technical: {
    statusCode: number;
    https: boolean;
    mobile: {
      viewport: boolean;
      responsive: boolean;
    };
    security: {
      headers: Record<string, string>;
      certificate: boolean;
    };
  };
  technicalSEO?: {
    sitemapFound: boolean;
    sitemapUrl?: string;
    sitemapUrls?: number;
    robotsTxtFound: boolean;
    robotsTxtContent?: string;
    schemaTypeCount: Record<string, number>;
  };
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    code: string;
  }>;
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

export interface ExtendedWebsiteAnalysisResult extends WebsiteAnalysisResult {
  schemaOrg: SchemaOrg;
} 