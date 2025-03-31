import { d as defineEventHandler, i as getCookie, f as REFRESH_TOKEN_COOKIE_NAME, R as REFRESH_TOKEN_SECRET, p as pool, j as deleteCookie } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
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

const logout = defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        await pool.execute(
          "UPDATE refresh_tokens SET revoked = 1 WHERE token_id = ? AND user_id = ?",
          [decoded.tokenId, decoded.userId]
        );
      } catch (error) {
        console.warn("Impossible de d\xE9coder le token de rafra\xEEchissement lors de la d\xE9connexion:", error);
      }
    }
    deleteCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    return {
      success: true
    };
  } catch (error) {
    console.error("Erreur lors de la d\xE9connexion:", error);
    return {
      success: false,
      error: "Erreur serveur lors de la d\xE9connexion"
    };
  }
});

export { logout as default };
//# sourceMappingURL=logout.mjs.map
