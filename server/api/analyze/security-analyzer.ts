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
}

/**
 * Analyse les vulnérabilités de sécurité d'une page web
 */
export function analyzeSecurityVulnerabilities($: CheerioSelector, headers: Record<string, string>, url: string): SecurityAnalysisResult {
  // Initialiser les tableaux pour stocker les vulnérabilités détectées
  const xssVulnerabilities: XSSVulnerability[] = [];
  const csrfVulnerabilities: CSRFVulnerability[] = [];
  const injectionVulnerabilities: InjectionVulnerability[] = [];
  const infoLeakVulnerabilities: InfoLeakVulnerability[] = [];

  // 1. Analyser les vulnérabilités XSS potentielles
  analyzeXSSVulnerabilities($, xssVulnerabilities);

  // 2. Analyser les vulnérabilités CSRF potentielles
  analyzeCSRFVulnerabilities($, csrfVulnerabilities);

  // 3. Analyser les vulnérabilités d'injection potentielles
  analyzeInjectionVulnerabilities($, injectionVulnerabilities);

  // 4. Analyser les fuites d'informations potentielles
  analyzeInfoLeakVulnerabilities($, infoLeakVulnerabilities);

  // 5. Analyser les en-têtes de sécurité
  const headerAnalysis = analyzeSecurityHeaders(headers);

  // 6. Analyser les cookies pour la sécurité
  const cookieAnalysis = analyzeCookies(headers);

  // 7. Vérifier HTTPS
  const https = url.startsWith('https://');

  // Calculer un score global de sécurité
  const score = calculateSecurityScore({
    score: 0, // Cette valeur sera remplacée dans calculateSecurityScore
    xssVulnerabilities,
    csrfVulnerabilities,
    injectionVulnerabilities,
    infoLeakVulnerabilities,
    headerAnalysis,
    cookieAnalysis,
    https
  });

  return {
    score,
    xssVulnerabilities,
    csrfVulnerabilities,
    injectionVulnerabilities,
    infoLeakVulnerabilities,
    headerAnalysis,
    cookieAnalysis,
    https
  };
}

/**
 * Analyse les vulnérabilités XSS potentielles
 */
