export interface TokenData {
  userId: number;
  username?: string;
  email?: string;
  isPremium?: boolean;
  isStandard?: boolean;
  isAdmin?: boolean;
  isBuying?: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  daysLeft?: number;
  subscription_status?: string;
  payment_status?: string;
}

export class TokenUtils {
  static storeToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  static retrieveToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  static removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  static decodeToken(token: string): TokenData | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString());

      return {
        userId: decodedData.userId,
        username: decodedData.username,
        email: decodedData.email,
        isPremium: decodedData.isPremium,
        isStandard: decodedData.isStandard,
        isAdmin: decodedData.isAdmin
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
} 