<template>
  <v-app>
    <main class="main-content">
      <v-container>
        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-secondary text-white">
            <v-icon size="large" class="mr-2">mdi-contrast-circle</v-icon>
            {{ t().contrastChecker.title }}
          </v-card-title>
          <v-card-text class="pa-4">

            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="textColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateTextColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="textColor" :label="t().contrastChecker.textColor" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-color-text"
                      :hint="t().contrastChecker.colorHint" persistent-hint
                      @update:model-value="textColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="backgroundColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateBackgroundColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="backgroundColor" :label="t().contrastChecker.backgroundColor"
                      variant="outlined" density="comfortable" prepend-inner-icon="mdi-format-color-fill"
                      :hint="t().contrastChecker.colorHint" persistent-hint
                      @update:model-value="backgroundColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-btn @click="getContrast" color="primary" prepend-icon="mdi-calculator" class="mb-4">
                      {{ t().contrastChecker.calculateButton }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-card :style="`background-color: ${backgroundColor}`" class="pa-4 rounded-lg h-100" elevation="1">
                  <v-card-title :style="`color: ${textColor}`" class="text-center">
                    {{ t().contrastChecker.preview.title }}
                  </v-card-title>
                  <v-card-text :style="`color: ${textColor}`" class="text-center">
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">{{ t().contrastChecker.preview.normalText }}</p>
                      <p class="text-body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">{{ t().contrastChecker.preview.largeText }}</p>
                      <p class="text-h6">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">{{ t().contrastChecker.preview.boldText }}</p>
                      <p class="text-body-1 font-weight-bold">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">{{ t().contrastChecker.preview.italicText }}</p>
                      <p class="text-body-1 font-italic">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div>
                      <p class="text-body-1 mb-2">{{ t().contrastChecker.preview.linkExample }}</p>
                      <a :style="`color: ${textColor}`" href="/accessibility" class="text-decoration-underline">Lorem
                        ipsum
                        dolor</a>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-divider class="my-4" v-if="contrast > 0"></v-divider>

            <v-row v-if="contrast > 0">
              <v-col cols="12" md="6" class="mx-auto">
                <v-card class="pa-4 rounded-lg" elevation="3">
                  <v-card-title class="text-center">
                    <div class="text-h4 font-weight-bold mb-2">{{ t().contrastChecker.results.contrastRatio }}: {{
                      Math.round(contrast * 100) / 100 }}:1
                    </div>
                    <v-chip :color="contrast < 4.5 ? 'error' : contrast < 7 ? 'warning' : 'success'" class="mb-2">
                      {{ contrast < 4.5 ? t().contrastChecker.results.insufficientContrast : contrast < 7 ?
                        t().contrastChecker.results.acceptableContrast : t().contrastChecker.results.excellentContrast
                      }} </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 4.5 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 4.5 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 4.5 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>{{ t().contrastChecker.results.normalTextRequirement }}</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 3 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 3 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 3 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>{{ t().contrastChecker.results.largeTextRequirement }}</span>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                      <p class="text-body-1">
                        {{ contrast < 4.5 ? t().contrastChecker.results.insufficientMessage :
                          t().contrastChecker.results.successMessage }} </p>
                    </div>
                    <div class="mt-4">
                      <v-list density="compact">
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>{{ t().contrastChecker.results.wcagAA }}</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>{{ t().contrastChecker.results.normalTextRequirement }}: </span>
                            <v-icon size="small" color="success" v-if="contrast >= 4.5">mdi-check</v-icon>
                            <v-icon size="small" color="error" v-else>mdi-close</v-icon>
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>{{ t().contrastChecker.results.wcagAAA }}</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>{{ t().contrastChecker.results.normalTextRequirement }}: </span>
                            <v-icon size="small" color="success" v-if="contrast >= 7">mdi-check</v-icon>
                            <v-icon size="small" color="error" v-else>mdi-close</v-icon>
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mt-8 mb-8 rounded-lg" elevation="3" ref="parentCard">
          <v-card-title class="text-h6 pa-4 bg-secondary text-white">
            <v-icon size="large" class="mr-2">mdi-eye</v-icon>
            {{ t().visionSimulator.title }}
          </v-card-title>
          <v-card-text class="pa-4" :class="{ 'iframe-parent-fullscreen': isFullscreen }">
            <v-row>
              <v-col cols="12" md="4" :class="{ 'd-none': isFullscreen }">
                <v-text-field v-model="urlToSimulate" :label="t().visionSimulator.urlLabel" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-web" :hint="t().visionSimulator.urlHint" persistent-hint
                  @keyup.enter="loadUrl">
                  <template v-slot:append>
                    <v-btn variant="tonal" size="small" color="secondary" @click="loadUrl" class="mr-2"
                      :disabled="!urlToSimulate">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn variant="tonal" color="primary" size="small" :disabled="!finalUrl" @click="toggleFullscreen"
                      title="Maximize view">
                      <v-icon>mdi-fullscreen</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>

                <v-select v-model="selectedVisionType" :items="availableVisionTypes"
                  :label="t().visionSimulator.visionTypeLabel" variant="outlined" density="comfortable" class="mt-4"
                  item-title="title" item-value="value" @update:model-value="applyVisionFilter">
                  <template v-slot:prepend-inner>
                    <v-icon :icon="visionTypes.find(t => t.value === selectedVisionType)?.icon || 'mdi-eye'"></v-icon>
                  </template>
                </v-select>

                <v-alert v-if="!userStore.isStandard && selectedVisionType !== 'normal'" color="info" variant="tonal"
                  class="mt-4">
                  <template v-slot:prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-subtitle-1 mb-1">{{ t().visionSimulator.limitedAccess.title }}</div>
                      <p class="mb-0">{{ t().visionSimulator.limitedAccess.description }}</p>
                    </div>
                    <v-btn color="primary" variant="tonal" size="small" @click="goToPricingPage">
                      {{ t().visionSimulator.limitedAccess.upgradeButton }}
                    </v-btn>
                  </div>
                </v-alert>

                <v-slider v-if="selectedVisionType !== 'normal'" v-model="filterIntensity" :min="0" :max="100" :step="1"
                  :label="t().visionSimulator.intensityLabel" thumb-label class="mt-4"
                  @update:model-value="applyVisionFilter"></v-slider>
              </v-col>

              <v-col :cols="isFullscreen ? '12' : '12 md-8'">
                <div class="iframe-container" ref="iframeContainer" :class="{ 'fullscreen-mode': isFullscreen }"
                  style="position: relative; height: 600px; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;">
                  <div :style="filterStyle" style="height: 100%;">
                    <iframe v-if="finalUrl" :src="finalUrl" style="width: 100%; height: 100%; border: none;"
                      ref="previewFrame" @load="iframeLoading = false"></iframe>
                    <div v-else-if="iframeLoading" class="d-flex align-center justify-center"
                      style="height: 100%; background: #f5f5f5;">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      <div class="text-h6 text-grey ml-2">{{ t().visionSimulator.loading }}</div>
                    </div>
                    <div v-else class="d-flex align-center justify-center" style="height: 100%; background: #f5f5f5;">
                      <v-icon size="64" color="grey">mdi-web</v-icon>
                      <div class="text-h6 text-grey ml-2">{{ t().visionSimulator.enterUrl }}</div>
                    </div>
                  </div>
                </div>

                <div :class="{ 'fullscreen-controls': isFullscreen }">
                  <v-btn v-if="isFullscreen" icon variant="tonal" color="primary" @click="toggleFullscreen"
                    :title="t().visionSimulator.fullscreenControls.exitFullscreen">
                    <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
                  </v-btn>
                  <v-btn v-if="isFullscreen" icon variant="tonal" class="ml-2" color="primary" @click="reloadIframe"
                    :title="t().visionSimulator.fullscreenControls.refreshPage">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>

                  <v-menu v-if="isFullscreen" offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn icon variant="tonal" color="primary" v-bind="props" class="ml-2"
                        :title="t().visionSimulator.fullscreenControls.visionType">
                        <v-icon>{{visionTypes.find(t => t.value === selectedVisionType)?.icon || 'mdi-eye'}}</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="type in availableVisionTypes" :key="type.value"
                        @click="selectedVisionType = type.value; applyVisionFilter()">
                        <template v-slot:prepend>
                          <v-icon :icon="type.icon"></v-icon>
                        </template>
                        <v-list-item-title>{{ type.title }}</v-list-item-title>
                      </v-list-item>

                      <v-divider v-if="!userStore.isStandard"></v-divider>

                      <v-list-item v-if="!userStore.isStandard" density="comfortable">
                        <template v-slot:prepend>
                          <v-icon color="warning">mdi-lock</v-icon>
                        </template>
                        <v-list-item-title>{{ t().visionSimulator.fullscreenControls.otherTypes }}</v-list-item-title>
                        <template v-slot:append>
                          <v-btn size="small" variant="tonal" color="primary" @click="goToPricingPage">
                            {{ t().visionSimulator.limitedAccess.upgradeButton }}
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-menu>

                  <v-slider v-if="isFullscreen && selectedVisionType !== 'normal'" v-model="filterIntensity" :min="0"
                    :max="100" :step="1" hide-details class="fullscreen-slider ml-2" density="compact" color="primary"
                    thumb-color="primary" thumb-label @update:model-value="applyVisionFilter">
                  </v-slider>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import {
  calculateContrastRatio,
  parseColor
} from '../utils/accessibility/contrast';
import { useTranslations } from '../languages';

const userStore = useUserStore();
const router = useRouter();
const t = useTranslations('accessibility');

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { name: 'keywords', content: 'accessibility, web accessibility, web accessibility tools, accessibility testing, web accessibility testing, accessibility guidelines, web accessibility guidelines, accessibility best practices, web accessibility best practices' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: t().meta.title },
    { name: 'og:description', content: t().meta.description },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/accessibility' }
  ]
});

