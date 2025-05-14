import { createError, defineEventHandler } from 'h3';
import { decryptSensitiveData, query } from '../../../database/db';

export default defineEventHandler(async (event) => {
  try {
    const connectionId = event.context.params?.id;
    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Connection ID is required'
      });
    }

    const user = event.context.user || { id: 'demo-user' };

    // Vérifier si c'est une connexion de démo
    if (connectionId.startsWith('demo')) {
      const demoConnection = {
        id: connectionId,
        name: connectionId === 'demo1' ? 'Local MySQL' : 'Production PostgreSQL',
        type: connectionId === 'demo1' ? 'mysql' : 'postgres',
        host: 'localhost',
        port: connectionId === 'demo1' ? 3306 : 5432,
        database_name: 'demo_db',
        username: 'demo_user',
        password: 'demo_password', // Mot de passe en clair pour la démo
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        connection: demoConnection
      };
    }

    // Récupérer la connexion depuis la base de données
    const connections = await query<any[]>(
      `SELECT id, name, type, host, port, database_name, username, 
              password_encrypted, created_at, updated_at, last_used_at, is_favorite 
       FROM database_info 
       WHERE id = ? AND user_id = ?`,
      [connectionId, user.id]
    );

    // Vérifier si la connexion existe
    if (!connections || connections.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Connection not found'
      });
    }

    const connection = connections[0];

    // Déchiffrer le mot de passe pour l'utiliser avec le pool de connexion
    const password = decryptSensitiveData(connection.password_encrypted);

    // Retourner la connexion sans le mot de passe chiffré
    return {
      success: true,
      connection: {
        ...connection,
        password_encrypted: undefined,
        password // Inclure le mot de passe déchiffré pour l'utiliser avec le pool
      }
    };
  } catch (error: any) {
    console.error('Error getting database connection:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to get database connection'
    });
  }
}); 