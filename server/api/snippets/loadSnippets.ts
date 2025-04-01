import { createError, defineEventHandler } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: 'Utilisateur non authentifié'
    });
  }

  const userId = event.context.user.id;
  console.log('Chargement des snippets pour l\'utilisateur:', userId);

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
    console.error('Erreur lors du chargement des snippets:', err.stack);
    throw createError({
      statusCode: 500,
      message: 'Erreur lors du chargement des snippets'
    });
  }
});