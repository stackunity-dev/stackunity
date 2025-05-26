import { createError, defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2/promise';
import { query } from '../../database/db';
import { getConnectionPool } from './pool';

interface ConnectionInfo extends RowDataPacket {
  id: string;
  type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password_encrypted: string;
}

interface CreateTableResult extends RowDataPacket {
  'Create Table': string;
}

interface CreateViewResult extends RowDataPacket {
  'Create View': string;
}

interface IndexInfoResult extends RowDataPacket {
  Table: string;
  Column_name: string;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; definition: string }> => {
  try {
    const { connectionId, objectName, objectType } = await readBody(event);

    // Récupérer les informations de connexion
    const connectionInfo = await query<ConnectionInfo[]>(
      'SELECT * FROM database_info WHERE id = ?',
      [connectionId]
    );

    if (!connectionInfo[0]) {
      throw createError({
        statusCode: 404,
        message: 'Connection not found'
      });
    }

    const connection = await getConnectionPool({
      id: connectionId,
      type: connectionInfo[0].type,
      host: connectionInfo[0].host,
      port: connectionInfo[0].port,
      database: connectionInfo[0].database_name,
      username: connectionInfo[0].username,
      password: connectionInfo[0].password_encrypted
    });

    if (!connection) {
      throw createError({
        statusCode: 500,
        message: 'Failed to establish database connection'
      });
    }

    let definition = '';

    switch (objectType) {
      case 'table':
        const createTable = await query<CreateTableResult[]>(`
          SHOW CREATE TABLE ${objectName}
        `);
        definition = createTable[0]['Create Table'];
        break;

      case 'view':
        const createView = await query<CreateViewResult[]>(`
          SHOW CREATE VIEW ${objectName}
        `);
        definition = createView[0]['Create View'];
        break;

      case 'index':
        const indexInfo = await query<IndexInfoResult[]>(`
          SHOW INDEX FROM ${objectName}
        `);
        definition = `CREATE INDEX ${objectName} ON ${indexInfo[0].Table} (${indexInfo.map(i => i.Column_name).join(', ')});`;
        break;

      default:
        throw createError({
          statusCode: 400,
          message: 'Type d\'objet non supporté'
        });
    }

    return {
      success: true,
      definition
    };

  } catch (error) {
    console.error('Erreur lors de la récupération de la définition:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération de la définition de l\'objet'
    });
  }
}); 