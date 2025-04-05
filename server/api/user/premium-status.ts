import { defineEventHandler, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) {
    console.error('Erreur: userId manquant dans la requête premium-status');
    return {
      success: false,
      error: 'User not authenticated'
    };
  }

  try {
    const [updateResult] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET isPremium = 1 WHERE id = ?',
      [userId]
    );


    if (updateResult.affectedRows > 0) {
      const [userRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id, username, email, isPremium, isAdmin FROM users WHERE id = ?',
        [userId]
      );

      if (userRows.length > 0) {
        return {
          success: true,
          isPremium: true,
          user: {
            id: userRows[0].id,
            username: userRows[0].username,
            email: userRows[0].email,
            isPremium: true,
            isAdmin: userRows[0].isAdmin === 1
          }
        };
      } else {
        console.error('Utilisateur introuvable après mise à jour:', userId);
        return {
          success: false,
          error: 'User not found after update'
        };
      }
    } else {
      console.error('Aucune ligne affectée pour userId:', userId);
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
