import { d as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';

const loadSnippets = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const [personalSnippetsRows] = await pool.execute("SELECT * FROM personal_snippets WHERE user_id = ?", [userId]);
    const [worldSnippetsRows] = await pool.execute("SELECT * FROM world_snippets");
    const [favoritesRows] = await pool.execute("SELECT * FROM favorites_snippets WHERE user_id = ?", [userId]);
    return {
      success: true,
      data: {
        personalSnippets: personalSnippetsRows,
        worldSnippets: worldSnippetsRows,
        favoritesSnippets: favoritesRows
      }
    };
  } catch (err) {
    console.error(err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { loadSnippets as default };
//# sourceMappingURL=loadSnippets.mjs.map
