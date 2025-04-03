import { defineEventHandler, getRequestHeaders } from 'h3';
import { TokenManager } from '../../utils/TokenManager';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'en-tête d'autorisation
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    console.log('[API CHECK] Vérification du token:', token ? 'Présent' : 'Absent');

    if (!token) {
      return {
        authenticated: false,
        message: 'Aucun token fourni'
      };
    }

    // Vérifier le token
    const decodedToken = TokenManager.verifyAccessToken(token);

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