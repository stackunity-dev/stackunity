import { pool } from "../db";

export default defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM newsletters_emails');
    return { success: true, data: rows };
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'historique des emails:', error);
    return { success: false, error: 'Erreur lors de la récupération de l\'historique des emails' };
  }
});

