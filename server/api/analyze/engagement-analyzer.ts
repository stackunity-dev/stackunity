import * as cheerio from 'cheerio';
import { CheerioSelector } from './analyzer-types';

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

  const forms = $('form').length;
  const inputs = $('input:not([type="hidden"])').length;
  const buttons = $('button, .btn, [class*="button"], [role="button"]').length;
  const interactiveLinks = $('a[href]:not([href^="#"]):not([href=""]):not([href="#0"])').length;
  const interactiveElements = forms + inputs + buttons;

  const images = $('img, svg, picture').length;
  const videos = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  const charts = $('[class*="chart"], [class*="graph"], canvas').length;
  const visualElements = images + videos + charts;

  const socialShareLinks = $('a[href*="facebook.com/sharer"], a[href*="twitter.com/intent/tweet"], a[href*="linkedin.com/shareArticle"], a[href*="pinterest.com/pin"]').length;
  const socialFollowLinks = $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="instagram.com"], a[href*="linkedin.com"], a[href*="youtube.com"]').not('[href*="sharer"], [href*="intent/tweet"], [href*="shareArticle"]').length;
  const socialElements = socialShareLinks + socialFollowLinks;

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

  return {
    score: 0,
    ctaCount,
    interactiveElements,
    visualElements,
    socialElements,
    navigationScore,
    readabilityScore,
    engagementTechniques,
    issues
  };
}

function findCallToAction($: CheerioSelector): any[] {
  const ctaElements: any[] = [];

  $('a.cta, button.cta, .call-to-action, [class*="cta"], a.btn-primary, button.btn-primary, .v-btn, .v-btn--elevated, .v-btn--variant-elevated, .v-btn--primary, .v-btn-primary, [class*="btn"], [class*="button"], [role="button"]').each((_, el) => {
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
    const text = $(el).text().toLowerCase().trim();
    if (ctaKeywords.some(kw => text.includes(kw))) {
      ctaElements.push(el);
    }
  });

  $('a[aria-label], button[aria-label]').each((_, el) => {
    const ariaLabel = $(el).attr('aria-label')?.toLowerCase() || '';
    if (ctaKeywords.some(kw => ariaLabel.includes(kw))) {
      ctaElements.push(el);
    }
  });

  const uniqueElements: any[] = [];
  const seen = new Set();

  ctaElements.forEach(el => {
    const key = $(el).html();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueElements.push(el);
    }
  });

  return uniqueElements;
}

function evaluateNavigation($: CheerioSelector, issues: any[]): number {
  let score = 100;

  const hasNavigation = $('nav, [role="navigation"], .navigation, .menu, .navbar, .v-navigation-drawer, .v-app-bar, .v-toolbar, .v-tabs').length > 0;
  if (!hasNavigation) {
    issues.push({
      issue: 'No main navigation',
      description: 'No main navigation element was detected on the page',
      recommendation: 'Add a main navigation element to facilitate navigation on the site',
      severity: 'high'
    });
    score -= 20;
  }

  const navItems = $('nav a, [role="navigation"] a, .navigation a, .menu a, .navbar a, .v-navigation-drawer a, .v-app-bar a, .v-toolbar a, .v-btn:not([href=""]), .v-list-item, .v-tab').length;
  if (hasNavigation && navItems < 2) {
    issues.push({
      issue: 'Limited navigation',
      description: 'The navigation menu contains few elements',
      recommendation: 'Enrich your navigation menu with more links to your main pages',
      severity: 'medium'
    });
    score -= 15;
  }

  const hasSearch = $('input[type="search"], [role="search"], form[action*="search"], form[class*="search"], .v-text-field[placeholder*="search"], .v-text-field[placeholder*="recherche"], .v-autocomplete').length > 0;
  if (!hasSearch) {
    issues.push({
      issue: 'No search function',
      description: 'No search function was detected on the page',
      recommendation: 'Add a search function to allow users to find content easily',
      severity: 'medium'
    });
    score -= 10;
  }

  return Math.max(0, score);
}

function calculateSimpleReadabilityScore(text: string): number {
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

function evaluateEngagementIssues($: CheerioSelector, issues: any[], metrics: any): void {
  if (metrics.ctaCount === 0) {
    issues.push({
      issue: 'Missing CTA',
      description: 'No clear call-to-action was detected on the page',
      recommendation: 'Add clear call-to-action buttons to guide users to desired actions',
      severity: 'high'
    });
  } else if (metrics.ctaCount > 15) {
    issues.push({
      issue: 'Too many CTAs',
      description: 'A large number of call-to-action buttons can create confusion for users',
      recommendation: 'Reduce the number of CTAs and prioritize the most important ones',
      severity: 'medium'
    });
  }

  if (!metrics.engagementTechniques.hasFormsOrInputs) {
    issues.push({
      issue: 'No interaction form',
      description: 'No form or input field was detected on the page',
      recommendation: 'Add at least one form to collect user feedback or information',
      severity: 'medium'
    });
  }

  if (metrics.visualElements < 3) {
    issues.push({
      issue: 'Limited visual content',
      description: 'The page contains few visual elements like images or videos',
      recommendation: 'Enrich your content with visual elements to increase engagement',
      severity: 'medium'
    });
  }

  if (!metrics.engagementTechniques.hasSocialLinks) {
    issues.push({
      issue: 'No social links',
      description: 'No social media links were detected',
      recommendation: 'Add social media sharing and/or following buttons',
      severity: 'low'
    });
  }

  if (metrics.readabilityScore < 50) {
    issues.push({
      issue: 'Low readability',
      description: 'The text content might be difficult to read for some users',
      recommendation: 'Simplify the text, use shorter sentences and more accessible vocabulary',
      severity: 'medium'
    });
  }
}

