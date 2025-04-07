import { defineEventHandler, getRequestHeaders } from 'h3';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../../utils/auth-config';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;


    if (!token) {
      return {
        success: false,
        message: 'Aucun token fourni'
      };
    }

    const decodedWithoutVerify = jwt.decode(token);

    try {
      const decodedWithVerify = jwt.verify(token, ACCESS_TOKEN_SECRET);

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