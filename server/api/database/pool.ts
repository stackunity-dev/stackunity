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
    let results;
    let fields;
    let affectedRows;

    switch (type) {
      case 'mysql': {
        if (query.trim().toUpperCase().startsWith('USE')) {
          const [rows, fieldInfo] = await pool.query(query);
          results = rows;
          fields = fieldInfo;
        } else {
          const [rows, fieldInfo] = await pool.execute(query, params);
          results = rows;
          fields = fieldInfo;
        }

        if (!Array.isArray(results) && 'affectedRows' in results) {
          affectedRows = results.affectedRows;
        }
        break;
      }

      case 'postgres': {
        const result = await pool.query(query, params);
        results = result.rows;
        fields = result.fields;
        affectedRows = result.rowCount;
        break;
      }

      case 'mssql': {
        const result = await pool.request()
          .input('params', mssql.TVP, params)
          .query(query);
        results = result.recordset;
        fields = result.recordset?.columns;
        affectedRows = result.rowsAffected[0];
        break;
      }

      case 'sqlite': {
        if (query.trim().toUpperCase().startsWith('SELECT')) {
          results = await pool.all(query, params);
        } else {
          const result = await pool.run(query, params);
          affectedRows = result.changes;
        }
        break;
      }
    }

    return { results, fields, affectedRows };
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