import { defineNuxtPlugin } from 'nuxt/app';
import { useCookieStore } from '../stores/cookieStore';

export default defineNuxtPlugin({
  name: 'cookies-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    try {
      if (nuxtApp.$pinia) {
        const cookieStore = useCookieStore();
        cookieStore.initializeCookies();
      }
    } catch (error) {
    }
  }
}); 