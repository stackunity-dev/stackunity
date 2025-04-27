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
          <v-btn color="primary" to="/" class="ml-4" aria-label="Back to Home">Back to Home</v-btn>
        </v-container>
      </v-app-bar>
    </header>

    <main role="main">
      <v-container class="py-12 mt-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl">
              <h1 id="privacy-heading" class="text-h3 font-weight-bold mb-6">Privacy Policy</h1>

              <p class="text-body-1 mb-6 font-italic">
                Last updated: {{ new Date().toLocaleDateString() }}
              </p>

              <p class="text-subtitle-1 mb-6">
                At StackUnity, we place great importance on protecting your personal data. This privacy policy explains
                how we collect, use, and protect your information when you use our platform.
              </p>

              <section aria-labelledby="section-collect">
                <h2 id="section-collect" class="text-h4 font-weight-bold mb-4">Information We Collect</h2>
                <p class="text-body-1 mb-4">
                  We collect the following types of information:
                </p>
                <ul class="mb-6" role="list">
                  <li class="mb-2">
                    <strong>Identification Information</strong>: when you create an account, we collect your name, email
                    address, password, and optionally, your profile picture.
                  </li>
                  <li class="mb-2">
                    <strong>Usage Information</strong>: we collect data about how you interact with our platform,
                    including the pages you visit, the features you use, and the time spent on the platform.
                  </li>
                  <li class="mb-2">
                    <strong>User Content</strong>: any content you create, upload, or share on our platform.
                  </li>
                </ul>
              </section>

              <section aria-labelledby="section-usage">
                <h2 id="section-usage" class="text-h4 font-weight-bold mb-4">How We Use Your Information</h2>
                <p class="text-body-1 mb-4">
                  We use your information to:
                </p>
                <ul class="mb-6" role="list">
                  <li class="mb-2">Provide, maintain, and improve our services</li>
                  <li class="mb-2">Personalize your experience on our platform</li>
                  <li class="mb-2">Communicate with you about our services</li>
                  <li class="mb-2">Protect the security of our platform and our users</li>
                  <li class="mb-2">Comply with legal obligations</li>
                </ul>
              </section>

              <section aria-labelledby="section-sharing">
                <h2 id="section-sharing" class="text-h4 font-weight-bold mb-4">Information Sharing</h2>
                <p class="text-body-1 mb-6">
                  We do not sell your personal data to third parties. We may share your information with:
                </p>
                <ul class="mb-6" role="list">
                  <li class="mb-2">Service providers who help us operate our platform</li>
                  <li class="mb-2">Business partners, with your consent</li>
                  <li class="mb-2">Legal authorities, if necessary to comply with the law</li>
                </ul>
              </section>

              <section aria-labelledby="section-security">
                <h2 id="section-security" class="text-h4 font-weight-bold mb-4">Data Security</h2>
                <p class="text-body-1 mb-6">
                  We take the security of your data very seriously. We have implemented appropriate technical and
                  organizational measures to protect your information against unauthorized access, use, or disclosure.
                </p>
              </section>

              <section aria-labelledby="section-rights">
                <h2 id="section-rights" class="text-h4 font-weight-bold mb-4">Your Rights</h2>
                <p class="text-body-1 mb-4">
                  Depending on your place of residence, you may have certain rights regarding your personal data,
                  including:
                </p>
                <ul class="mb-6" role="list">
                  <li class="mb-2">The right to access your data</li>
                  <li class="mb-2">The right to rectify your data</li>
                  <li class="mb-2">The right to delete your data</li>
                  <li class="mb-2">The right to restrict the processing of your data</li>
                  <li class="mb-2">The right to data portability</li>
                  <li class="mb-2">The right to object to the processing of your data</li>
                </ul>
              </section>

              <section aria-labelledby="section-cookies">
                <h2 id="section-cookies" class="text-h4 font-weight-bold mb-4">Cookies and Similar Technologies</h2>
                <p class="text-body-1 mb-6">
                  We use cookies and other similar technologies to improve your experience on our platform, understand
                  how
                  you use our services, and personalize our offerings. You can manage your cookie preferences in your
                  browser settings. For more information, see our <NuxtLink to="/cookies"
                    class="text-decoration-underline" aria-label="Cookie Policy">Cookie Policy</NuxtLink>.
                </p>
              </section>

              <section aria-labelledby="section-changes">
                <h2 id="section-changes" class="text-h4 font-weight-bold mb-4">Changes to This Policy</h2>
                <p class="text-body-1 mb-6">
                  We may update this privacy policy from time to time. The most recent version will always be available
                  on
                  our website, and we will notify you of any significant changes.
                </p>
              </section>

              <section aria-labelledby="section-contact">
                <h2 id="section-contact" class="text-h4 font-weight-bold mb-4">Contact Us</h2>
                <p class="text-body-1 mb-6">
                  If you have any questions about this privacy policy or our data protection practices, please don't
                  hesitate to contact us at <a href="mailto:privacy@stackunity.com" class="text-decoration-underline"
                    aria-label="Email privacy@stackunity.com">privacy@stackunity.com</a>.
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
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </p>
          <div class="d-flex justify-center mt-2 legal-links">
            <a href="/terms" class="mx-2 text-caption" aria-label="Terms of Service">Terms</a>
            <a href="/notices" class="mx-2 text-caption" aria-label="Legal Notices">Legal Notices</a>
            <a href="/contact" class="mx-2 text-caption" aria-label="Contact">Contact</a>
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Privacy Policy - StackUnity',
  meta: [
    { name: 'description', content: 'Comprehensive Privacy Policy for StackUnity. Learn about our GDPR compliance, how we collect, process, protect and manage your personal data.' },
    { name: 'keywords', content: 'StackUnity privacy policy, GDPR compliance, data protection, personal data collection, data security, privacy rights, web development platform, cookies policy, user data' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'Privacy Policy - StackUnity | GDPR Compliance' },
    { property: 'og:description', content: 'Comprehensive Privacy Policy for StackUnity. Learn about our GDPR compliance, how we collect, process, protect and manage your personal data.' },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.com/privacy' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Privacy Policy - StackUnity' },
    { name: 'twitter:description', content: 'Learn how StackUnity collects, uses, and protects your personal data.' },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/privacy' }
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