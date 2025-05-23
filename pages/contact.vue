<template>
  <v-app>
    <header>
      <v-app-bar app flat elevation="2" color="surface" role="navigation" aria-label="Main Navigation">
        <v-container class="d-flex align-center py-0 my-0">
          <NuxtLink to="/" class="text-decoration-none" aria-label="Go to homepage">
            <div class="d-flex align-center">
              <img src="/images/stackunity-title.png" alt="StackUnity title" width="150">
            </div>
          </NuxtLink>
          <v-spacer></v-spacer>
          <v-btn color="primary" to="/" class="ml-4" aria-label="Back to Home">{{ t().nav.backToHome }}</v-btn>
        </v-container>
      </v-app-bar>
    </header>

    <main role="main">
      <v-container class="py-12 mt-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl">
              <h1 id="contact-heading" class="text-h3 font-weight-bold mb-6">{{ t().contact.title }}</h1>

              <p class="text-subtitle-1 mb-6">
                {{ t().contact.subtitle }}
              </p>

              <v-form @submit.prevent="submitFormContact" class="mb-8" aria-labelledby="contact-heading">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.name" :label="t().contact.form.name" variant="outlined"
                      :rules="[v => !!v || 'Name is required']" hide-details="auto" class="mb-4" aria-required="true"
                      id="contact-name" aria-label="Your name"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.email" :label="t().contact.form.email" variant="outlined" type="email"
                      :rules="[
                        v => !!v || 'Email is required',
                        v => /.+@.+\..+/.test(v) || 'Invalid email'
                      ]" hide-details="auto" class="mb-4" aria-required="true" id="contact-email"
                      aria-label="Your email"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select v-model="form.subject" :label="t().contact.form.subject" variant="outlined"
                      :items="subjects" hide-details="auto" class="mb-4" id="contact-subject"></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="form.message" :label="t().contact.form.message" variant="outlined"
                      :rules="[v => !!v || 'Message is required']" hide-details="auto" rows="5" class="mb-4"
                      aria-required="true" id="contact-message" aria-label="Your message"></v-textarea>
                  </v-col>
                </v-row>

                <v-btn type="submit" color="primary" size="large" :loading="loading" class="mt-4"
                  aria-label="Send message">
                  {{ t().contact.form.submit }}
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
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

    <Snackbar v-model="snackbar.show" :color="snackbar.color" :text="snackbar.text" :timeout="snackbar.timeout" />
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';

const t = useTranslations('about');

const userStore = useUserStore();

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
    { property: 'og:url', content: 'https://stackunity.com/contact' },
    { property: 'og:site_name', content: t().meta.author },
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
    { rel: 'canonical', href: 'https://stackunity.com/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": t().meta.title,
        "description": t().meta.description,
        "publisher": {
          "@type": "Organization",
          "name": t().meta.author,
          "logo": {
            "@type": "ImageObject",
            "url": "https://stackunity.com/logo/stackunity-title.png"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@stackunity.com",
            "url": "https://stackunity.com/contact"
          }
        },
        "mainEntity": {
          "@type": "WebPage",
          "name": "Contact StackUnity",
          "url": "https://stackunity.com/contact"
        }
      })
    }
  ]
});

const form = ref({
  name: '',
  email: '',
  subject: t().contact.form.subjects.general,
  message: ''
});

const subjects = computed(() => [
  t().contact.form.subjects.general,
  t().contact.form.subjects.technical,
  t().contact.form.subjects.feature,
  t().contact.form.subjects.bug,
  t().contact.form.subjects.partnership,
  t().contact.form.subjects.other
]);

const loading = ref(false);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 2000
});

const submitFormContact = async () => {
  loading.value = true;

  try {

    if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
      snackbar.value = {
        show: true,
        text: t().contact.form.fillAllFields,
        color: 'error',
        timeout: 2000
      };
    }

    await userStore.submitFormContact(form.value);

    form.value = {
      name: '',
      email: '',
      subject: t().contact.form.subjects.general,
      message: ''
    };

    snackbar.value = {
      show: true,
      text: t().contact.form.successTitle,
      color: 'success',
      timeout: 2000
    };
  } catch (error) {
    console.error('Error sending message:', error);
    snackbar.value = {
      show: true,
      text: t().contact.form.errorTitle,
      color: 'error',
      timeout: 2000
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
}
</style>