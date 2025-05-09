import { defineEventHandler, readBody } from 'h3';
import { pool } from '../../db';

export default defineEventHandler(async (event) => {
  try {
    const { websiteId, name } = await readBody(event);

    if (!websiteId || !name) {
      return {
        success: false,
        message: 'ID du site et nouveau nom sont requis'
      };
    }

    await pool.query(
      'UPDATE analytics_websites SET name = ? WHERE tracking_id = ?',
      [name, websiteId]
    );

    return {
      success: true,
      message: 'Nom du site mis à jour avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour du nom du site:', error);
    return {
      success: false,
      message: 'Erreur lors de la mise à jour du nom du site',
      error: error.message
    };
  }
}); 