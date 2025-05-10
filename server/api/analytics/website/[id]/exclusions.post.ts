import { createError, defineEventHandler, getRouterParam, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

interface Exclusion {
  type: 'ip' | 'user';
  value: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const { exclusions } = await readBody(event) as { exclusions: Exclusion[] };
    console.log('Mise à jour des exclusions:', exclusions, 'pour le site ID:', websiteId);

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

    // Vérifier que le site existe
    const [siteRows] = await pool.query<RowDataPacket[]>('SELECT id FROM analytics_websites WHERE tracking_id = ?', [websiteId]);

    if (!Array.isArray(siteRows) || siteRows.length === 0) {
      console.error('Site non trouvé:', websiteId);
      return {
        success: false,
        message: 'Site non trouvé'
      };
    }

    const dbWebsiteId = siteRows[0].id;
    console.log(`Site trouvé avec ID DB: ${dbWebsiteId}, tracking_id: ${websiteId}`);

    await pool.query('START TRANSACTION');

    try {
      // Vérifier les exclusions existantes
      const [existingExclusions] = await pool.query('SELECT type, value FROM analytics_exclusions WHERE website_id = ?', [dbWebsiteId]);
      console.log('Exclusions existantes:', existingExclusions);

      // Supprimer toutes les exclusions existantes
      const [deleteResult] = await pool.query('DELETE FROM analytics_exclusions WHERE website_id = ?', [dbWebsiteId]);
      console.log('Suppression des anciennes exclusions:', deleteResult);

      // Insérer les nouvelles exclusions
      let insertCount = 0;
      for (const exclusion of exclusions) {
        if (!['ip', 'user'].includes(exclusion.type) || !exclusion.value) {
          console.warn('Exclusion invalide ignorée:', exclusion);
          continue;
        }

        const [insertResult] = await pool.query(
          'INSERT INTO analytics_exclusions (website_id, type, value) VALUES (?, ?, ?)',
          [dbWebsiteId, exclusion.type, exclusion.value]
        );

        console.log('Insertion de l\'exclusion:', {
          type: exclusion.type,
          value: exclusion.value,
          result: insertResult
        });

        insertCount++;
      }

      await pool.query('COMMIT');
      console.log(`Mise à jour des exclusions réussie: ${insertCount} exclusions insérées`);

      return {
        success: true,
        message: `Exclusions mises à jour avec succès (${insertCount} exclusions)`,
        count: insertCount
      };
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Erreur transaction exclusions, rollback effectué:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des exclusions:', error);
    return {
      success: false,
      message: `Erreur serveur lors de la mise à jour des exclusions: ${error.message || 'erreur inconnue'}`
    };
  }
}); 