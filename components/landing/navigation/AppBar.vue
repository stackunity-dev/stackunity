<template>
  <header>
    <v-app-bar app :elevation="2" :color="'surface'" class="px-0 nav-bar" :model-value="true" role="banner">
      <v-container class="d-flex align-center py-0 my-0">
        <NuxtLink :to="localePath('/login')" class="text-decoration-none mr-2" aria-label="StackUnity Home">
          <div class="d-flex align-center brand-container">
            <img src="https://stackunity.tech/logo/stackunity-title.png"
              alt="StackUnity - developement hub all-in-one platform" width="150" class="logo-image">
            <div class="brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left">
              <span class="text-caption font-weight-medium text-gradient">{{ t().hero.tagline }}</span>
            </div>
          </div>
        </NuxtLink>
        <LanguageSelector />
        <v-spacer></v-spacer>

        <div v-if="isClient" class="d-flex align-center" aria-label="Main Navigation">
          <nav v-if="display.smAndUp.value" class="d-flex align-center custom-nav-menu" aria-label="Main Navigation">
            <div class="nav-links-wrapper" role="menubar" aria-label="Main Navigation">
              <v-btn v-for="item in menuItems" :key="item.href" class="nav-btn custom-btn" :href="item.href"
                :class="{ 'active-nav-btn': activeSection === item.href.substring(1) }" variant="text" role="menuitem"
                :aria-current="activeSection === item.href.substring(1) ? 'page' : undefined"
                aria-label="Navigation item">
                <span class="nav-text" aria-hidden="true" aria-label="Navigation item">{{ item.title }}</span>
                <span class="nav-btn-background" aria-hidden="true" aria-label="Navigation item"></span>
              </v-btn>
            </div>

            <div class="auth-buttons ml-4" role="navigation" aria-label="Authentication">
              <v-btn color="primary" class="login-btn" aria-label="Login" :to="localePath('/login')" variant="tonal"
                rounded="rounded-xl" prepend-icon="mdi-login">
                {{ t().navigation.login }}
              </v-btn>
            </div>
          </nav>

          <div v-else class="d-flex align-center">
            <v-btn color="primary" class="mr-2" :to="localePath('/login')" aria-label="Login" size="small"
              rounded="pill">
              <v-icon size="small" class="mr-1">mdi-login</v-icon>
              {{ t().navigation.login }}
            </v-btn>
            <v-btn icon @click="toggleDrawer()" class="menu-toggle-btn" aria-label="Toggle navigation menu"
              :aria-expanded="isDrawerOpen">
              <div class="hamburger-icon" :class="{ 'active': isDrawerOpen }" aria-hidden="true"
                aria-label="Toggle navigation menu">
                <span aria-hidden="true" aria-label="Toggle navigation menu"></span>
                <span aria-hidden="true" aria-label="Toggle navigation menu"></span>
                <span aria-hidden="true" aria-label="Toggle navigation menu"></span>
              </div>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
// @ts-ignore
import { useNuxtApp } from '#app';
import { useTranslations } from '../../../languages';
import { useDrawerState } from '../../../utils/drawer-state';
import '../landing.css';

const t = useTranslations('index');

const display = useDisplay();

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

// Utiliser l'état partagé du drawer
const { isDrawerOpen, toggleDrawer } = useDrawerState();

const menuItems = computed(() => [
  { title: t().navigation.features, href: '#features', icon: 'mdi-apps-box' },
  { title: t().navigation.pricing, href: '#pricing', icon: 'mdi-tag-outline' },
  { title: t().navigation.faq, href: '#faq', icon: 'mdi-frequently-asked-questions' }
]);

const isClient = computed(() => true);

const activeSection = ref('');

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const sections = ['features', 'pricing', 'faq'];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            activeSection.value = section;
            break;
          }
        }
      }
    });
  }
});
</script>
