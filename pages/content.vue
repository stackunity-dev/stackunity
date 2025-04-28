<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-2">Content analysis</h1>
          <p class="text-subtitle-1 mb-6">
            Analyze the structure and quality of your web pages to improve your SEO.
          </p>

          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeContent">
                <v-text-field v-model="url" label="URL of the site to analyze" placeholder="https://example.com"
                  hint="Enter the complete URL including https://" persistent-hint prepend-inner-icon="mdi-web"
                  variant="outlined" required autocomplete="url" aria-label="URL of the site to analyze"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || 'Please enter a valid URL starting with http:// or https://']"></v-text-field>

                <v-checkbox v-model="crawlEnabled" label="Analyze also linked pages" hint="Limit: 10 URLs maximum"
                  persistent-hint aria-label="Enable linked pages exploration"></v-checkbox>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!isValidUrl"
                    prepend-icon="mdi-magnify" aria-label="Analyze content">
                    Analyze content
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <v-progress-linear v-if="loading" color="primary" indeterminate
            aria-label="Analyze in progress"></v-progress-linear>

          <v-alert v-if="error" type="error" variant="tonal" closable class="mb-6" role="alert">
            {{ error }}
          </v-alert>

          <v-card v-if="results.length > 1 && !loading" class="mb-6 bg-surface">
            <v-card-title class="text-subtitle-1 d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-icon start aria-hidden="true" class="mr-2">mdi-chart-areaspline</v-icon>
                <span>Average content score</span>
              </div>
              <v-btn size="small" variant="text" density="comfortable" color="primary" prepend-icon="mdi-download"
                @click="exportScoreData" aria-label="Export score data">
                Export
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center">
                <v-progress-circular :model-value="getAverageContentScore()"
                  :color="getContentScoreColor(getAverageContentScore())" size="100" width="12"
                  aria-label="Average content score" class="mr-4">
                  <span class="text-h6 font-weight-bold">{{ getAverageContentScore() }}%</span>
                </v-progress-circular>
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ getContentScoreLabel(getAverageContentScore()) }}
                  </div>
                  <div class="text-body-2 mb-2">
                    Average score calculated from {{ results.length }} analyzed pages
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-chip v-bind="props" size="x-small" :color="getScoreTrendColor()" variant="outlined"
                          class="ml-2">
                          <v-icon size="x-small" start>{{ getScoreTrendIcon() }}</v-icon>
                          {{ getScoreTrendLabel() }}
                        </v-chip>
                      </template>
                      <span>
                        {{ getScoreTrendTooltip() }}
                      </span>
                    </v-tooltip>
                  </div>
                  <v-progress-linear :model-value="getAverageContentScore()"
                    :color="getContentScoreColor(getAverageContentScore())" height="10" rounded
                    aria-label="Average content score"></v-progress-linear>
                </div>
              </div>

              <v-alert v-if="getLowestScoringPage() && results.length > 1" color="info" variant="tonal" class="mt-4"
                icon="mdi-lightbulb-on">
                <div class="text-subtitle-2 font-weight-bold mb-1">Improvement priority</div>
                <p>The page with the lowest score ({{ calculateContentScore(getLowestScoringPage() || {}) }}%) is <a
                    :href="getLowestScoringPage()?.url || ''" target="_blank" rel="noopener noreferrer">{{
                      truncateUrl(getLowestScoringPage()?.url || '', 50) }} <v-icon size="x-small"
                      class="ml-1">mdi-open-in-new</v-icon></a></p>
                <v-chip v-if="getLowestScoringPageMainIssue()" size="small" class="mt-2">
                  <template v-slot:prepend>
                    <v-icon size="x-small" class="mr-2">mdi-alert-circle</v-icon>
                  </template>
                  {{ getLowestScoringPageMainIssue() }}
                </v-chip>
              </v-alert>
            </v-card-text>
          </v-card>

          <div v-if="results.length > 0 && !loading">

            <v-expansion-panels v-model="openPanel">
              <v-expansion-panel v-for="(result, index) in results" :key="index" :value="index" :title="`${result.url}`"
                :text="getContentScoreLabel(calculateContentScore(result))">
                <template v-slot:title>
                  <div class="d-flex align-center">
                    <span>{{ truncateUrl(result.url || '', 40) }}</span>
                  </div>
                </template>
                <v-expansion-panel-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-chart-donut</v-icon>
                          Content score
                        </v-card-title>
                        <v-card-text>
                          <div class="d-flex justify-center align-center">
                            <v-progress-circular :model-value="calculateContentScore(result)"
                              :color="getContentScoreColor(calculateContentScore(result))" size="100" width="12"
                              aria-label="Content score">
                              <span class="text-h6 font-weight-bold">{{ calculateContentScore(result) }}%</span>
                            </v-progress-circular>
                          </div>
                          <div class="text-center mt-4">
                            <p class="text-h6" :class="`text-${getContentScoreColor(calculateContentScore(result))}`">
                              {{ getContentScoreLabel(calculateContentScore(result)) }}
                            </p>
                          </div>
                        </v-card-text>
                      </v-card>

                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-text</v-icon>
                          Content statistics
                        </v-card-title>
                        <v-card-text>
                          <v-list density="compact">
                            <v-list-item>
                              <v-list-item-title>Number of words</v-list-item-title>
                              <v-list-item-subtitle class="d-flex align-center">
                                <span>{{ result?.contentStats?.wordCount || 0 }}</span>
                                <v-chip size="x-small" :color="getWordCountColor(result?.contentStats?.wordCount || 0)"
                                  class="ml-2">
                                  {{ getWordCountRating(result?.contentStats?.wordCount || 0) }}
                                </v-chip>
                              </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-title>Readability score</v-list-item-title>
                              <v-list-item-subtitle class="d-flex align-center">
                                <span>{{ (result?.contentStats?.readabilityScore || 0).toFixed(1) }}</span>
                                <v-chip size="x-small"
                                  :color="getReadabilityColor(result?.contentStats?.readabilityScore || 0)"
                                  class="ml-2">
                                  {{ getReadabilityRating(result?.contentStats?.readabilityScore || 0) }}
                                </v-chip>
                              </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item v-if="getHeadingCount(result) > 0">
                              <v-list-item-title>Headings detected</v-list-item-title>
                              <v-list-item-subtitle>
                                H1: {{ result?.headingStructure?.h1?.length || 0 }},
                                H2: {{ result?.headingStructure?.h2?.length || 0 }},
                                H3: {{ result?.headingStructure?.h3?.length || 0 }},
                                H4+: {{ (result?.headingStructure?.h4?.length || 0) +
                                  (result?.headingStructure?.h5?.length || 0) +
                                  (result?.headingStructure?.h6?.length || 0) }}
                              </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item v-if="getLinkCount(result) > 0">
                              <v-list-item-title>Links</v-list-item-title>
                              <v-list-item-subtitle>
                                Internal: {{ Array.isArray(result?.links?.internal) ? result.links.internal.length : 0
                                }},
                                External: {{ Array.isArray(result?.links?.external) ? result.links.external.length : 0
                                }}
                              </v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-format-header-pound</v-icon>
                          Heading structure
                        </v-card-title>
                        <v-card-text>
                          <div v-if="!hasHeadings(result)" class="text-center pa-4">
                            <v-icon color="warning" class="mb-2" size="large" aria-hidden="true">mdi-alert</v-icon>
                            <p>No headings (H1-H6) detected on this page.</p>
                          </div>
                          <div v-else>
                            <div class="heading-structure pa-2">
                              <div v-if="result?.headingStructure?.h1?.length" class="heading-item mb-2">
                                <div class="heading-label">H1</div>
                                <div class="heading-content" v-for="(h1, i) in result.headingStructure.h1"
                                  :key="`h1-${i}`">
                                  {{ h1 }}
                                </div>
                              </div>

                              <div v-if="result?.headingStructure?.h2?.length" class="heading-item mb-2 pl-4">
                                <div class="heading-label">H2</div>
                                <div class="heading-content" v-for="(h2, i) in result.headingStructure.h2"
                                  :key="`h2-${i}`">
                                  {{ h2 }}
                                </div>
                              </div>

                              <div v-if="result?.headingStructure?.h3?.length" class="heading-item mb-2 pl-8">
                                <div class="heading-label">H3</div>
                                <div class="heading-content" v-for="(h3, i) in result.headingStructure.h3"
                                  :key="`h3-${i}`">
                                  {{ h3 }}
                                </div>
                              </div>

                              <div v-if="result?.headingStructure?.h4?.length" class="heading-item mb-2 pl-12">
                                <div class="heading-label">H4</div>
                                <div class="heading-content" v-for="(h4, i) in result.headingStructure.h4"
                                  :key="`h4-${i}`">
                                  {{ h4 }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>

                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-alert-circle</v-icon>
                          Detected issues
                        </v-card-title>
                        <v-card-text>
                          <div v-if="getContentIssues(result).length === 0" class="text-center pa-4">
                            <v-icon color="success" class="mb-2" size="large"
                              aria-hidden="true">mdi-check-circle</v-icon>
                            <p>No major issues detected in the content.</p>
                          </div>
                          <v-list v-else density="compact">
                            <v-list-item v-for="(issue, idx) in getContentIssues(result)" :key="idx">
                              <template v-slot:prepend>
                                <v-icon :color="getSeverityColor(issue.severity)" size="small" aria-hidden="true">
                                  {{ getSeverityIcon(issue.severity) }}
                                </v-icon>
                              </template>
                              <v-list-item-title>{{ issue.title }}</v-list-item-title>
                              <v-list-item-subtitle>{{ issue.description }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-card>

                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-lightbulb-on</v-icon>
                          Recommendations
                        </v-card-title>
                        <v-card-text>
                          <div class="d-flex align-center mb-4">
                            <v-progress-linear :model-value="calculateContentScore(result)"
                              :color="getContentScoreColor(calculateContentScore(result))" height="10" rounded
                              class="flex-grow-1">
                            </v-progress-linear>
                            <span class="text-subtitle-1 font-weight-bold ml-3">{{ calculateContentScore(result)
                              }}%</span>
                          </div>

                          <v-alert v-if="calculateContentScore(result) >= 90" color="success" variant="tonal"
                            class="mb-3">
                            <div class="text-subtitle-1 font-weight-bold mb-2">Excellent content quality</div>
                            <p>Your content is well-structured and optimized for SEO. Keep up the good work!</p>
                          </v-alert>

                          <v-expansion-panels variant="accordion">
                            <v-expansion-panel>
                              <v-expansion-panel-title>
                                <div class="d-flex align-center">
                                  <v-icon color="primary" class="mr-2">mdi-arrow-up-bold-circle</v-icon>
                                  <span>How to improve your content</span>
                                </div>
                              </v-expansion-panel-title>
                              <v-expansion-panel-text>
                                <v-list class="recommendation-list">
                                  <v-list-item
                                    v-if="result?.contentStats?.wordCount && result.contentStats.wordCount < 800">
                                    <v-list-item-title class="font-weight-bold">Add more content</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Your content has {{ result.contentStats.wordCount }} words. Consider expanding to
                                      at least 800-1000 words for better SEO performance.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!result?.headingStructure?.h1 || !result.headingStructure.h1.length">
                                    <v-list-item-title class="font-weight-bold">Add an H1 heading</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Every page should have exactly one H1 heading that clearly describes the page
                                      content.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item v-else-if="result.headingStructure.h1.length > 1">
                                    <v-list-item-title class="font-weight-bold">Use only one H1
                                      heading</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Your page has {{ result.headingStructure.h1.length }} H1 headings. For better SEO,
                                      use exactly one
                                      H1 and structure other headings with H2-H6.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!result?.headingStructure?.h2 || !result.headingStructure.h2.length">
                                    <v-list-item-title class="font-weight-bold">Add H2 subheadings</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Use H2 subheadings to break your content into logical sections for better
                                      readability and SEO.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item v-if="result?.images?.withoutAlt && result.images.withoutAlt > 0">
                                    <v-list-item-title class="font-weight-bold">Add alt text to
                                      images</v-list-item-title>
                                    <v-list-item-subtitle>
                                      {{ result.images.withoutAlt }} image(s) missing alt text. Add descriptive alt text
                                      to all images
                                      for better accessibility and SEO.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="result?.contentStats?.readabilityScore && result.contentStats.readabilityScore < 70">
                                    <v-list-item-title class="font-weight-bold">Improve readability</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Your content has a readability score of {{
                                        result.contentStats.readabilityScore.toFixed(1) }}. Try
                                      using shorter sentences and simpler language.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!Array.isArray(result?.links?.internal) || !result.links.internal.length">
                                    <v-list-item-title class="font-weight-bold">Add internal links</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Add links to other relevant pages on your site to improve navigation and SEO.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!Array.isArray(result?.links?.external) || !result.links.external.length">
                                    <v-list-item-title class="font-weight-bold">Add external links</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Link to authoritative external sources to increase credibility and SEO value.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="getContentIssues(result).length === 0 && calculateContentScore(result) < 90">
                                    <v-list-item-title class="font-weight-bold">General improvements</v-list-item-title>
                                    <v-list-item-subtitle>
                                      - Use more varied and engaging language<br>
                                      - Add multimedia elements (images, videos, infographics)<br>
                                      - Include specific examples and data to support your points<br>
                                      - Structure content with clear introduction and conclusion
                                    </v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel>
                              <v-expansion-panel-title>
                                <div class="d-flex align-center">
                                  <v-icon color="info" class="mr-2">mdi-rocket-launch</v-icon>
                                  <span>SEO optimization tips</span>
                                </div>
                              </v-expansion-panel-title>
                              <v-expansion-panel-text>
                                <v-list>
                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Use target keywords</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Include your main keyword in the title, H1 heading, first paragraph, and
                                      throughout the content
                                      naturally.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Optimize meta
                                      description</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Create a compelling meta description (150-160 characters) that includes your
                                      target keyword.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Improve page speed</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Optimize images, reduce scripts, and leverage browser caching to improve page load
                                      times.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Mobile optimization</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Ensure your page is fully responsive and provides a good user experience on mobile
                                      devices.
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">Use schema markup</v-list-item-title>
                                    <v-list-item-subtitle>
                                      Implement appropriate schema.org markup to help search engines understand your
                                      content better.
                                    </v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-expansion-panel-text>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <v-row v-if="result?.images?.data && result?.images?.data.length > 0">
                    <v-col cols="12">
                      <v-card variant="outlined" class="mb-4">
                        <v-card-title class="text-subtitle-1">
                          <v-icon start aria-hidden="true">mdi-image</v-icon>
                          Images ({{ result.images.data.length }})
                        </v-card-title>
                        <v-card-text>
                          <v-table density="compact">
                            <thead>
                              <tr>
                                <th scope="col" width="80">Preview</th>
                                <th scope="col">Source</th>
                                <th scope="col" width="120">Alt</th>
                                <th scope="col" width="100">Dimensions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(img, idx) in result.images.data" :key="idx">
                                <td class="text-center">
                                  <v-img :src="img.src || ''" max-width="60" max-height="60" class="mx-auto"
                                    :alt="img.alt || 'Image without alternative text'"></v-img>
                                </td>
                                <td><a :href="img.src || '#'" target="_blank" rel="noopener">{{ truncateUrl(img.src ||
                                  '', 40)
                                    }}</a></td>
                                <td>
                                  <v-chip size="x-small" :color="img.alt ? 'success' : 'error'">
                                    {{ img.alt ? 'Present' : 'Missing' }}
                                  </v-chip>
                                  <small v-if="img.alt" class="d-block mt-1">{{ truncateText(img.alt, 20) }}</small>
                                </td>
                                <td>{{ img.width || 'N/A' }} × {{ img.height || 'N/A' }}</td>
                              </tr>
                            </tbody>
                          </v-table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import {
  calculateContentScore,
  checkContentBestPractices,
  ContentIssue,
  getContentScoreColor,
  getContentScoreLabel,
  getReadabilityColor,
  getReadabilityRating,
  getSeverityColor,
  getSeverityIcon,
  getWordCountColor,
  getWordCountRating,
  truncateText,
  truncateUrl
} from '../utils/seo/content-view';
import { SEOResult } from '../utils/seo/types';

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Content analysis - StackUnity',
  meta: [
    { name: 'description', content: 'Analyze the structure and quality of your web pages to improve your SEO.' },
    { property: 'og:title', content: 'Content analysis - StackUnity' },
    { property: 'og:description', content: 'Analyze the structure and quality of your web pages to improve your SEO.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Content analysis - StackUnity' },
    { name: 'twitter:description', content: 'Analyze the structure and quality of your web pages to improve your SEO.' }
  ]
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const url = computed(() => websiteData.value?.main_url || '');
const loading = ref(false);
const error = ref('');
const results = ref<SEOResult[]>([]);
const openPanel = ref(0);
const crawlEnabled = ref(true);

const isValidUrl = computed(() => {
  try {
    const urlObj = new URL(url.value);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
});

const getAverageContentScore = (): number => {
  if (results.value.length === 0) return 0;

  const sum = results.value.reduce((acc, result) => {
    return acc + calculateContentScore(result);
  }, 0);

  return Math.round(sum / results.value.length);
};

const getLowestScoringPage = (): SEOResult | null => {
  if (results.value.length === 0) return null;

  return results.value.reduce((lowest, current) => {
    return calculateContentScore(current) < calculateContentScore(lowest) ? current : lowest;
  }, results.value[0]);
};

const getLowestScoringPageMainIssue = (): string => {
  const page = getLowestScoringPage();
  if (!page) return '';

  if (!page.headingStructure?.h1 || page.headingStructure.h1.length === 0) {
    return 'No H1 heading detected';
  }

  if (page.contentStats?.wordCount && page.contentStats.wordCount < 300) {
    return 'Content too short (' + page.contentStats.wordCount + ' words)';
  }

  if (page.headingStructure?.h1 && page.headingStructure.h1.length > 1) {
    return 'Too many H1 headings (' + page.headingStructure.h1.length + ')';
  }

  if (!page.headingStructure?.h2 || page.headingStructure.h2.length === 0) {
    return 'No H2 subheading detected';
  }

  if (page.contentStats?.readabilityScore && page.contentStats.readabilityScore < 50) {
    return 'Low readability (score: ' + page.contentStats.readabilityScore.toFixed(1) + ')';
  }

  if (page.images?.withoutAlt && page.images.withoutAlt > 0) {
    return page.images.withoutAlt + ' image(s) without alternative text';
  }

  return 'Content structure to improve';
};

const getScoreTrendIcon = (): string => {
  if (results.value.length <= 1) return 'mdi-minus';

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();

  if (Math.abs(mainPageScore - avgScore) < 5) return 'mdi-equal';
  return mainPageScore > avgScore ? 'mdi-arrow-down' : 'mdi-arrow-up';
};

const getScoreTrendColor = (): string => {
  if (results.value.length <= 1) return 'primary';

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();

  if (Math.abs(mainPageScore - avgScore) < 5) return 'info';
  return mainPageScore > avgScore ? 'error' : 'success';
};

const getScoreTrendLabel = (): string => {
  if (results.value.length <= 1) return 'Stable';

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();

  if (Math.abs(mainPageScore - avgScore) < 5) return 'Stable';
  return mainPageScore > avgScore ? 'Decrease' : 'Increase';
};

const getScoreTrendTooltip = (): string => {
  if (results.value.length <= 1) return 'Not enough data to determine a trend';

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();
  const diff = Math.abs(mainPageScore - avgScore);

  if (diff < 5) {
    return 'The linked pages have a similar quality to the main page';
  } else if (mainPageScore > avgScore) {
    return `The main page has a score ${diff} points higher than the average of the linked pages`;
  } else {
    return `The average of the linked pages has a score ${diff} points higher than the main page`;
  }
};

const getHeadingCount = (result: SEOResult | null): number => {
  if (!result || !result.headingStructure) return 0;

  return (
    (result.headingStructure.h1?.length || 0) +
    (result.headingStructure.h2?.length || 0) +
    (result.headingStructure.h3?.length || 0) +
    (result.headingStructure.h4?.length || 0) +
    (result.headingStructure.h5?.length || 0) +
    (result.headingStructure.h6?.length || 0)
  );
};

const getLinkCount = (result: SEOResult | null): number => {
  if (!result || !result.links) return 0;

  return (
    (Array.isArray(result.links.internal) ? result.links.internal.length : 0) +
    (Array.isArray(result.links.external) ? result.links.external.length : 0)
  );
};

const hasHeadings = (result: SEOResult | null): boolean => {
  if (!result || !result.headingStructure) return false;

  const headings = result.headingStructure;
  return !!(
    (headings.h1 && headings.h1.length > 0) ||
    (headings.h2 && headings.h2.length > 0) ||
    (headings.h3 && headings.h3.length > 0) ||
    (headings.h4 && headings.h4.length > 0) ||
    (headings.h5 && headings.h5.length > 0) ||
    (headings.h6 && headings.h6.length > 0)
  );
};

const getContentIssues = (result: SEOResult): ContentIssue[] => {
  if (!result) return [];
  return checkContentBestPractices(result);
};

const analyzeContent = async () => {
  if (!isValidUrl.value) {
    error.value = 'Please enter a valid URL starting with http:// or https://';
    return;
  }

  loading.value = true;
  error.value = '';
  results.value = [];

  try {
    const response = await fetch(`/api/analyze/content-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url.value, crawl: crawlEnabled.value })
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.urlList && Array.isArray(data.urlList) && data.urlList.length > 0) {
      results.value.push(data);

      for (const pageUrl of data.urlList) {
        if (pageUrl !== data.url) {
          try {
            const pageResponse = await fetch(`/api/analyze/content-view`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ url: pageUrl })
            });

            if (pageResponse.ok) {
              const pageData = await pageResponse.json();
              results.value.push(pageData);
            }
          } catch (e) {
            console.error(`Erreur lors de l'analyse de ${pageUrl}:`, e);
          }
        }
      }
    } else {
      results.value.push(data);
    }

    openPanel.value = 0;
  } catch (e) {
    console.error('Erreur lors de l\'analyse:', e);
    error.value = e instanceof Error ? e.message : 'An error occurred during the analysis';
    results.value = [];
  } finally {
    loading.value = false;
  }
};

