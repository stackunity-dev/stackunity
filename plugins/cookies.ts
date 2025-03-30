import { useCookieStore } from '~/stores/cookieStore';

export default defineNuxtPlugin({
  name: 'cookies-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    if (nuxtApp.$pinia) {
      const cookieStore = useCookieStore();

      cookieStore.initializeCookies();
    } else {
      console.warn('Pinia n\'est pas encore initialisé. Les cookies seront initialisés ultérieurement.');
    }
  }
}); 