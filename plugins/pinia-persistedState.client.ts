import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

declare module '#app' {
  interface NuxtApp {
    $pinia: Pinia
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia
  pinia.use(piniaPluginPersistedstate)
})
