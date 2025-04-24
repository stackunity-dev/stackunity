import { defineEventHandler, getRequestHeaders } from 'h3';
import { RowDataPacket } from 'mysql2';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

interface UserRow extends RowDataPacket {
  id: number;
  created_at: Date;
  trial_start_date: Date;
  trial_end_date: Date;
  payment_status: string;
  subscription_status: string;
  isPremium: number;
  isStandard: number;
}

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeaders(event).authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      return {
        success: false,
        message: 'No token provided'
      };
    }

    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }

    const userId = decodedToken.userId;

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT id, created_at, trial_start_date, trial_end_date, payment_status, 
       subscription_status, isPremium, isStandard
       FROM users WHERE id = ?`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const user = rows[0];
    const now = new Date();

    if (user.trial_start_date && new Date(user.trial_start_date) > now) {
      const correctedStartDate = new Date(user.created_at || now);
      const correctedEndDate = new Date(correctedStartDate);
      correctedEndDate.setDate(correctedStartDate.getDate() + 7);

      await pool.execute(
        `UPDATE users SET 
         trial_start_date = ?,
         trial_end_date = ? 
         WHERE id = ?`,
        [correctedStartDate, correctedEndDate, userId]
      );

      user.trial_start_date = correctedStartDate;
      user.trial_end_date = correctedEndDate;
    }

    if (user.payment_status === 'paid') {
      return {
        success: true,
        isPremium: user.isPremium === 1,
        isStandard: user.isStandard === 1,
        subscription_status: user.subscription_status,
        message: 'Paid subscription active'
      };
    }

    if (user.subscription_status === 'trial') {
      const trialEndDate = new Date(user.trial_end_date);

      if (isNaN(trialEndDate.getTime())) {
        console.error(`Date de fin d'essai invalide pour l'utilisateur ${userId}`);

        const newEndDate = new Date(user.created_at || now);
        newEndDate.setDate(newEndDate.getDate() + 7);

        await pool.execute(
          `UPDATE users SET 
           trial_end_date = ? 
           WHERE id = ?`,
          [newEndDate, userId]
        );

        if (newEndDate > now) {
          const diffTime = newEndDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            success: true,
            isPremium: true,
            isStandard: false,
            subscription_status: 'trial',
            message: 'Trial in progress (corrected date)',
            daysLeft: diffDays
          };
        }
      }

      if (trialEndDate > now) {
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          success: true,
          isPremium: true,
          isStandard: false,
          subscription_status: 'trial',
          message: 'Trial in progress',
          daysLeft: diffDays
        };
      } else {
        await pool.execute(
          `UPDATE users 
           SET isPremium = 0, isStandard = 0, subscription_status = 'expired' 
           WHERE id = ? AND payment_status != 'paid'`,
          [userId]
        );

        return {
          success: true,
          isPremium: false,
          isStandard: false,
          subscription_status: 'expired',
          message: 'Trial ended'
        };
      }
    }

    return {
      success: true,
      isPremium: user.isPremium === 1,
      isStandard: user.isStandard === 1,
      subscription_status: user.subscription_status,
      message: `Current status: ${user.subscription_status}`
    };
  } catch (error) {
    console.error('Error checking trial:', error);
    return {
      success: false,
      message: 'Error checking subscription status'
    };
  }
}); 