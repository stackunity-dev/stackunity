import { defineNuxtPlugin } from '#app';
import { onUnmounted, watch } from 'vue';
import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore();

  // Intervalle de 24 heures pour rafraîchir le token (24h * 60min * 60sec * 1000ms)
  const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

  let refreshInterval: any = null;

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      if (!userStore.isUserAuthenticated) {
        clearInterval(refreshInterval);
        return;
      }

      console.log('Refreshing token...');
      const headers = {
        ...userStore.getAuthHeader,
        'Content-Type': 'application/json'
      };

      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          // Mettre à jour le token dans le store
          userStore.setToken(data.token);

          // Sauvegarder aussi une copie dans sessionStorage
          if (process.client) {
            sessionStorage.setItem('devunity_token_backup', data.token);
            console.log('Token refreshed and saved to sessionStorage');
          }
        } else {
          console.warn('Failed to refresh token - No token in response');

          // Essayer de restaurer depuis le sessionStorage
          if (process.client) {
            const backupToken = sessionStorage.getItem('devunity_token_backup');
            if (backupToken) {
              console.log('Restoring token from sessionStorage');
              userStore.setToken(backupToken);
            }
          }
        }
      } else {
        console.warn('Error refreshing token - API returned error', response.status);

        // En cas d'erreur, essayer de restaurer depuis le sessionStorage
        if (process.client) {
          const backupToken = sessionStorage.getItem('devunity_token_backup');
          if (backupToken) {
            console.log('Restoring token from sessionStorage after API error');
            userStore.setToken(backupToken);
          }
        }

        // Ne déconnecte pas en cas d'erreur 401, on va essayer la restauration d'abord
        if (response.status === 401 && !sessionStorage.getItem('devunity_token_backup')) {
          // Uniquement si on n'a pas de backup
          userStore.logout();
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error refreshing token:', error);

      // En cas d'erreur, essayer de restaurer depuis le sessionStorage
      if (process.client) {
        const backupToken = sessionStorage.getItem('devunity_token_backup');
        if (backupToken) {
          console.log('Restoring token from sessionStorage after exception');
          userStore.setToken(backupToken);
        }
      }
    }
  };

  if (process.client) {
    // Restaurer le token depuis sessionStorage si disponible au démarrage
    const backupToken = sessionStorage.getItem('devunity_token_backup');
    if (backupToken && !userStore.token) {
      console.log('Initializing with token from sessionStorage');
      userStore.setToken(backupToken);
    }

    // Démarrer le rafraîchissement périodique quand l'utilisateur est authentifié
    const startRefreshCycle = () => {
      // Nettoyer tout intervalle existant
      if (refreshInterval) clearInterval(refreshInterval);

      // Créer un nouvel intervalle
      refreshInterval = setInterval(refreshToken, REFRESH_INTERVAL);

      // Rafraîchir immédiatement pour s'assurer que le token est valide
      // et le sauvegarder dans sessionStorage
      refreshToken();

      console.log('Token refresh cycle started with 24h interval');
    };

    // Observer les changements d'état d'authentification
    const stopRefreshCycle = () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log('Token refresh cycle stopped');
      }
    };

    // Configurer un watcher pour démarrer/arrêter le cycle de rafraîchissement
    const unwatch = watch(
      () => userStore.isUserAuthenticated,
      (isAuthenticated) => {
        if (isAuthenticated) {
          console.log('Starting token refresh cycle - User is authenticated');
          startRefreshCycle();

          // Sauvegarde immédiate dans sessionStorage
          if (userStore.token) {
            sessionStorage.setItem('devunity_token_backup', userStore.token);
          }
        } else {
          console.log('Stopping token refresh cycle - User is not authenticated');
          stopRefreshCycle();
          // Nettoyage du backup
          sessionStorage.removeItem('devunity_token_backup');
        }
      },
      { immediate: true }
    );

    // Stopper le cycle au démontage
    onUnmounted(() => {
      unwatch();
      stopRefreshCycle();
    });

    // Démarrer le rafraîchissement si l'utilisateur est déjà authentifié
    if (userStore.isUserAuthenticated) {
      console.log('User already authenticated, starting token refresh cycle');
      startRefreshCycle();
    }

    // Vérifiez et forcez le rafraîchissement tous les 5 minutes
    const forceRefreshToken = () => {
      if (document.visibilityState === 'visible' && userStore.isUserAuthenticated) {
        console.log('Forcing token refresh due to visibility change');
        refreshToken();
      }
    };

    // Surveiller les changements de visibilité (onglet actif/inactif)
    document.addEventListener('visibilitychange', forceRefreshToken);

    // Nettoyer l'écouteur d'événements
    nuxtApp.hook('app:beforeMount', () => {
      document.removeEventListener('visibilitychange', forceRefreshToken);
    });
  }
}); 