self.addEventListener('install', function(event) {
  // @ts-ignore - skipWaiting est bien une méthode du contexte Service Worker
  self.skipWaiting();
  console.log('Service Worker installé');
});

self.addEventListener('activate', function(event) {
  // @ts-ignore - waitUntil est bien une méthode des événements SW
  event.waitUntil(
    // @ts-ignore - clients est bien défini dans le contexte SW
    clients.claim().then(function() {
      console.log('Service Worker activé et contrôlant la page');
    })
  );
});

self.addEventListener('fetch', function(event) {
  // @ts-ignore - respondWith et request sont bien définis pour FetchEvent
  event.respondWith(
    // @ts-ignore
    fetch(event.request).catch(function(error) {
      console.log('Erreur fetch SW:', error);
      throw error;
    })
  );
}); 