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
} 