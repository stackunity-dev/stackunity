<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Technical analysis</h3>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-speedometer</v-icon>
            Performance
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title class="text-wrap">Loading Time</v-list-item-title>
                <v-list-item-subtitle class="text-wrap">
                  {{ ((result?.loadTime ?? 0) / 1000).toFixed(2) }}s
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="text-wrap">First Contentful Paint (FCP)</v-list-item-title>
                <v-list-item-subtitle class="text-wrap d-flex align-center">
                  {{ ((result?.coreWebVitals?.FCP ?? 0) / 1000).toFixed(2) }}s
                  <v-chip size="x-small" :color="getFCPColor(result?.coreWebVitals?.FCP ?? 0)" class="ml-2">
                    {{ getFCPRating(result?.coreWebVitals?.FCP ?? 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="text-wrap">Largest Contentful Paint (LCP)</v-list-item-title>
                <v-list-item-subtitle class="text-wrap d-flex align-center">
                  {{ ((result?.coreWebVitals?.LCP ?? 0) / 1000).toFixed(2) }}s
                  <v-chip size="x-small" :color="getLCPColor(result?.coreWebVitals?.LCP ?? 0)" class="ml-2">
                    {{ getLCPRating(result?.coreWebVitals?.LCP ?? 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="text-wrap">Cumulative Layout Shift (CLS)</v-list-item-title>
                <v-list-item-subtitle class="text-wrap d-flex align-center">
                  {{ (result?.coreWebVitals?.CLS ?? 0).toFixed(2) }}
                  <v-chip size="x-small" :color="getCLSColor(result?.coreWebVitals?.CLS ?? 0)" class="ml-2">
                    {{ getCLSRating(result?.coreWebVitals?.CLS ?? 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title class="text-wrap">Time to First Byte (TTFB)</v-list-item-title>
                <v-list-item-subtitle class="text-wrap d-flex align-center">
                  {{ ((result?.coreWebVitals?.TTFB ?? 0) / 1000).toFixed(2) }}s
                  <v-chip size="x-small" :color="getTTFBColor(result?.coreWebVitals?.TTFB ?? 0)" class="ml-2">
                    {{ getTTFBRating(result?.coreWebVitals?.TTFB ?? 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-code-tags</v-icon>
            Technical SEO
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <div class="pa-2">
                  <div class="subtitle-2 font-weight-bold mb-2">Sitemap</div>
                  <v-chip size="small" class="mb-2" :color="result?.technicalSEO?.sitemapFound ? 'success' : 'warning'">
                    {{ result?.technicalSEO?.sitemapFound ? 'Found' : 'Not found' }}
                  </v-chip>

                  <div v-if="result?.technicalSEO?.sitemapFound && result?.technicalSEO?.sitemapUrl"
                    class="mt-2 text-caption">
                    <a :href="result?.technicalSEO?.sitemapUrl" target="_blank" class="text-decoration-none">
                      {{ result?.technicalSEO?.sitemapUrl }}
                      <v-icon size="x-small">mdi-open-in-new</v-icon>
                    </a>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="pa-2">
                  <div class="subtitle-2 font-weight-bold mb-2">Robots.txt</div>
                  <v-chip size="small" class="mb-2"
                    :color="result?.technicalSEO?.robotsTxtFound ? 'success' : 'warning'">
                    {{ result?.technicalSEO?.robotsTxtFound ? 'Found' : 'Not found' }}
                  </v-chip>

                  <div v-if="result?.technicalSEO?.robotsTxtFound && result?.technicalSEO?.robotsTxtContent"
                    class="mt-2">
                    <v-btn size="x-small" variant="text" color="primary" class="pa-0" @click="showRobotsTxtDialog">
                      View content
                      <v-icon size="small" end>mdi-eye</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-2"></v-divider>

            <v-row no-gutters>
              <v-col cols="12">
                <div class="pa-2">
                  <div class="subtitle-2 font-weight-bold mb-2">Structured Data</div>
                  <v-chip size="small" class="mb-2" :color="result?.structuredData?.length ? 'success' : 'warning'">
                    {{ result?.structuredData?.length ? 'Found' : 'Not found' }}
                  </v-chip>

                  <div
                    v-if="result?.technicalSEO?.schemaTypeCount && Object.keys(result.technicalSEO.schemaTypeCount).length"
                    class="mt-2">
                    <div class="d-flex flex-wrap">
                      <v-chip v-for="(count, type) in result.technicalSEO.schemaTypeCount" :key="type" size="x-small"
                        color="info" class="ma-1">
                        {{ type }}: {{ count }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-chart-bar</v-icon>
            Technical Score
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center">
              <v-progress-circular :model-value="calculateTechnicalSeoScore(result)"
                :color="getScoreColor(calculateTechnicalSeoScore(result))" size="100" width="12">
                <span class="text-h6 font-weight-bold">{{ calculateTechnicalSeoScore(result) }}%</span>
              </v-progress-circular>
            </div>

            <v-list density="compact" class="mt-4">
              <v-list-item>
                <v-list-item-title>HTTPS</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.securityChecks?.https ? 'success' : 'error'" size="small" class="mr-1">
                    {{ result?.securityChecks?.https ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.securityChecks?.https ? 'Secured' : 'Not secured' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Mobile Friendly</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.mobileCompatibility?.hasViewport ? 'success' : 'error'" size="small"
                    class="mr-1">
                    {{ result?.mobileCompatibility?.hasViewport ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.mobileCompatibility?.hasViewport ? 'Yes' : 'No' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Core Web Vitals Pass</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="areCoreWebVitalsGood(result) ? 'success' : 'error'" size="small" class="mr-1">
                    {{ areCoreWebVitalsGood(result) ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ areCoreWebVitalsGood(result) ? 'Pass' : 'Fail' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-cellphone</v-icon>
            Mobile Compatibility
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Viewport Meta Tag</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon :color="result?.viewport ? 'success' : 'error'" size="small" class="mr-1">
                    {{ result?.viewport ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                  {{ result?.viewport ? 'Present' : 'Missing' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.viewport">
                <v-list-item-title>Viewport Content</v-list-item-title>
                <v-list-item-subtitle>
                  {{ result.viewport || 'width=device-width, initial-scale=1' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.mobileCompatibility?.smallTouchTargets">
                <v-list-item-title>Small Touch Targets</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <v-icon color="warning" size="small" class="mr-1">mdi-alert</v-icon>
                  {{ result.mobileCompatibility.smallTouchTargets }} elements with small touch targets
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="robotsTxtDialogOpen" max-width="800">
      <v-card>
        <v-card-title class="text-h6">
          robots.txt Content
          <v-spacer></v-spacer>
          <v-btn icon @click="robotsTxtDialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <pre class="robots-content pa-4 rounded-lg bg-grey-lighten-4"><code>{{ robotsTxtContent }}</code></pre>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getScoreColor } from '../../utils/seo/getScore';
import { calculateTechnicalSeoScore } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const robotsTxtDialogOpen = ref(false);
const robotsTxtContent = ref('');

const showRobotsTxtDialog = () => {
  if (props.result?.technicalSEO?.robotsTxtContent) {
    robotsTxtContent.value = props.result.technicalSEO.robotsTxtContent;
    robotsTxtDialogOpen.value = true;
  }
};

// Functions for Core Web Vitals ratings
const getFCPColor = (fcp: number): string => {
  if (fcp <= 1000) return 'success';
  if (fcp <= 3000) return 'warning';
  return 'error';
};

const getLCPColor = (lcp: number): string => {
  if (lcp <= 2500) return 'success';
  if (lcp <= 4000) return 'warning';
  return 'error';
};

const getCLSColor = (cls: number): string => {
  if (cls <= 0.1) return 'success';
  if (cls <= 0.25) return 'warning';
  return 'error';
};

const getTTFBColor = (ttfb: number): string => {
  if (ttfb <= 800) return 'success';
  if (ttfb <= 1800) return 'warning';
  return 'error';
};

const getFCPRating = (fcp: number): string => {
  if (fcp <= 1000) return 'Good';
  if (fcp <= 3000) return 'Needs Improvement';
  return 'Poor';
};

const getLCPRating = (lcp: number): string => {
  if (lcp <= 2500) return 'Good';
  if (lcp <= 4000) return 'Needs Improvement';
  return 'Poor';
};

const getCLSRating = (cls: number): string => {
  if (cls <= 0.1) return 'Good';
  if (cls <= 0.25) return 'Needs Improvement';
  return 'Poor';
};

const getTTFBRating = (ttfb: number): string => {
  if (ttfb <= 800) return 'Good';
  if (ttfb <= 1800) return 'Needs Improvement';
  return 'Poor';
};

const areCoreWebVitalsGood = (result: any): boolean => {
  if (!result || !result.coreWebVitals) return false;

  const { LCP, FCP, CLS, TTFB } = result.coreWebVitals;
  const lcpGood = LCP <= 2500;
  const clsGood = CLS <= 0.1;
  const fcpGood = FCP <= 1000;

  // Pass if at least 2 metrics are good
  return [lcpGood, clsGood, fcpGood].filter(Boolean).length >= 2;
};
</script>

<style scoped>
.robots-content {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  max-height: 400px;
  overflow-y: auto;
}
</style>