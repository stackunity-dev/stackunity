import { defineNuxtConfig } from 'nuxt/config';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  ssr: true,
  nitro: {
    preset: 'node',
    output: {
      dir: '.output',
      serverDir: '.output/server',
      publicDir: '.output/public',
    },
    externals: {
      inline: ['pinia-plugin-persistedstate'],
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
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    ssr: {
      noExternal: ['pinia-plugin-persistedstate'],
      external: ['puppeteer-core', '@puppeteer/browsers', 'monaco-editor']
    },
  },
});
