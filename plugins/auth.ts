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
    }
  };

  if (process.client) {
    setInterval(async () => {
      const currentToken = TokenManager.retrieveToken();
      if (currentToken && await shouldRefreshToken(currentToken)) {
        await refreshToken();
      }
    }, 60000);
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
        userStore.logout();
        return false;
      }

      const data = await response.json();

      if (data.success && data.accessToken) {
        TokenManager.storeToken(data.accessToken);
        userStore.setToken(data.accessToken);

        if (data.user) {
          const isPremiumValue = Number(data.user.isPremium) === 1;
          const isAdminValue = Number(data.user.isAdmin) === 1;

          userStore.user = {
            ...data.user,
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
      userStore.logout();
      return false;
    }
  };

  if (process.client) {
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
      if ((inputUrl.includes('/api/snippets/') || inputUrl.includes('/api/sql/') || inputUrl.includes('/api/studio/')) && userStore.isAuthenticated) {
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
          return originalFetch(input, newInit);
        }
      }

      const response = await originalFetch(input, init);

      if (response.status === 401) {
        const refreshSuccessful = await refreshAccessToken();

        if (refreshSuccessful) {
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

      if (publicRoutes.some(route => to.path === route || to.path.startsWith(`${route}/`))) {
        next();
        return;
      }

      const isLoggedIn = userStore.isUserAuthenticated;

      if (adminRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isAdminUser = isLoggedIn && userStore.user?.isAdmin === true;

        if (!isAdminUser) {
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
