<template>
  <NuxtLayout>
    <v-app id="app" class="app-container">
      <div v-if="isReady">
        <NuxtPage />
      </div>
      <div v-else class="app-loading">
      </div>
    </v-app>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeMount, onErrorCaptured, onMounted, onServerPrefetch, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookieStore } from './stores/cookieStore';
import { useUserStore } from './stores/userStore';
import { TokenUtils } from './utils/token';
// @ts-ignore
import { useHead } from '#imports';
import { initLanguage } from './languages';

const router = useRouter();
const userStore = useUserStore();
const cookieStore = useCookieStore();
const isClient = typeof window !== 'undefined';
const isHydrating = ref(true);
const isReady = ref(false);
const sessionRestorationAttempted = ref(false);
const restorationAttemptCount = ref(0);
const appReady = ref(false);

provide('pageReady', isReady);

if (!userStore.user) {
  userStore.user = {
    id: 0,
    username: '',
    email: '',
    isPremium: false,
    isAdmin: false,
  };
}

userStore.isPremium = userStore.isPremium || false;
userStore.isAdmin = userStore.isAdmin || false;

useHead({
  title: 'StackUnity - The all-in-one platform for developers',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { name: 'description', content: 'StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'keywords', content: 'StackUnity, dashboard, tools, snippets, SQL, Studio, Sitemaps' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'og:title', content: 'StackUnity - The all-in-one platform for developers' },
    { name: 'og:description', content: 'StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'og:image', content: '/images/preview.png' },
    { rel: 'canonical', href: 'https://stackunity.tech/' },
    { rel: 'icon', type: 'image/png', href: '/images/preview.png' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "StackUnity",
        "description": "StackUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.",
        "url": "https://stackunity.tech/",
        "email": "support@stackunity.tech",
        "foundingDate": "2025-04-05",
        "legalName": "StackUnity",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": "1"
        },
        "potentialAction": {
          "@type": "ContactAction",
          "name": "Contact",
          "target": "mailto:support@stackunity.tech"
        }
      })
    },
    {
      src: 'https://stackunity.tech/tracker.js',
      defer: true,
      async: true,
      'data-website-id': 'ab8568cc-7922-481f-94e2-0d62e1072c5a'
    }
  ],
  style: [
    {
      children: `


        
        .app-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          background-color: #121212;
        }
      `
    }
  ]
});

onErrorCaptured((err, instance, info) => {
  try {
    if (
      err instanceof TypeError &&
      (err.message.includes("'parentNode'") ||
        err.message.includes("'type' of 'vnode'") ||
        err.message.includes("null") ||
        err.message.includes("undefined") ||
        err.message.includes("Cannot read properties of undefined") ||
        err.message.includes("Cannot access") ||
        err.message.includes("dispose") ||
        err.message.includes("'title'") ||
        err.message.includes("before initialization"))
    ) {
      console.warn('Erreur Vue ignorée:', err.message);
      return false;
    }
  } catch (e) {
  }

  return true;
});

