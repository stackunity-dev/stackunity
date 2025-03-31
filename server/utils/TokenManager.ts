export class TokenManager {
  static storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  static retrieveToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  static removeToken(): void {
    localStorage.removeItem('auth_token');
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
      if (data.accessToken) {
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