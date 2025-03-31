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

const unsubscribe = defineEventHandler(async (event) => {
  const { email } = await readBody(event);
  try {
    const subscriber = await pool.execute("DELETE FROM newsletters_subscribers WHERE email = ?", [email]);
    const count = await pool.execute("UPDATE newsletters SET subscribers = GREATEST(subscribers - 1, 0)");
    return { success: true, message: "Email d\xE9sinscrit avec succ\xE8s", subscriber, count };
  } catch (error) {
    return { success: false, message: "Erreur lors de la d\xE9sinscription" };
  }
});

export { unsubscribe as default };
//# sourceMappingURL=unsubscribe.mjs.map
