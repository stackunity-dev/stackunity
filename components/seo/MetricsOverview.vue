<template>
  <v-row>
    <v-col v-for="(metric, index) in metrics" :key="metric.key" cols="12" sm="4" md="2.4"
      class="d-flex flex-column align-center">
      <v-progress-circular :model-value="metricValues[metric.key] || 0"
        :color="getMetricColor(metricValues[metric.key] || 0)" size="70" width="6">
        <span class="text-body-2 font-weight-medium">{{ metricValues[metric.key] || 0 }}%</span>
      </v-progress-circular>
      <div class="text-caption mt-2 text-center">{{ metric.title }}</div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import {
  calculateAccessibilityScore,
  calculateContentScore,
  calculateMetaTagsScore,
  calculateSecurityScore,
  calculateTechnicalSeoScore,
  calculateEngagementScore,
  getMetricColor
} from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// Vérifier si le résultat est valide pour le debug
watchEffect(() => {
  console.log('MetricsOverview props.result:', props.result);

  // Debug détaillé des calculs
  if (props.result) {
    // Structure des headings
    console.log('Headings:', props.result.headings || props.result.headingStructure);

    // Images
    if (props.result.images) {
      if (Array.isArray(props.result.images)) {
        console.log('Images array length:', props.result.images.length);
        console.log('Images with alt:', props.result.images.filter(img => img && img.alt).length);
      } else if (props.result.images.data) {
        console.log('Images data length:', props.result.images.data.length);
        console.log('Images with alt:', props.result.images.data.filter(img => img && img.alt).length);
      } else {
        console.log('Images stats:', {
          total: props.result.images.total || 0,
          withAlt: props.result.images.withAlt || 0
        });
      }
    }

    // Liens
    console.log('Internal links:', props.result.links?.internal?.length || props.result.internalLinks?.length || 0);
    console.log('External links:', props.result.links?.external?.length || props.result.externalLinks?.length || 0);

    // Word count
    console.log('Content length:', props.result.contentLength || props.result.wordCount || 0);
  }
});

const metrics = [
  { key: 'metaTags', title: 'Meta tags' },
  { key: 'content', title: 'Content' },
  { key: 'technicalSeo', title: 'SEO technique' },
  { key: 'accessibility', title: 'Accessibilité' },
  { key: 'security', title: 'Security' },
  { key: 'engagement', title: 'Engagement' }
];

const metricValues = computed(() => {
  try {
    // Valeurs par défaut si result est undefined/null ou incomplet
    if (!props.result) {
      console.log('MetricsOverview: result est undefined ou null');
      return {
        metaTags: 0,
        content: 0,
        technicalSeo: 0,
        accessibility: 0,
        security: 0,
        engagement: 0
      };
    }

    // Utiliser les fonctions importées pour calculer les scores
    return {
      metaTags: calculateMetaTagsScore(props.result) || 0,
      content: calculateContentScore(props.result) || 0,
      technicalSeo: calculateTechnicalSeoScore(props.result) || 0,
      accessibility: calculateAccessibilityScore(props.result) || 0,
      security: calculateSecurityScore(props.result) || 0,
      engagement: calculateEngagementScore(props.result) || 0
    };
  } catch (err) {
    console.error('MetricsOverview: Erreur lors du calcul des métriques:', err);
    // En cas d'erreur, retourner des valeurs par défaut
    return {
      metaTags: 0,
      content: 0,
      technicalSeo: 0,
      accessibility: 0,
      security: 0,
      engagement: 0
    };
  }
});
</script>