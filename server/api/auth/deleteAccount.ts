import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const userId = event.context.user.id;

  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return { success: false, error: 'Erreur lors de la suppression du compte' };
  }
});
