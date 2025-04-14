export const calculateMetaTagsScore = (result) => {
  if (!result) return 0;

  let score = 0;
  let total = 0;
  let debugInfo: {
    title?: number;
    description?: number;
    canonical?: number;
    openGraph?: number;
    twitter?: number;
    alternateLanguages?: number;
    favicon?: number;
    ogTagsCount?: number;
    twitterTagsCount?: number;
  } = {};

  const hasTitle = result.title || (result.seo && result.seo.title);
  if (hasTitle) {
    score += 20;
    debugInfo.title = 20;
  } else {
    debugInfo.title = 0;
  }
  total += 20;

  const hasDescription = result.metaDescription ||
    (result.seo && result.seo.description) ||
    result.description;
  if (hasDescription) {
    score += 20;
    debugInfo.description = 20;
  } else {
    debugInfo.description = 0;
  }
  total += 20;

  const hasCanonical = result.canonical || (result.seo && result.seo.canonical);
  if (hasCanonical) {
    score += 15;
    debugInfo.canonical = 15;
  } else {
    debugInfo.canonical = 0;
  }
  total += 15;

  // Vérification des OpenGraph tags
  let ogTagsCount = 0;
  if (result.openGraph && Object.keys(result.openGraph).length > 0) {
    ogTagsCount = Object.keys(result.openGraph).length;
  } else if (result.seo && result.seo.meta && result.seo.meta.og) {
    ogTagsCount = Object.keys(result.seo.meta.og).length;
  } else if (result.socialTags && result.socialTags.ogTags) {
    if (Array.isArray(result.socialTags.ogTags)) {
      ogTagsCount = result.socialTags.ogTags.length;
    } else {
      ogTagsCount = Object.keys(result.socialTags.ogTags).length;
    }
  }

  debugInfo.ogTagsCount = ogTagsCount;

  if (ogTagsCount > 0) {
    score += 15;
    debugInfo.openGraph = 15;
  } else {
    debugInfo.openGraph = 0;
  }
  total += 15;

  // Vérification des Twitter Cards
  let twitterTagsCount = 0;
  if (result.twitterCards && Object.keys(result.twitterCards).length > 0) {
    twitterTagsCount = Object.keys(result.twitterCards).length;
  } else if (result.seo && result.seo.meta && result.seo.meta.twitter) {
    twitterTagsCount = Object.keys(result.seo.meta.twitter).length;
  } else if (result.socialTags && result.socialTags.twitterTags) {
    if (Array.isArray(result.socialTags.twitterTags)) {
      twitterTagsCount = result.socialTags.twitterTags.length;
    } else {
      twitterTagsCount = Object.keys(result.socialTags.twitterTags).length;
    }
  }

  debugInfo.twitterTagsCount = twitterTagsCount;

  if (twitterTagsCount > 0) {
    score += 10;
    debugInfo.twitter = 10;
  } else {
    debugInfo.twitter = 0;
  }
  total += 10;

  // Vérification des langues alternatives
  const hasAlternateLanguages = result.alternateLanguages &&
    Array.isArray(result.alternateLanguages) &&
    result.alternateLanguages.length > 0;
  if (hasAlternateLanguages) {
    score += 10;
    debugInfo.alternateLanguages = 10;
  } else {
    debugInfo.alternateLanguages = 0;
  }
  total += 10;

  // Vérification du favicon
  const hasFavicon = result.favicon ||
    (result.seo && result.seo.favicon) ||
    (result.technical && result.technical.favicon);
  if (hasFavicon) {
    score += 10;
    debugInfo.favicon = 10;
  } else {
    debugInfo.favicon = 0;
  }
  total += 10;

  // Calcul du pourcentage
  const finalScore = total > 0 ? Math.round((score / total) * 100) : 0;

  return finalScore;
};

