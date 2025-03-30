import { createError, defineEventHandler, getQuery, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from './db';

interface CookieData {
  preferences: {
    essential: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  analytics?: {
    email?: string;
    name?: string;
    region?: string;
    lastVisit?: string;
  };
  marketing?: {
    visitedPages?: string[];
    lastPurchase?: string;
    interests?: string[];
  };
}

interface CookiePreferences {
  preferences: string;
  created_at: Date;
  updated_at: Date;
}

interface CookiePreferencesResult extends RowDataPacket {
  preferences: string;
  created_at: Date;
  updated_at: Date;
}

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    return;
  }

  if (method === 'POST') {
    const body = await readBody(event);
    try {
      const { userId, cookiePreferences } = body;

      if (!userId || !cookiePreferences) {
        throw createError({
          statusCode: 400,
          message: 'Données manquantes'
        });
      }

      const preferences = cookiePreferences.preferences
        ? cookiePreferences
        : { preferences: { essential: true }, ...cookiePreferences };

      const connection = await pool.getConnection();

      const [existingUser] = await connection.execute<CookiePreferencesResult[]>(
        'SELECT id FROM cookie_preferences WHERE user_id = ?',
        [userId]
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        await connection.execute(
          `UPDATE cookie_preferences 
           SET preferences = ?, updated_at = NOW() 
           WHERE user_id = ?`,
          [JSON.stringify(preferences), userId]
        );
      } else {
        await connection.execute(
          `INSERT INTO cookie_preferences (user_id, preferences, created_at, updated_at)
           VALUES (?, ?, NOW(), NOW())`,
          [userId, JSON.stringify(preferences)]
        );
      }

      connection.release();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des préférences de cookies:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de l\'enregistrement des préférences de cookies'
      });
    }
  }

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const { userId } = query;

      if (!userId) {
        throw createError({
          statusCode: 400,
          message: 'ID utilisateur manquant'
        });
      }

      const connection = await pool.getConnection();
      const [preferences] = await connection.execute<CookiePreferencesResult[]>(
        'SELECT preferences FROM cookie_preferences WHERE user_id = ?',
        [userId]
      );

      connection.release();

      if (Array.isArray(preferences) && preferences.length > 0) {
        return {
          success: true,
          preferences: JSON.parse(preferences[0].preferences)
        };
      }

      return {
        success: true,
        preferences: null
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences de cookies:', error);
      throw createError({
        statusCode: 500,
        message: 'Erreur lors de la récupération des préférences de cookies'
      });
    }
  }

  throw createError({
    statusCode: 405,
    message: 'Méthode non autorisée'
  });
}); 