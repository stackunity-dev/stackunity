globalThis.__timing__.logStart('Load chunks/routes/api/user/loadData');import { d as defineEventHandler, q as getHeader, p as pool } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
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

const loadData = defineEventHandler(async (event) => {
  var _a;
  const authHeader = getHeader(event, "authorization");
  console.log("Authorization header dans loadData:", authHeader ? "Pr\xE9sent" : "Absent");
  console.log("event.context:", event.context);
  console.log("event.context.user:", event.context.user);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  console.log("userId dans loadData:", userId);
  if (userId === void 0) {
    console.error("Erreur: userId est undefined dans loadData.ts");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        console.log("Tentative d'extraction de l'ID utilisateur depuis le token");
        return {
          success: false,
          error: "Utilisateur non authentifi\xE9 ou session expir\xE9e (token pr\xE9sent mais pas d'ID dans le contexte)"
        };
      } catch (err) {
        console.error("Erreur lors de l'extraction du token:", err);
      }
    }
    return {
      success: false,
      error: "Utilisateur non authentifi\xE9 ou session expir\xE9e"
    };
  }
  try {
    console.log("Ex\xE9cution des requ\xEAtes SQL avec userId:", userId);
    const [userRows] = await pool.execute("SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?", [userId]);
    console.log("userRows:", userRows);
    const [studioComponentsRows] = await pool.execute("SELECT * FROM studio_components WHERE user_id = ?", [userId]);
    console.log("Donn\xE9es r\xE9cup\xE9r\xE9es avec succ\xE8s");
    return {
      success: true,
      data: {
        userData: userRows,
        studioComponents: studioComponentsRows
      }
    };
  } catch (err) {
    console.error("Erreur lors du chargement des donn\xE9es :", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors du chargement des donn\xE9es"
    };
  }
});

export { loadData as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/user/loadData');
