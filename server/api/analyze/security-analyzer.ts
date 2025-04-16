import axios from 'axios';
import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import { CheerioSelector } from './analyzer-types';

interface XSSVulnerability {
  element: string;
  attribute: string;
  code: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface CSRFVulnerability {
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface InjectionVulnerability {
  element: string;
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface InfoLeakVulnerability {
  element: string;
  issue: string;
  content: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
}

interface HeaderAnalysisResult {
  missing: string[];
  present: Record<string, string>;
  score: number;
}

interface SecurityHeader {
  name: string;
  description: string;
  recommendation: string;
  severity: string;
}

interface SecurityWarning {
  header: string;
  value: string;
  issue: string;
  severity: string;
  recommendation: string;
}

interface SecurityHeadersResult {
  url: string;
  headers: Array<{ name: string; value: string }>;
  missingHeaders: SecurityHeader[];
  warnings: SecurityWarning[];
  score: number;
  error?: string;
}

export interface SecurityAnalysisResult {
  score: number;
  xssVulnerabilities: XSSVulnerability[];
  csrfVulnerabilities: CSRFVulnerability[];
  injectionVulnerabilities: InjectionVulnerability[];
  infoLeakVulnerabilities: InfoLeakVulnerability[];
  headerAnalysis: HeaderAnalysisResult;
  cookieAnalysis: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: boolean;
    score: number;
  };
  https: boolean;
  securityIssues: Array<any>;
}

export async function analyzeSecurityVulnerabilities(html: string, url: string, headers?: Record<string, string>): Promise<SecurityAnalysisResult> {

  const xssVulnerabilities: XSSVulnerability[] = [];
  const csrfVulnerabilities: CSRFVulnerability[] = [];
  const injectionVulnerabilities: InjectionVulnerability[] = [];
  const infoLeakVulnerabilities: InfoLeakVulnerability[] = [];

  const $ = cheerio.load(html);

  const allVulnerabilities: Array<any> = [];

  analyzeXSSVulnerabilities($, xssVulnerabilities);
  allVulnerabilities.push(...xssVulnerabilities.map(v => ({ ...v, type: 'xss' })));

  analyzeCSRFVulnerabilities($, csrfVulnerabilities);
  allVulnerabilities.push(...csrfVulnerabilities.map(v => ({ ...v, type: 'csrf' })));

  analyzeInjectionVulnerabilities($, injectionVulnerabilities);
  allVulnerabilities.push(...injectionVulnerabilities.map(v => ({ ...v, type: 'injection' })));

  analyzeInfoLeakVulnerabilities($, infoLeakVulnerabilities);
  allVulnerabilities.push(...infoLeakVulnerabilities.map(v => ({ ...v, type: 'info-leak' })));

  const headerAnalysis: HeaderAnalysisResult = {
    missing: [],
    present: {},
    score: 0
  };

  if (headers) {
    const securityHeaders = extractSecurityHeaders(headers);
    const headerEvaluation = evaluateSecurityHeaders(securityHeaders);
    headerAnalysis.missing = headerEvaluation.missing;
    headerAnalysis.present = securityHeaders;
    headerAnalysis.score = headerEvaluation.score;
  }

  const cookieAnalysis = analyzeCookies(headers || {});

  const https = typeof url === 'string' && url.startsWith('https://');

  const vulnerabilityCounts = {
    xss: xssVulnerabilities.length,
    csrf: csrfVulnerabilities.length,
    injection: injectionVulnerabilities.length,
    infoLeak: infoLeakVulnerabilities.length,
    total: xssVulnerabilities.length + csrfVulnerabilities.length +
      injectionVulnerabilities.length + infoLeakVulnerabilities.length
  };


  const score = calculateSecurityScore({
    score: 0,
    xssVulnerabilities,
    csrfVulnerabilities,
    injectionVulnerabilities,
    infoLeakVulnerabilities,
    headerAnalysis,
    cookieAnalysis,
    https,
    securityIssues: allVulnerabilities
  });

  return {
    score,
    xssVulnerabilities,
    csrfVulnerabilities,
    injectionVulnerabilities,
    infoLeakVulnerabilities,
    headerAnalysis,
    cookieAnalysis,
    https,
    securityIssues: allVulnerabilities
  };
}

function analyzeXSSVulnerabilities($: CheerioSelector, vulnerabilities: XSSVulnerability[]): void {
  const riskAttributes = [
    'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
    'onkeydown', 'onkeypress', 'onkeyup', 'onfocus', 'onblur',
    'onchange', 'onsubmit', 'onreset', 'onselect', 'oncontextmenu',
    'ondblclick', 'onmouseenter', 'onmouseleave', 'onmousedown', 'onmouseup'
  ];


  let found = 0;
  riskAttributes.forEach(attr => {
    $(`[${attr}]`).each((_, element) => {
      const el = element as unknown as Element;
      const code = $(el).attr(attr) || '';
      found++;

      if (code.includes('eval(') || code.includes('document.write(') ||
        code.includes('innerHTML') || code.match(/\$\(.+\)\.html\(/)) {
        vulnerabilities.push({
          element: el.tagName || 'unknown',
          attribute: attr,
          code: code,
          severity: 'high',
          description: `Event handler ${attr} contains potentially dangerous code`,
          recommendation: `Avoid using inline event handlers, use addEventListener() in an external JS file`
        });
      } else {
        vulnerabilities.push({
          element: el.tagName || 'unknown',
          attribute: attr,
          code: code,
          severity: 'medium',
          description: `Event handler ${attr} detected`,
          recommendation: `Use addEventListener() in an external JS file instead of inline event handlers`
        });
      }
    });
  });


  let foundScripts = 0;
  $('script').each((_, element) => {
    const content = $(element).html() || '';
    foundScripts++;

    const dangerousPatterns = [
      { pattern: /document\.write\s*\(/i, desc: 'document.write' },
      { pattern: /\.innerHTML\s*=/i, desc: 'innerHTML' },
      { pattern: /eval\s*\(/i, desc: 'eval' },
      { pattern: /new\s+Function\s*\(/i, desc: 'new Function' },
      { pattern: /setTimeout\s*\(\s*['"`]/i, desc: 'setTimeout with string' },
      { pattern: /setInterval\s*\(\s*['"`]/i, desc: 'setInterval with string' }
    ];

    for (const { pattern, desc } of dangerousPatterns) {
      if (pattern.test(content)) {
        vulnerabilities.push({
          element: 'script',
          attribute: 'innerText',
          code: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          severity: 'medium',
          description: `JavaScript code using ${desc}, potentially dangerous`,
          recommendation: 'Avoid using unsafe methods like document.write(), innerHTML or eval()'
        });
      }
    }
  });


  let foundIframes = 0;
  $('iframe').each((_, element) => {
    const sandbox = $(element).attr('sandbox');
    foundIframes++;

    if (!sandbox) {
      vulnerabilities.push({
        element: 'iframe',
        attribute: 'sandbox',
        code: $.html(element),
        severity: 'medium',
        description: 'iframe without sandbox attribute',
        recommendation: 'Add the sandbox attribute to iframes to limit their capabilities'
      });
    } else if (sandbox.includes('allow-scripts') && sandbox.includes('allow-same-origin')) {
      vulnerabilities.push({
        element: 'iframe',
        attribute: 'sandbox',
        code: $.html(element),
        severity: 'medium',
        description: 'iframe with sandbox allow-scripts and allow-same-origin together',
        recommendation: 'Avoid using allow-scripts and allow-same-origin together because it cancels the sandbox protection'
      });
    }
  });

}

function analyzeCSRFVulnerabilities($: CheerioSelector, vulnerabilities: CSRFVulnerability[]): void {
  const forms = $('form');

  forms.each((_, element) => {
    const method = ($(element).attr('method') || 'get').toLowerCase();
    const action = $(element).attr('action') || '';

    if (method === 'post') {
      const hiddenInputs = $(element).find('input[type="hidden"]');

      const hasCSRFToken = hiddenInputs.toArray().some(input => {
        const name = $(input).attr('name')?.toLowerCase() || '';
        const value = $(input).attr('value') || '';
        const isCSRFToken = name.includes('csrf') ||
          name.includes('token') ||
          name.includes('nonce') ||
          name.includes('xsrf') ||
          name === '_token';

        return isCSRFToken && value.length > 0;
      });

      const hasCSRFHeader = $(element).attr('data-csrf') ||
        $(element).attr('data-token') ||
        $(element).attr('csrf-token');

      if (!hasCSRFToken && !hasCSRFHeader) {
        vulnerabilities.push({
          element: 'form',
          issue: 'No CSRF protection',
          severity: 'high',
          description: 'POST form without CSRF token',
          recommendation: 'Add a CSRF token to all POST forms to prevent CSRF attacks'
        });
      }
    }
  });
}

function analyzeInjectionVulnerabilities($: CheerioSelector, vulnerabilities: InjectionVulnerability[]): void {
  $('form').each((_, element) => {
    const inputs = $(element).find('input:not([type="submit"], [type="button"], [type="reset"], [type="hidden"])');
    let hasValidation = false;

    inputs.each((_, input) => {
      const required = $(input).attr('required') !== undefined;
      const pattern = $(input).attr('pattern') !== undefined;
      const minLength = $(input).attr('minlength') !== undefined;
      const maxLength = $(input).attr('maxlength') !== undefined;
      const type = $(input).attr('type');

      if (required || pattern || minLength || maxLength || (type && ['email', 'tel', 'url', 'number', 'date'].includes(type))) {
        hasValidation = true;
      }
    });

    if (inputs.length > 0 && !hasValidation) {
      vulnerabilities.push({
        element: 'form',
        issue: 'No client validation',
        severity: 'medium',
        description: 'Form without client validation',
        recommendation: 'Add HTML5 validations (required, pattern, min/maxlength) or JavaScript to your forms'
      });
    }
  });
}

function analyzeInfoLeakVulnerabilities($: CheerioSelector, vulnerabilities: InfoLeakVulnerability[]): void {
  const htmlComments = $('*').contents().filter(function () {
    return this.type === 'comment';
  });

  htmlComments.each((_, comment) => {
    const content = (comment as any).data || '';

    const sensitiveKeywords = ['password', 'api', 'key', 'secret', 'token', 'auth', 'pwd', 'credentials', 'todo'];
    const containsSensitiveInfo = sensitiveKeywords.some(keyword => content.toLowerCase().includes(keyword));

    if (containsSensitiveInfo) {
      vulnerabilities.push({
        element: 'comment',
        issue: 'Comment with potentially sensitive information',
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        severity: 'medium',
        description: 'HTML comment containing sensitive keywords',
        recommendation: 'Remove comments containing sensitive information in production code'
      });
    }
  });

  $('script').each((_, script) => {
    const content = $(script).html() || '';

    const apiKeyRegex = /(['"])?(api[_-]?key|apikey|key|secret|token|password|auth)(['"])?(\s*:\s*(['"])([^'"]+?)\5|\s*=\s*(['"])([^'"]+?)\7)/gi;

    let match;
    while ((match = apiKeyRegex.exec(content))) {
      vulnerabilities.push({
        element: 'script',
        issue: 'Possible hardcoded identifier in the code',
        content: match[0],
        severity: 'high',
        description: 'API key or identifier potentially exposed in the JavaScript code',
        recommendation: 'Store sensitive credentials on the server side and use secure mechanisms like environment variables'
      });
    }
  });
}


export async function analyzeSecurityHeaders(url: string): Promise<SecurityHeadersResult> {
  const headers: Record<string, string> = {};
  const missingHeaders: SecurityHeader[] = [];
  const warnings: SecurityWarning[] = [];

  try {

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      validateStatus: () => true,
      maxRedirects: 5,
      timeout: 10000
    });


    Object.entries(response.headers).forEach(([key, value]) => {
      const headerKey = key.toLowerCase();
      if (typeof value === 'string') {
        headers[headerKey] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        headers[headerKey] = value.join(', ');
      }
    });

    const securityHeaders = [
      {
        name: 'Content-Security-Policy',
        key: 'content-security-policy',
        severity: 'high',
        description: 'Helps prevent XSS attacks by defining approved sources for resource loading',
        recommendation: 'Implement a strict CSP that limits content sources'
      },
      {
        name: 'X-Content-Type-Options',
        key: 'x-content-type-options',
        expectedValue: 'nosniff',
        severity: 'medium',
        description: 'Prevents the browser from guessing the content type (MIME sniffing)',
        recommendation: 'Set X-Content-Type-Options to "nosniff"'
      },
      {
        name: 'X-Frame-Options',
        key: 'x-frame-options',
        severity: 'medium',
        description: 'Protects against clickjacking attacks by controlling if a site can be displayed in an iframe',
        recommendation: 'Set X-Frame-Options to "DENY" or "SAMEORIGIN"'
      },
      {
        name: 'Strict-Transport-Security',
        key: 'strict-transport-security',
        severity: 'high',
        description: 'Force HTTPS connections and prevent downgrade to HTTP',
        recommendation: 'Set Strict-Transport-Security with a high max-age'
      },
      {
        name: 'Referrer-Policy',
        key: 'referrer-policy',
        severity: 'medium',
        description: 'Controls the information of the Referer sent during navigation',
        recommendation: 'Set Referrer-Policy with a restrictive value like "same-origin" or "strict-origin"'
      },
      {
        name: 'Permissions-Policy',
        key: 'permissions-policy',
        severity: 'medium',
        description: 'Controls the features of the browser that the page can use',
        recommendation: 'Set Permissions-Policy to limit access to sensitive features'
      },
      {
        name: 'Feature-Policy',
        key: 'feature-policy',
        severity: 'medium',
        description: 'Older version of Permissions-Policy for controlling browser features',
        recommendation: 'Use Permissions-Policy instead (Feature-Policy is deprecated)'
      },
      {
        name: 'X-XSS-Protection',
        key: 'x-xss-protection',
        severity: 'low',
        description: 'Built-in XSS protection filter in the browser (deprecated but still useful for older browsers)',
        recommendation: 'Set X-XSS-Protection to "1; mode=block" but focus mainly on CSP'
      },
      {
        name: 'X-Permitted-Cross-Domain-Policies',
        key: 'x-permitted-cross-domain-policies',
        severity: 'low',
        description: 'Controls the cross-domain policies for Adobe products',
        recommendation: 'Set X-Permitted-Cross-Domain-Policies to "none" if you don\'t use Flash/Adobe products'
      },
      {
        name: 'Cross-Origin-Embedder-Policy',
        key: 'cross-origin-embedder-policy',
        severity: 'medium',
        description: 'Controls how cross-origin resources can be embedded',
        recommendation: 'Use "require-corp" to require an explicit opt-in for loading cross-origin resources'
      },
      {
        name: 'Cross-Origin-Opener-Policy',
        key: 'cross-origin-opener-policy',
        severity: 'medium',
        description: 'Isolates browser windows from cross-origin resources',
        recommendation: 'Use "same-origin" to isolate your site from other origins'
      },
      {
        name: 'Cross-Origin-Resource-Policy',
        key: 'cross-origin-resource-policy',
        severity: 'medium',
        description: 'Prevents other sites from loading your resources',
        recommendation: 'Use "same-origin" or "same-site" depending on your access needs'
      },
      {
        name: 'Cache-Control',
        key: 'cache-control',
        severity: 'medium',
        description: 'Controls the caching behavior of the browser and proxies',
        recommendation: 'Use appropriate directives like "no-store" for sensitive data'
      },
      {
        name: 'Clear-Site-Data',
        key: 'clear-site-data',
        severity: 'low',
        description: 'Allows to clear the site data stored in the browser',
        recommendation: 'Use on logout pages to delete cookies and storage'
      }
    ];

    securityHeaders.forEach(header => {
      const headerValue = headers[header.key];

      if (!headerValue) {
        missingHeaders.push({
          name: header.name,
          description: header.description,
          recommendation: header.recommendation,
          severity: header.severity
        });
      } else {

        if (header.key === 'content-security-policy') {
          if (headerValue.includes('unsafe-inline') || headerValue.includes('unsafe-eval')) {
            warnings.push({
              header: header.name,
              value: headerValue,
              issue: 'Uses unsafe-inline or unsafe-eval',
              severity: 'medium',
              recommendation: 'Avoid unsafe-inline and unsafe-eval in CSP'
            });
          }
        } else if (header.key === 'strict-transport-security') {
          const maxAgeMatch = headerValue.match(/max-age=(\d+)/);
          if (maxAgeMatch && parseInt(maxAgeMatch[1]) < 15768000) { // Moins de 6 mois
            warnings.push({
              header: header.name,
              value: headerValue,
              issue: 'Too short max-age',
              severity: 'low',
              recommendation: 'Use a max-age of at least 6 months (15768000 seconds)'
            });
          }
        } else if (header.key === 'x-content-type-options') {
          if (headerValue !== 'nosniff') {
            warnings.push({
              header: header.name,
              value: headerValue,
              issue: 'Non-compliant value',
              severity: 'medium',
              recommendation: 'Use only "nosniff" as a value'
            });
          }
        } else if (header.key === 'x-frame-options') {
          if (!['DENY', 'SAMEORIGIN'].includes(headerValue.toUpperCase())) {
            warnings.push({
              header: header.name,
              value: headerValue,
              issue: 'Potentially non-compliant value',
              severity: 'medium',
              recommendation: 'Use only "DENY" or "SAMEORIGIN"'
            });
          }
        }
      }
    });

    if (headers['server']) {
      warnings.push({
        header: 'Server',
        value: headers['server'],
        issue: 'Disclosure of the server version',
        severity: 'low',
        recommendation: 'Remove or anonymize the Server header'
      });
    }

    if (headers['x-powered-by']) {
      warnings.push({
        header: 'X-Powered-By',
        value: headers['x-powered-by'],
        issue: 'Disclosure of the technology used',
        severity: 'low',
        recommendation: 'Remove the X-Powered-By header'
      });
    }


    let totalWeight = 0;
    let secureWeight = 0;

    securityHeaders.forEach(header => {
      let weight = 1;

      if (header.severity === 'high') weight = 3;
      else if (header.severity === 'medium') weight = 2;

      totalWeight += weight;

      if (headers[header.key]) {
        const hasWarning = warnings.some(w => w.header === header.name);
        if (!hasWarning) {
          secureWeight += weight;
        } else {
          secureWeight += weight * 0.5;
        }
      }
    });

    const securityScore = Math.round((secureWeight / totalWeight) * 100);

    return {
      url,
      headers: Object.entries(headers).map(([key, value]) => ({ name: key, value })),
      missingHeaders,
      warnings,
      score: securityScore
    };
  } catch (error) {

    return {
      url,
      headers: Object.entries(headers).map(([key, value]) => ({ name: key, value })),
      missingHeaders,
      warnings,
      score: 0,
      error: `Erreur: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}


function analyzeCookies(headers: Record<string, string>): {
  secure: boolean;
  httpOnly: boolean;
  sameSite: boolean;
  score: number;
} {
  let secure = false;
  let httpOnly = false;
  let sameSite = false;

  let setCookieHeader: string | string[] | undefined;

  const headerKeys = Object.keys(headers);
  for (const key of headerKeys) {
    if (key.toLowerCase() === 'set-cookie') {
      setCookieHeader = headers[key];
      break;
    }
  }

  if (!setCookieHeader) {
    return { secure: false, httpOnly: false, sameSite: false, score: 0 };
  }

  const cookieStrings = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  const totalCookies = cookieStrings.length;

  if (totalCookies === 0) {
    return { secure: false, httpOnly: false, sameSite: false, score: 0 };
  }

  let secureCount = 0;
  let httpOnlyCount = 0;
  let sameSiteCount = 0;

  cookieStrings.forEach(cookieStr => {
    if (cookieStr.includes('Secure') || cookieStr.includes('secure')) {
      secureCount++;
    }

    if (cookieStr.includes('HttpOnly') || cookieStr.includes('httponly')) {
      httpOnlyCount++;
    }

    const sameSiteRegex = /samesite\s*=\s*(\w+)/i;
    if (cookieStr.match(sameSiteRegex) || cookieStr.includes('SameSite') || cookieStr.includes('samesite')) {
      sameSiteCount++;
    }
  });

  secure = secureCount / totalCookies >= 0.75;
  httpOnly = httpOnlyCount / totalCookies >= 0.75;
  sameSite = sameSiteCount / totalCookies >= 0.75;

  let score = 0;
  if (secure) score += 33.33;
  if (httpOnly) score += 33.33;
  if (sameSite) score += 33.34;

  return {
    secure,
    httpOnly,
    sameSite,
    score: Math.round(score)
  };
}

function calculateSecurityScore(result: SecurityAnalysisResult): number {
  let score = 100;

  let totalDeduction = 0;
  let vulnerabilityDeduction = 0;
  let httpsDeduction = 0;
  let headersDeduction = 0;
  let cookiesDeduction = 0;

  const processCritical = (vuln: any, type: string) => {
    const severity = vuln.severity || 'medium';
    let deduction = 2;

    if (severity === 'critical') {
      deduction = 10;
    } else if (severity === 'high') {
      deduction = 7;
    } else if (severity === 'medium') {
      deduction = 4;
    } else {
      deduction = 2;
    }

    vulnerabilityDeduction += deduction;
    return deduction;
  };

  result.xssVulnerabilities.forEach(vuln => processCritical(vuln, 'XSS'));

  result.csrfVulnerabilities.forEach(vuln => processCritical(vuln, 'CSRF'));

  result.injectionVulnerabilities.forEach(vuln => processCritical(vuln, 'Injection'));

  result.infoLeakVulnerabilities.forEach(vuln => processCritical(vuln, 'Info Leak'));

  vulnerabilityDeduction = Math.min(50, vulnerabilityDeduction);
  totalDeduction += vulnerabilityDeduction;

  if (!result.https) {
    httpsDeduction = 20;
    totalDeduction += httpsDeduction;
  }

  const headerScore = result.headerAnalysis.score;
  headersDeduction = Math.round((100 - headerScore) * 0.15);
  totalDeduction += headersDeduction;

  const cookieScore = result.cookieAnalysis.score;
  cookiesDeduction = Math.round((100 - cookieScore) * 0.10);
  totalDeduction += cookiesDeduction;

  score -= totalDeduction;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  return finalScore;
}

function extractSecurityHeaders(headers: any): Record<string, string> {
  const securityHeaders: Record<string, string> = {};

  const importantHeaders = [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'x-xss-protection',
    'referrer-policy',
    'permissions-policy',
    'feature-policy',
    'access-control-allow-origin',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'cross-origin-embedder-policy'
  ];

  if (headers && typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      const headerKey = key.toLowerCase();
      if (importantHeaders.includes(headerKey) && value !== undefined && value !== null) {
        securityHeaders[headerKey] = Array.isArray(value) ? value.join(', ') : String(value);
      }
    });
  }

  return securityHeaders;
}

function evaluateSecurityHeaders(headers: Record<string, string>): { score: number; missing: string[] } {
  const securityHeadersInfo = [
    { name: 'content-security-policy', weight: 25, critical: true },
    { name: 'strict-transport-security', weight: 20, critical: true },
    { name: 'x-content-type-options', weight: 10, critical: false },
    { name: 'x-frame-options', weight: 15, critical: true },
    { name: 'x-xss-protection', weight: 10, critical: false },
    { name: 'referrer-policy', weight: 5, critical: false },
    { name: 'permissions-policy', weight: 5, critical: false },
    { name: 'cross-origin-opener-policy', weight: 5, critical: false },
    { name: 'cross-origin-resource-policy', weight: 5, critical: false }
  ];

  let score = 0;
  const missing: string[] = [];

  securityHeadersInfo.forEach(header => {
    if (headers[header.name]) {
      score += header.weight;
    } else {
      missing.push(header.name);
    }
  });

  return { score, missing };
} 