import { defineNuxtConfig } from 'nuxt/config';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    minify: true,
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
    analyze: false,
  },

  runtimeConfig: {
    public: {
    }
  },

  plugins: [
    '~/plugins/auth.ts',
    '~/plugins/cookies.ts',
    '~/plugins/vuetify.ts',
    '~/plugins/pinia-persistedState.client.ts',
    '~/plugins/i18n-router.ts',
    '~/plugins/localized-links.ts',
    '~/plugins/language-detection.client.ts'
  ],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  i18n: {
    lazy: false,
    defaultLocale: 'en',
    strategy: 'prefix',
    locales: [
      { code: 'en', iso: 'en', dir: 'ltr' },
      { code: 'fr', iso: 'fr', dir: 'ltr' },
      { code: 'es', iso: 'es', dir: 'ltr' },
      { code: 'ar', iso: 'ar', dir: 'rtl' },
      { code: 'zh', iso: 'zh', dir: 'ltr' }
    ],
    detectBrowserLanguage: false,
    baseUrl: 'https://stackunity.tech',
    skipSettingLocaleOnNavigate: false
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['vue', 'vuetify/lib'],
      external: ['monaco-editor', 'vue-chartjs', 'chart.js', '@pinia-plugin-persistedstate/nuxt']
    },
    build: {
      chunkSizeWarningLimit: 1600,
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: false,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue': ['vue', 'vue-router'],
            'vuetify': ['vuetify'],
            'i18n': ['vue-i18n'],
          }
        }
      }
    },
    server: {
      hmr: {
        protocol: 'ws',
      },
      fs: {
        strict: false,
      },
    },
    optimizeDeps: {
      exclude: ['vue-i18n']
    }
  },

  compatibilityDate: '2025-03-31',

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      script: [
        {
          src: 'https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js',
          defer: true,
          'data-domain': 'stackunity.tech',
          'data-cache': 'true',
          crossorigin: 'anonymous'
        },
        {
          key: 'plausible-setup',
          innerHTML: 'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }',
          'data-hid': 'plausible-setup',
          nonce: '{{nonce}}'
        },
        {
          src: '/sw-register.js',
          defer: true
        }
      ],
      meta: [
        { name: 'crossorigin', content: 'use-credentials' },
        { name: 'author', content: 'Stackunity' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap' }
      ]
    },
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  },

  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: false,
  },

  routeRules: {
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/logo/**': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/plausible-proxy.js': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/sw-register.js': { headers: { 'cache-control': 'public, max-age=86400' } },

    '/fr/**': {
      headers: { 'content-language': 'fr' },
      swr: 86400
    },
    '/es/**': {
      headers: { 'content-language': 'es' },
      swr: 86400
    },
    '/ar/**': {
      headers: { 'content-language': 'ar' },
      swr: 86400
    },
    '/zh/**': {
      headers: { 'content-language': 'zh' },
      swr: 86400
    },
  }
});