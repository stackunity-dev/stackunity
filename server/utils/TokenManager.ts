export class TokenManager {
  private static TOKEN_KEY = 'auth_token';

  static storeToken(token: string): void {
    if (!token) {
      console.error('Tentative de stocker un token vide');
      this.removeToken();
      return;
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('Token stocké avec succès');
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
      this.removeToken();
    }
  }

  static retrieveToken(): string | null {
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) {
        console.log('Aucun token trouvé dans le localStorage');
      } else {
        console.log('Token récupéré avec succès');
      }
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('Token supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }

  static async refreshAccessToken(): Promise<string | null> {
    try {
      console.log('Tentative de rafraîchissement du token...');
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Erreur lors du rafraîchissement du token:', response.status);
        this.removeToken();
        throw new Error('Erreur lors du rafraîchissement du token');
      }

      const data = await response.json();
      if (data.accessToken) {
        // Vérifier que le nouveau token est valide avant de le stocker
        if (this.isValidToken(data.accessToken)) {
          this.storeToken(data.accessToken);
          console.log('Token rafraîchi avec succès');
          return data.accessToken;
        } else {
          console.error('Le token rafraîchi est invalide');
          this.removeToken();
          return null;
        }
      }
      console.error('Pas de token dans la réponse de rafraîchissement');
      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.removeToken();
      return null;
    }
  }

  static isValidToken(token: string | null): boolean {
    if (!token) {
      console.error('Token vide ou nul');
      return false;
    }

    try {
      // Vérifier si le token est un JWT valide
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Format de token invalide (pas 3 parties)');
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log('Payload du token:', payload);

      // Vérifier la présence d'un ID utilisateur (userId ou id)
      if (!payload.userId && !payload.id) {
        console.error('Token invalide: ID utilisateur manquant');
        return false;
      }

      // Vérifier l'expiration
      if (!payload.exp) {
        console.error('Token invalide: champ exp manquant');
        return false;
      }

      const expiration = payload.exp * 1000; // Convertir en millisecondes
      const isExpired = Date.now() >= expiration;

      if (isExpired) {
        console.error('Token expiré');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la validation du token:', error);
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
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
} 