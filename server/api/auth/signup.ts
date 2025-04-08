import bcrypt from 'bcrypt';
import { defineEventHandler, readBody, setCookie } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { TokenService } from '../../utils/TokenService';
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../utils/auth-config';
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


    const accessToken = ServerTokenManager.generateAccessToken({
      userId: userId,
      username: body.username,
      email: body.email,
      isPremium: false,
      isAdmin: false
    });

    const refreshTokenId = uuidv4();
    const refreshToken = ServerTokenManager.generateRefreshToken({
      userId: userId,
      tokenId: refreshTokenId
    });

    await TokenService.saveRefreshToken(refreshTokenId, userId);

    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

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