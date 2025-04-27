<template>
  <v-app class="landing-screen" :style="filterStyle">
    <header>
      <v-app-bar app :elevation="2" :color="'surface'" class="px-0 nav-bar" v-model="showAppBar" role="banner">
        <v-container class="d-flex align-center py-0 my-0">
          <NuxtLink to="/login" class="text-decoration-none" aria-label="StackUnity Home">
            <div class="d-flex align-center brand-container">
              <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="150"
                class="logo-image">
              <div class="brand-tagline d-none d-lg-flex align-center ml-2 pl-2 border-left">
                <span class="text-caption font-weight-medium text-gradient">OPTIMIZE YOUR WORKFLOW</span>
              </div>
            </div>
          </NuxtLink>
          <v-spacer></v-spacer>

          <div v-if="isClient" class="d-flex align-center">
            <nav v-if="display.smAndUp.value" class="d-flex align-center custom-nav-menu" aria-label="Main Navigation">
              <div class="nav-links-wrapper" role="menubar">
                <v-btn v-for="item in menuItems" :key="item.href" class="nav-btn custom-btn" :href="item.href"
                  :class="{ 'active-nav-btn': activeSection === item.href.substring(1) }" variant="text" role="menuitem"
                  :aria-current="activeSection === item.href.substring(1) ? 'page' : undefined"
                  aria-label="Navigation item">
                  <span class="nav-text" aria-hidden="true">{{ item.title }}</span>
                  <span class="nav-btn-background" aria-hidden="true"></span>
                </v-btn>
              </div>

              <div class="auth-buttons ml-4" role="navigation" aria-label="Authentication">
                <v-btn color="primary" class="login-btn" aria-label="Login" to="/login" variant="tonal"
                  rounded="rounded-xl" prepend-icon="mdi-login">
                  Login
                </v-btn>
              </div>
            </nav>

            <div v-else class="d-flex align-center">
              <v-btn color="primary" class="mr-2" to="/login" aria-label="Login" size="small" rounded="pill">
                <v-icon size="small" class="mr-1">mdi-login</v-icon>
                Login
              </v-btn>
              <v-btn icon @click="drawer = !drawer" class="menu-toggle-btn" aria-label="Toggle navigation menu"
                :aria-expanded="drawer">
                <div class="hamburger-icon" :class="{ 'active': drawer }" aria-hidden="true"
                  aria-label="Toggle navigation menu">
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                  <span aria-hidden="true"></span>
                </div>
              </v-btn>
            </div>
          </div>
        </v-container>
      </v-app-bar>
    </header>

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

        <div class="mobile-nav-links">
          <v-list nav role="menu">
            <v-list-item v-for="item in menuItems" :key="item.href" :href="item.href" @click="drawer = false"
              class="mobile-nav-item mb-3" rounded="lg" role="menuitem"
              :aria-current="activeSection === item.href.substring(1) ? 'page' : undefined"
              aria-label="Navigation item">
              <template v-slot:prepend>
                <v-icon class="mr-2" :icon="item.icon" color="primary" aria-hidden="true"></v-icon>
              </template>
              <v-list-item-title class="text-subtitle-1 font-weight-medium">{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <div class="drawer-footer mt-auto pt-6">
          <v-btn block color="secondary" to="/signup" aria-label="Get started" class="mb-4"
            @mouseenter="setHoverOn('start-free-trial')" @mouseleave="setHoverOff('start-free-trial')"
            :elevation="getElevation('start-free-trial', 6, 20)">
            Get started for free
          </v-btn>
          <p class="text-caption text-center text-medium-emphasis">Join our community of developers and propulse your
            web projects to new horizons.</p>
        </div>
      </v-navigation-drawer>
    </nav>

    <v-main class="main-content">
      <main>
        <FadeInSection>
          <section class="hero-section py-16" aria-labelledby="hero-heading">
            <v-container>
              <v-row align="center" justify="center">
                <v-col cols="12" md="9"
                  class="text-center justify-center d-flex flex-column align-center text-md-start">
                  <h1 id="hero-heading" class="text-h2 text-gradient text-center font-weight-bold mb-4"
                    style="max-width: 800px">
                    Simplify your development workflow in just a few clicks and develop faster
                  </h1>
                  <p class="text-h5 text-center mb-4 text-medium-emphasis">
                    Develop faster and simplify your workflow with our integrated professional tools. Build, manage and
                    optimize your projects for a site that is more accessible, user-friendly and SEO-friendly.
                  </p>
                  <div class="features-banner d-flex flex-wrap justify-center mb-6">
                    <div class="mini-feature mr-4 mb-2" v-for="feature in heroFeatures" :key="feature">
                      <v-icon color="tertiary" size="small" class="mr-1">mdi-check-circle</v-icon>
                      <span class="text-body-2">{{ feature }}</span>
                    </div>
                  </div>
                  <div class="d-flex flex-column flex-sm-row ga-4 justify-center" role="group"
                    aria-label="Call to action">
                    <v-btn color="secondary" size="x-large" aria-label="Get started" to="/signup" variant="elevated"
                      class="px-16 my-4" :elevation="getElevation('start-free-trial', 6, 20)"
                      @mouseenter="setHoverOn('start-free-trial')" @mouseleave="setHoverOff('start-free-trial')"
                      width="80%">
                      <v-icon start aria-hidden="true">mdi-rocket-launch-outline</v-icon>
                      {{ display.smAndDown.value ? 'Try for free' : 'Simplify your workflow now' }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section class="pt-16 d-flex justify-center" aria-labelledby="how-it-works-heading">
            <img src="/public/images/preview-stackunity.avif" alt="Aperçu de la plateforme StackUnity"
              class="hero-image rounded-lg" loading="eager" width="80%" height="auto">
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
          <section class="py-16 bad-experiences-section" aria-labelledby="bad-experiences-heading">
            <v-container>
              <div class="text-center mb-12">
                <h2 id="bad-experiences-heading" class="text-h3 text-gradient font-weight-bold mb-4">
                  Don't let bad experiences drive your users away
                </h2>
                <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
                  Discover how our tools can help you create a better user experience
                </p>
              </div>

              <v-row class="mx-0">
                <v-col cols="12" md="4" v-for="(badExperience, index) in badExperiences" :key="badExperience.title">
                  <v-card class="bad-experience-card h-100" :class="`border-${badExperience.color}`" elevation="0">
                    <v-card-item>
                      <v-avatar :color="badExperience.color" size="56" class="mb-4">
                        <v-icon size="24">{{ badExperience.icon }}</v-icon>
                      </v-avatar>
                      <v-card-title class="text-h5 font-weight-bold pt-2">
                        {{ badExperience.title }}
                      </v-card-title>
                      <v-card-subtitle class="pt-2 text-medium-emphasis d-flex flex-wrap">
                        Did you know that {{ badExperience.ctv }}
                      </v-card-subtitle>
                      <v-card-text class="text-body-1">
                        {{ badExperience.text }}
                      </v-card-text>
                    </v-card-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </section>
        </FadeInSection>

        <FadeInSection>
          <section id="features" class="py-16" aria-labelledby="features-heading">
            <v-container>
              <div class="text-center mb-12">
                <span class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 d-block">Main
                  features</span>
                <h2 id="features-heading" class="text-h3 text-gradient font-weight-bold mb-3">Powerful tools for your
                  projects
                </h2>
                <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
                  StackUnity gathers all the tools you need to develop modern web applications on a single platform.
                </p>
              </div>

              <v-row>
                <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4" class="mb-8">
                  <article class="feature-card h-100 rounded-lg" role="article"
                    aria-labelledby="feature-title-{{ index }}">
                    <v-card class="feature-card h-100 rounded-lg" flat>
                      <v-card-text class="pa-6">
                        <v-avatar :color="feature.color" size="56" class="mb-4" aria-hidden="true">
                          <v-icon dark size="32">{{ feature.icon }}</v-icon>
                        </v-avatar>

                        <div class="d-flex align-center justify-space-between">
                          <h3 id="feature-title-{{ index }}" class="text-h5 font-weight-bold mb-3">
                            {{ feature.title }}
                          </h3>

                          <div v-if="feature.title === 'Accessibility'" class="vision-filter-wrapper ml-2">
                            <v-menu offset-y>
                              <template v-slot:activator="{ props }">
                                <v-btn icon density="comfortable" variant="text" v-bind="props"
                                  :color="selectedVisionType !== 'normal' ? 'primary' : feature.color"
                                  aria-label="Test vision impairments" size="small">
                                  <v-icon>{{ visionTypeIcon }}</v-icon>
                                  <v-tooltip activator="parent" location="top">
                                    Try different vision types
                                  </v-tooltip>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item v-for="type in visionTypes" :key="type.value"
                                  @click="selectedVisionType = type.value; applyVisionFilter()">
                                  <template v-slot:prepend>
                                    <v-icon :icon="type.icon"
                                      :color="selectedVisionType === type.value ? 'primary' : ''"></v-icon>
                                  </template>
                                  <v-list-item-title>{{ type.title }}</v-list-item-title>
                                </v-list-item>
                                <v-divider v-if="selectedVisionType !== 'normal'"></v-divider>
                                <v-list-item v-if="selectedVisionType !== 'normal'">
                                  <v-slider v-model="filterIntensity" :min="0" :max="100" :step="1" label="Intensity"
                                    hide-details class="px-2 py-0" density="compact"
                                    @update:model-value="applyVisionFilter">
                                  </v-slider>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </div>

                        <p class="text-body-1 text-medium-emphasis">{{ feature.description }}</p>
                      </v-card-text>
                    </v-card>
                  </article>
                </v-col>
              </v-row>
              <div class="d-flex justify-center mt-4">
                <v-btn size="large" color="secondary" variant="elevated" class="px-8 rounded-pill"
                  :elevation="getElevation('get-started-now', 2, 20)" @mouseenter="setHoverOn('get-started-now')"
                  @mouseleave="setHoverOff('get-started-now')" to="/signup" aria-label="Get started now" nuxt>
                  Get started now
                  <v-icon end aria-hidden="true">mdi-rocket-launch-outline</v-icon>
                </v-btn>
              </div>
            </v-container>
          </section>
        </FadeInSection>

        <section class="py-16 how-it-works-section" aria-labelledby="how-it-works-heading">
          <v-container>
            <div class="text-center mb-12">
              <h2 id="how-it-works-heading" class="text-h3 text-gradient font-weight-bold mb-3">How it works</h2>
              <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
                Three simple steps to transform your development workflow
              </p>
            </div>

            <v-timeline align="center" line-color="secondary" line-width="2"
              :direction="display.smAndDown.value ? 'vertical' : 'horizontal'">
              <v-timeline-item v-for="(step, i) in steps" :key="i" :dot-color="step.color" size="large"
                :icon="getStepIcon(i)" line-inset="12">
                <template v-slot:opposite>
                  <div class="text-h2 font-weight-bold" :class="`text-${step.color}`">0{{ i + 1 }}</div>
                </template>
                <v-card :class="`border-${step.color} timeline-card`" elevation="0">
                  <v-card-item>
                    <v-card-title class="text-h5 font-weight-bold">{{ step.title }}</v-card-title>
                    <v-card-text class="text-body-1">{{ step.description }}</v-card-text>
                    <v-card-actions>
                      <v-btn :color="step.color" variant="text" :to="step.link" class="px-0"
                        :aria-label="`Learn more about ${step.title}`">
                        Learn more
                        <v-icon end>mdi-arrow-right</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card-item>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-container>
        </section>

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
                <h2 id="cta-heading" class="text-h3 text-gradient font-weight-bold white--text mb-4">Ready to start ?
                </h2>
                <p class="text-subtitle-1 white--text text-opacity-high mb-8">
                  Simplify your workflow with our tools and get more rest now.
                </p>
                <v-btn x-large color="secondary" variant="elevated"
                  :elevation="getElevation('create-free-account', 2, 20)"
                  @mouseenter="setHoverOn('create-free-account')" @mouseleave="setHoverOff('create-free-account')"
                  class="px-8" aria-label="Create an account" to="/signup">
                  7-day free trial
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </section>
      </main>
    </v-main>

    <footer class="py-8" aria-label="Site Footer">
      <v-container>
        <v-row>
          <v-col cols="12" md="5" lg="5" class="mb-6 mb-md-0">
            <div class="d-flex align-center mb-4">
              <img src="/logo/stackunity-title.png" alt="StackUnity - developement hub all-in-one platform" width="180"
                loading="eager">
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Simplify your workflow with our tools and get more rest now.
            </p>
            <div class="newsletter-signup mb-6">
              <form class="d-flex" aria-label="Newsletter Subscription">
                <v-text-field v-model="email" density="compact" placeholder="Your email address"
                  aria-label="Your email address" variant="outlined" hide-details class="mr-2"
                  prepend-inner-icon="mdi-email-outline"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"></v-text-field>
                <v-btn color="info" variant="tonal" class="ml-n1" :loading="loading" @click="submitEmail" type="submit"
                  aria-label="Subscribe to newsletter">
                  Subscribe
                </v-btn>
              </form>
              <p class="text-caption text-medium-emphasis mt-1">
                Receive our latest news and development tips
              </p>
            </div>
            <nav aria-label="Social Media Links">
              <div class="d-flex">
                <v-btn icon variant="text" class="mr-3" href="https://twitter.com" target="_blank" aria-label="Twitter">
                  <v-icon>mdi-twitter</v-icon>
                </v-btn>
                <v-btn icon variant="text" class="mr-3" href="https://github.com/stackunity-dev/stackunity"
                  target="_blank" aria-label="GitHub">
                  <v-icon>mdi-github</v-icon>
                </v-btn>
                <v-btn icon variant="text" class="mr-3" href="https://www.linkedin.com/company/stackunity/"
                  target="_blank" aria-label="LinkedIn">
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </div>
            </nav>
          </v-col>

          <v-col cols="12" md="7" lg="7">
            <v-row class="footer-columns-container">
              <v-col v-for="(column, index) in footerColumns" :key="index" cols="6" md="4" class="footer-column px-4">
                <h4 id="footer-column-heading-{{index}}" class="text-subtitle-1 font-weight-bold mb-4">{{ column.title
                }}
                </h4>
                <nav class="footer-links" aria-labelledby="footer-column-heading-{{index}}">
                  <NuxtLink v-for="(link, linkIndex) in column.links" :key="linkIndex" :to="link.to"
                    class="footer-link d-block mb-3" :aria-label="link.ariaLabel">
                    {{ link.title }}
                  </NuxtLink>
                </nav>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider class="my-6"></v-divider>

        <div class="d-flex flex-column flex-sm-row justify-space-between align-center">
          <div class="text-body-2 text-medium-emphasis mb-3 mb-sm-0">
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </div>
          <div class="d-flex align-center">
            <a href="mailto:contact@stackunity.com"
              class="text-body-2 text-decoration-none text-medium-emphasis">support@stackunity.tech</a>
          </div>
        </div>
      </v-container>
    </footer>

    <Snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="snackbarTimeout" />
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore 
import { definePageMeta, useHead } from '#imports';
import { defineAsyncComponent, onMounted, provide, ref } from 'vue';
import { useDisplay } from 'vuetify';
import FadeInSection from '../components/FadeInSection.vue';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
import { applyVisionFilter, filterIntensity, filterStyle, selectedVisionType, visionTypeIcon, visionTypes } from '../utils/filter';
import { getElevation, setHoverOff, setHoverOn } from '../utils/hover-state';

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
    lang: 'en'
  },
  title: 'StackUnity - Simplify your development workflow',
  meta: [
    { name: 'description', content: 'StackUnity is the all-in-one platform for developers who want to simplify their development workflow and develop faster.' },
    { name: 'keywords', content: 'web development, developer platform, development tools, SEO audit, SQL generator, accessibility' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'StackUnity - Simplify your development workflow' },
    { property: 'og:description', content: 'StackUnity is the all-in-one platform for developers who want to simplify their development workflow and develop faster.' },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:url', content: 'https://stackunity.tech' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'Logo StackUnity' },
    { property: 'og:image:secure_url', content: 'https://stackunity.tech/images/preview.png' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'StackUnity - Simplify your development workflow' },
    { name: 'twitter:description', content: 'StackUnity is the all-in-one platform for developers who want to simplify their development workflow and develop faster.' },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.tech' },
    { rel: 'preload', href: '/logo/stackunity-title.png', as: 'image' }
  ],
})