export const calculateContentScore = (result) => {
  if (!result) return 0;

  let score = 0;
  let total = 0;

  // Définir un objet avec des propriétés pour le debugging
  let debugInfo: {
    h1?: number;
    h2h3?: number;
    contentLength?: number;
    contentScore1?: number;
    contentScore2?: number;
    hasImages?: boolean;
    imagesWithAlt?: number;
    imagesTotal?: number;
    imageScore?: number;
    internalLinks?: number;
    externalLinks?: number;
  } = {};

  // Structure du contenu - H1
  const hasH1 = (result.headings && result.headings.h1 && result.headings.h1.length > 0) ||
    (result.headingStructure && result.headingStructure.h1 && result.headingStructure.h1.length > 0) ||
    (result.seo && result.seo.headings && result.seo.headings.h1 && result.seo.headings.h1.length > 0);

  if (hasH1) {
    score += 15;
    debugInfo.h1 = 15;
  } else {
    debugInfo.h1 = 0;
  }
  total += 15;

  // Structure du contenu - H2, H3
  const hasH2orH3 = (result.headings &&
    ((result.headings.h2 && result.headings.h2.length > 0) ||
      (result.headings.h3 && result.headings.h3.length > 0))) ||
    (result.headingStructure &&
      ((result.headingStructure.h2 && result.headingStructure.h2.length > 0) ||
        (result.headingStructure.h3 && result.headingStructure.h3.length > 0))) ||
    (result.seo && result.seo.headings &&
      ((result.seo.headings.h2 && result.seo.headings.h2.length > 0) ||
        (result.seo.headings.h3 && result.seo.headings.h3.length > 0)));

  if (hasH2orH3) {
    score += 10;
    debugInfo.h2h3 = 10;
  } else {
    debugInfo.h2h3 = 0;
  }
  total += 10;

  // Richesse du contenu - longueur
  const contentLength = result.contentLength ||
    (result.seo && result.seo.wordCount) ||
    result.wordCount || 0;

  debugInfo.contentLength = contentLength;

  if (contentLength > 300) {
    score += 15;
    debugInfo.contentScore1 = 15;

    if (contentLength > 800) {
      score += 10;
      debugInfo.contentScore2 = 10;
    } else {
      debugInfo.contentScore2 = 0;
    }
  } else {
    debugInfo.contentScore1 = 0;
    debugInfo.contentScore2 = 0;
  }
  total += 25;

  // Images avec attributs alt
  const images = result.images ||
    (result.seo && result.seo.images) ||
    (result.images && result.images.data);

  debugInfo.hasImages = !!images;

  if (images) {
    let imagesArray: any[] = [];
    let imagesWithAlt = 0;
    let imagesTotal = 0;

    // Cas où images est un tableau
    if (Array.isArray(images)) {
      imagesArray = images;
    }
    // Cas où images.data est un tableau 
    else if (images.data && Array.isArray(images.data)) {
      imagesArray = images.data;
    }

    // Si nous avons trouvé un tableau d'images
    if (imagesArray.length > 0) {
      imagesWithAlt = imagesArray.filter(img => img && img.alt).length;
      imagesTotal = imagesArray.length;

      debugInfo.imagesWithAlt = imagesWithAlt;
      debugInfo.imagesTotal = imagesTotal;

      if (imagesTotal > 0) {
        // Attribution du score : 100% si toutes les images ont des alt, score proportionnel sinon
        const altPercentage = imagesWithAlt / imagesTotal;
        score += Math.round(altPercentage * 20);
        debugInfo.imageScore = Math.round(altPercentage * 20);
      }
    }
    // Cas où images est un objet avec des statistiques
    else if (typeof images === 'object') {
      if (images.withAlt !== undefined && images.total !== undefined && images.total > 0) {
        const altPercentage = images.withAlt / images.total;
        score += Math.round(altPercentage * 20);
        debugInfo.imageScore = Math.round(altPercentage * 20);
        debugInfo.imagesWithAlt = images.withAlt;
        debugInfo.imagesTotal = images.total;
      }
    }
  } else {
    debugInfo.imageScore = 0;
  }
  total += 20;

  // Liens internes
  const hasInternalLinks = (result.links && result.links.internal && result.links.internal.length > 0) ||
    (result.internalLinks && result.internalLinks.length > 0);

  if (hasInternalLinks) {
    score += 15;
    debugInfo.internalLinks = 15;
  } else {
    debugInfo.internalLinks = 0;
  }
  total += 15;

  // Liens externes
  const hasExternalLinks = (result.links && result.links.external && result.links.external.length > 0) ||
    (result.externalLinks && result.externalLinks.length > 0);

  if (hasExternalLinks) {
    score += 15;
    debugInfo.externalLinks = 15;
  } else {
    debugInfo.externalLinks = 0;
  }
  total += 15;

  // Calcul du pourcentage
  const finalScore = total > 0 ? Math.round((score / total) * 100) : 0;


  return finalScore;
};

