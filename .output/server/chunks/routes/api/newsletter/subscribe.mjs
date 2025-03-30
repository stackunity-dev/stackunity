globalThis.__timing__.logStart('Load chunks/routes/api/newsletter/subscribe');import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const subscribe = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  try {
    const [result] = await pool.execute("INSERT INTO newsletters_subscribers (email) VALUES (?)", [email]);
    await pool.execute("UPDATE newsletters SET subscribers = subscribers + 1");
    return result;
  } catch (error) {
    console.error("Erreur lors de l'inscription \xE0 la newsletter:", error);
    return { error: "Erreur lors de l'inscription \xE0 la newsletter" };
  }
});

export { subscribe as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/newsletter/subscribe');
