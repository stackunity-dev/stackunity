import { defineNuxtPlugin, navigateTo } from '#app';
import { useUserStore } from '~/stores/userStore';
import { TokenManager } from '~/utils/TokenManager';

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();

  // Fonction pour tenter de rafraîchir le token via refresh_token
  const tryRefreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'GET',
        credentials: 'include' // Important pour envoyer le cookie HttpOnly
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.accessToken) {
          userStore.setToken(data.accessToken);
          if (data.user) {
            userStore.user = data.user;
            userStore.isAuthenticated = true;
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.warn('Erreur lors du rafraîchissement du token:', error);
      return false;
    }
  };

  // Initialisation du store utilisateur
  userStore.initializeStore();

  // Intercepter les réponses HTTP 401 pour tenter un rafraîchissement du token
  nuxtApp.hook('app:error', async (error: any) => {
    if (error?.statusCode === 401 && userStore.isAuthenticated) {
      console.log('Erreur 401 détectée, tentative de rafraîchissement du token');
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        console.log('Token rafraîchi avec succès, redirection vers la page courante');
        // Rediriger vers la page actuelle pour réessayer la requête
        const currentPath = window.location.pathname;
        navigateTo(currentPath);
      } else {
        console.log('Échec du rafraîchissement, déconnexion');
        userStore.logout();
        navigateTo('/login');
      }
    }
  });

  // Initialisation du token au démarrage
  if (process.client) {
    // Vérifier si un token existe déjà
    const token = TokenManager.retrieveToken();
    if (token) {
      userStore.token = token;
      userStore.isAuthenticated = true;
    } else {
      // Si pas de token mais que l'utilisateur est marqué comme authentifié,
      // tenter de rafraîchir le token
      if (userStore.isAuthenticated) {
        await tryRefreshToken();
      }
    }
  }

  return {
    provide: {
      refreshToken: tryRefreshToken
    }
  };
});