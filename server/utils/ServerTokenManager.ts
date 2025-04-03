import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET
} from './auth-config';
import { TokenPayload } from './TokenManager';

export class ServerTokenManager {
  /**
   * Génère un token d'accès
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  /**
   * Génère un token de rafraîchissement
   */
  static generateRefreshToken(payload: { userId: number, tokenId: string }): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  /**
   * Vérifie un token d'accès
   */
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      console.log('[ServerTokenManager] Vérification du token:', token.substring(0, 20) + '...');
      const result = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
      console.log('[ServerTokenManager] Token décodé avec succès');
      return result;
    } catch (error) {
      console.error('[ServerTokenManager] Erreur de vérification du token:', error);
      return null;
    }
  }

  /**
   * Vérifie un token de rafraîchissement
   */
  static verifyRefreshToken(token: string): { userId: number, tokenId: string } | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: number, tokenId: string };
    } catch (error) {
      console.error('Erreur de vérification du token de rafraîchissement:', error);
      return null;
    }
  }
} 