export const calculateTechnicalSeoScore = (result) => {
  if (!result) return 0;

  let score = 0;
  let total = 0;
  let debugInfo: {
    viewport?: number;
    urlStructure?: number;
    https?: number;
    robotsTxt?: number;
    sitemap?: number;
    schema?: number;
    webVitals?: number;
    url?: string;
    structuredDataCount?: number;
  } = {};

  debugInfo.url = result.url || 'unknown';

  // Mobile friendly - Viewport
  const hasViewport = result.viewport ||
    (result.technical && result.technical.mobile && result.technical.mobile.viewport) ||
    (result.mobileCompatibility && result.mobileCompatibility.hasViewport);

  if (hasViewport) {
    score += 15;
    debugInfo.viewport = 15;
  } else {
    debugInfo.viewport = 0;
  }
  total += 15;

  // URL structure - pas de paramètres ni de fragment
  // Si l'URL est "/" ou courte sans paramètres, la considérer comme optimisée
  const hasCleanUrl = result.url && typeof result.url === 'string' &&
    (result.url === "/" ||
      (!result.url.includes('?') && !result.url.includes('#')));

  if (hasCleanUrl) {
    score += 10;
    debugInfo.urlStructure = 10;
  } else {
    debugInfo.urlStructure = 0;
  }
  total += 10;

  // HTTPS
  const hasHttps = result.url && typeof result.url === 'string' &&
    (result.url.startsWith('https') || result.url === "/" ||
      (result.securityChecks && result.securityChecks.https === true));

  if (hasHttps) {
    score += 15;
    debugInfo.https = 15;
  } else {
    debugInfo.https = 0;
  }
  total += 15;

  // Robots.txt
  const hasRobotsTxt = result.robotsTxt ||
    (result.technicalSEO && result.technicalSEO.robotsTxtFound) ||
    (result.technical && result.technical.robotsTxt);

  if (hasRobotsTxt) {
    score += 10;
    debugInfo.robotsTxt = 10;
  } else {
    debugInfo.robotsTxt = 0;
  }
  total += 10;

  // XML Sitemap
  const hasSitemap = result.sitemap ||
    (result.technicalSEO && result.technicalSEO.sitemapFound) ||
    (result.technical && result.technical.sitemap);

  if (hasSitemap) {
    score += 10;
    debugInfo.sitemap = 10;
  } else {
    debugInfo.sitemap = 0;
  }
  total += 10;

  // Schema.org markup
  // Vérification du structured data avec plusieurs méthodes
  let structuredDataCount = 0;
  if (result.structuredData) {
    if (Array.isArray(result.structuredData)) {
      structuredDataCount = result.structuredData.length;
    } else if (result.structuredData.data && Array.isArray(result.structuredData.data)) {
      structuredDataCount = result.structuredData.data.length;
    }
  } else if (result.schemaOrg && Object.keys(result.schemaOrg).length > 0) {
    structuredDataCount = Object.keys(result.schemaOrg).length;
  } else if (result.technicalSEO && result.technicalSEO.schemaTypeCount &&
    Object.keys(result.technicalSEO.schemaTypeCount).length > 0) {
    structuredDataCount = Object.keys(result.technicalSEO.schemaTypeCount).length;
  }

  debugInfo.structuredDataCount = structuredDataCount;

  if (structuredDataCount > 0) {
    score += 15;
    debugInfo.schema = 15;
  } else {
    debugInfo.schema = 0;
  }
  total += 15;

  // Page speed (basé sur les Core Web Vitals)
  let webVitalsScore = 0;
  if (result.coreWebVitals) {
    let vitalsScore = 0;
    let vitalsCount = 0;
    let totalPossibleScore = 0;

    const vitalTargets = {
      LCP: { good: 2500, poor: 4000 },   // ms - moins c'est mieux
      FCP: { good: 1800, poor: 3000 },   // ms - moins c'est mieux
      CLS: { good: 0.1, poor: 0.25 },    // score - moins c'est mieux
      TTFB: { good: 800, poor: 1800 },   // ms - moins c'est mieux
      FID: { good: 100, poor: 300 }      // ms - moins c'est mieux
    };

    for (const vital of Object.keys(vitalTargets)) {
      const value = result.coreWebVitals[vital];
      if (value !== undefined && !isNaN(Number(value))) {
        const numValue = Number(value);
        let vitalScore = 0;

        // Calculer le score en fonction des valeurs cibles
        if (vital === 'CLS') {
          // Pour CLS, moins c'est mieux (0 est parfait)
          if (numValue <= vitalTargets.CLS.good) vitalScore = 100;
          else if (numValue >= vitalTargets.CLS.poor) vitalScore = 0;
          else {
            // Calcul linéaire entre good et poor
            const range = vitalTargets.CLS.poor - vitalTargets.CLS.good;
            const position = numValue - vitalTargets.CLS.good;
            vitalScore = 100 - Math.round((position / range) * 100);
          }
        } else {
          // Pour les autres métriques en ms, moins c'est mieux
          const targets = vitalTargets[vital];
          if (numValue <= targets.good) vitalScore = 100;
          else if (numValue >= targets.poor) vitalScore = 0;
          else {
            // Calcul linéaire entre good et poor
            const range = targets.poor - targets.good;
            const position = numValue - targets.good;
            vitalScore = 100 - Math.round((position / range) * 100);
          }
        }

        vitalsScore += vitalScore;
        vitalsCount++;
        totalPossibleScore += 100;

        console.log(`Vital ${vital}: Value=${numValue}, Score=${vitalScore}`);
      }
    }

    if (vitalsCount > 0) {
      webVitalsScore = Math.round((vitalsScore / totalPossibleScore) * 25);
      score += webVitalsScore;
      debugInfo.webVitals = webVitalsScore;
    } else {
      webVitalsScore = 12;
      score += webVitalsScore;
      debugInfo.webVitals = webVitalsScore;
    }
  } else {
    webVitalsScore = 12;
    score += webVitalsScore;
    debugInfo.webVitals = webVitalsScore;
  }
  total += 25;

  const finalScore = total > 0 ? Math.round((score / total) * 100) : 0;


  return finalScore;
};

