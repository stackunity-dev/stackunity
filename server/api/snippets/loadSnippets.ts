import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;

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
    }
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    }
  }
})