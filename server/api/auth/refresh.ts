import { defineEventHandler, getCookie, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  RefreshTokenPayload
} from '../../utils/auth-config';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer le token de rafraîchissement depuis le cookie
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);

    if (!refreshToken) {
      return {
        success: false,
        error: 'Token de rafraîchissement manquant'
      };
    }

    // Vérifier et décoder le token de rafraîchissement
    let decoded: RefreshTokenPayload;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch (error) {
      return {
        success: false,
        error: 'Token de rafraîchissement invalide'
      };
    }

    // Vérifier si le token existe dans la base de données et n'est pas révoqué
    const [tokenRows] = await pool.execute(
      'SELECT * FROM refresh_tokens WHERE token_id = ? AND user_id = ? AND revoked = 0 AND expires_at > NOW()',
      [decoded.tokenId, decoded.userId]
    );

    if (!Array.isArray(tokenRows) || tokenRows.length === 0) {
      return {
        success: false,
        error: 'Token de rafraîchissement révoqué ou expiré'
      };
    }

    // Récupérer les informations de l'utilisateur
    const [userRows] = await pool.execute(
      'SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!Array.isArray(userRows) || userRows.length === 0) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const user = userRows[0] as any;

    // Générer un nouveau token d'accès
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium === 1,
        isAdmin: user.isAdmin === 1
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Rotation du token de rafraîchissement : invalider l'ancien et en créer un nouveau
    const newRefreshTokenId = uuidv4();
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: newRefreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Mise à jour dans la base de données (transaction)
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Révoquer l'ancien token
      await connection.execute(
        'UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE token_id = ?',
        [newRefreshTokenId, decoded.tokenId]
      );

      // Ajouter le nouveau token
      await connection.execute(
        'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [newRefreshTokenId, user.id]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    // Mettre à jour le cookie avec le nouveau token de rafraîchissement
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
  } catch (error: any) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return {
      success: false,
      error: 'Erreur serveur lors du rafraîchissement du token'
    };
  }
}); 