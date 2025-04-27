import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';
import { createError, defineEventHandler, getRequestHeaders } from 'h3';

export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event);

  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Missing or invalid authorization header'
    });
  }

  const token = authHeader.substring(7);

  if (!event.context.user) {
    try {
      const decodedToken = ServerTokenManager.verifyAccessToken(token);
      if (decodedToken) {
        event.context.user = decodedToken;
      }
    } catch (tokenError) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      });
    }
  }

  if (!event.context.user) {
    console.error('[STUDIO API] Contexte utilisateur toujours manquant après tentative de décodage');
    throw createError({
      statusCode: 401,
      message: 'Session utilisateur non trouvée'
    });
  }

  const userId = event.context.user.id || event.context.user.userId;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: 'ID utilisateur non trouvé dans la session'
    });
  }

  try {
    const result = await pool.execute('SELECT * FROM website_data WHERE user_id = ?', [userId]);
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des données du site web'
    });
  }
});

