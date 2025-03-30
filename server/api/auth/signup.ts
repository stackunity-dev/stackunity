import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET
} from '../../utils/auth-config';
import { pool } from '../db.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username || !body.email || !body.password) {
    return {
      success: false,
      error: 'Tous les champs sont requis'
    };
  }

  try {
    // Vérifier si l'email existe déjà
    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [body.email]
    );

    if (existingUsers.length > 0) {
      return {
        success: false,
        error: 'Cet email est déjà utilisé'
      };
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const [existingUsernames] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [body.username]
    );

    if (existingUsernames.length > 0) {
      return {
        success: false,
        error: 'Ce nom d\'utilisateur est déjà utilisé'
      };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const [userRows] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)',
      [body.username, body.email, hashedPassword, 0]
    );

    const userId = userRows.insertId;

    // Générer un token d'accès (courte durée)
    const accessToken = jwt.sign(
      {
        userId: userId,
        username: body.username,
        email: body.email,
        isPremium: false,
        isAdmin: false
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Générer un token de rafraîchissement (longue durée)
    const refreshTokenId = uuidv4();
    const refreshToken = jwt.sign(
      {
        userId: userId,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Stocker le token de rafraîchissement dans la base de données
    await pool.execute(
      'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [refreshTokenId, userId]
    );

    // Définir le cookie HttpOnly avec le token de rafraîchissement
    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    // Définir le cookie de session sécurisé
    const sessionCookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 jours
      sameSite: 'strict' as const,
      secure: true
    };
    setCookie(event, 'devunity_secure_session', accessToken, sessionCookieOptions);

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
  }
  catch (err: any) {
    console.error("Error api signup : ", err.message, err.stack);
    return {
      success: false,
      error: err.message || 'Erreur lors de l\'inscription'
    };
  }
});