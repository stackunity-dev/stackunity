import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;

  try {
    const result = await pool.execute(
      'SELECT * FROM sql_schemas WHERE user_id = ?',
      [userId]
    );

    return {
      success: true,
      schemas: result[0]
    }
  }
  catch (err: any) {
    console.error('Erreur lors du chargement des schémas SQL:', err.stack);
    return {
      success: false,
      error: err.message,
    };
  }
})
