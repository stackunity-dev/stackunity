export default {
  meta: {
    title: 'Security Analysis',
    description: 'Analyze the security vulnerabilities of your website'
  },
  form: {
    urlLabel: 'URL to analyze',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Enter the complete URL including https://',
    urlRuleInvalid: 'Please enter a valid URL starting with http:// or https://',
    analyzeButton: 'Analyze content',
    analyzeAriaLabel: 'Analyze content'
  },
  loading: {
    ariaLabel: 'Loading the analysis results'
  },
  results: {
    title: 'Analysis Results',
    globalScore: 'Global Score',
    headers: 'Headers',
    cookies: 'Cookies',
    vulnerabilities: 'Vulnerabilities'
  },
  scoreLabel: 'Score: {value}%',
  headers: {
    tab: 'Headers',
    securityHeaders: 'Security Headers',
    scoreLabel: 'Score: {value}%',
    missingHeaders: 'Missing Headers',
    allPresent: 'All security headers are present'
  },
  cookies: {
    tab: 'Cookies',
    securityTitle: 'Cookies Security',
    scoreLabel: 'Score: {value}%',
    secureAttribute: 'Secure attribute',
    httpOnlyAttribute: 'HttpOnly attribute',
    sameSiteAttribute: 'SameSite attribute',
    present: 'Present',
    missing: 'Missing',
    https: 'HTTPS',
    httpsEnabled: 'HTTPS Enabled'
  },
  vulnerabilities: {
    tab: 'Vulnerabilities',
    title: 'Detected Vulnerabilities',
    scoreLabel: 'Score: {value}%',
    level: 'Level',
    levels: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      info: 'Info'
    },
    noVulnerabilities: 'No vulnerabilities detected',
    details: {
      title: 'Details',
      description: 'Description',
      impact: 'Impact',
      remediation: 'Remediation',
      element: 'Element',
      problemCode: 'Problem Code',
      issue: 'Issue',
      content: 'Content',
      recommendation: 'Recommendation',
      evidence: 'Evidence',
      detectedVulnerabilities: 'Detected Vulnerabilities',
    },
    summary: 'Detected Vulnerabilities',
    sensitiveData: 'Sensitive Data',
    issuesDetected: 'Issues Detected',
    csrf: 'CSRF',
    headerIssues: 'Header Issues',
    otherIssues: 'Other Issues'
  },
  recommendations: {
    title: 'Security Recommendations',
    implementHeaders: 'Implement Missing Headers',
    secureCookies: 'Secure Cookies',
    fixVulnerabilities: 'Fix Vulnerabilities',
    enableHttps: 'Enable HTTPS'
  }
} 