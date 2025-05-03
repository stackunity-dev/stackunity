export default {
  meta: {
    title: 'Analyse de Contenu - StackUnity',
    description: 'Analysez la structure et la qualité de vos pages web pour améliorer votre référencement'
  },
  page: {
    title: 'Analyse de Contenu',
    subtitle: 'Analysez la structure et la qualité de vos pages web pour améliorer votre référencement'
  },
  form: {
    urlLabel: 'URL du site à analyser',
    urlPlaceholder: 'https://exemple.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRule: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    crawlEnabled: 'Analyser également les pages liées',
    crawlHint: 'Limite : 10 URLs maximum',
    analyzeButton: 'Analyser le contenu'
  },
  loading: {
    text: 'Analyse en cours'
  },
  averageScore: {
    title: 'Score moyen du contenu',
    calculated: 'Score moyen calculé à partir de {count} pages analysées',
    exportButton: 'Exporter'
  },
  contentScore: {
    title: 'Score du contenu',
    excellent: 'Excellent',
    good: 'Bon',
    average: 'Moyen',
    poor: 'Faible',
    critical: 'Critique'
  },
  improvement: {
    title: 'Priorité d\'amélioration',
    lowestScore: 'La page avec le score le plus bas ({score}%) est',
    openInNew: 'Ouvrir dans un nouvel onglet'
  },
  trends: {
    improving: 'En amélioration',
    declining: 'En déclin',
    stable: 'Stable',
    tooltipImproving: 'La qualité du contenu s\'améliore sur l\'ensemble des pages',
    tooltipDeclining: 'La qualité du contenu se dégrade sur l\'ensemble des pages',
    tooltipStable: 'La qualité du contenu est constante sur l\'ensemble des pages'
  },
  statistics: {
    title: 'Statistiques du contenu',
    wordCount: 'Nombre de mots',
    readabilityScore: 'Score de lisibilité',
    headingsDetected: 'Titres détectés',
    links: 'Liens',
    internal: 'Internes',
    external: 'Externes'
  },
  readability: {
    veryEasy: 'Très facile',
    easy: 'Facile',
    fairlyEasy: 'Assez facile',
    standard: 'Standard',
    fairlyDifficult: 'Assez difficile',
    difficult: 'Difficile',
    veryDifficult: 'Très difficile'
  },
  wordCount: {
    tooShort: 'Trop court',
    short: 'Court',
    good: 'Bon',
    excellent: 'Excellent'
  },
  headings: {
    title: 'Structure des titres',
    noHeadings: 'Aucun titre (H1-H6) détecté sur cette page.'
  },
  issues: {
    title: 'Problèmes détectés',
    noIssues: 'Aucun problème majeur détecté dans le contenu.',
    missingH1: 'Titre H1 manquant',
    multipleH1: 'Plusieurs titres H1',
    shortContent: 'Contenu trop court',
    poorReadability: 'Score de lisibilité faible',
    lowKeywordDensity: 'Faible densité de mots-clés',
    missingAltText: 'Images sans texte alternatif',
    brokenHeadingStructure: 'Structure de titres incohérente',
    lowWordCount: 'Nombre de mots insuffisant',
    duplicateTitle: 'Titre et H1 identiques',
    noExternalLinks: 'Aucun lien externe',
    tooManyLinks: 'Trop de liens',
    lowTextToHtmlRatio: 'Ratio texte/HTML faible'
  },
  images: {
    title: 'Analyse des Images',
    preview: 'Aperçu de l\'image',
    altText: 'Texte alternatif',
    missingAlt: 'Texte alternatif manquant',
    hasAlt: 'Texte alternatif présent',
    dimensions: 'Dimensions',
    hasDimensions: 'Optimisée',
    noDimensions: 'Sans dimensions'
  },
  keywords: {
    title: 'Analyse des mots-clés',
    topKeywords: 'Principaux mots-clés',
    density: 'Densité',
    optimal: 'Optimale',
    tooLow: 'Trop faible',
    tooHigh: 'Trop élevée',
    noKeywords: 'Aucun mot-clé significatif détecté'
  },
  seo: {
    title: 'Éléments SEO',
    metaTitle: 'Balise Title',
    metaDescription: 'Meta Description',
    canonical: 'URL Canonique',
    og: 'Balises Open Graph',
    missingElement: 'Manquant',
    tooShort: 'Trop court',
    tooLong: 'Trop long',
    good: 'Bon'
  },
  recommendations: {
    title: 'Recommandations',
    excellentQuality: {
      title: 'Excellente qualité de contenu',
      description: 'Votre contenu est bien structuré et optimisé pour le SEO. Continuez votre excellent travail !'
    },
    improveContent: {
      title: 'Comment améliorer votre contenu',
      addMoreContent: {
        title: 'Ajouter plus de contenu',
        description: 'Votre contenu contient {count} mots. Envisagez d\'étendre à au moins 800-1000 mots pour de meilleures performances SEO.'
      },
      addH1: {
        title: 'Ajouter un titre H1',
        description: 'Chaque page doit avoir exactement un titre H1 qui décrit clairement le contenu de la page.'
      },
      multipleH1: {
        title: 'Utiliser un seul titre H1',
        description: 'Votre page a {count} titres H1. Pour un meilleur SEO, utilisez exactement un H1 et structurez les autres titres avec H2-H6.'
      },
      addH2: {
        title: 'Ajouter des sous-titres H2',
        description: 'Utilisez des sous-titres H2 pour diviser votre contenu en sections logiques pour une meilleure lisibilité et SEO.'
      },
      addAltText: {
        title: 'Ajouter un texte alternatif aux images',
        description: '{count} image(s) sans texte alternatif. Ajoutez un texte descriptif à toutes les images pour une meilleure accessibilité et SEO.'
      },
      improveReadability: {
        title: 'Améliorer la lisibilité',
        description: 'Votre contenu a un score de lisibilité de {score}. Essayez d\'utiliser des phrases plus courtes et un langage plus simple.'
      },
      addInternalLinks: {
        title: 'Ajouter des liens internes',
        description: 'Ajoutez des liens vers d\'autres pages pertinentes de votre site pour améliorer la navigation et le SEO.'
      },
      addExternalLinks: {
        title: 'Ajouter des liens externes',
        description: 'Créez des liens vers des sources externes faisant autorité pour augmenter la crédibilité et la valeur SEO.'
      },
      generalImprovements: {
        title: 'Améliorations générales',
        description: '- Utilisez un langage plus varié et engageant\n- Ajoutez des éléments multimédias (images, vidéos, infographies)\n- Incluez des exemples spécifiques et des données pour étayer vos points\n- Structurez le contenu avec une introduction et une conclusion claires'
      }
    },
    seoTips: {
      title: 'Conseils d\'optimisation SEO',
      useKeywords: {
        title: 'Utiliser les mots-clés cibles',
        description: 'Incluez votre mot-clé principal dans le titre, le titre H1, le premier paragraphe et naturellement dans tout le contenu.'
      },
      optimizeMeta: {
        title: 'Optimiser la meta description',
        description: 'Créez une meta description convaincante (150-160 caractères) qui inclut votre mot-clé cible.'
      },
      improveSpeed: {
        title: 'Améliorer la vitesse de la page',
        description: 'Optimisez les images, réduisez les scripts et utilisez la mise en cache du navigateur pour améliorer les temps de chargement.'
      },
      mobileOptimization: {
        title: 'Optimisation mobile',
        description: 'Assurez-vous que votre page est entièrement responsive et offre une bonne expérience utilisateur sur les appareils mobiles.'
      },
      useSchema: {
        title: 'Utiliser le balisage schema',
        description: 'Implémentez le balisage schema.org approprié pour aider les moteurs de recherche à mieux comprendre votre contenu.'
      }
    }
  },
  error: {
    title: 'Erreur',
    message: 'Échec de l\'analyse de l\'URL. Veuillez vérifier l\'URL et réessayer.',
    retry: 'Réessayer'
  }
} 