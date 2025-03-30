<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
      <CookieBanner />
      <AnalyticsDataCollector v-if="cookieStore.preferences.analytics" />
    </v-app>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { onErrorCaptured, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AnalyticsDataCollector from '~/components/analytics/DataCollector.vue';
import CookieBanner from '~/components/cookie-banner.vue';
import { useCookieStore } from '~/stores/cookieStore';
import { useUserStore } from '~/stores/userStore';
import { TokenManager } from '~/utils/TokenManager';

const router = useRouter();
const userStore = useUserStore();
const cookieStore = useCookieStore();

// Capture les erreurs pour éviter qu'elles ne se propagent 
// et gérer spécifiquement les erreurs de démontage de composants
onErrorCaptured((err, instance, info) => {
  // Capturer les erreurs de type "Cannot read properties of null (reading 'parentNode')"
  // ou "Cannot destructure property 'type' of 'vnode' as it is null"
  if (
    err instanceof TypeError &&
    (err.message.includes("'parentNode'") ||
      err.message.includes("'type' of 'vnode' as it is null"))
  ) {
    console.warn('Vue component unmount error captured and handled:', err.message);
    return false; // Empêcher la propagation de l'erreur
  }

  // Laisser les autres erreurs se propager
  return true;
});

onMounted(() => {
  userStore.initializeStore();
  console.log('User store initialized:', userStore.isAuthenticated);

  if (process.client) {
    cookieStore.initCookieConsent();
  }

  useRouter().beforeEach((to, from, next) => {
    const token = TokenManager.retrieveToken();

    if (token && !userStore.token) {
      userStore.token = token;
      userStore.loadData();
    }

    if (!token) {
      userStore.token = null;
      userStore.isAuthenticated = false;
    }

    const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];

    const normalizedPath = to.path.toLowerCase();

    const isPremiumRoute = premiumRoutes.some(route => {
      const normalizedRoute = route.toLowerCase();
      return normalizedPath === normalizedRoute ||
        normalizedPath.startsWith(`${normalizedRoute}/`);
    });

    // Vérifier si l'utilisateur est premium ou non (avec gestion de null)
    const isPremium = userStore.user?.isPremium ?? false;

    if (isPremiumRoute && !isPremium) {
      console.log(`Access denied to premium route (global protection): ${to.path}`);
      next('/subscription');
      return;
    }

    next();
  });
});
</script>