export const calculateAccessibilityScore = (result) => {
  if (!result) return 0;

  // Vérifier si le score d'accessibilité existe déjà dans result
  if (result.accessibilityScore !== undefined) {
    return Number(result.accessibilityScore);
  }

  let score = 0;
  let total = 0;

  // Objet pour le débogage et le suivi des points
  let debugInfo = {
    imagesWithAlt: 0,
    headingStructure: 0,
    ariaAttributes: 0,
    contrastIssues: 0,
    formAccessibility: 0,
    totalScore: 0
  };

  // 1. Vérification des images avec attributs alt
  const images = result.images ||
    (result.seo && result.seo.images) ||
    (result.images && result.images.data) ||
    (result.accessibility && result.accessibility.images);

  if (images) {
    let imagesArray = Array.isArray(images) ? images : (images.data || []);
    if (imagesArray.length > 0) {
      let imagesWithAlt = imagesArray.filter(img => img && img.alt).length;
      let imagesTotal = imagesArray.length;
      if (imagesTotal > 0) {
        debugInfo.imagesWithAlt = Math.round((imagesWithAlt / imagesTotal) * 25);
        score += debugInfo.imagesWithAlt;
      }
    } else if (typeof images === 'object') {
      if (images.withAlt !== undefined && images.total !== undefined && images.total > 0) {
        debugInfo.imagesWithAlt = Math.round((images.withAlt / images.total) * 25);
        score += debugInfo.imagesWithAlt;
      }
    }
  } else if (result.accessibility && result.accessibility.missingAlt !== undefined) {
    // Alternative avec la nouvelle structure d'accessibilité
    const missingAlt = result.accessibility.missingAlt;
    const totalImgs = result.accessibility.totalImages || (missingAlt + (result.accessibility.imagesWithAlt || 0));

    if (totalImgs > 0) {
      const altScore = Math.round(((totalImgs - missingAlt) / totalImgs) * 25);
      debugInfo.imagesWithAlt = altScore;
      score += altScore;
    }
  }
  total += 25;

  // 2. Vérification de la structure des titres
  if ((result.headings && result.headings.h1 && result.headings.h1.length === 1) ||
    (result.headingStructure && result.headingStructure.h1 && result.headingStructure.h1.length === 1) ||
    (result.seo && result.seo.headings && result.seo.headings.h1 && result.seo.headings.h1.length === 1)) {
    score += 15;
    debugInfo.headingStructure = 15;
  }
  total += 15;

  // 3. Vérification des attributs ARIA
  if (result.aria && result.aria.count > 0) {
    score += 20;
    debugInfo.ariaAttributes = 20;
  } else if (result.accessibility && result.accessibility.missingAria !== undefined) {
    // Alternative avec la nouvelle structure
    const missingAria = result.accessibility.missingAria;
    if (missingAria === 0) {
      score += 20;
      debugInfo.ariaAttributes = 20;
    } else if (missingAria <= 3) {
      score += 10;
      debugInfo.ariaAttributes = 10;
    }
  }
  total += 20;

  // 4. Vérification des problèmes de contraste
  let contrastWarnings = 0;

  if (result.accessibility && result.accessibility.contrastIssues !== undefined) {
    contrastWarnings = result.accessibility.contrastIssues;
  } else if (result.warnings && Array.isArray(result.warnings)) {
    contrastWarnings = result.warnings.filter(w => {
      if (!w) return false;

      const title = w.title && typeof w.title === 'string' ?
        w.title.toLowerCase() : '';
      const description = w.description && typeof w.description === 'string' ?
        w.description.toLowerCase() : '';

      return title.includes('contrast') || description.includes('contrast');
    }).length;
  }

  if (contrastWarnings === 0) {
    score += 20;
    debugInfo.contrastIssues = 20;
  } else if (contrastWarnings <= 2) {
    score += 10;
    debugInfo.contrastIssues = 10;
  }
  total += 20;

  // 5. Vérification de l'accessibilité des formulaires
  if (result.forms && result.forms.accessible) {
    score += 20;
    debugInfo.formAccessibility = 20;
  } else if (result.accessibility &&
    result.accessibility.missingLabels !== undefined &&
    result.accessibility.missingInputAttributes !== undefined) {
    // Alternative avec la nouvelle structure
    const missingLabels = result.accessibility.missingLabels;
    const missingInputs = result.accessibility.missingInputAttributes;

    if (missingLabels === 0 && missingInputs === 0) {
      score += 20;
      debugInfo.formAccessibility = 20;
    } else if (missingLabels <= 2 && missingInputs <= 2) {
      score += 10;
      debugInfo.formAccessibility = 10;
    }
  }
  total += 20;

  // Calcul du score final
  const finalScore = total > 0 ? Math.round((score / total) * 100) : 0;
  debugInfo.totalScore = finalScore;

  return finalScore;
};

