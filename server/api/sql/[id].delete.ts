import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return {
      success: false,
      error: 'ID manquant'
    };
  }

  try {
    const [schemas] = await pool.execute(
      'SELECT id FROM sql_schemas WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // @ts-ignore
    if (!schemas.length) {
      return {
        success: false,
        error: 'Schéma non trouvé ou non autorisé'
      };
    }

    await pool.execute(
      'DELETE FROM sql_schemas WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return {
      success: true
    };
  }
  catch (err: any) {
    console.error('Erreur lors de la suppression du schéma SQL:', err.stack);
    return {
      success: false,
      error: err.message
    };
  }
}); 