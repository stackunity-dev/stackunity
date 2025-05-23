// @ts-ignore
import { defineNuxtPlugin } from '#app';
import { useRouter } from 'vue-router';
import { TokenManager } from '../server/utils/TokenManager';
import { useUserStore } from '../stores/userStore';
import { TokenUtils } from '../utils/token';

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

  const shouldRefreshToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json() as ValidateResponse;
      if (!data.valid || !data.exp) {
        return true;
      }
      return Date.now() >= (data.exp * 1000) - 60000;
    } catch {
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json() as RefreshResponse;
      if (data.accessToken) {
        TokenManager.storeToken(data.accessToken);
      }
    } catch (error) {
    }
  };

  if (typeof window !== 'undefined') {
    setInterval(async () => {
      const currentToken = TokenManager.retrieveToken();
      if (currentToken) {
        try {
          const shouldRefresh = await shouldRefreshToken(currentToken);
          if (shouldRefresh) {
            await refreshToken();
          }
        } catch (e) {
          console.error("[AUTH] Erreur lors de la vérification du token:", e);
        }
      }
    }, 30000);
  }

  const refreshAccessToken = async () => {
    try {
      const validationResult = await userStore.validateToken();

      if (validationResult.valid) {
        return true;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        console.warn("Échec du rafraîchissement de token, status:", response.status);
        userStore.logout();
        return false;
      }

      const data = await response.json();

      if (data.success && data.accessToken) {
        TokenManager.storeToken(data.accessToken);
        userStore.setToken(data.accessToken);

        if (data.user) {
          const isPremiumValue = typeof data.user.isPremium === 'number'
            ? Boolean(data.user.isPremium)
            : Boolean(data.user.isPremium);

          const isAdminValue = typeof data.user.isAdmin === 'number'
            ? Boolean(data.user.isAdmin)
            : Boolean(data.user.isAdmin);

          const userId = data.user.id || data.user.userId;

          userStore.user = {
            ...data.user,
            id: userId,
            userId: userId,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };

          userStore.isAuthenticated = true;
          userStore.isPremium = isPremiumValue;
          userStore.isAdmin = isAdminValue;

          userStore.persistUserData();
        }

        return true;
      } else {
        userStore.logout();
        return false;
      }
    } catch (error) {
      console.error("[AUTH] Erreur lors du rafraîchissement:", error);
      userStore.logout();
      return false;
    }
  };

  if (typeof window !== 'undefined') {
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

    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const inputUrl = input instanceof Request ? input.url : input.toString();

      if (inputUrl.includes('/api/auth/check-trial')) {
        return originalFetch(input, init);
      }

      const requiresAuth = init?.headers && (init.headers as any)['Authorization'];
      if (requiresAuth) {
        try {
          const token = TokenUtils.retrieveToken();
          if (token) {
            const trialResponse = await originalFetch('/api/auth/check-trial', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (trialResponse.ok) {
              const trialData = await trialResponse.json();
              if (trialData.success) {

                userStore.isPremium = trialData.isPremium;
                if (userStore.user) {
                  userStore.user.isPremium = trialData.isPremium;
                }
                userStore.persistData();
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de la période d\'essai:', error);
        }
      }

      if (inputUrl.includes('/api/') && userStore.isAuthenticated) {
        const token = TokenManager.retrieveToken();

        if (token) {
          const newInit = { ...init };

          if (!newInit.headers) {
            newInit.headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            };
          } else if (typeof newInit.headers === 'object') {
            if (newInit.headers instanceof Headers) {
              if (!newInit.headers.has('Authorization')) {
                newInit.headers.set('Authorization', `Bearer ${token}`);
              }
              if (!newInit.headers.has('Content-Type')) {
                newInit.headers.set('Content-Type', 'application/json');
              }
              if (!newInit.headers.has('Accept')) {
                newInit.headers.set('Accept', 'application/json');
              }
            } else {
              newInit.headers = {
                ...newInit.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': newInit.headers['Content-Type'] || 'application/json',
                'Accept': newInit.headers['Accept'] || 'application/json'
              };
            }
          }
          return originalFetch(input, newInit);
        }
      }

      const response = await originalFetch(input, init);

      if (response.status === 401 && inputUrl.includes('/api/')) {
        console.log(`[AUTH] Erreur 401 détectée pour ${inputUrl}, tentative de rafraîchissement du token`);

        const refreshSuccessful = await refreshAccessToken();

        if (refreshSuccessful) {
          const token = TokenManager.retrieveToken();

          if (token) {
            const newInit = { ...init };

            if (!newInit.headers) {
              newInit.headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              };
            } else if (typeof newInit.headers === 'object') {
              if (newInit.headers instanceof Headers) {
                newInit.headers.set('Authorization', `Bearer ${token}`);
                if (!newInit.headers.has('Content-Type')) {
                  newInit.headers.set('Content-Type', 'application/json');
                }
                if (!newInit.headers.has('Accept')) {
                  newInit.headers.set('Accept', 'application/json');
                }
              } else {
                newInit.headers = {
                  ...newInit.headers,
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': newInit.headers['Content-Type'] || 'application/json',
                  'Accept': newInit.headers['Accept'] || 'application/json'
                };
              }
            }
            return originalFetch(input, newInit);
          }
        } else {
          console.warn(`[AUTH] Échec du rafraîchissement du token, redirection vers la page de connexion`);
          if (typeof window !== 'undefined') {
            userStore.logout();
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
      }

      return response;
    };

    router.beforeEach(async (to, from, next) => {
      const adminRoutes = ['/newsletter-admin', '/admin'];
      const authRoutes = ['/dashboard', '/profile', '/snippets', '/snippetsView', '/studio', '/checkout'];
      const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];
      const publicRoutes = ['/', '/login', '/signup', '/about', '/contact', '/pricing'];

      if (publicRoutes.some(route => to.path === route || to.path.startsWith(`${route}/`))) {
        next();
        return;
      }

      const isLoggedIn = userStore.isUserAuthenticated;

      const logUnauthorizedAccess = async () => {
        try {
          await fetch('/api/auth/log-access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              path: to.path,
              timestamp: new Date().toISOString(),
              type: 'unauthorized_access'
            })
          });
        } catch (error) {
          console.error('Erreur lors du log d\'accès non autorisé:', error);
        }
      };

      if (adminRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isAdminUser = isLoggedIn && userStore.user?.isAdmin === true;

        if (!isAdminUser) {
          await logUnauthorizedAccess();
          next('/login');
          return;
        }
      }

      if (premiumRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isPremiumUser = isLoggedIn && userStore.user?.isPremium === true;

        if (!isPremiumUser) {
          await logUnauthorizedAccess();
          next('/subscription');
          return;
        }
      }

      const isAuthRoute = authRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute ||
          normalizedPath.startsWith(`${normalizedRoute}/`) ||
          normalizedPath.startsWith(`${normalizedRoute}?`);
      });

      if (isAuthRoute && !isLoggedIn) {
        await logUnauthorizedAccess();
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
