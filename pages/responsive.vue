<template>
  <v-app>
    <v-main class="d-flex flex-column align-center justify-center">
      <!-- Barre d'outils flottante sur mobile -->
      <v-card v-if="isMobileView" class="floating-toolbar" elevation="5">
        <v-btn icon="mdi-menu" @click="showMobileControls = !showMobileControls"></v-btn>
      </v-card>

      <!-- Contrôles principaux (masquables sur mobile) -->
      <v-card width="100%" max-width="800px" class="ma-4 pa-4" elevation="3"
        :class="{ 'hidden-controls': isMobileView && !showMobileControls }">
        <v-text-field v-model="url" label="Enter a URL" density="comfortable" prepend-inner-icon="mdi-web"
          variant="outlined" placeholder="https://example.com" clearable @keyup.enter="loadUrl"></v-text-field>
        <div class="d-flex flex-wrap justify-space-between align-center mt-2">
          <div class="d-flex align-center">
            <v-switch v-model="autoRefresh" color="primary" hide-details label="Auto-refresh" class="mr-4"></v-switch>
            <v-select v-if="autoRefresh" v-model="refreshInterval" :items="refreshIntervals" label="Interval"
              density="compact" variant="outlined" hide-details style="width: 120px"></v-select>
          </div>
          <v-btn color="primary" @click="loadUrl" :disabled="!isValidUrl" prepend-icon="mdi-eye">
            View
          </v-btn>
        </div>
      </v-card>

      <!-- Sélecteur de mode d'affichage -->
      <v-card width="100%" class="mb-4" elevation="1"
        :class="{ 'hidden-controls': isMobileView && !showMobileControls }">
        <v-card-text class="d-flex flex-wrap justify-space-between align-center py-2">
          <div class="d-flex align-center">
            <v-chip-group v-model="selectedDevices" multiple column class="mr-4"
              :max="viewMode === 'comparison' ? 2 : (viewMode === 'grid' ? 6 : 1)">
              <v-chip v-for="device in devices" :key="device.id" :value="device.id" filter>
                <v-icon start>{{ device.icon }}</v-icon>
                {{ device.name }}
              </v-chip>
            </v-chip-group>
          </div>

          <div class="d-flex flex-wrap align-center">
            <!-- Mode d'affichage -->
            <v-btn-toggle v-model="viewMode" color="primary" density="comfortable" class="mr-2">
              <v-btn value="tabs" title="Tabs View">
                <v-icon>mdi-tab</v-icon>
              </v-btn>
              <v-btn value="comparison" title="Comparison View">
                <v-icon>mdi-compare</v-icon>
              </v-btn>
              <v-btn value="grid" title="Grid View">
                <v-icon>mdi-view-grid</v-icon>
              </v-btn>
            </v-btn-toggle>

            <!-- Orientation -->
            <v-btn-toggle v-model="orientation" color="primary" density="comfortable">
              <v-btn value="portrait" prepend-icon="mdi-phone-portrait">
                <span class="d-none d-sm-inline">Portrait</span>
              </v-btn>
              <v-btn value="landscape" prepend-icon="mdi-phone-landscape">
                <span class="d-none d-sm-inline">Landscape</span>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-card-text>
      </v-card>

      <!-- Mode Grille (remplace sideBySideMode) -->
      <div v-if="viewMode === 'grid'" class="device-grid">
        <div v-for="deviceId in selectedDevices" :key="deviceId" class="device-container"
          :class="{ 'landscape': orientation === 'landscape' }">
          <div class="iframe-container">
            <div class="iframe-header d-flex align-center px-2">
              <v-icon size="small" class="mr-2">{{ getDeviceById(deviceId).icon }}</v-icon>
              <span class="text-caption">{{ getDeviceDimensions(deviceId) }}</span>
              <v-spacer></v-spacer>
              <v-btn density="compact" icon="mdi-refresh" size="small" variant="text"
                @click="refreshSpecificIframe(deviceId)"></v-btn>
            </div>
            <div v-if="displayUrl" class="iframe-wrapper">
              <iframe :src="displayUrl" class="responsive-iframe" sandbox="allow-forms allow-same-origin allow-scripts"
                scrolling="yes" :style="getIframeStyle(deviceId)"
                :ref="el => { if (el) { iframeRefs[deviceId] = el as HTMLIFrameElement; } }"
                :key="`${deviceId}-${iframeKey}`" @load="handleIframeLoad(deviceId)"></iframe>
              <div v-if="xFrameError" class="iframe-error">
                <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                <p>This site cannot be displayed in an iframe due to X-Frame-Options.</p>
                <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                  Open in a new tab
                </v-btn>
              </div>
            </div>
            <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
              <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
              <p class="text-grey-darken-1 mt-2">Enter a URL to preview</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mode Comparaison (nouveau) -->
      <div v-else-if="viewMode === 'comparison'" class="comparison-container">
        <div class="comparison-devices">
          <div v-for="deviceId in selectedDevices.slice(0, 2)" :key="deviceId" class="comparison-device"
            :class="{ 'landscape': orientation === 'landscape' }">
            <div class="iframe-container">
              <div class="iframe-header d-flex align-center px-2">
                <v-icon size="small" class="mr-2">{{ getDeviceById(deviceId).icon }}</v-icon>
                <span class="text-caption">{{ getDeviceDimensions(deviceId) }}</span>
                <v-spacer></v-spacer>
                <v-btn density="compact" icon="mdi-refresh" size="small" variant="text"
                  @click="refreshSpecificIframe(deviceId)"></v-btn>
              </div>
              <div v-if="displayUrl" class="iframe-wrapper">
                <iframe :src="displayUrl" class="responsive-iframe"
                  sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                  :style="getIframeStyle(deviceId)"
                  :ref="el => { if (el) { iframeRefs[deviceId] = el as HTMLIFrameElement; } }"
                  :key="`${deviceId}-${iframeKey}`" @load="handleIframeLoad(deviceId)"></iframe>
                <div v-if="xFrameError" class="iframe-error">
                  <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                  <p>This site cannot be displayed in an iframe.</p>
                  <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                    Open in a new tab
                  </v-btn>
                </div>
              </div>
              <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
                <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
                <p class="text-grey-darken-1 mt-2">Enter a URL to preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mode Onglets (ancien mode) -->
      <v-card v-else width="100%" class="overflow-hidden" elevation="3">
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
                <v-btn density="compact" icon="mdi-refresh" size="small" variant="text"
                  @click="refreshCurrentIframe"></v-btn>
              </div>
              <div v-if="displayUrl" class="iframe-wrapper">
                <iframe v-if="tab === device.id" :src="displayUrl" class="responsive-iframe"
                  sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                  :style="getIframeStyle(device.id)"
                  :ref="el => { if (el) iframeRefs[device.id] = el as HTMLIFrameElement }"
                  :key="`${device.id}-${iframeKey}`" @load="handleIframeLoad(device.id)"></iframe>
                <div v-if="xFrameError" class="iframe-error">
                  <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                  <p>This site cannot be displayed in an iframe.</p>
                  <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                    Open in a new tab
                  </v-btn>
                </div>
              </div>
              <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
                <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
                <p class="text-grey-darken-1 mt-2">Enter a URL to preview</p>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import snackBar from '../components/snackbar.vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Responsive Viewer',
  meta: [
    { name: 'description', content: 'View your websites on different devices' },
    { name: 'keywords', content: 'responsive, viewer, responsive design' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Responsive Viewer' },
    { name: 'og:description', content: 'View your websites on different devices' },
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

const isMobileView = computed(() => {
  return display.mdAndDown.value;
});
const showMobileControls = ref(!isMobileView.value);

const url = ref<string>('');
const displayUrl = ref<string>('');
const tab = ref<string>('mobile');
const iframeRefs = ref<IframeRefs>({});
const iframeKey = ref<number>(0);
const snackbar = ref<boolean>(false);
const snackbarText = ref<string>('');
const snackbarColor = ref<string>('success');
const xFrameError = ref<boolean>(false);
const orientation = ref<'portrait' | 'landscape'>('portrait');
const viewMode = ref<'tabs' | 'comparison' | 'grid'>('tabs');
const isDarkMode = ref<boolean>(false);
const urlHistory = ref<string[]>([]);
const selectedDevices = ref<string[]>(['iphone']);
const autoRefresh = ref<boolean>(false);
const refreshInterval = ref<number>(5);
const isClient = typeof window !== 'undefined';
let refreshTimer: number | null = null;

const refreshIntervals: RefreshInterval[] = [
  { title: '5 seconds', value: 5 },
  { title: '10 seconds', value: 10 },
  { title: '30 seconds', value: 30 },
  { title: '1 minute', value: 60 }
];

const devices: Device[] = [
  { id: 'iphone', name: 'iPhone', icon: 'mdi-cellphone', width: 375, height: 667 },
  { id: 'android', name: 'Android', icon: 'mdi-android', width: 360, height: 640 },
  { id: 'ipad', name: 'iPad', icon: 'mdi-apple', width: 768, height: 1024 },
  { id: 'tablet', name: 'Tablet', icon: 'mdi-tablet', width: 600, height: 960 },
  { id: 'laptop', name: 'Laptop', icon: 'mdi-laptop', width: 1024, height: 768 },
  { id: 'desktop', name: 'Desktop', icon: 'mdi-monitor', width: 1280, height: 800 },
  { id: 'tv', name: 'TV', icon: 'mdi-television', width: 1920, height: 1080 }
];

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
  return devices.find(device => device.id === id) || devices[0];
};

const getDeviceDimensions = (deviceId: string): string => {
  const device = getDeviceById(deviceId);
  if (orientation.value === 'landscape') {
    return `${device.height}×${device.width}`;
  }
  return `${device.width}×${device.height}`;
};

const getIframeStyle = (deviceId: string): { width: string; height: string } => {
  const device = getDeviceById(deviceId);
  if (orientation.value === 'landscape') {
    return {
      width: `${device.height}px`,
      height: `${device.width}px`
    };
  }
  return {
    width: `${device.width}px`,
    height: `${device.height}px`
  };
};

const loadUrl = (): void => {
  if (!isValidUrl.value) {
    snackbarText.value = "Please enter a valid URL";
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

  snackbarText.value = "URL loaded";
  snackbarColor.value = "success";
  snackbar.value = true;

  if (!urlHistory.value.includes(url.value)) {
    urlHistory.value.unshift(url.value);
    if (urlHistory.value.length > 10) {
      urlHistory.value.pop();
    }
    if (isClient) {
      localStorage.setItem('responsive-url-history', JSON.stringify(urlHistory.value));
    }
  }

  setupAutoRefresh();
};

const refreshIframe = (): void => {
  if (displayUrl.value) {
    iframeKey.value++;
    xFrameError.value = false;
  } else {
    snackbarText.value = "No URL to refresh";
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

const refreshSpecificIframe = (deviceId: string): void => {
  if (displayUrl.value) {
    iframeKey.value++;
    xFrameError.value = false;
  }
};

const handleIframeLoad = (deviceId: string): void => {
  console.log(`Iframe chargée pour l'appareil ${deviceId}`);
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

watch(viewMode, (newMode) => {
  if (newMode === 'tabs') {
    selectedDevices.value = [tab.value];
  } else if (newMode === 'comparison' && selectedDevices.value.length > 2) {
    selectedDevices.value = selectedDevices.value.slice(0, 2);
  } else if (newMode === 'grid' && selectedDevices.value.length === 0) {
    selectedDevices.value = ['iphone'];
  }
});

watch(orientation, (newOrientation) => {
  iframeRefs.value = {};
});

if (isClient) {
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('Refused to display') && e.message.includes('X-Frame-Options')) {
      xFrameError.value = true;
    }
  }, true);
}

onMounted(() => {
  if (isClient) {
    const savedHistory = localStorage.getItem('responsive-url-history');
    if (savedHistory) {
      try {
        urlHistory.value = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark-theme');
    }
  }
});

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
}

.iframe-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  width: 100%;
  max-width: 1280px;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.iframe-container.landscape {
  max-width: 90vh;
  margin: 0 auto;
  height: auto;
}

.iframe-container.landscape iframe {
  width: 100% !important;
  height: calc(100% - 32px) !important;
  max-height: none;
}

.iframe-header {
  background-color: #f5f5f5;
  height: 32px;
  border-bottom: 1px solid #e0e0e0;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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
}

.iframe-placeholder {
  height: 400px;
  background-color: #f5f5f5;
  border-radius: 0 0 8px 8px;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
}

.device-container {
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.comparison-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.comparison-devices {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.comparison-device {
  flex: 1;
  min-width: 300px;
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .comparison-devices {
    flex-direction: column;
  }

  .comparison-device {
    width: 100%;
  }
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
  background-color: #333333;
  border-color: #424242;
}

:deep(.dark-theme) .iframe-placeholder,
:deep(.dark-theme) .iframe-error {
  background-color: #333333;
  color: #e0e0e0;
}
</style>
