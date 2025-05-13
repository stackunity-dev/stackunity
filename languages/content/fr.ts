export default {
  meta: {
    title: 'Analyse du contenu - StackUnity',
    description: 'Analyse la structure et la qualité de vos pages web pour améliorer votre SEO'
  },
  page: {
    title: 'Analyse du contenu',
    subtitle: 'Analyse la structure et la qualité de vos pages web pour améliorer votre SEO'
  },
  form: {
    urlLabel: 'URL du site à analyser',
    urlPlaceholder: 'https://example.com',
    urlHint: 'Entrez l\'URL complète incluant https://',
    urlRule: 'Veuillez entrer une URL valide commençant par http:// ou https://',
    crawlEnabled: 'Analyser également les pages liées',
    crawlHint: 'Limite: 10 URL maximum',
    analyzeButton: 'Analyse du contenu'
  },
  loading: {
    text: 'Analyse en cours'
  },
  averageScore: {
    title: 'Note moyenne du contenu',
    calculated: 'Note moyenne calculée à partir de {count} pages analysées',
    exportButton: 'Exporter'
  },
  contentScore: {
    title: 'Note du contenu',
    excellent: 'Excellent',
    good: 'Bon',
    average: 'Moyen',
    poor: 'Faible',
    critical: 'Critique'
  },
  improvement: {
    title: 'Priorité de l\'amélioration',
    lowestScore: 'La page avec la note la plus basse ({score}%) est',
    openInNew: 'Ouvrir dans un nouvel onglet'
  },
  trends: {
    improving: 'Améliorant',
    declining: 'Déclinant',
    stable: 'Stable',
    tooltipImproving: 'La qualité du contenu est en amélioration sur toutes les pages',
    tooltipDeclining: 'La qualité du contenu est en déclin sur toutes les pages',
    tooltipStable: 'La qualité du contenu est stable sur toutes les pages'
  },
  statistics: {
    title: 'Statistiques du contenu',
    wordCount: 'Nombre de mots',
    readabilityScore: 'Note de lisibilité',
    headingsDetected: 'En-têtes détectés',
    links: 'Liens',
    internal: 'Interne',
    external: 'Externe'
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
    title: 'Structure d\'en-têtes',
    noHeadings: 'Aucun en-tête (H1-H6) détecté sur cette page.'
  },
  issues: {
    title: 'Problèmes détectés',
    noIssues: 'Aucun problème majeur détecté dans le contenu.',
    missingH1: 'En-tête H1 manquant',
    multipleH1: 'Plusieurs en-têtes H1',
    shortContent: 'Le contenu est trop court',
    poorReadability: 'Note de lisibilité faible',
    lowKeywordDensity: 'Densité de mots clés faible',
    missingAltText: 'Images sans texte alternatif',
    brokenHeadingStructure: 'Structure d\'en-têtes brisée',
    lowWordCount: 'Nombre de mots faible',
    duplicateTitle: 'Titre dupliqué et H1',
    noExternalLinks: 'Aucun lien externe',
    tooManyLinks: 'Trop de liens',
    lowTextToHtmlRatio: 'Ratio texte/HTML faible'
  },
  images: {
    title: 'Analyse des images',
    preview: 'Aperçu de l\'image',
    altText: 'Texte alternatif',
    missingAlt: 'Texte alternatif manquant',
    hasAlt: 'Texte alternatif présent',
    dimensions: 'Dimensions',
    hasDimensions: 'Optimisé',
    noDimensions: 'Aucune dimension'
  },
  keywords: {
    title: 'Analyse des mots clés',
    topKeywords: 'Mots clés principaux',
    density: 'Densité',
    optimal: 'Optimal',
    tooLow: 'Trop faible',
    tooHigh: 'Trop élevé',
    noKeywords: 'Aucun mot clé significatif détecté'
  },
  seo: {
    title: 'Éléments SEO',
    metaTitle: 'Meta Title',
    metaDescription: 'Meta Description',
    canonical: 'Canonical URL',
    og: 'Open Graph Tags',
    missingElement: 'Manquant',
    tooShort: 'Trop court',
    tooLong: 'Trop long',
    good: 'Bon'
  },
  recommendations: {
    title: 'Recommendations',
    excellentQuality: {
      title: 'Excellente qualité de contenu',
      description: 'Votre contenu est bien structuré et optimisé pour le SEO. Continuez à travailler!'
    },
    improveContent: {
      title: 'How to improve your content',
      addMoreContent: {
        title: 'Ajouter plus de contenu',
        description: 'Votre contenu a {count} mots. Considérez l\'augmenter à au moins 800-1000 mots pour une meilleure performance SEO.'
      },
      addH1: {
        title: 'Ajouter un en-tête H1',
        description: 'Chaque page doit avoir exactement un en-tête H1 qui décrit le contenu de la page.'
      },
      multipleH1: {
        title: 'Utiliser un seul en-tête H1',
        description: 'Votre page a {count} en-têtes H1. Pour une meilleure SEO, utilisez exactement un en-tête H1 et structurez les autres en-têtes avec H2-H6.'
      },
      addH2: {
        title: 'Ajouter des en-têtes H2',
        description: 'Utilisez des en-têtes H2 pour diviser votre contenu en sections logiques pour une meilleure lisibilité et SEO.'
      },
      addAltText: {
        title: 'Ajouter un texte alternatif aux images',
        description: '{count} images sans texte alternatif. Ajoutez un texte alternatif descriptif à toutes les images pour une meilleure accessibilité et SEO.'
      },
      improveReadability: {
        title: 'Améliorer la lisibilité',
        description: 'Votre contenu a une note de lisibilité de {score}. Essayez d\'utiliser des phrases plus courtes et un langage plus simple.'
      },
      addInternalLinks: {
        title: 'Ajouter des liens internes',
        description: 'Ajoutez des liens vers d\'autres pages pertinentes sur votre site pour améliorer la navigation et le SEO.'
      },
      addExternalLinks: {
        title: 'Ajouter des liens externes',
        description: 'Créez des liens vers des sources de confiance externes pour augmenter la crédibilité et la valeur SEO.'
      },
      generalImprovements: {
        title: 'Améliorations générales',
        description: '- Utilisez un langage plus varié et plus engageant\n- Ajoutez des éléments multimédia (images, vidéos, infographies)\n- Incluez des exemples spécifiques et des données pour soutenir vos points\n- Structurez le contenu avec des introductions claires et des conclusions'
      }
    },
    seoTips: {
      title: 'SEO tips',
      useKeywords: {
        title: 'Utiliser des mots clés ciblés',
        description: 'Utilisez des mots clés ciblés dans le titre, la description meta et le contenu.'
      },
      addAltText: {
        title: 'Ajouter un texte alternatif aux images',
        description: '{count} images sans texte alternatif. Ajoutez un texte alternatif descriptif à toutes les images pour une meilleure accessibilité et SEO.'
      },
      addH2: {
        title: 'Ajouter des en-têtes H2',
        description: 'Utilisez des en-têtes H2 pour diviser votre contenu en sections logiques pour une meilleure lisibilité et SEO.'
      },
      addH1: {
        title: 'Ajouter un en-tête H1',
        description: 'Chaque page doit avoir exactement un en-tête H1 qui décrit le contenu de la page.'
      },
      addMoreContent: {
        title: 'Ajouter plus de contenu',
        description: 'Votre contenu a {count} mots. Considérez l\'augmenter à au moins 800-1000 mots pour une meilleure performance SEO.'
      },
      addExternalLinks: {
        title: 'Ajouter des liens externes',
        description: 'Créez des liens vers des sources de confiance externes pour augmenter la crédibilité et la valeur SEO.'
      },
      addInternalLinks: {
        title: 'Ajouter des liens internes',
        description: 'Ajoutez des liens vers d\'autres pages pertinentes sur votre site pour améliorer la navigation et le SEO.'
      },
      generalImprovements: {
        title: 'Améliorations générales',
        description: '- Utilisez un langage plus varié et plus engageant\n- Ajoutez des éléments multimédia (images, vidéos, infographies)\n- Incluez des exemples spécifiques et des données pour soutenir vos points\n- Structurez le contenu avec des introductions claires et des conclusions'
      },
      optimizeMeta: {
        title: 'Optimiser la description meta',
        description: 'Créez une description meta (150-160 caractères) qui inclut vos mots clés ciblés.'
      },
      improveSpeed: {
        title: 'Améliorer la vitesse de la page',
        description: 'Optimisez les images, réduisez les scripts et utilisez le cache du navigateur pour améliorer les temps de chargement.'
      },
      mobileOptimization: {
        title: 'Optimisation mobile',
        description: 'Assurez-vous que votre page est entièrement responsive et offre une bonne expérience utilisateur sur les appareils mobiles.'
      },
      useSchema: {
        title: 'Utiliser le schéma',
        description: 'Utilisez le schéma schema.org pour décrire votre contenu pour aider les moteurs de recherche à le comprendre et à augmenter les taux de clic dans les résultats de recherche.'
      }
    }
  },
  error: {
    title: 'Erreur',
    message: 'Échec de l\'analyse de l\'URL. Veuillez vérifier l\'URL et réessayer.',
    retry: 'Réessayer'
  }
} 