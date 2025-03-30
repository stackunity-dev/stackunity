import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;
  try {
    const insertFavorite = await pool.execute('INSERT INTO favorites_snippets (snippet_id, user_id) VALUES (?, ?)', [snippetId, userId]);
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    }
  }
})