<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props" class="language-selector" :aria-label="getAriaLabelForLanguageSelector()"
        :title="getAriaLabelForLanguageSelector()" aria-haspopup="menu" aria-expanded="menu">
        <v-icon class="mr-2" aria-hidden="true">mdi-translate</v-icon>
        <span class="text-capitalize">{{ currentLanguageName }}</span>
      </v-btn>
    </template>

    <v-card min-width="200" class="pa-2" role="menu" aria-labelledby="language-menu-title">
      <p id="language-menu-title" class="sr-only">{{ getAriaLabelForLanguageMenu() }}</p>
      <v-list density="compact">
        <v-list-item v-for="language in availableLanguages" :key="language.code" :value="language.code"
          @click="switchLanguage(language.code as SupportedLanguage)" :active="language.code === currentLanguage"
          rounded="md" role="menuitem" :aria-label="getLanguageAriaLabel(language)" :lang="language.code"
          :aria-current="language.code === currentLanguage ? 'true' : 'false'">
          <template v-slot:prepend>
            <span class="language-flag mr-2" aria-hidden="true">{{ language.flag }}</span>
            <v-icon v-if="language.code === currentLanguage" color="primary" class="mr-2"
              aria-hidden="true">mdi-check</v-icon>
          </template>
          <v-list-item-title class="text-capitalize">
            {{ language.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
// @ts-ignore
import { useNuxtApp, useRoute, useRouter } from '#imports'
import { computed, ref } from 'vue'
import {
  availableLanguages,
  currentLanguage,
  SupportedLanguage
} from '../languages'

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const { $switchLanguage } = nuxtApp
const menu = ref(false)

const currentLanguageName = computed(() => {
  const lang = availableLanguages.find(l => l.code === currentLanguage.value)
  return lang ? lang.name : ''
})

const getAriaLabelForLanguageSelector = () => {
  switch (currentLanguage.value) {
    case 'fr': return 'Sélectionner une langue';
    case 'es': return 'Seleccionar idioma';
    case 'ar': return 'اختر لغة';
    case 'zh': return '选择语言';
    default: return 'Select language';
  }
}

const getAriaLabelForLanguageMenu = () => {
  switch (currentLanguage.value) {
    case 'fr': return 'Menu de sélection de langue';
    case 'es': return 'Menú de selección de idioma';
    case 'ar': return 'قائمة اختيار اللغة';
    case 'zh': return '语言选择菜单';
    default: return 'Language selection menu';
  }
}

const getLanguageAriaLabel = (language: { code: string, name: string }) => {
  if (language.code === currentLanguage.value) {
    switch (currentLanguage.value) {
      case 'fr': return `${language.name} (langue actuelle)`;
      case 'es': return `${language.name} (idioma actual)`;
      case 'ar': return `${language.name} (اللغة الحالية)`;
      case 'zh': return `${language.name} (当前语言)`;
      default: return `${language.name} (current language)`;
    }
  }

  switch (currentLanguage.value) {
    case 'fr':
      return `Changer pour ${language.name}`;
    case 'es':
      return `Cambiar a ${language.name}`;
    case 'ar':
      return `التغيير إلى ${language.name}`;
    case 'zh':
      return `切换到 ${language.name}`;
    default:
      return `Switch to ${language.name}`;
  }
}

const switchLanguage = (lang: SupportedLanguage) => {
  if (lang !== currentLanguage.value) {
    $switchLanguage(lang)

    const routeBaseName = nuxtApp.$i18n.getRouteBaseName()

    if (routeBaseName) {
      const localePath = nuxtApp.$i18n.localePath({
        name: routeBaseName,
        params: route.params,
        query: route.query
      }, lang)

      if (localePath) {
        router.push(localePath)
      }
    } else {
      const homePath = lang === 'en' ? '/' : `/${lang}`
      router.push(homePath)
    }
  }

  menu.value = false
}
</script>

<style scoped>
.language-selector {
  text-transform: none;
}

.language-flag {
  font-size: 1.2rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>