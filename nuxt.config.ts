import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  build: {
    transpile: ['vuetify', 'monaco-editor'],
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
    optimizeDeps: {
      include: ['monaco-editor']
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
      noExternal: ['pinia-plugin-persistedstate']
    }
  },
});
