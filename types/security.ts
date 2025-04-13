export interface SecurityHeader {
  name: string;
  value: string;
}

export interface SecurityWarning {
  header: string;
  value: string;
  issue: string;
  severity: string;
  recommendation: string;
}

export interface SecurityHeadersResult {
  url: string;
  headers: Array<SecurityHeader>;
  missingHeaders: Array<{
    name: string;
    description: string;
    recommendation: string;
    severity: string;
  }>;
  warnings: SecurityWarning[];
  score: number;
  error?: string;
}

export interface MetaTag {
  name: string;
  content: string;
  status: 'success' | 'warning' | 'error' | 'info';
  show?: boolean;
}

export interface MetaTagRecommendation {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
} 