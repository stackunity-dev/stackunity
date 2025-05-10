import bcrypt from 'bcryptjs';
import { defineEventHandler, readBody } from 'h3';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { newPassword } = body;
  const userId = event.context.user.id;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    return {
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    };
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return {
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe'
    };
  }
});

