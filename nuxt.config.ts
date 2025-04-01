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
    },
    externals: {
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    }
  },

  typescript: {
    shim: false
  },

  devtools: { enabled: false },

  build: {
    transpile: ['vuetify']
  },

  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  runtimeConfig: {
    public: {
      stripe: {
        publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
      }
    }
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['@pinia-plugin-persistedstate/nuxt'],
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    },
  },

  compatibilityDate: '2025-03-31',

  app: {
    head: {
      meta: [
        { name: 'crossorigin', content: 'use-credentials' }
      ],
      link: [
        { rel: 'preload', as: 'fetch', href: '/_nuxt/builds/meta/latest.json', crossorigin: 'use-credentials' }
      ]
    }
  },

  experimental: {
    payloadExtraction: false
  }
});