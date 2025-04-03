import bcrypt from 'bcrypt';
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
    console.log('[LOGIN] Tentative de connexion pour:', body.email);

    if (!body.email || !body.password) {
      console.log('[LOGIN] Champs manquants');
      return {
        success: false,
        message: 'Email et mot de passe requis'
      };
    }

    console.log('[LOGIN] Recherche de l\'utilisateur dans la base de données');
    const [rows] = await pool.execute<UserRow[]>('SELECT id, username, email, password, isPremium, isAdmin FROM users WHERE email = ?', [body.email]);

    if (!rows || rows.length === 0) {
      console.log('[LOGIN] Utilisateur non trouvé');
      return {
        success: false,
        message: 'Identifiants invalides'
      };
    }

    const user = rows[0];
    console.log(user);

    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      console.log('[LOGIN] Mot de passe invalide');
      return {
        success: false,
        message: 'Identifiants invalides'
      };
    }

    console.log('[LOGIN] Mot de passe valide, génération du token');
    console.log('[LOGIN] Données brutes de l\'utilisateur:', {
      id: user.id,
      username: user.username,
      email: user.email,
      isPremium: user.isPremium,
      isAdmin: user.isAdmin,
      types: {
        isPremium: typeof user.isPremium,
        isAdmin: typeof user.isAdmin
      }
    });

    try {
      const isPremiumValue = user.isPremium === 1;
      const isAdminValue = user.isAdmin === 1;

      console.log('[LOGIN] Valeurs après conversion:', {
        isPremiumValue,
        isAdminValue,
        originalValues: {
          isPremium: user.isPremium,
          isAdmin: user.isAdmin
        }
      });

      const accessToken = ServerTokenManager.generateAccessToken({
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue
      });

      console.log('[LOGIN] Token généré avec succès');
      console.log('[LOGIN] Payload du token:', {
        userId: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue
      });

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        isPremium: isPremiumValue,
        isAdmin: isAdminValue
      };

      console.log('[LOGIN] Données utilisateur finales:', userData);

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