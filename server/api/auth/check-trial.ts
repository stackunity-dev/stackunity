import { defineEventHandler, getRequestHeaders } from 'h3';
import { RowDataPacket } from 'mysql2';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

interface UserRow extends RowDataPacket {
  id: number;
  created_at: Date;
  isBuying: number;
  isPremium: number;
}

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

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        success: false,
        message: 'Token invalide ou expiré'
      };
    }

    const userId = decodedToken.userId;

    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, created_at, isBuying, isPremium FROM users WHERE id = ?',
      [userId]
    );

    if (!rows || rows.length === 0) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    const user = rows[0];

    // Si l'utilisateur a déjà payé, on ne fait rien
    if (user.isBuying === 1) {
      return {
        success: true,
        isPremium: true,
        message: 'Utilisateur premium payant'
      };
    }

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si la période d'essai est terminée
    if (diffDays > 7) {
      // On retire les privilèges premium
      await pool.execute(
        'UPDATE users SET isPremium = 0 WHERE id = ? AND isBuying = 0',
        [userId]
      );

      return {
        success: true,
        isPremium: false,
        message: 'Période d\'essai terminée'
      };
    }

    return {
      success: true,
      isPremium: true,
      message: 'Période d\'essai en cours',
      daysLeft: 7 - diffDays
    };
  } catch (error) {
    console.error('[CHECK-TRIAL] Erreur:', error);
    return {
      success: false,
      message: 'Erreur lors de la vérification de la période d\'essai'
    };
  }
}); 