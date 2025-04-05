<template>
  <div class="terms-page pa-4 pa-sm-6 pa-md-8 pa-lg-12">
    <v-container>
      <div class="d-flex flex-column align-center mb-6">
        <NuxtLink to="/" class="mb-4">
          <img src="" alt="StackUnity title" width="150">
        </NuxtLink>
        <h1 class="text-h3 font-weight-bold text-center">Terms of Service</h1>
      </div>

      <v-card class="pa-6 mb-6">
        <div class="terms-content">
          <h2 class="text-h5 font-weight-bold mb-4">1. Acceptance of Terms</h2>
          <p class="mb-4">
            Welcome to StackUnity. By accessing or using our platform, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">2. Registration and Account</h2>
          <p class="mb-2">
            To use certain features of our platform, you may need to register and create an account. You agree to:
          </p>
          <ul class="mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security and confidentiality of your login credentials</li>
            <li>Take responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h2 class="text-h5 font-weight-bold mb-4">3. User Content</h2>
          <p class="mb-4">
            You retain ownership of any content you submit to DevUnity. By submitting content, you grant us a
            non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute
            such content for the purpose of providing and promoting our services.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">4. Acceptable Use</h2>
          <p class="mb-2">
            When using our platform, you agree not to:
          </p>
          <ul class="mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Submit unauthorized commercial communications</li>
            <li>Upload viruses or malicious code</li>
            <li>Attempt to access data not intended for you</li>
            <li>Impair the proper functioning of the website</li>
          </ul>

          <h2 class="text-h5 font-weight-bold mb-4">5. Intellectual Property</h2>
          <p class="mb-4">
            The DevUnity platform, including its design, layout, text, graphics, and other content, is the exclusive
            property of DevUnity and is protected by national and international copyright laws. You may not
            reproduce, modify, distribute, or create derivative works based on our platform without our express
            permission.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">6. Limitation of Liability</h2>
          <p class="mb-4">
            To the fullest extent permitted by law, DevUnity shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including without limitation, loss of profits, data,
            or other intangible losses, resulting from your use or inability to use our services.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">7. Indemnification</h2>
          <p class="mb-4">
            You agree to defend, indemnify, and hold harmless DevUnity, its officers, directors, employees,
            and agents from any claims, liabilities, damages, losses, or expenses, including legal fees,
            arising out of your use of our platform or your violation of these Terms.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">8. Termination</h2>
          <p class="mb-4">
            We reserve the right to suspend or terminate your account at our sole discretion, without prior notice,
            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties,
            or for any other reason.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">9. Changes to Terms</h2>
          <p class="mb-4">
            We may modify these Terms at any time. We will notify you of any significant changes by posting
            the new Terms on our website. Your continued use of our platform after such modifications
            constitutes your acceptance of the revised Terms.
          </p>

          <h2 class="text-h5 font-weight-bold mb-4">10. Contact Us</h2>
          <p class="mb-4">
            If you have any questions about these Terms, please contact us at
            <a href="mailto:legal@devunity.com" class="text-decoration-underline">legal@devunity.com</a>.
          </p>
        </div>
      </v-card>

      <div class="text-center">
        <p class="text-caption text-medium-emphasis">
          Last updated: {{ new Date().toLocaleDateString() }}
        </p>
        <p class="text-caption text-medium-emphasis">
          &copy; {{ new Date().getFullYear() }} DevUnity. All rights reserved.
        </p>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { useHead } from '#imports';

useHead({
  title: 'Terms of Service - StackUnity',
  meta: [
    { name: 'description', content: 'Read the Terms of Service for the StackUnity platform. By using our services, you agree to be bound by these terms.' },
    { name: 'author', content: 'StackUnity' },
    { name: 'keywords', content: 'StackUnity, terms of service, usage, services, bound, terms' },
    { name: 'robots', content: 'index,follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Terms of Service - StackUnity' },
    { name: 'og:description', content: 'Read the Terms of Service for the DevUnity platform. By using our services, you agree to be bound by these terms.' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/terms' }
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
</style>