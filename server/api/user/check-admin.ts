import { pool } from '../db';
import { RowDataPacket } from 'mysql2';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user;

    if (!user) {
      console.log('Utilisateur non authentifié - check-admin');
      return {
        isAdmin: false,
        message: 'Utilisateur non authentifié'
      };
    }

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT isAdmin FROM users WHERE id = ?',
      [user.id]
    );

    const isAdmin = Array.isArray(rows) && rows.length > 0 && rows[0].isAdmin === 1;
    console.log(`Vérification admin pour ${user.username} (${user.id}): ${isAdmin ? 'OUI' : 'NON'}`);

    return {
      isAdmin,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdminInDb: rows[0]?.isAdmin === 1,
        isAdminInContext: user.isAdmin === 1
      },
      message: isAdmin ? 'Utilisateur a le rôle admin' : 'Utilisateur n\'a pas le rôle admin'
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    return {
      isAdmin: false,
      message: 'Erreur lors de la vérification du rôle admin'
    };
  }
});
