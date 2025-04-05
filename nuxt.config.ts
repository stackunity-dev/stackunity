import { defineNuxtConfig } from 'nuxt/config';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    preset: 'node-server',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public',
    }
  },

  typescript: {
    shim: false
  },

  devtools: { enabled: false },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@pinia/nuxt',
    ['@nuxtjs/plausible', {
      domain: "devunity.tech",
      apiHost: "https://plausible.io",
      ignoredHostnames: ['localhost'],
      hashMode: true,
      enableAutoOutboundTracking: true,
      enableAutoFileDownloadsTracking: true,
    }],
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['@pinia-plugin-persistedstate/nuxt'],
      external: ['monaco-editor']
    },
  },

  compatibilityDate: '2025-03-31',

  app: {
    head: {
      meta: [
        { name: 'crossorigin', content: 'use-credentials' }
      ]
    },
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false
  }
});