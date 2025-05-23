import { createError, defineEventHandler, readBody } from 'h3';
import { executeQuery } from './pool';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { connectionId, table } = body;

    if (!connectionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Database connection ID is required'
      });
    }

    if (!table) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Table name is required'
      });
    }

    try {
      let query;
      let results;

      const typeQuery = await executeQuery(connectionId, 'SELECT 1', []);
      let dbType = 'mysql';

      if (typeQuery.fields) {
        if ('orgTable' in typeQuery.fields[0]) {
          dbType = 'mysql';
        } else if ('tableID' in typeQuery.fields[0]) {
          dbType = 'postgres';
        } else {
          try {
            await executeQuery(connectionId, 'SELECT @@version', []);
            dbType = 'mssql';
          } catch {
            try {
              await executeQuery(connectionId, 'PRAGMA database_list', []);
              dbType = 'sqlite';
            } catch {
              dbType = 'mysql';
            }
          }
        }
      }

      switch (dbType) {
        case 'mysql':
          query = `DESCRIBE \`${table}\``;
          break;
        case 'postgres':
          query = `
            SELECT 
              column_name as Field,
              data_type as Type,
              is_nullable as Null,
              column_default as Default,
              CASE 
                WHEN is_primary_key THEN 'PRI'
                WHEN is_unique THEN 'UNI'
                ELSE ''
              END as Key,
              '' as Extra
            FROM information_schema.columns
            WHERE table_name = '${table}'
            ORDER BY ordinal_position;
          `;
          break;
        case 'mssql':
          query = `
            SELECT 
              c.name as Field,
              t.name as Type,
              CASE WHEN c.is_nullable = 1 THEN 'YES' ELSE 'NO' END as Null,
              CASE WHEN pk.column_id IS NOT NULL THEN 'PRI' ELSE '' END as Key,
              CASE WHEN c.default_object_id != 0 THEN OBJECT_DEFINITION(c.default_object_id) ELSE NULL END as Default,
              '' as Extra
            FROM sys.columns c
            INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
            LEFT JOIN (
              SELECT ic.column_id, ic.object_id
              FROM sys.index_columns ic
              INNER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
              WHERE i.is_primary_key = 1
            ) pk ON c.object_id = pk.object_id AND c.column_id = pk.column_id
            WHERE c.object_id = OBJECT_ID('${table}')
            ORDER BY c.column_id;
          `;
          break;
        case 'sqlite':
          query = `PRAGMA table_info('${table}')`;
          break;
        default:
          throw new Error(`Unsupported database type: ${dbType}`);
      }

      results = await executeQuery(connectionId, query, []);

      if (!results.results || !Array.isArray(results.results)) {
        throw new Error('Failed to retrieve table structure');
      }

      return {
        success: true,
        structure: results.results
      };
    } catch (error: any) {
      console.error('Error getting table structure:', error);
      return {
        success: false,
        message: error.message || 'Failed to get table structure'
      };
    }
  } catch (error: any) {
    console.error('Error processing describe request:', error);
    return {
      success: false,
      message: error.message || 'Failed to process describe request'
    };
  }
});