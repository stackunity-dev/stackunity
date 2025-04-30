<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-alert type="info" v-if="!websiteData" variant="tonal" class="mb-4">
          No website data available for this account. Please add a website to your account below.<br>
          <v-btn color="secondary" variant="elevated" density="comfortable" size="small" @click="goToSettings"
            aria-label="Add a website" class="mt-2">
            <span class="ml-1">Add website</span>
            <v-icon end>mdi-plus</v-icon>
          </v-btn>
        </v-alert>

        <v-fade-transition>
          <v-progress-linear v-if="loading" v-model="loadingProgress" color="secondary" height="9" striped rounded
            class="mb-4" :active="loading">
            <template v-slot:default="{ value }">
              <span class="text-caption text-grey-darken-1">{{ Math.ceil(value) }}%</span>
            </template>
          </v-progress-linear>
        </v-fade-transition>

        <v-card class="mb-4 rounded-lg elevation-2">
          <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
            <v-icon color="white" class="mr-2">mdi-web</v-icon>
            Website data
          </v-card-title>
          <v-card-text class="pa-4">
            <template v-if="!websiteData">
              <v-skeleton-loader type="article" class="mb-4"></v-skeleton-loader>
              <v-skeleton-loader type="text, actions" class="mb-4"></v-skeleton-loader>
            </template>
            <template v-else>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="d-flex align-center">
                      <v-icon size="24" color="primary" class="mr-2">mdi-home</v-icon>
                      Main URL
                    </v-card-title>
                    <v-card-text>
                      <v-chip size="large" color="primary" class="pa-4 mb-4">
                        <v-icon start>mdi-link</v-icon>
                        <a :href="websiteData.main_url" target="_blank" class="text-white text-decoration-none">
                          {{ websiteData.main_url }}
                        </a>
                      </v-chip>
                      <v-expansion-panels v-if="urlsForDisplay.length" variant="accordion" class="mt-4">
                        <v-expansion-panel>
                          <v-expansion-panel-title class="text-body-2">
                            <v-icon size="small" color="grey" class="mr-2">mdi-sitemap</v-icon>
                            {{ urlsForDisplay.length }} URL{{ urlsForDisplay.length > 1 ? 's' : '' }} detected
                          </v-expansion-panel-title>

                          <v-expansion-panel-text>
                            <div class="bg-grey-darken-4 rounded-lg pa-4 max-h-60 overflow-y-auto">
                              <v-chip v-for="(item, index) in urlsForDisplay" :key="index" size="small"
                                variant="outlined" :color="item.url === websiteData.main_url ? 'secondary' : 'grey'"
                                class="ma-1 text-truncate d-inline-flex align-center" :href="item.url" target="_blank"
                                rel="noopener noreferrer" title="Click to open">
                                <template v-slot:prepend v-if="item.url === websiteData.main_url">
                                  <v-icon size="x-small" class="mr-1" color="primary">mdi-star</v-icon>
                                </template>

                                <span class="text-caption">{{ item.url }}</span>

                                <template v-slot:append>
                                  <v-icon size="x-small" class="ml-1" color="grey-lighten-1">mdi-open-in-new</v-icon>
                                </template>
                              </v-chip>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>

                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="d-flex align-center">
                      <v-icon size="24" color="primary" class="mr-2">mdi-share-variant</v-icon>
                      Social media preview
                    </v-card-title>
                    <v-card-text v-if="socialMetaPreview">
                      <v-card class="social-preview-card">
                        <v-img v-if="socialMetaPreview.ogImage" :src="socialMetaPreview.ogImage" height="180" cover
                          class="social-card-image">
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-icon icon="mdi-image" size="large"></v-icon>
                            </v-row>
                          </template>
                        </v-img>
                        <v-card-text class="pa-3">
                          <p class="text-caption text-grey mb-1">{{ socialMetaPreview.url }}</p>
                          <h3 class="text-subtitle-1 font-weight-bold mb-2 text-truncate">{{ socialMetaPreview.ogTitle
                          }}</h3>
                          <p class="text-body-2 social-description">{{ socialMetaPreview.ogDescription }}</p>
                        </v-card-text>
                      </v-card>
                    </v-card-text>
                    <v-card-text v-else class="text-center pa-5">
                      <v-icon size="40" color="grey-lighten-1" class="mb-3">mdi-share-off</v-icon>
                      <p class="text-body-2 text-grey">Social media metadata not available</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <template v-if="!hasAnalyzed && !loading">
                  <v-row>
                    <v-col cols="12">
                      <v-card class="mb-4 rounded-lg elevation-2">
                        <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
                          <v-icon color="white" class="mr-2">mdi-chart-donut</v-icon>
                          Website Analysis
                        </v-card-title>
                        <v-card-text class="pa-4 text-center">
                          <p class="text-body-1 mb-4">Run a complete analysis of your website to get insights on
                            performance, security, and more.</p>
                          <v-btn color="secondary" size="large" @click="analyzeWebsite" :loading="loading">
                            <v-icon start>mdi-rocket-launch</v-icon>
                            Start Analysis
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>

                <v-row v-else-if="loading">
                  <v-col cols="12">
                    <v-card class="mb-4 rounded-lg elevation-2">
                      <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
                        <v-icon color="white" class="mr-2">mdi-chart-donut</v-icon>
                        SSUC metrics
                      </v-card-title>
                      <v-card-text class="pa-4">
                        <v-row>
                          <v-col cols="12" sm="6" md="3" v-for="i in 4" :key="i">
                            <v-card variant="outlined" class="mb-4">
                              <v-card-text>
                                <div class="d-flex flex-column align-center justify-center py-3">
                                  <v-skeleton-loader type="avatar" class="mb-4" height="100"
                                    width="100"></v-skeleton-loader>
                                  <v-skeleton-loader type="text" class="mt-2" width="120"></v-skeleton-loader>
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <template v-else-if="semanticData.length > 0">
                  <v-row>
                    <v-col cols="12">
                      <v-card class="mb-4 rounded-lg elevation-2">
                        <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
                          <v-icon color="white" class="mr-2">mdi-chart-donut</v-icon>
                          SSUC metrics
                        </v-card-title>
                        <v-card-text class="pa-4">
                          <v-row>
                            <v-col v-for="(metric, index) in allMetrics" :key="index" cols="12" sm="6" md="3">
                              <v-card variant="outlined" class="mb-4">
                                <v-card-text>
                                  <div class="d-flex flex-column align-center justify-center py-3">
                                    <v-progress-circular :model-value="metric.value"
                                      :color="getScoreColor(metric.value)" size="100" width="12"
                                      :aria-label="metric.label + ' score'">
                                      <span class="text-h6 font-weight-bold">{{ metric.value }}%</span>
                                    </v-progress-circular>
                                    <div class="text-h6 mt-4 text-center"
                                      :class="`text-${getScoreColor(metric.value)}`">
                                      {{ metric.label }}
                                    </div>
                                    <div class="text-subtitle-2 text-center mt-1 text-grey">
                                      Average of {{ semanticData.length }} URLs
                                    </div>

                                    <div v-if="metric.label === 'Performance' && metric.metrics"
                                      class="d-flex justify-space-between align-center mt-2 performance-metrics">
                                      <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                          <div v-bind="props" class="metric-item">
                                            <span class="metric-label">FCP</span>
                                            <span class="metric-value">{{
                                              Math.round(metric.metrics.firstContentfulPaint) }}ms</span>
                                          </div>
                                        </template>
                                        <span>First Contentful Paint</span>
                                      </v-tooltip>

                                      <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                          <div v-bind="props" class="metric-item">
                                            <span class="metric-label">LCP</span>
                                            <span class="metric-value">{{
                                              Math.round(metric.metrics.largestContentfulPaint) }}ms</span>
                                          </div>
                                        </template>
                                        <span>Largest Contentful Paint</span>
                                      </v-tooltip>

                                      <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                          <div v-bind="props" class="metric-item">
                                            <span class="metric-label">CLS</span>
                                            <span class="metric-value">{{
                                              metric.metrics.cumulativeLayoutShift.toFixed(2) }}</span>
                                          </div>
                                        </template>
                                        <span>Cumulative Layout Shift</span>
                                      </v-tooltip>
                                    </div>
                                  </div>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row v-if="technicalData.length > 0">
                    <v-col cols="12">
                      <v-card class="mb-4 rounded-lg elevation-2">
                        <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
                          <v-icon color="white" class="mr-2">mdi-cog</v-icon>
                          Technical Analysis
                        </v-card-title>
                        <v-card-text class="pa-4">
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-card variant="outlined" class="mb-4">
                                <v-card-title class="d-flex align-center">
                                  <v-icon size="24" color="primary" class="mr-2">mdi-robot</v-icon>
                                  Robots.txt
                                </v-card-title>
                                <v-card-text>
                                  <v-list>
                                    <v-list-item>
                                      <template v-slot:prepend>
                                        <v-icon :color="mainTechnicalData?.robotsTxt?.found ? 'success' : 'error'">
                                          {{ mainTechnicalData?.robotsTxt?.found ? 'mdi-check-circle' :
                                            'mdi-alert-circle' }}
                                        </v-icon>
                                      </template>
                                      <v-list-item-title>
                                        {{ mainTechnicalData?.robotsTxt?.found ? 'Found' : 'Not found' }}
                                      </v-list-item-title>
                                    </v-list-item>
                                    <v-list-item v-if="mainTechnicalData?.robotsTxt?.issues?.length">
                                      <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2">
                                        Issues
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        <v-chip v-for="(issue, index) in mainTechnicalData.robotsTxt.issues"
                                          :key="index" :color="getIssueSeverityColor(issue.severity)" size="small"
                                          class="ma-1">
                                          {{ issue.message }}
                                        </v-chip>
                                      </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item v-if="mainTechnicalData?.robotsTxt?.content">
                                      <v-btn variant="text" size="small" class="mt-2"
                                        @click="showContent(mainTechnicalData.robotsTxt.content, 'robots.txt')">
                                        <v-icon start>mdi-eye</v-icon>
                                        View content
                                      </v-btn>
                                    </v-list-item>
                                  </v-list>
                                </v-card-text>
                              </v-card>
                            </v-col>

                            <v-col cols="12" md="6">
                              <v-card variant="outlined" class="mb-4">
                                <v-card-title class="d-flex align-center">
                                  <v-icon size="24" color="primary" class="mr-2">mdi-sitemap</v-icon>
                                  Sitemap
                                </v-card-title>
                                <v-card-text>
                                  <v-list>
                                    <v-list-item>
                                      <template v-slot:prepend>
                                        <v-icon :color="mainTechnicalData?.sitemap?.found ? 'success' : 'error'">
                                          {{ mainTechnicalData?.sitemap?.found ? 'mdi-check-circle' : 'mdi-alert-circle'
                                          }}
                                        </v-icon>
                                      </template>
                                      <v-list-item-title>
                                        {{ mainTechnicalData?.sitemap?.found ? 'Found' : 'Not found' }}
                                      </v-list-item-title>
                                      <v-list-item-subtitle v-if="mainTechnicalData?.sitemap?.urls">
                                        {{ mainTechnicalData.sitemap.urls }} URLs indexed
                                      </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item v-if="mainTechnicalData?.sitemap?.issues?.length">
                                      <v-list-item-title class="text-subtitle-1 font-weight-bold mb-2">
                                        Issues
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        <v-chip v-for="(issue, index) in mainTechnicalData.sitemap.issues" :key="index"
                                          :color="getIssueSeverityColor(issue.severity)" size="small" class="ma-1">
                                          {{ issue.message }}
                                        </v-chip>
                                      </v-list-item-subtitle>
                                    </v-list-item>
                                    <v-list-item v-if="mainTechnicalData?.sitemap?.content">
                                      <v-btn variant="text" size="small" class="mt-2"
                                        @click="showContent(mainTechnicalData.sitemap.content, 'sitemap.xml')">
                                        <v-icon start>mdi-eye</v-icon>
                                        View content
                                      </v-btn>
                                    </v-list-item>
                                  </v-list>
                                </v-card-text>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </template>

                <v-col cols="12" v-if="websiteData?.generated_sitemap">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="d-flex align-center">
                      <v-icon size="24" color="primary" class="mr-2">mdi-sitemap</v-icon>
                      Sitemap
                      <v-spacer></v-spacer>
                      <v-btn color="primary" variant="text" density="comfortable" size="small" @click="copySitemap"
                        aria-label="Copy the sitemap">
                        <v-icon size="small">mdi-content-copy</v-icon>
                        <span class="ml-1">Copy</span>
                      </v-btn>
                    </v-card-title>
                    <v-card-text>
                      <pre ref="sitemapRef" class="sitemap-content pa-4 bg-surface">{{ sitemapLines.join('\n') }}</pre>
                      <div v-if="remainingLines > 0" class="text-center mt-2">
                        <v-btn color="primary" variant="text" size="small" @click="showFullSitemap = !showFullSitemap">
                          {{ showFullSitemap ? 'Show less' : `Show ${remainingLines} more lines` }}
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <snackBar v-model="snackbar.show" :color="snackbar.color" :text="snackbar.text" :timeout="3000">
    </snackBar>

    <v-dialog v-model="showContentDialog" max-width="800px">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ dialogTitle }}</span>
          <v-btn icon @click="showContentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="content-dialog">
            <pre class="language-xml pa-4"><code>{{ showFullContent ? dialogContent : dialogContent.split('\n').slice(0,
              100).join('\n') }}</code></pre>
          </div>
          <div v-if="dialogContent.split('\n').length > 100" class="text-center mt-2">
            <v-btn color="primary" variant="text" size="small" @click="showFullContent = !showFullContent">
              {{ showFullContent ? 'Show less' : `Show ${dialogContent.split('\n').length - 100} more lines` }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import { useHead } from '#imports';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';

interface SemanticDataItem {
  url: string;
  semanticScore?: number;
  score?: number;
  accessibility?: {
    ariaScore: number;
  };
  metaTags?: {
    social?: {
      og?: Array<{
        name: string;
        content: string;
      }>;
      twitter?: Array<{
        name: string;
        content: string;
      }>;
    };
    essential?: Array<{
      name: string;
      content: string;
    }>;
    score?: number;
  };
  contentStats?: {
    readabilityScore: number;
    wordCount: number;
    keywordDensity: number | Record<string, number>;
  };
  securityChecks?: {
    https: boolean;
    securityHeaders?: Array<{ name: string; value: string }>;
    securityIssues?: Array<{ severity: string; description: string }>;
    securityScore?: number;
  };
}

interface EngagementDataItem {
  url: string;
  score?: number;
  engagement?: {
    engagementScore: number;
  };
}

interface UrlItem {
  url: string;
}

interface Metric {
  label: string;
  value: number;
  metrics?: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
  };
}

