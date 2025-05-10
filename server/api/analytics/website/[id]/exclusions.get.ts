import { defineEventHandler, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../../../db';

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');

    if (!websiteId) {
      return {
        success: false,
        message: 'ID du site non spécifié'
      };
    }

    // Vérifier que le site existe et obtenir son ID numérique
    const [siteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(siteRows) || siteRows.length === 0) {
      console.error('Site non trouvé:', websiteId);
      return {
        success: false,
        message: 'Site non trouvé'
      };
    }

    const dbWebsiteId = siteRows[0].id;
    console.log(`GET exclusions - Site trouvé: ${dbWebsiteId}, tracking_id: ${websiteId}`);

    // Récupérer les exclusions avec l'ID numérique
    const [exclusions] = await pool.query(
      `SELECT id, type, value, created_at 
       FROM analytics_exclusions 
       WHERE website_id = ? 
       ORDER BY created_at DESC`,
      [dbWebsiteId]
    );

    console.log(`Exclusions trouvées pour ${websiteId}:`, exclusions);

    return {
      success: true,
      data: exclusions
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des exclusions:', error);
    return {
      success: false,
      message: `Erreur serveur lors de la récupération des exclusions: ${error.message || 'erreur inconnue'}`
    };
  }
}); 