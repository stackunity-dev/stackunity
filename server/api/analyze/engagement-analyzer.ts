import * as cheerio from 'cheerio';
import { CheerioSelector } from './analyzer-types';

export interface EngagementElementInfo {
  text: string;
  type: string;
  selector: string;
  location?: string;
}

export interface EngagementAnalysisResult {
  score: number;
  ctaCount: number;
  interactiveElements: number;
  visualElements: number;
  socialElements: number;
  navigationScore: number;
  readabilityScore: number;
  engagementTechniques: {
    hasSocialLinks: boolean;
    hasCtaButtons: boolean;
    hasFormsOrInputs: boolean;
    hasVideos: boolean;
    hasImages: boolean;
    hasInteractiveElements: boolean;
    hasFeedbackMechanisms: boolean;
  };
  ctaDetails: EngagementElementInfo[];
  interactiveElementsDetails: EngagementElementInfo[];
  socialElementsDetails: EngagementElementInfo[];
  issues: Array<{
    issue: string;
    description: string;
    recommendation: string;
    severity: 'high' | 'medium' | 'low' | 'info';
  }>;
}

export async function analyzeUserEngagement(html: string): Promise<EngagementAnalysisResult> {
  const $ = cheerio.load(html);
  const issues: Array<any> = [];

  const ctaElements = findCallToAction($);
  const ctaCount = ctaElements.length;

  // Détails des CTAs
  const ctaDetails: EngagementElementInfo[] = ctaElements.map((el) => {
    const element = $(el);
    const text = element.text().trim();
    const tagName = element.prop('tagName')?.toLowerCase() || 'unknown';
    const classes = element.attr('class') || '';
    const id = element.attr('id') || '';
    const selector = id ? `#${id}` : `.${classes.split(' ').join('.')}`;

    let location = '';
    const parent = element.parent();
    if (parent.is('header, [role="banner"], .header, .navbar, .nav, .navigation')) {
      location = 'header';
    } else if (parent.is('footer, [role="contentinfo"], .footer')) {
      location = 'footer';
    } else if (parent.is('main, [role="main"], article, section')) {
      location = 'main content';
    } else if (parent.is('aside, [role="complementary"], .sidebar')) {
      location = 'sidebar';
    } else {
      location = 'other';
    }

    return {
      text: text || (element.attr('aria-label') || ''),
      type: tagName,
      selector: selector || tagName,
      location
    };
  });

  const forms = $('form').length;
  const inputs = $('input:not([type="hidden"])').length;
  const buttons = $('button, .btn, [class*="button"], [role="button"]').length;
  const interactiveLinks = $('a[href]:not([href^="#"]):not([href=""]):not([href="#0"])').length;
  const interactiveElements = forms + inputs + buttons;

  // Détails des éléments interactifs
  const interactiveElementsDetails: EngagementElementInfo[] = [];

  $('form').each((_, el) => {
    const element = $(el);
    const action = element.attr('action') || '';
    const id = element.attr('id') || '';
    const classes = element.attr('class') || '';
    const selector = id ? `#${id}` : (classes ? `.${classes.split(' ').join('.')}` : 'form');

    interactiveElementsDetails.push({
      text: `Form with ${element.find('input, button, select, textarea').length} fields`,
      type: 'form',
      selector,
      location: findElementLocation(element)
    });
  });

  const images = $('img, svg, picture').length;
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  const charts = $('[class*="chart"], [class*="graph"], canvas').length;
  const visualElements = images + videos + charts;

  const socialSelectors = 'a[href*="facebook.com/sharer"], a[href*="twitter.com/intent/tweet"], a[href*="linkedin.com/shareArticle"], a[href*="pinterest.com/pin"], a[href*="facebook.com"], a[href*="twitter.com"], a[href*="instagram.com"], a[href*="linkedin.com"], a[href*="youtube.com"], a[href*="github.com"]';
  const socialShareLinks = $('a[href*="facebook.com/sharer"], a[href*="twitter.com/intent/tweet"], a[href*="linkedin.com/shareArticle"], a[href*="pinterest.com/pin"]').length;
  const socialFollowLinks = $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="instagram.com"], a[href*="linkedin.com"], a[href*="youtube.com"], a[href*="github.com"]').not('[href*="sharer"], [href*="intent/tweet"], [href*="shareArticle"]').length;
  const socialElements = socialShareLinks + socialFollowLinks;

  // Détails des éléments sociaux
  const socialElementsDetails: EngagementElementInfo[] = [];
  const seenSocialLinks = new Set<string>();

  $(socialSelectors).each((_, el) => {
    const element = $(el);
    const href = element.attr('href') || '';
    const platform = identifySocialPlatform(href);
    const type = href.includes('sharer') || href.includes('intent/tweet') || href.includes('shareArticle') ? 'share' : 'follow';

    // Éviter les doublons de liens sociaux
    const linkKey = `${platform}-${type}-${href}`;
    if (seenSocialLinks.has(linkKey)) return;
    seenSocialLinks.add(linkKey);

    // Obtenir le bon texte pour le lien social
    let linkText = element.text().trim();
    if (!linkText) {
      // Essayer de trouver un texte dans les attributs ou les icônes
      linkText = element.attr('aria-label') ||
        element.attr('title') ||
        platform;

      // Vérifier si c'est une icône de plateforme sociale
      if (element.find('i[class*="' + platform + '"], svg[class*="' + platform + '"]').length > 0) {
        linkText = platform;
      }
    }

    socialElementsDetails.push({
      text: linkText,
      type: `${platform} ${type}`,
      selector: element.prop('tagName')?.toLowerCase() || 'a',
      location: findElementLocation(element)
    });
  });

  const menuItems = $('nav a, .menu a, .navigation a, [role="navigation"] a').length;
  const navigationScore = evaluateNavigation($, issues);

  const textContent = $('p, h1, h2, h3, h4, h5, h6, li').text();
  const readabilityScore = calculateSimpleReadabilityScore(textContent);

  const engagementTechniques = {
    hasSocialLinks: socialElements > 0,
    hasCtaButtons: ctaCount > 0,
    hasFormsOrInputs: forms > 0 || inputs > 0,
    hasVideos: videos > 0,
    hasImages: images > 0,
    hasInteractiveElements: interactiveElements > 0,
    hasFeedbackMechanisms: $('form[class*="contact"], form[class*="feedback"], form[class*="comment"]').length > 0
  };

  evaluateEngagementIssues($, issues, {
    ctaCount,
    interactiveElements,
    visualElements,
    socialElements,
    navigationScore,
    readabilityScore,
    engagementTechniques
  });

  // Calcul du score global d'engagement
  const score = Math.round(
    (navigationScore * 0.3) +
    (readabilityScore * 0.2) +
    (ctaCount > 0 ? 20 : 0) +
    (interactiveElements > 0 ? 15 : 0) +
    (visualElements > 0 ? 15 : 0) +
    (socialElements > 0 ? 20 : 0)
  );

  return {
    score: Math.min(100, score),
    ctaCount,
    interactiveElements,
    visualElements,
    socialElements,
    navigationScore,
    readabilityScore,
    engagementTechniques,
    ctaDetails,
    interactiveElementsDetails,
    socialElementsDetails,
    issues
  };
}

