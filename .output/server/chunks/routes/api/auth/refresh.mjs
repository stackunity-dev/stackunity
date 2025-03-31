import { c as defineEventHandler, l as getCookie, j as REFRESH_TOKEN_COOKIE_NAME, R as REFRESH_TOKEN_SECRET, p as pool, A as ACCESS_TOKEN_SECRET, f as ACCESS_TOKEN_EXPIRY, h as REFRESH_TOKEN_EXPIRY, i as setCookie, k as REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import { v as v4 } from '../../../_/v4.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'mysql2/promise';
import 'crypto';

const refresh = defineEventHandler(async (event) => {
  try {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE_NAME);
    if (!refreshToken) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement manquant"
      };
    }
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement invalide"
      };
    }
    const [tokenRows] = await pool.execute(
      "SELECT * FROM refresh_tokens WHERE token_id = ? AND user_id = ? AND revoked = 0 AND expires_at > NOW()",
      [decoded.tokenId, decoded.userId]
    );
    if (!Array.isArray(tokenRows) || tokenRows.length === 0) {
      return {
        success: false,
        error: "Token de rafra\xEEchissement r\xE9voqu\xE9 ou expir\xE9"
      };
    }
    const [userRows] = await pool.execute(
      "SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?",
      [decoded.userId]
    );
    if (!Array.isArray(userRows) || userRows.length === 0) {
      return {
        success: false,
        error: "Utilisateur non trouv\xE9"
      };
    }
    const user = userRows[0];
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: user.isPremium === 1,
        isAdmin: user.isAdmin === 1
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const newRefreshTokenId = v4();
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: newRefreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute(
        "UPDATE refresh_tokens SET revoked = 1, replaced_by = ? WHERE token_id = ?",
        [newRefreshTokenId, decoded.tokenId]
      );
      await connection.execute(
        "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
        [newRefreshTokenId, user.id]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin === 1,
        isPremium: user.isPremium === 1
      }
    };
  } catch (error) {
    console.error("Erreur lors du rafra\xEEchissement du token:", error);
    return {
      success: false,
      error: "Erreur serveur lors du rafra\xEEchissement du token"
    };
  }
});

export { refresh as default };
//# sourceMappingURL=refresh.mjs.map
