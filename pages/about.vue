<template>
  <v-app>
    <header>
      <v-app-bar app flat elevation="2" color="surface">
        <NuxtLink to="/" class="text-decoration-none" aria-label="Go to homepage">
          <div class="d-flex align-center mx-4">
            <img src="/images/stackunity-title.png" alt="StackUnity title" width="150">
          </div>
        </NuxtLink>
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/" class="mr-4" aria-label="Back to Home">
          {{ t().nav.backToHome }}
        </v-btn>
      </v-app-bar>
    </header>

    <main>
      <div class="about-hero py-16" role="banner" aria-labelledby="page-title">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" md="10" lg="8" class="text-center">
              <h1 id="page-title" class="text-h2 font-weight-bold mb-4 text-white">
                {{ t().about.title }}
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <section class="py-12" role="main">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl elevation-3">
              <section class="mb-12" aria-labelledby="mission-heading">
                <h2 id="mission-heading" class="text-h4 font-weight-bold mb-6 primary--text">
                  {{ t().about.mission.title }}
                </h2>
                <p class="text-body-1 mb-4">
                  {{ t().about.mission.content }}
                </p>
                <p class="text-body-1 mb-4">
                  {{ t().about.mission.content }}
                </p>
                <div class="quote-block my-8 pa-8 rounded-lg">
                  <v-icon size="42" color="primary" class="mb-4" aria-hidden="true">mdi-format-quote-open</v-icon>
                  <blockquote>
                    <p class="text-h5 font-italic mb-4">
                      "{{ t().about.quote.content }}"
                    </p>
                    <footer>
                      <cite class="text-subtitle-1 font-weight-bold">— {{ t().about.quote.author }}</cite>
                    </footer>
                  </blockquote>
                </div>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section class="mb-12" aria-labelledby="values-heading">
                <h2 id="values-heading" class="text-h4 font-weight-bold mb-6 primary--text">
                  {{ t().about.values.title }}
                </h2>
                <v-row>
                  <v-col cols="12" sm="6" v-for="(value, index) in companyValues" :key="index">
                    <v-card flat class="value-card pa-6 h-100">
                      <div class="d-flex align-center mb-4">
                        <v-avatar :color="value.color" size="56" class="mr-4" aria-hidden="true">
                          <v-icon dark size="28">{{ value.icon }}</v-icon>
                        </v-avatar>
                        <h3 class="text-h5 font-weight-bold">{{ value.title }}</h3>
                      </div>
                      <p class="text-body-1">{{ value.description }}</p>
                    </v-card>
                  </v-col>
                </v-row>
              </section>

              <v-divider class="mb-12" aria-hidden="true"></v-divider>

              <section aria-labelledby="contact-heading">
                <h2 id="contact-heading" class="text-h4 font-weight-bold mb-6 primary--text">
                  {{ t().about.getInTouch.title }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().about.getInTouch.content }}
                </p>
                <v-btn color="primary" to="/contact" size="large" class="px-8 py-3 rounded-pill" elevation="2"
                  aria-label="Contact Us">
                  {{ t().about.getInTouch.button }}
                  <v-icon end aria-hidden="true">mdi-arrow-right</v-icon>
                </v-btn>
              </section>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </main>

    <footer class="py-6 bg-surface" role="contentinfo">
      <v-container>
        <div class="d-flex flex-column flex-md-row justify-space-between align-center">
          <div class="mb-4 mb-md-0">
            <img src="/images/stackunity-title.png" alt="StackUnity title" width="120">
          </div>
          <div class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} {{ t().footer.copyright }}
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';

const t = useTranslations('about');

definePageMeta({
  layout: 'default'
});

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { name: 'keywords', content: t().meta.keywords },
    { name: 'author', content: t().meta.author },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: t().meta.title },
    { property: 'og:description', content: t().meta.description },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.com/about' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t().meta.title },
    { name: 'twitter:description', content: t().meta.description },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/about' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
          "@type": "Organization",
          "name": "StackUnity",
          "url": "https://stackunity.com",
          "logo": "https://stackunity.com/logo/stackunity-title.png",
          "description": t().meta.description,
          "foundingDate": "2022",
          "founder": {
            "@type": "Person",
            "name": "Nûr Djedidi"
          },
          "slogan": "Empowering developers with integrated tools for web development",
          "knowsAbout": [
            "Web Development",
            "API Testing",
            "Database Design",
            "Web Accessibility",
            "Responsive Design"
          ]
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#page-title", "#mission-heading", ".quote-block"]
        }
      })
    }
  ]
});
///
const companyValues = computed(() => [
  {
    title: t().about.values.items[0].title,
    description: t().about.values.items[0].content,
    icon: 'mdi-lightbulb-on',
    color: 'info'
  },
  {
    title: t().about.values.items[1].title,
    description: t().about.values.items[1].content,
    icon: 'mdi-leaf',
    color: 'success'
  },
  {
    title: t().about.values.items[2].title,
    description: t().about.values.items[2].content,
    icon: 'mdi-trophy',
    color: 'warning'
  },
  {
    title: t().about.values.items[3].title,
    description: t().about.values.items[3].content,
    icon: 'mdi-account-group',
    color: 'primary'
  }
]);
</script>

<style scoped>
.about-hero {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-info) 100%);
  position: relative;
  overflow: hidden;
}

.about-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmMDUiPjwvcmVjdD4KPHBhdGggZD0iTTI4IDY2TDAgNTBMMCAxNkwyOCAwTDU2IDE2TDU2IDUwTDI4IDY2TDI4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8cGF0aCBkPSJNMjggMEwyOCAzNEw1NiA1MEw1NiAxNkwyOCAwWiIgZmlsbD0iI2ZmZmZmZjA1IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+Cjwvc3ZnPg==');
  opacity: 0.3;
}

.quote-block {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-left: 6px solid rgb(var(--v-theme-primary));
  position: relative;
}

.quote-block::after {
  content: '"';
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 120px;
  color: rgba(var(--v-theme-primary), 0.1);
  font-family: serif;
  line-height: 0;
}

.value-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  background-color: rgba(var(--v-theme-on-surface), 0.02);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
  background-color: rgba(var(--v-theme-on-surface), 0.04);
  border-color: rgba(var(--v-theme-primary), 0.3);
}

.v-avatar {
  transition: all 0.3s ease;
}

a {
  color: rgb(var(--v-theme-primary));
  transition: all 0.2s ease;
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>