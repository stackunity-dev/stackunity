import { createError, defineEventHandler, readBody } from 'h3';
import type { RowDataPacket } from 'mysql2/promise';
import type { TablePreview } from '../../../types/database';
import { query } from '../../database/db';
import { getConnectionPool } from './pool';

interface ColumnInfo extends RowDataPacket {
  COLUMN_NAME: string;
}

interface ConnectionInfo extends RowDataPacket {
  id: string;
  type: string;
  host: string;
  port: number;
  database_name: string;
  username: string;
  password_encrypted: string;
}

export default defineEventHandler(async (event): Promise<{ success: boolean; data: TablePreview }> => {
  try {
    const { connectionId, table, limit = 10 } = await readBody(event);

    // Récupérer les informations de connexion
    const [connectionInfo] = await query<ConnectionInfo[]>(
      'SELECT * FROM database_info WHERE id = ?',
      [connectionId]
    );

    if (!connectionInfo) {
      throw createError({
        statusCode: 404,
        message: 'Connection not found'
      });
    }

    const connection = await getConnectionPool({
      id: connectionId,
      type: connectionInfo.type,
      host: connectionInfo.host,
      port: connectionInfo.port,
      database: connectionInfo.database_name,
      username: connectionInfo.username,
      password: connectionInfo.password_encrypted
    });

    if (!connection) {
      throw createError({
        statusCode: 500,
        message: 'Failed to establish database connection'
      });
    }

    const columns = await query<ColumnInfo[]>(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [connection.database, table]);

    const columnNames = columns.map(col => col.COLUMN_NAME);

    const rows = await query<Record<string, any>[]>(`
      SELECT *
      FROM ${table}
      LIMIT ?
    `, [limit]);

    return {
      success: true,
      data: {
        columns: columnNames,
        rows
      }
    };

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'aperçu:', error);
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Erreur lors de la récupération de l\'aperçu de la table'
    });
  }
}); 