(function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      try {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(function(registration) {
          })
          .catch(function(error) {
          });
      } catch (e) {
        console.log('Exception lors de l\'enregistrement du Service Worker :', e);
      }
    });
  }
})(); 