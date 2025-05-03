export default {
  meta: {
    title: 'Analyse de Performance Web - StackUnity',
    description: 'Analysez la vitesse de chargement et les métriques de performance de votre site web'
  },
  page: {
    title: 'Analyse de Performance Web',
    subtitle: 'Analysez la vitesse de chargement et les métriques de performance de votre site web'
  },
  form: {
    urlLabel: 'URL à analyser',
    urlPlaceholder: 'https://exemple.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRule: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    analyzeButton: 'Analyser la performance'
  },
  loading: {
    text: 'Chargement des résultats d\'analyse'
  },
  results: {
    title: 'Résultats d\'Analyse de Performance',
    averageScore: 'Score Moyen de Performance',
    scoreLabel: 'Score : {score}%',
    metrics: {
      title: 'Métriques Principales',
      loadingMetrics: 'Métriques de Chargement',
      scoreBreakdown: 'Détail du Score de Performance',
      firstContentfulPaint: {
        title: 'Premier Affichage du Contenu',
        short: 'FCP',
        description: 'Temps jusqu\'à ce que le navigateur rende le premier élément de contenu'
      },
      largestContentfulPaint: {
        title: 'Plus Grand Affichage du Contenu',
        short: 'LCP',
        description: 'Temps jusqu\'à ce que le plus grand élément de contenu soit rendu'
      },
      speedIndex: {
        title: 'Indice de Vitesse',
        short: 'SI',
        description: 'À quelle vitesse le contenu est visuellement affiché pendant le chargement'
      },
      totalBlockingTime: {
        title: 'Temps de Blocage Total',
        short: 'TBT',
        description: 'Somme du temps où le thread principal était bloqué'
      },
      cumulativeLayoutShift: {
        title: 'Changement Cumulatif de Disposition',
        short: 'CLS',
        description: 'Mesure de la stabilité visuelle pendant le chargement'
      },
      timeToInteractive: {
        title: 'Temps jusqu\'à l\'Interactivité',
        short: 'TTI',
        description: 'Temps jusqu\'à ce que la page devienne entièrement interactive'
      }
    },
    resources: {
      title: 'Ressources',
      networkRequests: 'Requêtes Réseau',
      resourceSizes: 'Tailles des Ressources',
      resourceTypes: 'Types de Ressources',
      requestCount: 'Nombre de requêtes :',
      totalSize: 'Taille totale :',
      transferSize: 'Taille de transfert :',
      contentType: 'Type de contenu',
      size: 'Taille',
      transferTime: 'Temps de transfert'
    },
    optimization: {
      title: 'Optimisation',
      opportunities: 'Opportunités d\'Optimisation',
      diagnostics: 'Diagnostics de Performance',
      passed: 'Audits Réussis',
      wastefulResizing: 'Images avec un encodage ou un dimensionnement inefficace',
      uncompressedImages: 'Encodez efficacement les images',
      unusedJavascript: 'Supprimez le JavaScript non utilisé',
      unusedCss: 'Supprimez le CSS non utilisé',
      preconnectOrigins: 'Préconnexion aux origines requises',
      thirdParty: 'Réduisez l\'impact du code tiers',
      fontDisplay: 'Assurez-vous que le texte reste visible pendant le chargement des polices web',
      potential: 'Économies potentielles :'
    },
    scoreIntervals: {
      excellent: 'Excellent',
      needsImprovement: 'À améliorer',
      poor: 'Médiocre',
      excellentRange: '90-100 : Excellent',
      improvementRange: '50-89 : À améliorer',
      poorRange: '0-49 : Médiocre'
    }
  },
  tabs: {
    metrics: 'Métriques Principales',
    resources: 'Ressources',
    optimization: 'Optimisation'
  },
  summary: {
    title: 'Résumé de Performance',
    baselineMetrics: 'Métriques de Référence',
    optimizationScore: 'Score d\'optimisation :',
    resourceEfficiency: 'Efficacité des ressources :',
    loadingSpeed: 'Vitesse de chargement :',
    userExperience: 'Expérience utilisateur :'
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