function analyzeXSSVulnerabilities($: CheerioSelector, vulnerabilities: XSSVulnerability[]): void {
  // 1. Rechercher les événements JavaScript inline risqués
  const riskAttributes = [
    'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
    'onkeydown', 'onkeypress', 'onkeyup', 'onfocus', 'onblur'
  ];

  riskAttributes.forEach(attr => {
    $(`[${attr}]`).each((_, element) => {
      const el = element as Element;
      const code = $(el).attr(attr) || '';

      // Vérifier si le code contient des modèles potentiellement dangereux
      if (code.includes('eval(') || code.includes('document.write(') || code.includes('innerHTML') || code.match(/\$\(.+\)\.html\(/)) {
        vulnerabilities.push({
          element: el.tagName || 'unknown',
          attribute: attr,
          code: code,
          severity: 'high',
          description: `Gestionnaire d'événement ${attr} contient du code potentiellement dangereux`,
          recommendation: `Évitez d'utiliser des gestionnaires d'événements inline, utilisez addEventListener() dans un fichier JS externe`
        });
      } else {
        vulnerabilities.push({
          element: el.tagName || 'unknown',
          attribute: attr,
          code: code,
          severity: 'medium',
          description: `Gestionnaire d'événement ${attr} détecté`,
          recommendation: `Utilisez addEventListener() dans un fichier JavaScript externe plutôt que des attributs d'événements inline`
        });
      }
    });
  });

  // 2. Rechercher <script> avec document.write ou innerHTML
  $('script').each((_, element) => {
    const content = $(element).html() || '';
    if (content.includes('document.write(') || content.includes('innerHTML') || content.includes('eval(')) {
      vulnerabilities.push({
        element: 'script',
        attribute: 'innerText',
        code: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        severity: 'medium',
        description: 'Code JavaScript utilisant des méthodes potentiellement dangereuses (document.write, innerHTML, eval)',
        recommendation: 'Évitez d\'utiliser document.write(), innerHTML ou eval() et privilégiez des méthodes plus sûres comme textContent ou createElement'
      });
    }
  });

  // 3. Rechercher des iframes sans sandbox ou avec allow-scripts
  $('iframe').each((_, element) => {
    const sandbox = $(element).attr('sandbox');

    if (!sandbox) {
      vulnerabilities.push({
        element: 'iframe',
        attribute: 'sandbox',
        code: $.html(element),
        severity: 'medium',
        description: 'iframe sans attribut sandbox',
        recommendation: 'Ajoutez l\'attribut sandbox aux iframes pour limiter leurs capacités'
      });
    } else if (sandbox.includes('allow-scripts') && sandbox.includes('allow-same-origin')) {
      vulnerabilities.push({
        element: 'iframe',
        attribute: 'sandbox',
        code: $.html(element),
        severity: 'medium',
        description: 'iframe avec sandbox allow-scripts et allow-same-origin ensemble',
        recommendation: 'Évitez d\'utiliser allow-scripts et allow-same-origin ensemble car cela annule la protection sandbox'
      });
    }
  });
}

/**
 * Analyse les vulnérabilités CSRF potentielles
 */
function analyzeCSRFVulnerabilities($: CheerioSelector, vulnerabilities: CSRFVulnerability[]): void {
  // Vérifier les formulaires sans token CSRF
  $('form').each((_, element) => {
    const method = ($(element).attr('method') || 'get').toLowerCase();

    // Les formulaires POST sont plus à risque pour CSRF
    if (method === 'post') {
      // Rechercher des champs cachés qui ressemblent à des tokens CSRF
      const hasCSRFToken = $(element).find('input[type="hidden"]').toArray().some(input => {
        const name = $(input).attr('name')?.toLowerCase() || '';
        return name.includes('csrf') || name.includes('token') || name.includes('nonce');
      });

      if (!hasCSRFToken) {
        vulnerabilities.push({
          element: 'form',
          issue: 'Absence de protection CSRF',
          severity: 'high',
          description: 'Formulaire POST sans token CSRF apparent',
          recommendation: 'Ajoutez un token CSRF à tous les formulaires POST pour prévenir les attaques CSRF'
        });
      }
    }
  });
}

/**
 * Analyse les vulnérabilités d'injection potentielles
 */
function analyzeInjectionVulnerabilities($: CheerioSelector, vulnerabilities: InjectionVulnerability[]): void {
  // Rechercher les formulaires sans validation
  $('form').each((_, element) => {
    // Vérifier si les champs ont des validations HTML5
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
        issue: 'Absence de validation client',
        severity: 'medium',
        description: 'Formulaire sans validation côté client apparente',
        recommendation: 'Ajoutez des validations HTML5 (required, pattern, min/maxlength) ou JavaScript à vos formulaires'
      });
    }
  });
}

/**
 * Analyse les fuites d'informations potentielles
 */
function analyzeInfoLeakVulnerabilities($: CheerioSelector, vulnerabilities: InfoLeakVulnerability[]): void {
  // 1. Rechercher des commentaires contenant des informations sensibles
  const htmlComments = $('*').contents().filter(function () {
    return this.type === 'comment';
  });

  htmlComments.each((_, comment) => {
    const content = (comment as any).data || '';

    // Mots clés sensibles dans les commentaires
    const sensitiveKeywords = ['password', 'api', 'key', 'secret', 'token', 'auth', 'pwd', 'credentials', 'todo'];
    const containsSensitiveInfo = sensitiveKeywords.some(keyword => content.toLowerCase().includes(keyword));

    if (containsSensitiveInfo) {
      vulnerabilities.push({
        element: 'comment',
        issue: 'Commentaire avec information potentiellement sensible',
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        severity: 'medium',
        description: 'Commentaire HTML contenant des mots-clés sensibles',
        recommendation: 'Supprimez les commentaires contenant des informations sensibles dans le code de production'
      });
    }
  });

  // 2. Rechercher des identifiants durcis dans le code JavaScript
  $('script').each((_, script) => {
    const content = $(script).html() || '';

    // Expressions régulières pour détecter les identifiants durcis
    const apiKeyRegex = /(['"])?(api[_-]?key|apikey|key|secret|token|password|auth)(['"])?(\s*:\s*(['"])([^'"]+?)\5|\s*=\s*(['"])([^'"]+?)\7)/gi;

    let match;
    while ((match = apiKeyRegex.exec(content))) {
      vulnerabilities.push({
        element: 'script',
        issue: 'Possible identifiant durci dans le code',
        content: match[0],
        severity: 'high',
        description: 'Identifiant ou clé API potentiellement exposé dans le code JavaScript',
        recommendation: 'Stockez les identifiants sensibles côté serveur et utilisez des mécanismes sécurisés comme les variables d\'environnement'
      });
    }
  });
}

