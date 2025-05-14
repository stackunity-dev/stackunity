import { createError, defineEventHandler } from 'h3';
import { query } from '../../database/db';

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user || { id: 'demo-user' };

    // Récupérer les connexions depuis la base de données
    const connections = await query<any[]>(
      `SELECT id, name, type, host, port, database_name, username, 
              created_at, updated_at, last_used_at, is_favorite 
       FROM database_info 
       WHERE user_id = ? 
       ORDER BY is_favorite DESC, name ASC`,
      [user.id]
    );

    // Si aucune connexion n'existe, créer des exemples pour la démo
    if (!connections || connections.length === 0) {
      return {
        success: true,
        connections: [
          {
            id: 'demo1',
            name: 'Local MySQL',
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            database_name: 'demo_db',
            username: 'demo_user',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'demo2',
            name: 'Production PostgreSQL',
            type: 'postgres',
            host: 'db.example.com',
            port: 5432,
            database_name: 'prod_db',
            username: 'prod_user',
            userId: user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      };
    }

    return {
      success: true,
      connections: connections
    };
  } catch (error: any) {
    console.error('Error getting database connections:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to get database connections'
    });
  }
}); 