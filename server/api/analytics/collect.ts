import { createError, defineEventHandler, readBody } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Méthode non autorisée'
    });
  }

  try {
    const body = await readBody(event);

    console.log('Données analytics reçues:', body);

    // Vérifier que les données essentielles sont présentes
    if (!body.session_id) {
      throw createError({
        statusCode: 400,
        message: 'session_id est requis'
      });
    }

    // Insertion dans la base de données
    await pool.execute(
      `INSERT INTO analytics_data (
        user_id,
        session_id,
        page_url,
        page_title,
        visit_duration,
        device_type,
        browser,
        is_new_visitor,
        is_bounce,
        is_conversion,
        referrer_url,
        date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.user_id || 'anonymous',
        body.session_id,
        body.page_url || '',
        body.page_title || '',
        body.visit_duration || 0,
        body.device_type || 'unknown',
        body.browser || 'unknown',
        body.is_new_visitor ? 1 : 0,
        body.is_bounce ? 1 : 0,
        body.is_conversion ? 1 : 0,
        body.referrer_url || '',
        new Date().toISOString().split('T')[0]
      ]
    );

    return { success: true, message: 'Données analytics enregistrées avec succès' };
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement des données analytics:', error);
    return {
      statusCode: 500,
      message: 'Erreur lors de l\'enregistrement des données analytics',
      error: error.message
    };
  }
}); 