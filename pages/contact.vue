<template>
  <v-app>
    <v-app-bar app flat elevation="2" color="surface">
      <v-container class="d-flex align-center py-0 my-0">
        <NuxtLink to="/" class="text-decoration-none">
          <div class="d-flex align-center">
            <img src="/logo/stackunity-title.png" alt="StackUnity title" width="150">
          </div>
        </NuxtLink>
        <v-spacer></v-spacer>
        <v-btn color="primary" to="/" class="ml-4">Back to Home</v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card class="pa-8 mb-8 rounded-xl">
              <h1 class="text-h3 font-weight-bold mb-6">Contact Us</h1>

              <p class="text-subtitle-1 mb-6">
                We are always happy to hear your questions, comments or suggestions. Fill out the form below and we will
                get back to you as soon as possible.
              </p>

              <v-form @submit.prevent="submitFormContact" class="mb-8">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.name" label="Your name" variant="outlined"
                      :rules="[v => !!v || 'Name is required']" hide-details="auto" class="mb-4"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="form.email" label="Your email" variant="outlined" type="email" :rules="[
                      v => !!v || 'Email is required',
                      v => /.+@.+\..+/.test(v) || 'Invalid email'
                    ]" hide-details="auto" class="mb-4"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select v-model="form.subject" label="Subject" variant="outlined" :items="subjects"
                      hide-details="auto" class="mb-4"></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="form.message" label="Your message" variant="outlined"
                      :rules="[v => !!v || 'Message is required']" hide-details="auto" rows="5"
                      class="mb-4"></v-textarea>
                  </v-col>
                </v-row>

                <v-btn type="submit" color="primary" size="large" :loading="loading" class="mt-4">
                  Send Message
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer class="py-4">
      <v-container>
        <div class="text-center">
          <p class="text-body-2 text-medium-emphasis">
            &copy; {{ new Date().getFullYear() }} StackUnity. All rights reserved.
          </p>
        </div>
      </v-container>
    </v-footer>

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
  title: 'Contact Us - StackUnity',
  meta: [
    { name: 'description', content: 'Contact the StackUnity team for any questions, suggestions or support requests. We are here to help you.' },
    { name: 'keywords', content: 'StackUnity, contact, support, questions, suggestions, feedback, help, contact us, support request, contact form, contact us form, contact us page, contact us page design, contact us page development' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Contact Us - StackUnity' },
    { name: 'og:description', content: 'Contact the StackUnity team for any questions, suggestions or support requests. We are here to help you.' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
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