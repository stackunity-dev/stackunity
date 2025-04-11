import { defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;


    if (!token) {
      return {
        authenticated: false,
        message: 'Aucun token fourni'
      };
    }

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        authenticated: false,
        message: 'Token invalide ou expiré'
      };
    }

    return {
      authenticated: true,
      user: {
        userId: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
        isPremium: decodedToken.isPremium,
        isAdmin: decodedToken.isAdmin
      }
    };
  } catch (error) {
    console.error('[API CHECK] Erreur:', error);
    return {
      authenticated: false,
      message: 'Erreur lors de la vérification de l\'authentification'
    };
  }
}); 