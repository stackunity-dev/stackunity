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

const addFavorite = defineEventHandler(async (event) => {
  const { snippetId } = await readBody(event);
  const userId = event.context.user.id;
  try {
    const insertFavorite = await pool.execute("INSERT INTO favorites_snippets (snippet_id, user_id) VALUES (?, ?)", [snippetId, userId]);
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { addFavorite as default };
//# sourceMappingURL=addFavorite.mjs.map
