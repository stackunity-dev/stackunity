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
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor', '@sparticuz/chromium-min']
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
    '@pinia/nuxt', '@nuxtjs/plausible',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ['localhost'],
  },

  runtimeConfig: {
    public: {
      stripe: {
        publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
      },
      CHROMIUM_PATH: process.env.NODE_ENV === 'production' ? '/tmp/chromium' : undefined
    },
    chromium: {
      executablePath: process.env.NODE_ENV === 'production' ? '/tmp/chromium' : undefined,
      s3Url: process.env.CHROMIUM_S3_URL || 'https://votre-bucket.s3.amazonaws.com/chromium-pack.tar'
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