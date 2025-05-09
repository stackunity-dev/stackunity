<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { onBeforeMount, onErrorCaptured, onMounted, ref } from 'vue';
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
const sessionRestorationAttempted = ref(false);
const restorationAttemptCount = ref(0);

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
    }
  ]
});

onErrorCaptured((err) => {
  if (
    err instanceof TypeError &&
    (err.message.includes("'parentNode'") ||
      err.message.includes("'type' of 'vnode'") ||
      err.message.includes("null") ||
      err.message.includes("undefined"))
  ) {
    console.warn('Erreur Vue ignorée:', err.message);
    return false;
  }

  return true;
});

const restoreUserSession = async () => {
  try {
    if (!isClient || sessionRestorationAttempted.value) {
      return false;
    }

    sessionRestorationAttempted.value = true;
    restorationAttemptCount.value++;

    const token = TokenUtils.retrieveToken();
    if (!token) {
      return false;
    }

    try {
      const validationResult = await userStore.validateToken();

      if (validationResult && validationResult.valid) {
        await userStore.loadData();
        userStore.isAuthenticated = true;

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

      if (!refreshResponse.ok) {
        return false;
      }

      const refreshData = await refreshResponse.json();

      if (!refreshData.success || !refreshData.accessToken) {
        return false;
      }

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

onBeforeMount(async () => {
  if (isClient && !sessionRestorationAttempted.value) {
    try {
      await restoreUserSession();
    } catch (error) {
      console.error('Erreur durant la restauration initiale:', error);
    }
  }
});

onMounted(async () => {
  if (isClient) {
    localStorage.setItem('stackunity_consent', 'true');
  }

  (function () {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `${window.location.origin}/tracker.js`;
    s.setAttribute('data-website-id', 'stackunity-app');
    var x = document.getElementsByTagName('script')[0];
    if (x && x.parentNode) {
      x.parentNode.insertBefore(s, x);
    }
  })();

  if (isClient) {
    if (!userStore.isAuthenticated && !sessionRestorationAttempted.value) {
      try {
        await restoreUserSession();
      } catch (error) {
        console.error('Erreur durant la restauration au montage:', error);
      }
    }

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

        const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];
        const normalizedPath = to.path.toLowerCase();

        const isPremiumRoute = premiumRoutes.some(route => {
          const normalizedRoute = route.toLowerCase();
          return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute} / `);
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

  }
});
</script>

<style>
[data-segment-id] {
  background-color: transparent !important;
  visibility: hidden !important;
  opacity: 0 !important;
  display: none !important;
}

img[src*="emergency=1"] {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
</style>
