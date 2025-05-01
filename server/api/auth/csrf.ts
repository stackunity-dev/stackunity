import crypto from 'crypto';
import { createError, defineEventHandler, eventHandler, getCookie, readBody, setCookie } from 'h3';

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export const verifyCsrfToken = eventHandler(async (event) => {
  const method = event.method;

  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return;
  }

  const csrfTokenCookie = getCookie(event, 'X-CSRF-TOKEN');
  const body = await readBody(event);
  const csrfTokenForm = body._csrf;

  if (!csrfTokenCookie || !csrfTokenForm || csrfTokenCookie !== csrfTokenForm) {
    throw createError({
      statusCode: 403,
      statusMessage: 'CSRF token invalid',
      message: 'CSRF protection: invalid or missing token'
    });
  }
});

export default defineEventHandler((event) => {
  const csrfToken = generateCsrfToken();

  setCookie(event, 'X-CSRF-TOKEN', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24
  });

  return { token: csrfToken };
}); 