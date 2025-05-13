<template>
  <v-app>
    <main class="main-content">

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
                <v-btn-group density="compact">
                  <v-btn icon="mdi-monitor-screenshot" size="small" variant="text" @click="toggleMockupMode"
                    :color="useMockupMode ? 'primary' : undefined" :aria-label="translations.controls.toggleMockup">
                    <v-tooltip activator="parent">{{ translations.controls.toggleMockup }}</v-tooltip>
                  </v-btn>
                  <v-btn icon="mdi-rotate-3d-variant" size="small" variant="text" @click="toggleOrientation"
                    :aria-label="translations.controls.rotate">
                    <v-tooltip activator="parent">{{ translations.controls.rotate }}</v-tooltip>
                  </v-btn>
                  <v-btn icon="mdi-refresh" size="small" variant="text" @click="refreshCurrentIframe"
                    :aria-label="translations.controls.refresh">
                    <v-tooltip activator="parent">{{ translations.controls.refresh }}</v-tooltip>
                  </v-btn>
                </v-btn-group>
              </div>
              <div v-if="displayUrl" class="iframe-wrapper">
                <template v-if="useMockupMode">
                  <DeviceMockup v-if="tab === device.id" :device-id="device.id" :orientation="orientation"
                    :url="displayUrl">
                    <iframe :src="displayUrl" class="responsive-iframe"
                      sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                      style="width: 100%; height: 100%; border: none;"
                      :ref="el => { if (el && tab === device.id) iframeRefs[device.id] = el as HTMLIFrameElement }"
                      :key="`${device.id}-${iframeKey}`" @load="handleIframeLoad(device.id)"></iframe>
                    <div v-if="xFrameError" class="iframe-error mockup-error">
                      <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                      <p>{{ t().messages.iframeError }}</p>
                      <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                        {{ t().messages.openInNewTab }}
                      </v-btn>
                    </div>
                  </DeviceMockup>
                </template>
                <template v-else>
                  <iframe v-if="tab === device.id" :src="displayUrl" class="responsive-iframe"
                    sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                    :style="getIframeStyle(device.id)"
                    :ref="el => { if (el && tab === device.id) iframeRefs[device.id] = el as HTMLIFrameElement }"
                    :key="`${device.id}-${iframeKey}`" @load="handleIframeLoad(device.id)"></iframe>
                  <div v-if="xFrameError" class="iframe-error">
                    <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                    <p>{{ t().messages.iframeError }}</p>
                    <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                      {{ t().messages.openInNewTab }}
                    </v-btn>
                  </div>
                </template>
              </div>
              <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
                <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
                <p class="text-grey-darken-1 mt-2">{{ t().messages.enterUrl }}</p>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </main>

    <snackBar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import DeviceMockup from '../components/responsive/DeviceMockup.vue';
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
const useMockupMode = ref<boolean>(true);

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

const toggleMockupMode = (): void => {
  useMockupMode.value = !useMockupMode.value;

  setTimeout(() => {
    iframeKey.value++;
    cleanupIframes();
  }, 300);
};

const toggleOrientation = (): void => {
  orientation.value = orientation.value === 'portrait' ? 'landscape' : 'portrait';

  setTimeout(() => {
    iframeKey.value++;
  }, 300);
};

const cleanupIframes = (): void => {
  Object.keys(iframeRefs.value).forEach(key => {
    if (key !== tab.value) {
      iframeRefs.value[key] = null;
    }
  });

  if (isClient) {
    setTimeout(() => {
      const allIframes = document.querySelectorAll('.v-window-item:not(.v-window-item--active) iframe');
      allIframes.forEach((iframe: Element) => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      });

      const unusedMockups = document.querySelectorAll('.v-window-item:not(.v-window-item--active) .device-mockup-container');
      unusedMockups.forEach((mockup: Element) => {
        if (mockup.parentNode) {
          mockup.parentNode.removeChild(mockup);
        }
      });
    }, 100);
  }
};

watch(() => tab.value, (newTab, oldTab) => {
  cleanupIframes();

  setTimeout(() => {
    iframeKey.value++;
  }, 300);
}, { immediate: true });

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

const translations = {
  controls: {
    autoRefresh: t().controls.autoRefresh || 'Actualisation auto',
    interval: t().controls.interval || 'Intervalle',
    view: t().controls.view || 'Voir',
    refresh: t().controls.refresh || 'Actualiser',
    toggleMockup: 'Mode réaliste',
    rotate: 'Rotation'
  }
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--v-theme-background);
  position: relative;
  flex: 1;
  width: 100%;
}

.main-content {
  background-color: var(--v-theme-background);
  flex: 1;
  width: 100%;
}

.responsive-iframe {
  display: block;
  border: none;
  width: 100%;
  height: 100%;
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

.v-window-item {
  height: auto !important;
  min-height: 600px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
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
  background-color: #f0f0f0;
  border-radius: 8px;
  overflow: visible;
}

.iframe-wrapper:has(.device-mockup-container) {
  padding: 1rem;
  overflow: visible;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
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

:deep(.v-tabs .v-tab) {
  min-width: 100px;
  padding: 0 16px;
}

:deep(.v-window) {
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.mockup-error {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.95);
}

.device-mockup-container.landscape {
  max-width: 90vw;
  transform-origin: center;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-btn.v-btn--active {
  color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
}

:deep(.dark-theme) .iframe-wrapper {
  background-color: #2c2c2c;
}

.device-mockup-container {
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.device-mockup-container.landscape {
  transform: rotate(0deg);
}

.iframe-wrapper .device-frame {
  transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.iframe-wrapper:hover .device-frame {
  transform: translateY(-5px);
}

:deep(.device-frame) {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.iframe-container.landscape :deep(.device-mockup-container) {
  transform: rotate(0deg);
}

.v-window-item {
  height: auto !important;
  min-height: 600px;
}

:deep(.device-laptop),
:deep(.device-desktop) {
  margin-bottom: 50px;
}

:deep(.device-content iframe) {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  display: block !important;
}

/* S'assurer que les onglets inactifs sont complètement masqués */
:deep(.v-window-item:not(.v-window-item--active)) {
  display: none !important;
  visibility: hidden !important;
  position: absolute !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* S'assurer que l'onglet actif est visible */
:deep(.v-window-item.v-window-item--active) {
  display: flex !important;
  visibility: visible !important;
  position: relative !important;
  opacity: 1 !important;
}
</style>
