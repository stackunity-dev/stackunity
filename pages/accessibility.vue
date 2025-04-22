<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="mb-8 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pa-4 bg-secondary text-white">
            <v-icon size="large" class="mr-2">mdi-contrast-circle</v-icon>
            Contrast Checker
          </v-card-title>
          <v-card-text class="pa-4">

            <v-row>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="textColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateTextColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="textColor" label="Text color" variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-format-color-text" hint="Supports hex, rgb, hsl or color names"
                      persistent-hint @update:model-value="textColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-color-picker v-model="backgroundColorPicker" mode="hexa" hide-canvas elevation="4"
                      @update:model-value="updateBackgroundColor" class="mb-4"></v-color-picker>
                    <v-text-field v-model="backgroundColor" label="Background color" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-color-fill"
                      hint="Supports hex, rgb, hsl or color names" persistent-hint
                      @update:model-value="backgroundColorFromField"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-btn @click="getContrast" color="primary" prepend-icon="mdi-calculator" class="mb-4">
                      Calculate contrast
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-card :style="`background-color: ${backgroundColor}`" class="pa-4 rounded-lg h-100" elevation="1">
                  <v-card-title :style="`color: ${textColor}`" class="text-center">
                    Contrast Preview
                  </v-card-title>
                  <v-card-text :style="`color: ${textColor}`" class="text-center">
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Normal Text (16px)</p>
                      <p class="text-body-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Large Text (18px+)</p>
                      <p class="text-h6">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Bold Text</p>
                      <p class="text-body-1 font-weight-bold">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div class="mb-4">
                      <p class="text-body-1 mb-2">Italic Text</p>
                      <p class="text-body-1 font-italic">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div>
                      <p class="text-body-1 mb-2">Link Example</p>
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
                    <div class="text-h4 font-weight-bold mb-2">Contrast Ratio: {{ Math.round(contrast * 100) / 100 }}:1
                    </div>
                    <v-chip :color="contrast < 4.5 ? 'error' : contrast < 7 ? 'warning' : 'success'" class="mb-2">
                      {{ contrast < 4.5 ? 'Insufficient Contrast' : contrast < 7 ? 'Acceptable Contrast'
                        : 'Excellent Contrast' }} </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 4.5 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 4.5 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 4.5 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>Normal Text (min. 4.5:1)</span>
                          </div>
                        </v-card>
                      </v-col>
                      <v-col cols="6">
                        <v-card variant="outlined" :color="contrast < 3 ? 'error' : 'success'" class="pa-2">
                          <div class="d-flex align-center justify-center">
                            <v-icon :color="contrast < 3 ? 'error' : 'success'" class="mr-2">
                              {{ contrast < 3 ? 'mdi-close-circle' : 'mdi-check-circle' }} </v-icon>
                                <span>Large Text (min. 3:1)</span>
                          </div>
                        </v-card>
                      </v-col>
                    </v-row>
                    <div class="mt-4 text-center">
                      <p class="text-body-1">
                        {{ contrast < 4.5
                          ? 'The contrast is insufficient for good readability. Try more contrasting colors.'
                          : 'Congratulations! Your colors meet contrast standards for an accessible site.' }} </p>
                    </div>
                    <div class="mt-4">
                      <v-list density="compact">
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>WCAG 2.1 AA Standard</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>Normal Text (min. 4.5:1): </span>
                            <v-icon size="small" color="success" v-if="contrast >= 4.5">mdi-check</v-icon>
                            <v-icon size="small" color="error" v-else>mdi-close</v-icon>
                          </v-list-item-subtitle>
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-information">
                          <v-list-item-title>WCAG 2.1 AAA Standard</v-list-item-title>
                          <v-list-item-subtitle>
                            <span>Normal Text (min. 7:1): </span>
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
            Visual Impairment Simulator
          </v-card-title>
          <v-card-text class="pa-4" :class="{ 'iframe-parent-fullscreen': isFullscreen }">
            <v-row>
              <v-col cols="12" md="4" :class="{ 'd-none': isFullscreen }">
                <v-text-field v-model="urlToSimulate" label="URL of the site to simulate" variant="outlined"
                  density="comfortable" prepend-inner-icon="mdi-web" hint="Enter the complete URL (https://...)"
                  persistent-hint @keyup.enter="loadUrl">
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

                <v-select v-model="selectedVisionType" :items="availableVisionTypes" label="Type of visual impairment"
                  variant="outlined" density="comfortable" class="mt-4" item-title="title" item-value="value"
                  @update:model-value="applyVisionFilter">
                  <template v-slot:prepend-inner>
                    <v-icon :icon="visionTypes.find(t => t.value === selectedVisionType)?.icon || 'mdi-eye'"></v-icon>
                  </template>
                </v-select>

                <v-alert v-if="!userStore.isPremium && selectedVisionType !== 'normal'" color="info" variant="tonal"
                  class="mt-4">
                  <template v-slot:prepend>
                    <v-icon>mdi-information</v-icon>
                  </template>
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-subtitle-1 mb-1">Limited access</div>
                      <p class="mb-0">Upgrade to the premium version to access all types of visual impairments.</p>
                    </div>
                    <v-btn color="primary" variant="tonal" size="small" to="/checkout">Upgrade</v-btn>
                  </div>
                </v-alert>

                <v-slider v-if="selectedVisionType !== 'normal'" v-model="filterIntensity" :min="0" :max="100" :step="1"
                  label="Intensity of the filter" thumb-label class="mt-4"
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
                      <div class="text-h6 text-grey ml-2">Chargement en cours...</div>
                    </div>
                    <div v-else class="d-flex align-center justify-center" style="height: 100%; background: #f5f5f5;">
                      <v-icon size="64" color="grey">mdi-web</v-icon>
                      <div class="text-h6 text-grey ml-2">Entrez une URL pour commencer</div>
                    </div>
                  </div>
                </div>

                <div :class="{ 'fullscreen-controls': isFullscreen }">
                  <v-btn v-if="isFullscreen" icon variant="tonal" color="primary" @click="toggleFullscreen"
                    title="Exit fullscreen">
                    <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
                  </v-btn>
                  <v-btn v-if="isFullscreen" icon variant="tonal" class="ml-2" color="primary" @click="reloadIframe"
                    title="Refresh page">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>

                  <v-menu v-if="isFullscreen" offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn icon variant="tonal" color="primary" v-bind="props" class="ml-2" title="Vision type">
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

                      <v-divider v-if="!userStore.isPremium"></v-divider>

                      <v-list-item v-if="!userStore.isPremium" density="comfortable">
                        <template v-slot:prepend>
                          <v-icon color="warning">mdi-lock</v-icon>
                        </template>
                        <v-list-item-title>Other types (Premium)</v-list-item-title>
                        <template v-slot:append>
                          <v-btn size="small" variant="tonal" color="primary" to="/pricing">Upgrade</v-btn>
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
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../stores/userStore';

