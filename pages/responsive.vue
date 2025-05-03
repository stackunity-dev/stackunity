<template>
  <v-app>
    <v-main class="d-flex flex-column align-center justify-center">

      <v-card width="100%" max-width="800px" class="ma-4 pa-4" elevation="3"
        :class="{ 'hidden-controls': isMobileView && !showMobileControls }">
        <v-text-field v-model="url" :label="t().url.label" density="comfortable" prepend-inner-icon="mdi-web"
          variant="outlined" :placeholder="t().url.placeholder" clearable @keyup.enter="loadUrl"
          :rules="[v => !!v || t().url.rules.required, v => v.startsWith('http') || v.startsWith('https') || t().url.rules.startWithHttp]" />
        <v-select v-model="url" :items="availableUrls" :label="t().url.select" density="comfortable"
          prepend-inner-icon="mdi-bookmark-outline" variant="outlined" hide-details @update:model-value="loadUrl" />
        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
          <div class="d-flex align-center">
            <v-switch v-model="autoRefresh" color="primary" hide-details :label="t().controls.autoRefresh"
              class="mr-4"></v-switch>
            <v-select v-if="autoRefresh" v-model="refreshInterval" :items="refreshIntervalOptions"
              :label="t().controls.interval" density="compact" variant="outlined" hide-details
              style="width: 120px"></v-select>
          </div>
          <v-btn color="primary" @click="loadUrl" :disabled="!isValidUrl" prepend-icon="mdi-eye">
            {{ t().controls.view }}
          </v-btn>
        </div>
      </v-card>

      <v-card width="100%" class="fullwidth-card overflow-hidden mt-4" elevation="3">
        <v-tabs v-model="tab" density="comfortable" align-tabs="center" bg-color="primary" slider-color="secondary"
          color="white">
          <v-tab v-for="device in devices" :key="device.id" :value="device.id">
            <v-icon :icon="device.icon" class="mr-2"></v-icon>
            <span class="d-none d-sm-inline">{{ device.name }}</span>
            <span class="text-caption ml-1">({{ getDeviceDimensions(device.id) }})</span>
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="pa-4">
          <v-window-item v-for="device in devices" :key="device.id" :value="device.id" class="d-flex justify-center">
            <div class="iframe-container" :class="{ 'landscape': orientation === 'landscape' }">
              <div class="iframe-header d-flex align-center px-2">
                <v-icon size="small" class="mr-2">{{ device.icon }}</v-icon>
                <span class="text-caption">{{ getDeviceDimensions(device.id) }}</span>
                <v-spacer></v-spacer>
                <v-btn density="compact" icon="mdi-refresh" size="small" variant="text" @click="refreshCurrentIframe"
                  :aria-label="t().controls.refresh"></v-btn>
              </div>
              <div v-if="displayUrl" class="iframe-wrapper">
                <iframe v-if="tab === device.id" :src="displayUrl" class="responsive-iframe"
                  sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                  :style="getIframeStyle(device.id)"
                  :ref="el => { if (el) iframeRefs[device.id] = el as HTMLIFrameElement }"
                  :key="`${device.id}-${iframeKey}`" @load="handleIframeLoad(device.id)"></iframe>
                <div v-if="xFrameError" class="iframe-error">
                  <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                  <p>{{ t().messages.iframeError }}</p>
                  <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                    {{ t().messages.openInNewTab }}
                  </v-btn>
                </div>
              </div>
              <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
                <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
                <p class="text-grey-darken-1 mt-2">{{ t().messages.enterUrl }}</p>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-main>

    <snackBar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import snackBar from '../components/snackbar.vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';

definePageMeta({
  layout: 'dashboard',
})

const t = useTranslations('responsive');

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { name: 'keywords', content: 'responsive, viewer, responsive design' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: t().meta.title },
    { name: 'og:description', content: t().meta.description },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/responsive' }
  ]
})

interface Device {
  id: string;
  name: string;
  icon: string;
  width: number;
  height: number;
}

interface IframeRefs {
  [key: string]: HTMLIFrameElement | null;
}

interface RefreshInterval {
  title: string;
  value: number;
}

const display = useDisplay();
const userStore = useUserStore();

const isMobileView = computed(() => {
  return display.mdAndDown.value;
});

const showMobileControls = ref(!isMobileView.value);
const websiteData = computed(() => userStore.websiteData);

const availableUrls = computed(() => {
  if (typeof websiteData.value?.all_urls === 'string') {
    return JSON.parse(websiteData.value?.all_urls);
  } else {
    return websiteData.value?.all_urls || [];
  }
});

const url = ref<string>(websiteData.value?.main_url || '');
const displayUrl = ref<string>('');
const tab = ref<string>('mobile');
const iframeRefs = ref<IframeRefs>({});
const iframeKey = ref<number>(0);
const snackbar = ref<boolean>(false);
const snackbarText = ref<string>('');
const snackbarColor = ref<string>('success');
const xFrameError = ref<boolean>(false);
const orientation = ref<'portrait' | 'landscape'>('portrait');
const autoRefresh = ref<boolean>(false);
const refreshInterval = ref<number>(5);
const isClient = typeof window !== 'undefined';
let refreshTimer: number | null = null;

