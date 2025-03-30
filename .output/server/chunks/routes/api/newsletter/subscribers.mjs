globalThis.__timing__.logStart('Load chunks/routes/api/newsletter/subscribers');import { c as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
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

const subscribers = defineEventHandler(async (event) => {
  try {
    const [subscribersRows] = await pool.execute("SELECT * FROM newsletters_subscribers");
    const subscribers = subscribersRows.map((row) => ({
      id: row.id,
      email: row.email,
      date: row.date
    }));
    return {
      subscribers,
      total: subscribers.length
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des abonn\xE9s:", error);
    return {
      statusCode: 500,
      body: {
        error: "Erreur lors de la r\xE9cup\xE9ration des abonn\xE9s",
        message: error.message
      }
    };
  }
});

export { subscribers as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/newsletter/subscribers');