// @ts-ignore
import { definePageMeta, useHead } from '#imports';

const userStore = useUserStore();

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Accessibility - StackUnity',
  meta: [
    { name: 'description', content: 'Accessibility tools for web developers' },
    { name: 'keywords', content: 'accessibility, web accessibility, web accessibility tools, accessibility testing, web accessibility testing, accessibility guidelines, web accessibility guidelines, accessibility best practices, web accessibility best practices' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Accessibility - StackUnity' },
    { name: 'og:description', content: 'Accessibility tools for web developers' },
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
const isPremium = ref(userStore.user?.isPremium || false);

const urlToSimulate = ref('');
const finalUrl = ref('');
const selectedVisionType = ref('normal');
const previewFrame = ref(null);
const filterIntensity = ref(100);
const typingTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const iframeLoading = ref(false);

const visionTypes = [
  {
    title: 'Normal vision',
    value: 'normal',
    icon: 'mdi-eye'
  },
  {
    title: 'Protanopia (Red-Green)',
    value: 'protanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Deuteranopia (Red-Green)',
    value: 'deuteranopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Tritanopia (Blue-Yellow)',
    value: 'tritanopia',
    icon: 'mdi-eye-minus'
  },
  {
    title: 'Achromatopsia (Black and White)',
    value: 'achromatopsia',
    icon: 'mdi-eye-off'
  },
  {
    title: 'Blur',
    value: 'blur',
    icon: 'mdi-blur'
  }
];

const availableVisionTypes = computed(() => {
  if (userStore.isPremium) {
    return visionTypes;
  } else {
    return visionTypes.filter(type => ['normal', 'protanopia'].includes(type.value));
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
    isPremium.value = userStore.user.isPremium || false;
  } else {
    isPremium.value = false;
  }
});

watch(() => selectedVisionType.value, (newType) => {
  if (!userStore.isPremium && !['normal', 'protanopia'].includes(newType)) {
    selectedVisionType.value = 'protanopia';
    alert('This simulation is only available for premium users. Upgrade to the premium version to access all types of visual impairments.');
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
  const srgbText = extractRGB(textColor.value);
  const srgbBackground = extractRGB(backgroundColor.value);

  if (srgbText && srgbBackground) {
    const contrastRatio = calculateContrastRatio(srgbText, srgbBackground);
    contrast.value = contrastRatio;
  }
}

function extractRGB(color: string) {
  const trimmed = color.trim();

  if (trimmed.startsWith('#')) {
    let hex = trimmed.substring(1);


    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }

    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      return { red: r, green: g, blue: b };
    }
  }

  const rgbMatch = trimmed.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (rgbMatch) {
    return {
      red: parseInt(rgbMatch[1], 10) / 255,
      green: parseInt(rgbMatch[2], 10) / 255,
      blue: parseInt(rgbMatch[3], 10) / 255
    };
  }

  const hslMatch = trimmed.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*[\d.]+)?\s*\)/i);
  if (hslMatch) {
    return hslToRgb(
      parseInt(hslMatch[1], 10) / 360,
      parseInt(hslMatch[2], 10) / 100,
      parseInt(hslMatch[3], 10) / 100
    );
  }

  if (typeof document !== 'undefined') {
    const tempEl = document.createElement('div');
    tempEl.style.color = trimmed;
    document.body.appendChild(tempEl);
    const computedColor = getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);

    const match = computedColor.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\s*\)/i);
    if (match) {
      return {
        red: parseInt(match[1], 10) / 255,
        green: parseInt(match[2], 10) / 255,
        blue: parseInt(match[3], 10) / 255
      };
    }
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number) {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    red: Math.min(1, Math.max(0, r)),
    green: Math.min(1, Math.max(0, g)),
    blue: Math.min(1, Math.max(0, b))
  };
}

function calculateLuminance(srgb: { red: number, green: number, blue: number }) {
  const r = Math.min(1, Math.max(0, srgb.red));
  const g = Math.min(1, Math.max(0, srgb.green));
  const b = Math.min(1, Math.max(0, srgb.blue));

  const transform = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

  const R = transform(r);
  const G = transform(g);
  const B = transform(b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(srgbText: { red: number, green: number, blue: number }, srgbBackground: { red: number, green: number, blue: number }) {
  const luminanceText = calculateLuminance(srgbText);
  const luminanceBackground = calculateLuminance(srgbBackground);
  const brighter = Math.max(luminanceText, luminanceBackground);
  const darker = Math.min(luminanceText, luminanceBackground);
  return (brighter + 0.05) / (darker + 0.05);
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
    alert('Please enter a valid URL');
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
</script>

<style scoped>
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