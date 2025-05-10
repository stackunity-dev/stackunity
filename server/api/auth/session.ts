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

    const [userRows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, username, email, isAdmin, isPremium, isStandard, 
        subscription_status, payment_status, trial_start_date, trial_end_date
       FROM users WHERE id = ?`,
      [decodedToken.userId]
    );

    if (userRows.length === 0) {
      return {
        success: false,
        message: 'Utilisateur introuvable'
      };
    }

    const user = userRows[0];

    const isPremiumValue = user.isPremium === 1 || user.isPremium === true;
    const isStandardValue = user.isStandard === 1 || user.isStandard === true;
    const isAdminValue = user.isAdmin === 1 || user.isAdmin === true;

    let daysLeft = 0;
    if (user.subscription_status === 'trial' && user.trial_end_date) {
      const now = new Date();
      const trialEndDate = new Date(user.trial_end_date);
      if (trialEndDate > now) {
        const diffTime = trialEndDate.getTime() - now.getTime();
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isStandard: isStandardValue,
        isAdmin: isAdminValue,
        subscription_status: user.subscription_status,
        payment_status: user.payment_status,
        trial_start_date: user.trial_start_date,
        trial_end_date: user.trial_end_date,
        daysLeft: daysLeft
      }
    };
  } catch (error) {
    console.error('[SESSION] Erreur:', error);
    return {
      success: false,
      message: 'Erreur lors de la validation de la session'
    };
  }
}); 