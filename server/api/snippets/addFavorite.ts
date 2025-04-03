import { pool } from '../db';
import { readBody, defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { snippetId, userId } = await readBody(event);
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