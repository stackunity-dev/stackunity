import * as crypto from 'crypto';
import { createError, defineEventHandler, getMethod, H3Event, readBody } from 'h3';
import { decryptSensitiveData, encryptSensitiveData, generateId, query } from '../../database/db';
import { getConnectionPool } from './pool';

// Fonction de déchiffrement sécurisée
export function decryptData(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return '';

  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'stackunity-secret-key', 'salt', 32);

    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

// Interface pour les connexions de base de données
export interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Stockage temporaire des connexions (dans un environnement de production, utilisez une base de données)
const connections = new Map<string, DatabaseConnection>();

function getDefaultPort(dbType: string): number {
  switch (dbType.toLowerCase()) {
    case 'mysql':
      return 3306;
    case 'postgres':
      return 5432;
    case 'mssql':
      return 1433;
    case 'sqlite':
      return 0;
    default:
      return 3306;
  }
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  switch (method) {
    case 'POST':
      return handleCreateConnection(event);
    case 'PUT':
      return handleUpdateConnection(event);
    case 'DELETE':
      return handleDeleteConnection(event);
    case 'GET':
      return handleTestConnection(event);
    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed',
        message: `Method ${method} not allowed`
      });
  }
});

/**
 * Gère la création d'une nouvelle connexion
 */
async function handleCreateConnection(event: H3Event) {
  try {
    const body = await readBody(event);
    const user = event.context.user || { id: 'demo-user' };

    // Validation des entrées
    if (!body.name || !body.type || !body.host || !body.database || !body.username || !body.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing required fields'
      });
    }

    // Tester la connexion avant de l'enregistrer
    await getConnectionPool({
      id: 'test-connection',
      type: body.type,
      host: body.host,
      port: body.port || getDefaultPort(body.type),
      database: body.database,
      username: body.username,
      password: body.password
    });

    // Chiffrer le mot de passe
    const encryptedPassword = encryptSensitiveData(body.password);

    // Générer un ID pour la nouvelle connexion
    const connectionId = generateId();

    try {
      // Créer une nouvelle connexion
      await query(
        `INSERT INTO database_info 
         (id, user_id, name, type, host, port, database_name, username, password_encrypted) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          connectionId, user.id, body.name, body.type, body.host,
          body.port || getDefaultPort(body.type), body.database,
          body.username, encryptedPassword
        ]
      );

      console.log(`Connection "${body.name}" saved successfully`);

      // Retourner la connexion sans le mot de passe
      return {
        success: true,
        message: 'Connection created successfully',
        connection: {
          id: connectionId,
          name: body.name,
          type: body.type,
          host: body.host,
          port: body.port || getDefaultPort(body.type),
          database_name: body.database,
          username: body.username
        }
      };
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to save connection to database'
      });
    }
  } catch (error: any) {
    console.error('Error saving database connection:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to save database connection'
    });
  }
}

/**
 * Gère la mise à jour d'une connexion existante
 */
async function handleUpdateConnection(event: H3Event) {
  try {
    const body = await readBody(event);
    const user = event.context.user || { id: 'demo-user' };

    // Validation des entrées
    if (!body.id || !body.name || !body.type || !body.host || !body.database || !body.username) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing required fields'
      });
    }

    // Vérifier si la connexion existe
    const connections = await query<any[]>(
      `SELECT id FROM database_info WHERE id = ? AND user_id = ?`,
      [body.id, user.id]
    );

    if (!connections || connections.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Connection not found or you do not have permission to update it'
      });
    }

    // Si un nouveau mot de passe est fourni, le chiffrer
    let passwordUpdate = '';
    let passwordParams: any[] = [];

    if (body.password) {
      const encryptedPassword = encryptSensitiveData(body.password);
      passwordUpdate = ', password_encrypted = ?';
      passwordParams = [encryptedPassword];
    }

    // Mettre à jour la connexion
    await query(
      `UPDATE database_info 
       SET name = ?, type = ?, host = ?, port = ?, database_name = ?, 
           username = ?${passwordUpdate}, updated_at = NOW() 
       WHERE id = ? AND user_id = ?`,
      [
        body.name, body.type, body.host, body.port || getDefaultPort(body.type),
        body.database, body.username, ...passwordParams, body.id, user.id
      ]
    );

    return {
      success: true,
      message: 'Connection updated successfully',
      connection: {
        id: body.id,
        name: body.name,
        type: body.type,
        host: body.host,
        port: body.port || getDefaultPort(body.type),
        database_name: body.database,
        database: body.database,
        username: body.username
      }
    };
  } catch (error: any) {
    console.error('Error updating database connection:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to update database connection'
    });
  }
}

/**
 * Gère la suppression d'une connexion
 */
async function handleDeleteConnection(event: H3Event) {
  try {
    const body = await readBody(event);
    const user = event.context.user || { id: 'demo-user' };

    const connectionId = body.id;
    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Connection ID is required'
      });
    }

    // Supprimer la connexion de la base de données
    const result = await query<any>(
      `DELETE FROM database_info WHERE id = ? AND user_id = ?`,
      [connectionId, user.id]
    );

    // Vérifier si une ligne a été supprimée
    if (result && result.affectedRows > 0) {
      console.log(`Connection deleted successfully: ${connectionId}`);
      return {
        success: true,
        message: 'Connection deleted successfully'
      };
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Connection not found or you do not have permission to delete it'
      });
    }
  } catch (error: any) {
    console.error('Error deleting database connection:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Failed to delete database connection'
    });
  }
}

/**
 * Gère le test d'une connexion
 */
async function handleTestConnection(event: H3Event) {
  try {
    const body = await readBody(event);
    const user = event.context.user || { id: 'demo-user' };

    // Validation des entrées
    if (!body.type || !body.host || !body.database || !body.username || !body.password) {
      return {
        success: false,
        message: 'Missing required connection parameters'
      };
    }

    try {
      // Utiliser le module de pool pour tester la connexion
      await getConnectionPool({
        id: 'test-connection',
        type: body.type,
        host: body.host,
        port: body.port || getDefaultPort(body.type),
        database: body.database,
        username: body.username,
        password: body.password
      });

      return {
        success: true,
        message: `Successfully connected to ${body.type} database "${body.database}"`
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('Error testing database connection:', error);
    return {
      success: false,
      message: error.message || 'Failed to connect to database'
    };
  }
}

/**
 * API pour récupérer toutes les connexions d'un utilisateur
 */
export const getDatabaseConnections = defineEventHandler(async (event) => {
  const user = event.context.user || { id: 'demo-user' };

  try {
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
            database: 'demo_db',
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
            database: 'prod_db',
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

/**
 * API pour récupérer une connexion par ID
 */
export const getDatabaseConnection = defineEventHandler(async (event) => {
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