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
          <section class="pt-16 d-flex justify-center" aria-labelledby="how-it-works-heading">
            <img :src="getImageSrc" alt="Preview of StackUnity" class="hero-image rounded-lg" loading="eager"
              width="80%" height="auto">
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

        <FadeInSection>
          <Pricing />
        </FadeInSection>

        <section id="faq" class="py-16">
          <Faq />
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
import { definePageMeta, useHead, useNuxtApp } from '#imports';
import { computed, defineAsyncComponent, onMounted, provide, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import FadeInSection from '../components/FadeInSection.vue';
import BadExperiences from '../components/landing/BadExperiences.vue';
import FeaturesSection from '../components/landing/FeaturesSection.vue';
import FooterSection from '../components/landing/FooterSection.vue';
import HeroSection from '../components/landing/HeroSection.vue';
import HowItWorks from '../components/landing/HowItWorks.vue';
import '../components/landing/landing.css';
import AppBar from '../components/landing/navigation/AppBar.vue';
import MobileDrawer from '../components/landing/navigation/mobileDrawer.vue';
import Snackbar from '../components/snackbar.vue';
import { currentLanguage, useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';
import { filterStyle } from '../utils/filter';
import { getElevation, setHoverOff, setHoverOn } from '../utils/hover-state';
import { trackAuthButtonClicks } from '../utils/usePlausible';

const t = useTranslations('index');

const Pricing = defineAsyncComponent({
  loader: () => import('../components/pricing.vue'),
  delay: 0,
  suspensible: false,
  timeout: 10000
});

const Faq = defineAsyncComponent({
  loader: () => import('../components/faq.vue'),
  delay: 0,
  suspensible: false,
  timeout: 10000
});

definePageMeta({
  layout: 'empty'
})

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
    { rel: 'preload', href: '/logo/stackunity-title.png', as: 'image' }
  ],
})

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const heroFeatures = computed(() => t().hero.features);

const stats = computed(() => [
  { value: '10x', label: t().stats.accelerated },
  { value: '100%', label: t().stats.quality },
  { value: '24/7', label: t().stats.support },
  { value: '50+', label: t().stats.tools }
]);

const features = computed(() => [
  {
    title: t().features.cssAnimations.title,
    description: t().features.cssAnimations.description,
    icon: 'mdi-animation',
    color: 'primary'
  },
  {
    title: t().features.studio.title,
    description: t().features.studio.description,
    icon: 'mdi-palette',
    color: 'secondary'
  },
  {
    title: t().features.semantic.title,
    description: t().features.semantic.description,
    icon: 'mdi-semantic-web',
    color: 'tertiary'
  },
  {
    title: t().features.apiTesting.title,
    description: t().features.apiTesting.description,
    icon: 'mdi-api',
    color: 'info'
  },
  {
    title: t().features.websiteAnalysis.title,
    description: t().features.websiteAnalysis.description,
    icon: 'mdi-magnify',
    color: 'success'
  },
  {
    title: t().features.accessibility.title,
    description: t().features.accessibility.description,
    icon: 'mdi-access-point',
    color: 'warning'
  }
]);

const steps = computed(() => [
  {
    title: t().howItWorks.steps[0].title,
    description: t().howItWorks.steps[0].description,
    link: localePath('/signup'),
    color: 'primary'
  },
  {
    title: t().howItWorks.steps[1].title,
    description: t().howItWorks.steps[1].description,
    link: localePath('/signup'),
    color: 'secondary'
  },
  {
    title: t().howItWorks.steps[2].title,
    description: t().howItWorks.steps[2].description,
    link: localePath('/signup'),
    color: 'tertiary'
  }
]);

const menuItems = computed(() => [
  { title: t().navigation.features, href: '#features', icon: 'mdi-apps-box' },
  { title: t().navigation.pricing, href: '#pricing', icon: 'mdi-tag-outline' },
  { title: t().navigation.faq, href: '#faq', icon: 'mdi-frequently-asked-questions' }
]);



const badExperiences = computed(() => [
  {
    title: t().badExperiences.accessibility.title,
    ctv: t().badExperiences.accessibility.subtitle,
    icon: 'mdi-contrast',
    color: 'primary',
    text: t().badExperiences.accessibility.description
  },
  {
    title: t().badExperiences.seo.title,
    ctv: t().badExperiences.seo.subtitle,
    icon: 'mdi-magnify',
    color: 'secondary',
    text: t().badExperiences.seo.description
  },
  {
    title: t().badExperiences.design.title,
    ctv: t().badExperiences.design.subtitle,
    icon: 'mdi-palette',
    color: 'tertiary',
    text: t().badExperiences.design.description
  }
]);

const drawer = ref(false);
const activeSection = ref('');
const showAppBar = ref(true);
const email = ref('');
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const snackbarTimeout = ref(2000);
const loading = ref(false);
const isClient = ref(false);
const pageReady = ref(false);
const authTracker = trackAuthButtonClicks();

const userStore = useUserStore();
const display = useDisplay();

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

onMounted(() => {
  isClient.value = true;
  document.documentElement.classList.add('page-loaded');
  pageReady.value = true;

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      const loginButtons = document.querySelectorAll('a[to="/login"], v-btn[to="/login"]');
      const signupButtons = document.querySelectorAll('a[to="/signup"], v-btn[to="/signup"]');

      if (authTracker && typeof authTracker.trackAuthButtonClick === 'function' &&
        typeof authTracker.incrementImpressions === 'function') {

        loginButtons.forEach(button => {
          button.addEventListener('click', () => {
            authTracker.trackAuthButtonClick('login', 'index-page', button.textContent?.trim() || 'Login');
          });
        });

        signupButtons.forEach(button => {
          button.addEventListener('click', () => {
            authTracker.trackAuthButtonClick('signup', 'index-page', button.textContent?.trim() || 'Sign Up');
          });
        });

        authTracker.incrementImpressions('login');
        authTracker.incrementImpressions('signup');
      }
    }, 1000);
  }
});

watch(() => currentLanguage.value, (newLang) => {
  if (document) {
    document.documentElement.lang = newLang;
    const heroImage = document.querySelector('.hero-image') as HTMLImageElement;
    if (heroImage) {
      heroImage.src = getImageSrc.value;
    }
  }
}, { immediate: true });

provide('pageReady', pageReady);

const showMessage = (message: string, type = 'info', timeout = 3000) => {
  snackbarText.value = message;
  snackbarColor.value = type;
  snackbarTimeout.value = timeout;
  showSnackbar.value = true;
};
</script>

<style scoped></style>
