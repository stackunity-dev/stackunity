import { defineEventHandler, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;
  console.log('Mise à jour premium pour userId:', userId);

  if (!userId) {
    return {
      success: false,
      error: 'User not authenticated'
    };
  }

  try {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET isPremium = 1 WHERE id = ?',
      [userId]
    );

    console.log('Résultat UPDATE:', result);

    if (result.affectedRows > 0) {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        'SELECT isPremium FROM users WHERE id = ?',
        [userId]
      );

      return {
        success: true,
        isPremium: userRows[0]?.isPremium || true
      };
    } else {
      return {
        success: false,
        error: 'Aucun utilisateur mis à jour'
      };
    }

  } catch (error) {
    console.error('Error updating premium status:', error);
    return {
      success: false,
      error: 'Error updating premium status'
    };
  }
});