export const calculateSecurityScore = (result) => {
  if (!result) return 0;

  let hasSecurityIssues = false;
  if (result.securityChecks && result.securityChecks.securityIssues) {
    const issues = result.securityChecks.securityIssues;
    if (Array.isArray(issues) && issues.length > 0) {
      hasSecurityIssues = true;
    }
  }

  if (result.securityChecks &&
    result.securityChecks.securityScore !== undefined &&
    !hasSecurityIssues) {
    return Number(result.securityChecks.securityScore) || 0;
  }

  let score = (result.securityChecks && result.securityChecks.securityScore !== undefined)
    ? Number(result.securityChecks.securityScore)
    : 100;

  let total = 100;

  let debugInfo: {
    https?: number;
    securityHeaders?: number;
    warnings?: number;
    noVulnerabilities?: number;
    ssl?: number;
    cookiesScore?: number;
    warningsCount?: number;
    vulnerabilitiesCount?: {
      critical?: number;
      high?: number;
      medium?: number;
      low?: number;
      total?: number;
    };
    baseScore?: number;
  } = {
    vulnerabilitiesCount: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    },
    baseScore: score
  };

  // Traitement des avertissements de sécurité
  let warningsDeduction = 0;
  let warningsCount = 0;

  if (result.securityChecks && result.securityChecks.securityIssues) {
    const securityIssues = result.securityChecks.securityIssues;

    if (Array.isArray(securityIssues) && securityIssues.length > 0) {
      warningsCount = securityIssues.length;

      // S'assurer que vulnerabilitiesCount existe
      if (!debugInfo.vulnerabilitiesCount) {
        debugInfo.vulnerabilitiesCount = {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          total: 0
        };
      }

      let issueDeduction = 0;

      // Compter par sévérité
      for (const issue of securityIssues) {
        const severity = issue.severity ? issue.severity.toLowerCase() : 'medium';
        const description = issue.description || 'Issue de sécurité';

        let deduction = 0;
        if (severity === 'critical') {
          if (debugInfo.vulnerabilitiesCount) debugInfo.vulnerabilitiesCount.critical = (debugInfo.vulnerabilitiesCount.critical || 0) + 1;
          deduction = 10;
        } else if (severity === 'high') {
          if (debugInfo.vulnerabilitiesCount) debugInfo.vulnerabilitiesCount.high = (debugInfo.vulnerabilitiesCount.high || 0) + 1;
          deduction = 7;
        } else if (severity === 'medium') {
          if (debugInfo.vulnerabilitiesCount) debugInfo.vulnerabilitiesCount.medium = (debugInfo.vulnerabilitiesCount.medium || 0) + 1;
          deduction = 4;
        } else {
          if (debugInfo.vulnerabilitiesCount) debugInfo.vulnerabilitiesCount.low = (debugInfo.vulnerabilitiesCount.low || 0) + 1;
          deduction = 2;
        }

        issueDeduction += deduction;
        console.log(`Security issue: ${description} (${severity}) - deduction: ${deduction}`);

        if (debugInfo.vulnerabilitiesCount) debugInfo.vulnerabilitiesCount.total = (debugInfo.vulnerabilitiesCount.total || 0) + 1;
      }

      const criticalPenalty = debugInfo.vulnerabilitiesCount?.critical ? debugInfo.vulnerabilitiesCount.critical * 10 : 0;
      const highPenalty = debugInfo.vulnerabilitiesCount?.high ? debugInfo.vulnerabilitiesCount.high * 7 : 0;
      const mediumPenalty = debugInfo.vulnerabilitiesCount?.medium ? debugInfo.vulnerabilitiesCount.medium * 4 : 0;
      const lowPenalty = debugInfo.vulnerabilitiesCount?.low ? debugInfo.vulnerabilitiesCount.low * 2 : 0;

      warningsDeduction = Math.min(40, criticalPenalty + highPenalty + mediumPenalty + lowPenalty);
      score -= warningsDeduction;

      console.log(`Total security deduction: ${warningsDeduction} points`);
    }
  }

  debugInfo.warnings = -warningsDeduction;
  debugInfo.warningsCount = warningsCount;

  // Calculer le score final, avec un minimum de 0
  const finalScore = Math.max(0, Math.round(score));
  return finalScore;
};

