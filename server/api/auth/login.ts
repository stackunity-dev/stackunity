import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  isPremium: number;
  isAdmin: number;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.email || !body.password) {
      console.log('[LOGIN] Champs manquants');
      return {
        success: false,
        message: 'Email et mot de passe requis'
      };
    }

    const [rows] = await pool.execute<UserRow[]>('SELECT id, username, email, password, isPremium, isAdmin FROM users WHERE email = ?', [body.email]);

    if (!rows || rows.length === 0) {
      console.log('[LOGIN] Utilisateur non trouvé');
      return {
        success: false,
        message: 'Identifiants invalides'
      };
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      console.log('[LOGIN] Mot de passe invalide');
      return {
        success: false,
        message: 'Identifiants invalides'
      };
    }

    try {
      const isPremiumValue = user.isPremium === 1;
      const isAdminValue = user.isAdmin === 1;
      console.log(isPremiumValue, isAdminValue);

      const accessToken = ServerTokenManager.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue,
        isRememberMe: body.rememberMe || false
      });

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue,
        isRememberMe: body.rememberMe || false
      };

      console.log(`[LOGIN] Connexion réussie pour ${user.email}${body.rememberMe ? ' avec "Remember me" activé' : ''}`);

      return {
        success: true,
        user: userData,
        accessToken
      };
    } catch (tokenError) {
      console.error('[LOGIN] Erreur lors de la génération du token:', tokenError);
      throw new Error('Erreur lors de la génération du token');
    }
  } catch (error) {
    console.error('[LOGIN] Erreur détaillée:', error);
    if (error instanceof Error) {
      console.error('[LOGIN] Stack trace:', error.stack);
    }
    return {
      success: false,
      message: 'Erreur lors de la connexion',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
});