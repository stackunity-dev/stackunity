import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, setCookie } from 'h3';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET
} from '../../utils/auth-config';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    return {
      success: false,
      error: 'Email et mot de passe requis'
    };
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [body.email]
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Mot de passe incorrect'
      };
    }

    // Générer un token d'accès (courte durée)
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

    // Générer un token de rafraîchissement (longue durée)
    const refreshTokenId = uuidv4();
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: refreshTokenId
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // Stocker le token de rafraîchissement dans la base de données
    await pool.execute(
      'INSERT INTO refresh_tokens (token_id, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
      [refreshTokenId, user.id]
    );

    // Définir le cookie HttpOnly avec le token de rafraîchissement
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
        company: user.company || '',
        bio: user.bio || '',
        website: user.website || '',
      }
    };

  } catch (err: any) {
    console.error('Erreur de connexion:', err);
    return {
      success: false,
      error: 'Erreur serveur lors de la connexion',
    };
  }
});