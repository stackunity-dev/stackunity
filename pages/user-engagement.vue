<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-2">User Engagement Analysis</h1>
          <p class="text-body-1">analyze the potential user engagement on your website</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeUrl">
                <v-text-field v-model="url" label="URL du site à analyser" placeholder="https://example.com"
                  hint="Enter the complete URL including https://" persistent-hint prepend-inner-icon="mdi-web"
                  variant="outlined" required autocomplete="url" aria-label="URL to analyze"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || 'Please enter a valid URL starting with http:// or https://']"></v-text-field>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!url"
                    prepend-icon="mdi-magnify" aria-label="Analyze content">
                    Analyze content
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col cols="12">
          <v-skeleton-loader type="article, actions" />
          <v-row>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" />
            </v-col>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>
          <v-skeleton-loader type="table" />
        </v-col>
      </v-row>

      <v-row v-else-if="results.length">
        <v-col cols="12">
          <h2>Analysis results</h2>

          <v-card class="mb-6 bg-surface">
            <v-card-title class="d-flex align-center">
              <v-icon icon="mdi-chart-line" class="mr-2" color="primary" />
              Average engagement score
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-progress-circular :model-value="avgEngagementScore" :color="getScoreColor(avgEngagementScore)"
                    size="120" width="12" class="mx-auto d-block">
                    <span class="text-h6 font-weight-bold">{{ avgEngagementScore }}%</span>
                  </v-progress-circular>
                </v-col>
                <v-col cols="12" md="6">
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-cursor-pointer" color="primary" />
                      </template>
                      <v-list-item-title>Average CTA count</v-list-item-title>
                      <v-list-item-subtitle>{{ avgCtaCount }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-gesture-tap" color="primary" />
                      </template>
                      <v-list-item-title>Average interactive elements</v-list-item-title>
                      <v-list-item-subtitle>{{ avgInteractiveElements }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon icon="mdi-share-variant" color="primary" />
                      </template>
                      <v-list-item-title>Average social elements</v-list-item-title>
                      <v-list-item-subtitle>{{ avgSocialElements }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-expansion-panels>
            <v-expansion-panel v-for="(result, index) in results" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="8" class="text-body-1">{{ result.url }}</v-col>
                  <v-col cols="4" class="text-right">
                    <v-chip :color="getScoreColor(result.score)" class="mr-2">
                      Score: {{ result.score }}%
                    </v-chip>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-tabs v-model="activeTab" color="primary">
                  <v-tab value="engagement">Engagement elements</v-tab>
                  <v-tab value="issues">Detected issues</v-tab>
                  <v-tab value="techniques">Engagement techniques</v-tab>
                  <v-tab value="details">Detailed elements</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="engagement">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title>Engagement statistics</v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-cursor-pointer" color="primary" />
                                </template>
                                <v-list-item-title>Action calls (CTA)</v-list-item-title>
                                <v-list-item-subtitle>{{ result.ctaCount }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-gesture-tap" color="primary" />
                                </template>
                                <v-list-item-title>Interactive elements</v-list-item-title>
                                <v-list-item-subtitle>{{ result.interactiveElements }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-image-multiple" color="primary" />
                                </template>
                                <v-list-item-title>Visual elements</v-list-item-title>
                                <v-list-item-subtitle>{{ result.visualElements }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-share-variant" color="primary" />
                                </template>
                                <v-list-item-title>Social elements</v-list-item-title>
                                <v-list-item-subtitle>{{ result.socialElements }}</v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title>Detailed scores</v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-navigation" :color="getScoreColor(result.navigationScore)" />
                                </template>
                                <v-list-item-title>Navigation</v-list-item-title>
                                <v-list-item-subtitle>
                                  <v-progress-linear :model-value="result.navigationScore"
                                    :color="getScoreColor(result.navigationScore)" height="10" rounded>
                                    <template v-slot:default="{ value }">
                                      <span class="white--text">{{ Math.ceil(value) }}%</span>
                                    </template>
                                  </v-progress-linear>
                                </v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-book-open-variant"
                                    :color="getScoreColor(result.readabilityScore)" />
                                </template>
                                <v-list-item-title>Readability</v-list-item-title>
                                <v-list-item-subtitle>
                                  <v-progress-linear :model-value="result.readabilityScore"
                                    :color="getScoreColor(result.readabilityScore)" height="10" rounded>
                                    <template v-slot:default="{ value }">
                                      <span class="white--text">{{ Math.ceil(value) }}%</span>
                                    </template>
                                  </v-progress-linear>
                                </v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-chart-line" :color="getScoreColor(result.score)" />
                                </template>
                                <v-list-item-title>Global score</v-list-item-title>
                                <v-list-item-subtitle>
                                  <v-progress-linear :model-value="result.score" :color="getScoreColor(result.score)"
                                    height="10" rounded>
                                    <template v-slot:default="{ value }">
                                      <span class="white--text">{{ Math.ceil(value) }}%</span>
                                    </template>
                                  </v-progress-linear>
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="issues">
                    <v-row>
                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-alert-circle"
                              :color="result.issues.length > 0 ? 'warning' : result.issues.length > 3 ? 'error' : 'success'"
                              class="mr-2" />
                            Detected issues
                          </v-card-title>
                          <v-card-text>
                            <div v-if="result.issues.length === 0" class="text-center pa-4">
                              <v-icon icon="mdi-check-circle" color="success" size="large" />
                              <p class="text-subtitle-1 mt-2">No issues detected</p>
                            </div>
                            <v-expansion-panels v-else>
                              <v-expansion-panel v-for="(issue, issueIndex) in result.issues" :key="issueIndex">
                                <v-expansion-panel-title>
                                  <v-icon :color="getIssueSeverityColor(issue.severity)" class="mr-2">
                                    {{ getIssueSeverityIcon(issue.severity) }}
                                  </v-icon>
                                  {{ issue.issue }}
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                  <p><strong>Description:</strong> {{ issue.description }}</p>
                                  <p class="mt-2"><strong>Recommandation:</strong> {{ issue.recommendation }}</p>
                                </v-expansion-panel-text>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="techniques">
                    <v-row>
                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-lightbulb-on" class="mr-2" />
                            Techniques engagement
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-list density="compact">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.engagementTechniques.hasSocialLinks ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasSocialLinks ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Social links</v-list-item-title>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.engagementTechniques.hasCtaButtons ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasCtaButtons ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>CTA buttons</v-list-item-title>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.engagementTechniques.hasFormsOrInputs ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasFormsOrInputs ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Forms or input fields</v-list-item-title>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.engagementTechniques.hasVideos ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasVideos ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Videos</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-list density="compact">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.engagementTechniques.hasImages ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasImages ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Images</v-list-item-title>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.engagementTechniques.hasInteractiveElements ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasInteractiveElements ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Interactive elements</v-list-item-title>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.engagementTechniques.hasFeedbackMechanisms ? 'success' : 'error'">
                                        {{ result.engagementTechniques.hasFeedbackMechanisms ? 'mdi-check-circle' :
                                          'mdi-close-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Feedback mechanisms</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="details">
                    <v-row>
                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-cursor-pointer" class="mr-2" />
                            CTA Elements
                          </v-card-title>
                          <v-card-text>
                            <v-data-table v-if="result.ctaDetails && result.ctaDetails.length > 0" :headers="[
                              { title: 'Text', key: 'text', sortable: true, align: 'start' },
                              { title: 'Type', key: 'type', sortable: true, align: 'center' },
                              { title: 'Location', key: 'location', sortable: true, align: 'center' }
                            ]" :items="formatCTADetails(result.ctaDetails)" density="compact" class="elevation-1"
                              :items-per-page="5" :item-value="'text'"></v-data-table>
                            <div v-else class="text-center pa-4">
                              <p class="text-subtitle-1">No CTA elements found</p>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" class="mt-4">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-share-variant" class="mr-2" />
                            Social Media Elements
                          </v-card-title>
                          <v-card-text>
                            <v-data-table v-if="result.socialElementsDetails && result.socialElementsDetails.length > 0"
                              :headers="[
                                { title: 'Platform', key: 'text', sortable: true, align: 'start' },
                                { title: 'Type', key: 'type', sortable: true, align: 'center' },
                                { title: 'Location', key: 'location', sortable: true, align: 'center' }
                              ]" :items="formatSocialDetails(result.socialElementsDetails)" density="compact"
                              class="elevation-1" :items-per-page="5" :item-value="'text'"></v-data-table>
                            <div v-else class="text-center pa-4">
                              <p class="text-subtitle-1">No social media elements found</p>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" class="mt-4">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-gesture-tap" class="mr-2" />
                            Interactive Elements
                          </v-card-title>
                          <v-card-text>
                            <v-data-table
                              v-if="result.interactiveElementsDetails && result.interactiveElementsDetails.length > 0"
                              :headers="[
                                { title: 'Description', key: 'text', sortable: true, align: 'start' },
                                { title: 'Type', key: 'type', sortable: true, align: 'center' },
                                { title: 'Location', key: 'location', sortable: true, align: 'center' }
                              ]" :items="result.interactiveElementsDetails" density="compact" class="elevation-1"
                              :items-per-page="5" :item-value="'text'"></v-data-table>
                            <div v-else class="text-center pa-4">
                              <p class="text-subtitle-1">No interactive elements details found</p>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useUserStore } from '../stores/userStore';

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'User Engagement',
  meta: [
    { name: 'description', content: 'Analyse l\'engagement des utilisateurs sur votre site web' },
    { name: 'keywords', content: 'engagement, utilisateurs, site web, analyse, interaction' },
  ],
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const url = computed(() => websiteData.value?.main_url || '');
const loading = ref(false);
const results = ref<any[]>([]);
const activeTab = ref('engagement');

async function analyzeUrl() {
  if (!url.value) return;

  loading.value = true;

  try {
    const response = await fetch('/api/analyze/engagement-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    results.value = await response.json();
    console.log(results.value);
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
  } finally {
    loading.value = false;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
}

function getIssueSeverityIcon(severity: string) {
  switch (severity) {
    case 'high':
      return 'mdi-alert-circle';
    case 'medium':
      return 'mdi-alert';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-information-outline';
  }
}

function getIssueSeverityColor(severity: string) {
  switch (severity) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'grey';
  }
}

function formatCTADetails(details: any[]) {
  if (!details) return [];

  return details.map(item => {
    // Limiter la longueur du texte
    let text = item.text || '';
    if (text.length > 30) {
      text = text.substring(0, 27) + '...';
    }

    // Rendre le type plus lisible
    let type = item.type || '';
    type = type.charAt(0).toUpperCase() + type.slice(1);

    // Formater l'emplacement
    let location = item.location || '';
    location = location.charAt(0).toUpperCase() + location.slice(1);

    return {
      ...item,
      text,
      type,
      location
    };
  });
}

function formatSocialDetails(details: any[]) {
  if (!details) return [];

  return details.map(item => {
    // Extraire la plateforme du type
    const typeParts = (item.type || '').split(' ');
    const platform = typeParts[0] || '';
    const action = typeParts[1] || '';

    // Formater l'emplacement
    let location = item.location || '';
    location = location.charAt(0).toUpperCase() + location.slice(1);

    return {
      ...item,
      text: platform.charAt(0).toUpperCase() + platform.slice(1),
      type: action.charAt(0).toUpperCase() + action.slice(1),
      location
    };
  });
}

const avgEngagementScore = computed(() => {
  if (!results.value.length) return 0;
  const scores = results.value.map(r => r.score || 0);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
});

const avgCtaCount = computed(() => {
  if (!results.value.length) return 0;
  const counts = results.value.map(r => r.ctaCount || 0);
  return Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
});

const avgInteractiveElements = computed(() => {
  if (!results.value.length) return 0;
  const counts = results.value.map(r => r.interactiveElements || 0);
  return Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
});

const avgSocialElements = computed(() => {
  if (!results.value.length) return 0;
  const counts = results.value.map(r => r.socialElements || 0);
  return Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
});
</script>

<style scoped>
.chart-container {
  height: 300px;
  width: 100%;
  position: relative;
}

.chart-container>div {
  width: 100% !important;
  height: 100% !important;
  min-height: 250px;
}

:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table th) {
  font-weight: bold;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.v-data-table tr:hover) {
  background-color: rgba(var(--v-theme-primary), 0.03);
}

/* Amélioration des barres de progression */
:deep(.v-progress-linear) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.v-progress-linear__determinate) {
  transition: width 0.5s ease;
}
</style>