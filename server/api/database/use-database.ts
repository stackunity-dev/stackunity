import { createError, defineEventHandler, readBody } from 'h3';
import { RowDataPacket } from 'mysql2';
import { pool } from '../db';
import { closeConnectionPool, executeQuery, getConnectionPool } from './pool';

interface DatabaseInfo extends RowDataPacket {
  id: string;
  user_id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId, database } = body;

    const user = event.context.user || { id: 'demo-user' };

    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    if (!database) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database name is required'
      });
    }

    try {
      const connectionInfo = await getConnectionInfo(connectionId, user.id);

      if (!connectionInfo) {
        throw new Error('Connection not found or you do not have access to it');
      }

      switch (connectionInfo.type) {
        case 'mysql':
          await executeQuery(connectionId, `USE \`${database}\``);
          break;

        case 'postgres':
          await closeConnectionPool(connectionId);

          await getConnectionPool({
            id: connectionId,
            type: connectionInfo.type,
            host: connectionInfo.host,
            port: connectionInfo.port,
            database: database,
            username: connectionInfo.username,
            password: '',
            encryptedPassword: connectionInfo.password
          });
          break;

        case 'mssql':
          await executeQuery(connectionId, `USE ${database}`);
          break;

        case 'sqlite':
          throw new Error('Changing database in SQLite requires reconnection. Not implemented yet.');

        default:
          throw new Error(`Unsupported database type: ${connectionInfo.type}`);
      }

      await pool.execute(
        'UPDATE database_info SET database_name = ? WHERE id = ? AND user_id = ?',
        [database, connectionId, user.id]
      );

      console.log(`Database changed to ${database} for connection ID: ${connectionId}`);

      return {
        success: true,
        message: `Database changed to ${database}`,
        database
      };
    } catch (error: any) {
      console.error('Error changing database:', error);
      return {
        success: false,
        message: `Failed to change database: ${error.message}`
      };
    }
  } catch (error: any) {
    console.error('Error processing use-database request:', error);
    return {
      success: false,
      error: error.message || 'Failed to change database',
      errorCode: error.statusCode || 500
    };
  }
});

async function getConnectionInfo(connectionId: string, userId: string): Promise<DatabaseInfo | null> {
  try {
    const [rows] = await pool.execute<DatabaseInfo[]>(
      'SELECT * FROM database_info WHERE id = ? AND user_id = ?',
      [connectionId, userId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }

    return null;
  } catch (error) {
    console.error('Error retrieving connection info:', error);
    return null;
  }
} 