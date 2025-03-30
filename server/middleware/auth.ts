import { createError, defineEventHandler, getRequestHeaders, H3Event, setResponseHeaders } from 'h3'
import jwt from 'jsonwebtoken'
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

export default defineEventHandler(async (event: H3Event) => {
  try {
    const url = event.path || ''
    // En production, on n'affiche pas tous les URLs dans les logs (diminue le volume de logs)
    if (process.env.NODE_ENV !== 'production' || url.startsWith('/api/')) {
      console.log(`Middleware auth - URL: ${url}`)
    }

    // Exclure automatiquement les fichiers statiques courants
    const isStaticFile = url.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/i);
    if (isStaticFile) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Fichier statique autorisé: ${url}`);
      }
      return;
    }

    if (event.node.req.method === 'OPTIONS') {
      setResponseHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      })
      event.node.res.statusCode = 204
      return
    }

    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    })

    if (publicRoutes.some(route => {
      if (route === '/') return url === '/';
      const normalizedRoute = route.toLowerCase();
      const normalizedUrl = url.toLowerCase();
      return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
    })) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Route publique autorisée: ${url}`)
      }
      return
    }

    // Récupérer le token d'accès depuis l'en-tête Authorization
    const authHeader = getRequestHeaders(event).authorization;

    const token = authHeader?.substring(7);
    if (!token) {
      console.log(`Authentication requise pour: ${url} - Token manquant`)
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentification requise'
      })
    }
    try {
      // Vérifier la validité du token
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

      // En production, on n'affiche pas les infos des tokens décodés
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Token décodé pour ${url}, userId:`, payload.userId)
      }

      const [rows] = await pool.execute(
        'SELECT id, username, email, isAdmin, isPremium FROM users WHERE id = ?',
        [payload.userId]
      )

      if (!Array.isArray(rows) || rows.length === 0) {
        console.log(`Utilisateur non trouvé pour le token: ${token.substring(0, 10)}...`)
        throw createError({
          statusCode: 401,
          message: 'Non autorisé - Utilisateur non trouvé'
        })
      }

      const user = rows[0]

      // En production, on n'affiche pas les infos des utilisateurs
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Utilisateur trouvé:`, user)
      }

      if (premiumRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedUrl = url.toLowerCase();
        return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
      })) {
        const userRow = rows[0] as any;
        const isPremium = userRow.isPremium === 1;

        if (!isPremium) {
          console.log(`Accès premium requis pour: ${url} - L'utilisateur n'est pas premium`);
          if (url.startsWith('/api/')) {
            throw createError({
              statusCode: 403,
              message: 'Interdit - Abonnement premium requis'
            })
          } else {
            return {
              statusCode: 302,
              headers: {
                'Location': '/subscription'
              }
            };
          }
        }
      }

      if (adminRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedUrl = url.toLowerCase();
        return normalizedUrl === normalizedRoute || normalizedUrl.startsWith(`${normalizedRoute}/`);
      })) {
        const userRow = rows[0] as any;
        const isAdmin = userRow.isAdmin === 1;

        if (!isAdmin) {
          console.log(`Accès admin requis pour: ${url} - L'utilisateur n'est pas admin`);
          throw createError({
            statusCode: 404,
            message: 'Non trouvé'
          })
        }
      }

      event.context.user = {
        id: payload.userId,
        username: payload.username,
        email: payload.email,
        isPremium: payload.isPremium,
        isAdmin: payload.isAdmin
      }

      // En production, on n'affiche pas cette ligne
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Contexte utilisateur défini pour ${url}:`, (user as any).id)
      }

    } catch (tokenError) {
      console.log(`Token invalide ou expiré: ${token.substring(0, 10)}...`)

      // En production, on limite les détails des erreurs
      if (process.env.NODE_ENV !== 'production') {
        console.error('Erreur de token:', tokenError)
      }

      throw createError({
        statusCode: 401,
        statusMessage: 'Token invalide ou expiré'
      })
    }
  } catch (error: any) {
    // En production, on limite les détails des erreurs
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erreur d\'authentification:', error)
    } else {
      console.error('Erreur d\'authentification:', error.statusCode || 500)
    }

  }
})

function setHeaders(event: any) {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*')
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  event.node.res.setHeader('Access-Control-Max-Age', '86400')
}
