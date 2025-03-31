import { d as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

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

export { subscribers as default };
//# sourceMappingURL=subscribers.mjs.map