const textColor = ref('rgb(33, 33, 33)');
const backgroundColor = ref('rgb(255, 255, 255)');
const contrast = ref(0);

const textColorPicker = ref('#212121');
const backgroundColorPicker = ref('#FFFFFF');
const isStandard = ref(userStore.user?.isStandard || false);

const urlToSimulate = ref('');
const finalUrl = ref('');
const selectedVisionType = ref('normal');
const previewFrame = ref(null);
const filterIntensity = ref(100);
const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const iframeLoading = ref(false);

const visionTypes = computed(() => [
  {
    title: t().visionSimulator.visionTypes.normal,
    value: 'normal',
    icon: 'mdi-eye'
  },
  {
    title: t().visionSimulator.visionTypes.protanopia,
    value: 'protanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: t().visionSimulator.visionTypes.deuteranopia,
    value: 'deuteranopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: t().visionSimulator.visionTypes.tritanopia,
    value: 'tritanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: t().visionSimulator.visionTypes.achromatopsia,
    value: 'achromatopsia',
    icon: 'mdi-eye-off'
  },
  {
    title: t().visionSimulator.visionTypes.blur,
    value: 'blur',
    icon: 'mdi-blur'
  }
]);

const availableVisionTypes = computed(() => {
  if (userStore.isStandard) {
    return visionTypes.value;
  } else {
    return visionTypes.value.filter(type => ['normal', 'protanopia'].includes(type.value));
  }
});

