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
      <v-card class="pa-6 mb-6 mt-12">
        <div class="terms-content">
          <h1 id="terms-heading" class="text-h3 font-weight-bold mb-6">Terms of Service</h1>

          <section aria-labelledby="section-acceptance">
            <h2 id="section-acceptance" class="text-h5 font-weight-bold mb-4">1. Acceptance of Terms</h2>
            <p class="mb-4">
              Welcome to StackUnity. By accessing or using our platform, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section aria-labelledby="section-registration">
            <h2 id="section-registration" class="text-h5 font-weight-bold mb-4">2. Registration and Account</h2>
            <p class="mb-2">
              To use certain features of our platform, you may need to register and create an account. You agree to:
            </p>
            <ul class="mb-4" role="list">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Take responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section aria-labelledby="section-content">
            <h2 id="section-content" class="text-h5 font-weight-bold mb-4">3. User Content</h2>
            <p class="mb-4">
              You retain ownership of any content you submit to StackUnity. By submitting content, you grant us a
              non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute
              such content for the purpose of providing and promoting our services.
            </p>
          </section>

          <section aria-labelledby="section-use">
            <h2 id="section-use" class="text-h5 font-weight-bold mb-4">4. Acceptable Use</h2>
            <p class="mb-2">
              When using our platform, you agree not to:
            </p>
            <ul class="mb-4" role="list">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Submit unauthorized commercial communications</li>
              <li>Upload viruses or malicious code</li>
              <li>Attempt to access data not intended for you</li>
              <li>Impair the proper functioning of the website</li>
            </ul>
          </section>

          <section aria-labelledby="section-ip">
            <h2 id="section-ip" class="text-h5 font-weight-bold mb-4">5. Intellectual Property</h2>
            <p class="mb-4">
              The StackUnity platform, including its design, layout, text, graphics, and other content, is the exclusive
              property of StackUnity and is protected by national and international copyright laws. You may not
              reproduce, modify, distribute, or create derivative works based on our platform without our express
              permission.
            </p>
          </section>

          <section aria-labelledby="section-liability">
            <h2 id="section-liability" class="text-h5 font-weight-bold mb-4">6. Limitation of Liability</h2>
            <p class="mb-4">
              To the fullest extent permitted by law, StackUnity shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without limitation, loss of profits, data,
              or other intangible losses, resulting from your use or inability to use our services.
            </p>
          </section>

          <section aria-labelledby="section-indemnification">
            <h2 id="section-indemnification" class="text-h5 font-weight-bold mb-4">7. Indemnification</h2>
            <p class="mb-4">
              You agree to defend, indemnify, and hold harmless StackUnity, its officers, directors, employees,
              and agents from any claims, liabilities, damages, losses, or expenses, including legal fees,
              arising out of your use of our platform or your violation of these Terms.
            </p>
          </section>

          <section aria-labelledby="section-termination">
            <h2 id="section-termination" class="text-h5 font-weight-bold mb-4">8. Termination</h2>
            <p class="mb-4">
              We reserve the right to suspend or terminate your account at our sole discretion, without prior notice,
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties,
              or for any other reason.
            </p>
          </section>

          <section aria-labelledby="section-changes">
            <h2 id="section-changes" class="text-h5 font-weight-bold mb-4">9. Changes to Terms</h2>
            <p class="mb-4">
              We may modify these Terms at any time. We will notify you of any significant changes by posting
              the new Terms on our website. Your continued use of our platform after such modifications
              constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section aria-labelledby="section-contact">
            <h2 id="section-contact" class="text-h5 font-weight-bold mb-4">10. Contact Us</h2>
            <p class="mb-4">
              If you have any questions about these Terms, please contact us at
              <a href="mailto:legal@stackunity.com" class="text-decoration-underline"
                aria-label="Contact us at legal@stackunity.com">legal@stackunity.com</a>.
            </p>
          </section>

          <div class="structured-data-container" style="display:none;" aria-hidden="true">
            <div itemscope itemtype="http://schema.org/TermsOfService">
              <meta itemprop="name" content="StackUnity Terms of Service" />
              <meta itemprop="description"
                content="Read the Terms of Service for the StackUnity platform. By using our services, you agree to be bound by these terms." />
              <meta itemprop="url" content="https://stackunity.com/terms" />
              <div itemprop="author" itemscope itemtype="http://schema.org/Organization">
                <meta itemprop="name" content="StackUnity" />
                <meta itemprop="url" content="https://stackunity.com" />
              </div>
              <meta itemprop="dateModified" content="{{ new Date().toISOString().split('T')[0] }}" />
            </div>
          </div>
        </div>
      </v-card>
    </main>

    <footer class="py-6 bg-surface" role="contentinfo">
      <v-container>
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </p>
          <div class="d-flex justify-center mt-2 legal-links">
            <a href="/terms" class="mx-2 text-caption" aria-current="page" aria-label="Terms of Service">Terms</a>
            <a href="/notices" class="mx-2 text-caption" aria-label="Legal Notices">Legal Notices</a>
            <a href="/contact" class="mx-2 text-caption" aria-label="Contact">Contact</a>
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<script setup lang="ts">
// @ts-ignore
import { useHead } from '#imports';

useHead({
  title: 'Terms of Service - StackUnity',
  meta: [
    { name: 'description', content: 'Official Terms of Service for the StackUnity web development platform. Understand your rights and obligations when using our services.' },
    { name: 'author', content: 'StackUnity' },
    { name: 'keywords', content: 'StackUnity, terms of service, user agreement, legal terms, acceptable use policy, intellectual property, liability limitations, indemnification, platform usage, web development terms' },
    { name: 'robots', content: 'index,follow,max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'Terms of Service - StackUnity | User Agreement & Policies' },
    { property: 'og:description', content: 'Official Terms of Service for the StackUnity web development platform. Understand your rights and obligations when using our services.' },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.com/terms' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Terms of Service - StackUnity' },
    { name: 'twitter:description', content: 'Read the Terms of Service for the StackUnity platform. By using our services, you agree to be bound by these terms.' },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/terms' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Service - StackUnity",
        "description": "Official Terms of Service for the StackUnity web development platform. Understand your rights and obligations when using our services.",
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
          "name": "StackUnity",
          "potentialAction": {
            "@type": "ReadAction",
            "target": "https://stackunity.com/terms"
          }
        },
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#terms-heading", "#section-acceptance", "#section-contact"]
        }
      })
    }
  ]
})
</script>

<style scoped>
.terms-page {
  background-color: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.terms-content {
  max-width: 800px;
  margin: 0 auto;
}

.terms-content p,
.terms-content li {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  line-height: 1.6;
}

h2 {
  margin-top: 1.5rem;
}

ul {
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

a {
  color: rgb(var(--v-theme-primary));
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