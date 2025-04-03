import { createError, defineEventHandler } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user?.id || event.context.user?.userId;
    console.log('[STUDIO API] userId from token:', userId);

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: 'Non authentifié'
      });
    }

    const [components] = await pool.execute('SELECT * FROM studio_components WHERE user_id = ?', [userId]);
    console.log('[STUDIO API] Components found:', components);

    return {
      success: true,
      components
    };
  } catch (error) {
    console.error('[STUDIO API] Erreur lors de la récupération des composants:', error);

    if (error.statusCode) {
      throw error;
    }

    return {
      success: false,
      error: 'Erreur lors de la récupération des composants'
    };
  }
});

