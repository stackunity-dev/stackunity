<template>
  <section class="auth-screen">
    <main class="fill-height pa-0">
      <v-row class="fill-height ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex left-panel align-center justify-center">
          <div class="left-content text-center">
            <header>
              <h1>
                <img src="/logo/stackunity.png" alt="StackUnity - Develop faster and better with StackUnity"
                  class="logo mb-8" width="350" />
                <span class="sr-only">{{ t().hero.title }}</span>
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

        <v-col cols="12" md="6" class="right-panel d-flex align-center justify-center">
          <v-card class="login-card pa-md-8 pa-4 elevation-0" max-width="450" width="100%">
            <div class="d-flex justify-center d-md-none mb-6">
              <img src="/logo/stackunity-title.png" alt="StackUnity Logo" width="240" />
            </div>

            <h2 class="text-h5 font-weight-bold mb-2">{{ t().form.title }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-6">{{ t().form.subtitle }}</p>

            <v-form @submit.prevent="handleSignin">
              <input type="hidden" name="_csrf" :value="csrfToken" aria-hidden="true" aria-label="CSRF token">

              <v-text-field v-model="form.email" :label="t().form.email.label" type="email" variant="outlined"
                prepend-inner-icon="mdi-email-outline" density="comfortable"
                :rules="[v => !!v || t().form.email.required, v => /.+@.+\..+/.test(v) || t().form.email.invalid]"
                hide-details="auto" autocomplete="email" aria-required="true" aria-label="Email address"></v-text-field>

              <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'"
                :label="t().form.password.label" variant="outlined" prepend-inner-icon="mdi-lock-outline"
                density="comfortable" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePasswordVisibility" class="mb-2 mt-4"
                :rules="[v => !!v || t().form.password.required, v => v.length >= 6 || t().form.password.minLength]"
                hide-details="auto" aria-required="true" aria-label="Password"></v-text-field>

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox v-model="rememberMe" :label="t().form.rememberMe" color="primary" density="compact"
                  hide-details aria-required="true" aria-label="Remember me"></v-checkbox>
              </div>

              <v-btn block color="primary" type="submit" :loading="loading" min-height="44"
                class="text-none font-weight-medium" aria-label="Sign in">
                {{ t().form.submit }}
              </v-btn>

              <div class="text-center mt-6">
                <span class="text-medium-emphasis">{{ t().createAccount.question }}</span>
                <NuxtLink class="text-decoration-none ml-1 font-weight-medium" :to="localePath('/signup')"
                  aria-label="Create account">
                  {{ t().createAccount.action }}
                </NuxtLink>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </main>

    <Snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="3000" />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead, useNuxtApp } from '#imports';
import { TokenUtils } from '../utils/token';
import { useTranslations } from '../languages';

const t = useTranslations('login');
const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

definePageMeta({
  layout: 'empty'
});

useHead({
  title: computed(() => t().meta.title),
  meta: [
    { name: 'author', content: 'Nûr' },
    { name: 'description', content: computed(() => t().meta.description) },
    { name: 'robots', content: 'index,follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { property: 'og:title', content: computed(() => t().meta.title) },
    { property: 'og:description', content: computed(() => t().meta.description) },
    { property: 'og:image', content: '/images/preview.png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'StackUnity Logo' },
    { property: 'og:image:secure_url', content: 'https://stackunity.tech/logo/stackunity-title.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://stackunity.tech/login' },
    { property: 'og:site_name', content: 'StackUnity' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: computed(() => t().meta.title) },
    { name: 'twitter:description', content: computed(() => t().meta.description) },
    { name: 'twitter:image', content: '/logo/stackunity-title.png' },
    { name: 'twitter:creator', content: '@stackunity' },
    { name: 'twitter:site', content: '@stackunity' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.tech/login' }
  ]
})

const router = useRouter();
const userStore = useUserStore();

const form = ref({
  email: '',
  password: '',
});

const csrfToken = ref('');

const features = computed(() => [
  {
    icon: 'mdi-palette-outline',
    title: t().features[0].title,
    description: t().features[0].description
  },
  {
    icon: 'mdi-database-outline',
    title: t().features[1].title,
    description: t().features[1].description
  },
  {
    icon: 'mdi-chart-box-outline',
    title: t().features[2].title,
    description: t().features[2].description
  }
])
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const showSnackbar = ref(false);
const snackbarColor = ref('');
const snackbarText = ref('');

onMounted(async () => {
  try {
    const token = TokenUtils.retrieveToken();

    try {
      const response = await fetch('/api/auth/csrf');
      const data = await response.json();
      csrfToken.value = data.token;
    } catch (error) {
      console.error('Error during CSRF token retrieval:', error);
    }

    if (token) {
      const validation = await userStore.validateToken();
      if (!validation.valid) {
        TokenUtils.removeToken();
      }
    }

    if (userStore.isAuthenticated) {
      await handleRedirection();
    }
  } catch (err) {
    console.error('[LOGIN] Error during authentication verification:', err);
  }
});

const handleSignin = async () => {
  loading.value = true;
  snackbarText.value = '';

  try {
    if (!form.value.email || !form.value.email.includes('@')) {
      snackbarColor.value = 'error';
      snackbarText.value = 'Invalid email';
      showSnackbar.value = true;
      return;
    }

    if (!form.value.password || form.value.password.length < 6) {
      snackbarColor.value = 'error';
      snackbarText.value = 'Password must contain at least 6 characters';
      showSnackbar.value = true;
      return;
    }

    const response = await userStore.login(
      form.value.email,
      form.value.password,
      rememberMe.value,
      csrfToken.value
    );
    if (response.success) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect');
      const status = urlParams.get('status');

      if (redirectPath && status) {
        window.location.href = `${redirectPath}?status=${status}`;
        return;
      }

      router.push(localePath('/dashboard'));
    } else {
      snackbarColor.value = 'error';
      snackbarText.value = 'Error during login';
      showSnackbar.value = true;
    }
  } catch (err: any) {
    console.error('[Login] Error during login:', err);
    snackbarColor.value = 'error';
    snackbarText.value = err.message || 'Unexpected error';
    showSnackbar.value = true;
  } finally {
    loading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

async function handleRedirection() {
  if (userStore.isAuthenticated) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');

    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      router.push(localePath('/dashboard'));
    }
  }
}
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.left-panel {
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.left-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 30%, rgba(173, 199, 255, 0.12), transparent 40%),
    radial-gradient(circle at 70% 70%, rgba(125, 208, 255, 0.12), transparent 35%);
  z-index: 0;
}

.left-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.right-panel {
  background-color: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.login-card {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 16px;
}

.forgot-link {
  color: rgb(var(--v-theme-primary));
  font-size: 0.875rem;
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
  .right-panel {
    padding: 1rem;
    min-height: auto;
  }

  .login-card {
    border-radius: 12px;
  }
}
</style>