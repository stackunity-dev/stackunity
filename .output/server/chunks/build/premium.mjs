import { c3 as defineNuxtRouteMiddleware, S as useUserStore, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'pinia';
import 'vue-router';
import 'pinia-plugin-persistedstate';
import 'vue/server-renderer';

const premium = defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const premiumRoutes = [
    "/sql-generator",
    "/seo-audit",
    "/robots"
  ];
  const normalizedPath = to.path.toLowerCase();
  const isRestrictedRoute = premiumRoutes.some((route) => {
    const normalizedRoute = route.toLowerCase();
    return normalizedPath === normalizedRoute || normalizedPath.startsWith(`${normalizedRoute}/`);
  });
  if ((to.meta.requiresPremium || isRestrictedRoute) && !userStore.user.isPremium) {
    console.log(`Access denied to premium route: ${to.path}`);
    return navigateTo("/subscription");
  }
});

export { premium as default };
//# sourceMappingURL=premium.mjs.map
