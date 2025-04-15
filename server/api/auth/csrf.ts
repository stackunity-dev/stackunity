import crypto from 'crypto';
import { createError, defineEventHandler, eventHandler, getCookie, readBody, setCookie } from 'h3';

// Fonction pour générer un token CSRF
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Middleware pour vérifier le token CSRF
export const verifyCsrfToken = eventHandler(async (event) => {
  const method = event.method;

  // Pas besoin de vérifier pour les requêtes GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return;
  }

  // Récupérer le token depuis les cookies et le comparer avec celui dans le body
  const csrfTokenCookie = getCookie(event, 'X-CSRF-TOKEN');
  const body = await readBody(event);
  const csrfTokenForm = body._csrf;

  // Si le token est absent ou ne correspond pas, renvoyer une erreur
  if (!csrfTokenCookie || !csrfTokenForm || csrfTokenCookie !== csrfTokenForm) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF token invalide',
      message: 'Protection CSRF: token invalide ou absent'
    });
  }
});

// Endpoint pour obtenir un nouveau token CSRF
export default defineEventHandler((event) => {
  // Générer un nouveau token
  const csrfToken = generateCsrfToken();

  // Définir le cookie avec le token
  setCookie(event, 'X-CSRF-TOKEN', csrfToken, {
    httpOnly: true,    // Cookie non accessible par JavaScript
    secure: process.env.NODE_ENV === 'production',  // HTTPS en production
    sameSite: 'strict', // Protection contre les requêtes intersites
    path: '/',          // Valide pour tout le site
    maxAge: 60 * 60 * 24 // Expire après 24 heures
  });

  // Retourner le token pour qu'il puisse être inclus dans les formulaires
  return { token: csrfToken };
}); 