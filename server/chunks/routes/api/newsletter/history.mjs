import { c as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

const history = defineEventHandler(async (event) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM newsletters_emails");
    return { success: true, data: rows };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration de l'historique des emails:", error);
    return { success: false, error: "Erreur lors de la r\xE9cup\xE9ration de l'historique des emails" };
  }
});

export { history as default };
//# sourceMappingURL=history.mjs.map
