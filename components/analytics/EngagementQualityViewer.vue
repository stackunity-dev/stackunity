<template>
  <div class="engagement-analyzer">
    <div class="analyzer-header d-flex align-center mb-4">
      <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ t.engagement?.title || 'Qualité d\'engagement' }}</h3>
      <v-spacer></v-spacer>
      <v-chip color="success" variant="outlined" size="small" class="mr-2">
        <v-icon start size="x-small">mdi-chart-bell-curve</v-icon>
        {{ t.engagement?.helpText || 'Mesure de l\'engagement utilisateur' }}
      </v-chip>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mt-2">{{ t.engagement?.loading || 'Analyse en cours...' }}</div>
    </div>

    <div v-else-if="!engagementData || !Array.isArray(engagementData) || engagementData.length === 0"
      class="text-center py-8">
      <v-icon icon="mdi-chart-bell-curve" size="64" color="grey-darken-1" class="mb-4"></v-icon>
      <h3 class="text-h6 text-grey-darken-1">{{ t.engagement?.noData || 'Pas assez de données pour l\'analyse' }}</h3>
      <p class="text-body-2 text-medium-emphasis">
        {{ t.engagement?.noDataDescription ||
          "Nous n'avons pas encore assez d'informations sur les interactions pour mesurer la qualité d'engagement." }}
      </p>
    </div>

    <div v-else>
      <div class="mb-6">
        <v-select v-if="engagementData && engagementData.length > 1" v-model="selectedPage" :items="pageOptions"
          :label="t.engagement?.selectPage || 'Sélectionner une page'" variant="outlined" density="comfortable"
          return-object item-title="label" item-value="value"></v-select>

        <template v-if="currentPageData">
          <div class="session-summary d-flex justify-space-around align-center pa-4 mb-4 rounded bg-surface">
            <div class="text-center">
              <div class="text-caption text-medium-emphasis">{{ t.engagement?.sessionCount || 'Sessions analysées' }}
              </div>
              <div class="text-h6">{{ currentPageData.sessionCount }}</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <div class="text-caption text-medium-emphasis">{{ t.engagement?.avgDuration || 'Durée moyenne' }}</div>
              <div class="text-h6">{{ formatTime(currentPageData.avgSessionDuration) }}</div>
            </div>
            <v-divider vertical></v-divider>
            <div class="text-center">
              <div class="text-caption text-medium-emphasis">{{ t.engagement?.analysisDate || 'Analyse faite le' }}
              </div>
              <div class="text-h6">{{ getCurrentDate() }}</div>
            </div>
          </div>

          <div class="engagement-overview mb-4">
            <v-card class="quality-score-card">
              <v-card-text class="pa-4">
                <div class="text-center">
                  <div class="text-overline text-medium-emphasis mb-1">
                    {{ t.engagement?.overallScore || 'Score global d\'engagement' }}
                  </div>
                  <div class="score-gauge d-flex flex-column align-center justify-center">
                    <v-progress-circular :model-value="Number(currentPageData.overallScore)"
                      :color="getScoreColor(Number(currentPageData.overallScore))" :rotate="-90" :size="120" :width="12"
                      class="gauge-progress mb-2">
                      {{ formatScore(Number(currentPageData.overallScore)) }}
                    </v-progress-circular>
                    <div class="gauge-label-wrapper mt-2">
                      <span class="gauge-label" :class="`text-${getScoreColor(Number(currentPageData.overallScore))}`">
                        {{ getQualityLabel(Number(currentPageData.overallScore)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-row class="mt-4">
              <v-col v-for="(value, key) in currentPageData.metrics" :key="`metric-${key}`" cols="6" sm="3">
                <v-card class="metric-card h-100" :color="getScoreColor(Number(value))" variant="outlined">
                  <v-card-text class="pa-3">
                    <div class="text-overline text-medium-emphasis text-center">{{ getMetricLabel(key) }}</div>
                    <div class="d-flex flex-column align-center mt-1">
                      <div class="text-h5 font-weight-bold">{{ formatScore(Number(value)) }}</div>
                      <v-progress-linear :model-value="Number(value)" :color="getScoreColor(Number(value))" height="4"
                        rounded class="mt-1" style="width: 80%"></v-progress-linear>
                      <div class="text-caption mt-1">{{ getMetricDescription(key) }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-tabs v-model="activeTab" grow class="mb-4">
            <v-tab value="factors">
              <v-icon start>mdi-chart-scatter-plot</v-icon>
              {{ t.engagement?.factorsTab || 'Facteurs détaillés' }}
            </v-tab>
            <v-tab value="recommendations">
              <v-icon start>mdi-lightbulb-outline</v-icon>
              {{ t.engagement?.recommendationsTab || 'Recommandations' }}
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="factors">
              <v-card class="mb-4" variant="outlined">
                <v-card-title class="py-3 px-4 text-subtitle-1">
                  {{ t.engagement?.factors || 'Facteurs d\'engagement' }}
                  <v-tooltip activator="parent" location="top">
                    {{ t.engagement?.factorsTooltip || 'Métriques détaillées utilisées pour calculer le score global' }}
                  </v-tooltip>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <v-row>
                    <v-col v-for="(value, key) in currentPageData.factors" :key="`factor-${key}`" cols="6" md="4"
                      lg="3">
                      <div class="factor-item pa-2 rounded-lg" :class="getFactorColorClass(key, value)">
                        <div class="text-caption text-medium-emphasis mb-1 d-flex align-center">
                          {{ getFactorLabel(key) }}
                          <v-tooltip activator="parent" location="top">
                            {{ getFactorDescription(key) }}
                          </v-tooltip>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon :color="getFactorColor(key, value)" size="small" class="mr-2">
                            {{ getFactorIcon(key) }}
                          </v-icon>
                          <div class="text-body-1 font-weight-medium">{{ formatFactorValue(key, value) }}</div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="currentPageData && currentPageData.factors && currentPageData.factors.interactionsPerMinute < 1"
                    color="warning" variant="tonal" class="mt-4">
                    Le taux des interactions est assez bas. Cela pourrait indiquer un manque de contenu interactif ou
                    une faible implication des utilisateurs.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-window-item>

            <v-window-item value="recommendations">
              <v-card variant="outlined">
                <v-card-title class="py-3 px-4 text-subtitle-1">
                  {{ t.engagement?.recommendations || 'Recommandations d\'amélioration' }}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-4">
                  <div class="recommendation-items">
                    <v-alert v-for="(recommendation, index) in getRecommendations()" :key="index"
                      :color="recommendation.color" variant="tonal" class="mb-3" density="comfortable">
                      <div class="d-flex align-start">
                        <v-icon :icon="recommendation.icon" class="mr-2 mt-1"></v-icon>
                        <div>
                          <strong class="d-block mb-1">{{ recommendation.title }}</strong>
                          <div class="text-body-2">{{ recommendation.text }}</div>
                        </div>
                      </div>
                    </v-alert>

                    <v-alert v-if="getRecommendations().length === 0" color="info" variant="tonal" class="mt-4">
                      {{ t.engagement?.noRecommendations ||
                        `Aucune recommandation spécifique pour le moment. La page ${currentPageData.pageUrl} semble avoir
                      un bon niveau d'engagement.` }}
                    </v-alert>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useTranslations } from '../../languages';

interface EngagementMetrics {
  pageUrl: string;
  sessionCount: number;
  avgSessionDuration: number;
  overallScore: number;
  metrics: {
    interactionRate: number;
    scrollDepth: number;
    timeOnPage: number;
    returnRate: number;
  };
  factors: {
    interactionsPerMinute: number;
    scrollPercentage: number;
    averageTimeSpent: number;
    bounceRate: number;
    clickThroughRate: number;
    formCompletionRate: number;
    readingTime: number;
  };
}

interface Recommendation {
  icon: string;
  color: string;
  title: string;
  text: string;
}

const props = defineProps<{
  websiteId: string;
  period?: string;
}>();

const t = useTranslations('analytics')();
const isLoading = ref(true);
const engagementData = ref<EngagementMetrics[]>([]);
const selectedPage = ref<{ label: string; value: string } | null>(null);
const activeTab = ref('factors');

const pageOptions = computed(() => {
  if (!engagementData.value || !Array.isArray(engagementData.value)) return [];

  return engagementData.value.map(data => ({
    label: formatPageUrl(data.pageUrl),
    value: data.pageUrl
  }));
});

const currentPageData = computed(() => {
  if (!selectedPage.value || !engagementData.value || !Array.isArray(engagementData.value) || engagementData.value.length === 0) return null;
  return engagementData.value.find(data => data.pageUrl === selectedPage.value?.value) || null;
});

onMounted(async () => {
  await fetchEngagementData();
});

watch(() => props.period, async () => {
  await fetchEngagementData();
});

async function fetchEngagementData() {
  isLoading.value = true;
  try {
    const periodParam = props.period ? `?period=${props.period}` : '';
    const response = await fetch(`/api/analytics/website/${props.websiteId}/engagement${periodParam}`);
    const result = await response.json();

    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      engagementData.value = result.data;

      // Sélectionner la première page par défaut
      if (engagementData.value.length > 0) {
        selectedPage.value = {
          label: formatPageUrl(engagementData.value[0].pageUrl),
          value: engagementData.value[0].pageUrl
        };
      }
    } else {
      console.warn('Aucune donnée d\'engagement ou format incorrect:', result);
      engagementData.value = [];
      selectedPage.value = null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'engagement:', error);
    engagementData.value = [];
    selectedPage.value = null;
  } finally {
    isLoading.value = false;
  }
}

function formatPageUrl(url: string): string {
  if (!url) return 'Page inconnue';

  try {
    // Si c'est une URL complète
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      let path = urlObj.pathname;

      // Remplacer les chemins vides ou "/" par "Page d'accueil"
      if (path === '/' || path === '') {
        return 'Page d\'accueil';
      }

      // Supprimer les préfixes de langue
      path = path.replace(/^\/(fr|en)(\/|$)/, '$2');

      // Limiter la longueur
      if (path.length > 30) {
        path = path.substring(0, 27) + '...';
      }

      return path;
    }

    // Si c'est juste un chemin
    if (url === '/' || url === '') {
      return 'Page d\'accueil';
    }

    if (url.length > 30) {
      return url.substring(0, 27) + '...';
    }

    return url;
  } catch (e) {
    return url;
  }
}

function formatTime(seconds: number): string {
  if (!seconds) return '0s';

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function getCurrentDate(): string {
  const date = new Date();
  return date.toLocaleDateString();
}

function formatScore(score: number): string {
  return `${Math.round(score)}`;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
}

function getQualityLabel(score: number): string {
  if (score >= 80) return t.engagement?.qualityExcellent || 'Excellent';
  if (score >= 60) return t.engagement?.qualityGood || 'Bon';
  if (score >= 40) return t.engagement?.qualityAverage || 'Moyen';
  if (score >= 20) return t.engagement?.qualityPoor || 'Faible';
  return t.engagement?.qualityVeryPoor || 'Très faible';
}

function getMetricLabel(key: string): string {
  const labels = {
    interactionRate: t.engagement?.metrics?.interactionRate || 'Interactions',
    scrollDepth: t.engagement?.metrics?.scrollDepth || 'Défilement',
    timeOnPage: t.engagement?.metrics?.timeOnPage || 'Temps',
    returnRate: t.engagement?.metrics?.returnRate || 'Retours'
  };
  return labels[key] || key;
}

function getMetricDescription(key: string): string {
  const descriptions = {
    interactionRate: t.engagement?.metricDescription?.interactionRate || 'Taux d\'interaction',
    scrollDepth: t.engagement?.metricDescription?.scrollDepth || 'Profondeur de défilement',
    timeOnPage: t.engagement?.metricDescription?.timeOnPage || 'Temps sur la page',
    returnRate: t.engagement?.metricDescription?.returnRate || 'Taux de retour'
  };
  return descriptions[key] || '';
}

function getFactorLabel(key: string): string {
  const labels = {
    interactionsPerMinute: t.engagement?.factorsLabels?.interactionsPerMinute || 'Interactions/min',
    scrollPercentage: t.engagement?.factorsLabels?.scrollPercentage || 'Défilement (%)',
    averageTimeSpent: t.engagement?.factorsLabels?.averageTimeSpent || 'Temps moyen (s)',
    bounceRate: t.engagement?.factorsLabels?.bounceRate || 'Taux de rebond (%)',
    clickThroughRate: t.engagement?.factorsLabels?.clickThroughRate || 'Taux de clic (%)',
    formCompletionRate: t.engagement?.factorsLabels?.formCompletionRate || 'Formulaires (%)',
    readingTime: t.engagement?.factorsLabels?.readingTime || 'Temps de lecture'
  };
  return labels[key] || key;
}

function getFactorDescription(key: string): string {
  const descriptions = {
    interactionsPerMinute: t.engagement?.factorDescriptions?.interactionsPerMinute || 'Nombre moyen d\'interactions par minute',
    scrollPercentage: t.engagement?.factorDescriptions?.scrollPercentage || 'Pourcentage moyen de défilement de la page',
    averageTimeSpent: t.engagement?.factorDescriptions?.averageTimeSpent || 'Temps moyen passé sur la page en secondes',
    bounceRate: t.engagement?.factorDescriptions?.bounceRate || 'Pourcentage de visiteurs qui quittent après une seule page',
    clickThroughRate: t.engagement?.factorDescriptions?.clickThroughRate || 'Pourcentage de visiteurs qui cliquent sur un élément',
    formCompletionRate: t.engagement?.factorDescriptions?.formCompletionRate || 'Pourcentage de formulaires complétés',
    readingTime: t.engagement?.factorDescriptions?.readingTime || 'Estimation du temps de lecture du contenu'
  };
  return descriptions[key] || '';
}

function getFactorIcon(key: string): string {
  const icons = {
    interactionsPerMinute: 'mdi-gesture-tap',
    scrollPercentage: 'mdi-gesture-swipe-vertical',
    averageTimeSpent: 'mdi-clock-outline',
    bounceRate: 'mdi-exit-run',
    clickThroughRate: 'mdi-cursor-default-click',
    formCompletionRate: 'mdi-form-select',
    readingTime: 'mdi-book-open-page-variant'
  };
  return icons[key] || 'mdi-chart-bar';
}

function getFactorColor(key: string, value: number): string {
  if (key === 'bounceRate') {
    // Pour le taux de rebond, un score bas est meilleur
    if (value <= 30) return 'success';
    if (value <= 50) return 'info';
    if (value <= 70) return 'warning';
    return 'error';
  }

  // Pour les autres métriques, un score élevé est meilleur
  if (key === 'interactionsPerMinute') {
    if (value >= 3) return 'success';
    if (value >= 1.5) return 'info';
    if (value >= 0.5) return 'warning';
    return 'error';
  }

  if (key === 'averageTimeSpent') {
    if (value >= 120) return 'success';
    if (value >= 60) return 'info';
    if (value >= 30) return 'warning';
    return 'error';
  }

  // Pour les pourcentages
  if (value >= 80) return 'success';
  if (value >= 60) return 'info';
  if (value >= 40) return 'warning';
  return 'error';
}

function getFactorColorClass(key: string, value: number): string {
  const color = getFactorColor(key, value);
  return `bg-${color}-lighten-5`;
}

function formatFactorValue(key: string, value: number): string {
  if (key === 'averageTimeSpent') {
    return formatTime(value);
  }

  if (key === 'interactionsPerMinute') {
    return value.toFixed(1);
  }

  if (['scrollPercentage', 'bounceRate', 'clickThroughRate', 'formCompletionRate'].includes(key)) {
    return `${value}%`;
  }

  return value.toString();
}

function getRecommendations(): Recommendation[] {
  if (!currentPageData.value || !currentPageData.value.factors || !currentPageData.value.metrics) return [];

  const recommendations: Recommendation[] = [];
  const factors = currentPageData.value.factors;
  const metrics = currentPageData.value.metrics;

  // Textes par défaut
  const defaultTexts = {
    lowInteractionTitle: 'Améliorer l\'interactivité',
    lowInteractionText: 'Ajoutez plus d\'éléments interactifs comme des boutons d\'appel à l\'action, des formulaires courts ou des éléments cliquables pour encourager l\'engagement.',
    lowScrollTitle: 'Améliorer le défilement',
    lowScrollText: 'Le contenu important devrait être visible sans défilement ou inciter clairement les utilisateurs à faire défiler pour plus d\'informations.',
    lowTimeTitle: 'Augmenter le temps passé',
    lowTimeText: 'Créez du contenu plus engageant et pertinent pour maintenir l\'intérêt des utilisateurs plus longtemps sur votre page.',
    highBounceTitle: 'Réduire le taux de rebond',
    highBounceText: 'Améliorez la première impression et assurez-vous que votre contenu correspond aux attentes des visiteurs pour réduire le taux de rebond.',
    lowCTRTitle: 'Améliorer le taux de clic',
    lowCTRText: 'Rendez vos appels à l\'action plus visibles et convaincants pour encourager les utilisateurs à cliquer.',
    generalTitle: 'Amélioration globale nécessaire',
    generalText: 'Envisagez une refonte de cette page pour améliorer l\'expérience utilisateur et l\'engagement global.'
  };

  // Recommandations basées sur le taux d'interaction
  if (metrics.interactionRate < 40) {
    recommendations.push({
      icon: 'mdi-gesture-tap',
      color: 'warning',
      title: t.engagement?.recommendationsEngagement?.lowInteraction?.title || defaultTexts.lowInteractionTitle,
      text: t.engagement?.recommendationsEngagement?.lowInteraction?.text || defaultTexts.lowInteractionText
    });
  }

  // Recommandations basées sur la profondeur de défilement
  if (metrics.scrollDepth < 50) {
    recommendations.push({
      icon: 'mdi-gesture-swipe-vertical',
      color: 'warning',
      title: t.engagement?.recommendationsEngagement?.lowScrollDepth?.title || defaultTexts.lowScrollTitle,
      text: t.engagement?.recommendationsEngagement?.lowScrollDepth?.text || defaultTexts.lowScrollText
    });
  }

  // Recommandations basées sur le temps sur page
  if (metrics.timeOnPage < 40) {
    recommendations.push({
      icon: 'mdi-clock-outline',
      color: 'warning',
      title: t.engagement?.recommendationsEngagement?.lowTimeOnPage?.title || defaultTexts.lowTimeTitle,
      text: t.engagement?.recommendationsEngagement?.lowTimeOnPage?.text || defaultTexts.lowTimeText
    });
  }

  // Recommandations basées sur le taux de rebond
  if (factors.bounceRate > 70) {
    recommendations.push({
      icon: 'mdi-exit-run',
      color: 'error',
      title: t.engagement?.recommendationsEngagement?.lowBounceRate?.title || defaultTexts.highBounceTitle,
      text: t.engagement?.recommendationsEngagement?.lowBounceRate?.text || defaultTexts.highBounceText
    });
  }

  // Recommandations basées sur le taux de clic
  if (factors.clickThroughRate < 30) {
    recommendations.push({
      icon: 'mdi-cursor-default-click',
      color: 'warning',
      title: t.engagement?.recommendationsEngagement?.lowClickThroughRate?.title || defaultTexts.lowCTRTitle,
      text: t.engagement?.recommendationsEngagement?.lowClickThroughRate?.text || defaultTexts.lowCTRText
    });
  }

  // Recommandation générale si le score est faible
  if (currentPageData.value.overallScore < 40) {
    recommendations.push({
      icon: 'mdi-lightbulb-outline',
      color: 'info',
      title: t.engagement?.recommendationsEngagement?.general?.title || defaultTexts.generalTitle,
      text: t.engagement?.recommendationsEngagement?.general?.text || defaultTexts.generalText
    });
  }

  return recommendations;
}
</script>

<style scoped>
.engagement-analyzer {
  width: 100%;
}

.quality-score-card {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.gauge-progress :deep(.v-progress-circular__content) {
  font-size: 24px;
  font-weight: bold;
}

.gauge-label {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 14px;
}

.metric-card {
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
}

.factor-item {
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.factor-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-items {
  max-height: 400px;
  overflow-y: auto;
}

.session-summary {
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}
</style>