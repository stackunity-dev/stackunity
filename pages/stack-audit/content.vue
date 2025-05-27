<template>
  <main class="main-content">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="pl-6 mb-8 border-info">
            <h1 class="text-h4 font-weight-bold mb-2">{{ t().page.title }}</h1>
            <div class="analytics-description text-body-1 text-medium-emphasis mb-3">
              {{ t().page.subtitle }}
            </div>
          </div>

          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeContent">
                <v-text-field v-model="url" :label="t().form.urlLabel" :placeholder="t().form.urlPlaceholder"
                  :hint="t().form.urlHint" persistent-hint prepend-inner-icon="mdi-web" variant="outlined" required
                  autocomplete="url" :aria-label="t().form.urlLabel"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || t().form.urlRule]"></v-text-field>

                <v-checkbox v-model="crawlEnabled" :label="t().form.crawlEnabled" :hint="t().form.crawlHint"
                  persistent-hint :aria-label="t().form.crawlEnabled"></v-checkbox>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!isValidUrl"
                    prepend-icon="mdi-magnify" :aria-label="t().form.analyzeButton">
                    {{ t().form.analyzeButton }}
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <v-progress-linear v-if="loading" color="primary" indeterminate
            :aria-label="t().loading.text"></v-progress-linear>

          <v-alert v-if="error" type="error" variant="tonal" closable class="mb-6" role="alert">
            {{ error }}
          </v-alert>

          <v-card v-if="results.length > 1 && !loading" class="mb-6 bg-surface">
            <v-card-title class="text-subtitle-1 d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <v-icon start aria-hidden="true" class="mr-2">mdi-chart-areaspline</v-icon>
                <span>{{ t().averageScore.title }}</span>
              </div>
              <v-btn size="small" variant="text" density="comfortable" color="primary" prepend-icon="mdi-download"
                @click="exportScoreData" :aria-label="t().averageScore.exportButton">
                {{ t().averageScore.exportButton }}
              </v-btn>
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center">
                <v-progress-circular :model-value="getAverageContentScore()"
                  :color="getContentScoreColor(getAverageContentScore())" size="100" width="12"
                  :aria-label="t().averageScore.title" class="mr-4">
                  <span class="text-h6 font-weight-bold">{{ getAverageContentScore() }}%</span>
                </v-progress-circular>
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ getContentScoreLabel(getAverageContentScore()) }}
                  </div>
                  <div class="text-body-2 mb-2">
                    {{ t().averageScore.calculated.replace('{count}', String(results.length)) }}
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
                    :aria-label="t().averageScore.title"></v-progress-linear>
                </div>
              </div>

              <v-alert v-if="getLowestScoringPage() && results.length > 1" color="info" variant="tonal" class="mt-4"
                icon="mdi-lightbulb-on">
                <div class="text-subtitle-2 font-weight-bold mb-1">{{ t().improvement.title }}</div>
                <p>{{ t().improvement.lowestScore.replace('{score}', String(calculateContentScore(getLowestScoringPage()
                  || {}))) }}
                  <a :href="getLowestScoringPage()?.url || ''" target="_blank" rel="noopener noreferrer">{{
                    truncateUrl(getLowestScoringPage()?.url || '', 50) }} <v-icon size="x-small"
                      class="ml-1">mdi-open-in-new</v-icon></a>
                </p>
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
                          {{ t().contentScore.title }}
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
                              <v-list-item-title>{{ t().statistics.wordCount }}</v-list-item-title>
                              <v-list-item-subtitle class="d-flex align-center">
                                <span>{{ result?.contentStats?.wordCount || 0 }}</span>
                                <v-chip size="x-small" :color="getWordCountColor(result?.contentStats?.wordCount || 0)"
                                  class="ml-2">
                                  {{ getWordCountRating(result?.contentStats?.wordCount || 0) }}
                                </v-chip>
                              </v-list-item-subtitle>
                            </v-list-item>

                            <v-list-item>
                              <v-list-item-title>{{ t().statistics.readabilityScore }}</v-list-item-title>
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
                              <v-list-item-title>{{ t().statistics.headingsDetected }}</v-list-item-title>
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
                              <v-list-item-title>{{ t().statistics.links }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ t().statistics.internal }}: {{ Array.isArray(result?.links?.internal) ?
                                  result.links.internal.length : 0
                                }},
                                {{ t().statistics.external }}: {{ Array.isArray(result?.links?.external) ?
                                  result.links.external.length : 0
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
                          {{ t().headings.title }}
                        </v-card-title>
                        <v-card-text>
                          <div v-if="!hasHeadings(result)" class="text-center pa-4">
                            <v-icon color="warning" class="mb-2" size="large" aria-hidden="true">mdi-alert</v-icon>
                            <p>{{ t().headings.noHeadings }}</p>
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
                          {{ t().issues.title }}
                        </v-card-title>
                        <v-card-text>
                          <div v-if="getContentIssues(result).length === 0" class="text-center pa-4">
                            <v-icon color="success" class="mb-2" size="large"
                              aria-hidden="true">mdi-check-circle</v-icon>
                            <p>{{ t().issues.noIssues }}</p>
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
                          {{ t().recommendations.title }}
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
                            <div class="text-subtitle-1 font-weight-bold mb-2">{{
                              t().recommendations.excellentQuality.title }}
                            </div>
                            <p class="wrap-text">{{ t().recommendations.excellentQuality.description }}</p>
                          </v-alert>

                          <v-expansion-panels variant="accordion">
                            <v-expansion-panel>
                              <v-expansion-panel-title>
                                <div class="d-flex align-center">
                                  <v-icon color="primary" class="mr-2">mdi-arrow-up-bold-circle</v-icon>
                                  <span>{{ t().recommendations.improveContent.title }}</span>
                                </div>
                              </v-expansion-panel-title>
                              <v-expansion-panel-text>
                                <v-list class="recommendation-list">
                                  <v-list-item
                                    v-if="result?.contentStats?.wordCount && result.contentStats.wordCount < 800">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addMoreContent.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{
                                        t().recommendations.improveContent.addMoreContent.description.replace('{count}',
                                          String(result.contentStats.wordCount)) }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!result?.headingStructure?.h1 || !result.headingStructure.h1.length">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addH1.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.addH1.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item v-else-if="result.headingStructure.h1.length > 1">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.multipleH1.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.multipleH1.description.replace('{count}',
                                        String(result.headingStructure.h1.length)) }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!result?.headingStructure?.h2 || !result.headingStructure.h2.length">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addH2.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.addH2.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item v-if="result?.images?.withoutAlt && result.images.withoutAlt > 0">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addAltText.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.addAltText.description.replace('{count}',
                                        String(result.images.withoutAlt)) }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="result?.contentStats?.readabilityScore && result.contentStats.readabilityScore < 70">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.improveReadability.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{
                                        t().recommendations.improveContent.improveReadability.description.replace('{score}',
                                          result.contentStats.readabilityScore.toFixed(1)) }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!Array.isArray(result?.links?.internal) || !result.links.internal.length">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addInternalLinks.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.addInternalLinks.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="!Array.isArray(result?.links?.external) || !result.links.external.length">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.addExternalLinks.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.addExternalLinks.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item
                                    v-if="getContentIssues(result).length === 0 && calculateContentScore(result) < 90">
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.improveContent.generalImprovements.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.improveContent.generalImprovements.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>
                                </v-list>
                              </v-expansion-panel-text>
                            </v-expansion-panel>

                            <v-expansion-panel>
                              <v-expansion-panel-title>
                                <div class="d-flex align-center">
                                  <v-icon color="info" class="mr-2">mdi-rocket-launch</v-icon>
                                  <span>{{ t().recommendations.seoTips.title }}</span>
                                </div>
                              </v-expansion-panel-title>
                              <v-expansion-panel-text>
                                <v-list>
                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.seoTips.useKeywords.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.seoTips.useKeywords.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.seoTips.optimizeMeta.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.seoTips.optimizeMeta.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.seoTips.improveSpeed.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.seoTips.improveSpeed.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.seoTips.mobileOptimization.title }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.seoTips.mobileOptimization.description }}
                                    </v-list-item-subtitle>
                                  </v-list-item>

                                  <v-list-item>
                                    <v-list-item-title class="font-weight-bold">{{
                                      t().recommendations.seoTips.useSchema.title
                                    }}</v-list-item-title>
                                    <v-list-item-subtitle class="wrap-text">
                                      {{ t().recommendations.seoTips.useSchema.description }}
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
                          {{ t().images.title }} ({{ result.images.data.length }})
                        </v-card-title>
                        <v-card-text>
                          <v-virtual-scroll :items="result.images.data" height="400" item-height="80">
                            <template v-slot="{ item }">
                              <v-list-item @click="openImageDialog(item)">
                                <template v-slot:prepend>
                                  <v-img :src="item.src || ''" width="60" height="60" class="rounded-lg mr-4" cover>
                                    <template v-slot:placeholder>
                                      <v-row class="fill-height ma-0" align="center" justify="center">
                                        <v-icon size="small">mdi-image</v-icon>
                                      </v-row>
                                    </template>
                                  </v-img>
                                </template>
                                <v-list-item-title class="text-truncate">
                                  <a :href="item.src" target="_blank" rel="noopener" class="text-decoration-none"
                                    @click.stop>
                                    {{ truncateUrl(item.src || '', 40) }}
                                  </a>
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                  <v-chip :color="item.alt ? 'success' : 'error'" size="small" class="mt-1">
                                    {{ item.alt ? t().images.hasAlt : t().images.missingAlt }}
                                  </v-chip>
                                  <small v-if="item.alt" class="d-block mt-1 text-truncate">{{ truncateText(item.alt,
                                    30) }}</small>
                                </v-list-item-subtitle>
                                <template v-slot:append>
                                  <div class="d-flex flex-column align-end">
                                    <span class="text-caption text-grey">
                                      {{ item.width }}×{{ item.height }}px
                                    </span>
                                    <v-chip v-if="item.width && item.height" size="x-small" color="success"
                                      class="mt-1">
                                      <v-icon size="x-small" start>mdi-check-circle</v-icon>
                                      {{ t().images.hasDimensions }}
                                    </v-chip>
                                    <v-chip v-else size="x-small" color="warning" class="mt-1">
                                      <v-icon size="x-small" start>mdi-alert</v-icon>
                                      {{ t().images.noDimensions }}
                                    </v-chip>
                                  </div>
                                </template>
                              </v-list-item>
                            </template>
                          </v-virtual-scroll>
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

      <v-dialog v-model="imageDialog" max-width="800px">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ t().images.preview }}</span>
            <v-btn icon @click="imageDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center">
              <v-img :src="selectedImage?.src" max-height="600" contain>
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
            <div v-if="selectedImage?.alt" class="mt-4">
              <div class="text-subtitle-1 font-weight-bold">{{ t().images.altText }}:</div>
              <div class="text-body-1">{{ selectedImage.alt }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { computed, onMounted, ref } from 'vue';
import { useTranslations } from '../../languages';
import { useUserStore } from '../../stores/userStore';
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
} from '../../utils/seo/content-view';
import { SEOResult } from '../../utils/seo/types';

