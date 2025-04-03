import { defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return {
        valid: false,
        message: 'Token manquant'
      };
    }

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        valid: false,
        message: 'Token invalide'
      };
    }

    return {
      valid: true,
      exp: decodedToken.exp,
      userId: decodedToken.userId
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    return {
      valid: false,
      message: 'Erreur lors de la vérification'
    };
  }
}); 