import { c4 as defineNuxtRouteMiddleware, W as useUserStore, n as navigateTo } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'mysql2/promise';
import 'node:path';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'pinia';
import 'vue-router';
import 'deep-pick-omit';

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
//# sourceMappingURL=premium-ChaJQzMv.mjs.map
