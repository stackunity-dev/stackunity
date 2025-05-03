export default {
  meta: {
    title: 'Analyse d\'Engagement Utilisateur',
    description: 'Analysez l\'engagement potentiel des utilisateurs sur votre site web'
  },
  form: {
    urlLabel: 'URL à analyser',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRuleInvalid: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    analyzeButton: 'Analyser le contenu',
    analyzeAriaLabel: 'Analyser le contenu'
  },
  results: {
    title: 'Résultats d\'analyse',
    averageScore: 'Score d\'engagement moyen',
    avgCtaCount: 'Nombre moyen de CTA',
    avgInteractiveElements: 'Éléments interactifs moyens',
    avgSocialElements: 'Éléments sociaux moyens'
  },
  tabs: {
    engagement: 'Éléments d\'engagement',
    issues: 'Problèmes détectés',
    techniques: 'Techniques d\'engagement',
    details: 'Éléments détaillés'
  },
  engagement: {
    statistics: 'Statistiques d\'engagement',
    ctaElements: 'Appels à l\'action (CTA)',
    interactiveElements: 'Éléments interactifs',
    visualElements: 'Éléments visuels',
    socialElements: 'Éléments sociaux',
    detailedScores: 'Scores détaillés',
    navigation: 'Navigation',
    readability: 'Lisibilité',
    globalScore: 'Score global'
  },
  issues: {
    title: 'Problèmes détectés',
    noIssues: 'Aucun problème détecté',
    description: 'Description:',
    recommendation: 'Recommandation:'
  },
  techniques: {
    title: 'Techniques d\'engagement',
    socialLinks: 'Liens sociaux',
    ctaButtons: 'Boutons CTA',
    formsInputs: 'Formulaires ou champs de saisie',
    videos: 'Vidéos',
    images: 'Images',
    interactiveElements: 'Éléments interactifs',
    feedbackMechanisms: 'Mécanismes de feedback'
  },
  detailedElements: {
    ctaTitle: 'Éléments CTA',
    ctaText: 'Texte',
    ctaType: 'Type',
    ctaLocation: 'Emplacement',
    noCta: 'Aucun élément CTA trouvé',
    socialTitle: 'Éléments de Médias Sociaux',
    socialPlatform: 'Plateforme',
    socialType: 'Type',
    socialLocation: 'Emplacement',
    noSocial: 'Aucun élément de média social trouvé',
    interactiveTitle: 'Éléments Interactifs',
    interactiveDescription: 'Description',
    interactiveType: 'Type',
    interactiveLocation: 'Emplacement',
    noInteractive: 'Aucun détail d\'élément interactif trouvé'
  }
} 