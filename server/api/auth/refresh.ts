import { defineEventHandler, getCookie, setCookie } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { TokenService } from '../../utils/TokenService';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS
} from '../../utils/auth-config';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshToken) {
      return { success: false, error: 'Aucun token de rafraîchissement trouvé' };
    }

    const decodedRefreshToken = ServerTokenManager.verifyRefreshToken(refreshToken);

    if (!decodedRefreshToken) {
      return { success: false, error: 'Token de rafraîchissement invalide' };
    }

    const { userId, tokenId } = decodedRefreshToken;

    const isValid = await TokenService.verifyRefreshTokenInDb(tokenId, userId);

    if (!isValid) {
      return { success: false, error: 'Token de rafraîchissement révoqué ou expiré' };
    }

    const [userRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, isAdmin, isPremium, isStandard, subscription_status, payment_status FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    const user = userRows[0];

    const isPremiumValue = user.isPremium === 1 || user.isPremium === true;
    const isStandardValue = user.isStandard === 1 || user.isStandard === true;
    const isAdminValue = user.isAdmin === 1 || user.isAdmin === true;

    console.log(`[REFRESH] Utilisateur ${userId} - isPremium: ${user.isPremium} (${typeof user.isPremium}), isStandard: ${user.isStandard} (${typeof user.isStandard})`);
    console.log(`[REFRESH] Valeurs converties - isPremium: ${isPremiumValue}, isStandard: ${isStandardValue}`);

    const accessToken = ServerTokenManager.generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      isPremium: isPremiumValue,
      isStandard: isStandardValue,
      isAdmin: isAdminValue
    });

    const newRefreshTokenId = uuidv4();
    const newRefreshToken = ServerTokenManager.generateRefreshToken({
      userId: user.id,
      tokenId: newRefreshTokenId
    });

    await TokenService.rotateRefreshToken(tokenId, newRefreshTokenId);
    await TokenService.saveRefreshToken(newRefreshTokenId, user.id);

    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: isAdminValue,
        isPremium: isPremiumValue,
        isStandard: isStandardValue,
        subscription_status: user.subscription_status,
        payment_status: user.payment_status
      }
    };
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return { success: false, error: 'Erreur interne du serveur' };
  }
}); 