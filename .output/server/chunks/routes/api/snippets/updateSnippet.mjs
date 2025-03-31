import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const updateSnippet = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  console.log(body);
  try {
    if (body.type === "world") {
      const [worldSnippetsRows] = await pool.execute("UPDATE world_snippets SET content = ? WHERE id = ?", [body.code, body.id]);
      return {
        success: true,
        data: {
          worldSnippets: worldSnippetsRows
        }
      };
    } else {
      const [personalSnippetsRows] = await pool.execute("UPDATE personal_snippets SET content = ? WHERE id = ? AND user_id = ?", [body.code, body.id, userId]);
      return {
        success: true,
        data: {
          personalSnippet: personalSnippetsRows
        }
      };
    }
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { updateSnippet as default };
//# sourceMappingURL=updateSnippet.mjs.map
