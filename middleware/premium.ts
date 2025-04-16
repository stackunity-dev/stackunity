// @ts-ignore
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useUserStore } from '../stores/userStore';

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  const premiumRoutes = [
    '/sql-generator',
    '/seo-audit',
    '/robots',
    '/studio'
  ];

  const normalizedPath = to.path.toLowerCase();

  const isRestrictedRoute = premiumRoutes.some(route => {
    const normalizedRoute = route.toLowerCase();
    return normalizedPath === normalizedRoute ||
      normalizedPath.startsWith(`${normalizedRoute}/`);
  });

  const isPremium = userStore.user && userStore.user.isPremium;

  if ((to.meta.requiresPremium || isRestrictedRoute) && !isPremium) {
    console.log(`Access denied to premium route: ${to.path}`);
    return navigateTo('/checkout');
  }

  if (!userStore.isPremium) {
    return navigateTo('/pricing');
  }
}); 