const refreshIntervalOptions = computed(() => [
  { title: t().intervals.fiveSeconds, value: 5 },
  { title: t().intervals.tenSeconds, value: 10 },
  { title: t().intervals.thirtySeconds, value: 30 },
  { title: t().intervals.oneMinute, value: 60 }
]);

const devices = computed(() => [
  { id: 'iphone', name: t().devices.iphone, icon: 'mdi-cellphone', width: 375, height: 667 },
  { id: 'android', name: t().devices.android, icon: 'mdi-android', width: 360, height: 640 },
  { id: 'ipad', name: t().devices.ipad, icon: 'mdi-apple', width: 768, height: 1024 },
  { id: 'tablet', name: t().devices.tablet, icon: 'mdi-tablet', width: 600, height: 960 },
  { id: 'laptop', name: t().devices.laptop, icon: 'mdi-laptop', width: 1024, height: 768 },
  { id: 'desktop', name: t().devices.desktop, icon: 'mdi-monitor', width: 1280, height: 800 },
]);

const isValidUrl = computed(() => {
  if (!url.value) return false;
  try {
    new URL(url.value);
    return true;
  } catch (e) {
    return false;
  }
});

const getDeviceById = (id: string): Device => {
  return devices.value.find(device => device.id === id) || devices.value[0];
};

const getDeviceDimensions = (deviceId: string): string => {
  const device = getDeviceById(deviceId);
  if (orientation.value === 'landscape') {
    return `${device.height}×${device.width}`;
  }
  return `${device.width}×${device.height}`;
};

const getIframeStyle = (deviceId: string): { width: string; height: string; maxWidth?: string; transform?: string } => {
  const device = getDeviceById(deviceId);

  if (orientation.value === 'landscape') {
    return {
      width: `${device.height}px`,
      height: `${device.width}px`,
      maxWidth: '100%',
    };
  }

  return {
    width: `${device.width}px`,
    height: `${device.height}px`,
    maxWidth: '100%',
  };
};

const loadUrl = (): void => {
  if (!isValidUrl.value) {
    snackbarText.value = t().url.rules.required;
    snackbarColor.value = "error";
    snackbar.value = true;
    return;
  }

  if (!url.value.startsWith('http://') && !url.value.startsWith('https://')) {
    url.value = 'https://' + url.value;
  }

  xFrameError.value = false;
  displayUrl.value = url.value;
  iframeKey.value++;

  snackbarText.value = t().messages.urlLoaded;
  snackbarColor.value = "success";
  snackbar.value = true;

  setupAutoRefresh();
};

const refreshIframe = (): void => {
  if (displayUrl.value) {
    iframeKey.value++;
    xFrameError.value = false;
  } else {
    snackbarText.value = t().messages.noUrlToRefresh;
    snackbarColor.value = "warning";
    snackbar.value = true;
  }
};

const refreshCurrentIframe = (): void => {
  if (displayUrl.value) {
    iframeKey.value++;
    xFrameError.value = false;
  }
};

const handleIframeLoad = (deviceId: string): void => {
};

const setupAutoRefresh = (): void => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }

  if (autoRefresh.value && displayUrl.value) {
    refreshTimer = window.setInterval(() => {
      refreshIframe();
    }, refreshInterval.value * 1000);
  }
};

watch([autoRefresh, refreshInterval], () => {
  setupAutoRefresh();
});

if (isClient) {
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('Refused to display') && e.message.includes('X-Frame-Options')) {
      xFrameError.value = true;
    }
  }, true);
}

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<style scoped>
.responsive-iframe {
  resize: both;
  min-width: 300px;
  min-height: 200px;
  max-width: 100%;
  border: none;
  transition: all 0.3s ease;
  transform-origin: top left;
}

.iframe-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  background-color: white;
  width: 100%;
  max-width: 100%;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fullwidth-card {
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: rgb(var(--v-theme-surface));
}

.v-window-item .iframe-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iframe-container.landscape {
  margin: 0 auto;
  height: auto;
}

.iframe-container.landscape iframe {
  width: 100% !important;
  height: calc(100% - 32px) !important;
  max-height: none;
}

.iframe-header {
  background: linear-gradient(to right, #5c6bc0, #3949ab);
  color: white;
  height: 36px;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.iframe-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #616161;
  background-color: #f5f5f5;
  height: 400px;
  border-radius: 0 0 12px 12px;
}

.iframe-placeholder {
  height: 400px;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 0 0 12px 12px;
}

.floating-toolbar {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 100;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5c6bc0, #3949ab);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.hidden-controls {
  display: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mode sombre amélioré */
:deep(.dark-theme) .iframe-container {
  border-color: #424242;
  background-color: #212121;
}

:deep(.dark-theme) .iframe-header {
  background: linear-gradient(to right, #303f9f, #1a237e);
  border-color: rgba(255, 255, 255, 0.1);
}

:deep(.dark-theme) .iframe-placeholder,
:deep(.dark-theme) .iframe-error {
  background-color: #333333;
  color: #e0e0e0;
}

:deep(.dark-theme) .fullwidth-card {
  background: linear-gradient(to right, #1a1f35, #121212);
}

/* Personnalisations pour les boutons et éléments d'interface */
:deep(.v-tabs .v-tab) {
  min-width: 100px;
  padding: 0 16px;
}

:deep(.v-window) {
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}
</style>
