import { d as defineEventHandler, k as getRequestHeaders, i as getCookie, A as ACCESS_TOKEN_SECRET, p as pool, j as deleteCookie, b as ACCESS_TOKEN_EXPIRY, s as setCookie, r as readBody } from '../../../_/nitro.mjs';
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

const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
const JWT_SECRET = ACCESS_TOKEN_SECRET;
const TOKEN_EXPIRY = ACCESS_TOKEN_EXPIRY;
const session = defineEventHandler(async (event) => {
  const cookieOptions = {
    httpOnly: true,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "strict",
    secure: true
  };
  if (event.method === "GET") {
    try {
      const authHeader = getRequestHeaders(event).authorization;
      const token = (authHeader == null ? void 0 : authHeader.startsWith("Bearer ")) ? authHeader.substring(7) : null;
      const sessionCookie = getCookie(event, "devunity_secure_session");
      const sessionToken = token || sessionCookie;
      if (!sessionToken) {
        return {
          success: false,
          message: "Aucune session active"
        };
      }
      try {
        const decoded = jwt.verify(sessionToken, JWT_SECRET);
        if (decoded.userId) {
          const [rows] = await pool.execute(
            "SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?",
            [decoded.userId]
          );
          if (!Array.isArray(rows) || rows.length === 0) {
            deleteCookie(event, "devunity_secure_session", cookieOptions);
            return {
              success: false,
              message: "Utilisateur non trouv\xE9"
            };
          }
          const user = rows[0];
          const newToken = jwt.sign(
            {
              userId: user.id,
              username: user.username,
              email: user.email,
              isPremium: user.isPremium === 1,
              isAdmin: user.isAdmin === 1
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
          );
          setCookie(event, "devunity_secure_session", newToken, cookieOptions);
          return {
            success: true,
            token: newToken,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin === 1,
              isPremium: user.isPremium === 1
            }
          };
        }
        return {
          success: true,
          token: sessionToken,
          user: decoded
        };
      } catch (jwtError) {
        deleteCookie(event, "devunity_secure_session", cookieOptions);
        return {
          success: false,
          message: "Session invalide"
        };
      }
    } catch (error) {
      console.error("Erreur lors de la r\xE9cup\xE9ration de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  if (event.method === "POST") {
    try {
      const body = await readBody(event);
      const { token } = body;
      if (!token) {
        const authHeader = getRequestHeaders(event).authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const headerToken = authHeader.substring(7);
          if (headerToken) {
            try {
              jwt.verify(headerToken, JWT_SECRET);
              setCookie(event, "devunity_secure_session", headerToken, cookieOptions);
              return {
                success: true,
                message: "Session cr\xE9\xE9e avec succ\xE8s"
              };
            } catch (jwtError) {
              return {
                success: false,
                message: "Token invalide"
              };
            }
          }
        }
        return {
          success: false,
          message: "Token manquant"
        };
      }
      try {
        jwt.verify(token, JWT_SECRET);
      } catch (jwtError) {
        return {
          success: false,
          message: "Token invalide"
        };
      }
      setCookie(event, "devunity_secure_session", token, cookieOptions);
      return {
        success: true,
        message: "Session cr\xE9\xE9e avec succ\xE8s"
      };
    } catch (error) {
      console.error("Erreur lors de la cr\xE9ation de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  if (event.method === "DELETE") {
    try {
      deleteCookie(event, "devunity_secure_session", cookieOptions);
      return {
        success: true,
        message: "Session supprim\xE9e avec succ\xE8s"
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de la session:", error);
      return {
        success: false,
        message: "Erreur serveur"
      };
    }
  }
  return {
    success: false,
    message: "M\xE9thode non prise en charge"
  };
});

export { session as default };
//# sourceMappingURL=session.mjs.map