const exportScoreData = () => {
  if (results.value.length === 0) return;

  const headers = 'URL;Score;Number of words;Readability score;Number of H1;Number of H2;Number of H3;Number of internal links;Number of external links\n';

  const csvData = results.value.map(result => {
    return [
      `"${result.url}"`,
      calculateContentScore(result),
      result.contentStats?.wordCount || 0,
      (result.contentStats?.readabilityScore || 0).toFixed(1),
      result.headingStructure?.h1?.length || 0,
      result.headingStructure?.h2?.length || 0,
      result.headingStructure?.h3?.length || 0,
      Array.isArray(result.links?.internal) ? result.links.internal.length : 0,
      Array.isArray(result.links?.external) ? result.links.external.length : 0
    ].join(';');
  }).join('\n');

  const BOM = '\uFEFF';
  const csvContent = `data:text/csv;charset=utf-8,${BOM}${headers}${csvData}`;

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `content-scores-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};


onMounted(() => {
});
</script>

<style scoped>
.heading-structure {
  border-left: 3px solid var(--v-primary-base);
  margin-left: 10px;
}

.heading-item {
  margin-bottom: 8px;
}

.heading-label {
  font-weight: bold;
  color: var(--v-primary-darken-1);
  margin-bottom: 4px;
}

.heading-content {
  background-color: rgba(var(--v-primary-base), 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.recommendation-list .v-list-item {
  margin-bottom: 8px;
}

.wrap-text {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
  word-wrap: break-word !important;
  hyphens: auto !important;
  max-width: 100% !important;
}
</style>