import { defineEventHandler, getRequestHeaders, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

interface RegisterWebsiteRequest {
  name: string;
  url: string;
}

export default defineEventHandler(async (event) => {
  try {
    const { name, url } = await readBody<RegisterWebsiteRequest>(event);
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
        message: 'Unknown error'
      };
    }

    const userId = decodedToken.userId;

    if (!name || !url) {
      return {
        success: false,
        message: 'Le nom et l\'URL sont obligatoires'
      };
    }

    const [existingRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, tracking_id FROM analytics_websites WHERE url = ? AND (user_id = ? OR user_id IS NULL)',
      [url, userId]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      if (userId) {
        await pool.query(
          'UPDATE analytics_websites SET user_id = ? WHERE id = ? AND (user_id IS NULL OR user_id != ?)',
          [userId, existingRows[0].id, userId]
        );
      }

      return {
        success: true,
        websiteId: existingRows[0].tracking_id,
        message: 'Site existant récupéré avec succès',
        isExisting: true
      };
    }

    const trackingId = uuidv4();

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO analytics_websites (tracking_id, name, url, created_at, user_id) VALUES (?, ?, ?, NOW(), ?)',
      [trackingId, name, url, userId]
    );

    return {
      success: true,
      websiteId: trackingId,
      message: 'Site enregistré avec succès',
      isExisting: false
    };
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du site:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'enregistrement du site',
      error: error.message
    };
  }
}); 