// Fonction pour identifier la plateforme sociale à partir d'une URL
function identifySocialPlatform(url: string): string {
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('twitter.com')) return 'twitter';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('github.com')) return 'github';
  return 'social';
}

// Fonction pour trouver l'emplacement d'un élément dans la page
function findElementLocation(element: cheerio.Cheerio): string {
  // Approche améliorée pour déterminer l'emplacement
  try {
    // D'abord, vérifier les ancêtres directs
    let currentElement = element;
    let parentHtml = '';

    // Parcourir les 5 niveaux de parents maximum pour trouver des indices sur l'emplacement
    for (let i = 0; i < 5; i++) {
      const parent = currentElement.parent();
      if (!parent || !parent.length) break;

      parentHtml += parent.prop('outerHTML') || '';
      const tagName = parent.prop('tagName')?.toLowerCase() || '';
      const classes = parent.attr('class') || '';
      const id = parent.attr('id') || '';

      // Vérifier les éléments courants par nom de balise, classe ou ID
      if (tagName === 'header' || tagName === 'nav' ||
        classes.includes('header') || classes.includes('navbar') ||
        classes.includes('nav') || id.includes('header') ||
        id.includes('nav') || parent.attr('role') === 'banner' ||
        classes.includes('top-bar') || classes.includes('topbar')) {
        return 'header';
      }

      if (tagName === 'footer' || classes.includes('footer') ||
        id.includes('footer') || parent.attr('role') === 'contentinfo' ||
        classes.includes('bottom-bar') || classes.includes('bottombar')) {
        return 'footer';
      }

      if (tagName === 'aside' || classes.includes('sidebar') ||
        id.includes('sidebar') || parent.attr('role') === 'complementary' ||
        classes.includes('side-panel') || classes.includes('sidepanel')) {
        return 'sidebar';
      }

      if (tagName === 'main' || tagName === 'article' || tagName === 'section' ||
        classes.includes('main') || classes.includes('content') ||
        id.includes('main') || id.includes('content') ||
        parent.attr('role') === 'main' || classes.includes('container')) {
        return 'main content';
      }

      currentElement = parent;
    }

    // Vérifier le contexte plus large grâce au HTML collecté
    const lowerHtml = parentHtml.toLowerCase();
    if (lowerHtml.includes('<header') || lowerHtml.includes('class="header') ||
      lowerHtml.includes('navbar') || lowerHtml.includes('navigation')) {
      return 'header';
    }

    if (lowerHtml.includes('<footer') || lowerHtml.includes('class="footer')) {
      return 'footer';
    }

    if (lowerHtml.includes('<aside') || lowerHtml.includes('sidebar')) {
      return 'sidebar';
    }

    if (lowerHtml.includes('<main') || lowerHtml.includes('<article') ||
      lowerHtml.includes('main-content') || lowerHtml.includes('content-main')) {
      return 'main content';
    }

    // Inférer la position approximative du HTML
    const html = currentElement.closest('html').html() || '';
    const elementHtml = currentElement.html() || '';

    if (html) {
      const position = html.indexOf(elementHtml);
      const totalLength = html.length;

      if (position > 0 && totalLength > 0) {
        const relativePosition = position / totalLength;

        if (relativePosition < 0.25) {
          return 'header';
        } else if (relativePosition > 0.75) {
          return 'footer';
        } else {
          return 'main content';
        }
      }
    }
  } catch (e) {
    // En cas d'erreur, retourner une position par défaut
    console.error('Error finding element location:', e);
  }

  return 'unknown';
}

