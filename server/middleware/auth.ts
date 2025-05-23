import { createError, defineEventHandler, getRequestHeaders, H3Event } from 'h3'
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
  '/api/seo-audit.pdf'
]

export default defineEventHandler(async (event: H3Event) => {
  const url = event.node.req.url || '';

  if (!url.startsWith('/api/')) {
    return;
  }

  const isPublicRoute = (url: string): boolean => {
    if (url.startsWith('/api/Studio/')) {
      return false;
    }

    if (url === '/api/snippets' || url === '/api/snippets/world' || url === '/api/snippets/personal') {
      return true;
    }

    if (url.startsWith('/api/sql')) {
      return true;
    }

    if (url === '/dashboard' || url.startsWith('/dashboard?') || url.startsWith('/dashboard/')) {
      return true;
    }

    if (url === '/api/notifications' || url.startsWith('/api/notifications/')) {
      return false;
    }

    const isPublic = publicRoutes.some(route => {
      if (route.endsWith('/')) {
        return url.startsWith(route);
      }
      return url === route || url.startsWith(route + '/');
    });

    return isPublic;
  };

  if (isPublicRoute(url)) {
    return;
  }

  const authHeader = getRequestHeaders(event).authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    if (!adminRoutes.some(route => url.includes(route)) &&
      !premiumRoutes.some(route => url.includes(route))) {
      return;
    }
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentification requise'
    });
  }

  try {
    const decodedToken = await ServerTokenManager.verifyToken(token);
    event.context.user = decodedToken;

    if (adminRoutes.some(route => url.includes(route)) && !decodedToken.isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès refusé - Permissions administrateur requises'
      });
    }

    if (premiumRoutes.some(route => url.includes(route)) && !decodedToken.isPremium && !decodedToken.isStandard) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Accès refusé - Compte premium requis'
      });
    }

    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    });

  } catch (error: any) {

    if (isPublicRoute(url)) {
      return;
    }

    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token expiré'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide'
      });
    }
    throw createError({
      statusCode: 401,
      statusMessage: error.message || 'Erreur d\'authentification'
    });
  }
});

function setResponseHeaders(event: H3Event, headers: Record<string, string>) {
  for (const [key, value] of Object.entries(headers)) {
    event.node.res.setHeader(key, value);
  }
}
