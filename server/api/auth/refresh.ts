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
      'SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }

    const user = userRows[0];

    const accessToken = ServerTokenManager.generateAccessToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium === 1,
      isAdmin: user.isAdmin === 1
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
        isAdmin: user.isAdmin === 1,
        isPremium: user.isPremium === 1
      }
    };
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return { success: false, error: 'Erreur interne du serveur' };
  }
}); 