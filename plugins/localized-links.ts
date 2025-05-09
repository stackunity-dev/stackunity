// @ts-ignore
import { defineNuxtPlugin } from '#app';
// @ts-ignore
import { useLocalePath, useSwitchLocalePath } from '#imports';
import { currentLanguage } from '../languages';

export default defineNuxtPlugin(({ vueApp }) => {
  const hasLanguagePrefix = (path: string): boolean => {
    const supportedLanguages = ['en', 'fr', 'es', 'ar', 'zh'];
    const pathParts = path.split('/').filter(Boolean);
    return pathParts.length > 0 && supportedLanguages.includes(pathParts[0]);
  };

  const fallbackLocalePath = (path: string) => {
    if (!path) return '/';
    if (hasLanguagePrefix(path)) return path;

    const lang = currentLanguage.value || 'en';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  vueApp.directive('localized', {
    mounted(el, binding) {
      if (el.tagName === 'A') {
        try {
          const nuxtLocalePath = useLocalePath();

          const href = el.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            if (!hasLanguagePrefix(href)) {
              try {
                const localizedPath = nuxtLocalePath(href);
                el.setAttribute('href', localizedPath);
              } catch (error) {
                const fallbackPath = fallbackLocalePath(href);
                el.setAttribute('href', fallbackPath);
              }
            }
          }
        } catch (error) {
          console.error('[localized-links] Error in mounted directive:', error);
        }
      }
    },
    updated(el, binding) {
      if (el.tagName === 'A') {
        try {
          const nuxtLocalePath = useLocalePath();

          const href = el.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
            if (!hasLanguagePrefix(href)) {
              try {
                const localizedPath = nuxtLocalePath(href);
                el.setAttribute('href', localizedPath);
              } catch (error) {
                const fallbackPath = fallbackLocalePath(href);
                el.setAttribute('href', fallbackPath);
              }
            }
          }
        } catch (error) {
          console.error('[localized-links] Error in updated directive:', error);
        }
      }
    }
  });

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      try {
        const linkElements = document.querySelectorAll<HTMLAnchorElement>('a:not([data-localized])');
        if (linkElements.length > 0) {

          let localePath;
          try {
            localePath = useLocalePath();
          } catch (error) {
            console.warn('[localized-links] useLocalePath failed, using fallback');
            localePath = fallbackLocalePath;
          }

          linkElements.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('/api/')) {
              if (!hasLanguagePrefix(href)) {
                try {
                  const localizedPath = localePath(href);
                  if (href !== localizedPath) {
                    link.setAttribute('href', localizedPath);
                    link.setAttribute('data-localized', 'true');
                  }
                } catch (error) {
                  console.error(`[localized-links] Error localizing link ${href}:`, error);
                  const fallbackPath = fallbackLocalePath(href);
                  link.setAttribute('href', fallbackPath);
                  link.setAttribute('data-localized', 'true');
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('[localized-links] Erreur lors de la localisation automatique des liens:', error);
      }
    }, 500);
  }

  const nuxtApp = vueApp.config.globalProperties;

  if (nuxtApp.$localePath && nuxtApp.$switchLocalePath) {
    return {};
  }

  return {
    provide: {
      localePath: (path: string) => {
        if (hasLanguagePrefix(path)) {
          return path;
        }

        try {
          const nuxtLocalePath = useLocalePath();
          const localizedPath = nuxtLocalePath(path);
          return localizedPath;
        } catch (error) {
          console.warn(`[localized-links] Error in localePath for ${path}, using fallback:`, error);
          return fallbackLocalePath(path);
        }
      },

      switchLocalePath: (lang: string) => {
        try {
          const nuxtSwitchLocalePath = useSwitchLocalePath();
          const switchedPath = nuxtSwitchLocalePath(lang);
          return switchedPath;
        } catch (error) {
          console.warn(`[localized-links] Error in switchLocalePath for ${lang}, using fallback:`, error);
          const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
          const pathWithoutPrefix = hasLanguagePrefix(currentPath)
            ? '/' + currentPath.split('/').slice(2).join('/')
            : currentPath;
          return `/${lang}${pathWithoutPrefix === '/' ? '' : pathWithoutPrefix}`;
        }
      }
    }
  };
}); 