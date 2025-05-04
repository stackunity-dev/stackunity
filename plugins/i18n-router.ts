// @ts-ignore
import { defineNuxtPlugin } from '#app'
// @ts-ignore
import { useNuxtApp } from '#imports'
import { watch } from 'vue'
import { currentLanguage, setCurrentLanguage, SupportedLanguage } from '../languages'

export default defineNuxtPlugin(({ vueApp }) => {
  const isClient = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  const nuxtApp = useNuxtApp()

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

  // S'assurer que les routes sont bien préfixées avec la langue
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

        const localePath = nuxtApp.$i18n.localePath(currentPath, lang);

        if (currentPath !== localePath) {
          console.log(`[i18n Router] Redirection vers le chemin localisé: ${localePath}`);

          const currentUrl = new URL(window.location.href);
          const newUrl = new URL(localePath, window.location.origin);

          const searchParams = currentUrl.searchParams;
          searchParams.forEach((value, key) => {
            newUrl.searchParams.append(key, value);
          });

          window.location.href = newUrl.toString();
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
      // Même si la langue est déjà correcte, vérifier que le préfixe d'URL est bon
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
      // Même si la langue est déjà correcte, vérifier que le préfixe d'URL est bon
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