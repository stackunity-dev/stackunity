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
    console.log(`[${new Date().toISOString()}] Tentative de connexion pour l'email:`, body.email);

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [body.email]
    );

    if (rows.length === 0) {
      console.log(`[${new Date().toISOString()}] Utilisateur non trouvé:`, body.email);
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      console.log(`[${new Date().toISOString()}] Mot de passe incorrect pour:`, body.email);
      return {
        success: false,
        error: 'Mot de passe incorrect'
      };
    }

    console.log(`[${new Date().toISOString()}] Connexion réussie pour l'utilisateur:`, user.id);

    // Générer un token d'accès (courte durée)
    const accessTokenPayload = {
      userId: user.id,
      id: user.id, // Pour la compatibilité avec les anciens systèmes
      username: user.username,
      email: user.email,
      isPremium: user.isPremium === 1,
      isAdmin: user.isAdmin === 1
    };

    console.log(`[${new Date().toISOString()}] Payload du token d'accès:`, accessTokenPayload);

    const accessToken = jwt.sign(
      accessTokenPayload,
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
      console.log(`[${new Date().toISOString()}] Token décodé après création:`, decoded);

      if (!decoded.userId) {
        throw new Error('ID utilisateur manquant dans le token généré');
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Erreur lors de la vérification du token:`, error);
      return {
        success: false,
        error: 'Erreur lors de la génération du token'
      };
    }

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

    console.log(`[${new Date().toISOString()}] Tokens générés avec succès pour l'utilisateur:`, user.id);

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
    console.error(`[${new Date().toISOString()}] Erreur de connexion:`, err);
    return {
      success: false,
      error: 'Erreur serveur lors de la connexion',
    };
  }
});