<template>
  <div class="semantic-analyzer">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1>Semantic Analysis</h1>
          <p class="text-body-1">Analyze the semantic structure of your website</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-form @submit.prevent="analyzeUrl" role="search" aria-label="Website semantic analysis form">
            <v-text-field v-model="url" label="Website URL" density="comfortable" prepend-inner-icon="mdi-web"
              placeholder="https://exemple.com"
              :rules="[v => !!v || 'URL required', v => v.startsWith('http') || v.startsWith('https') || 'The URL must start with http or https']"
              required :loading="loading" aria-required="true" />
            <v-btn type="submit" color="primary" :loading="loading" :disabled="!url" aria-label="Analyze website">
              Analyze
            </v-btn>
          </v-form>
        </v-col>
      </v-row>

      <v-row v-if="loading">
        <v-col cols="12">
          <v-skeleton-loader type="article, actions" aria-label="Loading analysis results" />
          <v-row>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" aria-hidden="true" />
            </v-col>
            <v-col cols="12" md="6">
              <v-skeleton-loader type="card" aria-hidden="true" />
            </v-col>
          </v-row>
          <v-skeleton-loader type="table" aria-hidden="true" />
        </v-col>
      </v-row>

      <v-row v-else-if="results.length">
        <v-col cols="12" class="mb-6">
          <h2 id="analysis-results">Analysis Results</h2>

          <v-alert type="info" variant="tonal" class="mt-4 mb-6" aria-label="Semantic analysis results">
          </v-alert>

          <v-card class="mt-4 mb-6" variant="outlined">
            <v-card-item>
              <v-card-title class="d-flex align-center">
                <v-icon icon="mdi-chart-areaspline" color="primary" class="mr-2" aria-hidden="true" />
                Average Score
                <v-chip :color="getScoreColor(calculateGlobalAverage())" class="ml-4"
                  aria-label="Score moyen global: {{ calculateGlobalAverage() }}%">
                  {{ calculateGlobalAverage() }}%
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('html')"
                        :color="getScoreColor(calculateAverageByType('html'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">HTML</div>
                          <div class="text-h6">{{ calculateAverageByType('html') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('aria')"
                        :color="getScoreColor(calculateAverageByType('aria'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">ARIA</div>
                          <div class="text-h6">{{ calculateAverageByType('aria') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageByType('meta')"
                        :color="getScoreColor(calculateAverageByType('meta'))" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">META</div>
                          <div class="text-h6">{{ calculateAverageByType('meta') }}%</div>
                        </div>
                      </v-progress-circular>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-item>
          </v-card>

          <v-expansion-panels aria-labelledby="analysis-results">
            <v-expansion-panel v-for="(result, index) in results" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters align="center">
                  <v-col cols="8" class="text-body-1">{{ result.url }}</v-col>
                  <v-col cols="4" class="text-right d-flex align-center justify-end flex-wrap">
                    <v-chip :color="getAverageScoreColor(result)" class="mr-2"
                      aria-label="Average score: {{ calculateAverageScore(result) }}%">
                      Score: {{ calculateAverageScore(result) }}%
                    </v-chip>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-tabs v-model="activeTab" color="primary" aria-label="Analysis categories">
                  <v-tab value="html" aria-label="HTML Structure tab">HTML Structure</v-tab>
                  <v-tab value="aria" aria-label="Accessibility ARIA tab">Accessibility ARIA</v-tab>
                  <v-tab value="meta" aria-label="Meta-tags tab">Meta-tags</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="html">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-language-html5" class="mr-2" aria-hidden="true" />
                            HTML Structure
                            <v-chip :color="getScoreColor(result.score)" class="ml-4"
                              aria-label="HTML structure score: {{ result.score }}%">
                              Score: {{ result.score }}%
                            </v-chip>
                          </v-card-title>
                          <v-card-text>
                            <div class="d-flex flex-wrap gap-2" role="list" aria-label="HTML structure elements">
                              <v-chip v-for="(value, key) in result.structure" :key="key"
                                :color="value ? 'success' : 'error'" variant="tonal" class="ma-1" role="listitem"
                                :aria-label="getElementTitle(key) + ' is ' + (value ? 'present' : 'missing')">
                                <v-icon :icon="value ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2"
                                  aria-hidden="true" /> {{
                                    getElementTitle(key)
                                  }}
                              </v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-book-open-variant" class="mr-2" aria-hidden="true" />
                            Readability Analysis
                          </v-card-title>
                          <v-card-text>
                            <dl>
                              <dt><strong>Score:</strong></dt>
                              <dd>{{ result.readabilityAnalysis.score.toFixed(2) }}</dd>
                              <dt><strong>Grade:</strong></dt>
                              <dd>{{ result.readabilityAnalysis.grade }}</dd>
                              <dt><strong>Words:</strong></dt>
                              <dd>{{ result.readabilityAnalysis.wordCount }}</dd>
                              <dt><strong>Sentences:</strong></dt>
                              <dd>{{ result.readabilityAnalysis.sentenceCount }}</dd>
                            </dl>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12">
                        <v-card v-if="result.headingStructure.length">
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-format-header-1" class="mr-2" aria-hidden="true" />
                            Heading Structure
                          </v-card-title>
                          <v-card-text>
                            <div class="heading-structure" role="tree" aria-label="Page heading structure">
                              <div v-for="heading in result.headingStructure" :key="heading.order"
                                :style="{ marginLeft: `${(heading.level - 1) * 20}px` }" class="heading-item"
                                role="treeitem" :aria-level="heading.level">
                                <span class="heading-level" aria-hidden="true">H{{ heading.level }}</span>
                                {{ heading.text }}
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="aria">
                    <v-row>
                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-wheelchair-accessibility" class="mr-2" aria-hidden="true" />
                            Accessibility ARIA
                            <v-chip :color="getScoreColor(result.accessibility.ariaScore)" class="ml-4"
                              aria-label="ARIA score: {{ result.accessibility.ariaScore }}%">
                              Score: {{ result.accessibility.ariaScore }}%
                            </v-chip>
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-list density="compact" aria-label="Accessibility metrics - part 1">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.accessibility.missingAriaCount > 0 ? 'warning' : 'success'"
                                        aria-hidden="true">
                                        {{ result.accessibility.missingAriaCount > 0 ? 'mdi-alert' : 'mdi-check-circle'
                                        }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Missing ARIA attributes</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.missingAriaCount
                                    }}</v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.accessibility.missingLabels > 0 ? 'warning' : 'success'"
                                        aria-hidden="true">
                                        {{ result.accessibility.missingLabels > 0 ? 'mdi-alert' : 'mdi-check-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Missing labels</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.missingLabels
                                    }}</v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.accessibility.formElementsWithLabelsPercent < 100 ? 'warning' : 'success'"
                                        aria-hidden="true">
                                        {{ result.accessibility.formElementsWithLabelsPercent < 100 ? 'mdi-alert'
                                          : 'mdi-check-circle' }} </v-icon>
                                    </template>
                                    <v-list-item-title>Form elements with labels</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.formElementsWithLabelsPercent
                                    }}%</v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-list density="compact" aria-label="Accessibility metrics - part 2">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.accessibility.invalidAriaCount > 0 ? 'error' : 'success'"
                                        aria-hidden="true">
                                        {{ result.accessibility.invalidAriaCount > 0 ? 'mdi-alert-circle' :
                                          'mdi-check-circle' }}
                                      </v-icon>
                                    </template>
                                    <v-list-item-title>Invalid ARIA attributes</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.invalidAriaCount
                                    }}</v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.accessibility.interactiveElementsWithAriaPercent < 100 ? 'warning' : 'success'"
                                        aria-hidden="true">
                                        {{ result.accessibility.interactiveElementsWithAriaPercent < 100 ? 'mdi-alert'
                                          : 'mdi-check-circle' }} </v-icon>
                                    </template>
                                    <v-list-item-title>Interactive elements with ARIA</v-list-item-title>
                                    <v-list-item-subtitle>{{
                                      result.accessibility.interactiveElementsWithAriaPercent.toFixed(2)
                                    }}%</v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon color="info" aria-hidden="true">mdi-counter</v-icon>
                                    </template>
                                    <v-list-item-title>Total interactive elements</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.interactiveElementsCount
                                    }}</v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-col>

                              <v-col cols="12">
                                <v-divider class="my-4" aria-hidden="true"></v-divider>
                                <div class="text-subtitle-1 font-weight-bold mb-2" id="aria-issues">Elements to complete
                                  with ARIA</div>
                                <v-expansion-panels aria-labelledby="aria-issues">
                                  <v-expansion-panel v-for="(issue, index) in result.accessibility.issues" :key="index"
                                    class="mb-2">
                                    <v-expansion-panel-title>
                                      <div class="d-flex align-center">
                                        <v-icon :color="getIssueSeverityColor(issue.severity)" class="mr-2"
                                          :icon="getIssueSeverityIcon(issue.severity)"></v-icon>
                                        {{ issue.message }}
                                      </div>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <div v-if="issue.element" class="py-2">
                                        <p class="text-subtitle-2 font-weight-bold mb-1">Élément concerné:</p>
                                        <code class="d-block pa-2 mb-2">{{ issue.element }}</code>
                                      </div>
                                      <div v-if="issue.context" class="context-box pa-3 mb-2 rounded">
                                        <p class="text-subtitle-2 font-weight-bold mb-1">Contexte:</p>
                                        <p>{{ issue.context }}</p>
                                        <v-chip v-if="getContextLink(issue.context) !== issue.context" color="primary"
                                          size="small" class="mt-2" prepend-icon="mdi-link-variant">
                                          {{ getContextLink(issue.context) }}
                                        </v-chip>
                                      </div>
                                      <div v-if="issue.suggestion" class="mt-2">
                                        <p class="text-subtitle-2 font-weight-bold mb-1">Suggestion:</p>
                                        <p class="font-weight-medium">{{ issue.suggestion }}</p>
                                      </div>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>
                                </v-expansion-panels>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="meta">
                    <v-row>
                      <v-col cols="12">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-tag-multiple" class="mr-2" aria-hidden="true" />
                            Meta-tags Analysis
                            <v-chip :color="getScoreColor(result.metaTags.score)" class="ml-4"
                              aria-label="Meta-tags score: {{ result.metaTags.score }}%">
                              Score: {{ result.metaTags.score }}%
                            </v-chip>
                          </v-card-title>

                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon icon="mdi-check-circle" color="success" class="mr-2" aria-hidden="true" />
                                    Score détaillé
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item>
                                        <template v-slot:prepend>
                                          <v-icon :color="getScoreColor(result.metaTags.detailedScore.essential)">
                                            {{ result.metaTags.detailedScore.essential >= 70 ? 'mdi-check-circle' :
                                              'mdi-alert' }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>Essential tags</v-list-item-title>
                                        <v-list-item-subtitle>{{ result.metaTags.detailedScore.essential
                                        }}%</v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item>
                                        <template v-slot:prepend>
                                          <v-icon :color="getScoreColor(result.metaTags.detailedScore.social)">
                                            {{ result.metaTags.detailedScore.social >= 70 ? 'mdi-check-circle' :
                                              'mdi-alert' }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>Social tags</v-list-item-title>
                                        <v-list-item-subtitle>{{ result.metaTags.detailedScore.social
                                        }}%</v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item>
                                        <template v-slot:prepend>
                                          <v-icon :color="getScoreColor(result.metaTags.detailedScore.technical)">
                                            {{ result.metaTags.detailedScore.technical >= 70 ? 'mdi-check-circle' :
                                              'mdi-alert' }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>Technical tags</v-list-item-title>
                                        <v-list-item-subtitle>{{ result.metaTags.detailedScore.technical
                                        }}%</v-list-item-subtitle>
                                      </v-list-item>

                                      <v-list-item>
                                        <template v-slot:prepend>
                                          <v-icon :color="getScoreColor(result.metaTags.detailedScore.content)">
                                            {{ result.metaTags.detailedScore.content >= 70 ? 'mdi-check-circle' :
                                              'mdi-alert' }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>Content</v-list-item-title>
                                        <v-list-item-subtitle>{{ result.metaTags.detailedScore.content
                                        }}%</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>

                              <v-col cols="12" md="6">
                                <v-card variant="outlined">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon icon="mdi-file-document" color="primary" class="mr-2" />
                                    Essential tags
                                  </v-card-title>
                                  <v-card-text>
                                    <v-list density="compact">
                                      <v-list-item v-for="tag in result.metaTags.essential" :key="tag.name">
                                        <template v-slot:prepend>
                                          <v-icon :color="tag.present ? 'success' : 'error'">
                                            {{ tag.present ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                          </v-icon>
                                        </template>
                                        <v-list-item-title>{{ tag.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ tag.content || 'Non défini' }}</v-list-item-subtitle>
                                      </v-list-item>
                                    </v-list>
                                  </v-card-text>
                                </v-card>
                              </v-col>

                              <v-col cols="12">
                                <v-expansion-panels>
                                  <v-expansion-panel>
                                    <v-expansion-panel-title>
                                      <v-icon icon="mdi-share-variant" color="primary" class="mr-2" />
                                      Social sharing tags
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-row>
                                        <v-col cols="12" md="6">
                                          <div class="text-subtitle-2 mb-2">Open Graph</div>
                                          <v-list density="compact">
                                            <v-list-item v-for="tag in result.metaTags.social.og" :key="tag.name">
                                              <template v-slot:prepend>
                                                <v-icon :color="tag.present ? 'success' : 'error'">
                                                  {{ tag.present ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                                </v-icon>
                                              </template>
                                              <v-list-item-title>{{ tag.name }}</v-list-item-title>
                                              <v-list-item-subtitle>{{ tag.content || 'Non défini'
                                              }}</v-list-item-subtitle>
                                            </v-list-item>
                                          </v-list>
                                        </v-col>

                                        <v-col cols="12" md="6">
                                          <div class="text-subtitle-2 mb-2">Twitter Cards</div>
                                          <v-list density="compact">
                                            <v-list-item v-for="tag in result.metaTags.social.twitter" :key="tag.name">
                                              <template v-slot:prepend>
                                                <v-icon :color="tag.present ? 'success' : 'error'">
                                                  {{ tag.present ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                                </v-icon>
                                              </template>
                                              <v-list-item-title>{{ tag.name }}</v-list-item-title>
                                              <v-list-item-subtitle>{{ tag.content || 'Non défini'
                                              }}</v-list-item-subtitle>
                                            </v-list-item>
                                          </v-list>
                                        </v-col>
                                      </v-row>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>

                                  <v-expansion-panel>
                                    <v-expansion-panel-title>
                                      <v-icon icon="mdi-code-tags" color="primary" class="mr-2" />
                                      HTML code of Meta-tags
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-alert type="info" variant="tonal" class="mt-2">
                                        <pre><code>{{ result.metaTags.metaHtml }}</code></pre>
                                      </v-alert>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>

                                  <v-expansion-panel v-if="result.metaTags.issues.length">
                                    <v-expansion-panel-title>
                                      <v-icon icon="mdi-alert-circle" color="warning" class="mr-2" />
                                      Detected issues
                                      <v-chip class="ml-2" size="small" color="warning">
                                        {{ result.metaTags.issues.length }}
                                      </v-chip>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-list>
                                        <v-list-item v-for="(issue, index) in result.metaTags.issues" :key="index"
                                          :subtitle="issue.recommendation">
                                          <template v-slot:prepend>
                                            <v-icon :color="getIssueSeverityColor(issue.severity)">
                                              {{ getIssueSeverityIcon(issue.severity) }}
                                            </v-icon>
                                          </template>
                                          <v-list-item-title>
                                            <strong>{{ issue.tagName }}:</strong> {{ issue.issue }}
                                          </v-list-item-title>
                                          <template v-if="issue.example">
                                            <v-list-item-subtitle class="mt-2">
                                              <v-alert type="info" variant="tonal" density="compact">
                                                <code>{{ issue.example }}</code>
                                              </v-alert>
                                            </v-list-item-subtitle>
                                          </template>
                                        </v-list-item>
                                      </v-list>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>
                                </v-expansion-panels>
                              </v-col>
                            </v-row>
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

<script lang="ts" setup>
import { ref } from 'vue';
// @ts-ignore 
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'Semantic Analyzer - StackUnity',
  meta: [
    { name: 'description', content: 'Analyze the semantic structure of your website to improve its accessibility and SEO.' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'StackUnity' },
    { name: 'og:title', content: 'Semantic Analyzer' },
    { name: 'og:description', content: 'Analyze the semantic structure of your website to improve its accessibility and SEO.' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/semantic' }
  ]
});

const url = ref('');
const loading = ref(false);
const results = ref<any[]>([]);
const activeTab = ref('html');

const getScoreColor = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 70) return 'warning';
  return 'error';
};

const analyzeUrl = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/analyze/semantic-view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url.value }),
    });

    if (!response.ok) {
      throw new Error('Error during analysis');
    }

    results.value = await response.json();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    loading.value = false;
  }
};

const getElementTitle = (key: string | number): string => {
  const mapping: Record<string, string> = {
    hasHeader: 'Header',
    hasMain: 'Main',
    hasFooter: 'Footer',
    hasNav: 'Navigation',
    hasArticle: 'Article',
    hasSection: 'Section',
    hasAside: 'Aside',
    hasFigure: 'Figure',
    validH1Usage: 'Valid H1 usage',
    validHeadingStructure: 'Valid heading structure'
  };
  return mapping[key.toString()] || key.toString();
};

const getIssueSeverityIcon = (severity: string): string => {
  switch (severity) {
    case 'high':
      return 'mdi-alert-circle';
    case 'medium':
      return 'mdi-alert';
    case 'low':
      return 'mdi-information';
    default:
      return 'mdi-help-circle';
  }
};

const getIssueSeverityColor = (severity: string): string => {
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
};

const getContextLink = (context: string): string => {
  // Extraire l'URL après "points to" ou "pointe vers"
  const pointsToMatch = context.match(/(?:points to|pointe vers)\s*:?\s*([^\s,;]+)/i);
  if (pointsToMatch && pointsToMatch[1]) {
    return pointsToMatch[1].trim();
  }

  // Rechercher directement une URL dans la chaîne de contexte
  const urlMatch = context.match(/(https?:\/\/[^\s,;]+|\/[^\s,;]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  return context;
};

const getAverageScoreColor = (result) => {
  const avgScore = calculateAverageScore(result);
  return getScoreColor(avgScore);
};

const calculateAverageScore = (result) => {
  const htmlScore = result.score || 0;
  const ariaScore = result.accessibility?.ariaScore || 0;
  const metaScore = result.metaTags?.score || 0;

  const avgScore = Math.round((htmlScore + ariaScore + metaScore) / 3);
  return avgScore;
};

function calculateGlobalAverage(): number {
  if (!results.value.length) return 0;

  let sum = 0;
  let count = 0;

  results.value.forEach(result => {
    sum += result.score || 0;
    count++;

    if (result.accessibility?.ariaScore) {
      sum += result.accessibility.ariaScore;
      count++;
    }

    if (result.metaTags?.score) {
      sum += result.metaTags.score;
      count++;
    }
  });

  return Math.round(sum / count) || 0;
}

function calculateAverageByType(type: 'html' | 'aria' | 'meta'): number {
  if (!results.value.length) return 0;

  let sum = 0;
  let count = 0;

  results.value.forEach(result => {
    if (type === 'html') {
      sum += result.score || 0;
      count++;
    } else if (type === 'aria' && result.accessibility?.ariaScore) {
      sum += result.accessibility.ariaScore;
      count++;
    } else if (type === 'meta' && result.metaTags?.score) {
      sum += result.metaTags.score;
      count++;
    }
  });

  return Math.round(sum / count) || 0;
}
</script>

<style scoped>
.semantic-analyzer {
  padding: 24px 0;
}

.heading-structure {
  max-height: 400px;
  overflow-y: auto;
}

.heading-item {
  padding: 4px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.heading-level {
  background-color: var(--v-primary-base);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Styles pour les skeleton loaders */
:deep(.v-skeleton-loader) {
  border-radius: 8px;
  margin-bottom: 16px;
}

:deep(.v-skeleton-loader__card) {
  min-height: 200px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

:deep(.v-skeleton-loader__article) {
  min-height: 120px;
}

:deep(.v-skeleton-loader__table) {
  min-height: 300px;
}

:deep(.v-skeleton-loader__actions) {
  min-height: 48px;
  margin-top: 16px;
}

:deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg,
      rgba(var(--v-theme-surface), 0.1),
      rgba(var(--v-theme-primary), 0.05),
      rgba(var(--v-theme-surface), 0.1)) !important;
  background-size: 200% 100% !important;
  animation: shimmer 1.5s infinite !important;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.context-box {
  background-color: rgba(var(--v-theme-primary), 0.05);
  border-left: 4px solid var(--v-theme-primary);
}

code {
  background-color: rgba(var(--v-theme-surface-variant), 0.7);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 500;
  word-break: break-all;
}

:deep(.v-expansion-panel-title) {
  font-weight: 500;
}
</style>