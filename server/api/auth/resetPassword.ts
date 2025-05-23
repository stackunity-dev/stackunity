import bcrypt from 'bcryptjs';
import { createError, defineEventHandler, getRequestHeaders, readBody } from 'h3';
import { ServerTokenManager } from '../../utils/ServerTokenManager';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { newPassword } = body;
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token d\'autorisation invalide'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await ServerTokenManager.verifyToken(token);
    const userId = decodedToken.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré'
    });
  }
});

