import { RowDataPacket } from 'mysql2';

export interface TokenPayload {
  userId: number;
  username?: string;
  email?: string;
  isPremium?: boolean | number;
  isAdmin?: boolean | number;
  tokenId?: string;
  exp?: number;
  isRememberMe?: boolean;
}

export interface RefreshToken extends RowDataPacket {
  id: number;
  token_id: string;
  user_id: number;
  created_at: Date;
  expires_at: Date;
  revoked: boolean;
  replaced_by?: string;
}

export class TokenManager {
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
} 