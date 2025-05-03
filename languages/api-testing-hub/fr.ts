export default {
  meta: {
    title: 'Hub de Test API',
    description: 'Testez vos API RESTful avec notre interface conviviale'
  },
  alerts: {
    deleteWarning: 'Attention : prenez des précautions lors de l\'utilisation de la méthode DELETE.',
    noCustomHeaders: 'Aucun en-tête personnalisé n\'a été envoyé avec cette requête.',
    runTests: 'Exécutez les tests pour voir les résultats.'
  },
  cardTitles: {
    newTest: 'Nouveau Test API',
    response: 'Réponse',
    history: 'Historique des requêtes',
    documentation: 'Documentation OpenAPI',
    apiTests: 'Tests API automatisés',
    status: 'Statut',
    historySettings: 'Paramètres d\'historique',
    historyCount: 'Nombre de requêtes'
  },
  tooltips: {
    historySettings: 'Paramètres d\'historique',
    commonHeaders: 'En-têtes communs automatiquement ajoutés par les navigateurs'
  },
  forms: {
    method: 'Méthode',
    url: 'URL',
    urlPlaceholder: 'https://api.example.com/endpoint',
    tabs: {
      headers: 'En-têtes',
      body: 'Corps',
      params: 'Paramètres',
      docs: 'Docs',
      tests: 'Tests',
      raw: 'Brut',
      tree: 'Arborescence',
      response: 'En-têtes de réponse',
      request: 'En-têtes de requête'
    },
    headers: {
      key: 'Clé',
      keyPlaceholder: 'Authorization',
      value: 'Valeur',
      valuePlaceholder: 'Bearer token123',
      add: 'Ajouter un en-tête',
      common: 'En-têtes communs',
      commonNote: 'Certains en-têtes standards sont automatiquement ajoutés par les navigateurs et ne sont pas affichés ici.',
      etc: 'etc.) sont automatiquement ajoutés par les navigateurs et ne sont pas affichés ici.'
    },
    params: {
      key: 'Clé',
      keyPlaceholder: 'page',
      value: 'Valeur',
      valuePlaceholder: '1',
      add: 'Ajouter un paramètre'
    },
    body: {
      label: 'Corps',
      placeholder: '{"clé": "valeur"}'
    },
    submit: 'Envoyer la requête',
    send: 'Envoyer la requête',
    schemaDepth: 'Profondeur du schéma',
    showExamples: 'Afficher les exemples',
    impact: 'Impact:',
    result: 'Résultat',
    status: 'Statut',
    data: 'Données',
    saveToHistory: 'Enregistrer les requêtes dans l\'historique'
  },
  response: {
    status: 'Statut',
    tabs: {
      body: 'Corps',
      headers: 'En-têtes',
      docs: 'Docs',
      tests: 'Tests'
    },
    bodyViews: {
      raw: 'Brut',
      tree: 'Arborescence'
    },
    headerTypes: {
      response: 'En-têtes de réponse',
      request: 'En-têtes de requête'
    },
    noCustomHeaders: 'Aucun en-tête personnalisé n\'a été envoyé avec cette requête.'
  },
  docs: {
    title: 'Documentation OpenAPI',
    download: 'Télécharger',
    schemaDepth: 'Profondeur du schéma',
    showExamples: 'Afficher les exemples'
  },
  apiTests: {
    title: 'Tests API automatisés',
    run: 'Exécuter les tests',
    results: {
      success: 'Succès',
      failure: 'Échec',
      pending: 'En attente'
    },
    generate: 'Générer des tests',
    testTypes: {
      status: 'Vérification du statut',
      schema: 'Validation du schéma',
      dataPresence: 'Présence de données',
      performance: 'Performance'
    }
  },
  history: {
    title: 'Historique des requêtes',
    noHistory: 'Aucun historique disponible',
    clearAll: 'Effacer tout',
    saveAs: 'Enregistrer sous',
    load: 'Charger',
    delete: 'Supprimer',
    settings: {
      title: 'Paramètres d\'historique',
      maxEntries: 'Nombre maximum d\'entrées',
      saveAutomatically: 'Enregistrer automatiquement les requêtes',
      includeHeaders: 'Inclure les en-têtes',
      includeBody: 'Inclure le corps',
      save: 'Enregistrer les paramètres'
    }
  },
  collection: {
    title: 'Collections',
    create: 'Créer une collection',
    import: 'Importer',
    export: 'Exporter',
    addRequest: 'Ajouter la requête à la collection',
    name: 'Nom de la collection',
    description: 'Description'
  },
  errors: {
    invalidUrl: 'URL invalide',
    networkError: 'Erreur réseau',
    timeout: 'Délai d\'attente dépassé',
    serverError: 'Erreur serveur'
  },
  buttons: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    run: 'Exécuter',
    copy: 'Copier',
    clear: 'Effacer',
    delete: 'Supprimer',
    download: 'Télécharger'
  }
} 