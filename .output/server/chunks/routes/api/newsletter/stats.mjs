import { d as defineEventHandler, m as getRequestHeader, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';

const stats = defineEventHandler(async (event) => {
  var _a;
  try {
    const token = (_a = getRequestHeader(event, "Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
      return {
        statusCode: 401,
        body: { error: "Non autoris\xE9" }
      };
    }
    const [statsRows] = await pool.execute("SELECT * FROM newsletters");
    const stats = statsRows.map((row) => ({
      id: row.id,
      name: row.name,
      emails_sent: row.emails_sent,
      subscribers: row.subscribers,
      content: row.content
    }));
    return {
      stats,
      total: stats.length
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9cup\xE9ration des statistiques:", error);
    return {
      stats: [],
      total: 0
    };
  }
});

export { stats as default };
//# sourceMappingURL=stats.mjs.map
