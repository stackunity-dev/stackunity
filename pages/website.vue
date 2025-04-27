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

                <v-row v-if="loading || !semanticData.length">
                  <v-col cols="12">
                    <v-card class="mb-4 rounded-lg elevation-2">
                      <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
                        <v-icon color="white" class="mr-2">mdi-chart-donut</v-icon>
                        Global metrics
                      </v-card-title>
                      <v-card-text class="pa-4">
                        <v-row>
                          <v-col cols="12" sm="6" md="4" v-for="i in 3" :key="i">
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
                          Global metrics
                        </v-card-title>
                        <v-card-text class="pa-4">
                          <v-row>
                            <v-col v-for="(metric, index) in metrics" :key="index" cols="12" sm="6" md="4">
                              <v-card variant="outlined" class="mb-4">
                                <v-card-text>
                                  <div class="d-flex flex-column align-center justify-center py-3">
                                    <v-progress-circular :model-value="metric.value"
                                      :color="getScoreColor(metric.value)" size="100" width="12">
                                      <span class="text-h6 font-weight-bold">{{ metric.value }}%</span>
                                    </v-progress-circular>
                                    <div class="text-h6 mt-4 text-center"
                                      :class="`text-${getScoreColor(metric.value)}`">
                                      {{ metric.label }}
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
                      <pre ref="sitemapRef" class="sitemap-content pa-4">{{ websiteData.generated_sitemap }}</pre>
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
  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import { useHead } from '#imports';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

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

const userStore = useUserStore();
const loading = ref(true);
const semanticData = ref<SemanticDataItem[]>([]);
const engagementData = ref<EngagementDataItem[]>([]);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const sitemapRef = ref('');
const router = useRouter();
const websiteData = computed(() => userStore.websiteData);

const socialMetaPreview = computed(() => {
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

  return {
    url: mainPageData.url,
    ogTitle: ogTitle || 'Title not available',
    ogDescription: ogDescription || 'Description not available',
    ogImage: ogImage || ''
  };
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

const metrics = computed(() => {
  loading.value = true;
  if (semanticData.value.length === 0) return [];

  const avgSemanticScore = semanticData.value.reduce((acc, item) => {
    const score = item.semanticScore !== undefined ? item.semanticScore : item.score;
    return acc + (score || 0);
  }, 0) / semanticData.value.length;

  const avgAccessibilityScore = semanticData.value.reduce((acc, item) =>
    acc + (item.accessibility?.ariaScore || 0), 0) / semanticData.value.length;

  const avgEngagementScore = semanticData.value.reduce((acc, item) => {
    const engagementEntry = engagementData.value.find(e => e.url === item.url);

    let engagementScore = 0;
    if (engagementEntry) {
      if (typeof engagementEntry.score === 'number') {
        engagementScore = engagementEntry.score;
      } else if (engagementEntry.engagement && typeof engagementEntry.engagement.engagementScore === 'number') {
        engagementScore = engagementEntry.engagement.engagementScore;
      } else if (Array.isArray(engagementEntry) && engagementEntry.length > 0) {
        const firstEntry = engagementEntry[0];
        engagementScore = firstEntry.score || firstEntry.engagement?.engagementScore || 0;
      }
    }

    loading.value = false;
    return acc + engagementScore;
  }, 0) / semanticData.value.length;

  return [
    { label: 'Semantic Structure', value: Math.round(avgSemanticScore) },
    { label: 'Accessibility', value: Math.round(avgAccessibilityScore) },
    { label: 'User Engagement', value: Math.round(avgEngagementScore) }
  ];
});

function getScoreColor(score: number): string {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
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

async function analyzeSite(): Promise<void> {
  if (!websiteData.value) return;

  try {
    loading.value = true;

    const semanticResponse = await fetch('/api/analyze/semantic-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteData.value.main_url })
    });
    if (semanticResponse.ok) {
      semanticData.value = await semanticResponse.json();
    }

    const urls = Array.isArray(websiteData.value.all_urls)
      ? websiteData.value.all_urls
      : (typeof websiteData.value.all_urls === 'string'
        ? JSON.parse(websiteData.value.all_urls)
        : []);

    const engagementPromises = urls.map(async (url: string) => {
      try {
        const response = await fetch('/api/analyze/engagement-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });

        if (response.ok) {
          return await response.json();
        }
        return null;
      } catch (error) {
        console.error(`Erreur lors de l'analyse de l'engagement pour ${url}:`, error);
        return null;
      }
    });

    const engagementResults = await Promise.all(engagementPromises);
    const filteredResults = engagementResults.filter(result => result !== null);

    const processedResults = filteredResults.map(result => {
      if (Array.isArray(result) && result.length > 0) {
        const firstItemWithScore = result.find(item =>
          item.score !== undefined ||
          (item.engagement && item.engagement.engagementScore !== undefined)
        );

        if (firstItemWithScore) {
          return {
            url: firstItemWithScore.url,
            score: firstItemWithScore.score || firstItemWithScore.engagement?.engagementScore || 0
          };
        }
      }

      return result;
    });

    engagementData.value = processedResults;

  } catch (error) {
    console.error('Error during site analysis:', error);
    showSnackbar('Error during site analysis', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!websiteData.value) {
    await userStore.loadWebsiteData();
  }

  if (websiteData.value) {
    analyzeSite();
  } else {
    loading.value = false;
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
</script>

<style scoped>
.sitemap-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: 0.9em;
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
</style>