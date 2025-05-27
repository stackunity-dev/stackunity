<template>
  <main class="main-content">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pl-6 mb-8 border-tertiary">
            <h1 class="text-h4 font-weight-bold mb-2">{{ t().page.title }}</h1>
            <div class="analytics-description text-body-1 text-medium-emphasis mb-3">
              {{ t().page.subtitle }}
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeUrl">
                <v-text-field v-model="url" :label="t().form.urlLabel" :placeholder="t().form.urlPlaceholder"
                  :hint="t().form.urlHint" persistent-hint prepend-inner-icon="mdi-web" variant="outlined" required
                  autocomplete="url" aria-label="URL to analyze"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || 'Please enter a valid URL starting with http:// or https://']"></v-text-field>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!url"
                    prepend-icon="mdi-magnify" aria-label="Analyze content">
                    {{ t().form.analyzeButton }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
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
          <h2 id="analysis-results">{{ t().results.title }}</h2>

          <v-card class="mt-4 mb-6 bg-surface">
            <v-card-item>
              <v-card-title class="d-flex align-center mb-4">
                <v-icon icon="mdi-chart-areaspline" color="primary" class="mr-2" aria-hidden="true" />
                {{ t().results.averageScore }}
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
                          <div class="text-subtitle-1 font-weight-bold">
                            HTML </div>
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
                          <div class="text-subtitle-1 font-weight-bold">
                            ARIA </div>
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
                          <div class="text-subtitle-1 font-weight-bold">
                            META </div>
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
                  <v-tab value="html" aria-label="HTML Structure tab">{{ t().results.html.title }}</v-tab>
                  <v-tab value="aria" aria-label="Accessibility ARIA tab">{{ t().results.aria.title }}</v-tab>
                  <v-tab value="meta" aria-label="Meta-tags tab">{{ t().results.meta.title }}</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="html">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-language-html5" class="mr-2" aria-hidden="true" />
                            {{ t().results.html.title }}
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
                            {{ t().results.readability.title }}
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
                            {{ t().results.headingStructure.title }}
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
                            {{ t().results.aria.title }}
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
                                    <v-list-item-title>{{ t().results.aria.missingAriaCount }}</v-list-item-title>
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
                                    <v-list-item-title>{{ t().results.aria.missingLabels }}</v-list-item-title>
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
                                    <v-list-item-title>{{ t().results.aria.formElementsWithLabels }}</v-list-item-title>
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
                                    <v-list-item-title>{{ t().results.aria.invalidAriaCount }}</v-list-item-title>
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
                                    <v-list-item-title>{{ t().results.aria.interactiveElementsWithAria
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>{{
                                      result.accessibility.interactiveElementsWithAriaPercent.toFixed(2)
                                      }}%</v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <template v-slot:prepend>
                                      <v-icon color="info" aria-hidden="true">mdi-counter</v-icon>
                                    </template>
                                    <v-list-item-title>{{ t().results.aria.totalInteractiveElements
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ result.accessibility.interactiveElementsCount
                                      }}</v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-col>

                              <v-col cols="12">
                                <v-divider class="my-4" aria-hidden="true"></v-divider>
                                <div class="text-subtitle-1 font-weight-bold mb-2" id="aria-issues">{{
                                  t().results.aria.elementsToCompleteWithAria }}
                                </div>
                                <v-expansion-panels aria-labelledby="aria-issues">
                                  <v-expansion-panel v-for="(issue, index) in result.accessibility.issues" :key="index">
                                    <v-expansion-panel-title>
                                      <v-icon :color="getIssueSeverityColor(issue.severity)" class="mr-2"
                                        aria-hidden="true">
                                        {{ getIssueSeverityIcon(issue.severity) }}
                                      </v-icon>
                                      <span class="font-weight-medium">{{ issue.element }} - {{ issue.issue }}</span>
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <p class="text-body-1 font-weight-medium"><strong>Suggestion:</strong> {{
                                        issue.suggestion }}</p>
                                      <v-alert v-if="issue.code" type="info" variant="tonal" class="mt-2" role="region"
                                        aria-label="Example code">
                                        <pre class="highlighted-code"><code>{{ issue.code }}</code></pre>
                                      </v-alert>
                                      <div v-if="issue.context" class="mt-3 pa-3 context-box rounded">
                                        <p class="text-body-1 font-weight-medium"><strong>Context:</strong></p>
                                        <p class="text-body-2" v-if="issue.context.includes('points to')">
                                          The link points to: <code>{{ getContextLink(issue.context) }}</code>
                                        </p>
                                        <p class="text-body-2" v-else-if="issue.context.includes('pointe vers')">
                                          The link points to: <code>{{ getContextLink(issue.context) }}</code>
                                        </p>
                                        <p class="text-body-2" v-else>
                                          {{ issue.context }}
                                        </p>
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
                            {{ t().results.meta.title }}
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
                                    {{ t().results.meta.detailedScore }}
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
                                        <v-list-item-title>{{ t().results.meta.essentialTags }}</v-list-item-title>
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
                                        <v-list-item-title>{{ t().results.meta.socialTags }}</v-list-item-title>
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
                                        <v-list-item-title>{{ t().results.meta.technicalTags }}</v-list-item-title>
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
                                        <v-list-item-title>{{ t().results.meta.contentTags }}</v-list-item-title>
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
                                    {{ t().results.meta.essentialTags }}
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
                                      {{ t().results.meta.socialSharingTags }}
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
                                      {{ t().results.meta.htmlCodeOfMetaTags }}
                                    </v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                      <v-alert type="info" variant="tonal" class="mt-2">
                                        <pre class="highlighted-code"><code>{{ result.metaTags.metaHtml }}</code></pre>
                                      </v-alert>
                                    </v-expansion-panel-text>
                                  </v-expansion-panel>

                                  <v-expansion-panel v-if="result.metaTags.issues.length">
                                    <v-expansion-panel-title>
                                      <v-icon icon="mdi-alert-circle" color="warning" class="mr-2" />
                                      {{ t().results.meta.detectedIssues }}
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
  </main>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, computed } from 'vue';
// @ts-ignore 
import { definePageMeta, useHead } from '#imports';
import { useUserStore } from '../../stores/userStore';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/atom-one-dark.css';
import { useTranslations } from '../../languages';

const t = useTranslations('semantic');

hljs.registerLanguage('xml', xml);

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'StackUnity' },
    { name: 'og:title', content: t().meta.title },
    { name: 'og:description', content: t().meta.description },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/semantic' }
  ]
});

