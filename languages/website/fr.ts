export default {
  meta: {
    title: 'Analyse de Site Web',
    description: 'Analysez les performances, la sécurité et le SEO de votre site web'
  },
  alerts: {
    noWebsiteData: 'Aucune donnée de site web disponible pour ce compte. Veuillez ajouter un site web à votre compte ci-dessous.',
    addWebsite: 'Ajouter un site web'
  },
  loading: {
    progress: '{value}%'
  },
  cards: {
    websiteData: {
      title: 'Données du site web',
      mainUrl: 'URL principale',
      urlsDetected: '{count} URL{plural} détectée{plural}',
      socialMedia: 'Aperçu des réseaux sociaux',
      socialUnavailable: 'Métadonnées des réseaux sociaux non disponibles',
      generatedSitemap: 'Sitemap généré',
      copySitemap: 'Copier la sitemap',
      showLess: 'Afficher moins',
      showMore: 'Afficher {count} plus'
    },
    analysis: {
      title: 'Analyse du site web',
      description: 'Exécutez une analyse complète de votre site web pour obtenir des informations sur les performances, la sécurité et plus encore.',
      startAnalysis: 'Démarrer l\'analyse'
    },
    metrics: {
      title: 'Métriques SSUC',
      averageOf: 'Moyenne de {count} URLs',
      performance: 'Performance',
      seo: 'SEO',
      security: 'Sécurité',
      usability: 'Utilisabilité',
      tooltips: {
        fcp: 'First Contentful Paint',
        lcp: 'Largest Contentful Paint',
        cls: 'Cumulative Layout Shift'
      }
    },
    technical: {
      title: 'Analyse technique',
      robotsTxt: 'Robots.txt',
      sitemap: 'Sitemap',
      ssl: 'Certificat SSL',
      responsiveness: 'Responsive Design',
      headers: 'En-têtes HTTP',
      mobileFriendly: 'Adaptation mobile',
      found: 'Trouvé',
      notFound: 'Non trouvé',
      valid: 'Valide',
      invalid: 'Non valide',
      enabled: 'Activé',
      disabled: 'Désactivé',
      secure: 'Sécurisé',
      notSecure: 'Non sécurisé'
    }
  },
  issues: {
    title: 'Problèmes détectés',
    severity: {
      critical: 'Critique',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      info: 'Info'
    },
    noIssues: 'Aucun problème détecté',
    viewAll: 'Voir tous les problèmes',
    fix: 'Corriger',
    ignore: 'Ignorer'
  },
  pageDetails: {
    title: 'Détails de la page',
    mainUrl: 'URL principale',
    lastAnalyzed: 'Dernière analyse: {date}',
    metaTags: 'Balises Meta',
    headings: 'Structure des titres',
    images: 'Images',
    links: 'Liens',
    scripts: 'Scripts',
    stylesheets: 'Feuilles de style',
    noItems: 'Aucun élément trouvé'
  },
  insights: {
    title: 'Statistiques du site',
    pageCount: 'Pages analysées',
    totalIssues: 'Problèmes totaux',
    avgPageSize: 'Taille moyenne de page',
    avgLoadTime: 'Temps de chargement moyen'
  },
  buttons: {
    reanalyze: 'Réanalyser',
    export: 'Exporter le rapport',
    settings: 'Paramètres',
    viewDetails: 'Voir les détails',
    found: 'Trouvé',
    notFound: 'Non trouvé',
    viewContent: 'Voir le contenu',
    issues: 'Problèmes'
  }
} 