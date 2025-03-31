import { c as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
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

const loadSQLSchemas = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    const result = await pool.execute(
      "SELECT * FROM sql_schemas WHERE user_id = ?",
      [userId]
    );
    return {
      success: true,
      schemas: result[0]
    };
  } catch (err) {
    console.error("Erreur lors du chargement des sch\xE9mas SQL:", err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { loadSQLSchemas as default };
//# sourceMappingURL=loadSQLSchemas.mjs.map
