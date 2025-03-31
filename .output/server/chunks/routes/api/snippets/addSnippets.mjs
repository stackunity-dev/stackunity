import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2';

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

export { addSnippets as default };
//# sourceMappingURL=addSnippets.mjs.map
