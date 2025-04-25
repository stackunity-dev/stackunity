import { defineEventHandler, getRequestHeaders } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return {
        valid: false,
        message: 'Aucun token fourni'
      };
    }

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        valid: false,
        message: 'Token invalide ou expiré'
      };
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, isAdmin, isPremium, isStandard, subscription_status, payment_status FROM users WHERE id = ?',
      [decodedToken.userId]
    );

    if (rows.length === 0) {
      return {
        valid: false,
        message: 'Utilisateur introuvable'
      };
    }

    const user = rows[0];

    const isPremiumValue = user.isPremium === 1 || user.isPremium === true;
    const isStandardValue = user.isStandard === 1 || user.isStandard === true;
    const isAdminValue = user.isAdmin === 1 || user.isAdmin === true;

    return {
      valid: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isStandard: isStandardValue,
        isAdmin: isAdminValue,
        subscription_status: user.subscription_status,
        payment_status: user.payment_status
      }
    };
  } catch (error) {
    console.error('[VALIDATE] Erreur:', error);
    return {
      valid: false,
      message: 'Erreur lors de la validation du token'
    };
  }
}); 