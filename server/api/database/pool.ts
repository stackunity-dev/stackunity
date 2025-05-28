import * as mssql from 'mssql';
import * as mysql from 'mysql2/promise';
import * as pg from 'pg';
import { open } from 'sqlite';
import * as sqlite3 from 'sqlite3';
import { decryptData } from './connection';

const pools: Record<string, any> = {};

interface ConnectionOptions {
  id: string;
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  encryptedPassword?: string;
}

export async function getConnectionPool(options: ConnectionOptions) {
  if (pools[options.id]) {
    return pools[options.id];
  }

  const password = options.encryptedPassword
    ? decryptData(options.encryptedPassword)
    : options.password;

  try {
    let pool;

    switch (options.type.toLowerCase()) {
      case 'mysql':
        pool = mysql.createPool({
          host: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database,
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        });
        break;

      case 'postgres':
        pool = new pg.Pool({
          host: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database,
          max: 10,
          idleTimeoutMillis: 30000
        });
        break;

      case 'mssql':
        pool = await mssql.connect({
          server: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database,
          options: {
            encrypt: true,
            trustServerCertificate: true
          },
          pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
          }
        });
        break;

      case 'sqlite':
        pool = await open({
          filename: options.database,
          driver: sqlite3.Database
        });
        break;

      default:
        throw new Error(`Unsupported database type: ${options.type}`);
    }

    pools[options.id] = {
      pool,
      type: options.type.toLowerCase(),
      lastUsed: Date.now()
    };

    console.log(`Connection pool created for ${options.type} database: ${options.database}`);
    return pools[options.id];
  } catch (error) {
    console.error(`Failed to create connection pool: ${error.message}`);
    throw error;
  }
}


export async function testConnection(options: ConnectionOptions): Promise<boolean> {
  const password = options.encryptedPassword
    ? decryptData(options.encryptedPassword)
    : options.password;

  try {
    switch (options.type.toLowerCase()) {
      case 'mysql': {
        const connection = await mysql.createConnection({
          host: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database
        });
        await connection.ping();
        await connection.end();
        break;
      }

      case 'postgres': {
        const client = new pg.Client({
          host: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database,
          connectionTimeoutMillis: 5000
        });
        await client.connect();
        await client.query('SELECT 1');
        await client.end();
        break;
      }

      case 'mssql': {
        const pool = new mssql.ConnectionPool({
          server: options.host,
          port: options.port,
          user: options.username,
          password: password,
          database: options.database,
          options: {
            encrypt: true,
            trustServerCertificate: true
          },
          connectionTimeout: 5000
        });
        await pool.connect();
        await pool.request().query('SELECT 1');
        await pool.close();
        break;
      }

      case 'sqlite': {
        const db = await open({
          filename: options.database,
          driver: sqlite3.Database
        });
        await db.get('SELECT 1');
        await db.close();
        break;
      }

      default:
        throw new Error(`Unsupported database type: ${options.type}`);
    }

    return true;
  } catch (error) {
    console.error(`Connection test failed: ${error.message}`);
    throw error;
  }
}

export async function executeQuery(connectionId: string, query: string, params: any[] = []) {
  const poolInfo = pools[connectionId];
  if (!poolInfo) {
    throw new Error(`No active connection pool for connection ID: ${connectionId}`);
  }

  const { pool, type } = poolInfo;
  poolInfo.lastUsed = Date.now();

  try {
    const queries = query.split(';').filter(q => q.trim());
    const allResults: any[] = [];
    const allFields: any[] = [];
    let totalAffectedRows = 0;

    for (const singleQuery of queries) {
      if (!singleQuery.trim()) continue;

      let results;
      let fields;
      let affectedRows;

      switch (type) {
        case 'mysql': {
          if (singleQuery.trim().toUpperCase().startsWith('USE')) {
            const [rows, fieldInfo] = await pool.query(singleQuery);
            results = rows;
            fields = fieldInfo;
          } else if (singleQuery.toUpperCase().includes('MEDIAN(')) {
            const match = singleQuery.match(/SELECT\s+MEDIAN\((\w+)\)\s+FROM\s+(\w+)/i);
            if (!match) throw new Error("Unsupported MEDIAN() usage format. Use: SELECT MEDIAN(column) FROM table;");
            const [_, column, table] = match;
            const transformedQuery = await transformMedianQuery(pool, column, table);

            const [rows, fieldInfo] = await pool.query(transformedQuery);
            results = rows;
            fields = fieldInfo;
          } else if (singleQuery.toUpperCase().includes('MODE(')) {
            const match = singleQuery.match(/SELECT\s+MODE\((\w+)\)\s+FROM\s+(\w+)/i);
            if (!match) throw new Error("Unsupported MODE() usage format. Use: SELECT MODE(column) FROM table;");
            const [_, column, table] = match;
            const transformedQuery = await transformModeQuery(pool, column, table);

            const [rows, fieldInfo] = await pool.query(transformedQuery);
            results = rows;
            fields = fieldInfo;
          } else if (singleQuery.toUpperCase().includes('SUMMARY(')) {
            const match = singleQuery.match(/SELECT\s+SUMMARY\((\w+)\)\s+FROM\s+(\w+)/i);
            if (!match) throw new Error("Unsupported SUMMARY() usage format. Use: SELECT SUMMARY(column) FROM table;");
            const [_, column, table] = match;
            const transformedQuery = await transformSummaryQuery(pool, column, table);

            const [rows, fieldInfo] = await pool.query(transformedQuery);
            results = rows;
            fields = fieldInfo;
          } else {
            const [rows, fieldInfo] = await pool.execute(singleQuery, params);
            results = rows;
            fields = fieldInfo;
          }

          if (results && typeof results === 'object' && 'affectedRows' in results) {
            affectedRows = results.affectedRows;
          }

          break;
        }

        case 'postgres': {
          const result = await pool.query(singleQuery, params);
          results = result.rows;
          fields = result.fields;
          affectedRows = result.rowCount;
          break;
        }

        case 'mssql': {
          const result = await pool.request()
            .input('params', mssql.TVP, params)
            .query(singleQuery);
          results = result.recordset;
          fields = result.recordset?.columns;
          affectedRows = result.rowsAffected[0];
          break;
        }

        case 'sqlite': {
          if (singleQuery.trim().toUpperCase().startsWith('SELECT')) {
            results = await pool.all(singleQuery, params);
          } else {
            const result = await pool.run(singleQuery, params);
            affectedRows = result.changes;
          }
          break;
        }
      }

      allResults.push(results);
      allFields.push(fields);
      totalAffectedRows += affectedRows || 0;
    }

    return {
      results: allResults.flat(),
      fields: allFields.flat(),
      affectedRows: totalAffectedRows
    };
  } catch (error) {
    console.error(`Query execution error: ${error.message}`);

    const sqlError = {
      message: error.message,
      code: error.code || error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    };

    throw sqlError;
  }
}


