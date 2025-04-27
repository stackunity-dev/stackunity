(function() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return;
  }

  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/plausible-proxy.js', { scope: '/' })
      .then(function(registration) {
        console.info('Service worker pour le cache Plausible enregistré avec succès', registration.scope);
      })
      .catch(function(error) {
        console.warn('Échec d\'enregistrement du service worker pour Plausible:', error);
      });
  });
})(); 