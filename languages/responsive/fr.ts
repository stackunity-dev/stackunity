export default {
  meta: {
    title: 'Visualiseur Responsive',
    description: 'Visualisez vos sites web sur différents appareils'
  },
  url: {
    label: 'Entrez une URL',
    placeholder: 'https://exemple.com',
    select: 'Sélectionnez une URL',
    rules: {
      required: 'URL requise',
      startWithHttp: 'L\'URL doit commencer par http ou https'
    }
  },
  controls: {
    autoRefresh: 'Rafraîchissement auto',
    interval: 'Intervalle',
    view: 'Voir',
    refresh: 'Rafraîchir',
    toggleMockup: 'Basculer vers la vue de mockup',
    rotate: 'Tourner'
  },
  intervals: {
    fiveSeconds: '5 secondes',
    tenSeconds: '10 secondes',
    thirtySeconds: '30 secondes',
    oneMinute: '1 minute'
  },
  devices: {
    iphone: 'iPhone',
    android: 'Android',
    ipad: 'iPad',
    tablet: 'Tablette',
    laptop: 'Ordinateur portable',
    desktop: 'Ordinateur de bureau'
  },
  messages: {
    iframeError: 'Ce site ne peut pas être affiché dans un iframe.',
    openInNewTab: 'Ouvrir dans un nouvel onglet',
    enterUrl: 'Entrez une URL pour prévisualiser',
    urlLoaded: 'URL chargée',
    noUrlToRefresh: 'Aucune URL à rafraîchir'
  }
} 