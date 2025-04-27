/// <reference lib="webworker" />

const PLAUSIBLE_CACHE = 'plausible-cache-v1';
const ANALYTICS_URL = 'https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js';
const ANALYTICS_API = 'https://plausible.io/api/event';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(PLAUSIBLE_CACHE)
      .then(function(cache) {
        return cache.add(ANALYTICS_URL);
      })
      .then(function() {
        // @ts-ignore
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== PLAUSIBLE_CACHE) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(function() {
      // @ts-ignore
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  
  if (requestUrl.href === ANALYTICS_URL || requestUrl.pathname === '/js/script.js') {
    event.respondWith(
      caches.open(PLAUSIBLE_CACHE).then(function(cache) {
        return cache.match(ANALYTICS_URL).then(function(cachedResponse) {
          const fetchPromise = fetch(ANALYTICS_URL, { 
            cache: 'no-cache',
            credentials: 'same-origin'
          })
          .then(function(networkResponse) {
            if (networkResponse.ok) {
              cache.put(ANALYTICS_URL, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(function() {
            return cachedResponse;
          });
          
          return cachedResponse || fetchPromise;
        });
      })
    );
  }
}); 