/**
 * Analyse les en-têtes de sécurité
 */
function analyzeSecurityHeaders(headers: Record<string, string>): HeaderAnalysisResult {
  const essentialHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy'
  ];

  const present: Record<string, string> = {};
  const missing: string[] = [];

  // Convertir toutes les clés d'en-tête en minuscules pour une comparaison insensible à la casse
  const normalizedHeaders: Record<string, string> = {};
  Object.keys(headers).forEach(key => {
    normalizedHeaders[key.toLowerCase()] = headers[key];
  });

  essentialHeaders.forEach(header => {
    const headerLower = header.toLowerCase();
    if (normalizedHeaders[headerLower]) {
      present[header] = normalizedHeaders[headerLower];
    } else {
      missing.push(header);
    }
  });

  // Calculer un score basé sur le nombre d'en-têtes présents
  const score = (Object.keys(present).length / essentialHeaders.length) * 100;

  return {
    missing,
    present,
    score
  };
}

/**
 * Analyse les cookies pour la sécurité
 */
function analyzeCookies(headers: Record<string, string>): {
  secure: boolean;
  httpOnly: boolean;
  sameSite: boolean;
  score: number;
} {
  let secure = false;
  let httpOnly = false;
  let sameSite = false;

  // Chercher l'en-tête Set-Cookie
  const setCookie = headers['set-cookie'] || headers['Set-Cookie'] || '';

  if (typeof setCookie === 'string') {
    secure = setCookie.includes('Secure');
    httpOnly = setCookie.includes('HttpOnly');
    sameSite = setCookie.includes('SameSite');
  } else if (Array.isArray(setCookie)) {
    // Si plusieurs cookies sont définis
    secure = (setCookie as string[]).some(cookie => cookie.includes('Secure'));
    httpOnly = (setCookie as string[]).some(cookie => cookie.includes('HttpOnly'));
    sameSite = (setCookie as string[]).some(cookie => cookie.includes('SameSite'));
  }

  // Calculer un score de sécurité pour les cookies
  let score = 0;
  if (secure) score += 33.33;
  if (httpOnly) score += 33.33;
  if (sameSite) score += 33.34;

  return {
    secure,
    httpOnly,
    sameSite,
    score
  };
}

/**
 * Calcule un score global de sécurité
 */
function calculateSecurityScore(result: SecurityAnalysisResult): number {
  // Points de base
  let score = 100;

  // Déductions pour chaque type de vulnérabilité
  result.xssVulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') score -= 10;
    else if (vuln.severity === 'high') score -= 7;
    else if (vuln.severity === 'medium') score -= 4;
    else score -= 2; // low
  });

  result.csrfVulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') score -= 10;
    else if (vuln.severity === 'high') score -= 7;
    else if (vuln.severity === 'medium') score -= 4;
    else score -= 2; // low
  });

  result.injectionVulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') score -= 10;
    else if (vuln.severity === 'high') score -= 7;
    else if (vuln.severity === 'medium') score -= 4;
    else score -= 2; // low
  });

  result.infoLeakVulnerabilities.forEach(vuln => {
    if (vuln.severity === 'critical') score -= 10;
    else if (vuln.severity === 'high') score -= 7;
    else if (vuln.severity === 'medium') score -= 4;
    else score -= 2; // low
  });

  // Si HTTPS n'est pas utilisé, c'est une pénalité importante
  if (!result.https) {
    score -= 20;
  }

  // Ajouter un bonus pour les en-têtes de sécurité (jusqu'à 15 points)
  score += (result.headerAnalysis.score / 100) * 15;

  // Ajouter un bonus pour les cookies sécurisés (jusqu'à 10 points)
  score += (result.cookieAnalysis.score / 100) * 10;

  // Assurer que le score reste dans la plage 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
} 