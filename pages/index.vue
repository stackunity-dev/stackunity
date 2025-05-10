<template>
  <v-app class="landing-screen" :style="filterStyle">
    <AppBar />
    <MobileDrawer />

    <v-main class="main-content">
      <main>
        <FadeInSection>
          <HeroSection />
        </FadeInSection>

        <FadeInSection>
          <section class="pt-8 d-flex justify-center" aria-labelledby="how-it-works-heading">
            <img :src="getImageSrc" alt="Preview of StackUnity" class="hero-image rounded-lg" loading="eager"
              width="90%" height="auto">
          </section>
        </FadeInSection>

        <FadeInSection>
          <section class="stats-section py-8" aria-labelledby="stats-heading">
            <v-container>
              <v-row class="align-center justify-center">
                <v-col v-for="(stat, i) in stats" :key="i" cols="6" sm="3" class="text-center">
                  <div class="stat-value text-h3 font-weight-bold primary--text mb-1" role="text"
                    aria-label="{{ stat.label }}: {{ stat.value }}">{{ stat.value }}</div>
                  <div class="stat-label text-subtitle-2 text-medium-emphasis">{{ stat.label }}</div>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </FadeInSection>

        <FadeInSection>
          <BadExperiences />
        </FadeInSection>

        <FadeInSection>
          <FeaturesSection />
        </FadeInSection>

        <FadeInSection>
          <HowItWorks />
        </FadeInSection>

        <ClientOnly>
          <FadeInSection>
            <Pricing />
          </FadeInSection>
        </ClientOnly>

        <section id="faq" class="py-16">
          <ClientOnly>
            <Faq />
            <template #fallback>
              <div class="faq-loading-placeholder pa-8 text-center">
                <h2 class="text-h4 mb-4">{{ t().faq.title }}</h2>
                <p class="text-body-1">{{ t().faq.loading || 'Loading frequently asked questions...' }}</p>
              </div>
            </template>
          </ClientOnly>
        </section>

        <section class="py-16 primary" aria-labelledby="cta-heading">
          <v-container>
            <v-row justify="center">
              <v-col cols="12" md="8" class="text-center">
                <h2 id="cta-heading" class="text-h3 text-gradient font-weight-bold white--text mb-4">{{ t().cta.title }}
                </h2>
                <p class="text-subtitle-1 white--text text-opacity-high mb-8">
                  {{ t().cta.description }}
                </p>
                <v-btn x-large color="secondary" variant="elevated"
                  :elevation="getElevation('create-free-account', 2, 20)"
                  @mouseenter="setHoverOn('create-free-account')" @mouseleave="setHoverOff('create-free-account')"
                  class="px-8" aria-label="Create an account" :to="localePath('/signup')">
                  {{ t().cta.button }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </main>

      <FooterSection />
    </v-main>

    <Snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="snackbarTimeout" />
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore 
import { definePageMeta, onServerPrefetch, useHead, useNuxtApp } from '#imports';
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue';
import FadeInSection from '../components/FadeInSection.vue';
import BadExperiences from '../components/landing/BadExperiences.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import FooterSection from '../components/landing/FooterSection.vue';
import HeroSection from '../components/landing/HeroSection.vue';
import HowItWorks from '../components/landing/HowItWorks.vue';
import '../components/landing/landing.css';
import AppBar from '../components/landing/navigation/AppBar.vue';
import MobileDrawer from '../components/landing/navigation/MobileDrawer.vue';
import Snackbar from '../components/snackbar.vue';
import { currentLanguage, useTranslations } from '../languages';
import { filterStyle } from '../utils/filter';
import { getElevation, setHoverOff, setHoverOn } from '../utils/hover-state';

const t = useTranslations('index');
const isHydrating = ref(true);
const ssrComplete = ref(false);
const isClient = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const snackbarTimeout = ref(2000);
const nuxtApp = useNuxtApp();
const localePath = nuxtApp.$localePath;

const getImageSrc = computed(() => {
  if (currentLanguage.value === 'fr') {
    return '/images/preview/preview-fr.avif';
  } else if (currentLanguage.value === 'es') {
    return '/images/preview/preview-es.avif';
  } else if (currentLanguage.value === 'ar') {
    return '/images/preview/preview-ar.avif';
  } else if (currentLanguage.value === 'zh') {
    return '/images/preview/preview-cn.avif';
  } else {
    return '/images/preview/preview-en.avif';
  }
});

const Pricing = defineAsyncComponent({
  loader: () => import('../components/pricing.vue'),
  delay: 200,
  suspensible: false,
  timeout: 10000
});

const Faq = defineAsyncComponent({
  loader: () => import('../components/faq.vue'),
  delay: 300,
  suspensible: false,
  timeout: 10000
});

definePageMeta({
  layout: 'empty',
  keepalive: {
    max: 10
  }
})

const stats = computed(() => [
  { value: '10x', label: t().stats.accelerated },
  { value: '100%', label: t().stats.quality },
  { value: '24/7', label: t().stats.support },
  { value: '50+', label: t().stats.tools }
]);

useHead({
  htmlAttrs: {
    lang: computed(() => currentLanguage.value)
  },
  title: computed(() => t().meta.title),
  meta: [
    { name: 'description', content: computed(() => t().meta.description) },
    { name: 'keywords', content: computed(() => t().meta.keywords) },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: computed(() => t().meta.title) },
    { property: 'og:description', content: computed(() => t().meta.description) },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:url', content: 'https://stackunity.tech' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Logo StackUnity' },
    { property: 'og:image:secure_url', content: 'https://stackunity.tech/images/preview.png' },
    { property: 'og:locale', content: computed(() => currentLanguage.value === 'en' ? 'en_US' : currentLanguage.value === 'fr' ? 'fr_FR' : currentLanguage.value === 'es' ? 'es_ES' : currentLanguage.value === 'ar' ? 'ar_SA' : 'zh_CN') },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => t().meta.title) },
    { name: 'twitter:description', content: computed(() => t().meta.description) },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.tech' },
    { rel: 'preload', href: '/logo/stackunity-title.png', as: 'image' },
    { rel: 'preload', href: computed(() => getImageSrc.value), as: 'image' }
  ],
  script: [
    {
      innerHTML: `
        document.documentElement.classList.add('index-page-ready');
      `,
      type: 'text/javascript'
    }
  ]
})

onServerPrefetch(async () => {
  ssrComplete.value = true;
});

onMounted(() => {
  isClient.value = true;
  isHydrating.value = false;
});

watch(() => currentLanguage.value, (newLang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = newLang;
    const heroImage = document.querySelector('.hero-image') as HTMLImageElement;
    if (heroImage) {
      heroImage.src = getImageSrc.value;
    }
  }
});
</script>

<style>
.main-content {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-image {
  max-width: 100%;
  height: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 599px) {
  .stat-value {
    font-size: 1.5rem !important;
    line-height: 1.4 !important;
  }

  .stat-label {
    font-size: 0.7rem !important;
  }
}
</style>
