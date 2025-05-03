<template>
  <v-app>
    <header>
      <v-app-bar app flat elevation="2" color="surface" role="navigation" aria-label="Main Navigation">
        <v-container class="d-flex align-center py-0 my-0">
          <NuxtLink to="/" class="text-decoration-none" aria-label="Go to homepage">
            <div class="d-flex align-center">
              <img src="/logo/stackunity-title.png" alt="StackUnity title" width="150">
            </div>
          </NuxtLink>
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/" class="ml-4" aria-label="Back to Home">{{ t().nav?.backToHome || 'Back to Home'
          }}</v-btn>
        </v-container>
      </v-app-bar>
    </header>

    <main role="main">
      <v-container class="py-12 mt-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl">
              <h1 id="privacy-heading" class="text-h3 font-weight-bold mb-6">{{ t().privacy?.title || 'Privacy Policy'
              }}</h1>

              <p class="text-body-1 mb-6 font-italic">
                {{ t().privacy?.lastUpdated || 'Last updated' }}: {{ new Date().toLocaleDateString() }}
              </p>

              <p class="text-subtitle-1 mb-6">
                {{ t().privacy?.introduction ||
                  'At StackUnity, we place great importance on protecting your personal data. ' +
                  'This privacy policy explains how we collect, use, and protect your information when you use our ' +
                  'platform.' }}
              </p>

              <section aria-labelledby="section-collect">
                <h2 id="section-collect" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.collect?.title || 'Information We Collect' }}
                </h2>
                <p class="text-body-1 mb-4">
                  {{ t().privacy?.sections?.collect?.intro || 'We collect the following types of information:' }}
                </p>
                <ul class="mb-6" role="list">
                  <li v-for="(item, index) in t().privacy?.sections?.collect?.items || []" :key="index" class="mb-2">
                    <strong>{{ item?.title }}</strong>: {{ item?.content }}
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-usage">
                <h2 id="section-usage" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.usage?.title || 'How We Use Your Information' }}
                </h2>
                <p class="text-body-1 mb-4">
                  {{ t().privacy?.sections?.usage?.intro || 'We use your information to:' }}
                </p>
                <ul class="mb-6" role="list">
                  <li v-for="(item, index) in t().privacy?.sections?.usage?.items || []" :key="index" class="mb-2">
                    {{ item || '' }}
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-sharing">
                <h2 id="section-sharing" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.sharing?.title || 'Information Sharing' }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().privacy?.sections?.sharing?.intro || 'We do not sell your personal data to third parties. ' +
                    'We may share your information with: ' }}
                </p>
                <ul class="mb-6" role="list">
                  <li v-for="(item, index) in t().privacy?.sections?.sharing?.items || []" :key="index" class="mb-2">
                    {{ item || '' }}
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-security">
                <h2 id="section-security" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.security?.title || 'Data Security' }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().privacy?.sections?.security?.content || 'We take the security of your data very seriously. ' +
                    'We have implemented appropriate technical and organizational measures to protect your information ' +
                    'against unauthorized access, use, or disclosure.' }}
                </p>
              </section>

              <section aria-labelledby="section-rights">
                <h2 id="section-rights" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.rights?.title || 'Your Rights' }}
                </h2>
                <p class="text-body-1 mb-4">
                  {{ t().privacy?.sections?.rights?.intro || 'Depending on your place of residence, ' +
                    'you may have certain ' +
                    'rights regarding your personal data, including: ' }}
                </p>
                <ul class="mb-6" role="list">
                  <li v-for="(item, index) in t().privacy?.sections?.rights?.items || []" :key="index" class="mb-2">
                    {{ item || '' }}
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-cookies">
                <h2 id="section-cookies" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.cookies?.title || 'Cookies and Similar Technologies' }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().privacy?.sections?.cookies?.content || 'We use cookies and other similar technologies to ' +
                    'improve your experience on our platform, understand how you use our services, and personalize our ' +
                    'offerings. You can manage your cookie preferences in your browser settings.' }}
                </p>
              </section>

              <section aria-labelledby="section-changes">
                <h2 id="section-changes" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.changes?.title || 'Changes to This Policy' }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().privacy?.sections?.changes?.content || 'We may update this privacy policy from time to time. '
                    +
                    'The most recent version will always be available on our website, and we will notify you of any ' +
                    'significant changes.' }}
                </p>
              </section>

              <section aria-labelledby="section-contact">
                <h2 id="section-contact" class="text-h4 font-weight-bold mb-4">
                  {{ t().privacy?.sections?.contact?.title || 'Contact Us' }}
                </h2>
                <p class="text-body-1 mb-6">
                  {{ t().privacy?.sections?.contact?.content || 'If you have any questions about this privacy policy, '
                    +
                    'please contact us at' }}
                  <a href="mailto:privacy@stackunity.com" class="text-decoration-underline">privacy@stackunity.com</a>.
                </p>
              </section>

              <div class="structured-data-container" style="display:none;" aria-hidden="true">
                <div itemscope itemtype="http://schema.org/PrivacyPolicy">
                  <meta itemprop="name" content="StackUnity Privacy Policy" />
                  <meta itemprop="description"
                    content="Learn how StackUnity collects, uses, and protects your personal data when you use our platform." />
                  <meta itemprop="url" content="https://stackunity.com/privacy" />
                  <div itemprop="author" itemscope itemtype="http://schema.org/Organization">
                    <meta itemprop="name" content="StackUnity" />
                    <meta itemprop="url" content="https://stackunity.com" />
                  </div>
                  <meta itemprop="dateModified" content="{{ new Date().toISOString().split('T')[0] }}" />
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </main>

    <footer class="py-6 bg-surface" role="contentinfo">
      <v-container>
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} StackUnity. {{ t().footer?.copyright || 'All rights reserved.' }}
          </p>
          <div class="d-flex justify-center mt-2 legal-links">
            <a href="/terms" class="mx-2 text-caption" aria-label="Terms of Service">{{ t().footer?.links?.terms ||
              'Terms' }}</a>
            <a href="/notices" class="mx-2 text-caption" aria-label="Legal Notices">{{ t().footer?.links?.notices ||
              'Legal Notices' }}</a>
            <a href="/contact" class="mx-2 text-caption" aria-label="Contact">{{ t().footer?.links?.contact || 'Contact'
            }}</a>
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore
import { computed, definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';

const t = useTranslations('privacy');

definePageMeta({
  layout: 'default'
});

// Utiliser computed pour s'assurer que les traductions sont chargées avant d'y accéder
const metaTitle = computed(() => t().meta?.title || 'Privacy Policy - StackUnity');
const metaDescription = computed(() => t().meta?.description || 'Learn how StackUnity collects, uses, and protects your personal data when you use our platform.');
const metaKeywords = computed(() => t().meta?.keywords || 'privacy policy, data protection, GDPR');

useHead({
  title: metaTitle,
  meta: [
    { name: 'description', content: metaDescription },
    { name: 'keywords', content: metaKeywords },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.com/privacy' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/privacy' },
    { rel: 'alternate', href: 'https://stackunity.com/fr/privacy', hreflang: 'fr' },
    { rel: 'alternate', href: 'https://stackunity.com/ar/privacy', hreflang: 'ar' },
    { rel: 'alternate', href: 'https://stackunity.com/es/privacy', hreflang: 'es' },
    { rel: 'alternate', href: 'https://stackunity.com/zh/privacy', hreflang: 'zh' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#privacy-heading", "#section-collect", "#section-rights", ".speakable"]
        },
        "name": "Privacy Policy - StackUnity",
        "description": "Learn how StackUnity collects, uses, and protects your personal data when you use our platform.",
        "publisher": {
          "@type": "Organization",
          "name": "StackUnity",
          "logo": {
            "@type": "ImageObject",
            "url": "https://stackunity.com/logo/stackunity-title.png"
          }
        },
        "mainEntity": {
          "@type": "WebSite",
          "url": "https://stackunity.com",
          "name": "StackUnity"
        },
        "potentialAction": {
          "@type": "ReadAction",
          "target": "https://stackunity.com/privacy"
        }
      })
    }
  ]
});
</script>

<style scoped>
a {
  color: rgb(var(--v-theme-primary));
  transition: all 0.2s ease;
}

a:hover {
  opacity: 0.8;
}

.legal-links a {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  text-decoration: none;
}

.legal-links a:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}
</style>