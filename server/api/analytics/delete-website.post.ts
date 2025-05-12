import { defineEventHandler, getRequestHeaders, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

interface DeleteWebsiteRequest {
  websiteId: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { websiteId } = await readBody<DeleteWebsiteRequest>(event);
    const authHeader = getRequestHeaders(event).authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        statusCode: 401,
        message: 'Authentification requise'
      };
    }

    const token = authHeader.substring(7);
    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    if (!decodedToken) {
      return {
        success: false,
        statusCode: 403,
        message: 'Token invalide ou expiré'
      };
    }

    const userId = decodedToken.userId;

    if (!websiteId) {
      return {
        success: false,
        message: 'ID du site web requis'
      };
    }

    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, tracking_id, user_id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (Array.isArray(websiteRows) && websiteRows.length === 0) {
      return {
        success: false,
        message: 'Site web non trouvé'
      };
    }

    const site = websiteRows[0];

    if (site.user_id !== userId && !decodedToken.isAdmin) {
      return {
        success: false,
        statusCode: 403,
        message: 'Vous n\'êtes pas autorisé à supprimer ce site'
      };
    }

    const siteId = site.id;
    const trackingId = site.tracking_id;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();


      await connection.execute(
        'DELETE FROM analytics_interactions WHERE website_id = ?',
        [siteId]
      );

      await connection.execute(
        'DELETE FROM analytics_errors WHERE website_id = ?',
        [siteId]
      );

      await connection.execute(
        'DELETE FROM analytics_custom_events WHERE website_id = ?',
        [siteId]
      );

      const [sessionRows] = await connection.query<RowDataPacket[]>(
        'SELECT visitor_id FROM analytics_sessions WHERE website_id = ?',
        [siteId]
      );

      const visitorIds = sessionRows.map(row => row.visitor_id);

      await connection.execute(
        'DELETE FROM analytics_pageviews WHERE website_id = ?',
        [siteId]
      );

      await connection.execute(
        'DELETE FROM analytics_sessions WHERE website_id = ?',
        [siteId]
      );

      if (visitorIds.length > 0) {
        await connection.execute(`
          DELETE v FROM analytics_visitors v
          LEFT JOIN analytics_sessions s ON v.visitor_id = s.visitor_id
          WHERE v.visitor_id IN (?) AND s.visitor_id IS NULL
        `, [visitorIds]);
      }

      const [result] = await connection.execute<ResultSetHeader>(
        'DELETE FROM analytics_websites WHERE id = ?',
        [siteId]
      );

      await connection.commit();

      if (result.affectedRows === 0) {
        return {
          success: false,
          message: 'Échec de la suppression du site'
        };
      }

      return {
        success: true,
        message: 'Site supprimé avec succès'
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du site:', error);
    return {
      success: false,
      message: 'Erreur lors de la suppression du site',
      error: error.message
    };
  }
}); 