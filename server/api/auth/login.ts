import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  isStandard: number;
  isPremium: number;
  isAdmin: number;
  trial_start_date: Date;
  trial_end_date: Date;
  subscription_status: string;
  payment_status: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.email || !body.password) {
      return {
        success: false,
        message: 'Email and password required'
      };
    }

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT id, username, email, password, created_at, isStandard, isPremium, isAdmin,
       trial_start_date, trial_end_date, subscription_status, payment_status
       FROM users WHERE email = ?`,
      [body.email]
    );

    if (!rows || rows.length === 0) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    try {
      const now = new Date();
      let isPremiumValue = user.isPremium === 1;
      let isStandardValue = user.isStandard === 1;
      let subscriptionStatus = user.subscription_status;

      if (user.trial_start_date && new Date(user.trial_start_date) > now) {
        const correctedStartDate = new Date(user.created_at || now);
        const correctedEndDate = new Date(correctedStartDate);
        correctedEndDate.setDate(correctedStartDate.getDate() + 7);

        await pool.execute(
          `UPDATE users SET 
           trial_start_date = ?,
           trial_end_date = ? 
           WHERE id = ?`,
          [correctedStartDate, correctedEndDate, user.id]
        );

        user.trial_start_date = correctedStartDate;
        user.trial_end_date = correctedEndDate;
      }

      if (user.payment_status !== 'paid' && user.subscription_status === 'trial') {
        let trialEndDate = new Date(user.trial_end_date);

        if (isNaN(trialEndDate.getTime())) {
          const newEndDate = new Date(user.created_at || now);
          newEndDate.setDate(newEndDate.getDate() + 7);

          await pool.execute(
            `UPDATE users SET trial_end_date = ? WHERE id = ?`,
            [newEndDate, user.id]
          );

          trialEndDate = newEndDate;
        }

        if (trialEndDate < now) {
          await pool.execute(
            `UPDATE users 
             SET isPremium = 0, isStandard = 0, subscription_status = 'expired' 
             WHERE id = ? AND payment_status != 'paid'`,
            [user.id]
          );

          isPremiumValue = false;
          isStandardValue = false;
          subscriptionStatus = 'expired';
        } else {
          isPremiumValue = true;
          subscriptionStatus = 'trial';
        }
      }

      const isAdminValue = user.isAdmin === 1;

      const accessToken = ServerTokenManager.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isStandard: isStandardValue,
        isAdmin: isAdminValue,
        isRememberMe: body.rememberMe || false
      });

      const userData: {
        id: number;
        username: string;
        email: string;
        isPremium: boolean;
        isStandard: boolean;
        isAdmin: boolean;
        subscription_status: string;
        payment_status: string;
        isRememberMe: boolean;
        daysLeft?: number;
      } = {
        id: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isStandard: isStandardValue,
        isAdmin: isAdminValue,
        subscription_status: subscriptionStatus,
        payment_status: user.payment_status,
        isRememberMe: body.rememberMe || false
      };

      if (subscriptionStatus === 'trial') {
        const trialEndDate = new Date(user.trial_end_date);
        const diffTime = trialEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        userData.daysLeft = diffDays > 0 ? diffDays : 0;
      }

      return {
        success: true,
        user: userData,
        accessToken
      };
    } catch (tokenError) {
      console.error('[LOGIN] Error generating token:', tokenError);
      throw new Error('Error generating token');
    }
  } catch (error) {
    console.error('[LOGIN] Detailed error:', error);
    if (error instanceof Error) {
      console.error('[LOGIN] Stack trace:', error.stack);
    }
    return {
      success: false,
      message: 'Error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
});