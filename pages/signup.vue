<template>
  <section class="auth-screen">
    <main class="fill-height pa-0">
      <v-row class="fill-height ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex left-panel-signup align-center justify-center">
          <div class="left-content text-center">
            <header>
              <h1>
                <img src="/logo/stackunity.png" alt="StackUnity - Develop faster and better with StackUnity"
                  class="logo mb-8" width="350" />
                <span class="sr-only">StackUnity - Develop faster and better with StackUnity</span>
              </h1>
            </header>

            <div class="features-list">
              <div v-for="(feature, index) in features" :key="index" class="feature-item d-flex align-center"
                :class="{ 'mb-6': index !== features.length - 1 }">
                <v-icon color="primary" size="x-large" class="mr-3">{{ feature.icon }}</v-icon>
                <div class="text-left">
                  <p class="text-body-1 font-weight-medium text-white mb-1">{{ feature.title }}</p>
                  <p class="text-body-2 text-white-darken-2">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="right-panel-signup d-flex align-center justify-center">
          <v-card class="signup-card pa-md-8 pa-4 elevation-0" max-width="450" width="100%">
            <div class="d-flex justify-center d-md-none mb-6">
              <img src="/logo/stackunity-title.png" alt="StackUnity Logo" width="240" />
            </div>

            <h2 class="text-h5 font-weight-bold mb-2">Create an account</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-6">Join StackUnity and start your experience</p>

            <v-form @submit.prevent="handleSignup">
              <v-text-field v-model="form.username" label="Username" type="text" variant="outlined"
                density="comfortable" prepend-inner-icon="mdi-account-outline" class="mb-3"
                :rules="[v => !!v || 'Username required']" hide-details="auto" aria-required="true"
                aria-label="Username"></v-text-field>

              <v-text-field v-model="form.email" label="Email address" type="email" variant="outlined"
                density="comfortable" prepend-inner-icon="mdi-email-outline" class="mb-3" :rules="[
                  v => !!v || 'Email required',
                  v => /.+@.+\..+/.test(v) || 'Invalid email format'
                ]" hide-details="auto" aria-required="true" aria-label="Email address"></v-text-field>

              <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password"
                variant="outlined" prepend-inner-icon="mdi-lock-outline" density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePasswordVisibility" class="mb-5" :rules="[
                  v => !!v || 'Password required',
                  v => v.length >= 8 || 'Password must contain at least 8 characters'
                ]" hide-details="auto" aria-required="true" aria-label="Password"></v-text-field>

              <v-btn block color="primary" type="submit" :loading="loading" min-height="44"
                class="text-none font-weight-medium" aria-label="Create account">
                Create account
                <template v-slot:loader>
                  <v-progress-circular indeterminate></v-progress-circular>
                </template>
              </v-btn>

              <div class="text-center mt-6">
                <span class="text-medium-emphasis">Already have an account?</span>
                <NuxtLink class="text-decoration-none ml-1 font-weight-medium" to="/login" aria-label="Sign up">
                  Sign in
                </NuxtLink>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'empty'
});

useHead({
  title: 'Create Account - StackUnity',
  meta: [
    { name: 'author', content: 'Nûr' },
    { name: 'description', content: 'Create your StackUnity account to access all features, and start your experience' },
    { name: 'robots', content: 'index,follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: 'Create Account - StackUnity' },
    { property: 'og:description', content: 'Create your StackUnity account to access all features, and start your experience' },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.com/signup' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Create Account - StackUnity' },
    { name: 'twitter:description', content: 'Create your StackUnity account to access all features, and start your experience' },
    { name: 'twitter:image', content: '/images/preview.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/signup' }
  ]
})

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  username: '',
  email: '',
  password: '',
});

const features = ref([
  {
    icon: 'mdi-email-newsletter',
    title: 'Professional Templates',
    description: 'A studio with customized Vuetify component templates',
    color: 'primary'
  },
  {
    icon: 'mdi-chart-box-outline',
    title: 'Detailed Analytics',
    description: 'Accessibility and SEO audit, test all aspects of your site',
    color: 'secondary'
  },
  {
    icon: 'mdi-account-group-outline',
    title: 'Monitoring and SQL Generator',
    description: 'Site monitoring and a ready-to-use SQL generator',
    color: 'tertiary'
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'Clean Interface',
    description: 'A simple and intuitive interface for easier use',
    color: 'primary'
  }
])
const loading = ref(false);
const showPassword = ref(false);

const handleSignup = async () => {
  loading.value = true
  try {
    await userStore.signUp(form.value.username, form.value.email, form.value.password);
    router.push('/dashboard');
  } catch (err: any) {
    console.error(err.message)
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.left-panel-signup {
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.left-panel-signup::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 30%, rgba(203, 190, 255, 0.12), transparent 40%),
    radial-gradient(circle at 30% 70%, rgba(125, 208, 255, 0.12), transparent 35%);
  z-index: 0;
}

.left-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.right-panel-signup {
  background-color: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.signup-card {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 16px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}


@media (max-width: 600px) {
  .right-panel-signup {
    padding: 1rem;
    min-height: auto;
  }

  .signup-card {
    border-radius: 12px;
  }

  .auth-screen {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>