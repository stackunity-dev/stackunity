import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRY_DEFAULT,
  ACCESS_TOKEN_EXPIRY_REMEMBER,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET
} from './auth-config';
import { TokenPayload } from './TokenManager';

export class ServerTokenManager {
  static generateAccessToken(payload: TokenPayload & { isRememberMe?: boolean }): string {
    const expiresIn = payload.isRememberMe ? ACCESS_TOKEN_EXPIRY_REMEMBER : ACCESS_TOKEN_EXPIRY_DEFAULT;

    const { isRememberMe, ...tokenPayload } = payload;

    return jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET as string, { expiresIn });
  }

  static generateRefreshToken(payload: { userId: number, tokenId: string }): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      const result = jwt.verify(token, ACCESS_TOKEN_SECRET as string) as TokenPayload;
      return result;
    } catch (error) {
      console.error('[ServerTokenManager] Erreur de vérification du token:', error);
      return null;
    }
  }


  static verifyRefreshToken(token: string): { userId: number, tokenId: string } | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET as string) as { userId: number, tokenId: string };
    } catch (error) {
      console.error('Erreur de vérification du token de rafraîchissement:', error);
      return null;
    }
  }
} 