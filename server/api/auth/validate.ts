import { defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;


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

    const isPremiumValue = Number(decodedToken.isPremium) === 1;
    const isAdminValue = Number(decodedToken.isAdmin) === 1;

    return {
      valid: true,
      user: {
        userId: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue
      },
      exp: decodedToken.exp
    };
  } catch (error) {
    console.error('[API VALIDATE] Erreur:', error);
    return {
      valid: false,
      message: 'Erreur lors de la validation du token'
    };
  }
}); 