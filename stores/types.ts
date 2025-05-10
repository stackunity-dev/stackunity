interface TableColumn {
  name: string;
  type: string;
  primaryKey: boolean;
  foreignKey: boolean;
  notNull: boolean;
  unique: boolean;
  autoIncrement: boolean;
  referencedTable?: string;
  referencedColumn?: string;
}

interface Table {
  name: string;
  columns: Array<TableColumn>;
}

interface DeleteResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface SQLTable {
  name: string;
  columns: Array<TableColumn>;
}

interface SQLSchema {
  id?: number;
  database_name: string;
  tables: Array<SQLTable>;
}

interface StudioComponent {
  id: number;
  name: string;
  content: string;
  component_type: string;
  created_at: string;
  updated_at: string;
}

interface EmailHistoryItem {
  id: number;
  subject: string;
  date: string;
  status: string;
  opens: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  isPremium: boolean;
  isStandard: boolean;
  isBuying?: boolean;
  userId?: number;
  subscription_status?: 'active' | 'trial' | 'expired' | 'none';
  payment_status?: 'paid' | 'pending' | 'none';
  trial_start_date?: Date | string;
  trial_end_date?: Date | string;
  daysLeft?: number;
}

interface CrawlReport {
  urlMap: Record<string, string[]>;
  visitedURLs: string[];
  seoResults: Record<string, any>;
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
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    resourceIssues: {
      css: number;
      js: number;
      images: number;
    };
  };
  generatedSitemap: string;
  rankedUrls: string[];
  issues: Array<{
    type: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  resources: {
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

interface SEOAuditResult {
  success: boolean;
  message?: string;
  result?: CrawlReport;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

interface RandomData {
  totalWarnings: number;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  infoCount: number;
}

interface WebsiteData {
  id: number;
  website_name: string;
  main_url: string;
  all_urls: string[];
  generated_sitemap: string;
  user_id: number;
}

interface ApiRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body: string;
  params: { key: string; value: string }[];
  createdAt: Date;
}

interface ApiResponse {
  id: string;
  requestId: string;
  status: number;
  headers: Record<string, string>;
  data: any;
  duration: number;
  createdAt: Date;
}

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export type { TableColumn, Table, DeleteResponse, SQLTable, SQLSchema, StudioComponent, EmailHistoryItem, User, CrawlReport, SEOAuditResult, LoginResponse, RandomData, WebsiteData, ApiRequest, ApiResponse, CookiePreferences };
