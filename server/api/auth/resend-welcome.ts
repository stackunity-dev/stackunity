import { defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { EmailService } from '../../utils/EmailService';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email } = body;

    if (!email) {
      return {
        success: false,
        error: 'Email requis'
      };
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, username, email FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    }

    const user = rows[0];

    const emailResult = await EmailService.sendWelcomeEmail(user.email, user.username);

    if (!emailResult.success) {
      return {
        success: false,
        error: `Erreur lors de l'envoi de l'email: ${emailResult.error}`
      };
    }

    return {
      success: true,
      message: 'Email de bienvenue renvoyé avec succès'
    };
  } catch (error) {
    console.error('[API] Erreur lors du renvoi de l\'email de bienvenue:', error);
    return {
      success: false,
      error: 'Erreur lors du renvoi de l\'email de bienvenue'
    };
  }
}); 