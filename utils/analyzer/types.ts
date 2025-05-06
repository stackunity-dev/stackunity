export interface XSSVulnerability {
  element: string;
  attribute: string;
  code: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface CSRFVulnerability {
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface InjectionVulnerability {
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface InfoLeakVulnerability {
  element: string;
  issue: string;
  content: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

export interface HeaderAnalysisResult {
  missing: string[];
  present: Record<string, string>;
  score: number;
}

export interface SecurityAnalysisResult {
  url?: string;
  score: number;
  xssVulnerabilities?: XSSVulnerability[];
  csrfVulnerabilities?: CSRFVulnerability[];
  injectionVulnerabilities?: InjectionVulnerability[];
  infoLeakVulnerabilities?: InfoLeakVulnerability[];
  headerAnalysis: HeaderAnalysisResult;
  cookieAnalysis: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: boolean;
    score: number;
  };
  https: boolean;
  securityIssues: Array<any>;
  additionalVulnerabilities?: {
    sensitiveDataExposure: number;
    csrfVulnerabilities: number;
    headerVulnerabilities: number;
    otherVulnerabilities: number;
  };
} 