const heroFeatures = ['Website management', 'SQL visualizer', 'Accessibility', 'API testing'];
const stats = [
  { value: '10x', label: 'Accelerated development' },
  { value: '100%', label: 'Code quality' },
  { value: '24/7', label: 'Available support' },
  { value: '50+', label: 'Integrated tools' }
];

const features = [
  {
    title: 'CSS animations',
    description: 'Create and manage CSS animations for all your projects.',
    icon: 'mdi-animation',
    color: 'primary'
  },
  {
    title: 'Studio',
    description: 'Create modern user interfaces with our integrated design studio.',
    icon: 'mdi-palette',
    color: 'secondary'
  },
  {
    title: 'Semantic',
    description: 'Optimize your website with our semantic and ARIA analysis tools.',
    icon: 'mdi-semantic-web',
    color: 'tertiary'
  },
  {
    title: 'API testing',
    description: 'Test your APIs to detect security vulnerabilities and performance issues.',
    icon: 'mdi-api',
    color: 'info'
  },
  {
    title: 'Website analysis',
    description: 'Analyze your website with our tools to improve its performance and accessibility.',
    icon: 'mdi-magnify',
    color: 'success'
  },
  {
    title: 'Accessibility',
    description: 'Check and improve the accessibility of your websites for all users.',
    icon: 'mdi-access-point',
    color: 'warning'
  }
];

