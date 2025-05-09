import { defineEventHandler, getRouterParam } from 'h3';
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

    const [exclusions] = await pool.query(
      `SELECT id, type, value, created_at 
       FROM analytics_exclusions 
       WHERE website_id = ? 
       ORDER BY created_at DESC`,
      [websiteId]
    );

    return {
      success: true,
      data: exclusions
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des exclusions:', error);
    return {
      success: false,
      message: 'Erreur serveur lors de la récupération des exclusions'
    };
  }
}); 