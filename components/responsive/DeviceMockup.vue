<template>
  <div class="device-mockup-container" :class="{ 'landscape': orientation === 'landscape' }" ref="mockupContainerRef">
    <div class="device-frame" :class="`device-${deviceId}`" :style="getDeviceStyle">
      <div v-if="hasNotch" class="device-notch" :style="getNotchStyle"></div>

      <template v-if="hasCamera">
        <div class="device-camera" :style="getCameraStyle"></div>
      </template>

      <template v-if="hasButtons">
        <div v-for="(button, index) in mockupDevice.frame.buttons" :key="`button-${index}`" class="device-button"
          :class="`device-button-${button.position}`" :style="getButtonStyle(button)"></div>
      </template>

      <div class="device-screen" :style="getScreenStyle">
        <template v-if="showBrowserChrome">
          <div class="browser-chrome" :style="getBrowserStyle">
            <template v-if="showChromeTabs">
              <div class="browser-tabs" :style="getTabsStyle">
                <div class="browser-tab active">
                  <span class="tab-favicon"
                    :style="`background-color: ${mockupDevice.browser?.brandColor || '#1976d2'}`"></span>
                  <span class="tab-title">{{ getHostname }}</span>
                </div>
              </div>
            </template>

            <template v-if="showAddressBar">
              <div class="browser-address-bar" :style="getAddressBarStyle">
                <div class="browser-controls">
                  <div class="browser-action close"></div>
                  <div class="browser-action minimize"></div>
                  <div class="browser-action expand"></div>
                </div>
                <div class="browser-url-field">
                  <span class="url-icon"></span>
                  <span class="url">{{ url || 'example.com' }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>

        <div class="device-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { deviceMockups, type DeviceMockup } from '../../utils/device-mockups';

const props = defineProps({
  deviceId: {
    type: String,
    required: true
  },
  orientation: {
    type: String as () => 'portrait' | 'landscape',
    default: 'portrait'
  },
  url: {
    type: String,
    default: ''
  }
});

const mockupContainerRef = ref<HTMLElement | null>(null);

const mockupDevice = computed<DeviceMockup>(() => {
  return deviceMockups[props.deviceId] || deviceMockups.desktop;
});

const hasNotch = computed(() => !!mockupDevice.value.frame.notch);
const hasCamera = computed(() => !!mockupDevice.value.frame.camera);
const hasButtons = computed(() => !!mockupDevice.value.frame.buttons && mockupDevice.value.frame.buttons.length > 0);
const showBrowserChrome = computed(() => !!mockupDevice.value.browser?.showChrome);
const showChromeTabs = computed(() => !!mockupDevice.value.browser?.chromeTabs);
const showAddressBar = computed(() => !!mockupDevice.value.browser?.addressBar);

const getDeviceStyle = computed(() => {
  const device = mockupDevice.value;
  const style: Record<string, string> = {
    width: props.orientation === 'portrait' ? `${device.width}px` : `${device.height}px`,
    height: props.orientation === 'portrait' ? `${device.height}px` : `${device.width}px`,
    borderRadius: device.frame.borderRadius,
    backgroundColor: device.frame.color,
    boxShadow: device.frame.shadow,
  };

  // Gérer les bordures spécifiquement pour chaque type d'appareil
  if (device.frame.type !== 'laptop' && device.frame.type !== 'desktop') {
    style.padding = device.frame.bezelWidth;
  }

  return style;
});

const getScreenStyle = computed(() => {
  const device = mockupDevice.value;
  const borderRadius = `${parseInt(device.frame.borderRadius) / 2}px`;
  return {
    borderRadius,
    height: device.frame.type === 'laptop' || device.frame.type === 'desktop' ? 'calc(100% - 10px)' : '100%'
  };
});

const getNotchStyle = computed(() => {
  const notch = mockupDevice.value.frame.notch;
  if (!notch) return {};

  return {
    width: notch.width,
    height: notch.height,
    backgroundColor: mockupDevice.value.frame.bezelColor,
    borderRadius: notch.borderRadius
  };
});

const getCameraStyle = computed(() => {
  const camera = mockupDevice.value.frame.camera;
  if (!camera) return {};

  return {
    width: camera.diameter,
    height: camera.diameter,
    backgroundColor: camera.color
  };
});

const getButtonStyle = (button: any) => {
  const positionStyle: Record<string, string> = {};

  if (button.position === 'left' || button.position === 'right') {
    positionStyle.top = button.offset;
  } else {
    positionStyle.left = button.offset;
  }

  return {
    ...positionStyle,
    width: button.width,
    height: button.height,
    backgroundColor: button.color
  };
};

const getBrowserStyle = computed(() => {
  const browser = mockupDevice.value.browser;
  if (!browser) return {};

  return {
    backgroundColor: browser.theme === 'dark' ? '#323232' : '#ffffff',
    borderRadius: mockupDevice.value.frame.type === 'browser' || mockupDevice.value.frame.type === 'desktop' ? '8px 8px 0 0' : '0'
  };
});

const getTabsStyle = computed(() => {
  const browser = mockupDevice.value.browser;
  if (!browser) return {};

  return {
    borderBottom: `1px solid ${browser.theme === 'dark' ? '#3a3a3a' : '#e0e0e0'}`
  };
});

const getAddressBarStyle = computed(() => {
  const browser = mockupDevice.value.browser;
  if (!browser) return {};

  return {
    backgroundColor: browser.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'
  };
});

const getHostname = computed(() => {
  if (!props.url) return 'Current Page';
  try {
    // Use global URL constructor safely
    return new URL(props.url).hostname;
  } catch (e) {
    return props.url;
  }
});

const adjustForOrientation = () => {
  if (!mockupContainerRef.value) return;

  if (props.orientation === 'landscape') {
    mockupContainerRef.value.classList.add('landscape');
  } else {
    mockupContainerRef.value.classList.remove('landscape');
  }
};

onMounted(() => {
  adjustForOrientation();
});

watch(() => props.orientation, () => {
  adjustForOrientation();
});

watch(() => props.deviceId, () => {
  // Force refresh when device changes
  nextTick(() => {
    adjustForOrientation();
  });
}, { immediate: true });
</script>

<style scoped>
.device-mockup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
  transition: all 0.3s ease;
  position: relative;
}

