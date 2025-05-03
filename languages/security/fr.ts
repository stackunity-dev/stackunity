export default {
  meta: {
    title: 'Analyse de Sécurité',
    description: 'Analysez les vulnérabilités de sécurité de votre site web'
  },
  form: {
    urlLabel: 'URL à analyser',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRuleInvalid: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    analyzeButton: 'Analyser le contenu',
    analyzeAriaLabel: 'Analyser le contenu'
  },
  loading: {
    ariaLabel: 'Chargement des résultats d\'analyse'
  },
  results: {
    title: 'Résultats d\'Analyse',
    globalScore: 'Score Global',
    headers: 'En-têtes',
    cookies: 'Cookies',
    vulnerabilities: 'Vulnérabilités'
  },
  scoreLabel: 'Score : {value}%',
  headers: {
    tab: 'En-têtes',
    securityHeaders: 'En-têtes de Sécurité',
    scoreLabel: 'Score : {value}%',
    missingHeaders: 'En-têtes Manquants',
    allPresent: 'Tous les en-têtes de sécurité sont présents'
  },
  cookies: {
    tab: 'Cookies',
    securityTitle: 'Sécurité des Cookies',
    scoreLabel: 'Score : {value}%',
    secureAttribute: 'Attribut Secure',
    httpOnlyAttribute: 'Attribut HttpOnly',
    sameSiteAttribute: 'Attribut SameSite',
    present: 'Présent',
    missing: 'Manquant',
    https: 'HTTPS',
    httpsEnabled: 'HTTPS Activé'
  },
  vulnerabilities: {
    tab: 'Vulnérabilités',
    title: 'Vulnérabilités Détectées',
    scoreLabel: 'Score : {value}%',
    level: 'Niveau',
    levels: {
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      info: 'Info'
    },
    noVulnerabilities: 'Aucune vulnérabilité détectée',
    details: {
      title: 'Détails',
      description: 'Description',
      impact: 'Impact',
      remediation: 'Correction',
      element: 'Élément',
      problemCode: 'Code du Problème',
      issue: 'Problème',
      content: 'Contenu',
      recommendation: 'Recommandation',
      evidence: 'Preuve',
      detectedVulnerabilities: 'Vulnérabilités Détectées'
    },
    summary: 'Résumé des Vulnérabilités',
    sensitiveData: 'Données Sensibles',
    issuesDetected: 'Problèmes Détectés',
    csrf: 'CSRF',
    headerIssues: 'Problèmes d\'En-têtes',
    otherIssues: 'Autres Problèmes'
  },
  recommendations: {
    title: 'Recommandations de Sécurité',
    implementHeaders: 'Implémenter les En-têtes Manquants',
    secureCookies: 'Sécuriser les Cookies',
    fixVulnerabilities: 'Corriger les Vulnérabilités',
    enableHttps: 'Activer HTTPS'
  }
} 