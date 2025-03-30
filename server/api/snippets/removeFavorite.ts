import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;

  try {
    await pool.execute(
      'DELETE FROM favorites_snippets WHERE snippet_id = ? AND user_id = ?',
      [snippetId, userId]
    );

    return {
      success: true,
      message: 'Favori supprimé avec succès'
    };
  }
  catch (err: any) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
}); 