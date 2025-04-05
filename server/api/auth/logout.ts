import { defineEventHandler, deleteCookie, getCookie } from 'h3';
import { TokenManager } from '../../utils/TokenManager';
import { TokenService } from '../../utils/TokenService';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../utils/auth-config';

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);

    if (refreshToken) {
      const decodedRefreshToken = TokenManager.verifyRefreshToken(refreshToken);

      if (decodedRefreshToken) {
        await TokenService.revokeRefreshToken(decodedRefreshToken.tokenId);
      }

      deleteCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    }

    return { success: true, message: 'Déconnexion réussie' };
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return { success: false, error: 'Erreur lors de la déconnexion' };
  }
}); 