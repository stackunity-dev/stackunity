globalThis.__timing__.logStart('Load chunks/routes/api/auth/signup');import bcrypt from 'bcrypt';
import { c as defineEventHandler, r as readBody, p as pool, A as ACCESS_TOKEN_SECRET, f as ACCESS_TOKEN_EXPIRY, R as REFRESH_TOKEN_SECRET, h as REFRESH_TOKEN_EXPIRY, i as setCookie, j as REFRESH_TOKEN_COOKIE_NAME, k as REFRESH_TOKEN_COOKIE_OPTIONS } from '../../../_/nitro.mjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'node:url';
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

const signup = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.username || !body.email || !body.password) {
    return {
      success: false,
      error: "Tous les champs sont requis"
    };
  }
  try {
    const [existingUsers] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [body.email]
    );
    if (existingUsers.length > 0) {
      return {
        success: false,
        error: "Cet email est d\xE9j\xE0 utilis\xE9"
      };
    }
    const [existingUsernames] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [body.username]
    );
    if (existingUsernames.length > 0) {
      return {
        success: false,
        error: "Ce nom d'utilisateur est d\xE9j\xE0 utilis\xE9"
      };
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const [userRows] = await pool.execute(
      "INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)",
      [body.username, body.email, hashedPassword, 0]
    );
    const userId = userRows.insertId;
    const accessToken = jwt.sign(
      {
        userId,
        username: body.username,
        email: body.email,
        isPremium: false,
        isAdmin: false
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshTokenId = v4();
    const refreshToken = jwt.sign(
      {
        userId,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
    await pool.execute(
      "INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [refreshTokenId, userId]
    );
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    const sessionCookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
      // 30 jours
      sameSite: "strict",
      secure: true
    };
    setCookie(event, "devunity_secure_session", accessToken, sessionCookieOptions);
    return {
      success: true,
      accessToken,
      user: {
        id: userId,
        username: body.username,
        email: body.email,
        isAdmin: false,
        isPremium: false
      }
    };
  } catch (err) {
    console.error("Error api signup : ", err.message, err.stack);
    return {
      success: false,
      error: err.message || "Erreur lors de l'inscription"
    };
  }
});

export { signup as default };;globalThis.__timing__.logEnd('Load chunks/routes/api/auth/signup');
