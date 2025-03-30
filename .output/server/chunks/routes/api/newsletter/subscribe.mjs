import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

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

export { subscribe as default };
//# sourceMappingURL=subscribe.mjs.map
