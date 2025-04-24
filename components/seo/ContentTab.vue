<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Content analysis</h3>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-chart-donut</v-icon>
            Content score
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center">
              <v-progress-circular :model-value="calculateContentScore(result)"
                :color="getScoreColor(calculateContentScore(result))" size="100" width="12">
                <span class="text-h6 font-weight-bold">{{ calculateContentScore(result) }}%</span>
              </v-progress-circular>
            </div>
            <div class="text-center mt-4">
              <p class="text-h6" :class="`text-${getScoreColor(calculateContentScore(result))}`">
                {{ getScoreLabel(calculateContentScore(result)) }}
              </p>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-text</v-icon>
            Content statistics
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Number of words</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span>{{ result?.contentStats?.wordCount || 0 }}</span>
                  <v-chip size="x-small" :color="getWordCountColor(result?.contentStats?.wordCount || 0)" class="ml-2">
                    {{ getWordCountRating(result?.contentStats?.wordCount || 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Readability score</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span>{{ (result?.contentStats?.readabilityScore || 0).toFixed(1) }}</span>
                  <v-chip size="x-small" :color="getReadabilityColor(result?.contentStats?.readabilityScore || 0)"
                    class="ml-2">
                    {{ getReadabilityRating(result?.contentStats?.readabilityScore || 0) }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="getHeadingCount(result) > 0">
                <v-list-item-title>Detected headings</v-list-item-title>
                <v-list-item-subtitle>
                  H1: {{ result?.headingStructure?.h1?.length || 0 }},
                  H2: {{ result?.headingStructure?.h2?.length || 0 }},
                  H3: {{ result?.headingStructure?.h3?.length || 0 }},
                  H4+: {{ (result?.headingStructure?.h4?.length || 0) + (result?.headingStructure?.h5?.length || 0) +
                    (result?.headingStructure?.h6?.length || 0) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="getLinkCount(result) > 0">
                <v-list-item-title>Links</v-list-item-title>
                <v-list-item-subtitle>
                  Internal: {{ result?.links?.internal?.length || 0 }},
                  External: {{ result?.links?.external?.length || 0 }}
                  {{ result?.links?.broken > 0 ? `, Broken: ${result.links.broken}` : '' }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-format-header-pound</v-icon>
            Heading structure
          </v-card-title>
          <v-card-text>
            <div v-if="!hasHeadings" class="text-center pa-4">
              <v-icon color="warning" class="mb-2" size="large">mdi-alert</v-icon>
              <p>No headings (H1-H6) detected on this page.</p>
            </div>
            <div v-else>
              <div class="heading-structure pa-2">
                <div v-if="result?.headingStructure?.h1?.length" class="heading-item h1-item mb-2">
                  <div class="heading-label">H1</div>
                  <div class="heading-content" v-for="(h1, i) in result.headingStructure.h1" :key="`h1-${i}`">
                    {{ h1 }}
                  </div>
                </div>

                <div v-if="result?.headingStructure?.h2?.length" class="heading-item h2-item mb-2 pl-4">
                  <div class="heading-label">H2</div>
                  <div class="heading-content" v-for="(h2, i) in result.headingStructure.h2" :key="`h2-${i}`">
                    {{ h2 }}
                  </div>
                </div>

                <div v-if="result?.headingStructure?.h3?.length" class="heading-item h3-item mb-2 pl-8">
                  <div class="heading-label">H3</div>
                  <div class="heading-content" v-for="(h3, i) in result.headingStructure.h3" :key="`h3-${i}`">
                    {{ h3 }}
                  </div>
                </div>

                <div v-if="result?.headingStructure?.h4?.length" class="heading-item h4-item mb-2 pl-12">
                  <div class="heading-label">H4</div>
                  <div class="heading-content" v-for="(h4, i) in result.headingStructure.h4" :key="`h4-${i}`">
                    {{ h4 }}
                  </div>
                </div>

                <div v-if="result?.headingStructure?.h5?.length" class="heading-item h5-item mb-2 pl-16">
                  <div class="heading-label">H5</div>
                  <div class="heading-content" v-for="(h5, i) in result.headingStructure.h5" :key="`h5-${i}`">
                    {{ h5 }}
                  </div>
                </div>

                <div v-if="result?.headingStructure?.h6?.length" class="heading-item h6-item mb-2 pl-20">
                  <div class="heading-label">H6</div>
                  <div class="heading-content" v-for="(h6, i) in result.headingStructure.h6" :key="`h6-${i}`">
                    {{ h6 }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-image</v-icon>
            Images
          </v-card-title>
          <v-card-text>
            <div v-if="!hasImages" class="text-center pa-4">
              <p>No images detected on this page.</p>
            </div>
            <div v-else>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Total number of images</v-list-item-title>
                  <v-list-item-subtitle>{{ result?.images?.total || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Images with alt attribute</v-list-item-title>
                  <v-list-item-subtitle class="d-flex align-center">
                    <span>{{ result?.images?.withAlt || 0 }}</span>
                    <v-chip size="x-small" :color="getMissingAltColor(result)" class="ml-2">
                      {{ getMissingAltRating(result) }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="result?.images?.withoutAlt > 0">
                  <v-list-item-title>Images without alt attribute</v-list-item-title>
                  <v-list-item-subtitle class="d-flex align-center text-error">
                    {{ result?.images?.withoutAlt || 0 }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-expansion-panels v-if="result?.images?.data && result?.images?.data.length > 0" variant="accordion"
                class="mt-3">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon color="info" class="mr-2">mdi-image</v-icon>
                      <div>Images details ({{ result?.images?.data?.length || 0 }})</div>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="bg-cream">
                    <div class="overflow-x-auto">
                      <v-table density="compact" class="images-table">
                        <thead>
                          <tr>
                            <th width="80">Image</th>
                            <th>Source</th>
                            <th width="120">Alt</th>
                            <th width="100">Dimensions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(img, index) in result?.images?.data" :key="index"
                            :class="index % 2 === 0 ? 'bg-cream-light' : 'bg-cream'">
                            <td class="text-center">
                              <v-img :src="img.src" max-width="60" max-height="60" class="mx-auto"
                                :alt="img.alt || 'No alt text'" contain></v-img>
                            </td>
                            <td>
                              <div class="source-path text-caption">{{ truncateText(img.src, 40) }}</div>
                            </td>
                            <td>
                              <v-chip size="x-small" :color="img.alt ? 'success' : 'error'" class="text-caption">
                                {{ truncateText(img.alt, 20) || 'Missing' }}
                              </v-chip>
                            </td>
                            <td class="text-caption">
                              <span v-if="img.dimensions && img.dimensions.width && img.dimensions.height">
                                {{ img.dimensions.width }}x{{ img.dimensions.height }}
                              </span>
                              <span v-else>Unknown</span>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-expansion-panels v-if="result?.images?.withoutAlt > 0" variant="accordion" class="mt-3">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon color="warning" class="mr-2">mdi-image-off</v-icon>
                      <div>Images without alt attribute ({{ result?.images?.withoutAlt || 0 }})</div>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list density="compact">
                      <v-list-item v-for="(img, index) in getMissingAltImages()" :key="index"
                        :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                        <v-list-item-title class="text-truncate">
                          <code>{{ img.src || 'Unknown source' }}</code>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-link</v-icon>
            Links analysis
          </v-card-title>
          <v-card-text>
            <div v-if="!hasLinks" class="text-center pa-4">
              <p>No links detected on this page.</p>
            </div>
            <div v-else>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>Internal links</v-list-item-title>
                  <v-list-item-subtitle>{{ result?.links?.internal?.length || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>External links</v-list-item-title>
                  <v-list-item-subtitle>{{ result?.links?.external?.length || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Nofollow links</v-list-item-title>
                  <v-list-item-subtitle>{{ result?.links?.nofollow || 0 }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="result?.links?.broken > 0">
                  <v-list-item-title>Broken links</v-list-item-title>
                  <v-list-item-subtitle class="d-flex align-center text-error">
                    {{ result?.links?.broken || 0 }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-expansion-panels v-if="result?.links?.broken > 0" variant="accordion" class="mt-3">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon color="error" class="mr-2">mdi-link-off</v-icon>
                      <div>Broken links ({{ result?.links?.broken || 0 }})</div>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list density="compact">
                      <v-list-item v-for="(link, index) in result?.links?.brokenLinks" :key="index"
                        :class="index % 2 === 0 ? 'bg-grey-lighten-4' : ''">
                        <v-list-item-title class="text-truncate">
                          <code>{{ link }}</code>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-check-circle</v-icon>
            Content recommendations
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="!hasHeadings || !result?.headingStructure?.h1?.length"
                prepend-icon="mdi-format-header-1">
                <v-list-item-title>Add a H1 title</v-list-item-title>
                <v-list-item-subtitle>
                  Each page should have a unique H1 title that clearly reflects its main content.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.headingStructure?.h1?.length > 1" prepend-icon="mdi-format-header-1">
                <v-list-item-title>Use only one H1 title</v-list-item-title>
                <v-list-item-subtitle>
                  Each page should have only one H1 title. Multiple H1 titles can dilute the focus of the page.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasStructuredHeadings && getHeadingCount(result) > 0"
                prepend-icon="mdi-format-header-pound">
                <v-list-item-title>Structure the headings correctly</v-list-item-title>
                <v-list-item-subtitle>
                  Follow a logical hierarchy of headings (H1 > H2 > H3) without skipping levels.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.contentStats?.wordCount < 300" prepend-icon="mdi-text">
                <v-list-item-title>Increase the content length</v-list-item-title>
                <v-list-item-subtitle>
                  The short content ({{ result?.contentStats?.wordCount || 0 }} words) is less likely to rank well.
                  Aim for at least 300-500 words.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.images?.withoutAlt > 0" prepend-icon="mdi-image">
                <v-list-item-title>Add alt attributes to images</v-list-item-title>
                <v-list-item-subtitle>
                  {{ result?.images?.withoutAlt || 0 }} image(s) have no alt attribute. Add relevant descriptions to all
                  images.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="result?.links?.broken > 0" prepend-icon="mdi-link-variant-off">
                <v-list-item-title>Fix broken links</v-list-item-title>
                <v-list-item-subtitle>
                  {{ result?.links?.broken || 0 }} broken link(s) detected. Fix or remove these links.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="getLinkCount(result) === 0" prepend-icon="mdi-link-variant">
                <v-list-item-title>Add relevant links</v-list-item-title>
                <v-list-item-subtitle>
                  This page contains no links. Add relevant internal links to other pages of your site.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="hasLowReadability" prepend-icon="mdi-text-search">
                <v-list-item-title>Improve readability</v-list-item-title>
                <v-list-item-subtitle>
                  The content may be difficult to read. Use shorter phrases and simpler language.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="isContentOptimal" prepend-icon="mdi-check-all">
                <v-list-item-title>Well optimized content</v-list-item-title>
                <v-list-item-subtitle>
                  Your content seems well structured and optimized for SEO.
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calculateContentScore, getMetricColor } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

// Alias getMetricColor comme getScoreColor pour maintenir la compatibilité 
const getScoreColor = getMetricColor;

const hasHeadings = computed(() => {
  if (!props.result?.headingStructure) return false;

  const { h1, h2, h3, h4, h5, h6 } = props.result.headingStructure;
  return (h1?.length || 0) + (h2?.length || 0) + (h3?.length || 0) +
    (h4?.length || 0) + (h5?.length || 0) + (h6?.length || 0) > 0;
});

const hasStructuredHeadings = computed(() => {
  if (!props.result?.headingStructure) return true;

  const h1Count = props.result.headingStructure.h1?.length || 0;
  const h2Count = props.result.headingStructure.h2?.length || 0;
  const h3Count = props.result.headingStructure.h3?.length || 0;
  const h4Count = props.result.headingStructure.h4?.length || 0;

  if ((h3Count > 0 || h4Count > 0) && h2Count === 0) return false;

  if (h4Count > 0 && h3Count === 0) return false;

  if (h1Count === 0 && (h2Count > 0 || h3Count > 0 || h4Count > 0)) return false;

  return true;
});

const hasLinks = computed(() => {
  if (!props.result?.links) return false;

  const internalCount = props.result.links.internal?.length || 0;
  const externalCount = props.result.links.external?.length || 0;

  return internalCount + externalCount > 0;
});

const hasImages = computed(() => {
  return (props.result?.images?.total || 0) > 0;
});

const hasKeywordDensity = computed(() => {
  return props.result?.contentStats?.keywordDensity &&
    Object.keys(props.result.contentStats.keywordDensity).length > 0;
});

const hasLowReadability = computed(() => {
  const score = props.result?.contentStats?.readabilityScore || 0;
  return score < 60;
});

const isContentOptimal = computed(() => {
  const wordCount = props.result?.contentStats?.wordCount || 0;
  const h1Count = props.result?.headingStructure?.h1?.length || 0;
  const missingAlt = props.result?.images?.withoutAlt || 0;
  const brokenLinks = props.result?.links?.broken || 0;

  return wordCount >= 300 &&
    h1Count === 1 &&
    missingAlt === 0 &&
    brokenLinks === 0 &&
    hasStructuredHeadings.value;
});

const getHeadingCount = (result) => {
  if (!result?.headingStructure) return 0;

  const { h1, h2, h3, h4, h5, h6 } = result.headingStructure;
  return (h1?.length || 0) + (h2?.length || 0) + (h3?.length || 0) +
    (h4?.length || 0) + (h5?.length || 0) + (h6?.length || 0);
};

const getLinkCount = (result) => {
  if (!result?.links) return 0;

  const internalCount = result.links.internal?.length || 0;
  const externalCount = result.links.external?.length || 0;

  return internalCount + externalCount;
};

const getMissingAltImages = () => {
  if (!props.result?.images?.data) return [];

  return props.result.images.data.filter(img => !img.alt);
};

const getScoreLabel = (value: number): string => {
  if (value < 50) return 'Mauvais';
  if (value < 75) return 'Moyen';
  return 'Excellent';
};

const getWordCountColor = (count: number): string => {
  if (count < 300) return 'error';
  if (count < 600) return 'warning';
  return 'success';
};

const getWordCountRating = (count: number): string => {
  if (count < 300) return 'Insuffisant';
  if (count < 600) return 'Acceptable';
  return 'Bon';
};

const getReadabilityColor = (score: number): string => {
  if (score < 50) return 'error';
  if (score < 70) return 'warning';
  return 'success';
};

const getReadabilityRating = (score: number): string => {
  if (score < 50) return 'Difficile';
  if (score < 70) return 'Moyen';
  return 'Facile';
};

const getMissingAltColor = (result): string => {
  if (!result?.images) return 'success';

  const total = result.images.total || 0;
  if (total === 0) return 'success';

  const withAlt = result.images.withAlt || 0;
  const percentage = (withAlt / total) * 100;

  if (percentage < 80) return 'error';
  if (percentage < 100) return 'warning';
  return 'success';
};

const getMissingAltRating = (result): string => {
  if (!result?.images) return 'OK';

  const total = result.images.total || 0;
  if (total === 0) return 'OK';

  const withAlt = result.images.withAlt || 0;
  const percentage = (withAlt / total) * 100;

  if (percentage < 80) return 'Mauvais';
  if (percentage < 100) return 'Amélioration nécessaire';
  return 'OK';
};

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};
</script>

<style scoped>
.heading-structure {
  border-left: 2px solid #e0e0e0;
}

.heading-item {
  margin-bottom: 8px;
}

.heading-label {
  font-weight: bold;
  color: #555;
  margin-bottom: 4px;
}

.heading-content {
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.h1-item .heading-label {
  color: #1976d2;
}

.h2-item .heading-label {
  color: #2196f3;
}

.h3-item .heading-label {
  color: #64b5f6;
}

code {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
  word-break: break-all;
}
</style>