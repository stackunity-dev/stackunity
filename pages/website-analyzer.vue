<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">

        <v-row>
          <v-col cols="12" lg="5">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-cog</v-icon>
                Configuration
              </v-card-title>
              <v-card-text class="pa-4">
                <v-text-field v-model="targetUrl" label="Website URL" variant="outlined" prepend-inner-icon="mdi-web"
                  placeholder="https://example.com" class="mb-4"></v-text-field>

                <div class="d-flex justify-space-between align-center mt-4">
                  <v-btn color="primary" :loading="auditing" @click="startAudit" size="large">
                    <v-icon start>mdi-magnify</v-icon>
                    Start Audit
                  </v-btn>
                  <v-btn v-if="auditing" color="error" variant="outlined" @click="stopAudit">Stop</v-btn>
                </div>
              </v-card-text>
            </v-card>

            <v-card class="mt-4 rounded-lg" elevation="2" v-if="auditing">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <v-skeleton-loader type="list-item" v-for="i in 4" :key="`summary-${i}`"
                  class="mb-2"></v-skeleton-loader>
                <v-divider class="my-3"></v-divider>
                <v-skeleton-loader type="list-item" v-for="i in 3" :key="`summary-b-${i}`"
                  class="mb-2"></v-skeleton-loader>
                <v-skeleton-loader type="button" class="mt-4"></v-skeleton-loader>
              </v-card-text>
            </v-card>

            <v-card v-if="report" class="mt-4 rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text class="pa-4">
                <v-list v-if="report && report.summary">
                  <div v-for="(group, groupIndex) in summaryGroups" :key="groupIndex">
                    <v-divider v-if="groupIndex > 0" class="my-3"></v-divider>
                    <div class="text-subtitle-2 font-weight-medium my-2 py-1 pl-2"
                      :class="`bg-${group.color}-lighten-5 rounded-lg`">
                      <v-icon :color="group.color" size="20" class="mr-2">{{ group.icon }}</v-icon>
                      {{ group.title }}
                    </div>
                    <v-row>
                      <v-col v-for="(item, itemIndex) in group.items" :key="itemIndex" cols="12" sm="6">
                        <v-card variant="outlined" class="mb-2">
                          <v-card-text class="pa-2">
                            <div class="d-flex align-center">
                              <v-icon :color="group.color" size="24" class="mr-3">{{ item.icon }}</v-icon>
                              <div>
                                <div class="text-subtitle-2 font-weight-medium">{{ item.title }}</div>
                                <div class="text-body-2 text-medium-emphasis">{{ item.value(report) }}</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </div>
                </v-list>
                <v-alert v-else type="info" class="mt-2">
                  Resume loading...
                </v-alert>

                <v-btn color="primary" block class="mt-4" prepend-icon="mdi-file-pdf-box" @click="generatePDFReport">
                  Generate PDF Report
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="7">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2" icon="mdi-language-html5"></v-icon>
                Web view vitals
                <v-spacer></v-spacer>
                <v-progress-circular v-if="auditing" indeterminate color="white"></v-progress-circular>
              </v-card-title>

              <v-card-text class="pa-4">
                <template v-if="!auditing && !report">
                  <div class="text-center pa-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-magnify</v-icon>
                    <div class="text-h6 mt-4 text-grey">No Results</div>
                    <div class="text-body-1 text-grey-darken-1">Configure and start an audit to see results
                    </div>
                  </div>
                </template>

                <template v-else-if="auditing">
                  <v-sheet class="skeleton-container">
                    <div class="text-h6 mb-3">Loading Audit Data...</div>

                    <v-skeleton-loader v-for="i in 3" :key="i" type="list-item-avatar-two-line"
                      class="mb-3 rounded"></v-skeleton-loader>

                    <div class="d-flex mb-4 mt-8">
                      <v-skeleton-loader v-for="i in 4" :key="`tab-${i}`" width="100" type="text"
                        class="mr-2"></v-skeleton-loader>
                    </div>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-skeleton-loader type="card" class="mb-4"></v-skeleton-loader>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-skeleton-loader type="card" class="mb-4"></v-skeleton-loader>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="4" v-for="i in 3" :key="`metric-${i}`">
                        <v-skeleton-loader type="card-avatar" class="mb-4"></v-skeleton-loader>
                      </v-col>
                    </v-row>
                  </v-sheet>
                </template>

                <template v-else-if="report">
                  <v-expansion-panels>
                    <v-expansion-panel v-for="(_, url) in report.seoResults" :key="url">
                      <v-expansion-panel-title>
                        <div class="d-flex align-center">
                          <v-icon :color="getResultStatus(getResultFromCache(url) || {}).color" class="mr-2">
                            {{ getResultStatus(getResultFromCache(url) || {}).icon }}
                          </v-icon>
                          <div>
                            <div class="text-subtitle-1 text-wrap">{{ parseUrl(url).pathname }}</div>
                            <div class="text-caption text-grey text-wrap">{{ parseUrl(url).host }}</div>
                          </div>
                          <v-spacer></v-spacer>
                          <div class="d-flex align-center">
                            <v-chip :color="getResultStatus(getResultFromCache(url) || {}).color" size="small"
                              class="ml-2 flex-shrink-0">
                              {{ computeWarningCounts(getResultFromCache(url) || {}).total }} issue(s)
                            </v-chip>
                          </div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-tabs v-model="activeTab" color="primary" grow>
                          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" class="py-3">
                            <v-icon start size="22" class="mr-2">{{ tab.icon }}</v-icon>
                            {{ tab.label }}
                            <v-badge v-if="tab.value === 'warnings'"
                              :content="computeWarningCounts(getResultFromCache(url) || {}).total" color="error"
                              location="top end" offset-x="3" offset-y="-8"></v-badge>
                            <v-badge
                              v-if="tab.value === 'security' && getResultFromCache(url)?.securityChecks?.securityIssues?.length"
                              :content="getResultFromCache(url)?.securityChecks?.securityIssues?.length || 0"
                              color="error" location="top end" offset-x="3" offset-y="-8"></v-badge>
                          </v-tab>
                        </v-tabs>

                        <v-window v-model="activeTab" class="mt-4">
                          <v-window-item value="overview">
                            <v-row>
                              <v-col cols="12">
                                <v-card variant="elevated"
                                  class="mb-4 rounded-lg elevation-1 border-primary-subtle overflow-hidden">
                                  <v-card-item class="bg-primary-lighten-4 pa-4">
                                    <template v-slot:prepend>
                                      <v-avatar color="primary" class="mr-3" size="48">
                                        <v-icon size="28" color="white">mdi-chart-donut</v-icon>
                                      </v-avatar>
                                    </template>
                                    <v-card-title class="text-h6 font-weight-bold">Métriques SEO</v-card-title>
                                  </v-card-item>
                                  <v-card-text class="pa-4">
                                    <MetricsOverview :result="getResultFromCache(url) || {}" />
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>

                            <v-divider class="my-4"></v-divider>

                            <v-row>
                              <v-col cols="12">
                                <v-card variant="elevated"
                                  class="mb-4 rounded-lg elevation-1 border-warning-subtle h-100">
                                  <v-card-item class="bg-warning-lighten-5 pa-3">
                                    <template v-slot:prepend>
                                      <v-icon color="warning" size="24">mdi-speedometer</v-icon>
                                    </template>
                                    <v-card-title>Performance</v-card-title>
                                  </v-card-item>
                                  <v-card-text class="pa-3">
                                    <v-row>
                                      <v-col cols="6" v-for="metric in getCoreWebVitalsFormatted(url)"
                                        :key="metric.name">
                                        <div class="d-flex flex-column align-center">
                                          <v-progress-circular :model-value="getMetricScore(metric.value)"
                                            :color="getVitalScoreColor(Number(metric.value), metric.name)" :size="60"
                                            :width="6">
                                            <span class="text-caption">{{ formatMetricValue(metric.value) }}</span>
                                          </v-progress-circular>
                                          <div class="text-caption mt-2 text-center">{{ metric.name }}</div>
                                        </div>
                                      </v-col>
                                    </v-row>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <v-window-item value="technical">
                            <TechnicalTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="content">
                            <ContentTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="meta">
                            <MetaTagsTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="security">
                            <SecurityTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="accessibility">
                            <AccessibilityTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="engagement">
                            <EngagementTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>

                          <v-window-item value="warnings">
                            <WarningsTab ref="warningsTabRef" :result="getResultFromCache(url)" />
                          </v-window-item>

                          <v-window-item value="action-plan">
                            <ActionPlanTab :result="getResultFromCache(url) || {}" />
                          </v-window-item>
                        </v-window>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-btn :disabled="!report" @click="generateSitemap" color="secondary" class="mr-2">
                  Generate Sitemap
                </v-btn>
                <v-btn :disabled="!report" @click="previewSitemap" color="info">
                  Preview Sitemap
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-dialog v-model="showSitemapPreview" max-width="900" persistent scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <div>
            <v-icon start>mdi-xml</v-icon>
            Preview sitemap.xml
            <v-chip class="ml-2" size="small" color="primary">{{ report?.visitedURLs.length || 0 }} URLs</v-chip>
          </div>
          <v-btn icon @click="showSitemapPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-tabs v-model="sitemapPreviewTab">
            <v-tab value="code">XML Code</v-tab>
            <v-tab value="preview">Preview</v-tab>
          </v-tabs>

          <v-window v-model="sitemapPreviewTab">
            <v-window-item value="code">
              <pre class="sitemap-preview pa-4 bg-grey-darken-4">
            <code>{{ sitemapPreview }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="preview">
              <div class="pa-4">
                <h3>URLs included in the sitemap ({{ report?.visitedURLs.length || 0 }})</h3>
                <v-list>
                  <v-list-item v-for="(url, i) in report?.visitedURLs" :key="i">
                    <v-list-item-title>
                      {{ url }}
                      <v-chip size="x-small" class="ml-2" :color="url === targetUrl ? 'primary' : 'secondary'">
                        {{ url === targetUrl ? '1.0' : '0.8' }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <h3 class="mt-4">Images included in the sitemap</h3>
                <div v-if="getTotalImagesInSitemap() > 0" class="d-flex flex-wrap">
                  <v-chip class="ma-1" size="small" color="info">
                    Total: {{ getTotalImagesInSitemap() }} images
                  </v-chip>
                  <v-chip class="ma-1" size="small" :color="getMissingAltImagesCount() > 0 ? 'error' : 'success'">
                    {{ getMissingAltImagesCount() }} images without alt attribute
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip color="warning">No images detected</v-chip>
                </div>

                <h3 class="mt-4">Videos included in the sitemap</h3>
                <div v-if="getTotalVideosInSitemap() > 0" class="d-flex flex-wrap">
                  <v-chip class="ma-1" size="small" color="info">
                    Total: {{ getTotalVideosInSitemap() }} videos
                  </v-chip>
                </div>
                <div v-else>
                  <v-chip color="warning">No videos detected</v-chip>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" variant="text" prepend-icon="mdi-download" @click="downloadSitemap">
            Download sitemap.xml
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showSitemapPreview = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="robotsTxtDialog" width="600">
      <v-card>
        <v-card-title class="bg-primary text-white py-3 px-4">
          <v-icon color="white" class="mr-2">mdi-robot</v-icon>
          robots.txt Content
        </v-card-title>
        <v-card-text class="pa-4">
          <v-alert type="info" variant="tonal" class="mb-4">
            The robots.txt file tells search engines which pages they can and cannot crawl on your site.
          </v-alert>
          <v-sheet class="pa-3 bg-grey-lighten-4 rounded" style="white-space: pre-wrap; font-family: monospace;">
            {{ robotsTxtContent }}
          </v-sheet>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="robotsTxtDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="mt-4" v-if="isSitemapDialog">
      <v-col cols="12">
        <v-card class="rounded-lg elevation-2">
          <v-card-title class="text-h6">
            <v-icon start color="primary">mdi-map-marker-path</v-icon>
            Sitemap Preview
          </v-card-title>
          <v-card-text class="py-3">
            <div class="mb-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-link</v-icon>
                <span class="text-subtitle-1 font-weight-bold">URLs in sitemap: {{ getTotalUrlsInSitemap() }}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-image</v-icon>
                <span class="text-subtitle-1 font-weight-bold">Images in sitemap: {{ getTotalImagesInSitemap() }}</span>
              </div>
              <v-divider class="my-3"></v-divider>

              <div class="sitemap-preview-container">
                <v-tabs v-model="sitemapTab" color="primary">
                  <v-tab value="code">XML Code</v-tab>
                  <v-tab value="urls">URLs</v-tab>
                  <v-tab value="images">Images</v-tab>
                </v-tabs>

                <v-window v-model="sitemapTab">
                  <v-window-item value="code">
                    <pre class="sitemap-code pa-4 rounded-lg"><code>{{ sitemapPreview }}</code></pre>
                  </v-window-item>

                  <v-window-item value="urls">
                    <v-list lines="two" class="rounded-lg">
                      <v-list-item v-for="(url, index) in extractUrlsFromSitemap()" :key="index">
                        <v-list-item-title>
                          <v-chip color="primary" size="small" class="mr-2">{{ index + 1 }}</v-chip>
                          {{ url }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="extractUrlsFromSitemap().length === 0">
                        <v-alert type="warning" density="compact">
                          No URLs found in the sitemap
                        </v-alert>
                      </v-list-item>
                    </v-list>
                  </v-window-item>

                  <v-window-item value="images">
                    <v-list lines="two" class="rounded-lg">
                      <template v-for="(urlImages, url) in extractImagesFromSitemap()" :key="url">
                        <v-list-subheader class="text-primary">
                          {{ url }}
                        </v-list-subheader>
                        <v-list-item v-for="(image, imgIndex) in urlImages" :key="`${url}-${imgIndex}`">
                          <template v-slot:prepend>
                            <v-avatar size="64" class="mr-3">
                              <v-img :src="image.url" :alt="image.title || 'Image'" contain></v-img>
                            </v-avatar>
                          </template>
                          <v-list-item-title>
                            {{ image.title || image.url.split('/').pop() || 'Image' }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ image.url }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </template>
                      <v-list-item v-if="Object.keys(extractImagesFromSitemap()).length === 0">
                        <v-alert type="warning" density="compact">
                          No images found in the sitemap
                        </v-alert>
                      </v-list-item>
                    </v-list>
                  </v-window-item>
                </v-window>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog pour afficher les données structurées -->
    <v-dialog v-model="schemaDialog" max-width="800">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-code-json</v-icon>
          Structured Data Details
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="activeSchemaTab" grow>
            <v-tab v-for="(schema, index) in selectedSchema" :key="index">
              {{ schema['@type'] || 'Schema ' + (index + 1) }}
            </v-tab>
          </v-tabs>
          <v-window v-model="activeSchemaTab" class="mt-4">
            <v-window-item v-for="(schema, index) in selectedSchema" :key="index">
              <v-card variant="outlined" class="pa-4 schema-detail">
                <div v-if="schema['@type']" class="mb-4">
                  <div class="text-caption text-grey">Type</div>
                  <div class="text-body-1">{{ schema['@type'] }}</div>
                </div>
                <template v-for="(value, key) in schema" :key="key">
                  <div v-if="String(key) !== '@type' && String(key) !== '@context'" class="mb-4">
                    <div class="text-caption text-grey">{{ key }}</div>
                    <div v-if="typeof value === 'object'" class="text-body-1">
                      <pre class="schema-json">{{ JSON.stringify(value, null, 2) }}</pre>
                    </div>
                    <div v-else class="text-body-1">{{ value }}</div>
                  </div>
                </template>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="schemaDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import {
  parseUrl
} from '../utils/seo/getScore';
import {
  SEOReport,
  SEOResult,
  Warning
} from '../utils/seo/types';

import AccessibilityTab from '../components/seo/AccessibilityTab.vue';
import ActionPlanTab from '../components/seo/ActionPlanTab.vue';
import ContentTab from '../components/seo/ContentTab.vue';
import EngagementTab from '../components/seo/EngagementTab.vue';
import MetaTagsTab from '../components/seo/MetaTagsTab.vue';
import MetricsOverview from '../components/seo/MetricsOverview.vue';
import SecurityTab from '../components/seo/SecurityTab.vue';
import TechnicalTab from '../components/seo/TechnicalTab.vue';
import WarningsTab from '../components/seo/WarningsTab.vue';

useHead({
  title: 'SEO Audit Tool',
  meta: [
    { name: 'description', content: 'Analyze your website and get SEO optimization recommendations' },
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'SEO Audit Tool' },
    { name: 'og:description', content: 'Analyze your website and get SEO optimization recommendations' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
});

definePageMeta({
  layout: 'dashboard',
  requiresPremium: true
});

const report = ref<SEOReport | null>(null);
const targetUrl = ref('');
const auditing = ref(false);
const error = ref<string | null>(null);
const showSitemapPreview = ref(false);
const sitemapPreview = ref('');
const activeTab = ref('overview');
const sitemapPreviewTab = ref('code');
const robotsTxtDialog = ref(false);
const robotsTxtContent = ref('');
const resultCache = ref(new Map<string, any>());
const userStore = useUserStore();
const tabs = computed(() => [
  { label: 'Overview', value: 'overview', icon: 'mdi-home' },
  { label: 'Technical', value: 'technical', icon: 'mdi-wrench' },
  { label: 'Content', value: 'content', icon: 'mdi-file-document' },
  { label: 'Meta Tags', value: 'meta', icon: 'mdi-tag-multiple' },
  { label: 'Security', value: 'security', icon: 'mdi-shield-check' },
  { label: 'Accessibility', value: 'accessibility', icon: 'mdi-account-supervisor' },
  { label: 'User Engagement', value: 'engagement', icon: 'mdi-cash' },
  {
    label: `Warnings`,
    value: 'warnings',
    icon: 'mdi-alert'
  },
  {
    label: `Action Plan`,
    value: 'action-plan',
    icon: 'mdi-airplane-check'
  }
]);

const generatePDFReport = async () => {
  try {
    const response = await fetch('/api/seo-audit.pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        url: targetUrl.value,
        report: report.value
      })
    });

    if (!response.ok) {
      error.value = 'Error generating PDF';
      throw new Error('Error generating PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-audit-${new Date().toISOString().split('T')[0]}.pdf`;

    if (document.body) {
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (err: any) {
    console.error('Error generating PDF:', err);
    error.value = err.message || 'Error generating PDF';
  }
};

const downloadSitemap = async () => {
  try {
    const response: any = await userStore.generateSitemap(targetUrl.value, JSON.stringify(report.value))

    if (!response.ok) {
      error.value = 'Error generating sitemap';
      throw new Error('Error generating sitemap');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap-${new Date().toISOString().split('T')[0]}.xml`;

    if (document.body) {
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (err: any) {
    console.error('Error generating sitemap:', err);
    error.value = err.message || 'Error generating sitemap';
  }
};

const previewSitemap = async () => {
  try {
    const response = await fetch('/api/sitemap?preview=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        url: targetUrl.value,
        report: report.value
      })
    });

    if (!response.ok) {
      error.value = 'Error generating sitemap';
      throw new Error('Error generating sitemap');
    }

    const data = await response.text();
    sitemapPreview.value = data;
    showSitemapPreview.value = true;
  } catch (err: any) {
    console.error('Erreur lors de la génération du sitemap:', err);
    error.value = err.message || 'Erreur lors de la génération du sitemap';
  }
};

const extractImageUrlsFromSitemap = (): string[] => {
  if (!sitemapPreview.value) return [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");
    const imageElements = xmlDoc.getElementsByTagName("image:loc");

    const urls: string[] = [];
    for (let i = 0; i < imageElements.length; i++) {
      const url = imageElements[i].textContent;
      if (url) urls.push(url);
    }

    return urls;
  } catch (e) {
    console.error("Erreur lors de l'extraction des URLs d'images:", e);
    return [];
  }
};

const getTotalImagesInSitemap = (): number => {
  return extractImageUrlsFromSitemap().length;
};

const getMissingAltImagesCount = (): number => {
  if (!report.value) return 0;
  return Object.values(report.value.seoResults).reduce((total: number, page: any) => {
    if (page.images?.withoutAlt !== undefined) {
      return total + (page.images.withoutAlt || 0);
    } else if (page.seo?.images?.withoutAlt !== undefined) {
      return total + (page.seo.images.withoutAlt || 0);
    }
    return total;
  }, 0);
};

const getTotalVideosInSitemap = (): number => {
  return 0;
};

const summaryGroups = [
  {
    title: 'Basic SEO',
    icon: 'mdi-text-search',
    color: 'info',
    items: [
      {
        icon: 'mdi-format-title',
        title: 'Pages Analyzed',
        value: (report: any) => report?.summary?.totalPages ?? 0
      },
      {
        icon: 'mdi-clock',
        title: 'Average Load Time',
        value: (report: any) => `${((report?.summary?.averageLoadTime ?? 0) / 1000).toFixed(2)}s`
      },
      {
        icon: 'mdi-format-title',
        title: 'Pages Without Title',
        value: (report: any) => report?.summary?.missingTitles ?? 0
      },
      {
        icon: 'mdi-text-box',
        title: 'Pages Without Description',
        value: (report: any) => report?.summary?.missingDescriptions ?? 0
      }
    ]
  },
  {
    title: 'Performance Metrics',
    icon: 'mdi-speedometer',
    color: 'warning',
    items: [
      {
        icon: 'mdi-image',
        title: 'Images Without Alt',
        value: (report: any) => report?.summary?.missingAltTags ?? 0
      },
      {
        icon: 'mdi-speedometer',
        title: 'First Contentful Paint',
        value: (report: any) => `${((report?.summary?.averageFCP ?? 0) / 1000).toFixed(2)}s`
      },
      {
        icon: 'mdi-page-layout-body',
        title: 'Largest Contentful Paint',
        value: (report: any) => `${((report?.summary?.averageLCP ?? 0) / 1000).toFixed(2)}s`
      },
      {
        icon: 'mdi-timer',
        title: 'Time to First Byte',
        value: (report: any) => `${((report?.summary?.averageTTFB ?? 0) / 1000).toFixed(2)}s`
      }
    ]
  },
  {
    title: 'Technical Evaluation',
    icon: 'mdi-code-tags',
    color: 'success',
    items: [
      {
        icon: 'mdi-code-json',
        title: 'Structured Data',
        value: (report: any) => {
          return `${calculateStructuredDataPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-share-variant',
        title: 'Social Media Tags',
        value: (report: any) => {
          return `${calculateSocialTagsPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-cellphone',
        title: 'Mobile Compatibility',
        value: (report: any) => {
          return `${calculateMobileCompatibilityPercentage(report)}% des pages`;
        }
      },
      {
        icon: 'mdi-shield-check',
        title: 'HTTPS Security',
        value: (report: any) => {
          return `${calculateHttpsPercentage(report)}% des pages`;
        }
      }
    ]
  },
  {
    title: 'Issues & Warnings',
    icon: 'mdi-alert',
    color: 'error',
    items: [
      {
        icon: 'mdi-alert',
        title: 'Total Warnings',
        value: (report: any) => report?.summary?.totalWarnings ?? 0
      },
      {
        icon: 'mdi-alert-circle',
        title: 'Critical Issues',
        value: (report: any) => report?.summary?.criticalIssues ?? 0
      },
      {
        icon: 'mdi-alert-box',
        title: 'High Priority Issues',
        value: (report: any) => report?.summary?.highPriorityIssues ?? 0
      },
      {
        icon: 'mdi-alert-circle-outline',
        title: 'Medium Priority Issues',
        value: (report: any) => report?.summary?.mediumPriorityIssues ?? 0
      }
    ]
  },
  {
    title: 'accessibility',
    icon: 'mdi-account-group',
    color: 'purple',
    items: [
      {
        icon: 'mdi-tag-text',
        title: 'missingAria',
        value: (report: any) => report?.summary?.missingAria ?? 0
      },
      {
        icon: 'mdi-image-off',
        title: 'missingAlt',
        value: (report: any) => report?.summary?.missingAlt ?? 0
      },
      {
        icon: 'mdi-form-textbox',
        title: 'missingLabels',
        value: (report: any) => report?.summary?.missingLabels ?? 0
      },
      {
        icon: 'mdi-contrast-box',
        title: 'contrastIssues',
        value: (report: any) => report?.summary?.contrastIssues ?? 0
      }
    ]
  },
];

const getResultStatus = (result: SEOResult) => {
  if (!result) return { class: '', color: 'grey', icon: 'mdi-help-circle' };

  const counts = computeWarningCounts(result);

  if (counts.critical > 0 || counts.high > 0) {
    return { class: 'result-error', color: 'error', icon: 'mdi-alert-circle' };
  }
  if (counts.medium > 0) {
    return { class: 'result-warning', color: 'warning', icon: 'mdi-alert' };
  }
  return { class: 'result-success', color: 'success', icon: 'mdi-check-circle' };
};

const startAudit = async () => {
  if (!targetUrl.value) {
    error.value = 'Please enter a URL';
    return;
  }

  try {
    error.value = null;
    auditing.value = true;
    report.value = null;
    resultCache.value.clear();

    const rawReport = await userStore.auditSEO(targetUrl.value);

    report.value = adaptSEOResults(rawReport);
  } catch (e: any) {
    error.value = e.message || 'An error occurred during analysis';
  } finally {
    auditing.value = false;
  }
};

const stopAudit = () => {
  auditing.value = false;
};

const adaptSEOData = (data: any): SEOResult => {
  const result: SEOResult = {
    title: data.seo?.title || data.title || '',
    viewport: data.seo?.meta?.viewport || data.viewport || '',
    description: data.seo?.description || data.description || '',
    headingStructure: data.seo?.headings || data.headingStructure || { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] },
    loadTime: data.performance?.loadTime || data.loadTime || 0,
    links: {
      internal: data.seo?.links?.internal || data.links?.internal || [],
      external: data.seo?.links?.external || data.links?.external || [],
      broken: data.seo?.links?.broken || data.links?.broken || 0,
      brokenLinks: data.seo?.links?.brokenLinks || data.links?.brokenLinks || [],
      nofollow: data.seo?.links?.nofollow || data.links?.nofollow || 0,
      nofollowLinks: data.seo?.links?.nofollowLinks || data.links?.nofollowLinks || [],
      externalLinks: data.seo?.links?.externalLinks || data.links?.externalLinks || [],
      internalLinks: data.seo?.links?.internalLinks || data.links?.internalLinks || []
    },
    coreWebVitals: {
      LCP: data.performance?.lcp || 0,
      FCP: data.performance?.fcp || 0,
      CLS: data.performance?.cls || 0,
      TTFB: data.performance?.ttfb || 0
    },
    mobileCompatibility: data.seo.meta.viewport || data.mobileCompatibility || { hasViewport: false, responsive: false },
    securityChecks: {
      https: data.technical?.https || data.securityChecks?.https || false,
      securityHeaders: data.technical?.response?.headers || data.securityChecks?.securityHeaders || [],
      securityIssues: data.technical?.security?.securityIssues || data.securityChecks?.securityIssues || [],
      securityScore: data.technical?.security?.score || data.securityChecks?.securityScore || 0,
      cookies: data.technical?.security?.cookies || data.securityChecks?.cookies || {
        secure: false,
        httpOnly: false,
        sameSite: false,
        score: 0
      }
    },
    socialTags: {
      ogTags: data?.seo?.meta?.og ?
        (Array.isArray(data.seo.meta.og) ?
          data.seo.meta.og :
          Object.entries(data.seo.meta.og || {}).map(([property, content]) => ({ property: `og:${property}`, content }))
        ) : (data?.socialTags?.ogTags || []),
      twitterTags: data?.seo?.meta?.twitter ?
        (Array.isArray(data.seo.meta.twitter) ?
          data.seo.meta.twitter :
          Object.entries(data.seo.meta.twitter || {}).map(([name, content]) => ({ name: `twitter:${name}`, content }))
        ) : (data?.socialTags?.twitterTags || [])
    },
    warnings: data.issues || [],
    structuredData: data.seo?.structuredData?.data || data.structuredData || [],
    contentStats: {
      readabilityScore: data.seo?.readabilityScore || data.readability || 0,
      wordCount: data.seo?.wordCount || data.wordCount || 0,
      keywordDensity: data.seo?.keywordDensity || data.keywordDensity || {}
    },
    engagement: data.engagement || {
      engagementScore: 0,
      ctaCount: 0,
      interactiveElements: 0,
      visualElements: 0,
      socialElements: 0,
      navigationScore: 0,
      readabilityScore: 0,
      engagementTechniques: {
        hasSocialLinks: false,
        hasCtaButtons: false,
        hasFormsOrInputs: false,
        hasVideos: false,
        hasImages: false,
        hasInteractiveElements: false,
        hasFeedbackMechanisms: false
      },
      issues: []
    },
    url: data.url || '',
    canonical: data.seo?.meta?.canonical || data.canonical || '',
    accessibility: data.accessibility || {
      missingAria: 0,
      missingAlt: 0,
      missingLabels: 0,
      missingInputAttributes: 0,
      contrastIssues: 0,
      ariaIssues: [],
      inputIssues: [],
      accessibilityScore: 0
    },
    images: {
      withAlt: data.seo?.images?.withAlt || data.images?.withAlt || 0,
      withoutAlt: data.seo?.images?.withoutAlt || data.images?.withoutAlt || 0,
      total: data.seo?.images?.total || data.images?.total || 0,
      data: data.seo?.images?.data || data.images?.data || []
    },
  };
  return result;
};

const adaptSEOResults = (apiResponse: any): SEOReport => {
  if (!apiResponse) return { seoResults: {}, visitedURLs: [], summary: undefined };

  const visitedURLs = apiResponse.visitedURLs || [];
  const seoResults: Record<string, SEOResult> = {};

  Object.entries(apiResponse.seoResults || {}).forEach(([url, data]) => {
    const adaptedData = adaptSEOData(data as any);

    if ((data as any).technicalSEO) {
      adaptedData.technicalSEO = (data as any).technicalSEO;
    } else if (url === visitedURLs[0]) {
      if (apiResponse.technicalSEO) {
        adaptedData.technicalSEO = apiResponse.technicalSEO;
      } else {
        adaptedData.technicalSEO = {
          sitemapFound: false,
          robotsTxtFound: false,
          schemaTypeCount: {}
        };
      }
    } else {
      adaptedData.technicalSEO = {
        sitemapFound: false,
        robotsTxtFound: false,
        schemaTypeCount: {}
      };
    }
    seoResults[url] = adaptedData;
  });

  const summary = calculateSummary(seoResults, visitedURLs);

  return {
    seoResults,
    visitedURLs,
    summary
  };
};

const calculateSummary = (seoResults: Record<string, SEOResult>, visitedURLs: string[]): any => {
  const results = Object.values(seoResults);
  const totalPages = results.length;

  if (totalPages === 0) return undefined;

  let totalLoadTime = 0;
  let totalFCP = 0;
  let totalLCP = 0;
  let totalCLS = 0;
  let totalTTFB = 0;
  let totalWarnings = 0;
  let missingTitles = 0;
  let missingDescriptions = 0;
  let missingAltTags = 0;
  let pagesWithStructuredData = 0;
  let pagesWithSocialTags = 0;
  let mobileCompatiblePages = 0;
  let securePages = 0;
  let missingAria = 0;
  let missingAlt = 0;
  let missingLabels = 0;
  let missingInputAttributes = 0;
  let contrastIssues = 0;
  let ariaIssues: Array<{ element: string, issue: string }> = [];
  let inputIssues: Array<{ element: string, issue: string }> = [];
  let accessibilityScore = 0;
  let totalSecurityScore = 0;
  let totalEngagementScore = 0;
  let pagesWithSecurityScore = 0;
  let pagesWithEngagementScore = 0;

  results.forEach(result => {
    totalLoadTime += result.loadTime || 0;
    totalFCP += result.coreWebVitals?.FCP || 0;
    totalLCP += result.coreWebVitals?.LCP || 0;
    totalCLS += result.coreWebVitals?.CLS || 0;
    totalTTFB += result.coreWebVitals?.TTFB || 0;
    totalWarnings += result.warnings?.length || 0;

    if (!result.title) missingTitles++;
    if (!result.description) missingDescriptions++;

    if (result.structuredData && result.structuredData.length > 0) {
      pagesWithStructuredData++;
    }

    if ((result.socialTags?.ogTags?.length ?? 0) > 0 || (result.socialTags?.twitterTags?.length ?? 0) > 0) {
      pagesWithSocialTags++;
    }

    if (result.mobileCompatibility?.hasViewport) mobileCompatiblePages++;

    if (result.securityChecks?.https) securePages++;

    if (result.accessibility) {
      missingAria += result.accessibility.missingAria;
      missingAlt += result.accessibility.missingAlt;
      missingLabels += result.accessibility.missingLabels;
      missingInputAttributes += result.accessibility.missingInputAttributes;
      contrastIssues += result.accessibility.contrastIssues;
      ariaIssues = [...(result.accessibility.ariaIssues || [])];
      inputIssues = [...(result.accessibility.inputIssues || [])];
      accessibilityScore = result.accessibility.accessibilityScore;
    }

    // Agrégation des scores de sécurité
    if (result.securityChecks?.securityScore !== undefined) {
      totalSecurityScore += result.securityChecks.securityScore;
      pagesWithSecurityScore++;
    }

    // Agrégation des scores d'engagement
    if (result.engagement?.engagementScore !== undefined) {
      totalEngagementScore += result.engagement.engagementScore;
      pagesWithEngagementScore++;
    }
  });

  const securityScore = pagesWithSecurityScore > 0 ? Math.round(totalSecurityScore / pagesWithSecurityScore) : 0;
  const engagementScore = pagesWithEngagementScore > 0 ? Math.round(totalEngagementScore / pagesWithEngagementScore) : 0;

  return {
    totalPages,
    averageLoadTime: totalLoadTime / totalPages,
    totalWarnings,
    missingTitles,
    missingDescriptions,
    missingAltTags,
    averageFCP: totalFCP / totalPages,
    averageLCP: totalLCP / totalPages,
    averageCLS: totalCLS / totalPages,
    averageTTFB: totalTTFB / totalPages,
    pagesWithStructuredData: Math.round((pagesWithStructuredData / totalPages) * 100),
    pagesWithSocialTags: Math.round((pagesWithSocialTags / totalPages) * 100),
    mobileCompatiblePages: Math.round((mobileCompatiblePages / totalPages) * 100),
    securePages: Math.round((securePages / totalPages) * 100),
    missingAria,
    missingAlt,
    missingLabels,
    missingInputAttributes,
    contrastIssues,
    ariaIssues,
    inputIssues,
    accessibilityScore,
    securityScore,
    engagementScore
  };
};

function formatVitalValue(value: number | undefined, name: string): string {
  if (value === undefined || value === 0) return 'N/A';

  if (name === 'CLS' || name === 'cumulativeLayoutShift') {
    return value.toFixed(3);
  }
  return (value / 1000).toFixed(2) + 's';
}

function getVitalScoreColor(score: number | undefined, name?: string): string {
  if (!score) return 'success';

  if (name === 'CLS' || name === 'cumulativeLayoutShift') {
    if (score <= 0.1) return 'success';
    if (score <= 0.25) return 'warning';
    return 'error';
  }

  if (score >= 90) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
}

const computeWarningCounts = (result: SEOResult) => {
  if (!result?.warnings) return { critical: 0, high: 0, medium: 0, low: 0, total: 0 };

  const warningMap = new Map<string, { severity: string, count: number }>();

  result.warnings.forEach(warning => {
    let type = '';
    let severity = '';

    if (typeof warning === 'string') {
      type = 'general';
      severity = 'medium';
    } else {
      type = warning.type || 'general';
      severity = warning.severity || 'medium';
    }

    const key = `${type}:${severity}`;
    if (warningMap.has(key)) {
      warningMap.get(key)!.count++;
    } else {
      warningMap.set(key, { severity, count: 1 });
    }
  });

  const counts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    total: 0
  };

  warningMap.forEach(item => {
    counts.total += item.count;

    switch (item.severity) {
      case 'critical':
        counts.critical += item.count;
        break;
      case 'high':
        counts.high += item.count;
        break;
      case 'medium':
        counts.medium += item.count;
        break;
      case 'low':
        counts.low += item.count;
        break;
      default:
        counts.medium += item.count;
    }
  });

  return counts;
};

const emptyResult: SEOResult = {
  title: '',
  description: '',
  headings: { h1: [], h2: [], h3: [] },
  images: { withAlt: 0, withoutAlt: 0, total: 0 },
  technical: {
    https: false,
    mobile: { viewport: false }
  },
  performance: { ttfb: 0, fcp: 0, lcp: 0, cls: 0, speedIndex: 0 },
  loadTime: 0,
  framework: { name: '', confidence: 0 },
  headingStructure: { h1: [], h2: [], h3: [] },
  coreWebVitals: {
    LCP: 0,
    FCP: 0,
    CLS: 0,
    TTFB: 0
  },
  mobileCompatibility: {
    hasViewport: false,
    smallTouchTargets: 0
  },
  securityChecks: {
    https: false,
    securityHeaders: []
  },
  socialTags: {
    ogTags: [],
    twitterTags: []
  },
  technicalSEO: {
    sitemapFound: false,
    robotsTxtFound: false,
    schemaTypeCount: {}
  },
  structuredData: [],
  warnings: [],
  contentStats: {
    readabilityScore: 0,
    wordCount: 0,
    keywordDensity: 0
  },
  wordCount: 0,
  readability: 0
};

const getResultFromCache = (url: string): SEOResult => {
  const result = report.value?.seoResults?.[url];
  if (!result) return emptyResult;

  const warningsFromIssues: Warning[] = result.issues?.map(issue => ({
    type: mapIssueTypeToWarningType(issue.type),
    message: issue.message,
    severity: issue.severity
  })) || [];

  const finalWarnings: Warning[] = result.warnings?.length ? result.warnings : warningsFromIssues;

  const adaptedResult: SEOResult = {
    ...emptyResult,
    ...result,

    title: result?.seo?.title || result?.title || '',
    canonical: result?.canonical || '',
    viewport: result?.seo?.meta?.viewport || result?.viewport || '',
    description: result?.seo?.description || result?.description || '',

    headings: result?.seo?.headings || result?.headings || { h1: [], h2: [], h3: [] },

    images: {
      withAlt: result?.seo?.images?.withAlt || result?.images?.withAlt || 0,
      withoutAlt: result?.seo?.images?.withoutAlt || result?.images?.withoutAlt || 0,
      total: result?.seo?.images?.total || result?.images?.total || 0,
      data: result?.seo?.images?.data || result?.images?.data || []
    },

    links: {
      internal: result?.seo?.links?.internal || result?.links?.internal || 0,
      external: result?.seo?.links?.external || result?.links?.external || 0,
      broken: result?.seo?.links?.broken || result?.links?.broken || 0,
      brokenLinks: result?.seo?.links?.brokenLinks || result?.links?.brokenLinks || [],
      nofollow: result?.seo?.links?.nofollow || result?.links?.nofollow || 0,
      externalLinks: result?.seo?.links?.externalLinks || result?.links?.externalLinks || [],
      internalLinks: result?.seo?.links?.internalLinks || result?.links?.internalLinks || [],
      nofollowLinks: result?.seo?.links?.nofollowLinks || result?.links?.nofollowLinks || []
    },

    loadTime: result?.performance?.loadTime || result?.loadTime || 0,

    framework: result?.framework || { name: '', confidence: 0 },

    coreWebVitals: {
      LCP: result?.performance?.lcp || result?.coreWebVitals?.LCP || 0,
      FCP: result?.performance?.fcp || result?.coreWebVitals?.FCP || 0,
      CLS: result?.performance?.cls || result?.coreWebVitals?.CLS || 0.1,
      TTFB: result?.performance?.ttfb || result?.coreWebVitals?.TTFB || 0
    },

    technicalSEO: result?.technicalSEO || {
      sitemapFound: false,
      robotsTxtFound: false,
      schemaTypeCount: {}
    },

    mobileCompatibility: {
      hasViewport: result?.technical?.mobile?.viewport ||
        (result?.mobileCompatibility?.hasViewport) || false,
      smallTouchTargets: result?.mobileCompatibility?.smallTouchTargets || 0
    },

    securityChecks: {
      https: result?.technical?.https || result?.securityChecks?.https || false,
      securityHeaders: result?.technical?.security?.headers ||
        result?.securityChecks?.securityHeaders || [],
      securityIssues: result?.technical?.security?.securityIssues ||
        result?.securityChecks?.securityIssues || [],
      securityScore: result?.technical?.security?.score ||
        result?.securityChecks?.securityScore || 0,
      cookies: result?.technical?.security?.cookies ||
        result?.securityChecks?.cookies || {
        secure: false,
        httpOnly: false,
        sameSite: false,
        score: 0
      }
    },

    socialTags: {
      ogTags: result?.seo?.meta?.og ?
        (Array.isArray(result.seo.meta.og) ?
          result.seo.meta.og :
          Object.entries(result.seo.meta.og || {}).map(([property, content]) => ({ property: `og:${property}`, content }))
        ) : (result?.socialTags?.ogTags || []),
      twitterTags: result?.seo?.meta?.twitter ?
        (Array.isArray(result.seo.meta.twitter) ?
          result.seo.meta.twitter :
          Object.entries(result.seo.meta.twitter || {}).map(([name, content]) => ({ name: `twitter:${name}`, content }))
        ) : (result?.socialTags?.twitterTags || [])
    },

    engagement: result?.engagement || {
      engagementScore: 0,
      ctaCount: 0,
      interactiveElements: 0,
      visualElements: 0,
      socialElements: 0,
      navigationScore: 0,
      readabilityScore: 0,
      engagementTechniques: {
        hasSocialLinks: false,
        hasCtaButtons: false,
        hasFormsOrInputs: false,
        hasVideos: false,
        hasImages: false,
        hasInteractiveElements: false,
        hasFeedbackMechanisms: false
      },
      issues: []
    },

    warnings: finalWarnings,

    contentStats: {
      readabilityScore: result?.seo?.readabilityScore || result?.contentStats?.readabilityScore || 0,
      wordCount: result?.seo?.wordCount || result?.contentStats?.wordCount || 0,
      keywordDensity: result?.seo?.keywordDensity || result?.contentStats?.keywordDensity || 0
    },

    structuredData: result?.seo?.structuredData?.data || result?.structuredData || [],

    wordCount: result?.seo?.wordCount || result?.wordCount || 0,
    readability: result?.seo?.readabilityScore || result?.readability || 0,
    url: result?.url || url
  };

  if (result.accessibility) {
    adaptedResult.accessibility = result.accessibility;
  }
  return adaptedResult;
};

function mapIssueTypeToWarningType(issueType: string): string {
  const typeMapping: Record<string, string> = {
    'error': 'general',
    'warning': 'general',

    'title': 'title',
    'description': 'description',
    'h1': 'h1',
    'content': 'content',

    'image': 'image',

    'performance': 'performance',
    'technical': 'technical',
    'security': 'security',
    'mobile': 'mobile',
    'accessibility': 'accessibility',
    'social': 'social',
    'schema': 'schema',
    'structured-data': 'schema',
    'links': 'links'
  };

  return typeMapping[issueType] || 'general';
}

const generateSitemap = downloadSitemap;

onMounted(() => {
});

const extractImagesFromSitemap = (): Record<string, Array<{ url: string, title?: string, alt?: string }>> => {
  if (!sitemapPreview.value) return {};

  const imagesByUrl: Record<string, Array<{ url: string, title?: string, alt?: string }>> = {};

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");

    const urlElements = xmlDoc.getElementsByTagName("url");

    for (let i = 0; i < urlElements.length; i++) {
      const urlElement = urlElements[i];
      const locElement = urlElement.getElementsByTagName("loc")[0];

      if (locElement && locElement.textContent) {
        const pageUrl = locElement.textContent;
        const imageElements = urlElement.getElementsByTagNameNS("http://www.google.com/schemas/sitemap-image/1.1", "image");

        if (imageElements.length > 0) {
          imagesByUrl[pageUrl] = [];

          for (let j = 0; j < imageElements.length; j++) {
            const imageElement = imageElements[j];
          }
        }
      }
    }
    return imagesByUrl;
  } catch (e) {
    console.error("Error during image extraction from sitemap:", e);
    return {};
  }
};

const isSitemapDialog = ref(false);
const sitemapTab = ref('code');


const getTotalUrlsInSitemap = (): number => {
  return extractUrlsFromSitemap().length;
};

const getCoreWebVitalsFormatted = (url: string): { name: string; value: string; color: string }[] => {
  const vitals = getResultFromCache(url)?.coreWebVitals || {};

  const metrics = [
    { key: 'LCP', name: 'Largest Contentful Paint' },
    { key: 'FCP', name: 'First Contentful Paint' },
    { key: 'CLS', name: 'Cumulative Layout Shift' },
    { key: 'TTFB', name: 'Time to First Byte' }
  ];

  return metrics.map(metric => {
    const value = vitals[metric.key];
    return {
      name: metric.name,
      value: formatVitalValue(value, metric.key),
      color: getVitalScoreColor(value, metric.key)
    };
  });
};

function calculateStructuredDataPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const pagesWithStructuredData = report.summary.pagesWithStructuredData || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (pagesWithStructuredData / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateSocialTagsPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const pagesWithSocialTags = report.summary.pagesWithSocialTags || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (pagesWithSocialTags / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateMobileCompatibilityPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const mobileCompatiblePages = report.summary.mobileCompatiblePages || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (mobileCompatiblePages / totalPages) * 100;

  return normalizePercentage(percentage);
}

function calculateHttpsPercentage(report: any): number {
  if (!report || !report.summary || !report.summary.totalPages) {
    return 0;
  }

  const securePages = report.summary.securePages || 0;
  const totalPages = report.summary.totalPages || 1;
  const percentage = (securePages / totalPages) * 100;

  return normalizePercentage(percentage);
}

function normalizePercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

const extractUrlsFromSitemap = (): string[] => {
  if (!sitemapPreview.value) return [];

  const urls: string[] = [];

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sitemapPreview.value, "text/xml");

    const urlElements = xmlDoc.getElementsByTagName("url");

    for (let i = 0; i < urlElements.length; i++) {
      const urlElement = urlElements[i];
      const locElement = urlElement.getElementsByTagName("loc")[0];

      if (locElement && locElement.textContent) {
        urls.push(locElement.textContent);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'extraction des URLs du sitemap:", error);
  }

  return urls;
};

const formatMetricValue = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';
  if (numValue < 0.01) return numValue.toFixed(3);
  return numValue.toFixed(2);
};

const getMetricScore = (value: string | number): number => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 0;
  return Math.min(100, Math.max(0, numValue * 100));
};

const schemaDialog = ref(false)
const selectedSchema = ref<any[]>([])
const activeSchemaTab = ref(0)

function showSchemaDetails(schemas: any[]) {
  selectedSchema.value = Array.isArray(schemas) ? schemas : [schemas]
  schemaDialog.value = true
}

</script>

<style scoped>
.landing-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.skeleton-container .v-skeleton-loader {
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-container .v-skeleton-loader__text,
.skeleton-container .v-skeleton-loader__button,
.skeleton-container .v-skeleton-loader__avatar,
.skeleton-container .v-skeleton-loader__list-item,
.skeleton-container .v-skeleton-loader__card,
.skeleton-container .v-skeleton-loader__card-avatar {
  animation: skeletonPulse 1.5s ease-in-out infinite;
  background: linear-gradient(90deg,
      rgba(var(--v-theme-surface-variant), 0.1),
      rgba(var(--v-theme-surface-variant), 0.3),
      rgba(var(--v-theme-surface-variant), 0.1));
  background-size: 200% 100%;
}

@keyframes skeletonPulse {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.v-card.border-primary-subtle {
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.v-card.border-info-subtle {
  border-left: 3px solid rgb(var(--v-theme-info));
}

.v-card.border-warning-subtle {
  border-left: 3px solid rgb(var(--v-theme-warning));
}

.v-card.border-success-subtle {
  border-left: 3px solid rgb(var(--v-theme-success));
}

.v-card.border-error-subtle {
  border-left: 3px solid rgb(var(--v-theme-error));
}

.sitemap-window {
  max-height: 80vh;
  overflow-y: auto;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word !important;
  overflow-wrap: break-word !important;
  max-width: 100% !important;
}

.v-chip {
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.v-list-item {
  min-height: unset !important;
  padding: 8px !important;
}

.v-list-item-title,
.v-list-item-subtitle {
  white-space: normal !important;
  word-break: break-word !important;
  display: block !important;
  width: 100% !important;
  overflow: visible !important;
}

.schema-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
}

.min-width-120 {
  min-width: 120px;
}

.schema-json {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.schema-detail {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
