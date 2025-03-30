import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  const premiumRoutes = [
    '/sql-generator',
    '/seo-audit',
    '/robots'
  ];

  const normalizedPath = to.path.toLowerCase();

  const isRestrictedRoute = premiumRoutes.some(route => {
    const normalizedRoute = route.toLowerCase();
    return normalizedPath === normalizedRoute ||
      normalizedPath.startsWith(`${normalizedRoute}/`);
  });

  if ((to.meta.requiresPremium || isRestrictedRoute) && !userStore.user.isPremium) {
    console.log(`Access denied to premium route: ${to.path}`);
    return navigateTo('/subscription');
  }
}); 