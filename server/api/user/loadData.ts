import { defineEventHandler } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {

  const userId = event.context.user?.id;

  if (userId === undefined) {
    console.error('Erreur: userId est undefined dans loadData.ts');

    return {
      success: false,
      error: 'Utilisateur non authentifié ou session expirée'
    };
  }

  try {

    const [userRows] = await pool.execute('SELECT id, username, email, isAdmin, isPremium, isStandard, isBuying FROM users WHERE id = ?', [userId]);

    return {
      success: true,
      data: {
        userData: userRows
      }
    }
  }
  catch (err: any) {
    console.error("Erreur lors du chargement des données :", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors du chargement des données"
    };
  }
});