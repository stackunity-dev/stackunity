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
      domain: "stackunity.tech",
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
      noExternal: ['@pinia-plugin-persistedstate/nuxt', 'vue', 'vuetify', 'vuetify/lib', 'vuetify/components'],
      external: ['monaco-editor']
    },
    server: {
      fs: {
        strict: false,
        allow: ['..']
      }
    },
    optimizeDeps: {
      include: ['vuetify', 'vuetify/lib', 'vuetify/components']
    }
  },

  compatibilityDate: '2025-03-31',

  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/vuetify@3.4.0/dist/vuetify.min.js',
          defer: true
        },
        {
          src: 'https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js',
          defer: true,
          'data-domain': 'stackunity.tech'
        },
        {
          key: 'plausible-setup',
          innerHTML: 'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }'
        }
      ],
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