export const calculateEngagementScore = (result) => {
  if (!result) return 0;

  let engagement = result.engagement;

  if (!engagement && (result.ctaCount !== undefined || result.interactiveElements !== undefined)) {
    engagement = result;
  }

  if (!engagement) return 0;

  if (engagement.engagementScore !== undefined && engagement.engagementScore !== null) {
    return engagement.engagementScore;
  }

  let score = 0;

  const interactiveScore = calculateInteractiveScore(engagement);
  score += interactiveScore * 0.3;

  const visualScore = calculateVisualScore(engagement);
  score += visualScore * 0.2;

  const navigationScore = engagement.navigationScore || 0;
  score += navigationScore * 0.2;

  const readabilityScore = engagement.readabilityScore || result.contentStats?.readabilityScore || 0;
  score += readabilityScore * 0.15;

  const socialScore = calculateSocialScore(engagement);
  score += socialScore * 0.15;

  const issues = engagement.issues || [];
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low' || i.severity === 'info').length;

  const penaltyPerHighIssue = 3;
  const penaltyPerMediumIssue = 1;
  const penaltyPerLowIssue = 0.5;

  const totalPenalty = (highIssues * penaltyPerHighIssue) +
    (mediumIssues * penaltyPerMediumIssue) +
    (lowIssues * penaltyPerLowIssue);

  score = Math.max(0, score - totalPenalty);

  if (engagement.engagementTechniques) {
    let techniquesCount = Object.values(engagement.engagementTechniques).filter(v => v === true).length;
    if (techniquesCount >= 3) {
      score = Math.max(score, 25);
    } else if (techniquesCount > 0) {
      score = Math.max(score, 15);
    }
  }

  if (engagement.ctaCount > 5 || engagement.interactiveElements > 5) {
    score = Math.max(score, 35);
  } else if (engagement.ctaCount > 0 || engagement.interactiveElements > 0) {
    score = Math.max(score, 20);
  }

  if (navigationScore === 0 && (engagement.ctaCount > 10 || engagement.interactiveElements > 5)) {
    score = Math.max(score, 40);
  }

  return Math.round(Math.min(100, score));
};

