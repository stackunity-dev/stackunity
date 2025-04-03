import { defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'en-tête d'autorisation
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    console.log('[API VALIDATE] Validation du token:', token ? 'Présent' : 'Absent');

    if (!token) {
      return {
        valid: false,
        message: 'Aucun token fourni'
      };
    }

    // Vérifier le token
    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        valid: false,
        message: 'Token invalide ou expiré'
      };
    }

    // Log détaillé des valeurs dans le token
    console.log('[API VALIDATE] Valeurs dans le token:', {
      isPremium: decodedToken.isPremium,
      isAdmin: decodedToken.isAdmin,
      types: {
        isPremium: typeof decodedToken.isPremium,
        isAdmin: typeof decodedToken.isAdmin
      }
    });

    // Convertir d'abord en nombre puis en booléen
    const isPremiumValue = Number(decodedToken.isPremium) === 1;
    const isAdminValue = Number(decodedToken.isAdmin) === 1;

    console.log('[API VALIDATE] Valeurs après conversion:', {
      isPremium: isPremiumValue,
      isAdmin: isAdminValue,
      originalValues: {
        isPremium: decodedToken.isPremium,
        isAdmin: decodedToken.isAdmin
      }
    });

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