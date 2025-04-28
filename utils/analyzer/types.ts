export interface SecurityAnalysisResult {
  score: number;
  url?: string;
  xssVulnerabilities: Array<{
    element: string;
    attribute: string;
    code: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  csrfVulnerabilities: Array<{
    element: string;
    issue: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  injectionVulnerabilities: Array<{
    element: string;
    issue: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  infoLeakVulnerabilities: Array<{
    element: string;
    issue: string;
    content: string;
    severity: string;
    description: string;
    recommendation: string;
  }>;
  headerAnalysis: {
    missing: string[];
    present: Record<string, string>;
    score: number;
  };
  cookieAnalysis: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: boolean;
    score: number;
  };
  https: boolean;
  securityIssues: Array<{
    type: string;
    element?: string;
    attribute?: string;
    code?: string;
    issue?: string;
    content?: string;
    severity: string;
    description: string;
    recommendation?: string;
    impact?: string;
    evidence?: string;
  }>;
  additionalVulnerabilities?: {
    sensitiveDataExposure: number;
    csrfVulnerabilities: number;
    headerVulnerabilities: number;
    otherVulnerabilities: number;
  };
}