import { createError, defineEventHandler, getRequestHeaders, H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'
import { pool } from '../api/db'

// Routes accessibles sans authentification
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/refresh',
  '/api/auth/session',
  '/api/auth/logout',
  '/api/auth/register',
  '/api/newsletter/unsubscribe',
  '/api/newsletter/subscribe',
  '/api/health',
  '/api/public',
  '/api/analytics',
  '/api/analytics/collect',
  '/api/marketing/collect',
  '/api/cookies',
  '/signup',
  '/login',
  '/',
  '/favicon.ico',
  '/assets/',
  '/_nuxt/',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/api/payment/webhook',
  '/api/payment/create-intent'
]

const adminRoutes = [
  '/newsletter-admin',
  '/api/newsletter/stats',
  '/api/admin',
  '/api/analytics',
  '/admin/analytics',
  '/admin/marketing',
  '/api/marketing',
  '/api/cookies'
]

const premiumRoutes = [
  '/sql-generator',
  '/seo-audit',
  '/robots',
  '/api/seo-audit',
  '/api/seo-audit.pdf',
  '/api/sql-schema'
]

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const SESSION_COOKIE_NAME = 'devunity_session_token'

// Secret pour le token d'accès
// const ACCESS_TOKEN_SECRET = 'access_token_secret_key' // Cette ligne est maintenant commentée, nous utilisons l'import

interface JwtPayload {
  userId: number;
  id?: number;   // Pour la compatibilité avec les anciens tokens
  username?: string;
  email?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  is_premium: boolean;
}

export default defineEventHandler(async (event: H3Event) => {
  const url = event.node.req.url;
  console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Middleware auth - URL:', url);

  // Vérifier si la route est publique
  if (publicRoutes.some(route => url?.startsWith(route))) {
    console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Route publique détectée:', url);
    return;
  }

  // Récupérer le token depuis les headers
  const authHeader = getRequestHeaders(event)['Authorization'] || getRequestHeaders(event)['authorization'];
  if (!authHeader) {
    console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Token manquant pour la route:', url);
    throw createError({
      statusCode: 401,
      message: 'Token manquant'
    });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Token invalide pour la route:', url);
    throw createError({
      statusCode: 401,
      message: 'Token invalide'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '') as JwtPayload;
    console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Token décodé:', decoded);

    // Utiliser userId ou id selon ce qui est disponible
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'ID utilisateur manquant dans le token');
      throw createError({
        statusCode: 401,
        message: 'Token invalide - ID utilisateur manquant'
      });
    }

    // Vérifier si l'utilisateur existe dans la base de données
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, username, email, is_admin, is_premium FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Utilisateur non trouvé pour l\'ID:', userId);
      throw createError({
        statusCode: 401,
        message: 'Utilisateur non trouvé'
      });
    }

    const user = rows[0];

    // Vérifier les permissions pour les routes admin et premium
    if (adminRoutes.some(route => url?.startsWith(route)) && !user.is_admin) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Accès admin refusé pour:', url);
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      });
    }

    if (premiumRoutes.some(route => url?.startsWith(route)) && !user.is_premium) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Accès premium refusé pour:', url);
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      });
    }

    // Ajouter les informations utilisateur au contexte
    event.context.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.is_admin,
      isPremium: user.is_premium
    };

    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });

  } catch (error: any) {
    console.error('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Erreur d\'authentification:', error);
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        message: 'Token expiré'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        message: 'Token invalide'
      });
    }
    throw createError({
      statusCode: 401,
      message: error.message || 'Erreur d\'authentification'
    });
  }
});

function setResponseHeaders(event: H3Event, headers: Record<string, string>) {
  for (const [key, value] of Object.entries(headers)) {
    event.node.res.setHeader(key, value);
  }
}
