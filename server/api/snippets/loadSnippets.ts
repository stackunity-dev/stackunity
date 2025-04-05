import { createError, defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  if (event.context.user) {
    const userId = event.context.user.userId;
    return await loadSnippetsForUser(userId);
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
    return {
      success: false,
      statusCode: 401,
      message: 'Token invalide ou expiré'
    };
  }

  return await loadSnippetsForUser(decodedToken.userId);
});

async function loadSnippetsForUser(userId: number) {
  try {
    const [personalSnippetsRows] = await pool.execute('SELECT * FROM personal_snippets WHERE user_id = ?', [userId]);
    const [worldSnippetsRows] = await pool.execute('SELECT * FROM world_snippets');
    const [favoritesRows] = await pool.execute('SELECT * FROM favorites_snippets WHERE user_id = ?', [userId]);

    return {
      success: true,
      data: {
        personalSnippets: personalSnippetsRows,
        worldSnippets: worldSnippetsRows,
        favoritesSnippets: favoritesRows
      }
    };
  }
  catch (err: any) {
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des snippets'
    });
  }
}