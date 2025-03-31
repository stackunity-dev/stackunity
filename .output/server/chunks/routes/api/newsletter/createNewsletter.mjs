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
import 'mysql2/promise';

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

export { createNewsletter as default };
//# sourceMappingURL=createNewsletter.mjs.map
