/**
 * Configuration pour le système d'authentification
 */

// Secrets pour les tokens JWT (à placer dans des variables d'environnement en production)
export const ACCESS_TOKEN_SECRET = 'access_token_secret_key';
export const REFRESH_TOKEN_SECRET = 'refresh_token_secret_key';

// Durées de validité des tokens
export const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
export const REFRESH_TOKEN_EXPIRY = '7d'; // 7 jours

// Nom du cookie de rafraîchissement
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// Durée de validité du cookie de rafraîchissement en secondes (7 jours)
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

// Configuration du cookie pour le token de rafraîchissement
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true, // Important: empêche l'accès par JavaScript (protection XSS)
  path: '/',
  maxAge: REFRESH_TOKEN_MAX_AGE,
  sameSite: 'strict' as const, // Protection CSRF
  secure: true // Toujours HTTPS
};

// Types pour les payloads JWT
export interface AccessTokenPayload {
  userId: number;
  username: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
  iat?: number;
  exp?: number;
} 