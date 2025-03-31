import { d as defineEventHandler, r as readBody, p as pool } from '../../../_/nitro.mjs';
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

const deleteSnippet = defineEventHandler(async (event) => {
  var _a;
  const body = await readBody(event);
  const userId = (_a = event.context.user) == null ? void 0 : _a.id;
  if (!userId) {
    return {
      success: false,
      error: "Utilisateur non authentifi\xE9"
    };
  }
  if (!body.id) {
    return {
      success: false,
      error: "ID du snippet manquant"
    };
  }
  try {
    if (body.type === "world") {
      const [ownerCheck] = await pool.execute(
        "SELECT user_id FROM world_snippets WHERE id = ?",
        [body.id]
      );
      if (!ownerCheck.length || ownerCheck[0].user_id !== userId) {
        return {
          success: false,
          error: "Vous n'\xEAtes pas autoris\xE9 \xE0 supprimer ce snippet"
        };
      }
      await pool.execute("DELETE FROM world_snippets WHERE id = ?", [body.id]);
      return {
        success: true,
        message: "Snippet mondial supprim\xE9 avec succ\xE8s"
      };
    } else {
      const [result] = await pool.execute(
        "DELETE FROM personal_snippets WHERE id = ? AND user_id = ?",
        [body.id, userId]
      );
      if (result.affectedRows === 0) {
        return {
          success: false,
          error: "Snippet personnel non trouv\xE9 ou non autoris\xE9"
        };
      }
      return {
        success: true,
        message: "Snippet personnel supprim\xE9 avec succ\xE8s"
      };
    }
  } catch (err) {
    console.error("Erreur lors de la suppression du snippet:", err.message, err.stack);
    return {
      success: false,
      error: err.message
    };
  }
});

export { deleteSnippet as default };
//# sourceMappingURL=deleteSnippet.mjs.map
