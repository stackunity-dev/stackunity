import { pool } from '../db';
import { RowDataPacket } from 'mysql2/promise';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'UPDATE users SET isPremium = 1 WHERE id = ?',
      [userId]
    );

    if (rows.length > 0) {
      return {
        success: true,
        isPremium: rows[0].isPremium
      };
    } else {
      return {
        success: false,
        error: 'Premium status not found'
      };
    }

  } catch (error) {
    console.error('Error fetching premium status:', error);
    return {
      success: false,
      error: 'Error fetching premium status'
    };
  }
});
