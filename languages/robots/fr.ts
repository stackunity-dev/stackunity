export default {
  meta: {
    title: 'Générateur de Robots.txt & Schema.org',
    description: 'Générez des fichiers robots.txt et des données structurées Schema.org pour votre site web'
  },
  privacyNotice: {
    title: 'Avis de confidentialité',
    content: 'Aucune donnée n\'est collectée ou stockée sur nos serveurs pendant le processus de génération. Tout le contenu est traité localement dans votre navigateur.'
  },
  errorInfo: {
    title: 'Information :',
    stillGenerate: 'L\'audit SEO a échoué, mais vous pouvez toujours générer du contenu avec les données actuelles.',
    solutions: 'Solutions possibles pour l\'audit :',
    chromeServer: 'Vérifiez que Google Chrome est installé sur le serveur',
    chromeAccess: 'L\'utilisateur du serveur doit avoir accès au fichier chrome.exe'
  },
  configuration: {
    title: 'Configuration',
    websiteInfo: 'Informations sur le site web',
    domain: 'Domaine du site',
    domainHint: 'Entrez le domaine de votre site sans protocole (http/https)',
    protocol: 'Protocole',
    skipAnalysis: 'Générer sans analyse du site (utiliser uniquement les données saisies)',
    skipAnalysisHint: 'Activez cette option si l\'analyse du site échoue'
  },
  tabs: {
    robots: 'Robots.txt',
    schema: 'Schema.org'
  },
  robotsConfig: {
    pathManagement: 'Gestion des chemins',
    templates: 'Modèles prédéfinis',
    disallowedPaths: 'Chemins interdits',
    allowedPaths: 'Chemins autorisés',
    pathToDisallow: 'Chemin à interdire',
    pathToAllow: 'Chemin à autoriser'
  },
  schemaConfig: {
    templates: 'Modèles Schema.org'
  },
  robotsSettings: {
    title: 'Paramètres Robots.txt',
    userAgent: 'Agent utilisateur',
    customUserAgent: 'Agent utilisateur personnalisé',
    crawlDelay: 'Délai d\'exploration (secondes)',
    noDelay: 'Laissez vide pour aucun délai',
    disallowedPaths: 'Chemins interdits',
    allowedPaths: 'Chemins autorisés',
    add: 'Ajouter',
    sitemapUrl: 'URL du Sitemap'
  },
  schemaSettings: {
    title: 'Paramètres Schema.org',
    schemaType: 'Type de Schema',
    name: 'Nom',
    description: 'Description',
    url: 'URL',
    commonProperties: 'Propriétés communes',
    imageUrl: 'URL de l\'image',
    telephone: 'Téléphone',
    email: 'Email',
    address: 'Adresse',
    logoUrl: 'URL du logo',
    properties: 'Propriétés'
  },
  templateTitles: {
    wordpress: 'WordPress',
    ecommerce: 'E-commerce',
    blog: 'Blog',
    article: 'Article',
    product: 'Produit',
    organization: 'Organisation',
    localBusiness: 'Entreprise locale'
  },
  templateDescriptions: {
    wordpress: 'Configuration optimale pour les sites WordPress',
    ecommerce: 'Configuration optimale pour les sites e-commerce',
    blog: 'Configuration optimale pour les blogs',
    article: 'Structure pour les articles de blog',
    product: 'Structure pour les produits e-commerce',
    organization: 'Structure pour les organisations',
    localBusiness: 'Structure pour les entreprises locales'
  },
  templateTypes: {
    wordpress: {
      name: 'WordPress',
      description: 'Configuration optimale pour les sites WordPress'
    },
    ecommerce: {
      name: 'E-commerce',
      description: 'Configuration optimale pour les sites e-commerce'
    },
    blog: {
      name: 'Blog',
      description: 'Configuration optimale pour les blogs'
    },
    article: {
      name: 'Article',
      description: 'Structure pour les articles de blog'
    },
    product: {
      name: 'Produit',
      description: 'Structure pour les produits e-commerce'
    },
    organization: {
      name: 'Organisation',
      description: 'Structure pour les organisations'
    },
    localBusiness: {
      name: 'Entreprise locale',
      description: 'Structure pour les entreprises locales'
    }
  },
  preview: {
    configureSettings: 'Configurez vos paramètres',
    andGenerate: 'et cliquez sur "Générer"',
    generatedCode: 'Code généré'
  },
  actions: {
    generate: 'Générer le contenu',
    analyzing: 'Analyse en cours...'
  },
  codePreview: {
    code: 'Code',
    preview: 'Aperçu',
    copy: 'Copier',
    download: 'Télécharger',
    errorParsingJson: 'Erreur d\'analyse JSON'
  },
  errors: {
    validDomain: 'Veuillez saisir un domaine valide.',
    auditFailed: 'Le serveur d\'analyse a rencontré une erreur (500). Cela peut être dû à une surcharge du serveur ou à un problème avec le site analysé.',
    notFound: 'Le site demandé n\'a pas été trouvé (404). Vérifiez que l\'URL est correcte et que le site est accessible.',
    connectionRefused: 'Impossible de se connecter au site. Assurez-vous que le site est accessible et que votre connexion internet fonctionne.',
    timeout: 'L\'analyse a pris trop de temps et a été interrompue. Essayez d\'analyser un site plus petit ou augmentez le délai d\'attente.',
    generic: 'Une erreur s\'est produite lors de l\'analyse du site.',
    contentGeneration: 'Une erreur s\'est produite lors de la génération du contenu.',
    continueWithSettings: 'Vous pouvez toujours générer du contenu avec les paramètres actuels.',
    warning: 'Avertissement :'
  },
  templates: {
    rules: {
      description: 'Description',
      severity: 'Importance',
      category: 'Catégorie',
      path: 'Chemin',
      type: 'Type'
    },
    properties: {
      headline: 'Titre de l\'article',
      author: 'Nom de l\'auteur',
      datePublished: 'Date de publication',
      dateModified: 'Date de modification',
      image: 'Image principale',
      description: 'Description',
      articleBody: 'Contenu de l\'article',
      publisher: 'Nom de l\'éditeur',
      keywords: 'Mots-clés',
      articleSection: 'Catégorie',
      inLanguage: 'Langue',
      name: 'Nom',
      offers: 'Prix et disponibilité',
      brand: 'Marque',
      sku: 'Référence produit',
      gtin: 'GTIN du produit',
      mpn: 'Référence fabricant',
      color: 'Couleur',
      material: 'Matériau',
      weight: 'Poids',
      category: 'Catégorie',
      aggregateRating: 'Évaluation moyenne',
      logo: 'Logo',
      telephone: 'Numéro de téléphone',
      email: 'Adresse email',
      address: 'Adresse postale',
      foundingDate: 'Date de création',
      legalName: 'Raison sociale',
      numberOfEmployees: 'Nombre d\'employés',
      socialProfiles: 'Profils sociaux',
      url: 'URL du site web',
      openingHours: 'Heures d\'ouverture',
      priceRange: 'Fourchette de prix',
      areaServed: 'Zone desservie',
      hasMap: 'Lien vers la carte',
      geo: 'Coordonnées géographiques'
    },
    categories: {
      admin: 'Administration',
      system: 'Système',
      plugins: 'Extensions',
      themes: 'Thèmes',
      security: 'Sécurité',
      auth: 'Authentification',
      media: 'Médias',
      cache: 'Cache',
      checkout: 'Paiement',
      cart: 'Panier',
      user: 'Utilisateur',
      search: 'Recherche',
      catalog: 'Catalogue',
      products: 'Produits',
      categories: 'Catégories',
      api: 'API',
      static: 'Fichiers statiques',
      tags: 'Tags',
      authors: 'Auteurs',
      feeds: 'Flux RSS',
      comments: 'Commentaires'
    },
    severity: {
      high: 'Élevée',
      medium: 'Moyenne',
      low: 'Faible'
    }
  },
  tools: {
    new: 'Nouveau',
    premium: 'Premium',
    explore: 'Explorer'
  }
} 