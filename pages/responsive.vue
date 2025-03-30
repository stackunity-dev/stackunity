<template>
  <v-app>
    <v-main class="d-flex flex-column align-center justify-center">
      <v-card width="100%" max-width="800px" class="ma-12 pa-4" elevation="3">
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

      <v-card width="100%" class="mb-4" elevation="1">
        <v-card-text class="d-flex flex-wrap justify-space-between align-center py-2">
          <div class="d-flex align-center">
            <v-chip-group v-model="selectedDevices" multiple column class="mr-4" :max="1">
              <v-chip v-for="device in devices" :key="device.id" :value="device.id" filter>
                <v-icon start>{{ device.icon }}</v-icon>
                {{ device.name }}
              </v-chip>
            </v-chip-group>
          </div>
          <div class="d-flex align-center">
            <v-btn-toggle v-model="orientation" color="primary" density="comfortable">
              <v-btn value="portrait" prepend-icon="mdi-phone-portrait">Portrait</v-btn>
              <v-btn value="landscape" prepend-icon="mdi-phone-landscape">Landscape</v-btn>
            </v-btn-toggle>
          </div>
        </v-card-text>
      </v-card>

      <div v-if="sideBySideMode" class="d-flex flex-wrap justify-center gap-4 w-100">
        <div v-for="deviceId in selectedDevices" :key="deviceId" class="device-container">
          <div class="iframe-container" :class="{ 'landscape': orientation === 'landscape' }">
            <div class="iframe-header d-flex align-center px-2">
              <v-icon size="small" class="mr-2">{{ getDeviceById(deviceId).icon }}</v-icon>
              <span class="text-caption">{{ getDeviceDimensions(deviceId) }}</span>
              <v-spacer></v-spacer>
              <v-btn density="compact" icon="mdi-refresh" size="small" variant="text"
                @click="refreshSpecificIframe(deviceId)"></v-btn>
            </div>
            <div v-if="displayUrl" class="iframe-wrapper">
              <iframe :src="displayUrl" class="overflow-scroll shadow rounded-b-lg"
                sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes" :style="getIframeStyle(deviceId)"
                :ref="el => { if (el) iframeRefs[deviceId] = el as HTMLIFrameElement }"
                :key="`${deviceId}-${iframeKey}`"></iframe>
              <div v-if="xFrameError" class="iframe-error">
                <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                <p>This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'.
                </p>
                <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                  Open in a new tab
                </v-btn>
              </div>
            </div>
            <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
              <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
              <p class="text-grey-darken-1 mt-2">Enter a URL to preview the site</p>
            </div>
          </div>
        </div>
      </div>

      <v-card v-else width="100%" class="overflow-hidden" elevation="3">
        <v-tabs v-model="tab" density="comfortable" align-tabs="center" bg-color="primary" slider-color="secondary"
          color="white">
          <v-tab v-for="device in devices" :key="device.id" :value="device.id">
            <v-icon :icon="device.icon" class="mr-2"></v-icon>
            {{ device.name }}
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
                <iframe v-if="tab === device.id" :src="displayUrl" class="overflow-scroll shadow rounded-b-lg"
                  sandbox="allow-forms allow-same-origin allow-scripts" scrolling="yes"
                  :style="getIframeStyle(device.id)"
                  :ref="el => { if (el) iframeRefs[device.id] = el as HTMLIFrameElement }"
                  :key="`${device.id}-${iframeKey}`"></iframe>
                <div v-if="xFrameError" class="iframe-error">
                  <v-icon color="error" size="large" class="mb-2">mdi-alert-circle</v-icon>
                  <p>This site cannot be displayed in an iframe because it has set 'X-Frame-Options' to 'sameorigin'.
                  </p>
                  <v-btn color="primary" size="small" :href="displayUrl" target="_blank" class="mt-2">
                    Open in a new tab
                  </v-btn>
                </div>
              </div>
              <div v-else class="iframe-placeholder d-flex flex-column align-center justify-center">
                <v-icon size="large" color="grey-lighten-1">mdi-web-off</v-icon>
                <p class="text-grey-darken-1 mt-2">Enter a URL to preview the site</p>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card>
    </v-main>

    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useUserStore } from '~/stores/userStore';

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Responsive Viewer',
  meta: [
    { name: 'description', content: 'View your websites on different devices' },
    { name: 'keywords', content: 'responsive, viewer, responsive viewer, responsive design, responsive design viewer, responsive design preview, responsive design preview tool, responsive design preview tool, responsive design preview tool, responsive design preview tool' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Responsive Viewer' },
    { name: 'og:description', content: 'View your websites on different devices' },
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

const userStore = useUserStore();

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
const sideBySideMode = ref<boolean>(false);
const isDarkMode = ref<boolean>(false);
const showHistory = ref<boolean>(false);
const urlHistory = ref<string[]>([]);
const selectedDevices = ref<string[]>(['iphone']);
const autoRefresh = ref<boolean>(false);
const refreshInterval = ref<number>(5);
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

  if (!urlHistory.value.includes(url.value)) {
    urlHistory.value.unshift(url.value);
    if (urlHistory.value.length > 10) {
      urlHistory.value.pop();
    }
    if (process.client) {
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

const toggleSideBySideMode = (): void => {
  sideBySideMode.value = !sideBySideMode.value;
  if (sideBySideMode.value && selectedDevices.value.length === 0) {
    selectedDevices.value = ['iphone'];
  }
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

watch(selectedDevices, (newValue) => {
  if (newValue.length > 1) {
    selectedDevices.value = [newValue[newValue.length - 1]];
  }
});

watch(orientation, (newOrientation) => {
  if (newOrientation === 'landscape' && selectedDevices.value.length > 1) {
    selectedDevices.value = [selectedDevices.value[0]];
  }
});

if (process.client) {
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('Refused to display') && e.message.includes('X-Frame-Options')) {
      xFrameError.value = true;
    }
  }, true);
}

onMounted(() => {
  if (process.client) {
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
iframe {
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
  margin: 2rem auto;
  height: 80vh;
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

.device-container {
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in-out;
}

.w-100 {
  width: 100%;
}

.gap-4 {
  gap: 1rem;
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
