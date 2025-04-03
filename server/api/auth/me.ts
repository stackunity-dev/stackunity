import { defineEventHandler } from 'h3';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    // Récupérer les informations de l'utilisateur depuis le contexte (middleware auth)
    const user = event.context.user;

    console.log('[API ME] Contexte utilisateur:', JSON.stringify(user));

    if (!user || !user.userId) {
      return {
        success: false,
        message: 'Utilisateur non authentifié'
      };
    }

    // Récupérer les informations complètes de l'utilisateur depuis la base de données
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, email, isAdmin, isPremium, company, website, bio FROM users WHERE id = ?',
      [user.userId]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Utilisateur non trouvé'
      };
    }

    const userData = rows[0];

    return {
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        isAdmin: userData.isAdmin === 1,
        isPremium: userData.isPremium === 1,
        company: userData.company || '',
        website: userData.website || '',
        bio: userData.bio || ''
      }
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    return {
      success: false,
      message: 'Erreur interne du serveur'
    };
  }
}); 