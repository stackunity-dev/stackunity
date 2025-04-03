import { defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    console.log('[API SESSION] Tentative d\'accès avec token:', token ? 'Présent' : 'Absent');

    if (!token) {
      return {
        valid: false,
        message: 'Aucun token fourni'
      };
    }

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        valid: false,
        message: 'Token invalide ou expiré'
      };
    }

    return {
      valid: true,
      user: {
        userId: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
        isPremium: decodedToken.isPremium,
        isAdmin: decodedToken.isAdmin
      }
    };
  } catch (error) {
    console.error('[API SESSION] Erreur:', error);
    return {
      valid: false,
      message: 'Erreur lors de la validation de la session'
    };
  }
}); 