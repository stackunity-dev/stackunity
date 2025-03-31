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

const deleteAccount = defineEventHandler(async (event) => {
  const userId = event.context.user.id;
  try {
    await pool.execute("DELETE FROM users WHERE id = ?", [userId]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return { success: false, error: "Erreur lors de la suppression du compte" };
  }
});

export { deleteAccount as default };
//# sourceMappingURL=deleteAccount.mjs.map
