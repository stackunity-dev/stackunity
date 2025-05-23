import { createError, defineEventHandler, readBody } from 'h3';
import { decryptSensitiveData, query } from '../../database/db';
import { getUserId } from '../../utils/auth-utils';
import { getConnectionPool, testConnection } from './pool';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId } = body;

    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    const userId = getUserId(event);

    const connections = await query<any[]>(
      `SELECT id, name, type, host, port, database_name, username, 
              password_encrypted, created_at, updated_at
       FROM database_info 
       WHERE id = ? AND user_id = ?`,
      [connectionId, userId]
    );

    if (!connections || connections.length === 0) {
      if (connectionId.startsWith('demo')) {
        const demoConnection = {
          id: connectionId,
          name: connectionId === 'demo1' ? 'MySQL Demo' : 'PostgreSQL Demo',
          type: connectionId === 'demo1' ? 'mysql' : 'postgres',
          host: 'localhost',
          port: connectionId === 'demo1' ? 3306 : 5432,
          database: 'demo_db',
          username: 'demo_user',
          password: 'demo_password' // Mot de passe en clair pour la démo
        };

        // Créer ou récupérer le pool de connexion
        try {
          await getConnectionPool({
            id: connectionId,
            type: demoConnection.type,
            host: demoConnection.host,
            port: demoConnection.port,
            database: demoConnection.database,
            username: demoConnection.username,
            password: demoConnection.password
          });

          // Mettre à jour la date de dernière utilisation
          await query(
            `UPDATE database_info SET last_used_at = NOW() WHERE id = ?`,
            [connectionId]
          ).catch(() => { }); // Ignorer les erreurs si la connexion n'existe pas

          console.log(`Demo connection established to ${demoConnection.type} database: ${demoConnection.database}`);

          return {
            success: true,
            message: `Connected to ${demoConnection.type} database: ${demoConnection.database}`,
            database: demoConnection.database
          };
        } catch (error: any) {
          console.error('Error establishing demo database connection:', error);
          return {
            success: false,
            message: `Failed to connect: ${error.message}`
          };
        }
      }

      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Connection not found or you do not have access to it'
      });
    }

    const connectionInfo = connections[0];

    // Déchiffrer le mot de passe
    const password = decryptSensitiveData(connectionInfo.password_encrypted);

    if (!password) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to decrypt database password'
      });
    }

    // Créer ou récupérer le pool de connexion
    try {
      await getConnectionPool({
        id: connectionId,
        type: connectionInfo.type,
        host: connectionInfo.host,
        port: connectionInfo.port,
        database: connectionInfo.database_name,
        username: connectionInfo.username,
        password: password
      });

      // Vérification de disponibilité réelle
      const isAvailable = await testConnection({
        id: connectionId,
        type: connectionInfo.type,
        host: connectionInfo.host,
        port: connectionInfo.port,
        database: connectionInfo.database_name,
        username: connectionInfo.username,
        password: password
      });
      if (!isAvailable) {
        return {
          success: false,
          message: 'Database is not available or cannot be reached.'
        };
      }

      await query(
        `UPDATE database_info SET last_used_at = NOW() WHERE id = ?`,
        [connectionId]
      );

      console.log(`Connection established to ${connectionInfo.type} database: ${connectionInfo.database_name}`);

      return {
        success: true,
        message: `Connected to ${connectionInfo.type} database: ${connectionInfo.database_name}`,
        database: connectionInfo.database_name
      };
    } catch (error: any) {
      console.error('Error establishing database connection:', error);
      const errMsg = error.message?.toLowerCase() || '';
      if (
        errMsg.includes('econnrefused') ||
        errMsg.includes('timeout') ||
        errMsg.includes('not allowed') ||
        errMsg.includes('host unreachable') ||
        errMsg.includes('access denied') ||
        errMsg.includes('no route') ||
        errMsg.includes('network')
      ) {
        return {
          success: false,
          message: 'Connection refused or blocked. Please check your database firewall, allowed IPs, or network settings.'
        };
      }
      return {
        success: false,
        message: `Failed to connect: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('Error processing connection request:', error);
    return {
      success: false,
      error: error.message || 'Failed to establish database connection',
      errorCode: error.statusCode || 500
    };
  }
});
