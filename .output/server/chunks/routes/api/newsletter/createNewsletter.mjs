globalThis.__timing__.logStart('Load chunks/routes/api/newsletter/createNewsletter');import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const createNewsletter = defineEventHandler(async (event) => {
  const { name } = await readBody(event);
  try {
    const [result] = await pool.execute("INSERT INTO newsletters (name) VALUES (?)", [name]);
    return result;
  } catch (error) {
    console.error("Erreur lors de la cr\xE9ation de la newsletter:", error);
    return { error: "Erreur lors de la cr\xE9ation de la newsletter" };
  }
});

export { createNewsletter as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/newsletter/createNewsletter');
