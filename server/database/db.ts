import * as crypto from 'crypto';
import * as fs from 'fs';
import { Pool } from 'mysql2/promise';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { pool as poolApi } from '../api/db';

// Utilisez directement le pool existant au lieu d'en créer un nouveau
let pool: Pool | null = poolApi;

export async function initDatabase() {
  try {
    if (!pool) {
      console.error('Database pool is not initialized');
      return false;
    }

    const connection = await pool.getConnection();
    console.log('Database connection established successfully');

    await initSchema();

    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

async function initSchema() {
  if (!pool) return;

  try {
    const schemaPath = path.join(process.cwd(), 'server', 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const queries = schema
      .split(';')
      .filter(query => query.trim().length > 0)
      .map(query => query.trim() + ';');

    for (const query of queries) {
      await pool.query(query);
    }

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

export async function getConnection() {
  if (!pool) {
    await initDatabase();
  }

  if (!pool) {
    throw new Error('Database connection not initialized');
  }

  return pool.getConnection();
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  if (!pool) {
    await initDatabase();
  }

  if (!pool) {
    throw new Error('Database connection not initialized');
  }

  try {
    const [rows] = await pool.query(sql, params);
    return rows as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export function encryptSensitiveData(data: string): string {
  if (!data) return '';

  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'stackunity-secret-key', 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

export function decryptSensitiveData(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return '';

  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'stackunity-secret-key', 'salt', 32);

    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export function generateId(): string {
  return uuidv4();
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
} 