const t = useTranslations('content');

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: t().meta.title,
  meta: [
    { name: 'description', content: t().meta.description },
    { property: 'og:title', content: t().meta.title },
    { property: 'og:description', content: t().meta.description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t().meta.title },
    { name: 'twitter:description', content: t().meta.description }
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
const imageDialog = ref(false);
const selectedImage = ref<{ src: string; alt?: string } | null>(null);

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
    return t().issues.missingH1;
  }

  if (page.contentStats?.wordCount && page.contentStats.wordCount < 300) {
    return `${t().issues.shortContent} (${page.contentStats.wordCount} ${t().statistics.wordCount.toLowerCase()})`;
  }

  if (page.headingStructure?.h1 && page.headingStructure.h1.length > 1) {
    return `${t().issues.multipleH1} (${page.headingStructure.h1.length})`;
  }

  if (!page.headingStructure?.h2 || page.headingStructure.h2.length === 0) {
    return t().issues.brokenHeadingStructure;
  }

  if (page.contentStats?.readabilityScore && page.contentStats.readabilityScore < 50) {
    return `${t().issues.poorReadability} (${page.contentStats.readabilityScore.toFixed(1)})`;
  }

  if (page.images?.withoutAlt && page.images.withoutAlt > 0) {
    return `${page.images.withoutAlt} ${t().issues.missingAltText}`;
  }

  return t().issues.brokenHeadingStructure;
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
  if (results.value.length <= 1) return t().trends.stable;

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();

  if (Math.abs(mainPageScore - avgScore) < 5) return t().trends.stable;
  return mainPageScore > avgScore ? t().trends.declining : t().trends.improving;
};

