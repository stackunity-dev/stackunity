import * as mysql from 'mysql2/promise';
import { Pool, PoolConnection } from 'mysql2/promise';

// Vérifier que toutes les variables d'environnement nécessaires sont définies
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement ${envVar} manquante`);
  }
}

// Configuration du pool de connexion
export const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '25060'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connexion à la base de données établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return false;
  }
}

// Gestion des erreurs du pool
pool.on('connection', (connection: PoolConnection) => {
  connection.on('error', (err: Error & { code?: string }) => {
    console.error('Erreur de connexion à la base de données:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connexion à la base de données perdue');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de données a trop de connexions');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('La connexion à la base de données a été refusée');
    }
  });
});
