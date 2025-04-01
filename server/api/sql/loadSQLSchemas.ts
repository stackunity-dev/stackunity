import { createError, defineEventHandler } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Utilisateur non authentifié'
    });
  }

  const userId = event.context.user.id;
  console.log('Chargement des schémas SQL pour l\'utilisateur:', userId);

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sql_schemas WHERE user_id = ?',
      [userId]
    );

    return {
      success: true,
      schemas: rows
    };
  }
  catch (err: any) {
    console.error('Erreur lors du chargement des schémas SQL:', err.stack);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des schémas SQL'
    });
  }
});
