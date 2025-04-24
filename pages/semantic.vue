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
          <v-form @submit.prevent="analyzeUrl">
            <v-text-field v-model="url" label="Website URL" density="comfortable" prepend-inner-icon="mdi-web"
              placeholder="https://exemple.com"
              :rules="[v => !!v || 'URL required', v => v.startsWith('http') || v.startsWith('https') || 'The URL must start with http or https']"
              required :loading="loading" />
            <v-btn type="submit" color="primary" :loading="loading" :disabled="!url">
              Analyze
            </v-btn>
          </v-form>
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
          <h2>Analysis Results</h2>
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
                  <v-tab value="html">HTML Structure</v-tab>
                  <v-tab value="aria">Accessibility ARIA</v-tab>
                  <v-tab value="meta">Meta-tags</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="html">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title>HTML Structure</v-card-title>
                          <v-card-text>
                            <div class="d-flex flex-wrap gap-2">
                              <v-chip v-for="(value, key) in result.structure" :key="key"
                                :color="value ? 'success' : 'error'" variant="tonal" class="ma-1">
                                <v-icon :icon="value ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2" /> {{
                                  getElementTitle(key)
                                }}
                              </v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title>Readability Analysis</v-card-title>
                          <v-card-text>
                            <p><strong>Score:</strong> {{ result.readabilityAnalysis.score.toFixed(2) }}</p>
                            <p><strong>Grade:</strong> {{ result.readabilityAnalysis.grade }}</p>
                            <p><strong>Words:</strong> {{ result.readabilityAnalysis.wordCount }}</p>
                            <p><strong>Sentences:</strong> {{ result.readabilityAnalysis.sentenceCount }}</p>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12">
                        <v-card v-if="result.headingStructure.length">
                          <v-card-title>Heading Structure</v-card-title>
                          <v-card-text>
                            <div class="heading-structure">
                              <div v-for="heading in result.headingStructure" :key="heading.order"
                                :style="{ marginLeft: `${(heading.level - 1) * 20}px` }" class="heading-item">
                                <span class="heading-level">H{{ heading.level }}</span>
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
                            <v-icon icon="mdi-wheelchair-accessibility" class="mr-2" />
                            Accessibility ARIA
                            <v-chip :color="getScoreColor(result.accessibility.ariaScore)" class="ml-4">
                              Score: {{ result.accessibility.ariaScore }}%
                            </v-chip>
                          </v-card-title>
                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-list density="compact">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon
                                        :color="result.accessibility.missingAriaCount > 0 ? 'warning' : 'success'">
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
                                      <v-icon :color="result.accessibility.missingLabels > 0 ? 'warning' : 'success'">
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
                                        :color="result.accessibility.formElementsWithLabelsPercent < 100 ? 'warning' : 'success'">
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
                                <v-list density="compact">
                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon :color="result.accessibility.invalidAriaCount > 0 ? 'error' : 'success'">
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
                                        :color="result.accessibility.interactiveElementsWithAriaPercent < 100 ? 'warning' : 'success'">
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
                                      <v-icon color="info">mdi-counter</v-icon>
                                    </template>
                                    <v-list-item-title>Total interactive elements</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.interactiveElementsCount
                                    }}</v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-col>

                              <v-col cols="12">
                                <v-divider class="my-4"></v-divider>
                                <div class="text-subtitle-1 mb-2">Elements to complete with ARIA</div>
                                <v-expansion-panels>
                                  <v-expansion-panel v-for="(issue, index) in result.accessibility.issues" :key="index">
                                    <v-expansion-panel-title>
                                      <v-icon :color="getIssueSeverityColor(issue.severity)" class="mr-2">
                                        {{ getIssueSeverityIcon(issue.severity) }}
                                      </v-icon>
                                      {{ issue.element }} - {{ issue.issue }}
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <p><strong>Suggestion:</strong> {{ issue.suggestion }}</p>
                                      <v-alert v-if="issue.code" type="info" variant="tonal" class="mt-2">
                                        <pre><code>{{ issue.code }}</code></pre>
                                      </v-alert>
                                      <p v-if="issue.context" class="mt-2"><strong>Context:</strong> {{ issue.context
                                      }}</p>
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
                            <v-icon icon="mdi-tag-multiple" class="mr-2" />
                            Meta-tags Analysis
                            <v-chip :color="getScoreColor(result.metaTags.score)" class="ml-4">
                              Score: {{ result.metaTags.score }}%
                            </v-chip>
                          </v-card-title>

                          <v-card-text>
                            <v-row>
                              <v-col cols="12" md="6">
                                <v-card variant="outlined">
                                  <v-card-title class="text-subtitle-1">
                                    <v-icon icon="mdi-check-circle" color="success" class="mr-2" />
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
</style>