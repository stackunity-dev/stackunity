<template>
  <div>
    <AnalyticsCollector v-if="cookieStore.preferences.analytics" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import AnalyticsCollector from '@/components/analytics-collector.vue';
import { useCookieStore } from '@/stores/cookieStore';
import { onMounted } from 'vue';

const cookieStore = useCookieStore();

onMounted(() => {
  if (process.client) {
    console.log('[DEBUG] Marketing activé dans layout default:', cookieStore.preferences.marketing);
    console.log('[DEBUG] Analytics activé dans layout default:', cookieStore.preferences.analytics);
    console.log('[DEBUG] Préférences cookies complètes:', cookieStore.preferences);
  }
});
</script>