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
          width: number;
          height: number;
        };
      }>;
    };
    links: {
      internal: string[];
      external: string[];
      broken: string[];
      nofollow: string[];
    };
    structuredData: {
      data: any[];
      count: number;
      types: Record<string, number>;
    };
    meta: {
      viewport?: string | boolean;
      robots?: string | null;
      canonical?: string | null;
      og: Record<string, string>;
      twitter: Record<string, string>;
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
  content: {
    wordCount: number;
    textHtmlRatio: number;
    readabilityScore: number;
    keywords: Array<{
      word: string;
      count: number;
      density: number;
    }>;
  };
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    code: string;
  }>;
} 