interface TechnicalDataItem {
  url: string;
  robotsTxt: {
    found: boolean;
    content?: string;
    issues?: Array<{
      type: string;
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
  sitemap: {
    found: boolean;
    url?: string;
    content?: string;
    urls?: number;
    issues?: Array<{
      type: string;
      message: string;
      severity: 'high' | 'medium' | 'low';
    }>;
  };
}

const userStore = useUserStore();
const loading = ref(false);
const loadingProgress = ref(0);
const semanticData = ref<SemanticDataItem[]>([]);
const engagementData = ref<EngagementDataItem[]>([]);
const securityData = ref<any[]>([]);
const avgScores = ref({
  semantic: 0,
  content: 0,
  security: 0,
  engagement: 0
});

const metricsCache = ref<Metric[]>([]);
const socialMetaCache = ref<any>(null);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const sitemapRef = ref('');
const router = useRouter();
const websiteData = computed(() => userStore.websiteData);
const performanceScore = ref(0);
const performanceData = ref({
  firstContentfulPaint: 0,
  largestContentfulPaint: 0,
  cumulativeLayoutShift: 0
});
const securityResults = ref([]);

const showFullSitemap = ref(false);
const sitemapLines = computed(() => {
  if (!websiteData.value?.generated_sitemap) return [];
  const lines = websiteData.value.generated_sitemap.split('\n');
  return showFullSitemap.value ? lines : lines.slice(0, 100);
});

const remainingLines = computed(() => {
  if (!websiteData.value?.generated_sitemap) return 0;
  const totalLines = websiteData.value.generated_sitemap.split('\n').length;
  return Math.max(0, totalLines - 100);
});

const socialMetaPreview = computed(() => {
  if (socialMetaCache.value) return socialMetaCache.value;

  if (!semanticData.value || semanticData.value.length === 0) return null;

  const mainPageData = semanticData.value.find(page =>
    page.url === websiteData.value?.main_url) || semanticData.value[0];

  if (!mainPageData || !mainPageData.metaTags) return null;

  const metaTags = mainPageData.metaTags;
  let ogImage = '';
  let ogTitle = '';
  let ogDescription = '';

  if (metaTags.social && metaTags.social.og) {
    const ogTags = Array.isArray(metaTags.social.og) ? metaTags.social.og : [];

    const titleTag = ogTags.find(tag => tag.name === 'og:title');
    if (titleTag) ogTitle = titleTag.content;

    const descTag = ogTags.find(tag => tag.name === 'og:description');
    if (descTag) ogDescription = descTag.content;

    const imageTag = ogTags.find(tag => tag.name === 'og:image');
    if (imageTag) {
      ogImage = imageTag.content;
      if (ogImage && ogImage.startsWith('/')) {
        const baseUrl = new URL(mainPageData.url).origin;
        ogImage = baseUrl + ogImage;
      }
    }
  }

  if ((!ogTitle || !ogDescription) && metaTags.essential) {
    const essentialTags = Array.isArray(metaTags.essential) ? metaTags.essential : [];

    if (!ogTitle) {
      const titleTag = essentialTags.find(tag => tag.name === 'Title');
      if (titleTag) ogTitle = titleTag.content;
    }

    if (!ogDescription) {
      const descTag = essentialTags.find(tag => tag.name === 'Description');
      if (descTag) ogDescription = descTag.content;
    }
  }

  const result = {
    url: mainPageData.url,
    ogTitle: ogTitle || 'Title not available',
    ogDescription: ogDescription || 'Description not available',
    ogImage: ogImage || ''
  };

  socialMetaCache.value = result;
  return result;
});

const urlsForDisplay = computed<UrlItem[]>(() => {
  if (!websiteData.value?.all_urls) return [];
  const urls = Array.isArray(websiteData.value.all_urls)
    ? websiteData.value.all_urls
    : (typeof websiteData.value.all_urls === 'string'
      ? JSON.parse(websiteData.value.all_urls)
      : []);
  return urls.map((url: string) => ({ url }));
});

const allMetrics = computed<Metric[]>(() => {
  if (metricsCache.value.length > 0) return metricsCache.value;

  if (semanticData.value.length === 0) return [];

  const metrics: Metric[] = [
    { label: 'HTML Structure', value: Math.round(avgScores.value.semantic) },
    { label: 'Security Score', value: Math.round(avgScores.value.security) },
    { label: 'Content Quality', value: Math.round(avgScores.value.content) },
    { label: 'User Engagement', value: Math.round(avgScores.value.engagement) }
  ];

  if (performanceScore.value > 0) {
    metrics.push({
      label: 'Performance',
      value: performanceScore.value,
      metrics: performanceData.value
    });
  }

  metricsCache.value = metrics;
  return metrics;
});

function getScoreColor(score: number): string {
  if (score >= 90) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

function getIssueSeverityColor(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'grey';
  }
}

function showSnackbar(text: string, color = 'success'): void {
  snackbar.value = {
    show: true,
    text,
    color
  };
}

function copySitemap(): void {
  if (websiteData.value?.generated_sitemap) {
    navigator.clipboard.writeText(websiteData.value.generated_sitemap)
      .then(() => showSnackbar('Sitemap copied to clipboard'))
      .catch(() => showSnackbar('Impossible to copy the sitemap', 'error'));
  }
}

const hasAnalyzed = ref(false);

const technicalData = ref<TechnicalDataItem[]>([]);
const showContentDialog = ref(false);
const dialogContent = ref('');
const dialogTitle = ref('');
const showFullContent = ref(false);

function showContent(content: string, title: string) {
  dialogContent.value = content;
  dialogTitle.value = title;
  showContentDialog.value = true;
  showFullContent.value = false;
  nextTick(() => {
    const codeElement = document.querySelector('.content-dialog pre');
    if (codeElement) {
      hljs.highlightElement(codeElement as HTMLElement);
    }
  });
}

async function analyzeWebsite() {
  if (loading.value) return;

  loading.value = true;
  loadingProgress.value = 10;

  try {
    metricsCache.value = [];
    socialMetaCache.value = null;

    const performanceResponse = await fetch('/api/analyze/performance-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });

    if (performanceResponse.ok) {
      const perfData = await performanceResponse.json();
      performanceScore.value = perfData.averageScore;

      if (perfData.performanceResults && perfData.performanceResults.length > 0) {
        const totalMetrics = perfData.performanceResults.reduce((acc: any, result: any) => {
          acc.fcp += result.firstContentfulPaint;
          acc.lcp += result.largestContentfulPaint;
          acc.cls += result.cumulativeLayoutShift;
          return acc;
        }, { fcp: 0, lcp: 0, cls: 0 });

        const count = perfData.performanceResults.length;
        performanceData.value = {
          firstContentfulPaint: totalMetrics.fcp / count,
          largestContentfulPaint: totalMetrics.lcp / count,
          cumulativeLayoutShift: totalMetrics.cls / count
        };
      }
    }
    loadingProgress.value = 25;

    const semanticResponse = await fetch('/api/analyze/semantic-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });

    if (semanticResponse.ok) {
      semanticData.value = await semanticResponse.json();

      const semanticScores = semanticData.value.map(item => {
        const semanticScore = item.semanticScore !== undefined ? item.semanticScore : (item.score || 0);
        const ariaScore = item.accessibility?.ariaScore || 0;
        const metaScore = item.metaTags?.score || 0;

        return (semanticScore + ariaScore + metaScore) / 3;
      });

      avgScores.value.semantic = semanticScores.reduce((sum, score) => sum + score, 0) / semanticScores.length || 0;
    }
    loadingProgress.value = 40;

    const contentResponse = await fetch('/api/analyze/content-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url, crawl: true })
    });

    if (contentResponse.ok) {
      const data = await contentResponse.json();

      if (data.urlList && Array.isArray(data.urlList) && data.urlList.length > 0) {
        const contentScores = [data];

        for (const pageUrl of data.urlList) {
          if (pageUrl !== data.url) {
            try {
              const pageResponse = await fetch('/api/analyze/content-view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: pageUrl })
              });

              if (pageResponse.ok) {
                const pageData = await pageResponse.json();
                contentScores.push(pageData);
              }
            } catch (e) {
              console.error(`Error analyzing ${pageUrl}:`, e);
            }
          }
        }

        avgScores.value.content = Math.round(
          contentScores.reduce((sum: number, item: any) => {
            if (!item) return sum;

            let score = 0;
            const wordCount = item?.contentStats?.wordCount || 0;
            if (wordCount >= 800) {
              score += 20;
            } else if (wordCount >= 500) {
              score += 15;
            } else if (wordCount >= 300) {
              score += 10;
            } else if (wordCount > 0) {
              score += 5;
            }

            if (item?.headingStructure?.h1 && item.headingStructure.h1.length > 0) {
              score += 10;
              if (item.headingStructure.h2 && item.headingStructure.h2.length > 0) {
                score += 5;
                if (item.headingStructure.h3 && item.headingStructure.h3.length > 0) {
                  score += 5;
                }
              }
            }

            const imagesTotal = item?.images?.total || 0;
            const imagesWithAlt = item?.images?.withAlt || 0;

            if (imagesTotal > 0) {
              const altRatio = imagesWithAlt / imagesTotal;
              score += Math.floor(altRatio * 20);
            }

            const internalLinks = Array.isArray(item?.links?.internal) ? item.links.internal.length : 0;
            const externalLinks = Array.isArray(item?.links?.external) ? item.links.external.length : 0;

            if (internalLinks > 0) {
              score += Math.min(10, internalLinks * 2);
            }

            if (externalLinks > 0) {
              score += Math.min(10, externalLinks * 2);
            }

            const readabilityScore = item?.contentStats?.readabilityScore || 0;
            score += Math.floor(readabilityScore * 0.2);

            return sum + Math.min(100, Math.max(0, Math.floor(score)));
          }, 0) / contentScores.length
        );
      } else {
        avgScores.value.content = 0;
      }
    }
    loadingProgress.value = 55;

    const urls = Array.isArray(websiteData.value.all_urls)
      ? websiteData.value.all_urls
      : (typeof websiteData.value.all_urls === 'string'
        ? JSON.parse(websiteData.value.all_urls)
        : []);

    const securityResponse = await fetch('/api/analyze/security-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });

    if (securityResponse.ok) {
      const securityResult = await securityResponse.json();
      if (securityResult && Array.isArray(securityResult)) {
        securityData.value = securityResult.filter(item => item && typeof item.score === 'number');

        const securityScores = securityData.value.map(item => item.score);
        if (securityScores.length > 0) {
          avgScores.value.security = Math.round(
            securityScores.reduce((sum, score) => sum + score, 0) / securityScores.length
          );
        }
      }
    }
    loadingProgress.value = 70;

    const engagementResponse = await fetch('/api/analyze/engagement-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });

    if (engagementResponse.ok) {
      const engagementResults = await engagementResponse.json();
      if (engagementResults && Array.isArray(engagementResults)) {
        engagementData.value = engagementResults;

        // Calculate engagement score from all URLs
        const engagementScores = engagementResults.map(result => {
          if (result && typeof result.score === 'number') {
            return result.score;
          }
          return 0;
        }).filter(score => score > 0);

        if (engagementScores.length > 0) {
          avgScores.value.engagement = Math.round(engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length);
        }
      }
    }

    const technicalResponse = await fetch('/api/analyze/technical-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });

    if (technicalResponse.ok) {
      technicalData.value = await technicalResponse.json();
    }
    loadingProgress.value = 85;

    // Mark as analyzed
    hasAnalyzed.value = true;
    loadingProgress.value = 100;
  } catch (error) {
    console.error('Analysis error:', error);
    showSnackbar('Error during analysis', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!websiteData.value) {
    await userStore.loadWebsiteData();
  }


  if (typeof window !== 'undefined') {
    const handlePerformanceData = (event: any) => {
      const { websiteUrl, performanceScore: score, performanceMetrics } = event.detail;
      if (websiteData.value?.main_url === websiteUrl) {
        performanceScore.value = Math.round(score);
        if (performanceMetrics) {
          performanceData.value = performanceMetrics;
        }
        metricsCache.value = [];
      }
    };

    window.addEventListener('performanceDataAvailable', handlePerformanceData);

    onUnmounted(() => {
      window.removeEventListener('performanceDataAvailable', handlePerformanceData);
    });
  }
});

useHead({
  title: 'Website data - StackUnity',
  meta: [
    { name: 'description', content: 'Visualize and analyze your website data' },
    { name: 'keywords', content: 'website, analysis, SEO, semantic, accessibility, engagement' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Website data - StackUnity' },
    { property: 'og:description', content: 'Visualize and analyze your website data' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/website' }
  ]
});

// @ts-ignore
definePageMeta({
  layout: 'dashboard'
});

const highlightCode = (code: string) => {
  const codeElement = document.querySelector('.sitemap-content');
  if (codeElement) {
    hljs.highlightElement(codeElement as HTMLElement);
  }
};

watch(sitemapRef, () => {
  nextTick(() => {
    if (sitemapRef.value) {
      highlightCode(sitemapRef.value);
    }
  });
});

function goToSettings() {
  router.push('/settings');
}

const mainTechnicalData = computed(() => {
  return technicalData.value.length > 0 ? technicalData.value[0] : null;
});
</script>

<style scoped>
.sitemap-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.9em;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 4px;
  padding: 12px;
}

.social-preview-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.social-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-card-image {
  background-color: #f5f5f5;
}

.social-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #616161;
}

.performance-metrics {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: rgba(66, 66, 66, 0.1);
  margin-top: 8px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px;
}

.metric-label {
  font-size: 12px;
  font-weight: bold;
  color: var(--v-primary-base);
}

.metric-value {
  font-size: 11px;
}

.content-dialog {
  max-height: 500px;
  overflow-y: auto;
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 12px;
}

.content-dialog pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.content-dialog code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.9em;
}
</style>