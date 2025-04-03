import { pool } from '../db';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body);

  if (!body.id) {
    return {
      success: false,
      error: "ID du snippet manquant"
    };
  }

  try {
    if (body.type === 'world') {
      const [ownerCheck] = await pool.execute(
        'SELECT user_id FROM world_snippets WHERE id = ?',
        [body.id]
      );

      // @ts-ignore
      if (!ownerCheck.length || ownerCheck[0].user_id !== userId) {
        return {
          success: false,
          error: "Vous n'êtes pas autorisé à supprimer ce snippet"
        };
      }

      await pool.execute('DELETE FROM world_snippets WHERE id = ?', [body.id]);

      return {
        success: true,
        message: "Snippet mondial supprimé avec succès"
      };
    } else {
      const [result] = await pool.execute(
        'DELETE FROM personal_snippets WHERE id = ? AND user_id = ?',
        [body.id, body.userId]
      );

      // @ts-ignore
      if (result.affectedRows === 0) {
        return {
          success: false,
          error: "Snippet personnel non trouvé ou non autorisé"
        };
      }

      return {
        success: true,
        message: "Snippet personnel supprimé avec succès"
      };
    }
  }
  catch (err: any) {
    console.error("Erreur lors de la suppression du snippet:", err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});