export default {
  navigation: {
    website: 'Site web',
    appearance: 'Apparence',
    security: 'Sécurité',
    cookies: 'Cookies',
    dataPrivacy: 'Données & Confidentialité'
  },
  website: {
    title: 'Site web',
    info: 'Gérez les paramètres de votre site web.',
    name: {
      label: 'Nom du site web',
      required: 'Le nom du site web est requis'
    },
    url: {
      label: 'URL du site web',
      invalid: 'L\'URL doit commencer par https://'
    },
    analysis: {
      title: 'Analyse du site web',
      description: 'Analysez votre site pour découvrir toutes les URLs indexables.',
      button: 'Analyser le site web',
      analyzing: 'Analyse en cours...',
      urlsDetected: 'URLs détectées',
      noUrls: 'Aucune URL détectée',
      copy: 'Copier',
      clear: 'Effacer',
      open: 'Ouvrir {url} dans un nouvel onglet'
    },
    summary: {
      title: 'Résumé de l\'analyse',
      totalPages: 'Total des pages',
      averageLoadTime: 'Temps de chargement moyen',
      warnings: 'Avertissements'
    },
    sitemap: {
      title: 'Plan du site généré',
      copy: 'Copier le plan du site',
      download: 'Télécharger'
    },
    save: 'Enregistrer'
  },
  appearance: {
    title: 'Apparence',
    theme: {
      title: 'Thème',
      greenAmbiance: 'Ambiance verte',
      dark: 'Sombre',
      system: 'Système'
    },
    save: 'Enregistrer'
  },
  security: {
    title: 'Sécurité',
    info: 'Gérez les paramètres de sécurité de votre compte. Nous vous recommandons d\'utiliser un mot de passe fort et de le changer régulièrement.',
    changePassword: {
      title: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le nouveau mot de passe',
      update: 'Mettre à jour le mot de passe'
    },
    twoFactor: {
      title: 'Authentification à deux facteurs',
      description: 'L\'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.',
      status: 'Statut :',
      enabled: 'Activée',
      disabled: 'Désactivée',
      setup: 'Configurer l\'authentification à deux facteurs',
      disable: 'Désactiver l\'authentification à deux facteurs',
      qrCode: 'Scannez ce code QR avec votre application d\'authentification',
      confirmCode: 'Entrez le code à 6 chiffres de votre application',
      confirm: 'Confirmer'
    },
    sessions: {
      title: 'Sessions actives',
      thisDevice: 'Cet appareil',
      lastAccess: 'Dernier accès :',
      browser: 'Navigateur :',
      location: 'Localisation :',
      ip: 'IP :',
      revoke: 'Révoquer',
      revokeAll: 'Révoquer toutes les autres'
    }
  },
  cookies: {
    title: 'Cookies',
    info: 'Gérez l\'utilisation des cookies sur ce site.',
    necessary: {
      title: 'Nécessaires',
      description: 'Les cookies nécessaires aident à rendre un site web utilisable en activant des fonctions de base comme la navigation et l\'accès aux zones sécurisées du site web. Le site web ne peut pas fonctionner correctement sans ces cookies.'
    },
    preferences: {
      title: 'Préférences',
      description: 'Les cookies de préférence permettent à un site web de mémoriser des informations qui modifient le comportement ou l\'apparence du site, comme votre langue préférée ou la région dans laquelle vous vous trouvez.'
    },
    statistics: {
      title: 'Statistiques',
      description: 'Les cookies de statistiques aident les propriétaires de sites web à comprendre comment les visiteurs interagissent avec les sites en collectant et en rapportant des informations de manière anonyme.'
    },
    marketing: {
      title: 'Marketing',
      description: 'Les cookies de marketing sont utilisés pour suivre les visiteurs sur les sites web. L\'intention est d\'afficher des publicités pertinentes et engageantes pour l\'utilisateur individuel et ainsi plus précieuses pour les éditeurs et les annonceurs tiers.'
    },
    save: 'Enregistrer les préférences',
    deleteAll: 'Supprimer tous les cookies'
  },
  privacy: {
    title: 'Données & Confidentialité',
    info: 'Gérez vos données personnelles et vos paramètres de confidentialité.',
    exportData: {
      title: 'Exporter vos données',
      description: 'Téléchargez une copie de vos données personnelles.',
      button: 'Exporter les données'
    },
    deleteAccount: {
      title: 'Supprimer le compte',
      description: 'Supprimez définitivement votre compte et toutes les données associées.',
      warning: 'Attention : Cette action ne peut pas être annulée. Toutes vos données seront définitivement supprimées.',
      button: 'Supprimer le compte',
      confirm: 'Oui, supprimer mon compte',
      cancel: 'Annuler',
      confirmation: 'Tapez "DELETE" pour confirmer'
    },
    premiumStatus: {
      title: 'Statut de compte premium',
      description: 'Votre statut d\'abonnement actuel est :',
      premium: 'Premium',
      standard: 'Standard',
      trial: 'Essai',
      free: 'Gratuit'
    }
  },
  notifications: {
    saved: 'Paramètres enregistrés avec succès',
    error: 'Une erreur est survenue lors de l\'enregistrement de vos paramètres',
    passwordChanged: 'Mot de passe mis à jour avec succès',
    passwordError: 'Erreur lors de la mise à jour du mot de passe',
    dataCopied: 'Données copiées dans le presse-papiers',
    sitemapDownloaded: 'Plan du site téléchargé',
    analysisStarted: 'Analyse démarrée',
    analysisComplete: 'Analyse terminée',
    accountDeleted: 'Compte supprimé avec succès',
    appearanceUpdated: 'Apparence mise à jour avec succès',
    cookiesDeleted: 'Tous les cookies ont été supprimés',
    invalidUrl: 'Veuillez entrer une URL valide commençant par https://'
  }
} 