// Fonction pour obtenir un sélecteur CSS pour un élément

export function findCallToAction($: CheerioSelector): any[] {
  const ctaElements: any[] = [];

  // Sélectionner les éléments ayant des classes ou attributs typiques des CTAs
  $('a.cta, button.cta, .call-to-action, [class*="cta"], a.btn-primary, button.btn-primary, .v-btn, .v-btn--elevated, .v-btn--variant-elevated, .v-btn--primary, .v-btn-primary, [class*="btn"], [class*="button"], [role="button"]').each((_, el) => {
    // Vérifier s'il s'agit d'un bouton avec du contenu textuel
    const $el = $(el);
    // Ignorer les éléments qui sont clairement des enfants d'autres boutons
    if ($el.parents('button, .v-btn, [role="button"]').length > 0) {
      return;
    }

    // Ignorer les overlays, contenus et éléments sans texte visibles
    if ($el.is('.v-btn__overlay, .v-btn__ripple, .v-ripple__container')) {
      return;
    }

    // Ne pas ajouter les éléments sans texte visible sauf s'ils ont un aria-label
    const text = $el.text().trim();
    const ariaLabel = $el.attr('aria-label')?.trim();
    if (!text && !ariaLabel) {
      return;
    }

    ctaElements.push(el);
  });

  const ctaKeywords = [
    'sign up', 'signup', 'register', 'subscribe', 'get started', 'join', 'try', 'download',
    'learn more', 'contact us', 'buy', 'order', 'shop', 'add to cart', 'checkout', 'purchase',
    'get', 'submit', 'send', 'request', 'apply', 'continue', 'start', 'view', 'see', 'explore',
    'inscription', 'inscrire', 'abonnez', 'commencer', 'rejoindre', 'essayer', 'télécharger',
    'en savoir plus', 'contactez', 'acheter', 'commander', 'ajouter au panier', 'panier',
    'obtenir', 'soumettre', 'envoyer', 'demander', 'postuler', 'continuer', 'démarrer',
    'voir', 'explorer', 'découvrir'
  ];

  $('a, button, .v-btn, [role="button"]').each((_, el) => {
    const $el = $(el);
    // Ignorer si déjà un parent dans la liste
    if ($el.parents('button, .v-btn, [role="button"]').length > 0) {
      return;
    }

    const text = $el.text().toLowerCase().trim();
    if (text && ctaKeywords.some(kw => text.includes(kw))) {
      ctaElements.push(el);
    }
  });

  $('a[aria-label], button[aria-label]').each((_, el) => {
    const $el = $(el);
    // Ignorer si déjà un parent dans la liste
    if ($el.parents('button, .v-btn, [role="button"]').length > 0) {
      return;
    }

    const ariaLabel = $el.attr('aria-label')?.toLowerCase() || '';
    if (ariaLabel && ctaKeywords.some(kw => ariaLabel.includes(kw))) {
      ctaElements.push(el);
    }
  });

  // Dédupliquer les éléments
  const uniqueElements: any[] = [];
  const seen = new Set();

  ctaElements.forEach(el => {
    const $el = $(el);
    const elHtml = $el.html() || '';
    const elText = $el.text().trim();
    const elId = $el.attr('id') || '';
    const elClass = $el.attr('class') || '';

    // Créer une clé unique pour l'élément
    const key = `${elId}|${elClass}|${elText}|${$el.prop('tagName')}`;

    if (!seen.has(key) && (elText || $el.attr('aria-label'))) {
      seen.add(key);
      uniqueElements.push(el);
    }
  });

  return uniqueElements;
}

