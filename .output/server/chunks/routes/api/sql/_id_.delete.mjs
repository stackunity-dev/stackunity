globalThis.__timing__.logStart('Load chunks/routes/api/sql/_id_.delete');import { c as defineEventHandler, w as getRouterParam, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
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

export { _id__delete as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/sql/_id_.delete');
