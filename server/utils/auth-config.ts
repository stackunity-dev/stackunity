export const ACCESS_TOKEN_EXPIRY_DEFAULT = '12h';
export const ACCESS_TOKEN_EXPIRY_REMEMBER = '48h';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret";

export const REFRESH_TOKEN_EXPIRY = '30d';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "secret";

export const REFRESH_TOKEN_COOKIE_NAME = 'stackunity_refresh_token';
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  maxAge: 30 * 24 * 60 * 60,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
};

export const AUTO_REFRESH_THRESHOLD = 30 * 60;
export const SESSION_MAX_AGE = 12 * 60 * 60;