import { appendResponseHeader, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  appendResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  appendResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  appendResponseHeader(event, 'X-XSS-Protection', '1; mode=block')
  appendResponseHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')

  appendResponseHeader(
    event,
    'Link',
    '<https://plausible.io>; rel="preconnect"; crossorigin="anonymous", <https://fonts.googleapis.com>; rel="preconnect"; crossorigin="anonymous", <https://fonts.gstatic.com>; rel="preconnect"; crossorigin="anonymous"'
  )

  const url = event.node.req.url || '';

  if (url.includes('plausible-proxy.js')) {
    const cspValue = "script-src 'self' 'unsafe-inline' 'unsafe-eval'; worker-src 'self'; connect-src *";
    appendResponseHeader(event, 'Content-Security-Policy', cspValue);
  }

  if (
    url.includes('/_nuxt/') ||
    url.includes('/images/') ||
    url.includes('/logo/') ||
    url === '/favicon.ico' ||
    url === '/sw-register.js'
  ) {
    const maxAge = url.includes('/_nuxt/') ? '31536000, immutable' : '86400';
    appendResponseHeader(event, 'Cache-Control', `public, max-age=${maxAge}`);
  }
}) 