function calculateInteractiveScore(engagement) {
  if (!engagement) return 0;

  const ctaScore = Math.min(100, (engagement.ctaCount || 0) * 25);

  const elementScore = Math.min(100, (engagement.interactiveElements || 0) * 8);

  const techniques = engagement.engagementTechniques || {};
  let techniquesScore = 0;

  if (techniques.hasCtaButtons) techniquesScore += 30;
  if (techniques.hasFormsOrInputs) techniquesScore += 40;
  if (techniques.hasInteractiveElements) techniquesScore += 30;

  return (ctaScore * 0.4) + (elementScore * 0.4) + (techniquesScore * 0.2);
}

function calculateVisualScore(engagement) {
  if (!engagement) return 0;

  const visualCount = engagement.visualElements || 0;
  const visualScore = Math.min(100, visualCount * 20);

  const techniques = engagement.engagementTechniques || {};
  let techniquesScore = 0;

  if (techniques.hasImages) techniquesScore += 50;
  if (techniques.hasVideos) techniquesScore += 50;

  return (visualScore * 0.7) + (techniquesScore * 0.3);
}

function calculateSocialScore(engagement) {
  if (!engagement) return 0;

  const socialCount = engagement.socialElements || 0;
  const socialScore = Math.min(100, socialCount * 30);

  const techniques = engagement.engagementTechniques || {};
  let techniquesScore = 0;

  if (techniques.hasSocialLinks) techniquesScore += 60;
  if (techniques.hasFeedbackMechanisms) techniquesScore += 40;

  return (socialScore * 0.7) + (techniquesScore * 0.3);
}

export const calculateAllMetrics = (result) => {
  const metaTags = calculateMetaTagsScore(result);
  const content = calculateContentScore(result);
  const technicalSeo = calculateTechnicalSeoScore(result);
  const accessibility = calculateAccessibilityScore(result);
  const security = calculateSecurityScore(result);
  const engagement = calculateEngagementScore(result);

  // Pondération des scores
  const weights = {
    metaTags: 0.25,
    content: 0.25,
    technicalSeo: 0.20,
    accessibility: 0.10,
    security: 0.10,
    engagement: 0.10
  };

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  const weightedSum =
    metaTags * weights.metaTags +
    content * weights.content +
    technicalSeo * weights.technicalSeo +
    accessibility * weights.accessibility +
    security * weights.security +
    engagement * weights.engagement;

  const seoScore = Math.round(weightedSum / totalWeight);

  return {
    metaTags,
    content,
    technicalSeo,
    accessibility,
    security,
    engagement,
    seoScore: seoScore || result?.score || 0
  };
};

export const getMetricColor = (value) => {
  const numValue = Number(value) || 0;

  if (numValue < 50) return 'error';
  if (numValue < 75) return 'warning';
  return 'success';
};

export default {
  calculateMetaTagsScore,
  calculateContentScore,
  calculateTechnicalSeoScore,
  calculateAccessibilityScore,
  calculateSecurityScore,
  calculateEngagementScore,
  calculateAllMetrics,
  getMetricColor
} 