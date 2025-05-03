export default {
  meta: {
    title: 'Analyse Sémantique - StackUnity',
    description: 'Analysez la structure sémantique de votre site web, évaluez le HTML, ARIA et les balises meta'
  },
  page: {
    title: 'Analyse Sémantique',
    subtitle: 'Analysez la structure sémantique de votre site web'
  },
  form: {
    urlLabel: 'URL du site à analyser',
    urlPlaceholder: 'https://exemple.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRule: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    analyzeButton: 'Analyser le contenu'
  },
  loading: {
    text: 'Chargement des résultats d\'analyse'
  },
  results: {
    title: 'Résultats d\'Analyse',
    averageScore: 'Score Moyen',
    scoreLabel: 'Score : {score}%',
    html: {
      title: 'Structure HTML',
      score: 'Score structure HTML : {score}%',
      elements: 'Éléments de structure HTML'
    },
    aria: {
      title: 'Accessibilité ARIA',
      score: 'Score ARIA : {score}%',
      missingAttributes: 'Attributs ARIA manquants',
      missingLabels: 'Étiquettes manquantes',
      formElementsWithLabels: 'Éléments de formulaire avec étiquettes',
      missingAriaCount: 'Nombre d\'attributs ARIA manquants',
      invalidAriaCount: 'Attributs ARIA invalides',
      interactiveElementsWithAria: 'Éléments interactifs avec ARIA',
      totalInteractiveElements: 'Total des éléments interactifs',
      elementsToCompleteWithAria: 'Éléments à compléter avec ARIA'
    },
    meta: {
      title: 'Balises Meta',
      score: 'Score balises meta : {score}%',
      requiredTags: 'Balises meta requises',
      presentCount: 'Présentes : {count}',
      missingCount: 'Manquantes : {count}',
      availableTags: 'Balises meta disponibles',
      detailedScore: 'Score détaillé des balises meta',
      essentialTags: 'Balises meta essentielles',
      socialTags: 'Balises meta sociales',
      technicalTags: 'Balises meta techniques',
      contentTags: 'Balises meta de contenu',
      socialSharingTags: 'Balises meta de partage social',
      htmlCodeOfMetaTags: 'Code HTML des balises meta',
      detectedIssues: 'Problèmes détectés'
    },
    readability: {
      title: 'Analyse de Lisibilité',
      score: 'Score :',
      grade: 'Niveau :',
      words: 'Mots :',
      sentences: 'Phrases :'
    },
    headings: {
      title: 'Structure des Titres',
      structure: 'Structure des titres de la page'
    },
    headingStructure: {
      title: 'Structure des Titres'
    }
  },
  tabs: {
    htmlStructure: 'Structure HTML',
    accessibilityAria: 'Accessibilité ARIA',
    metaTags: 'Balises Meta'
  },
  categories: {
    html: 'HTML',
    aria: 'ARIA',
    meta: 'META'
  },
  elementTitles: {
    doctype: 'DOCTYPE',
    html: 'Balise HTML',
    head: 'Balise HEAD',
    title: 'Balise TITLE',
    body: 'Balise BODY',
    header: 'Balise HEADER',
    main: 'Balise MAIN',
    footer: 'Balise FOOTER',
    navigation: 'Navigation',
    headings: 'Titres',
    semanticElements: 'Éléments sémantiques',
    lists: 'Listes',
    images: 'Images',
    links: 'Liens',
    tables: 'Tableaux',
    forms: 'Formulaires'
  },
  suggestions: {
    title: 'Suggestions d\'Amélioration',
    htmlSuggestions: 'Suggestions pour la Structure HTML',
    ariaSuggestions: 'Suggestions pour ARIA',
    metaSuggestions: 'Suggestions pour les Balises Meta',
    noSuggestions: 'Aucune suggestion disponible. Votre site est bien structuré !'
  },
  export: {
    title: 'Exporter les Résultats',
    pdf: 'Exporter en PDF',
    csv: 'Exporter en CSV',
    json: 'Exporter en JSON'
  },
  error: {
    title: 'Erreur',
    message: 'Échec de l\'analyse de l\'URL. Veuillez vérifier l\'URL et réessayer.',
    retry: 'Réessayer'
  }
} 