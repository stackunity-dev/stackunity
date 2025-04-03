// @ts-ignore
import { defineNuxtPlugin } from '#app';
import { useRouter } from 'vue-router';
import { TokenManager } from '../server/utils/TokenManager';
import { AUTO_REFRESH_THRESHOLD } from '../server/utils/auth-config';
import { useUserStore } from '../stores/userStore';

interface RefreshResponse {
  accessToken: string;
}

interface ValidateResponse {
  valid: boolean;
  exp?: number;
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();
  const router = useRouter();

  // Fonction pour vérifier si le token doit être rafraîchi
  const shouldRefreshToken = async (token: string) => {
    try {
      const response = await $fetch<ValidateResponse>('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.valid || !response.exp) return false;

      const expirationTime = response.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      return timeUntilExpiration > 0 && timeUntilExpiration <= AUTO_REFRESH_THRESHOLD * 1000;
    } catch {
      return false;
    }
  };

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      const response = await $fetch<RefreshResponse>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.accessToken) {
        TokenManager.storeToken(response.accessToken);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
    }
  };

  // Vérifier le token toutes les minutes
  if (process.client) {
    setInterval(async () => {
      const currentToken = TokenManager.retrieveToken();
      if (currentToken && await shouldRefreshToken(currentToken)) {
        await refreshToken();
      }
    }, 60000); // Vérification toutes les minutes
  }

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = async () => {
    try {
      // Valider d'abord le token
      const validationResult = await userStore.validateToken();
      console.log('[AUTH PLUGIN] Validation du token:', validationResult.valid ? 'Valide' : 'Invalide');

      // Si le token est valide, on peut l'utiliser directement
      if (validationResult.valid) {
        console.log('[AUTH PLUGIN] Token valide, utilisation directe');
        return true;
      }

      // Sinon, essayer de rafraîchir le token
      console.log('[AUTH PLUGIN] Token invalide, tentative de rafraîchissement');
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('[AUTH PLUGIN] Erreur HTTP lors du rafraîchissement:', response.status);
        userStore.logout();
        return false;
      }

      const data = await response.json();
      console.log('[AUTH PLUGIN] Réponse du rafraîchissement:', data ? 'Succès' : 'Échec');

      if (data.success && data.accessToken) {
        // Mettre à jour le token d'accès
        TokenManager.storeToken(data.accessToken);
        userStore.setToken(data.accessToken);

        // Mettre à jour les données utilisateur si présentes
        if (data.user) {
          // Convertir d'abord en nombre puis en booléen
          const isPremiumValue = Number(data.user.isPremium) === 1;
          const isAdminValue = Number(data.user.isAdmin) === 1;

          console.log('[AUTH PLUGIN] Valeurs brutes reçues:', {
            isPremium: data.user.isPremium,
            isAdmin: data.user.isAdmin,
            types: {
              isPremium: typeof data.user.isPremium,
              isAdmin: typeof data.user.isAdmin
            }
          });

          // Mettre à jour l'utilisateur avec les valeurs converties
          userStore.user = {
            ...data.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };
          userStore.isAuthenticated = true;
          userStore.isPremium = isPremiumValue;
          userStore.isAdmin = isAdminValue;

          console.log('[AUTH PLUGIN] Valeurs après conversion:', {
            isPremium: isPremiumValue,
            isAdmin: isAdminValue,
            userPremium: userStore.user.isPremium,
            userAdmin: userStore.user.isAdmin,
            storePremium: userStore.isPremium,
            storeAdmin: userStore.isAdmin
          });

          // Persister les données
          userStore.persistUserData();
        }

        return true;
      } else {
        // Échec du rafraîchissement, déconnexion
        console.error('[AUTH PLUGIN] Échec du rafraîchissement, déconnexion');
        userStore.logout();
        return false;
      }
    } catch (error) {
      console.error('[AUTH PLUGIN] Erreur lors du rafraîchissement du token:', error);
      userStore.logout();
      return false;
    }
  };

  if (process.client) {
    // Initialiser le store utilisateur uniquement si on a encore des données stockées
    if (userStore.isAuthenticated || localStorage.getItem('user_data')) {
      await userStore.initializeStore();
      const currentToken = TokenManager.retrieveToken();
      if (currentToken) {
        const isValid = await userStore.validateToken();
        if (!isValid.valid) {
          await refreshAccessToken();
        }
      }
    }

    // Intercepter les requêtes pour gérer l'expiration des tokens
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const inputUrl = input instanceof Request ? input.url : input.toString();
      if ((inputUrl.includes('/api/snippets/') || inputUrl.includes('/api/sql/') || inputUrl.includes('/api/studio/')) && userStore.isAuthenticated) {
        console.log('[AUTH PLUGIN] URL API sécurisée détectée:', inputUrl);
        const newInit = { ...init };
        const token = TokenManager.retrieveToken();

        if (token) {
          if (!newInit.headers) {
            newInit.headers = {
              'Authorization': `Bearer ${token}`
            };
          } else if (typeof newInit.headers === 'object') {
            if (newInit.headers instanceof Headers) {
              newInit.headers.set('Authorization', `Bearer ${token}`);
            } else {
              newInit.headers = {
                ...newInit.headers,
                'Authorization': `Bearer ${token}`
              };
            }
          }
          console.log('[AUTH PLUGIN] En-tête d\'autorisation ajouté à la requête');
          return originalFetch(input, newInit);
        }
      }

      // Exécuter la requête originale
      const response = await originalFetch(input, init);

      // Si la requête échoue avec un code 401 (non autorisé), tenter de rafraîchir le token
      if (response.status === 401) {
        console.log('[AUTH PLUGIN] Réponse 401 reçue, tentative de rafraîchissement du token');
        const refreshSuccessful = await refreshAccessToken();

        // Si le rafraîchissement a réussi, réessayer la requête avec le nouveau token
        if (refreshSuccessful) {
          const newInit = { ...init };
          const token = TokenManager.retrieveToken();

          if (token) {
            if (!newInit.headers) {
              newInit.headers = {
                'Authorization': `Bearer ${token}`
              };
            } else if (typeof newInit.headers === 'object') {
              // Ajouter ou mettre à jour l'en-tête d'autorisation
              if (newInit.headers instanceof Headers) {
                newInit.headers.set('Authorization', `Bearer ${token}`);
              } else {
                newInit.headers = {
                  ...newInit.headers,
                  'Authorization': `Bearer ${token}`
                };
              }
            }
            console.log('[AUTH PLUGIN] Réessai de la requête avec le nouveau token');
            return originalFetch(input, newInit);
          }
        }
      }

      return response;
    };

    router.beforeEach((to, from, next) => {
      const adminRoutes = ['/newsletter-admin', '/admin'];
      const authRoutes = ['/dashboard', '/profile', '/snippets', '/snippetsView', '/studio'];
      const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];
      const publicRoutes = ['/', '/login', '/signup', '/about', '/contact', '/pricing'];

      // Si on navigue vers une route publique, on continue
      if (publicRoutes.some(route => to.path === route || to.path.startsWith(`${route}/`))) {
        next();
        return;
      }

      // Récupérer l'état d'authentification
      const isLoggedIn = userStore.isUserAuthenticated;

      // Vérifier les routes admin
      if (adminRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isAdminUser = isLoggedIn && userStore.user?.isAdmin === true;

        if (!isAdminUser) {
          console.log('Accès refusé à la route admin - Statut admin:', userStore.user?.isAdmin);
          next('/login');
          return;
        }
      }

      // Vérifier les routes premium
      if (premiumRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isPremiumUser = isLoggedIn && userStore.user?.isPremium === true;

        if (!isPremiumUser) {
          console.log('Accès refusé à la route premium - Statut premium:', userStore.user?.isPremium);
          next('/subscription');
          return;
        }
      }

      // Vérifier les routes qui nécessitent une authentification
      const isAuthRoute = authRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        // Vérifier le chemin exact et les paramètres de requête
        return normalizedPath === normalizedRoute ||
          normalizedPath.startsWith(`${normalizedRoute}/`) ||
          normalizedPath.startsWith(`${normalizedRoute}?`);
      });

      if (isAuthRoute && !isLoggedIn) {
        console.log('Authentification requise pour:', to.path);
        next('/login');
        return;
      }

      next();
    });
  }

  return {
    provide: {
      refreshToken: refreshAccessToken
    }
  };
});
