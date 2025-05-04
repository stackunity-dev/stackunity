<template>
  <nav location="right" temporary class="mobile-nav-drawer d-md-none" :class="{ 'client-ready': isClient }"
    aria-label="Mobile Navigation">
    <v-navigation-drawer v-model="drawer" location="right" temporary
      class="v-navigation-drawer v-navigation-drawer--right v-navigation-drawer--temporary v-theme--dark v-theme--dark pa-6"
      role="dialog" aria-modal="true">
      <div class="drawer-header mb-8 d-flex justify-space-between align-center">
        <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="120"
          loading="eager">
        <v-btn icon variant="text" aria-label="Close navigation menu" @click="drawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="mobile-nav-links" aria-label="Mobile Navigation">
        <v-list nav role="menu">
          <v-list-item v-for="item in menuItems" :key="item.href" :href="item.href" @click="drawer = false"
            class="mobile-nav-item mb-3" rounded="lg" role="menuitem"
            :aria-current="activeSection === item.href.substring(1) ? 'page' : undefined" aria-label="Navigation item">
            <template v-slot:prepend>
              <v-icon class="mr-2" :icon="item.icon" color="primary" aria-hidden="true"></v-icon>
            </template>
            <v-list-item-title class="text-subtitle-1 font-weight-medium">{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <div class="drawer-footer mt-auto pt-6">
        <v-btn block color="secondary" :to="localePath('/signup')" aria-label="Get started" class="mb-4"
          @mouseenter="setHoverOn('start-free-trial')" @mouseleave="setHoverOff('start-free-trial')"
          :elevation="getElevation('start-free-trial', 6, 20)">
          {{ t().hero.ctaMobile }}
        </v-btn>
        <p class="text-caption text-center text-medium-emphasis">{{ t().hero.ctaMobileDescription }}</p>
      </div>
    </v-navigation-drawer>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTranslations } from '../../../languages/';
import { setHoverOn, setHoverOff, getElevation } from '../../../utils/hover-state';
// @ts-ignore
import { useNuxtApp } from '#app';
import '../landing.css';

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const t = useTranslations('index')

const isClient = typeof window !== 'undefined'
const activeSection = ref('')
const drawer = ref(false)

const menuItems = computed(() => [
  { title: t().navigation.features, href: '#features', icon: 'mdi-apps-box' },
  { title: t().navigation.pricing, href: '#pricing', icon: 'mdi-tag-outline' },
  { title: t().navigation.faq, href: '#faq', icon: 'mdi-frequently-asked-questions' }
])
</script>