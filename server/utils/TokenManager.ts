export class TokenManager {
  private static TOKEN_KEY = 'auth_token';
  private static FALLBACK_TOKEN_KEY = 'auth_token_backup';

  static storeToken(token: string): void {
    if (!token) {
      console.error('[TokenManager] Tentative de stocker un token vide');
      return;
    }

    try {
      // Vérifier que le token est valide avant de le stocker
      if (!this.isValidTokenFormat(token)) {
        console.error('[TokenManager] Tentative de stocker un token avec un format invalide');
        return;
      }

      // Stocker le token dans localStorage
      localStorage.setItem(this.TOKEN_KEY, token);

      // Stocker une copie de secours
      localStorage.setItem(this.FALLBACK_TOKEN_KEY, token);

      console.log('[TokenManager] Token stocké avec succès, longueur:', token.length);
    } catch (error) {
      console.error('[TokenManager] Erreur lors du stockage du token:', error);
    }
  }

  static retrieveToken(): string | null {
    try {
      // Tenter de récupérer le token principal
      let token = localStorage.getItem(this.TOKEN_KEY);

      // Si le token principal est manquant, essayer avec la copie de secours
      if (!token) {
        console.log('[TokenManager] Token principal manquant, tentative de récupération du token de secours');
        token = localStorage.getItem(this.FALLBACK_TOKEN_KEY);

        // Si un token de secours est trouvé, restaurer le token principal
        if (token) {
          console.log('[TokenManager] Token de secours trouvé, restauration du token principal');
          localStorage.setItem(this.TOKEN_KEY, token);
        }
      }

      if (!token) {
        console.log('[TokenManager] Aucun token trouvé dans le localStorage');
        return null;
      }

      console.log('[TokenManager] Token récupéré avec succès, longueur:', token.length);

      // Vérifier que le token est toujours valide
      if (!this.isValidTokenFormat(token)) {
        console.error('[TokenManager] Token récupéré avec un format invalide');
        this.removeToken();
        return null;
      }

      return token;
    } catch (error) {
      console.error('[TokenManager] Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.FALLBACK_TOKEN_KEY);
      console.log('[TokenManager] Tokens supprimés avec succès');
    } catch (error) {
      console.error('[TokenManager] Erreur lors de la suppression des tokens:', error);
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    try {
      console.log('[TokenManager] Tentative de rafraîchissement du token...');
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('[TokenManager] Erreur lors du rafraîchissement du token:', response.status);
        if (response.status === 401) {
          this.removeToken();
        }
        return null;
      }

      try {
        const data = await response.json();
        console.log('[TokenManager] Réponse du rafraîchissement:', data);

        if (!data.success) {
          console.error('[TokenManager] Échec du rafraîchissement:', data.error || 'Erreur inconnue');
          return null;
        }

        if (!data.accessToken) {
          console.error('[TokenManager] Pas de token dans la réponse de rafraîchissement');
          return null;
        }

        // Vérifier que le nouveau token est valide avant de le stocker
        if (this.isValidToken(data.accessToken)) {
          this.storeToken(data.accessToken);
          console.log('[TokenManager] Token rafraîchi avec succès');
          return data.accessToken;
        } else {
          console.error('[TokenManager] Le token rafraîchi est invalide');
          return null;
        }
      } catch (error) {
        console.error('[TokenManager] Erreur lors du traitement de la réponse:', error);
        return null;
      }
    } catch (error) {
      console.error('[TokenManager] Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  }

  static isValidTokenFormat(token: string | null): boolean {
    if (!token) return false;

    // Vérifier le format de base du JWT (3 parties séparées par des points)
    const parts = token.split('.');
    return parts.length === 3;
  }

  static isValidToken(token: string | null): boolean {
    if (!token) {
      console.error('[TokenManager] Token vide ou nul');
      return false;
    }

    try {
      // Vérifier si le token est un JWT valide
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('[TokenManager] Format de token invalide (pas 3 parties)');
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));

      // Ne pas logger le payload complet pour des raisons de sécurité
      console.log('[TokenManager] Vérification du payload du token, contient userId:', !!payload.userId, 'contient id:', !!payload.id);

      // Vérifier la présence d'un ID utilisateur (userId ou id)
      if (!payload.userId && !payload.id) {
        console.error('[TokenManager] Token invalide: ID utilisateur manquant');
        return false;
      }

      // Vérifier l'expiration
      if (!payload.exp) {
        console.error('[TokenManager] Token invalide: champ exp manquant');
        return false;
      }

      const expiration = payload.exp * 1000; // Convertir en millisecondes
      const isExpired = Date.now() >= expiration;

      if (isExpired) {
        console.error('[TokenManager] Token expiré');
        return false;
      }

      return true;
    } catch (error) {
      console.error('[TokenManager] Erreur lors de la validation du token:', error);
      return false;
    }
  }

  static decodeToken(token: string | null): any {
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      return JSON.parse(atob(parts[1]));
    } catch (error) {
      console.error('[TokenManager] Erreur lors du décodage du token:', error);
      return null;
    }
  }
} 