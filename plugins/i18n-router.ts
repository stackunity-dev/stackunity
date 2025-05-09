// @ts-ignore
import { defineNuxtPlugin } from '#app'
// @ts-ignore
import { useNuxtApp } from '#imports'
import { watch } from 'vue'
import { currentLanguage, setCurrentLanguage, SupportedLanguage } from '../languages'

export default defineNuxtPlugin(({ vueApp }) => {
  const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const supportedLanguages: SupportedLanguage[] = ['en', 'fr', 'es', 'ar', 'zh'];

  const nuxtApp = useNuxtApp()

  const hasLanguagePrefix = (path: string): boolean => {
    const pathParts = path.split('/').filter(Boolean);
    return pathParts.length > 0 && supportedLanguages.includes(pathParts[0] as SupportedLanguage);
  };

  const getPathWithoutPrefix = (path: string): string => {
    if (!hasLanguagePrefix(path)) return path;

    const parts = path.split('/');
    return '/' + parts.slice(2).join('/');
  };

  const syncLanguageFromStorage = () => {
    if (!isClient) {
      return;
    }

    try {
      const savedLanguage = localStorage.getItem('preferred_language') as SupportedLanguage | null;

      if (savedLanguage) {

        if (nuxtApp.$i18n.locale.value !== savedLanguage) {
          nuxtApp.$i18n.setLocale(savedLanguage);
        }

        if (currentLanguage.value !== savedLanguage) {
          setCurrentLanguage(savedLanguage);
        }

        document.documentElement.lang = savedLanguage;
        return;
      }

      if (nuxtApp.$i18n.locale.value && nuxtApp.$i18n.locale.value !== currentLanguage.value) {
        setCurrentLanguage(nuxtApp.$i18n.locale.value as SupportedLanguage);
        localStorage.setItem('preferred_language', nuxtApp.$i18n.locale.value);
        document.documentElement.lang = nuxtApp.$i18n.locale.value;
      }
    } catch (error) {
      console.error('[i18n Router] Error syncing language from storage:', error);
    }
  }

  if (isClient) {
    syncLanguageFromStorage();

    setTimeout(() => {
      try {
        syncLanguageFromStorage();
      } catch (error) {
        console.error('[i18n Router] Error in delayed sync:', error);
      }
    }, 200);
  }

  const generateLocalePath = (path: string, lang: SupportedLanguage): string => {
    if (!path) return `/${lang}`;

    const cleanPath = getPathWithoutPrefix(path);
    const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    return `/${lang}${normalizedPath === '/' ? '' : normalizedPath}`;
  }

  const updateRoutePrefix = (lang: SupportedLanguage) => {
    try {
      if (isClient && window.location.pathname) {
        const currentPath = window.location.pathname;

        if (currentPath.startsWith('/_nuxt/') ||
          currentPath.includes('/__webpack_hmr/') ||
          currentPath.startsWith('/api/') ||
          currentPath.startsWith('/images/') ||
          currentPath.startsWith('/logo/') ||
          currentPath === '/favicon.ico' ||
          currentPath === '/sw-register.js') {
          return;
        }

        const currentLangPrefix = hasLanguagePrefix(currentPath);

        const pathWithoutPrefix = currentLangPrefix ? getPathWithoutPrefix(currentPath) : currentPath;

        const localePath = generateLocalePath(pathWithoutPrefix, lang);

        if (currentPath !== localePath) {

          if (nuxtApp.$router) {
            const currentUrl = new URL(window.location.href);
            const query = {};
            currentUrl.searchParams.forEach((value, key) => {
              query[key] = value;
            });

            nuxtApp.$router.replace({
              path: localePath,
              query
            }).catch(err => {
              if (err.name !== 'NavigationDuplicated') {
                console.error('[i18n Router] Erreur de navigation:', err);
              }
            });
          } else {
            console.warn('[i18n Router] Vue Router non disponible, utilisation du fallback');
            const currentUrl = new URL(window.location.href);
            const newUrl = new URL(localePath, window.location.origin);

            currentUrl.searchParams.forEach((value, key) => {
              newUrl.searchParams.append(key, value);
            });

            if (history && history.replaceState) {
              history.replaceState(null, '', newUrl.toString());
              window.dispatchEvent(new Event('popstate'));
            } else {
              window.location.replace(newUrl.toString());
            }
          }
        }
      }
    } catch (error) {
      console.error('[i18n Router] Error updating route prefix:', error);
    }
  };

  watch(currentLanguage, (newLang) => {
    if (!newLang) return;

    if (nuxtApp.$i18n.locale.value !== newLang) {
      nuxtApp.$i18n.setLocale(newLang);

      if (isClient) {
        try {
          localStorage.setItem('preferred_language', newLang);
          document.documentElement.lang = newLang;
          updateRoutePrefix(newLang);
        } catch (error) {
          console.error('[i18n Router] Error saving language to localStorage:', error);
        }
      }
    } else {
      if (isClient) {
        updateRoutePrefix(newLang);
      }
    }
  })

  watch(() => nuxtApp.$i18n.locale.value, (newLang) => {
    if (!newLang) return;

    if (currentLanguage.value !== newLang) {
      setCurrentLanguage(newLang as SupportedLanguage);

      if (isClient) {
        try {
          localStorage.setItem('preferred_language', newLang);
          document.documentElement.lang = newLang;
          updateRoutePrefix(newLang as SupportedLanguage);
        } catch (error) {
          console.error('[i18n Router] Error saving i18n locale to localStorage:', error);
        }
      }
    } else {
      if (isClient) {
        updateRoutePrefix(newLang as SupportedLanguage);
      }
    }
  })

  return {
    provide: {
      switchLanguage: (lang: SupportedLanguage) => {
        setCurrentLanguage(lang);

        if (nuxtApp.$i18n.locale.value !== lang) {
          nuxtApp.$i18n.setLocale(lang);
        }

        if (isClient) {
          try {
            localStorage.setItem('preferred_language', lang);
            document.documentElement.lang = lang;
            updateRoutePrefix(lang);
          } catch (error) {
            console.error('[i18n Router] Error saving language in switchLanguage:', error);
          }
        }
      }
    }
  }
}) 