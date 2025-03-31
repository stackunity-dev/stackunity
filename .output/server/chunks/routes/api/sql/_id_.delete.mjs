import { c as defineEventHandler, w as getRouterParam, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';

const _id__delete = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  const id = getRouterParam(event, "id");
  if (!id) {
    return {
      success: false,
      error: "ID manquant"
    };
  }
  try {
    const [schemas] = await pool.execute(
      "SELECT id FROM sql_schemas WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (!schemas.length) {
      return {
        success: false,
        error: "Sch\xE9ma non trouv\xE9 ou non autoris\xE9"
      };
    }
    await pool.execute(
      "DELETE FROM sql_schemas WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return {
      success: true
    };
  } catch (err) {
    console.error("Erreur lors de la suppression du sch\xE9ma SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
