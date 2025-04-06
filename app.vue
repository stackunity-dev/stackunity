<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
      <CookieBanner />
    </v-app>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { onBeforeMount, onErrorCaptured, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CookieBanner from './components/cookie-banner.vue';
import { useCookieStore } from './stores/cookieStore';
import { useUserStore } from './stores/userStore';
import { TokenUtils } from './utils/token';
// @ts-ignore
import { usePlausible } from './utils/usePlausible';
// @ts-ignore
import { useHead } from '#imports';

useHead({
  title: 'DevUnity - The all-in-one platform for developers',
  meta: [
    { name: 'description', content: 'DevUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.' },
    { name: 'keywords', content: 'DevUnity, dashboard, tools, snippets, SQL, Studio, Sitemaps' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DevUnity",
        "description": "DevUnity is the all-in-one platform for developers who want to create, manage and optimize their web projects.",
        "url": "https://devunity.tech/",
        "email": "support@devunity.tech",
        "foundingDate": "2025-04-05",
        "legalName": "DevUnity",
        "numberOfEmployees": {
          "@type": "QuantitativeValue",
          "value": "1"
        },
        "potentialAction": {
          "@type": "ContactAction",
          "name": "Contact",
          "target": "mailto:support@devunity.tech"
        }
      })
    }
  ]
});

const router = useRouter();
const userStore = useUserStore();
const cookieStore = useCookieStore();
const plausible = usePlausible();

const isClient = typeof window !== 'undefined';

plausible('page_view', {
  props: {
    page: 'app_initialization',
    user_type: userStore.isAuthenticated ? 'authenticated' : 'guest'
  }
});

onErrorCaptured((err, instance, info) => {
  if (
    err instanceof TypeError &&
    (err.message.includes("'parentNode'") ||
      err.message.includes("'type' of 'vnode' as it is null"))
  ) {
    console.warn('Vue component unmount error captured and handled:', err.message);
    return false;
  }

  return true;
});

async function restoreUserSession() {
  if (!isClient) return false;

  const storedToken = TokenUtils.retrieveToken();
  const storedUserData = localStorage.getItem('user_data');

  if (!storedToken || !storedUserData) {
    console.log('Aucun token ou données utilisateur trouvés dans le stockage local');
    return false;
  }

  try {
    await userStore.restoreUserData();
    userStore.token = storedToken;

    const validationResult = await userStore.validateToken();

    if (validationResult.valid) {
      console.log('Token valide, chargement des données utilisateur');
      await userStore.loadData();
      userStore.isAuthenticated = true;
      console.log('Session utilisateur restaurée avec succès');
      return true;
    }

    console.log('Token invalide, tentative de rafraîchissement');
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (!refreshResponse.ok) {
      console.log('Échec du rafraîchissement du token');
      userStore.logout();
      return false;
    }

    const refreshData = await refreshResponse.json();

    if (!refreshData.success || !refreshData.accessToken) {
      console.log('Pas de token dans la réponse de rafraîchissement');
      userStore.logout();
      return false;
    }

    TokenUtils.storeToken(refreshData.accessToken);
    userStore.setToken(refreshData.accessToken);

    if (refreshData.user) {
      userStore.user = refreshData.user;
      userStore.isAuthenticated = true;
      userStore.isPremium = !!refreshData.user.isPremium;
      userStore.isAdmin = !!refreshData.user.isAdmin;
      userStore.persistData();
    }

    console.log('Session utilisateur restaurée via rafraîchissement');
    return true;
  } catch (error) {
    console.error('Erreur lors de la restauration de la session:', error);
    userStore.logout();
    return false;
  }
}

onBeforeMount(async () => {
  if (isClient) {
    await restoreUserSession();
  }
});

onMounted(async () => {
  if (isClient) {
    if (!userStore.isAuthenticated) {
      await restoreUserSession();
    }

    cookieStore.initCookieConsent();
  }

  router.beforeEach((to, from, next) => {
    const token = TokenUtils.retrieveToken();

    if (token && !userStore.token) {
      userStore.token = token;
      userStore.loadData();
    }

    if (!token) {
      userStore.token = null;
      userStore.isAuthenticated = false;
    }


    if (to.path !== from.path) {
      plausible('pageview', {
        props: {
          path: to.path,
          referrer: from.path,
          user_type: userStore.isAuthenticated ? (userStore.user?.isPremium ? 'premium' : 'free') : 'guest'
        }
      });
    }

    const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];

    const normalizedPath = to.path.toLowerCase();

    const isPremiumRoute = premiumRoutes.some(route => {
      const normalizedRoute = route.toLowerCase();
      return normalizedPath === normalizedRoute ||
        normalizedPath.startsWith(`${normalizedRoute}/`);
    });

    const isPremium = userStore.user?.isPremium ?? false;

    if (isPremiumRoute && !isPremium) {

      plausible('premium_access_attempt', {
        props: {
          route: to.path,
          user_id: userStore.user?.id || 'guest'
        }
      });

      next('/subscription');
      return;
    }

    next();
  });

  if (isClient) {
    window.addEventListener('error', (e) => {
      plausible('error', {
        props: {
          message: e.message,
          source: e.filename,
          line: e.lineno,
          path: window.location.pathname
        }
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;

      if (target.closest('[data-plausible-feature]')) {
        const featureElement = target.closest('[data-plausible-feature]') as HTMLElement;
        const feature = featureElement.dataset.plausibleFeature;

        plausible('feature_used', {
          props: {
            feature: feature,
            path: window.location.pathname
          }
        });
      }
    });
  }
});
</script>
