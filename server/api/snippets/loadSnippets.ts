import { createError, defineEventHandler, getRequestHeaders } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  // Si l'utilisateur est déjà authentifié via le middleware
  if (event.context.user) {
    const userId = event.context.user.userId;
    console.log('[API] Chargement des snippets pour l\'utilisateur (middleware):', userId);
    return await loadSnippetsForUser(userId);
  }

  // Tentative de récupération du token depuis l'en-tête
  const authHeader = getRequestHeaders(event).authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[API] Tentative d\'accès sans token à /api/snippets/loadSnippets');
    return {
      success: false,
      statusCode: 401,
      message: 'Authentification requise'
    };
  }

  // Extraire et vérifier le token
  const token = authHeader.substring(7);
  const decodedToken = ServerTokenManager.verifyAccessToken(token);
  if (!decodedToken) {
    console.log('[API] Token invalide pour /api/snippets/loadSnippets');
    return {
      success: false,
      statusCode: 401,
      message: 'Token invalide ou expiré'
    };
  }

  // Utiliser le token vérifié
  console.log('[API] Chargement des snippets pour l\'utilisateur (token):', decodedToken.userId);
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
    console.error('[API] Erreur lors du chargement des snippets:', err.stack);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des snippets'
    });
  }
}