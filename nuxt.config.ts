import { defineNuxtConfig } from 'nuxt/config';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    output: {
      serverDir: '.output/server',
      publicDir: '.output/public',
    },
    externals: {
      inline: ['pinia-plugin-persistedstate'],
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    },
    sourceMap: false,
    logLevel: 'info',
    minify: false,
    timing: true,
    experimental: {
      asyncContext: true,
    }
  },
  typescript: {
    shim: false
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify'],
  },
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
    treeshakeClientOnly: true,
  },
  modules: [
    '@pinia/nuxt',
    'pinia-plugin-persistedState/nuxt',
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
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
            vuetify: ['vuetify'],
          },
        },
        external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
      },
    },
    optimizeDeps: {
      include: [],
      exclude: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    },
    define: {
      'process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD': 'true'
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      hmr: true
    },
    ssr: {
      noExternal: ['pinia-plugin-persistedstate'],
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    },
  },
});