const restoreUserSession = async () => {
  if (!isClient || sessionRestorationAttempted.value) {
    return false;
  }

  sessionRestorationAttempted.value = true;
  restorationAttemptCount.value++;

  try {
    const token = TokenUtils.retrieveToken();
    if (!token) return false;

    try {
      const validationResult = await userStore.validateToken();

      if (validationResult && validationResult.valid) {
        await userStore.loadData();
        userStore.isAuthenticated = true;

        try {
          const trialResponse = await fetch('/api/auth/check-trial', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (trialResponse.ok) {
            const trialData = await trialResponse.json();
            if (trialData.success) {
              userStore.isPremium = trialData.isPremium;
              if (userStore.user) {
                userStore.user.isPremium = trialData.isPremium;
              }
              userStore.persistData();
            }
          }
        } catch (trialError) {
          console.error('Erreur lors de la vérification du statut premium:', trialError);
        }

        return true;
      }
    } catch (validationError) {
      console.error('Erreur lors de la validation du token:', validationError);
    }

    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (!refreshResponse.ok) return false;

      const refreshData = await refreshResponse.json();
      if (!refreshData.success || !refreshData.accessToken) return false;

      TokenUtils.storeToken(refreshData.accessToken);
      userStore.setToken(refreshData.accessToken);

      if (refreshData.user) {
        userStore.user = {
          ...refreshData.user,
          isPremium: Boolean(refreshData.user.isPremium),
          isAdmin: Boolean(refreshData.user.isAdmin)
        };
        userStore.isAuthenticated = true;
        userStore.isPremium = Boolean(refreshData.user.isPremium);
        userStore.isAdmin = Boolean(refreshData.user.isAdmin);
        userStore.persistData();

        return true;
      }
    } catch (refreshError) {
      console.error('Erreur lors du rafraîchissement du token:', refreshError);
    }
  } catch (error) {
    console.error('Erreur générale lors de la restauration de la session:', error);
  }

  try {
    if (!userStore.user) {
      userStore.user = {
        id: 0,
        username: '',
        email: '',
        isPremium: false,
        isAdmin: false
      };
    }

    userStore.isPremium = userStore.isPremium || false;
    userStore.isAdmin = userStore.isAdmin || false;
  } catch (fallbackError) {
    console.error('Erreur lors de la réinitialisation de secours:', fallbackError);
  }

  return false;
}

onServerPrefetch(async () => {
  console.log('ServerPrefetch - App.vue');
  if (!isClient) {
    isReady.value = true;
  }
});

onBeforeMount(async () => {
  if (isClient) {
    document.documentElement.classList.add('v-application--is-hydrating');

    restoreUserSession().finally(() => {
      appReady.value = true;
    });

    nextTick(() => {
      if (isClient) {
        try {
          localStorage.setItem('stackunity_consent', 'true');
        } catch (e) {
          console.warn('Impossible de définir localStorage:', e);
        }
      }
    });
  }
});

onMounted(() => {
  if (!isClient) return;

  isHydrating.value = false;

  setTimeout(() => {
    isReady.value = true;
    nextTick(() => {
      document.documentElement.classList.remove('v-application--is-hydrating');
      document.documentElement.classList.add('v-application--hydrated');
    });
  }, 50);

  cookieStore.initCookieConsent();
  initLanguage();

  router.beforeEach((to, from, next) => {
    try {
      if (!userStore.user) {
        userStore.user = {
          id: 0,
          username: '',
          email: '',
          isPremium: false,
          isAdmin: false
        };
      }

      const token = TokenUtils.retrieveToken();
      if (token && !userStore.token) {
        userStore.token = token;

        try {
          userStore.loadData().catch(err => {
            console.error('Erreur non critique lors du chargement des données:', err);
          });
        } catch (loadError) {
          console.error('Exception lors du chargement des données:', loadError);
        }
      }

      if (!token) {
        userStore.token = null;
        userStore.isAuthenticated = false;
      }

      const premiumRoutes = ['/database-designer', '/analytics', '/semantic'];
      const normalizedPath = to.path.toLowerCase();

      const isPremiumRoute = premiumRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      });

      let isPremium = false;
      try {
        isPremium = (userStore.user && Boolean(userStore.user.isPremium)) || Boolean(userStore.isPremium) || false;
      } catch (premiumError) {
        console.error('Erreur de vérification premium:', premiumError);
        isPremium = false;
      }

      if (isPremiumRoute && !isPremium) {
        return next('/pricing');
      }

      next();
    } catch (routerError) {
      console.error('Erreur critique dans la navigation:', routerError);
      next();
    }
  });
});
</script>

<style>
html,
body {
  background-color: #121212;
  color: #fff;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
}

[data-segment-id] {
  display: none;
}

img[src*="emergency=1"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  opacity: 0;
}
</style>
