import { defineEventHandler, getRequestHeaders } from 'h3';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../utils/auth-config';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer l'en-tête d'autorisation
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    console.log('[DEBUG TOKEN] Token reçu:', token ? 'Présent' : 'Absent');

    if (!token) {
      return {
        success: false,
        message: 'Aucun token fourni'
      };
    }

    // Décodage simple sans vérification de signature
    const decodedWithoutVerify = jwt.decode(token);
    console.log('[DEBUG TOKEN] Décodage sans vérification:', decodedWithoutVerify);

    // Vérifier le token avec la vérification complète
    try {
      const decodedWithVerify = jwt.verify(token, ACCESS_TOKEN_SECRET);
      console.log('[DEBUG TOKEN] Décodage avec vérification:', decodedWithVerify);

      // Comparer les valeurs
      return {
        success: true,
        tokenContent: {
          decoded: decodedWithoutVerify,
          verified: decodedWithVerify,
          isPremiumType: typeof (decodedWithVerify as any).isPremium,
          isAdminType: typeof (decodedWithVerify as any).isAdmin,
          isPremiumValue: (decodedWithVerify as any).isPremium,
          isAdminValue: (decodedWithVerify as any).isAdmin
        }
      };
    } catch (verifyError) {
      console.error('[DEBUG TOKEN] Erreur de vérification:', verifyError);
      return {
        success: false,
        error: 'Token invalide ou expiré',
        tokenContent: decodedWithoutVerify
      };
    }
  } catch (error) {
    console.error('[DEBUG TOKEN] Erreur:', error);
    return {
      success: false,
      message: 'Erreur lors du débogage du token'
    };
  }
}); 