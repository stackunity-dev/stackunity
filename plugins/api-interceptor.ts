import { defineNuxtPlugin } from '#app';
import { useUserStore } from '~/stores/userStore';
import { TokenManager } from '~/utils/TokenManager';

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore();

  // Variables pour limiter les tentatives de rafraîchissement
  let refreshingPromise: Promise<boolean> | null = null;
  let failedUrls = new Set<string>();
  const MAX_RETRY_PER_URL = 2;
  const retryCount = new Map<string, number>();

  // Intercepter les requêtes fetch globales
  if (process.client) {
    // Essayer de récupérer un token au chargement initial
    (async () => {
      console.log('Initialisation de l\'intercepteur API - vérification du token');
      // Si aucun token n'est présent en mémoire
      if (!TokenManager.retrieveToken()) {
        console.log('Aucun token trouvé au démarrage, tentative de rafraîchissement initial');
        try {
          // Essayer de rafraîchir depuis le serveur
          const success = await TokenManager.refreshAccessToken();
          if (success) {
            const token = TokenManager.retrieveToken();
            if (token) {
              console.log('Token récupéré avec succès au démarrage');
              userStore.token = token;
              userStore.isAuthenticated = true;
            }
          } else {
            console.warn('Impossible de récupérer un token au démarrage, utilisateur non connecté');
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du token au démarrage:', error);
        }
      } else {
        console.log('Token trouvé en mémoire au démarrage');
      }
    })();

    const originalFetch = window.fetch;
    window.fetch = async function (resource, options = {}) {
      try {
        // Extraire l'URL de la requête
        const url = typeof resource === 'string'
          ? resource
          : resource instanceof URL
            ? resource.href
            : resource.url;

        // Fonction pour vérifier si l'URL est interne
        const isInternalRequest = (url: string) => {
          try {
            // Si l'URL n'a pas de protocole, c'est une URL relative (donc interne)
            if (url.startsWith('/')) return true;

            // Vérifier si l'URL est du même domaine
            const currentHost = window.location.hostname;
            const urlObj = new URL(url);
            return urlObj.hostname === currentHost ||
              urlObj.hostname === 'localhost' ||
              urlObj.hostname.endsWith('.local');
          } catch (e) {
            // En cas d'erreur de parsing, considérer comme externe pour sécurité
            return false;
          }
        };

        // N'intercepter que les requêtes internes
        if (!isInternalRequest(url)) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`API Interceptor: Requête externe ignorée: ${url.substring(0, 50)}...`);
          }
          return originalFetch(resource, options);
        }

        // Ne pas intercepter les requêtes de rafraîchissement pour éviter une boucle
        if (url.includes('/api/auth/refresh') ||
          url.includes('/api/auth/login') ||
          url.includes('/api/auth/logout')) {
          return originalFetch(resource, {
            ...options,
            credentials: 'include' as RequestCredentials // Toujours inclure les cookies pour les requêtes d'authentification
          });
        }

        // Vérifier si cette URL a déjà échoué plusieurs fois
        if (failedUrls.has(url)) {
          console.log(`URL ignorée car déjà échouée plusieurs fois: ${url}`);
          return originalFetch(resource, options);
        }

        // Conserver le nombre de tentatives par URL
        const currentRetryCount = retryCount.get(url) || 0;
        if (currentRetryCount >= MAX_RETRY_PER_URL) {
          console.log(`Nombre maximum de tentatives atteint pour l'URL: ${url}`);
          failedUrls.add(url);
          return originalFetch(resource, options);
        }

        // Vérifier si le token est présent
        let token = TokenManager.retrieveToken();
        if (!token) {
          console.log('Aucun token trouvé, tentative de rafraîchissement');

          // Utiliser une promesse partagée pour éviter les appels simultanés
          if (!refreshingPromise) {
            refreshingPromise = TokenManager.refreshAccessToken();

            try {
              const refreshSuccess = await refreshingPromise;
              if (refreshSuccess) {
                console.log('Token rafraîchi avec succès avant la requête');
                token = TokenManager.retrieveToken();
                if (token) {
                  userStore.token = token;
                }
              } else {
                console.warn('Échec du rafraîchissement du token');
              }
            } finally {
              // Réinitialiser la promesse après la fin
              refreshingPromise = null;
            }
          } else {
            // Une autre requête est déjà en train de rafraîchir, attendre qu'elle finisse
            console.log('Attente d\'un rafraîchissement en cours...');
            await refreshingPromise;
            token = TokenManager.retrieveToken();
          }
        }

        // Configurer les options pour inclure les credentials et le token d'autorisation
        const newOptions = {
          ...options,
          credentials: 'include' as RequestCredentials, // Toujours inclure les cookies
        };

        // Ajouter le token d'autorisation s'il existe
        if (token) {
          if (newOptions.headers instanceof Headers) {
            newOptions.headers.set('Authorization', `Bearer ${token}`);
          } else if (typeof newOptions.headers === 'object' && newOptions.headers !== null) {
            newOptions.headers = {
              ...newOptions.headers,
              'Authorization': `Bearer ${token}`
            };
          } else {
            newOptions.headers = {
              'Authorization': `Bearer ${token}`
            };
          }
        }

        // Effectuer la requête originale avec les nouvelles options
        const response = await originalFetch(resource, newOptions);

        // Réinitialiser le compteur si la requête réussit
        if (response.ok) {
          retryCount.delete(url);
        }

        // Si la réponse est 401 Unauthorized, essayer de rafraîchir le token et relancer la requête
        if (response.status === 401) {
          console.log('Réponse 401 détectée, tentative de rafraîchissement du token');

          // Incrémenter le compteur de tentatives pour cette URL
          const currentCount = retryCount.get(url) || 0;
          retryCount.set(url, currentCount + 1);

          // Vérifier si le nombre maximum de tentatives est atteint
          if ((retryCount.get(url) || 0) >= MAX_RETRY_PER_URL) {
            console.log(`Nombre maximum de tentatives atteint pour l'URL: ${url}`);
            return response;
          }

          // Utiliser une promesse partagée pour éviter les appels simultanés
          if (!refreshingPromise) {
            refreshingPromise = TokenManager.refreshAccessToken();

            try {
              const refreshSuccess = await refreshingPromise;
              if (refreshSuccess) {
                console.log('Token rafraîchi avec succès, relance de la requête');

                // Mettre à jour le token dans le store
                token = TokenManager.retrieveToken();
                if (token) {
                  userStore.token = token;

                  // Recréer les options avec le nouveau token
                  const retryOptions = {
                    ...newOptions,
                    credentials: 'include' as RequestCredentials, // S'assurer que les credentials sont incluses
                  };

                  if (retryOptions.headers instanceof Headers) {
                    retryOptions.headers.set('Authorization', `Bearer ${token}`);
                  } else if (typeof retryOptions.headers === 'object' && retryOptions.headers !== null) {
                    retryOptions.headers = {
                      ...retryOptions.headers,
                      'Authorization': `Bearer ${token}`
                    };
                  } else {
                    retryOptions.headers = {
                      'Authorization': `Bearer ${token}`
                    };
                  }

                  // Relancer la requête avec le nouveau token
                  return originalFetch(resource, retryOptions);
                }
              } else {
                console.warn('Échec du rafraîchissement du token après 401');
              }
            } finally {
              // Réinitialiser la promesse après la fin
              refreshingPromise = null;
            }
          } else {
            // Une autre requête est déjà en train de rafraîchir, attendre qu'elle finisse
            console.log('Attente d\'un rafraîchissement en cours...');
            await refreshingPromise;
            token = TokenManager.retrieveToken();

            if (token) {
              // Vérifier si le nombre maximum de tentatives est atteint
              if ((retryCount.get(url) || 0) >= MAX_RETRY_PER_URL) {
                console.log(`Nombre maximum de tentatives atteint pour l'URL: ${url}`);
                return response;
              }

              // Recréer les options avec le nouveau token
              const retryOptions = {
                ...newOptions,
                credentials: 'include' as RequestCredentials, // S'assurer que les credentials sont incluses
              };

              if (retryOptions.headers instanceof Headers) {
                retryOptions.headers.set('Authorization', `Bearer ${token}`);
              } else if (typeof retryOptions.headers === 'object' && retryOptions.headers !== null) {
                retryOptions.headers = {
                  ...retryOptions.headers,
                  'Authorization': `Bearer ${token}`
                };
              } else {
                retryOptions.headers = {
                  'Authorization': `Bearer ${token}`
                };
              }

              // Relancer la requête avec le nouveau token
              return originalFetch(resource, retryOptions);
            }
          }
        }

        return response;
      } catch (error) {
        console.error('Erreur dans l\'intercepteur fetch:', error);
        return originalFetch(resource, options);
      }
    };

    // Purger la liste des URLs échouées périodiquement pour permettre de réessayer plus tard
    setInterval(() => {
      failedUrls.clear();
      retryCount.clear();
    }, 5 * 60 * 1000); // Purger toutes les 5 minutes
  }
}); 