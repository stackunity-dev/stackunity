import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          colors: {
            background: '#ebedf9',
            surface: '#f9f9ff',
            'surface-dim': '#d7d9e5',
            'surface-bright': '#f9f9ff',
            'on-surface': '#181c23',
            outline: '#717786',
            'outline-variant': '#c1c6d7',
            primary: '#005bc0',
            'on-primary': '#ffffff',
            secondary: '#00658b',
            'on-secondary': '#ffffff',
            tertiary: '#6440d7',
            'on-tertiary': '#ffffff',
            error: '#ba1a1a',
            'on-error': '#ffffff',
            'surface-light': '#e6e8f3',
          },
          dark: false,
          variables: {
            'overlay-background': '#161c28',
          },
        },
        dark: {
          colors: {
            background: '#1c2027',
            surface: '#10131b',
            'surface-dim': '#10131b',
            'surface-bright': '#363942',
            'on-surface': '#e0e2ed',
            outline: '#8b90a0',
            'outline-variant': '#414754',
            primary: '#adc7ff',
            'on-primary': '#002e68',
            secondary: '#7dd0ff',
            'on-secondary': '#00344a',
            tertiary: '#cbbeff',
            'on-tertiary': '#340098',
            error: '#ffb4ab',
            'on-error': '#690005',
            'surface-light': '#363942',
          },
          dark: true,
          variables: {
            'overlay-background': '#161c28',
          },
        },
        landingPage: {
          dark: true,
          colors: {

          }
        }
      },
    },
    defaults: {
      VSlider: {
        color: 'primary'
      },
      VTextField: {
        color: 'primary'
      },
      VTextarea: {
        color: 'primary'
      },
      VSwitch: {
        color: 'primary'
      }
    }
  })
  app.vueApp.use(vuetify)
})


