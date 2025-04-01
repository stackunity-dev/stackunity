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

    console.log(`[${new Date().toISOString()}] Tentative de rafraîchissement de token, cookie présent:`, !!refreshToken);

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
      console.log(`[${new Date().toISOString()}] Token de rafraîchissement décodé:`, decoded);

      if (!decoded.userId) {
        throw new Error('ID utilisateur manquant dans le token de rafraîchissement');
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Erreur lors du décodage du token de rafraîchissement:`, error);
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
      console.log(`[${new Date().toISOString()}] Token de rafraîchissement non trouvé ou révoqué pour l'utilisateur ${decoded.userId}`);
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
      console.log(`[${new Date().toISOString()}] Utilisateur ${decoded.userId} non trouvé dans la base de données`);
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const user = userRows[0] as any;
    console.log(`[${new Date().toISOString()}] Utilisateur trouvé:`, user);

    // Créer un nouveau token d'accès
    const accessTokenPayload = {
      userId: user.id,
      id: user.id, // Pour la compatibilité avec les anciens systèmes
      username: user.username,
      email: user.email,
      isPremium: user.isPremium === 1,
      isAdmin: user.isAdmin === 1
    };

    console.log(`[${new Date().toISOString()}] Payload du nouveau token d'accès:`, accessTokenPayload);

    const accessToken = jwt.sign(
      accessTokenPayload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Vérifier que le token est valide
    try {
      const verifiedToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
      console.log(`[${new Date().toISOString()}] Nouveau token d'accès vérifié:`, verifiedToken);

      if (!verifiedToken.userId) {
        throw new Error('ID utilisateur manquant dans le nouveau token d\'accès');
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Erreur lors de la vérification du nouveau token d'accès:`, error);
      return {
        success: false,
        error: 'Erreur lors de la génération du nouveau token'
      };
    }

    // Créer un nouveau token de rafraîchissement
    const newRefreshTokenId = uuidv4();
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: newRefreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Mettre à jour la base de données
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Révoquer l'ancien token de rafraîchissement
      await connection.execute(
        'UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE token_id = ?',
        [newRefreshTokenId, decoded.tokenId]
      );

      // Ajouter le nouveau token de rafraîchissement
      await connection.execute(
        'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
        [newRefreshTokenId, user.id]
      );

      await connection.commit();
      console.log(`[${new Date().toISOString()}] Transaction de mise à jour des tokens réussie`);
    } catch (error) {
      await connection.rollback();
      console.error(`[${new Date().toISOString()}] Erreur lors de la mise à jour des tokens:`, error);
      throw error;
    } finally {
      connection.release();
    }

    // Mettre à jour le cookie de rafraîchissement
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    console.log(`[${new Date().toISOString()}] Rafraîchissement de token réussi pour l'utilisateur ${user.id}`);

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
    console.error(`[${new Date().toISOString()}] Erreur lors du rafraîchissement du token:`, error);
    return {
      success: false,
      error: 'Erreur serveur lors du rafraîchissement du token'
    };
  }
}); 