.device-frame {
  position: relative;
  overflow: visible;
  margin: 0 auto;
  transition: all 0.3s ease;
  transform-origin: center;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.device-mockup-container.landscape .device-frame {
  transform: rotate(90deg);
}

.device-screen {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: white;
}

.device-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.device-camera {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  z-index: 2;
}

.device-button {
  position: absolute;
  border-radius: 4px;
  z-index: 2;
}

.device-button-left {
  left: 0;
  transform: translateX(-50%);
}

.device-button-right {
  right: 0;
  transform: translateX(50%);
}

.device-button-top {
  top: 0;
  transform: translateY(-50%);
}

.device-button-bottom {
  bottom: 0;
  transform: translateY(50%);
}

.browser-chrome {
  width: 100%;
  overflow: hidden;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.browser-tabs {
  height: 36px;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.browser-tab {
  height: 28px;
  border-radius: 8px 8px 0 0;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-right: 4px;
  font-size: 12px;
  color: #424242;
  position: relative;
  cursor: default;
  user-select: none;
}

.browser-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--v-primary-base, #1976d2);
}

.tab-favicon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
  display: inline-block;
}

.browser-address-bar {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.browser-controls {
  display: flex;
  margin-right: 8px;
}

.browser-action {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.browser-action.close {
  background-color: #ff5f57;
}

.browser-action.minimize {
  background-color: #ffbd2e;
}

.browser-action.expand {
  background-color: #28c940;
}

.browser-url-field {
  flex: 1;
  height: 28px;
  border-radius: 14px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 12px;
  color: #424242;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.url-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-right: 6px;
  display: inline-block;
}

.device-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0),
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

/* Dark theme overrides */
:deep(.dark-theme) .browser-chrome {
  background-color: #323232;
}

:deep(.dark-theme) .browser-tab {
  background-color: #424242;
  color: #e0e0e0;
}

:deep(.dark-theme) .browser-address-bar {
  background-color: #2a2a2a;
}

:deep(.dark-theme) .browser-url-field {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

:deep(.dark-theme) .url-icon {
  background-color: #5f5f5f;
}

/* Styles spécifiques par dispositif */
.device-iphone {
  background: linear-gradient(to bottom, #e2e2e2, #d5d5d5);
  padding: 12px;
}

.device-android {
  background: linear-gradient(to bottom, #252525, #1a1a1a);
  padding: 6px;
}

.device-tablet {
  background: linear-gradient(to bottom, #333333, #232323);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05);
  padding: 12px;
}

.device-ipad {
  background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.device-laptop {
  background: linear-gradient(to bottom, #b0b0b0, #909090);
  position: relative;
  border-top: 10px solid #a1a1a1;
  border-left: 10px solid #a1a1a1;
  border-right: 10px solid #a1a1a1;
  border-bottom: 40px solid #a1a1a1;
  border-radius: 10px 10px 0 0;
}

.device-laptop::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -15%;
  right: -15%;
  height: 10px;
  background: #909090;
  border-radius: 0 0 50% 50%;
  z-index: -1;
}

.device-desktop {
  background: #000;
  border: 15px solid #2b2b2b;
  border-bottom: 35px solid #2b2b2b;
  border-radius: 10px;
}

.device-desktop::after {
  content: '';
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 10px;
  background: #1d1d1d;
  border-radius: 0 0 5px 5px;
  z-index: -1;
}

/* Ajustements pour le mode paysage */
.device-mockup-container.landscape {
  transform-origin: center;
}

.device-mockup-container.landscape .device-frame {
  transform-origin: center;
}

/* Assurer que le contenu est visible */
.device-content :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  display: block !important;
}
</style>