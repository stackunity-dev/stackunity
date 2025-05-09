import { createError, defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    const userId = event.context.user.userId;
    return await loadSQLSchemasForUser(userId);
  }

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

  return await loadSQLSchemasForUser(decodedToken.userId);
});

async function loadSQLSchemasForUser(userId: number) {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sql_schemas WHERE user_id = ?',
      [userId]
    );

    return {
      success: true,
      schemas: rows
    };
  }
  catch (err: any) {
    console.error('[API] Erreur lors du chargement des schémas SQL:', err.stack);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des schémas SQL'
    });
  }
}
