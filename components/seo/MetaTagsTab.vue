<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Meta Tags analysis</h3>

    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-chart-donut</v-icon>
            Score Meta Tags
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-center align-center">
              <v-progress-circular :model-value="calculateMetaTagsScore(result)"
                :color="getScoreColor(calculateMetaTagsScore(result))" size="100" width="12">
                <span class="text-h6 font-weight-bold">{{ calculateMetaTagsScore(result) }}%</span>
              </v-progress-circular>
            </div>
            <div class="text-center mt-4">
              <p class="text-h6" :class="`text-${getScoreColor(calculateMetaTagsScore(result))}`">
                {{ getScoreLabel(calculateMetaTagsScore(result)) }}
              </p>
            </div>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-file-document-outline</v-icon>
            Basic Meta Tags
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item>
                <v-list-item-title>Title</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span class="text-truncate">{{ result?.title || 'Missing' }}</span>
                  <v-chip size="x-small" :color="result?.title ? 'success' : 'error'" class="ml-2">
                    {{ result?.title ? 'OK' : 'Missing' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Meta Description</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span class="text-truncate">{{ result?.description || 'Missing' }}</span>
                  <v-chip size="x-small" :color="result?.description ? 'success' : 'error'" class="ml-2">
                    {{ result?.description ? 'OK' : 'Missing' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Viewport</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span class="text-truncate">{{ result?.viewport || 'Missing' }}</span>
                  <v-chip size="x-small" :color="result?.mobileCompatibility?.hasViewport ? 'success' : 'error'"
                    class="ml-2">
                    {{ result?.mobileCompatibility?.hasViewport ? 'OK' : 'Missing' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Canonical URL</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span class="text-truncate">{{ getCanonicalUrl(result) || 'Missing' }}</span>
                  <v-chip size="x-small" :color="getCanonicalUrl(result) ? 'success' : 'warning'" class="ml-2">
                    {{ getCanonicalUrl(result) ? 'OK' : 'Missing' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Robots</v-list-item-title>
                <v-list-item-subtitle class="d-flex align-center">
                  <span>{{ result?.technicalSEO?.robotsTxtFound ? 'Found' : 'Not found' }}</span>
                  <v-chip size="x-small" :color="result?.technicalSEO?.robotsTxtFound ? 'success' : 'warning'"
                    class="ml-2">
                    {{ result?.technicalSEO?.robotsTxtFound ? 'OK' : 'Missing' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-share-variant</v-icon>
            Social Preview
          </v-card-title>
          <v-card-text>
            <div class="social-preview mb-4">
              <div class="social-card pa-4 rounded mb-3">
                <div class="social-image mb-2" v-if="getSocialImage()">
                  <v-img :src="getSocialImage()" height="180" cover class="rounded"></v-img>
                </div>
                <div class="social-domain text-caption text-grey mb-1">{{ extractDomain(result?.url) }}</div>
                <div class="social-title text-primary text-h6 mb-1">{{ getSocialTitle() }}</div>
                <div class="social-description text-body-2">{{ getSocialDescription() }}</div>
              </div>
              <div class="text-center text-caption text-grey">Preview of how your page might appear on social media
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon start>mdi-tag-multiple</v-icon>
            Meta Tags Details
          </v-card-title>
          <v-card-text>
            <div class="meta-tags-details">
              <h3>Basic Meta Tags</h3>

              <template v-for="(tag, index) in [
                {
                  name: 'Title',
                  content: result?.title,
                  status: 'success',
                  show: !!result?.title
                },
                {
                  name: 'Meta Description',
                  content: result?.description,
                  status: 'success',
                  show: !!result?.description
                },
                {
                  name: 'Robots',
                  content: result?.technicalSEO?.robotsTxtFound ? 'Found' : 'Not found',
                  status: 'info',
                  show: true
                },
                {
                  name: 'Viewport',
                  content: result?.viewport ||
                    (result?.mobileCompatibility?.hasViewport ? 'Found' : 'Not found'),
                  status: 'info',
                  show: true
                }
              ]" :key="index">
                <div v-if="tag.show" class="mb-4">
                  <div class="text-caption text-grey">{{ tag.name }}</div>
                  <div class="text-body-2">{{ tag.content }}</div>
                </div>
              </template>

              <h3 class="mt-5">Open Graph Tags</h3>
              <div v-if="!hasOpenGraphTags" class="text-body-2 text-warning-darken-1 mb-4">
                <v-icon color="warning" class="mr-1">mdi-alert</v-icon>
                No Open Graph tags found
              </div>
              <template v-else>
                <div v-for="tag in result?.socialTags?.ogTags" :key="tag.property" class="mb-3">
                  <div class="text-caption text-grey">{{ tag.property }}</div>
                  <div class="text-body-2">{{ tag.content }}</div>
                </div>
              </template>

              <h3 class="mt-5">Twitter Cards</h3>
              <div v-if="!hasTwitterTags" class="text-body-2 text-warning-darken-1 mb-4">
                <v-icon color="warning" class="mr-1">mdi-alert</v-icon>
                No Twitter Card tags found
              </div>
              <template v-else>
                <div v-for="tag in result?.socialTags?.twitterTags" :key="tag.name" class="mb-3">
                  <div class="text-caption text-grey">{{ tag.name }}</div>
                  <div class="text-body-2">{{ tag.content }}</div>
                </div>
              </template>
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
            Recommendations
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="!result?.title" prepend-icon="mdi-format-title">
                <v-list-item-title>Add a title tag</v-list-item-title>
                <v-list-item-subtitle>
                  The title tag is essential for SEO and should be between 50-60 characters.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!result?.description" prepend-icon="mdi-text-box">
                <v-list-item-title>Add a meta description</v-list-item-title>
                <v-list-item-subtitle>
                  The meta description helps improve click-through rates from search results and should be between
                  150-160
                  characters.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!result?.mobileCompatibility?.hasViewport" prepend-icon="mdi-cellphone">
                <v-list-item-title>Add a viewport meta tag</v-list-item-title>
                <v-list-item-subtitle>
                  The viewport meta tag is required for responsive design and mobile-friendly pages.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasOpenGraphTags" prepend-icon="mdi-facebook">
                <v-list-item-title>Add Open Graph tags</v-list-item-title>
                <v-list-item-subtitle>
                  Open Graph tags improve how your content appears when shared on social media platforms.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasTwitterTags" prepend-icon="mdi-twitter">
                <v-list-item-title>Add Twitter Card tags</v-list-item-title>
                <v-list-item-subtitle>
                  Twitter Card tags enhance how your content appears when shared on Twitter.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!getCanonicalUrl(result)" prepend-icon="mdi-link">
                <v-list-item-title>Add a canonical URL tag</v-list-item-title>
                <v-list-item-subtitle>
                  The canonical URL tag helps prevent duplicate content issues by specifying the preferred version of a
                  page.
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item v-if="!hasMetaTagIssues" prepend-icon="mdi-check-all">
                <v-list-item-title>Great job!</v-list-item-title>
                <v-list-item-subtitle>
                  Your meta tags are well implemented. Continue maintaining this standard.
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
import { getScoreColor } from '../../utils/seo/getScore';
import { calculateMetaTagsScore } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const hasOpenGraphTags = computed(() => {
  return props.result?.socialTags?.ogTags && props.result.socialTags.ogTags.length > 0;
});

const hasTwitterTags = computed(() => {
  return props.result?.socialTags?.twitterTags && props.result.socialTags.twitterTags.length > 0;
});

const hasMetaTagIssues = computed(() => {
  return !props.result?.title ||
    !props.result?.description ||
    !props.result?.mobileCompatibility?.hasViewport ||
    !hasOpenGraphTags.value ||
    !hasTwitterTags.value ||
    !getCanonicalUrl(props.result);
});

const getMetaTagsScore = (result) => {
  if (!result) return 0;

  let score = 0;
  const maxScore = 100;

  // Basic meta tags (60%)
  if (result.title) score += 20;
  if (result.description) score += 20;
  if (result.mobileCompatibility?.hasViewport) score += 10;
  if (getCanonicalUrl(result)) score += 10;

  // Social meta tags (40%)
  if (hasOpenGraphTags.value) {
    // Check for essential OG tags
    const ogTags = result.socialTags?.ogTags || [];
    const hasOgTitle = ogTags.some(tag => tag.property === 'og:title');
    const hasOgDesc = ogTags.some(tag => tag.property === 'og:description');
    const hasOgImage = ogTags.some(tag => tag.property === 'og:image');
    const hasOgUrl = ogTags.some(tag => tag.property === 'og:url');

    if (hasOgTitle) score += 5;
    if (hasOgDesc) score += 5;
    if (hasOgImage) score += 10;
    if (hasOgUrl) score += 5;
  }

  if (hasTwitterTags.value) {
    // Check for essential Twitter tags
    const twitterTags = result.socialTags?.twitterTags || [];
    const hasTwitterCard = twitterTags.some(tag => tag.name === 'twitter:card');
    const hasTwitterTitle = twitterTags.some(tag => tag.name === 'twitter:title');
    const hasTwitterDesc = twitterTags.some(tag => tag.name === 'twitter:description');
    const hasTwitterImage = twitterTags.some(tag => tag.name === 'twitter:image');

    if (hasTwitterCard) score += 5;
    if (hasTwitterTitle) score += 2.5;
    if (hasTwitterDesc) score += 2.5;
    if (hasTwitterImage) score += 5;
  }

  return Math.min(maxScore, score);
};

const getScoreLabel = (value: number): string => {
  if (value < 50) return 'Mauvais';
  if (value < 75) return 'Moyen';
  return 'Excellent';
};

const getCanonicalUrl = (result) => {
  if (!result) return null;

  // Check if we have direct access to canonical URL in the result
  if (result.canonical) return result.canonical;

  // Otherwise, try to find it in the link tags
  const linkTags = result.linkTags || [];
  const canonicalTag = linkTags.find(tag => tag.rel === 'canonical');

  return canonicalTag ? canonicalTag.href : null;
};

const getSocialTitle = () => {
  const ogTags = props.result?.socialTags?.ogTags || [];
  const twitterTags = props.result?.socialTags?.twitterTags || [];

  // Check OG title first
  const ogTitle = ogTags.find(tag => tag.property === 'og:title');
  if (ogTitle && ogTitle.content) return ogTitle.content;

  // Then Twitter title
  const twitterTitle = twitterTags.find(tag => tag.name === 'twitter:title');
  if (twitterTitle && twitterTitle.content) return twitterTitle.content;

  // Fall back to regular title
  return props.result?.title || 'No title available';
};

const getSocialDescription = () => {
  const ogTags = props.result?.socialTags?.ogTags || [];
  const twitterTags = props.result?.socialTags?.twitterTags || [];

  // Check OG description first
  const ogDesc = ogTags.find(tag => tag.property === 'og:description');
  if (ogDesc && ogDesc.content) return ogDesc.content;

  // Then Twitter description
  const twitterDesc = twitterTags.find(tag => tag.name === 'twitter:description');
  if (twitterDesc && twitterDesc.content) return twitterDesc.content;

  // Fall back to regular description
  return props.result?.description || 'No description available';
};

const getSocialImage = () => {
  const ogTags = props.result?.socialTags?.ogTags || [];
  const twitterTags = props.result?.socialTags?.twitterTags || [];

  // Check OG image first
  const ogImage = ogTags.find(tag => tag.property === 'og:image');
  if (ogImage && ogImage.content) return ogImage.content;

  // Then Twitter image
  const twitterImage = twitterTags.find(tag => tag.name === 'twitter:image');
  if (twitterImage && twitterImage.content) return twitterImage.content;

  // No image available
  return null;
};

const extractDomain = (url) => {
  if (!url) return '';

  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch (e) {
    return url;
  }
};
</script>

<style scoped>
.meta-tags-details h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.social-card {
  border: 1px solid #e0e0e0;
  max-width: 500px;
  background-color: #ffffff;
}

.social-title {
  font-weight: 500;
  line-height: 1.2;
  max-height: 2.4em;
  overflow: hidden;
}

.social-description {
  color: #505050;
  max-height: 4.5em;
  overflow: hidden;
}
</style>