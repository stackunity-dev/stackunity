<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh;">
      <v-card max-width="550" class="mx-auto rounded-xl elevation-5">
        <v-card-item class="bg-primary text-center pa-6 rounded-t-xl">
          <v-icon size="48" color="white" class="mb-2">mdi-email-remove</v-icon>
          <h1 class="text-h4 text-white font-weight-bold">Se désabonner de la newsletter</h1>
        </v-card-item>

        <v-card-text class="pa-6">
          <p class="text-body-1 mb-6 text-center text-medium-emphasis">
            Nous sommes désolés de vous voir partir. Veuillez confirmer votre adresse e-mail pour vous désabonner de
            notre newsletter.
          </p>

          <v-form @submit.prevent="unsubscribe">
            <v-text-field v-model="email" label="Adresse e-mail" prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Veuillez entrer une adresse email valide']"
              required class="mb-6"></v-text-field>

            <div class="d-flex align-center justify-center ga-4">
              <v-btn prepend-icon="mdi-arrow-left" variant="tonal" color="primary" @click="goToLogin">
                Annuler
              </v-btn>

              <v-btn prepend-icon="mdi-email-remove-outline" variant="tonal" color="error" type="submit"
                @click="unsubscribe">
                Se désabonner
              </v-btn>
            </div>
          </v-form>
        </v-card-text>

        <v-card-text class="text-center pt-0 pb-4">
          <p class="text-caption text-medium-emphasis">
            Si vous avez des questions, n'hésitez pas à nous contacter à
            <a href="mailto:support@example.com" class="text-primary">devunity@support.com</a>
          </p>
        </v-card-text>
      </v-card>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top right">
        {{ snackbar.text }}
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

definePageMeta({
  layout: 'empty'
});

useHead({
  title: 'Unsubscribe - DevUnity',
  meta: [
    { name: 'description', content: 'Unsubscribe from the newsletter' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Unsubscribe - DevUnity' },
    { name: 'og:description', content: 'Unsubscribe from the newsletter' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
})
const userStore = useUserStore();

const confirmation = ref(false);
const email = ref('');
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});


onMounted(() => {
  confirmation.value = true;
});

const unsubscribe = async () => {
  await userStore.unsubscribe(email.value);
  snackbar.value.show = true;
  snackbar.value.text = 'Vous avez été désinscrit de la newsletter';
  snackbar.value.color = 'success';
  navigateTo('/login');
};

const goToLogin = () => {
  navigateTo('/login');
};
</script>
