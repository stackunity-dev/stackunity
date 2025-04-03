import { createError, defineEventHandler, getRequestHeaders, H3Event } from 'h3'
import { RowDataPacket } from 'mysql2'
import { ServerTokenManager } from '../utils/ServerTokenManager'

const publicRoutes = [
  '/api/auth/',
  '/api/newsletter/unsubscribe',
  '/api/newsletter/subscribe',
  '/api/health',
  '/api/public',
  '/api/cookies',
  '/api/payment/webhook',
  '/api/payment/create-intent',
  '/api/snippets/world',
  '/api/snippets/personal',
  '/signup',
  '/login',
  '/dashboard',
  '/',
  '/favicon.ico',
  '/assets/',
  '/_nuxt/',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json'
]

const adminRoutes = [
  '/newsletter-admin',
  '/api/newsletter/stats',
  '/api/admin',
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

interface JwtPayload {
  userId: number;
  id?: number;
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
  const url = event.node.req.url || '';
  console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Middleware auth - URL:', url);

  const isPublicRoute = (url: string): boolean => {
    if (url.startsWith('/api/Studio/')) {
      console.log('[AUTH] Route studio détectée (protégée):', url);
      return false;
    }

    if (url === '/api/snippets' || url === '/api/snippets/world' || url === '/api/snippets/personal') {
      console.log('[AUTH] Route snippets publique détectée:', url);
      return true;
    }

    if (url.startsWith('/api/sql')) {
      console.log('[AUTH] Route SQL publique détectée:', url);
      return true;
    }

    if (url === '/dashboard' || url.startsWith('/dashboard?') || url.startsWith('/dashboard/')) {
      console.log('[AUTH] URL dashboard détectée comme publique:', url);
      return true;
    }

    const isPublic = publicRoutes.some(route => {
      if (route.endsWith('/')) {
        return url.startsWith(route);
      }
      return url === route || url.startsWith(route + '/');
    });

    if (isPublic) {
      console.log('[AUTH] Route publique trouvée dans la liste:', url);
    }

    return isPublic;
  };

  // Vérifier si c'est une route publique
  if (isPublicRoute(url)) {
    console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Route publique détectée:', url);
    return;
  }

  // Récupérer le token d'autorisation
  const authHeader = getRequestHeaders(event).authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  console.log('[AUTH] URL:', url, 'Token présent:', !!token);

  // Si pas de token, mais ce n'est pas une route admin ou premium, autoriser l'accès
  if (!token) {
    if (!adminRoutes.some(route => url.includes(route)) &&
      !premiumRoutes.some(route => url.includes(route))) {
      return; // Accès autorisé aux routes non-protégées
    }

    throw createError({
      statusCode: 401,
      message: 'Authentification requise'
    });
  }

  try {
    // Vérifier le token d'accès
    const decodedToken = ServerTokenManager.verifyAccessToken(token);

    console.log('[AUTH] Token décodé:', decodedToken ? 'Valide' : 'Invalide');

    if (!decodedToken) {
      throw createError({
        statusCode: 401,
        message: 'Token invalide ou expiré'
      });
    }

    // Vérifier les permissions pour les routes admin
    if (adminRoutes.some(route => url.includes(route)) && !decodedToken.isAdmin) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Accès admin refusé pour:', url);
      throw createError({
        statusCode: 403,
        message: 'Accès refusé - Permissions administrateur requises'
      });
    }

    // Vérifier les permissions pour les routes premium
    if (premiumRoutes.some(route => url.includes(route)) && !decodedToken.isPremium) {
      console.log('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Accès premium refusé pour:', url);
      throw createError({
        statusCode: 403,
        message: 'Accès refusé - Compte premium requis'
      });
    }

    // Ajouter les infos utilisateur à l'événement
    event.context.user = decodedToken;

    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });

  } catch (error: any) {
    console.error('[devunity]', `[${new Date().toISOString().replace('T', ' ').slice(0, 19)}]`, 'Erreur d\'authentification:', error);

    // Si c'est une route publique, autoriser l'accès même si le token est invalide
    if (isPublicRoute(url)) {
      return;
    }

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
