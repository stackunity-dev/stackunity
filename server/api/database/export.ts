import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3';
import { executeQuery } from './pool';

// Define interfaces for better type safety
interface TableExport {
  name: string;
  structure: any[];
  data: any[];
  error?: string;
}

interface DatabaseExport {
  database: string;
  type: string;
  tables: TableExport[];
  exported_at: string;
}

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

    // Get database type from a query instead of using pool directly
    let dbType = 'unknown';
    try {
      // Try to determine database type from connection
      const typeQuery = await executeQuery(connectionId, 'SELECT 1', []);

      // Check connection type based on field structure
      if (typeQuery.fields) {
        if ('orgTable' in typeQuery.fields[0]) {
          dbType = 'mysql';
        } else if ('tableID' in typeQuery.fields[0]) {
          dbType = 'postgres';
        } else {
          // For MSSQL and SQLite, we'll try specific queries
          try {
            await executeQuery(connectionId, 'SELECT @@version', []);
            dbType = 'mssql';
          } catch {
            try {
              await executeQuery(connectionId, 'PRAGMA database_list', []);
              dbType = 'sqlite';
            } catch {
              // Default to mysql if we can't determine
              dbType = 'mysql';
            }
          }
        }
      }
    } catch (error) {
      console.error('Error determining database type:', error);
      // Default to MySQL if we can't determine the type
      dbType = 'mysql';
    }

    let dbName = 'database';
    let tables: string[] = [];

    // Get database name based on database type
    try {
      let databaseInfo;
      if (dbType === 'mysql') {
        databaseInfo = await executeQuery(connectionId, 'SELECT DATABASE() as db_name', []);
        dbName = databaseInfo.results?.[0]?.db_name || 'database';
      } else if (dbType === 'postgres') {
        databaseInfo = await executeQuery(connectionId, 'SELECT current_database() as db_name', []);
        dbName = databaseInfo.results?.[0]?.db_name || 'database';
      } else if (dbType === 'mssql') {
        databaseInfo = await executeQuery(connectionId, 'SELECT DB_NAME() as db_name', []);
        dbName = databaseInfo.results?.[0]?.db_name || 'database';
      } else if (dbType === 'sqlite') {
        dbName = 'sqlite_database';
      }
    } catch (error) {
      console.error('Error getting database name:', error);
      // Continue with default name if there's an error
    }

    // Get list of tables based on database type
    let tablesResult;
    if (dbType === 'mysql') {
      tablesResult = await executeQuery(connectionId, 'SHOW TABLES', []);
    } else if (dbType === 'postgres') {
      tablesResult = await executeQuery(
        connectionId,
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
        []
      );
    } else if (dbType === 'mssql') {
      tablesResult = await executeQuery(
        connectionId,
        "SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE'",
        []
      );
    } else if (dbType === 'sqlite') {
      tablesResult = await executeQuery(
        connectionId,
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
        []
      );
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }

    if (!tablesResult.results || !Array.isArray(tablesResult.results)) {
      throw new Error('Failed to retrieve tables');
    }

    // Extract table names based on database type
    if (dbType === 'mysql') {
      tables = tablesResult.results.map(row => String(Object.values(row)[0]));
    } else if (dbType === 'postgres') {
      tables = tablesResult.results.map(row => String(row.table_name));
    } else if (dbType === 'mssql') {
      tables = tablesResult.results.map(row => String(row.table_name));
    } else if (dbType === 'sqlite') {
      tables = tablesResult.results.map(row => String(row.name));
    }

    const databaseExport: DatabaseExport = {
      database: dbName,
      type: dbType,
      tables: [],
      exported_at: new Date().toISOString()
    };

    // Process each table
    for (const tableName of tables) {
      try {
        // Get table structure based on database type
        let structureQuery;
        let structureResult;

        if (dbType === 'mysql') {
          structureQuery = `DESCRIBE \`${tableName}\``;
        } else if (dbType === 'postgres') {
          structureQuery = `
            SELECT column_name as "Field", 
                   data_type as "Type", 
                   is_nullable as "Null", 
                   column_default as "Default",
                   (CASE WHEN pk.column_name IS NOT NULL THEN 'PRI' ELSE '' END) as "Key"
            FROM information_schema.columns c
            LEFT JOIN (
                SELECT ku.column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage ku
                    ON tc.constraint_name = ku.constraint_name
                WHERE tc.constraint_type = 'PRIMARY KEY'
                AND tc.table_name = '${tableName}'
            ) pk ON c.column_name = pk.column_name
            WHERE c.table_name = '${tableName}'
          `;
        } else if (dbType === 'mssql') {
          structureQuery = `
            SELECT c.name as "Field", 
                   t.name as "Type",
                   (CASE WHEN c.is_nullable = 1 THEN 'YES' ELSE 'NO' END) as "Null",
                   d.definition as "Default",
                   (CASE WHEN pk.column_id IS NOT NULL THEN 'PRI' ELSE '' END) as "Key"
            FROM sys.columns c
            JOIN sys.types t ON c.user_type_id = t.user_type_id
            LEFT JOIN sys.default_constraints d ON c.default_object_id = d.object_id
            LEFT JOIN (
                SELECT ic.column_id
                FROM sys.index_columns ic
                JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
                WHERE i.is_primary_key = 1
                AND OBJECT_NAME(ic.object_id) = '${tableName}'
            ) pk ON c.column_id = pk.column_id
            WHERE OBJECT_NAME(c.object_id) = '${tableName}'
          `;
        } else if (dbType === 'sqlite') {
          structureQuery = `PRAGMA table_info(\`${tableName}\`)`;
        }

        structureResult = await executeQuery(connectionId, structureQuery, []);

        if (!structureResult.results || !Array.isArray(structureResult.results)) {
          console.error(`Failed to get structure for table ${tableName}`);
          continue;
        }

        // Get table data (limit to 1000 rows to prevent memory issues)
        const dataQuery = dbType === 'mysql' || dbType === 'sqlite'
          ? `SELECT * FROM \`${tableName}\` LIMIT 1000`
          : `SELECT * FROM "${tableName}" LIMIT 1000`;

        const dataResult = await executeQuery(connectionId, dataQuery, []);

        // Add table info to export
        const tableExport: TableExport = {
          name: tableName,
          structure: structureResult.results,
          data: dataResult.results || []
        };

        databaseExport.tables.push(tableExport);
      } catch (error: any) {
        console.error(`Error processing table ${tableName}:`, error);
        // Continue with next table if there's an error
        const errorTableExport: TableExport = {
          name: tableName,
          structure: [],
          data: [],
          error: error.message
        };

        databaseExport.tables.push(errorTableExport);
      }
    }

    // Set response headers for file download
    setResponseHeader(event, 'Content-Type', 'application/json');
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${dbName}_export.json"`);

    return databaseExport;

  } catch (error: any) {
    console.error('Error exporting database:', error);

    return {
      success: false,
      error: error.message || 'Failed to export database',
      errorCode: error.statusCode || 500
    };
  }
}); 