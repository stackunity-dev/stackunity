import { createError, defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const headers = getRequestHeaders(event);

    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[STUDIO API] Header d\'authorization manquant ou invalide');
      throw createError({
        statusCode: 401,
        message: 'Header d\'authorization manquant ou invalide'
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
        console.error('[STUDIO API] Erreur lors du décodage du token:', tokenError);
        throw createError({
          statusCode: 401,
          message: 'Token invalide ou expiré'
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
      console.error('[STUDIO API] ID utilisateur non trouvé dans le contexte:', JSON.stringify(event.context.user));
      throw createError({
        statusCode: 401,
        message: 'ID utilisateur non trouvé dans la session'
      });
    }

    const [components] = await pool.execute('SELECT * FROM studio_components WHERE user_id = ?', [userId]);
    const componentCount = Array.isArray(components) ? components.length : 0;

    return {
      success: true,
      components,
      userId: userId
    };
  } catch (error) {
    console.error('[STUDIO API] Erreur lors de la récupération des composants:', error);

    if (error.statusCode) {
      throw error;
    }

    return {
      success: false,
      error: error.message || 'Erreur lors de la récupération des composants'
    };
  }
});