const filterStyle = computed(() => {
  const intensity = filterIntensity.value / 100;

  switch (selectedVisionType.value) {
    case 'protanopia': {
      const matrix = [
        0.367 + (1 - 0.367) * (1 - intensity), 0.633 * intensity, 0, 0, 0,
        0.333 * intensity, 0.667 + (1 - 0.667) * (1 - intensity), 0, 0, 0,
        0, 0.121 * intensity, 0.879 + (1 - 0.879) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1.1) contrast(0.95) saturate(0.9) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'deuteranopia': {
      const matrix = [
        0.625 + (1 - 0.625) * (1 - intensity), 0.375 * intensity, 0, 0, 0,
        0.7 * intensity, 0.3 + (1 - 0.3) * (1 - intensity), 0, 0, 0,
        0, 0.3 * intensity, 0.7 + (1 - 0.7) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1.05) contrast(0.97) saturate(0.95) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'tritanopia': {
      const matrix = [
        0.95 + (1 - 0.95) * (1 - intensity), 0.05 * intensity, 0, 0, 0,
        0, 0.433 + (1 - 0.433) * (1 - intensity), 0.567 * intensity, 0, 0,
        0, 0.475 * intensity, 0.525 + (1 - 0.525) * (1 - intensity), 0, 0,
        0, 0, 0, 1, 0
      ].join(' ');
      return {
        filter: `brightness(1) contrast(1.1) saturate(0.8) url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f"><feColorMatrix type="matrix" values="${matrix}"/></filter></svg>#f')`
      };
    }
    case 'achromatopsia':
      return {
        filter: `grayscale(${intensity * 100}%)`
      };
    case 'blur':
      return {
        filter: `blur(${intensity * 3}px)`
      };
    default:
      return {};
  }
});

watch(() => userStore.isAuthenticated, () => {
  if (userStore.user) {
    isStandard.value = userStore.user.isStandard || false;
  } else {
    isStandard.value = false;
  }
});

watch(() => selectedVisionType.value, (newType) => {
  if (!userStore.isStandard && !['normal', 'protanopia'].includes(newType)) {
    selectedVisionType.value = 'protanopia';
    alert(t().visionSimulator.alerts.accessAlert);
  }
});

watch(() => urlToSimulate.value, (newValue) => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value);
  }

  if (!newValue) {
    finalUrl.value = '';
    return;
  }

  typingTimer.value = setTimeout(() => {
    try {
      let url = newValue;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      new URL(url);
    } catch (e) {
      console.error('URL invalide:', e);
    }
  }, 300);
});

