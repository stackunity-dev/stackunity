import { defineEventHandler, deleteCookie, getCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_SECRET, RefreshTokenPayload } from '../../utils/auth-config';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le token de rafraîchissement depuis le cookie
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);

    // Si le token existe, on le révoque dans la base de données
    if (refreshToken) {
      try {
        // Décoder le token pour obtenir l'ID
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;

        // Révoquer le token dans la base de données
        await pool.execute(
          'UPDATE refresh_tokens SET revoked = 1 WHERE token_id = ? AND user_id = ?',
          [decoded.tokenId, decoded.userId]
        );
      } catch (error) {
        console.warn('Impossible de décoder le token de rafraîchissement lors de la déconnexion:', error);
      }
    }

    // Supprimer le cookie dans tous les cas
    deleteCookie(event, REFRESH_TOKEN_COOKIE_NAME);

    return {
      success: true
    };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return {
      success: false,
      error: 'Erreur serveur lors de la déconnexion'
    };
  }
}); 