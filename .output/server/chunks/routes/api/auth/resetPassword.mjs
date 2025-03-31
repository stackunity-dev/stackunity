import { c as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
import bcrypt from 'bcrypt';
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

const resetPassword = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { newPassword } = body;
  const userId = event.context.user.id;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);
    return {
      success: true,
      message: "Mot de passe r\xE9initialis\xE9 avec succ\xE8s"
    };
  } catch (error) {
    console.error("Erreur lors de la r\xE9initialisation du mot de passe:", error);
    return {
      success: false,
      message: "Erreur lors de la r\xE9initialisation du mot de passe"
    };
  }
});

export { resetPassword as default };
//# sourceMappingURL=resetPassword.mjs.map
