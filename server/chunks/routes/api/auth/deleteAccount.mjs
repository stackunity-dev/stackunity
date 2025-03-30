import { c as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';

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
