import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const saveSQLSchema = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.user.id;
  try {
    const result = await pool.execute(
      "INSERT INTO sql_schemas (user_id, database_name, schema_data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE schema_data = ?, updated_at = NOW()",
      [userId, body.databaseName, JSON.stringify(body), JSON.stringify(body)]
    );
    const insertId = result[0].insertId || result[0].affectedRows;
    return {
      success: true,
      id: insertId
    };
  } catch (err) {
    console.error("Erreur lors de la sauvegarde du sch\xE9ma SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { saveSQLSchema as default };
//# sourceMappingURL=saveSQLSchema.mjs.map