const activeTab = ref('html');
const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const url = computed(() => websiteData.value?.main_url || '');
const loading = ref(false);
const results = ref<any[]>([]);

const applyHighlighting = async () => {
  await nextTick();
  document.querySelectorAll('pre.highlighted-code code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement);
  });
};

watch(results, async () => {
  if (results.value.length > 0) {
    await applyHighlighting();
  }
}, { deep: true });

watch(activeTab, async () => {
  await applyHighlighting();
});

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
  const pointsToMatch = context.match(/(?:points to|pointe vers)\s*:\s*(.+)/i);
  if (pointsToMatch && pointsToMatch[1]) {
    return pointsToMatch[1].trim();
  }

  const urlMatch = context.match(/(https?:\/\/[^\s]+|\/[^\s]+)/);
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
main {
  min-height: 100vh;
  background-color: var(--v-theme-background);
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  background-color: var(--v-theme-background);
  flex: 1;
  width: 100%;
}

.v-container {
  flex: 1;
  width: 100%;
  max-width: 100%;
}

.border-tertiary {
  border-left: 4px solid rgb(var(--v-theme-tertiary)) !important;
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

pre.highlighted-code {
  margin: 1rem 0;
  padding: 0;
  overflow: auto;
  border-radius: 4px;
}

pre.highlighted-code code {
  padding: 1rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  background-color: transparent;
  display: block;
  width: 100%;
}
</style>
