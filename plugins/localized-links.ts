// @ts-ignore
import { defineNuxtPlugin } from '#app'
// @ts-ignore
import { useLocalePath, useSwitchLocalePath } from '#imports'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('localized', {
    mounted(el, binding) {
      if (el.tagName === 'A') {
        const nuxtLocalePath = useLocalePath()

        const href = el.getAttribute('href')
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
          const localizedPath = nuxtLocalePath(href)
          el.setAttribute('href', localizedPath)
        }
      }
    },
    updated(el, binding) {
      if (el.tagName === 'A') {
        const nuxtLocalePath = useLocalePath()

        const href = el.getAttribute('href')
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
          const localizedPath = nuxtLocalePath(href)
          el.setAttribute('href', localizedPath)
        }
      }
    }
  })

  const nuxtApp = vueApp.config.globalProperties

  if (nuxtApp.$localePath && nuxtApp.$switchLocalePath) {
    return {}
  }

  return {
    provide: {
      localePath: (path: string) => {
        const nuxtLocalePath = useLocalePath()
        return nuxtLocalePath(path)
      },

      switchLocalePath: (lang: string) => {
        const nuxtSwitchLocalePath = useSwitchLocalePath()
        return nuxtSwitchLocalePath(lang)
      }
    }
  }
}) 