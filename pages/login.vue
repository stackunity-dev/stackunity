<template>
  <section class="auth-screen">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex left-panel align-center justify-center">
          <div class="left-content text-center">
            <h1>
              <img src="/logo/stackunity.png" alt="StackUnity - Develop faster and better with StackUnity"
                class="logo mb-8" width="350" />
              <span class="sr-only">StackUnity - Develop faster and better with StackUnity</span>
            </h1>
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

            <h2 class="text-h5 font-weight-bold mb-2">Sign In</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-6">Pick up where you left off</p>

            <v-form @submit.prevent="handleSignin">
              <input type="hidden" name="_csrf" :value="csrfToken">

              <v-text-field v-model="form.email" label="Email address" type="email" variant="outlined"
                prepend-inner-icon="mdi-email-outline" density="comfortable"
                :rules="[v => !!v || 'Email required', v => /.+@.+\..+/.test(v) || 'Invalid email format']"
                hide-details="auto" autocomplete="email"></v-text-field>

              <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password"
                variant="outlined" prepend-inner-icon="mdi-lock-outline" density="comfortable"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="togglePasswordVisibility" class="mb-2 mt-4"
                :rules="[v => !!v || 'Password required']" hide-details="auto"></v-text-field>

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox v-model="rememberMe" label="Remember me" color="primary" density="compact"
                  hide-details></v-checkbox>
              </div>

              <v-btn block color="primary" type="submit" :loading="loading" min-height="44"
                class="text-none font-weight-medium">
                Sign in
              </v-btn>

              <div class="text-center mt-6">
                <span class="text-medium-emphasis">Don't have an account?</span>
                <NuxtLink class="text-decoration-none ml-1 font-weight-medium" to="/signup">
                  Create account
                </NuxtLink>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <Snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="3000" />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { TokenUtils } from '../utils/token';

definePageMeta({
  layout: 'empty'
});

useHead({
  title: 'Sign In - StackUnity',
  meta: [
    { name: 'author', content: 'Nûr' },
    { name: 'description', content: 'Sign in to your StackUnity account to access all features' },
    { name: 'robots', content: 'index,follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Sign In - StackUnity' },
    { name: 'og:description', content: 'Sign in to your StackUnity account to access all features' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
    { name: 'og:image:width', content: '1200' },
    { name: 'og:image:height', content: '630' },
    { name: 'og:image:alt', content: 'StackUnity Logo' },
    { name: 'og:image:secure_url', content: 'https://stackunity.tech/logo/stackunity-title.png' },
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

const features = ref([
  {
    icon: 'mdi-palette-outline',
    title: 'Vuetify Components',
    description: 'Custom Vuetify components ready to use'
  },
  {
    icon: 'mdi-database-outline',
    title: 'SQL Generator',
    description: 'Generate SQL databases quickly and easily'
  },
  {
    icon: 'mdi-chart-box-outline',
    title: 'SEO and Accessibility Statistics',
    description: 'Track your performance and improve your site'
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
      console.error('Erreur lors de la récupération du token CSRF:', error);
    }

    if (token) {
      const validation = await userStore.validateToken();
      if (!validation.valid) {
        TokenUtils.removeToken();
      }
    }

    if (userStore.isAuthenticated) {
      console.log('[LOGIN] Utilisateur déjà authentifié, redirection');
      await handleRedirection();
    }
  } catch (err) {
    console.error('[LOGIN] Erreur lors de la vérification de l\'authentification:', err);
  }
});

const handleSignin = async () => {
  loading.value = true;
  snackbarText.value = '';

  try {
    if (!form.value.email || !form.value.email.includes('@')) {
      snackbarColor.value = 'error';
      snackbarText.value = 'Email invalide';
      showSnackbar.value = true;
      return;
    }

    if (!form.value.password || form.value.password.length < 6) {
      snackbarColor.value = 'error';
      snackbarText.value = 'Le mot de passe doit contenir au moins 6 caractères';
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

      router.push('/dashboard');
    } else {
      snackbarColor.value = 'error';
      snackbarText.value = 'Erreur de connexion';
      showSnackbar.value = true;
    }
  } catch (err: any) {
    console.error('[Login] Erreur de connexion:', err);
    snackbarColor.value = 'error';
    snackbarText.value = err.message || 'Erreur inattendue';
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
      console.log('[LOGIN] Redirection vers le tableau de bord');
      router.push('/dashboard');
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