import { defineEventHandler, readBody } from 'h3';
import { query } from '../../database/db';
import { getUserId } from '../../utils/auth-utils';
import { executeQuery, getConnectionPool } from './pool';

export default defineEventHandler(async (event) => {
  try {
    const { connectionId, dbType } = await readBody(event);
    const userId = getUserId(event);

    const connections = await query<any[]>(
      `SELECT id, name, type, host, port, database_name, username, 
              password_encrypted, created_at, updated_at
       FROM database_info 
       WHERE id = ? AND user_id = ?`,
      [connectionId, userId]
    );

    if (!connections || connections.length === 0) {
      return {
        success: false,
        message: 'Connexion non trouvée'
      };
    }

    const connection = connections[0];
    const poolInfo = await getConnectionPool({
      id: connectionId,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database_name,
      username: connection.username,
      password: connection.password_encrypted
    });

    let sqlQuery = '';
    switch (dbType) {
      case 'mysql':
        sqlQuery = `
          SELECT 
            TABLE_NAME as 'Table',
            COLUMN_NAME as 'Column',
            REFERENCED_TABLE_NAME as 'References Table',
            REFERENCED_COLUMN_NAME as 'References Column',
            CONSTRAINT_NAME as 'Constraint Name'
          FROM information_schema.KEY_COLUMN_USAGE
          WHERE REFERENCED_TABLE_SCHEMA = '${connection.database_name}'
          AND REFERENCED_TABLE_NAME IS NOT NULL
          ORDER BY TABLE_NAME, COLUMN_NAME
        `;
        break;
      case 'postgresql':
        sqlQuery = `
          SELECT
            tc.table_name as "Table",
            kcu.column_name as "Column",
            ccu.table_name as "References Table",
            ccu.column_name as "References Column",
            tc.constraint_name as "Constraint Name"
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON tc.constraint_name = kcu.constraint_name
          JOIN information_schema.constraint_column_usage ccu
            ON ccu.constraint_name = tc.constraint_name
          WHERE tc.constraint_type = 'FOREIGN KEY'
          ORDER BY tc.table_name, kcu.column_name
        `;
        break;
      case 'mssql':
        sqlQuery = `
          SELECT 
            OBJECT_NAME(f.parent_object_id) as 'Table',
            COL_NAME(fc.parent_object_id, fc.parent_column_id) as 'Column',
            OBJECT_NAME(f.referenced_object_id) as 'References Table',
            COL_NAME(fc.referenced_object_id, fc.referenced_column_id) as 'References Column',
            f.name as 'Constraint Name'
          FROM sys.foreign_keys f
          INNER JOIN sys.foreign_key_columns fc
            ON f.object_id = fc.constraint_object_id
          ORDER BY OBJECT_NAME(f.parent_object_id), COL_NAME(fc.parent_object_id, fc.parent_column_id)
        `;
        break;
      case 'sqlite':
        sqlQuery = `
          SELECT 
            m.name as 'Table',
            p.name as 'Column',
            'N/A' as 'References Table',
            'N/A' as 'References Column',
            'N/A' as 'Constraint Name'
          FROM sqlite_master m
          JOIN pragma_table_info(m.name) p
          WHERE m.type = 'table'
          ORDER BY m.name, p.name
        `;
        break;
      default:
        return {
          success: false,
          message: 'Type de base de données non supporté'
        };
    }

    const result = await executeQuery(connectionId, sqlQuery, []);

    const headers = [
      { title: 'Table', key: 'table' },
      { title: 'Column', key: 'column' },
      { title: 'References Table', key: 'references_table' },
      { title: 'References Column', key: 'references_column' },
      { title: 'Constraint Name', key: 'constraint_name' }
    ];

    return {
      success: true,
      results: result.results,
      headers
    };

  } catch (error: any) {
    console.error('Erreur lors de la récupération des relations:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de la récupération des relations',
      code: error.code,
      sqlState: error.sqlState
    };
  }
}); 