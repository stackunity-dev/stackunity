import { defineEventHandler, readBody } from 'h3';
import { query } from '../../database/db';
import { getUserId } from '../../utils/auth-utils';
import { executeQuery, getConnectionPool } from './pool';

export default defineEventHandler(async (event) => {
  try {
    const { connectionId, orderBy = 'DESC', dbType } = await readBody(event);
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
            table_name AS 'Table',
            ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)',
            table_rows AS 'Rows'
          FROM information_schema.tables 
          WHERE table_schema = '${connection.database_name}'
          ORDER BY (data_length + index_length) ${orderBy}
        `;
        break;
      case 'postgresql':
        sqlQuery = `
          SELECT 
            relname AS "Table",
            pg_size_pretty(pg_total_relation_size(relid)) AS "Size",
            n_live_tup AS "Rows"
          FROM pg_stat_user_tables
          ORDER BY pg_total_relation_size(relid) ${orderBy}
        `;
        break;
      case 'mssql':
        sqlQuery = `
          SELECT 
            t.name AS 'Table',
            CAST(ROUND(SUM(p.rows) * 8.0 / 1024, 2) AS DECIMAL(10,2)) AS 'Size (MB)',
            SUM(p.rows) AS 'Rows'
          FROM sys.tables t
          INNER JOIN sys.partitions p ON t.object_id = p.object_id
          GROUP BY t.name
          ORDER BY SUM(p.rows) * 8.0 / 1024 ${orderBy}
        `;
        break;
      case 'sqlite':
        sqlQuery = `
          SELECT 
            name AS 'Table',
            page_count * page_size / 1024 / 1024 AS 'Size (MB)',
            (SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=tbl.name) AS 'Rows'
          FROM sqlite_master AS tbl
          WHERE type='table'
          ORDER BY page_count * page_size ${orderBy}
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
      { title: 'Size (MB)', key: 'size_mb' },
      { title: 'Rows', key: 'rows' }
    ];

    return {
      success: true,
      results: result.results,
      headers
    };

  } catch (error: any) {
    console.error('Erreur lors du calcul de l\'utilisation de la base de données:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors du calcul de l\'utilisation de la base de données',
      code: error.code,
      sqlState: error.sqlState
    };
  }
});