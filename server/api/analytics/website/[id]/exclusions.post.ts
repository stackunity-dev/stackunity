import { createError, defineEventHandler, getRouterParam, readBody } from 'h3';
import { pool } from '../../../db';

interface Exclusion {
  type: 'ip' | 'user';
  value: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const { exclusions } = await readBody(event) as { exclusions: Exclusion[] };
    console.log(exclusions, websiteId);

    if (!websiteId) {
      return {
        success: false,
        message: 'ID du site non spécifié'
      };
    }

    if (!Array.isArray(exclusions)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format invalide: "exclusions" doit être un tableau'
      });
    }

    const site = await pool.query('SELECT tracking_id FROM analytics_websites WHERE tracking_id = ?', [websiteId]);
    if (!site) {
      return {
        success: false,
        message: 'Site non trouvé'
      };
    }

    await pool.query('START TRANSACTION');

    try {
      await pool.query('DELETE FROM analytics_exclusions WHERE website_id = ?', [websiteId]);

      for (const exclusion of exclusions) {
        if (!['ip', 'user'].includes(exclusion.type) || !exclusion.value) {
          continue;
        }

        await pool.query(
          'INSERT INTO analytics_exclusions (website_id, type, value) VALUES (?, ?, ?)',
          [websiteId, exclusion.type, exclusion.value]
        );
      }

      await pool.query('COMMIT');

      return {
        success: true,
        message: 'Exclusions mises à jour avec succès'
      };
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des exclusions:', error);
    return {
      success: false,
      message: 'Erreur serveur lors de la mise à jour des exclusions'
    };
  }
}); 