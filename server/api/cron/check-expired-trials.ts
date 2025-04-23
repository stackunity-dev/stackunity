import { defineEventHandler } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../db';

interface UserRow extends RowDataPacket {
  id: number;
  trial_end_date: Date;
}

export default defineEventHandler(async (event) => {
  try {
    const authHeader = event.node.req.headers.authorization;
    const apiKey = process.env.CRON_API_KEY;

    if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
      console.warn('Unauthorized cron job attempt');
      return {
        success: false,
        message: 'Unauthorized'
      };
    }

    const now = new Date();

    const [users] = await pool.execute<UserRow[]>(
      `SELECT id, trial_end_date FROM users 
       WHERE subscription_status = 'trial' 
       AND payment_status != 'paid'
       AND trial_end_date < ?`,
      [now]
    );

    if (!users || users.length === 0) {
      return {
        success: true,
        message: 'No expired trials found',
        count: 0
      };
    }

    await pool.execute(
      `UPDATE users 
       SET isPremium = 0, isStandard = 0, subscription_status = 'expired' 
       WHERE subscription_status = 'trial' 
       AND payment_status != 'paid'
       AND trial_end_date < ?`,
      [now]
    );

    return {
      success: true,
      message: 'Expired trials processed',
      count: users.length
    };
  } catch (error) {
    console.error('Error checking expired trials:', error);
    return {
      success: false,
      message: 'Error checking expired trials'
    };
  }
}); 