<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="mb-8 pa-4 rounded-lg" elevation="3">
          <v-card-title class="text-h6 pb-2">Analyze a website</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="9">
                <v-text-field v-model="url" label="Website URL to analyze" placeholder="https://example.com"
                  prepend-inner-icon="mdi-web" variant="outlined" density="comfortable" clearable
                  @keyup.enter="getAudit"></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center">
                <v-btn v-if="userStore.user.isPremium" @click="getAudit" color="primary" block :loading="loading"
                  prepend-icon="mdi-magnify">
                  Analyze
                </v-btn>
                <premium-feature type="button" title="Analyze" icon="mdi-magnify" feature-key="audit" v-else />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-skeleton-loader v-if="loading" type="card, article, actions" class="mb-6"></v-skeleton-loader>

        <template v-if="auditData && !loading">
          <v-card class="mb-6 pa-4 rounded-lg" elevation="3">
            <v-row>
              <v-col cols="12" md="8">
                <h2 class="text-h5 d-flex align-center mb-4">
                  <v-icon size="large" color="primary" class="mr-2">mdi-web</v-icon>
                  {{ auditData.statistics?.pagetitle || 'Analyzed Site' }}
                </h2>
                <p class="mb-2">
                  <strong>URL: </strong>
                  <a :href="auditData.statistics?.pageurl" target="_blank" class="text-decoration-none text-primary">
                    {{ auditData.statistics?.pageurl }}
                    <v-icon size="small">mdi-open-in-new</v-icon>
                  </a>
                </p>
                <v-chip class="mr-2 mb-2" color="success" size="small">
                  Analysis in {{ auditData.statistics?.time }}s
                </v-chip>
                <v-chip class="mb-2" color="info" size="small">
                  {{ auditData.statistics?.totalelements }} elements analyzed
                </v-chip>
              </v-col>
              <v-col cols="12" md="4" class="d-flex align-center justify-center">
                <v-btn variant="elevated" color="primary" :href="auditData.statistics?.waveurl" target="_blank"
                  prepend-icon="mdi-link-variant" append-icon="mdi-open-in-new" class="px-4">
                  View complete WAVE report
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <v-card class="mb-8 rounded-lg" elevation="3">
            <v-card-title class="text-h6 pa-4 bg-primary text-white">
              Analysis Results
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col v-for="(category, key) in auditData.categories" :key="key" cols="12" sm="6" md="4">
                  <v-card class="h-100" variant="outlined"
                    :color="category.description.toLowerCase().includes('error') ? 'error' :
                      ['feature', 'elements', 'aria'].some(word => category.description.toLowerCase().includes(word)) ? 'success' : 'warning'">
                    <v-card-text class="d-flex align-center">
                      <v-icon
                        :color="category.description.toLowerCase().includes('error') ? 'error' :
                          ['feature', 'elements', 'aria'].some(word => category.description.toLowerCase().includes(word)) ? 'success' : 'warning'"
                        class="mr-2">
                        {{ category.description.toLowerCase().includes('error') ? 'mdi-alert-circle' :
                          'mdi-check-circle' }}
                      </v-icon>
                      <div>
                        <div class="font-weight-medium">{{ category.description }}</div>
                        <div class="text-subtitle-2">{{ category.count }} elements</div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

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
                    <v-text-field v-model="textColor" label="Text color" placeholder="rgb(0, 0, 0)" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-format-color-text"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="backgroundColor" label="Background color" placeholder="rgb(255, 255, 255)"
                      variant="outlined" density="comfortable"
                      prepend-inner-icon="mdi-format-color-fill"></v-text-field>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center">
                    <v-btn @click="getContrast" color="primary" prepend-icon="mdi-calculator" class="mb-4">
                      Calculate contrast
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-card :color="backgroundColor" class="pa-4 rounded-lg h-100" elevation="1">
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
                      <a :style="`color: ${textColor}`" href="#" class="text-decoration-underline">Lorem ipsum dolor</a>
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
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import premiumFeatures from '../components/PremiumFeature.vue';

// @ts-ignore
import { useHead, definePageMeta } from '#imports';

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
  ]
});

onMounted(() => {
  console.log(userStore.token);
});

const url = ref('');
const loading = ref(false);

const auditData = ref<ResponseData | null>(null);
const textColor = ref('rgb(33, 33, 33)');
const backgroundColor = ref('rgb(255, 255, 255)');
const contrast = ref(0);

const getContrast = async () => {
  const srgbText = extractRGB(textColor.value);
  const srgbBackground = extractRGB(backgroundColor.value);
  console.log(srgbText, srgbBackground);

  if (srgbText && srgbBackground) {
    const contrastRatio = calculateContrastRatio(srgbText, srgbBackground);
    contrast.value = contrastRatio;
    console.log(contrastRatio);
  }
}

function extractRGB(rgb: string) {
  const trimmed = rgb.trim();

  if (trimmed.toLowerCase().startsWith("rgb(")) {
    const match = trimmed.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
      return {
        red: parseInt(match[1], 10) / 255,
        green: parseInt(match[2], 10) / 255,
        blue: parseInt(match[3], 10) / 255
      };
    }
  } else {
    const parts = trimmed.split(/\s+/);
    if (parts.length === 3) {
      return {
        red: parseInt(parts[0], 10) / 255,
        green: parseInt(parts[1], 10) / 255,
        blue: parseInt(parts[2], 10) / 255
      };
    }
  }

  return null;
}

function calculateLuminance(srgb: { red: number, green: number, blue: number }) {
  const transform = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);

  const R = transform(srgb.red);
  const G = transform(srgb.green);
  const B = transform(srgb.blue);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(srgbText: { red: number, green: number, blue: number }, srgbBackground: { red: number, green: number, blue: number }) {
  const luminanceText = calculateLuminance(srgbText);
  const luminanceBackground = calculateLuminance(srgbBackground);
  const brighter = Math.max(luminanceText, luminanceBackground);
  const darker = Math.min(luminanceText, luminanceBackground);
  return (brighter + 0.05) / (darker + 0.05);
}


interface Item {
  [key: string]: any;
}

interface Category {
  description: string;
  count: number;
  items: Item;
}

interface ResponseData {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    allitemcount: number;
    creditsremaining: number;
    pagetitle: string;
    pageurl: string;
    time: number;
    totalelements: number;
    waveurl: string;
  };
  categories: {
    error: Category;
    contrast: Category;
    alert: Category;
    feature: Category;
    structure: Category;
    aria: Category;
    [key: string]: Category;
  };
}

interface ApiResponse {
  data: ResponseData;
}


const getAudit = async () => {
  loading.value = true;
  console.log(url.value);
  const response = await $fetch<ApiResponse>('/api/audit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userStore.token}`
    },
    body: { url: url.value }
  });

  if (response) {
    auditData.value = response.data;
    console.log(auditData.value);
    loading.value = false;
  } else {
    console.error('Error retrieving audit data');
    loading.value = false;
  }
};

</script>