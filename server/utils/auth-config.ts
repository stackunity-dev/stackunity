/**
 * Configuration pour l'authentification et les tokens
 */

// Durée de validité des tokens d'accès (12 heures)
export const ACCESS_TOKEN_EXPIRY = '12h';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key_dev';

// Durée de validité des tokens de rafraîchissement (30 jours)
export const REFRESH_TOKEN_EXPIRY = '30d';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key_dev';

// Configuration des cookies
export const REFRESH_TOKEN_COOKIE_NAME = 'devunity_refresh_token';
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
};

// Configuration du refresh automatique
export const AUTO_REFRESH_THRESHOLD = 30 * 60; // 30 minutes avant expiration
export const SESSION_MAX_AGE = 12 * 60 * 60; // 12 heures en secondes 