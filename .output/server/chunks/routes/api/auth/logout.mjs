import { c as defineEventHandler, l as getCookie, j as REFRESH_TOKEN_COOKIE_NAME, R as REFRESH_TOKEN_SECRET, p as pool, m as deleteCookie } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'mysql2';

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
