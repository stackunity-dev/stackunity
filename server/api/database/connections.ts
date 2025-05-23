import { createError, defineEventHandler } from 'h3';
import { query } from '../../database/db';
import { getUserId } from '../../utils/auth-utils';

export default defineEventHandler(async (event) => {
  try {
    // Vérifier l'authentification
    const userId = getUserId(event);

    // Récupérer toutes les connexions de l'utilisateur
    const connections = await query<any[]>(
      `SELECT id, name, type, host, port, database_name, username, 
              created_at, updated_at, last_used_at
       FROM database_info 
       WHERE user_id = ?
       ORDER BY COALESCE(last_used_at, '1970-01-01') DESC, updated_at DESC`,
      [userId]
    );

    // Masquer les informations sensibles
    const sanitizedConnections = connections.map(conn => ({
      ...conn,
      password: '********'
    }));

    return {
      success: true,
      connections: sanitizedConnections
    };
  } catch (error: any) {
    console.error('Error retrieving connections:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to retrieve connections'
    });
  }
}); 