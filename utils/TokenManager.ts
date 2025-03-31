/**
 * Gestionnaire de tokens d'authentification
 */

export class TokenManager {
  static TOKEN_KEY = 'access_token';

  /**
   * Stocke le token d'accès dans localStorage
   */
  static storeToken(token: string | null) {
    if (!token) {
      this.removeToken();
      return;
    }

    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Erreur lors du stockage du token:', error);
    }
  }

  /**
   * Récupère le token d'accès depuis localStorage
   */
  static retrieveToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  static removeToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  }

  /**
   * Crée un en-tête d'autorisation avec le token
   */
  static getAuthHeader(): { Authorization: string } {
    const token = this.retrieveToken();
    return { Authorization: `Bearer ${token || ''}` };
  }

  static async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du rafraîchissement du token');
      }

      const data = await response.json();
      if (data.success && data.accessToken) {
        this.storeToken(data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return null;
    }
  }
} 