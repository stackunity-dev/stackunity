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
import 'sqlstring';
import 'net';
import 'tls';
import 'timers';
import 'events';
import 'stream';
import 'denque';
import 'lru.min';
import 'buffer';
import 'long';
import 'iconv-lite';
import 'process';
import 'crypto';
import 'zlib';
import 'seq-queue';
import 'generate-function';
import 'url';
import 'aws-ssl-profiles';
import 'named-placeholders';
import 'pinia';
import 'vue-router';
import 'deep-pick-omit';
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
