import { createError, defineEventHandler } from "h3";
import { getUserId } from "../../utils/auth-utils";
import { pool } from "../db";


export default defineEventHandler(async (event) => {
  const userId = getUserId(event);

  try {
    await pool.query(
      'UPDATE users SET isPremium = 1, isBuying = 1 WHERE id = ?',
      [userId]
    );
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la base de données:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la mise à jour de la base de données'
    });
  }
});
