import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody, setCookie } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../utils/EmailService';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { TokenService } from '../../utils/TokenService';
import { REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS } from '../../utils/auth-config';
import { pool } from '../db.js';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.username || !body.email || !body.password) {
    return {
      success: false,
      error: 'All fields are required'
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
        error: 'This email is already taken'
      };
    }

    const [existingUsernames] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [body.username]
    );

    if (existingUsernames.length > 0) {
      return {
        success: false,
        error: 'This username is already taken'
      };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(now.getDate() + 7);

    const [userRows] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users (
        username, 
        email, 
        password, 
        isPremium, 
        isStandard, 
        trial_start_date, 
        trial_end_date, 
        subscription_status, 
        payment_status, 
        isAdmin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.username,
        body.email,
        hashedPassword,
        1,
        0,
        now,
        trialEndDate,
        'trial',
        'none',
        0
      ]
    );

    const userId = userRows.insertId;

    const accessToken = ServerTokenManager.generateAccessToken({
      userId: userId,
      username: body.username,
      email: body.email,
      isStandard: false,
      isPremium: true,
      isAdmin: false
    });

    const refreshTokenId = uuidv4();
    const refreshToken = ServerTokenManager.generateRefreshToken({
      userId: userId,
      tokenId: refreshTokenId
    });

    await TokenService.saveRefreshToken(refreshTokenId, userId);

    try {
      await EmailService.sendWelcomeEmail(body.email, body.username);
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", emailError);
    }

    setCookie(event, REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    const diffTime = trialEndDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      success: true,
      accessToken,
      user: {
        id: userId,
        username: body.username,
        email: body.email,
        isAdmin: false,
        isStandard: false,
        isPremium: true,
        subscription_status: 'trial',
        payment_status: 'none',
        trial_start_date: now.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        daysLeft
      }
    };
  }
  catch (err: any) {
    console.error("Error api signup : ", err.message, err.stack);
    return {
      success: false,
      error: err.message || 'Error during signup'
    };
  }
});