globalThis.__timing__.logStart('Load chunks/routes/api/snippets/addSnippets');import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const addSnippets = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  console.log(body);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  try {
    if (body.publishWorld === true) {
      const [worldSnippetsRows] = await pool.execute("INSERT INTO world_snippets (img, title, description, username, framework, snippet_date) VALUES (?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date
      ]);
      const [personalSnippetsRows] = await pool.execute("INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);
      return {
        success: true
      };
    } else {
      const [personalSnippetsRows] = await pool.execute("INSERT INTO personal_snippets (img, title, description, username, framework, snippet_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        body.img,
        body.title,
        body.description,
        body.username,
        body.framework,
        body.date,
        userId
      ]);
      return {
        success: true
      };
    }
  } catch (err) {
    console.error("Error add snippets :", err.message, err.stack);
  }
});

export { addSnippets as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/snippets/addSnippets');