const steps = [
  {
    title: 'Create your account',
    description: 'Sign up for free and configure your developer profile in a few minutes.',
    link: '/signup',
    color: 'primary'
  },
  {
    title: 'Choose your tools',
    description: 'Select the tools you need for your project from our wide range of features.',
    link: '/signup',
    color: 'secondary'
  },
  {
    title: 'Develop faster',
    description: 'Use our tools to accelerate your development and improve the quality of your projects.',
    link: '/signup',
    color: 'tertiary'
  }
];

const menuItems = [
  { title: 'Features', href: '#features', icon: 'mdi-apps-box' },
  { title: 'Pricing', href: '#pricing', icon: 'mdi-tag-outline' },
  { title: 'FAQ', href: '#faq', icon: 'mdi-frequently-asked-questions' }
];

const footerColumns = [
  {
    title: 'Product',
    links: [
      { title: 'Features', to: '#features', ariaLabel: 'Features' },
      { title: 'Pricing', to: '#pricing', ariaLabel: 'Pricing' },
      { title: 'FAQ', to: '#faq', ariaLabel: 'FAQ' }
    ]
  },
  {
    title: 'Company',
    links: [
      { title: 'About', to: '/about', ariaLabel: 'About' },
      { title: 'Contact', to: '/contact', ariaLabel: 'Contact' },
      { title: 'Blog', to: '/blog', ariaLabel: 'Blog' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy', to: '/privacy', ariaLabel: 'Privacy' },
      { title: 'Terms', to: '/terms', ariaLabel: 'Terms' },
      { title: 'Notices', to: '/notices', ariaLabel: 'Notices' }
    ]
  }
];

const badExperiences = [
  {
    title: 'Not inclusive',
    ctv: '8% of the world\'s population have a visual impairment ?',
    icon: 'mdi-contrast',
    color: 'primary',
    text: 'Your users flee because they can\'t access your site due to visual impairments ?\n' +
      'Inclusivity is a problem that can be solved with our contrast checker and visual impairment simulator.'
  },
  {
    title: 'Not optimized',
    ctv: 'your site is not optimized for search engines ?',
    icon: 'mdi-magnify',
    color: 'secondary',
    text: 'We can help you optimize the SEO of your site with our semantic and SEO analysis tool.' +
      'We provide a unique solution that mix the best of the semantic/metadata and user engagement analysis.'
  },
  {
    title: 'Not attractive',
    ctv: 'your site is not attractive ?',
    icon: 'mdi-palette',
    color: 'tertiary',
    text: 'We can help you make your site more attractive with our design studio and this seo tool.' +
      'We can also help you with our responsive checker and content analysis tool.'
  }
];
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

const userStore = useUserStore();

const display = useDisplay();

onMounted(() => {
  isClient.value = true;

  document.documentElement.classList.add('page-loaded');

  pageReady.value = true;
});

provide('pageReady', pageReady);

const submitEmail = async () => {
  if (!email.value) {
    showMessage('Please enter your email address', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  loading.value = true;

  try {
    await userStore.subscribeToNewsletter(email.value);

    showMessage('Thanks for subscribing! You\'ll receive our latest updates soon.', 'success');

    email.value = '';
  } catch (error) {
    console.error('Error during subscription:', error);
    showMessage('An error occurred. Please try again later.', 'error');
  } finally {
    loading.value = false;
  }
};

const showMessage = (message: string, type = 'info', timeout = 3000) => {
  snackbarText.value = message;
  snackbarColor.value = type;
  snackbarTimeout.value = timeout;
  showSnackbar.value = true;
};

const getStepIcon = (index) => {
  const icons = ['mdi-account-plus', 'mdi-tools', 'mdi-rocket-launch'];
  return icons[index];
};
</script>

<style scoped>
.landing-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.main-content {
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.hero-section {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.v-application {
  transition: opacity 0.2s ease;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 70% 30%, rgba(103, 90, 200, 0.4), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(45, 158, 225, 0.4), transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(200, 80, 190, 0.3), transparent 40%),
    radial-gradient(circle at 10% 10%, rgba(24, 144, 132, 0.3), transparent 35%),
    linear-gradient(120deg, rgba(10, 15, 30, 0.1), rgba(20, 35, 60, 0.2));
  z-index: 0;
}

.hero-image {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.features-banner {
  margin: 20px 0;
}

.mini-feature {
  display: inline-flex;
  align-items: center;
  background-color: rgba(var(--v-theme-primary), 0.1);
  border-radius: 20px;
  padding: 4px 12px;
  transition: all 0.3s ease;
}

.mini-feature:hover {
  background-color: rgba(var(--v-theme-primary), 0.2);
  transform: translateY(-2px);
}

.video-container {
  position: relative;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.play-button {
  background-color: rgba(var(--v-theme-primary), 0.9);
  transition: all 0.3s ease;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.play-button:hover {
  transform: scale(1.1);
  background-color: rgb(var(--v-theme-primary));
}

.section-subtitle {
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  margin-bottom: 10px;
}

.feature-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.pricing-card {
  transition: transform 0.3s ease;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.pricing-card:hover {
  transform: translateY(-8px);
}

.premium-plan {
  position: relative;
  overflow: hidden;
}

.premium-plan::before {
  content: 'MOST POPULAR';
  position: absolute;
  top: 20px;
  right: -35px;
  background: var(--v-theme-secondary);
  color: white;
  padding: 8px 40px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(45deg);
  z-index: 1;
}

.guarantee-card {
  background: rgba(var(--v-theme-warning), 0.1);
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
}

.nav-bar {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-bar.v-app-bar--is-scrolled {
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05) !important;
}

.brand-container {
  position: relative;
  transition: all 0.3s ease;
}

.logo-image {
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.v-app-bar--is-scrolled .logo-image {
  transform: scale(0.9);
}

.brand-tagline {
  height: 18px;
  border-left: 2px solid rgba(var(--v-theme-primary), 0.5);
  transition: all 0.3s ease;
}

.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  animation: gradient 3s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}

.custom-nav-menu {
  position: relative;
}

.nav-links-wrapper {
  display: flex;
  position: relative;
}

.nav-btn {
  position: relative;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  overflow: hidden;
  height: 40px;
  transition: all 0.4s ease;
  opacity: 0.85;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.nav-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.nav-text {
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.nav-btn-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border-radius: 4px 4px 0 0;
}

.nav-btn:hover .nav-btn-background,
.active-nav-btn .nav-btn-background {
  transform: scaleX(1);
  transform-origin: left;
}

.active-nav-btn {
  opacity: 1;
  font-weight: 600;
}

.login-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(var(--v-theme-primary), 0.3);
}

.menu-toggle-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hamburger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: .5s ease-in-out;
}

.hamburger-icon span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: rgb(var(--v-theme-primary));
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: .25s ease-in-out;
}

.hamburger-icon span:nth-child(1) {
  top: 0px;
}

.hamburger-icon span:nth-child(2) {
  top: 8px;
  width: 75%;
}

.hamburger-icon span:nth-child(3) {
  top: 16px;
}

.hamburger-icon.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 8px;
}

.hamburger-icon.active span:nth-child(2) {
  opacity: 0;
  width: 0%;
}

.hamburger-icon.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 8px;
}

.mobile-nav-drawer {
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-nav-drawer.client-ready {
  opacity: 1;
}

.mobile-nav-item {
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.mobile-nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.drawer-footer {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.footer-link {
  color: rgba(var(--v-theme-on-surface), 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  padding: 4px 0;
  display: inline-block;
  border-radius: 4px;
}

.footer-link:hover {
  color: rgb(var(--v-theme-primary));
  transform: translateX(3px);
  padding-left: 3px;
}

.footer-links {
  margin-top: 8px;
}

footer h4 {
  font-size: 1rem;
  position: relative;
  display: inline-block;
}

footer h4::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
}

@media (max-width: 959px) {
  .footer-links {
    margin-bottom: 1.5rem;
  }
}

.footer-columns-container {
  padding-top: 1rem;
}

.footer-column {
  transition: all 0.3s ease;
}

.footer-column:hover h4::after {
  width: 40px;
}

@media (min-width: 960px) {
  .footer-column {
    border-left: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  }
}

/* Styles pour le formulaire de newsletter amélioré */
.newsletter-signup {
  position: relative;
  background: linear-gradient(rgba(var(--v-theme-surface), 0.8), rgba(var(--v-theme-surface), 0.9));
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.newsletter-signup:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.newsletter-signup .v-text-field {
  border-radius: 8px;
  overflow: hidden;
}

.preview-section {
  position: relative;
  overflow: hidden;
}

.preview-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(var(--v-theme-primary), 0.05), transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(var(--v-theme-info), 0.05), transparent 50%);
  z-index: 0;
}

.accessibility-filter-container {
  position: relative;
}

.vision-filter-wrapper {
  display: inline-flex;
  align-items: center;
}

.bad-experience-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.bad-experience-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

.bad-experience-card :deep(.v-card-subtitle) {
  white-space: normal;
  display: block;
  line-height: 1.5;
  opacity: 0.8;
}

.bad-experience-card :deep(.v-card-title) {
  line-height: 1.4;
}

.bad-experience-card :deep(.v-card-text) {
  line-height: 1.6;
  opacity: 0.9;
}

.border-primary {
  border-top: 3px solid rgb(var(--v-theme-primary));
}

.border-secondary {
  border-top: 3px solid rgb(var(--v-theme-secondary));
}

.border-tertiary {
  border-top: 3px solid rgb(var(--v-theme-tertiary));
}

.how-it-works-section {
  position: relative;
  overflow: hidden;
}

.how-it-works-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(var(--v-theme-secondary), 0.05), transparent 70%),
    radial-gradient(circle at 80% 50%, rgba(var(--v-theme-primary), 0.05), transparent 70%);
  z-index: 0;
}

.timeline-card {
  position: relative;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-timeline-item__body) {
  max-width: 400px;
}

:deep(.v-timeline-item__dot) {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-surface), 0.8);
}

:deep(.v-timeline-item__inner-dot) {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
}
</style>
