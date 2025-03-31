import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const removeFavorite = defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;
  try {
    await pool.execute(
      "DELETE FROM favorites_snippets WHERE snippet_id = ? AND user_id = ?",
      [snippetId, userId]
    );
    return {
      success: true,
      message: "Favori supprim\xE9 avec succ\xE8s"
    };
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { removeFavorite as default };
//# sourceMappingURL=removeFavorite.mjs.map
