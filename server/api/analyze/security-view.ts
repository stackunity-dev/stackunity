import axios from 'axios';
import { load } from 'cheerio';
import { defineEventHandler, readBody } from 'h3';
import { CheerioSelector } from './analyzer-types';
import { analyzeSecurityVulnerabilities } from './security-analyzer';
import { crawlWebsite } from './utils/crawler';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.url) {
    throw new Error('URL is required');
  }

  function analyzeSensitiveDataExposure($: CheerioSelector, url: string) {
    const issues: Array<any> = [];

    const comments: string[] = [];
    $.root().contents().filter(function () {
      return this.type === 'comment';
    }).each(function () {
      const commentText = (this as any).data.trim();
      comments.push(commentText);

      const sensitivePatterns = [
        /password/i, /pwd/i, /user/i, /username/i, /secret/i, /key/i, /api[_\-\s]?key/i,
        /token/i, /auth/i, /credentials/i, /db/i, /database/i, /todo/i, /fix/i
      ];

      if (sensitivePatterns.some(pattern => pattern.test(commentText))) {
        issues.push({
          type: 'info-leak',
          element: 'comment',
          issue: 'Potential sensitive information in HTML comment',
          content: commentText.length > 100 ? commentText.substring(0, 100) + '...' : commentText,
          severity: 'medium',
          description: 'HTML comment might contain sensitive information',
          recommendation: 'Remove comments containing sensitive data from production code. Comments should never contain passwords, API keys, database connection strings, or other technical information that could aid attackers.',
          impact: 'Attackers can view source code to discover credentials, database structures, and implementation details that could be leveraged in targeted attacks.'
        });
      }
    });

    const generator = $('meta[name="generator"]').attr('content');
    if (generator) {
      issues.push({
        type: 'info-leak',
        element: 'meta',
        issue: 'Technology exposure',
        content: `Generator: ${generator}`,
        severity: 'low',
        description: 'Generator meta tag reveals CMS/framework information',
        recommendation: 'Consider removing or obfuscating the generator meta tag to avoid disclosing the exact version of your CMS/framework. This information can be used by attackers to find known vulnerabilities specific to your technology stack.',
        impact: 'Attackers can use the CMS/framework version information to target known vulnerabilities in that specific version.'
      });
    }

    const errorPatterns = {
      php: [
        /PHP (Fatal|Parse) error/i,
        /Warning: (?:include|require)(?:_once)?/i,
        /Call to undefined function/i,
        /Undefined (variable|index)/i,
        /Cannot (access|modify)/i,
        /SQL syntax.*?error/i,
        /MySQL Error/i,
        /PDO Exception/i
      ],
      asp_dotnet: [
        /Server Error in.*?Application/i,
        /Runtime Error/i,
        /Exception Details:/i,
        /ASP\.NET is configured to show verbose error messages/i,
        /Stack Trace:/i,
        /System\.([A-Za-z.]+)Exception/i
      ],
      python: [
        /Traceback \(most recent call last\)/i,
        /File ".*?", line \d+/i,
        /Django (Error|Exception)/i,
        /Flask (Error|Exception)/i
      ],
      javascript: [
        /Uncaught (TypeError|ReferenceError|SyntaxError|Error)/i,
        /ReferenceError:/i,
        /TypeError:/i,
        /Cannot read properties? of/i
      ],
      database: [
        /ORA-\d{5}/i,
        /mysql_fetch_array\(\)/i,
        /pg_query\(\)/i,
        /SQLException/i,
        /SQLSTATE\[\d+\]/i
      ],
      general: [
        /error in/i,
        /fatal error/i,
        /exception/i,
        /call stack/i,
        /debug/i,
        /syntax error/i
      ]
    };

    const bodyText = $('body').text();
    const detectedErrors: Record<string, string[]> = {};
    const errorExamples: string[] = [];

    for (const [errorType, patterns] of Object.entries(errorPatterns)) {
      detectedErrors[errorType] = [];

      for (const pattern of patterns) {
        const match = bodyText.match(pattern);
        if (match) {
          detectedErrors[errorType].push(pattern.toString().replace(/\/i$/, '').replace(/^\//, ''));

          const matchIndex = match.index || 0;
          const startPos = Math.max(0, matchIndex - 30);
          const endPos = Math.min(bodyText.length, matchIndex + match[0].length + 70);
          const errorContext = bodyText.substring(startPos, endPos).trim();

          if (errorExamples.length < 3) {
            errorExamples.push(errorContext);
          }
        }
      }

      if (detectedErrors[errorType].length === 0) {
        delete detectedErrors[errorType];
      }
    }

    if (Object.keys(detectedErrors).length > 0) {
      const errorTypes = Object.keys(detectedErrors).join(', ');
      const detectedPatterns = Object.values(detectedErrors).flat().slice(0, 5).join(', ');

      issues.push({
        type: 'info-leak',
        element: 'body',
        issue: 'Error/exception disclosure',
        content: errorExamples.join('\n\n').substring(0, 500) + (errorExamples.join('\n\n').length > 500 ? '...' : ''),
        severity: 'high',
        description: `Detected ${errorTypes} error messages that expose implementation details`,
        recommendation: `Configure proper error handling to avoid exposing technical details in production. For ${errorTypes} applications, set up custom error pages and disable detailed error messages in production environments. Use logging systems like Sentry or LogRocket to capture errors without showing them to users.`,
        impact: 'Error messages can reveal information about your database structure, file paths, code logic, and technology stack that can be leveraged by attackers to develop targeted exploits.',
        evidence: detectedPatterns.length > 0 ? `Detected patterns: ${detectedPatterns}` : undefined
      });
    }

    const sensitiveInfoPatterns = [
      {
        type: 'filepath',
        pattern: /(?:\/var\/www\/|\/home\/\w+\/|C:\\inetpub\\wwwroot\\|C:\\Windows\\)/gi,
        description: 'Server file paths exposed'
      },
      {
        type: 'email',
        pattern: /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/g,
        description: 'Email addresses exposed in HTML'
      },
      {
        type: 'ip',
        pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
        description: 'Internal IP addresses exposed'
      },
      {
        type: 'connectionstring',
        pattern: /(?:connectionstring|conn str|connection=|Data Source=|database=|server=|uid=|pwd=|password=)[^<>]+/gi,
        description: 'Potential database connection strings'
      }
    ];

    const htmlContent = $.html();

    for (const { type, pattern, description } of sensitiveInfoPatterns) {
      const matches = htmlContent.match(pattern);

      if (matches && matches.length > 0) {
        const examples = matches.slice(0, 3).join(', ');

        issues.push({
          type: 'info-leak',
          element: 'html',
          issue: `Sensitive information exposure: ${type}`,
          content: examples,
          severity: 'high',
          description: description,
          recommendation: `Remove ${type} information from the HTML source. In many cases, this information is inadvertently exposed through error messages or debugging output. Ensure proper error handling and sanitize any output that might contain internal technical details.`,
          impact: 'This information can be used by attackers to target specific systems, send phishing emails, or attempt to connect to internal services.'
        });
      }
    }

    return issues;
  }

  function analyzeCSRFVulnerabilities($: CheerioSelector, url: string) {
    const issues: Array<any> = [];

    const forms = $('form');
    forms.each(function () {
      const form = $(this);
      const method = (form.attr('method') || 'get').toLowerCase();

      if (method === 'post') {
        const hasCsrfToken =
          form.find('input[name="csrf_token"]').length > 0 ||
          form.find('input[name="_token"]').length > 0 ||
          form.find('input[name="csrfmiddlewaretoken"]').length > 0 ||
          form.find('input[name^="csrf"]').length > 0 ||
          form.find('input[name$="token"]').length > 0 ||
          form.find('meta[name="csrf-token"]').length > 0;

        if (!hasCsrfToken) {
          const formId = form.attr('id') || form.attr('name') || form.attr('action') || 'unnamed form';
          issues.push({
            type: 'csrf',
            element: 'form',
            issue: 'Missing CSRF protection',
            severity: 'high',
            description: `Form "${formId}" appears to lack CSRF protection`,
            recommendation: 'Add CSRF tokens to all forms that modify data'
          });
        }
      }
    });

    return issues;
  }

  function analyzeInsecureHeaders(headers: Record<string, string>) {
    const issues: Array<any> = [];

    if (headers['set-cookie']) {
      const cookies = Array.isArray(headers['set-cookie'])
        ? headers['set-cookie']
        : [headers['set-cookie']];

      for (const cookie of cookies) {
        const hasSecure = /secure/i.test(cookie);
        const hasHttpOnly = /httponly/i.test(cookie);
        const hasSameSite = /samesite/i.test(cookie);

        if (!hasSecure || !hasHttpOnly || !hasSameSite) {
          const cookieName = cookie.split('=')[0];
          issues.push({
            type: 'cookie',
            element: 'header',
            issue: 'Insecure cookie',
            content: cookieName,
            severity: 'medium',
            description: `Cookie "${cookieName}" ${!hasSecure ? 'is not secure, ' : ''}${!hasHttpOnly ? 'is not HttpOnly, ' : ''}${!hasSameSite ? 'has no SameSite attribute' : ''}`.trim().replace(/,\s*$/, ''),
            recommendation: 'Set Secure, HttpOnly, and SameSite attributes on cookies'
          });
        }
      }
    }

    const criticalHeaders = {
      'content-security-policy': 'Content-Security-Policy helps prevent XSS and data injection',
      'x-content-type-options': 'X-Content-Type-Options prevents MIME-type sniffing',
      'x-frame-options': 'X-Frame-Options protects against clickjacking',
      'strict-transport-security': 'Strict-Transport-Security enforces HTTPS connections'
    };

    for (const [header, description] of Object.entries(criticalHeaders)) {
      if (!headers[header]) {
        issues.push({
          type: 'header',
          element: 'header',
          issue: `Missing ${header}`,
          severity: 'medium',
          description: `The ${header} header is missing`,
          recommendation: description
        });
      }
    }

    return issues;
  }

  function analyzePotentialVulnerabilities($: CheerioSelector, url: string) {
    const issues: Array<any> = [];

    const inlineEventAttributes = [
      'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
      'onkeydown', 'onkeypress', 'onkeyup', 'onfocus', 'onblur',
      'onchange', 'onsubmit', 'onreset', 'onselect'
    ];

    inlineEventAttributes.forEach(attr => {
      $(`[${attr}]`).each((_, element) => {
        const code = $(element).attr(attr) || '';
        if (code.includes('eval(') || code.includes('document.write(') || code.includes('innerHTML')) {
          issues.push({
            type: 'xss',
            element: (element as any).name || element.type || 'unknown',
            attribute: attr,
            code: code.length > 100 ? code.substring(0, 100) + '...' : code,
            severity: 'high',
            description: `Potentially unsafe code in ${attr} attribute`,
            recommendation: 'Avoid using inline event handlers with dangerous functions'
          });
        }
      });
    });

    $('input, textarea').each((_, element) => {
      const type = $(element).attr('type') || 'text';
      const name = $(element).attr('name') || '';

      const sensitiveFields = ['password', 'user', 'username', 'email', 'credit', 'card', 'ssn', 'social', 'secret', 'token'];

      if (sensitiveFields.some(field => name.toLowerCase().includes(field))) {
        const autocomplete = $(element).attr('autocomplete');

        if (type === 'password' && autocomplete !== 'off' && autocomplete !== 'new-password') {
          issues.push({
            type: 'security',
            element: 'input',
            issue: 'Password field without autocomplete=off',
            severity: 'low',
            description: 'Password field may be stored in browser',
            recommendation: 'Add autocomplete="off" or autocomplete="new-password" to password fields'
          });
        }

        if (type !== 'password' && sensitiveFields.includes('password') && name.toLowerCase().includes('password')) {
          issues.push({
            type: 'security',
            element: 'input',
            issue: 'Password in non-password field',
            severity: 'high',
            description: 'Password field is not using type="password"',
            recommendation: 'Always use type="password" for password fields'
          });
        }
      }
    });

    return issues;
  }

  try {
    const urlList = await crawlWebsite(body.url, 15);
    const uniqueUrls = [...new Set(urlList)];

    const securityAnalysis = await Promise.all(uniqueUrls.map(async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          timeout: 15000,
          maxRedirects: 5
        });

        const html = response.data;
        const $ = load(html);
        const headers: Record<string, string> = {};
        Object.entries(response.headers).forEach(([key, value]) => {
          if (value !== undefined) {
            headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
          }
        });

        const securityResults = await analyzeSecurityVulnerabilities(html, url, headers);

        const sensitiveDataIssues = analyzeSensitiveDataExposure($, url);
        const csrfIssues = analyzeCSRFVulnerabilities($, url);
        const headerIssues = analyzeInsecureHeaders(headers);
        const potentialVulnerabilities = analyzePotentialVulnerabilities($, url);

        const additionalIssues = [
          ...sensitiveDataIssues,
          ...csrfIssues,
          ...headerIssues,
          ...potentialVulnerabilities
        ];

        let adjustedScore = securityResults.score;
        if (additionalIssues.length > 0) {
          const penaltyPerIssue = {
            'high': 10,
            'medium': 5,
            'low': 2
          };

          let totalPenalty = 0;
          additionalIssues.forEach(issue => {
            totalPenalty += penaltyPerIssue[issue.severity as keyof typeof penaltyPerIssue] || 2;
          });

          const penalty = Math.min(totalPenalty, 50);
          adjustedScore = Math.max(0, adjustedScore - penalty);
        }

        return {
          ...securityResults,
          url: url,
          score: adjustedScore,
          securityIssues: [
            ...securityResults.securityIssues,
            ...additionalIssues
          ],
          additionalVulnerabilities: {
            sensitiveDataExposure: sensitiveDataIssues.length,
            csrfVulnerabilities: csrfIssues.length,
            headerVulnerabilities: headerIssues.length,
            otherVulnerabilities: potentialVulnerabilities.length
          }
        };
      } catch (error) {
        console.error(`Error analyzing security for ${url}:`, error);
        return {
          url,
          score: 0,
          xssVulnerabilities: [],
          csrfVulnerabilities: [],
          injectionVulnerabilities: [],
          infoLeakVulnerabilities: [],
          headerAnalysis: { missing: [], present: {}, score: 0 },
          cookieAnalysis: { secure: false, httpOnly: false, sameSite: false, score: 0 },
          https: url.startsWith('https://'),
          securityIssues: [{
            type: 'error',
            description: `Failed to analyze: ${error.message || 'Unknown error'}`,
            severity: 'medium'
          }],
          additionalVulnerabilities: {
            sensitiveDataExposure: 0,
            csrfVulnerabilities: 0,
            headerVulnerabilities: 0,
            otherVulnerabilities: 0
          }
        };
      }
    }));

    return securityAnalysis;
  } catch (error) {
    console.error('Error in security analysis:', error);
    return [{
      url: body.url,
      score: 0,
      xssVulnerabilities: [],
      csrfVulnerabilities: [],
      injectionVulnerabilities: [],
      infoLeakVulnerabilities: [],
      headerAnalysis: { missing: [], present: {}, score: 0 },
      cookieAnalysis: { secure: false, httpOnly: false, sameSite: false, score: 0 },
      https: body.url.startsWith('https://'),
      securityIssues: [{
        type: 'error',
        description: `Failed to analyze: ${error.message || 'Unknown error'}`,
        severity: 'medium'
      }],
      additionalVulnerabilities: {
        sensitiveDataExposure: 0,
        csrfVulnerabilities: 0,
        headerVulnerabilities: 0,
        otherVulnerabilities: 0
      }
    }];
  }
}); 