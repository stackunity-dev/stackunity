// @ts-ignore
import { defineNuxtPlugin } from '#app';
// @ts-ignore
import { useNuxtApp, useRoute, useRouter } from '#imports';
import { onMounted } from 'vue';
import { setCurrentLanguage, SupportedLanguage } from '../languages';

export default defineNuxtPlugin(({ vueApp }) => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()
  const route = useRoute()

  const detectBrowserLanguage = (): SupportedLanguage => {
    const browserLanguages = navigator.languages || [navigator.language]

    const supportedLanguages = ['en', 'fr', 'es', 'ar', 'zh']

    for (const browserLang of browserLanguages) {
      const langCode = browserLang.substring(0, 2).toLowerCase()

      if (supportedLanguages.includes(langCode)) {
        return langCode as SupportedLanguage
      }
    }

    return 'en'
  }

  const redirectToLocale = () => {
    if (route.path !== '/' || localStorage.getItem('i18n_redirected')) {
      return
    }

    const preferredLanguage = detectBrowserLanguage()

    if (preferredLanguage !== 'en') {
      localStorage.setItem('i18n_redirected', 'true')

      const localePath = nuxtApp.$i18n.localePath('/', preferredLanguage)

      // Rediriger
      router.push(localePath)

      setCurrentLanguage(preferredLanguage)
      nuxtApp.$i18n.locale.value = preferredLanguage
    }
  }

  onMounted(() => {
    redirectToLocale()
  })
}); 