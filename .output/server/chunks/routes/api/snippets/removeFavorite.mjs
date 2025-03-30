globalThis.__timing__.logStart('Load chunks/routes/api/snippets/removeFavorite');import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
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

export { removeFavorite as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/snippets/removeFavorite');