export async function closeConnectionPool(connectionId: string): Promise<boolean> {
  const poolInfo = pools[connectionId];
  if (!poolInfo) {
    return false;
  }

  try {
    const { pool, type } = poolInfo;

    switch (type) {
      case 'mysql':
        await pool.end();
        break;
      case 'postgres':
        await pool.end();
        break;
      case 'mssql':
        await pool.close();
        break;
      case 'sqlite':
        await pool.close();
        break;
    }

    delete pools[connectionId];
    console.log(`Connection pool closed for ID: ${connectionId}`);
    return true;
  } catch (error) {
    console.error(`Error closing connection pool: ${error.message}`);
    return false;
  }
}


export async function cleanupIdlePools(maxIdleTime: number = 30 * 60 * 1000): Promise<void> {
  const now = Date.now();
  const connectionIds = Object.keys(pools);

  for (const id of connectionIds) {
    const poolInfo = pools[id];
    if (now - poolInfo.lastUsed > maxIdleTime) {
      await closeConnectionPool(id);
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanupIdlePools().catch(err => {
      console.error('Error during idle pool cleanup:', err);
    });
  }, 15 * 60 * 1000);
}

async function transformMedianQuery(pool: any, column: string, table: string): Promise<string> {
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM ${table} WHERE ${column} IS NOT NULL`);
  const offset = total % 2 === 0 ? (total / 2) - 1 : Math.floor(total / 2);
  const limit = 2 - (total % 2);

  return `
    SELECT AVG(${column}) AS median FROM (
      SELECT ${column}
      FROM ${table}
      WHERE ${column} IS NOT NULL
      ORDER BY ${column}
      LIMIT ${limit} OFFSET ${offset}
    ) AS sub;
  `;
}

async function transformModeQuery(pool: any, column: string, table: string): Promise<string> {
  return `
    SELECT ${column}
    FROM (
      SELECT ${column}, COUNT(*) AS freq
      FROM ${table}
      WHERE ${column} IS NOT NULL
      GROUP BY ${column}
      ORDER BY freq DESC
      LIMIT 1
    ) AS sub;
  `;
}

async function transformSummaryQuery(pool: any, column: string, table: string): Promise<string> {
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM ${table} WHERE ${column} IS NOT NULL`);

  const offset = Math.floor((total - 1) / 2);
  const limit = total % 2 === 0 ? 2 : 1;

  return `
    SELECT
      COUNT(${column}) AS count_value,
      MIN(${column}) AS min_value,
      MAX(${column}) AS max_value,
      AVG(${column}) AS avg_value,
      (
        SELECT AVG(sub.${column}) FROM (
          SELECT ${column} FROM ${table}
          WHERE ${column} IS NOT NULL
          ORDER BY ${column}
          LIMIT ${limit} OFFSET ${offset}
        ) AS sub
      ) AS median_value,
      (
        SELECT ${column} FROM ${table}
        WHERE ${column} IS NOT NULL
        GROUP BY ${column}
        ORDER BY COUNT(*) DESC
        LIMIT 1
      ) AS mode_value
    FROM ${table}
    WHERE ${column} IS NOT NULL
  `;
}
