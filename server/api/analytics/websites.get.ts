import { defineEventHandler, getRequestHeaders } from 'h3';
import { pool } from '../db';
import { ServerTokenManager } from '../../utils/ServerTokenManager';

export default defineEventHandler(async (event) => {
  try {
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
      console.log('[API] Token invalide pour /api/sql/loadSQLSchemas');
      return {
        success: false,
        statusCode: 401,
        message: 'Token invalide ou expiré'
      };
    }

    const userId = decodedToken.userId;

    const [rows] = await pool.query(
      `SELECT 
        id, 
        tracking_id AS trackingId, 
        name, 
        url, 
        created_at AS createdAt 
       FROM analytics_websites 
       WHERE user_id = ? OR (user_id IS NULL AND ? = true)
       ORDER BY created_at DESC`,
      [userId, userId]
    );

    return {
      success: true,
      websites: rows
    };
  } catch (error) {
    console.error('Error fetching websites:', error);
    return {
      success: false,
      message: 'Error fetching websites',
      error: error.message
    };
  }
}); 