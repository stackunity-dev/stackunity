import bcrypt from 'bcrypt';
import { c as defineEventHandler, r as readBody, p as pool, A as ACCESS_TOKEN_SECRET, f as ACCESS_TOKEN_EXPIRY, R as REFRESH_TOKEN_SECRET, h as REFRESH_TOKEN_EXPIRY, i as setCookie, j as REFRESH_TOKEN_COOKIE_NAME, k as REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../_/nitro.mjs';
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

const login = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.email || !body.password) {
    return {
      success: false,
      error: "Email et mot de passe requis"
    };
  }
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [body.email]
    );
    if (rows.length === 0) {
      return {
        success: false,
        error: "Utilisateur non trouv\xE9"
      };
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Mot de passe incorrect"
      };
    }
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
    const refreshTokenId = v4();
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    await pool.execute(
      "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [refreshTokenId, user.id]
    );
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin === 1,
        isPremium: user.isPremium === 1,
        company: user.company || "",
        bio: user.bio || "",
        website: user.website || ""
      }
    };
  } catch (err) {
    console.error("Erreur de connexion:", err);
    return {
      success: false,
      error: "Erreur serveur lors de la connexion"
    };
  }
});

export { login as default };
//# sourceMappingURL=login.mjs.map