const getScoreTrendTooltip = (): string => {
  if (results.value.length <= 1) return t().trends.tooltipStable;

  const mainPageScore = calculateContentScore(results.value[0]);
  const avgScore = getAverageContentScore();
  const diff = Math.abs(mainPageScore - avgScore);

  if (diff < 5) {
    return t().trends.tooltipStable;
  } else if (mainPageScore > avgScore) {
    return t().trends.tooltipDeclining;
  } else {
    return t().trends.tooltipImproving;
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
    error.value = t().form.urlRule;
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
      throw new Error(`${t().error.title} ${response.status}: ${response.statusText}`);
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
            console.error(`${t().error.title} ${pageUrl}:`, e);
          }
        }
      }
    } else {
      results.value.push(data);
    }

    openPanel.value = 0;
  } catch (e) {
    console.error(t().error.title, e);
    error.value = e instanceof Error ? e.message : t().error.message;
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

interface ImageItem {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  hasDimensions?: boolean;
  title?: string;
}

const openImageDialog = (image: ImageItem) => {
  if (!image.src) return;
  selectedImage.value = {
    src: image.src,
    alt: image.alt
  };
  imageDialog.value = true;
};

onMounted(() => {
});
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

.border-info {
  border-left: 4px solid rgb(var(--v-theme-info)) !important;
}

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
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
  display: block;
}

.v-list-item {
  cursor: pointer;
  padding-right: 16px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-list-item :deep(.v-list-item__append) {
  padding-left: 16px;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
</style>