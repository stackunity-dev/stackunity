globalThis.__timing__.logStart('Load chunks/routes/api/newsletter/history');import { c as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
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

const history = defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM newsletters_emails");
    return { success: true, data: rows };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration de l'historique des emails:", error);
    return { success: false, error: "Erreur lors de la r\xE9cup\xE9ration de l'historique des emails" };
  }
});

export { history as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/newsletter/history');
