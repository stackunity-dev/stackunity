import { createError, defineEventHandler, getRequestHeaders, H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import { RowDataPacket } from 'mysql2'
import { pool } from '../api/db'
import { ACCESS_TOKEN_SECRET } from '../utils/auth-config'

// Routes accessibles sans authentification
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/newsletter/unsubscribe',
  '/api/newsletter/subscribe',
  '/signup',
  '/login',
  '/',
  '/api/health',
  '/api/public',
  '/api/auth/forgot-password',
  '/api/cookies',
  '/api/analytics',
  '/api/auth/session',
  '/api/analytics/collect',
  '/api/marketing/collect',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/favicon.ico',
  '/assets/',
  '/_nuxt/'
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
  is_admin: number;
  is_premium: number;
}

export default defineEventHandler(async (event: H3Event) => {
  const url = event.path;
  console.log('Middleware auth - URL:', url);

  // Vérifier si la route est publique
  if (publicRoutes.some(route => url.startsWith(route))) {
    return;
  }

  // Récupérer le token depuis les headers
  const headers = getRequestHeaders(event);
  const authHeader = headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Token d\'authentification manquant'
    });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token reçu:', token.substring(0, 20) + '...');

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
    console.log('Token décodé:', { userId: decoded.userId, isAdmin: decoded.isAdmin, isPremium: decoded.isPremium });

    // Vérifier si l'utilisateur existe toujours dans la base de données
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, username, email, is_admin, is_premium FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      throw createError({
        statusCode: 401,
        message: 'Utilisateur non trouvé'
      });
    }

    const user = rows[0];

    // Vérifier les routes admin
    if (adminRoutes.some(route => url.startsWith(route)) && !user.is_admin) {
      throw createError({
        statusCode: 403,
        message: 'Accès non autorisé'
      });
    }

    // Vérifier les routes premium
    if (premiumRoutes.some(route => url.startsWith(route)) && !user.is_premium) {
      throw createError({
        statusCode: 403,
        message: 'Fonctionnalité premium requise'
      });
    }

    // Ajouter les informations de l'utilisateur à l'événement
    event.context.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: Boolean(user.is_admin),
      isPremium: Boolean(user.is_premium)
    };

    // Définir les headers de réponse
    setHeaders(event);
  } catch (error) {
    console.error('Token invalide ou expiré:', token.substring(0, 20) + '...');
    if (error instanceof jwt.TokenExpiredError) {
      throw createError({
        statusCode: 401,
        message: 'Session expirée'
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError({
        statusCode: 401,
        message: 'Token invalide'
      });
    }
    throw createError({
      statusCode: 401,
      message: 'Erreur d\'authentification'
    });
  }
});

function setHeaders(event: H3Event) {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*');
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  event.node.res.setHeader('Access-Control-Max-Age', '86400');
}
