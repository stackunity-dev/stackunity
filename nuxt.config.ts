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
    transpile: ['vuetify']
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
    resolve: {
      alias: {
        '@mdi/font': '@mdi/font/css/materialdesignicons.min.css'
      }
    },
    ssr: {
      noExternal: ['vue', 'vuetify/lib'],
      external: ['monaco-editor', 'vue-chartjs', 'chart.js', '@pinia-plugin-persistedstate/nuxt', 'vuetify', 'vuetify/components']
    },
    build: {
      chunkSizeWarningLimit: 1500,
      minify: 'esbuild',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('vue') || id.includes('pinia')) {
                return 'vue-vendor';
              }
              if (id.includes('vuetify') || id.includes('mdi')) {
                return 'ui-vendor';
              }
              if (id.includes('chart') || id.includes('analytics')) {
                return 'analytics';
              }
              return 'vendor';
            }
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
    payloadExtraction: true,
    renderJsonPayloads: false
  }
});