export function evaluateNavigation($: CheerioSelector, issues: any[]): number {
  let score = 100;

  const hasNavigation = $('nav, [role="navigation"], .navigation, .menu, .navbar, .v-navigation-drawer, .v-app-bar, .v-toolbar, .v-tabs').length > 0;
  if (!hasNavigation) {
    issues.push({
      issue: 'Missing main navigation',
      description: 'No main navigation element detected on the page',
      recommendation: 'Add a main navigation element to improve site navigation',
      severity: 'high'
    });
    score -= 20;
  }

  const navItems = $('nav a, [role="navigation"] a, .navigation a, .menu a, .navbar a, .v-navigation-drawer a, .v-app-bar a, .v-toolbar a, .v-btn:not([href=""]), .v-list-item, .v-tab').length;
  if (hasNavigation && navItems < 2) {
    issues.push({
      issue: 'Limited navigation',
      description: 'Navigation menu contains few elements',
      recommendation: 'Add more links to main pages in your navigation menu',
      severity: 'medium'
    });
    score -= 15;
  }

  const hasSearch = $('input[type="search"], [role="search"], form[action*="search"], form[class*="search"], .v-text-field[placeholder*="search"], .v-text-field[placeholder*="recherche"], .v-autocomplete').length > 0;
  if (!hasSearch) {
    issues.push({
      issue: 'Missing search function',
      description: 'No search function detected on the page',
      recommendation: 'Add a search function to help users find content easily',
      severity: 'medium'
    });
    score -= 10;
  }

  return Math.max(0, score);
}

export function calculateSimpleReadabilityScore(text: string): number {
  if (!text || text.length === 0) return 0;

  const cleanText = text.replace(/\s+/g, ' ').trim();

  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;

  const words = cleanText.split(/\s+/).filter(w => w.trim().length > 0);
  if (words.length === 0) return 0;

  const longWords = words.filter(w => w.length > 6);

  const avgSentenceLength = words.length / sentences.length;

  const longWordsPercentage = (longWords.length / words.length) * 100;

  const sentenceScore = Math.max(0, 100 - (avgSentenceLength - 15) * 5);

  const wordsScore = Math.max(0, 100 - (longWordsPercentage - 25) * 2);

  return Math.round((sentenceScore + wordsScore) / 2);
}

export function evaluateEngagementIssues($: CheerioSelector, issues: any[], metrics: any): void {
  if (metrics.ctaCount === 0) {
    issues.push({
      issue: 'Missing CTA',
      description: 'No clear call-to-action detected on the page',
      recommendation: 'Add clear call-to-action buttons to guide users',
      severity: 'high'
    });
  } else if (metrics.ctaCount > 15) {
    issues.push({
      issue: 'Excessive CTAs',
      description: 'Too many call-to-action buttons may confuse users',
      recommendation: 'Reduce CTAs and focus on key actions',
      severity: 'medium'
    });
  }

  if (!metrics.engagementTechniques.hasFormsOrInputs) {
    issues.push({
      issue: 'No interaction forms',
      description: 'No forms or input fields detected on the page',
      recommendation: 'Add at least one form to gather user feedback or information',
      severity: 'medium'
    });
  }

  if (metrics.visualElements < 3) {
    issues.push({
      issue: 'Limited visuals',
      description: 'Page contains few visual elements',
      recommendation: 'Add more images or videos to increase engagement',
      severity: 'medium'
    });
  }

  if (!metrics.engagementTechniques.hasSocialLinks) {
    issues.push({
      issue: 'Missing social links',
      description: 'No social media links detected',
      recommendation: 'Add social media sharing and follow buttons',
      severity: 'low'
    });
  }

  if (metrics.readabilityScore < 50) {
    issues.push({
      issue: 'Poor readability',
      description: 'Content may be difficult to read',
      recommendation: 'Use shorter sentences and simpler vocabulary',
      severity: 'medium'
    });
  }
}

