// @ts-ignore
import { defineNuxtPlugin } from '#app'
// @ts-ignore
import { useNuxtApp } from '#imports'
import { watch } from 'vue'
import { currentLanguage, setCurrentLanguage, SupportedLanguage } from '../languages'

export default defineNuxtPlugin(({ vueApp }) => {
  const nuxtApp = useNuxtApp()

  if (nuxtApp.$i18n.locale.value !== currentLanguage.value) {
    setCurrentLanguage(nuxtApp.$i18n.locale.value as SupportedLanguage)
  }

  watch(currentLanguage, (newLang) => {
    if (nuxtApp.$i18n.locale.value !== newLang) {
      nuxtApp.$i18n.locale.value = newLang
    }
  })

  watch(() => nuxtApp.$i18n.locale.value, (newLang) => {
    if (currentLanguage.value !== newLang) {
      setCurrentLanguage(newLang as SupportedLanguage)
    }
  })

  return {
    provide: {
      switchLanguage: (lang: SupportedLanguage) => {
        setCurrentLanguage(lang)
      }
    }
  }
}) 