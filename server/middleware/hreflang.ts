import { appendHeader, defineEventHandler, getRequestURL } from 'h3';

const LANG_MAP = {
  'en': 'en',
  'fr': 'fr',
  'es': 'es',
  'ar': 'ar',
  'zh': 'zh'
};

export default defineEventHandler((event) => {
  const url = getRequestURL(event);

  if (url.pathname.startsWith('/_nuxt/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico') {
    return;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];

  let currentLang = 'en';
  let pathWithoutLang = url.pathname;

  if (LANG_MAP[firstSegment]) {
    currentLang = firstSegment;
    pathWithoutLang = '/' + segments.slice(1).join('/');
    if (pathWithoutLang === '/') pathWithoutLang = '';
  }

  const baseUrl = `${url.protocol}//${url.host}`;
  const alternates: string[] = [];

  for (const [lang, hreflang] of Object.entries(LANG_MAP)) {
    let localePath = lang === 'en' ? pathWithoutLang || '/' : `/${lang}${pathWithoutLang || '/'}`;

    if (url.search) {
      localePath += url.search;
    }

    const fullUrl = `${baseUrl}${localePath}`;
    alternates.push(`<${fullUrl}>; rel="alternate"; hreflang="${hreflang}"`);
  }

  const defaultUrl = `${baseUrl}${pathWithoutLang || '/'}${url.search || ''}`;
  alternates.push(`<${defaultUrl}>; rel="alternate"; hreflang="x-default"`);

  appendHeader(event, 'Link', alternates.join(', '));

  const canonicalUrl = `${baseUrl}${currentLang === 'en' ? pathWithoutLang || '/' : `/${currentLang}${pathWithoutLang || '/'}`}${url.search || ''}`;
  appendHeader(event, 'Link', `<${canonicalUrl}>; rel="canonical"`);
}); 