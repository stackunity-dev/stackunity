import { defineNuxtPlugin } from '#app';
import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();
  const router = useRouter();

  if (process.client) {
    userStore.initializeStore();

    router.beforeEach((to, from, next) => {
      const adminRoutes = ['/newsletter-admin', '/admin'];
      const authRoutes = ['/dashboard', '/profile', '/snippets', '/studio'];
      const premiumRoutes = ['/sql-generator', '/seo-audit', '/robots'];

      const isLoggedIn = userStore.isUserAuthenticated;
      console.log('isLoggedIn:', isLoggedIn);
      console.log('userStore.user:', userStore.user);

      if (adminRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isAdminUser = isLoggedIn && userStore.user.isAdmin === true;

        if (!isAdminUser) {
          console.log('Access denied to admin route - Admin status:', userStore.user.isAdmin);
          next('/login');
          return;
        }
      }

      if (premiumRoutes.some(route => {
        const normalizedRoute = route.toLowerCase();
        const normalizedPath = to.path.toLowerCase();
        return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
      })) {
        const isPremiumUser = isLoggedIn && userStore.user.isPremium === true;

        if (!isPremiumUser) {
          console.log('Access denied to premium route - Premium status:', userStore.user.isPremium);
          next('/subscription');
          return;
        }
      }

      if (authRoutes.some(route => to.path.startsWith(route)) && !isLoggedIn) {
        console.log('Authentication required for:', to.path);
        next('/login');
        return;
      }

      next();
    });
  }
});
