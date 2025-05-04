// @ts-ignore
import { defineNuxtPlugin } from '#app';
// @ts-ignore
import { useNuxtApp } from '#imports';
import { setCurrentLanguage, SupportedLanguage } from '../languages';

const supportedLanguages: readonly SupportedLanguage[] = ['en', 'fr', 'es', 'ar', 'zh'] as const;

export default defineNuxtPlugin(({ vueApp }) => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  const nuxtApp = useNuxtApp();

  const initLanguage = () => {
    try {
      const savedLanguage = localStorage.getItem('preferred_language') as SupportedLanguage | null;

      if (savedLanguage && supportedLanguages.includes(savedLanguage as SupportedLanguage)) {
        if (nuxtApp.$i18n.locale.value !== savedLanguage) {
          nuxtApp.$i18n.setLocale(savedLanguage);
        }

        setCurrentLanguage(savedLanguage as SupportedLanguage);
        document.documentElement.lang = savedLanguage;
        return;
      }

      if (nuxtApp.$i18n.locale.value !== 'en') {
        nuxtApp.$i18n.setLocale('en');
      }

      setCurrentLanguage('en');
      document.documentElement.lang = 'en';
      localStorage.setItem('preferred_language', 'en');
    } catch (error) {
      console.error('[Language Detection] Error accessing localStorage:', error);
      setCurrentLanguage('en');
      nuxtApp.$i18n.setLocale('en');
      document.documentElement.lang = 'en';
    }
  };

  initLanguage();

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      try {
        const savedLanguage = localStorage.getItem('preferred_language') as SupportedLanguage | null;
        if (savedLanguage && nuxtApp.$i18n.locale.value !== savedLanguage) {
          nuxtApp.$i18n.setLocale(savedLanguage);
          document.documentElement.lang = savedLanguage;
          setCurrentLanguage(savedLanguage as SupportedLanguage);
        }
      } catch (error) {
        console.error('[Language Detection] Error in delayed check:', error);
      }
    }, 300);
  }

  window.addEventListener('language-changed', ((event: Event) => {
    try {
      const customEvent = event as CustomEvent<{ language: SupportedLanguage }>;
      const newLanguage = customEvent.detail.language;

      if (supportedLanguages.includes(newLanguage)) {
        setCurrentLanguage(newLanguage);

        if (nuxtApp.$i18n.locale.value !== newLanguage) {
          nuxtApp.$i18n.setLocale(newLanguage);
        }

        document.documentElement.lang = newLanguage;
        localStorage.setItem('preferred_language', newLanguage);
      }
    } catch (error) {
      console.error('[Language Detection] Error handling language change:', error);
    }
  }) as EventListener);
}); 