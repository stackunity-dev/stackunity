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
              <h1 id="contact-heading" class="text-h3 font-weight-bold mb-6">Contact Us</h1>

              <p class="text-subtitle-1 mb-6">
                We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will
                get back to you as soon as possible.
              </p>

              <v-form @submit.prevent="submitFormContact" class="mb-8" aria-labelledby="contact-heading">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.name" label="Your name" variant="outlined"
                      :rules="[v => !!v || 'Name is required']" hide-details="auto" class="mb-4" aria-required="true"
                      id="contact-name"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.email" label="Your email" variant="outlined" type="email" :rules="[
                      v => !!v || 'Email is required',
                      v => /.+@.+\..+/.test(v) || 'Invalid email'
                    ]" hide-details="auto" class="mb-4" aria-required="true" id="contact-email"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select v-model="form.subject" label="Subject" variant="outlined" :items="subjects"
                      hide-details="auto" class="mb-4" id="contact-subject"></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="form.message" label="Your message" variant="outlined"
                      :rules="[v => !!v || 'Message is required']" hide-details="auto" rows="5" class="mb-4"
                      aria-required="true" id="contact-message"></v-textarea>
                  </v-col>
                </v-row>

                <v-btn type="submit" color="primary" size="large" :loading="loading" class="mt-4"
                  aria-label="Send message">
                  Send Message
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
            <img src="/logo/stackunity-title.png" alt="StackUnity title" width="120">
          </div>
          <div class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </div>
        </div>
      </v-container>
    </footer>

    <Snackbar v-model="snackbar.show" :color="snackbar.color" :text="snackbar.text" :timeout="snackbar.timeout" />
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

const userStore = useUserStore();

definePageMeta({
  layout: 'default'
});

useHead({
  title: 'Contact StackUnity | Get Support & Connect With Our Team',
  meta: [
    { name: 'description', content: 'Reach out to the StackUnity team for support, feature requests, partnership inquiries or general questions. We\'re here to help you succeed with our web development tools.' },
    { name: 'keywords', content: 'StackUnity contact, web development support, technical assistance, feature requests, developer help, contact form, web tools support, developer platform support, get in touch, contact page' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Contact StackUnity | Get Support & Connect With Our Team' },
    { name: 'og:description', content: 'Reach out to the StackUnity team for support, feature requests, partnership inquiries or general questions. We\'re here to help you succeed with our web development tools.' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: 'https://stackunity.com/contact' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Contact StackUnity Support' },
    { name: 'twitter:description', content: 'Get in touch with our team for support, feature requests or partnership opportunities.' },
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
        "name": "Contact StackUnity",
        "description": "Contact the StackUnity team for support, feature requests, partnership inquiries or general questions.",
        "publisher": {
          "@type": "Organization",
          "name": "StackUnity",
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
  subject: 'General Question',
  message: ''
});

const subjects = [
  'General Question',
  'Technical Support',
  'Feature Request',
  'Bug Report',
  'Partnership',
  'Other'
];

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
        text: 'Please fill out all fields.',
        color: 'error',
        timeout: 2000
      };
    }

    await userStore.submitFormContact(form.value);

    form.value = {
      name: '',
      email: '',
      subject: 'General Question',
      message: ''
    };

    snackbar.value = {
      show: true,
      text: 'Your message has been sent successfully! We will respond soon.',
      color: 'success',
      timeout: 2000
    };
  } catch (error) {
    console.error('Error sending message:', error);
    snackbar.value = {
      show: true,
      text: 'An error occurred while sending your message. Please try again.',
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