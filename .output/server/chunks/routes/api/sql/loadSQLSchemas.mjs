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

const loadSQLSchemas = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const result = await pool.execute(
      "SELECT * FROM sql_schemas WHERE user_id = ?",
      [userId]
    );
    return {
      success: true,
      schemas: result[0]
    };
  } catch (err) {
    console.error("Erreur lors du chargement des sch\xE9mas SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { loadSQLSchemas as default };
//# sourceMappingURL=loadSQLSchemas.mjs.map
