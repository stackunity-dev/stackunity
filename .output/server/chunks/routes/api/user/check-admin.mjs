import { d as defineEventHandler, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';

const checkAdmin = defineEventHandler(async (event) => {
  var _a;
  try {
    const user = event.context.user;
    if (!user) {
      console.log("Utilisateur non authentifi\xE9 - check-admin");
      return {
        isAdmin: false,
        message: "Utilisateur non authentifi\xE9"
      };
    }
    const [rows] = await pool.execute(
      "SELECT isAdmin FROM users WHERE id = ?",
      [user.id]
    );
    const isAdmin = Array.isArray(rows) && rows.length > 0 && rows[0].isAdmin === 1;
    console.log(`V\xE9rification admin pour ${user.username} (${user.id}): ${isAdmin ? "OUI" : "NON"}`);
    return {
      isAdmin,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdminInDb: ((_a = rows[0]) == null ? void 0 : _a.isAdmin) === 1,
        isAdminInContext: user.isAdmin === 1
      },
      message: isAdmin ? "Utilisateur a le r\xF4le admin" : "Utilisateur n'a pas le r\xF4le admin"
    };
  } catch (error) {
    console.error("Erreur lors de la v\xE9rification du r\xF4le admin:", error);
    return {
      isAdmin: false,
      message: "Erreur lors de la v\xE9rification du r\xF4le admin"
    };
  }
});

export { checkAdmin as default };
//# sourceMappingURL=check-admin.mjs.map
