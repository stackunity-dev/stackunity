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
          console.log(`[localized-links] Conversion de lien: ${href} → ${localizedPath}`)
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
          console.log(`[localized-links] Mise à jour de lien: ${href} → ${localizedPath}`)
          el.setAttribute('href', localizedPath)
        }
      }
    }
  })

  // Remplacer tous les liens <a> non marqués avec v-localized
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      try {
        const linkElements = document.querySelectorAll<HTMLAnchorElement>('a:not([data-localized])');
        if (linkElements.length > 0) {
          console.log(`[localized-links] ${linkElements.length} liens trouvés à localiser automatiquement`);

          const nuxtLocalePath = useLocalePath();
          linkElements.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('/api/')) {
              const localizedPath = nuxtLocalePath(href);
              if (href !== localizedPath) {
                console.log(`[localized-links] Auto-localisation: ${href} → ${localizedPath}`);
                link.setAttribute('href', localizedPath);
                link.setAttribute('data-localized', 'true');
              }
            }
          });
        }
      } catch (error) {
        console.error('[localized-links] Erreur lors de la localisation automatique des liens:', error);
      }
    }, 500);
  }

  const nuxtApp = vueApp.config.globalProperties

  if (nuxtApp.$localePath && nuxtApp.$switchLocalePath) {
    return {}
  }

  return {
    provide: {
      localePath: (path: string) => {
        const nuxtLocalePath = useLocalePath()
        const localizedPath = nuxtLocalePath(path)
        console.log(`[localized-links] localePath: ${path} → ${localizedPath}`)
        return localizedPath
      },

      switchLocalePath: (lang: string) => {
        const nuxtSwitchLocalePath = useSwitchLocalePath()
        const switchedPath = nuxtSwitchLocalePath(lang)
        console.log(`[localized-links] switchLocalePath: Langue ${lang} → ${switchedPath}`)
        return switchedPath
      }
    }
  }
}) 