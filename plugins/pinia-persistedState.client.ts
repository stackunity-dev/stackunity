import { defineNuxtPlugin } from 'nuxt/app';
import { Pinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;

  pinia.use(piniaPluginPersistedstate);

  nuxtApp.hook('app:mounted', () => {
    console.log('Application montée, initialisation des cookies...');
  });
}); 