const updateTextColor = (color: any) => {
  if (color && typeof color === 'string' && color.startsWith('#') && (color.length === 7 || color.length === 9)) {
    textColor.value = color;
    getContrast();
  } else if (color && color.hasOwnProperty('h') && color.hasOwnProperty('a')) {
    const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    textColor.value = rgba;
    getContrast();
  }
};

const updateBackgroundColor = (color: any) => {
  if (color && typeof color === 'string' && color.startsWith('#') && (color.length === 7 || color.length === 9)) {
    backgroundColor.value = color;
    getContrast();
  } else if (color && color.hasOwnProperty('h') && color.hasOwnProperty('a')) {
    const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    backgroundColor.value = rgba;
    getContrast();
  }
};

const textColorFromField = (value: string) => {
  const hexValue = convertToHex(value);
  if (hexValue && hexValue.length >= 4) {
    textColorPicker.value = hexValue;
  }
  getContrast();
};

const backgroundColorFromField = (value: string) => {
  const hexValue = convertToHex(value);
  if (hexValue && hexValue.length >= 4) {
    backgroundColorPicker.value = hexValue;
  }
  getContrast();
};

const convertToHex = (colorStr: string): string => {
  if (!colorStr || colorStr === '#') {
    return '#000000';
  }

  if (colorStr.startsWith('#')) {
    if (colorStr.length === 4 || colorStr.length === 7) {
      if (colorStr.length === 4) {
        return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`;
      }
      return colorStr;
    } else {
      return '#000000';
    }
  }

  if (typeof document !== 'undefined') {
    const tempDiv = document.createElement('div');
    tempDiv.style.color = colorStr;
    document.body.appendChild(tempDiv);
    const computedColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const rgbMatch = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }

  return colorStr;
};

const getContrast = async () => {
  const srgbText = parseColor(textColor.value);
  const srgbBackground = parseColor(backgroundColor.value);

  if (srgbText && srgbBackground) {
    const contrastRatio = calculateContrastRatio(srgbText, srgbBackground);
    contrast.value = contrastRatio;
  }
}

function extractRGB(color: string) {
  return parseColor(color);
}

function loadUrl() {
  if (!urlToSimulate.value) return;

  try {
    let url = urlToSimulate.value;
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
      urlToSimulate.value = url;
    }

    new URL(url);

    iframeLoading.value = true;

    finalUrl.value = url;

    if (isFullscreen.value && selectedVisionType.value !== 'normal') {
      selectedVisionType.value = 'normal';
    }
  } catch (e) {
    alert(t().visionSimulator.alerts.invalidUrl);
    urlToSimulate.value = '';
    finalUrl.value = '';
  }
}

const applyVisionFilter = () => {
};

const isFullscreen = ref(false);
const iframeContainer = ref(null);

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  if (isFullscreen.value) {
    document.addEventListener('keydown', handleEscapeKey);
  } else {
    document.removeEventListener('keydown', handleEscapeKey);
  }
};

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen();
  }
};

const reloadIframe = () => {
  if (previewFrame.value && finalUrl.value) {
    const iframe = previewFrame.value as HTMLIFrameElement;
    const currentSrc = iframe.src;

    iframeLoading.value = true;

    iframe.src = '';
    setTimeout(() => {
      iframe.src = currentSrc;
    }, 50);
  }
}

const goToPricingPage = () => {
  router.push('/#pricing').then(() => {
    setTimeout(() => {
      const element = document.getElementById('pricing');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  });
};
</script>

<style scoped>
main {
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

.v-color-picker {
  max-width: 100%;
  margin: 0 auto;
}

.clickable {
  cursor: pointer;
}

.iframe-container {
  transition: all 0.3s ease;
}

.fullscreen-mode {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: white;
}

.fullscreen-controls {
  position: absolute;
  top: 2px;
  right: 10px;
  background-color: rgba(var(--v-theme-surface), 0.5);
  padding: 5px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 101;
}

.fullscreen-slider {
  width: 150px;
  margin-top: 0;
}

.iframe-parent-fullscreen {
  min-height: 80vh;
}
</style>