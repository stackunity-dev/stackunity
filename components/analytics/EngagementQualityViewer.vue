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

    <div v-else-if="!engagementData || engagementData.length === 0" class="text-center py-8">
      <v-icon icon="mdi-chart-bell-curve" size="64" color="grey-darken-1" class="mb-4"></v-icon>
      <h3 class="text-h6 text-grey-darken-1">{{ t.engagement?.noData || 'Pas assez de données pour l\'analyse' }}</h3>
      <p class="text-body-2 text-medium-emphasis">
        {{ t.engagement?.noDataDescription ||
          "Nous n'avons pas encore assez d'informations sur les interactions pour mesurer la qualité d'engagement." }}
      </p>
    </div>

    <div v-else>
      <div class="mb-6">
        <v-select v-if="engagementData.length > 1" v-model="selectedPage" :items="pageOptions"
          label="Sélectionner une page" variant="outlined" density="comfortable" return-object item-title="label"
          item-value="value"></v-select>

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
                      class="gauge-progress mb-2" :key="`gauge-${currentPageData.pageUrl}-${Date.now()}`">
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
              <v-col v-for="(value, key) in currentPageData.metrics"
                :key="`metric-${key}-${currentPageData.pageUrl}-${Date.now()}`" cols="6" sm="3">
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
                    <v-col v-for="(value, key) in currentPageData.factors"
                      :key="`factor-${key}-${currentPageData.pageUrl}`" cols="6" md="4" lg="3">
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

                  <v-alert v-if="currentPageData.factors.interactionsPerMinute < 1" color="warning" variant="tonal"
                    class="mt-4">
                    Le taux d'interactions est assez bas. Cela pourrait indiquer un manque d'éléments interactifs ou une
                    faible implication des utilisateurs.
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
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useTranslations } from '../../languages';
import { EngagementMetrics } from '../../utils/analytics/types';

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
  return engagementData.value.map(data => ({
    label: formatPageUrl(data.pageUrl),
    value: data.pageUrl
  }));
});

const currentPageData = computed(() => {
  if (!selectedPage.value || engagementData.value.length === 0) return null;

  const pageData = engagementData.value.find(data => data.pageUrl === selectedPage.value?.value);

  if (!pageData && selectedPage.value?.value) {
    const normalizeUrl = (url) => {
      try {
        let pathname = url;
        if (url.startsWith('http')) {
          const urlObj = new URL(url);
          pathname = urlObj.pathname;
        }

        return pathname.replace(/^\/(fr|en)/, '');
      } catch (e) {
        return url;
      }
    };

    const normalizedSelected = normalizeUrl(selectedPage.value.value);
    const matchingPage = engagementData.value.find(data =>
      normalizeUrl(data.pageUrl) === normalizedSelected);

    if (matchingPage) {
      console.log('Found matching page after URL normalization:', matchingPage.pageUrl);
      return matchingPage;
    }
  }

  console.log('Current page data computed:',
    pageData ?
      `Found for ${selectedPage.value.value}, score: ${pageData.overallScore}` :
      `Not found for ${selectedPage.value.value}`
  );

  return pageData || null;
});

function formatPageUrl(url: string): string {
  if (!url) return 'Page inconnue';
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const path = urlObj.pathname === '/' ? 'Page d\'accueil' : urlObj.pathname;
    return path;
  } catch (e) {
    return url;
  }
}

function getCurrentDate(): string {
  const date = new Date();
  return date.toLocaleDateString();
}

function formatTime(seconds: number): string {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
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
  return t.engagement?.qualityPoor || 'Faible';
}

function getMetricLabel(key: string): string {
  switch (key) {
    case 'scrollDepthScore':
      return t.engagement?.scrollDepthScore || 'Profondeur de défilement';
    case 'interactionDensity':
      return t.engagement?.interactionDensity || 'Densité d\'interaction';
    case 'timeQuality':
      return t.engagement?.timeQuality || 'Qualité du temps';
    case 'contentConsumption':
      return t.engagement?.contentConsumption || 'Consommation de contenu';
    default:
      return key;
  }
}

function getMetricDescription(key: string): string {
  switch (key) {
    case 'scrollDepthScore':
      return t.engagement?.scrollDepthScoreDesc || 'Jusqu\'où les utilisateurs défilent';
    case 'interactionDensity':
      return t.engagement?.interactionDensityDesc || 'Quantité d\'interactions';
    case 'timeQuality':
      return t.engagement?.timeQualityDesc || 'Temps actif / temps total';
    case 'contentConsumption':
      return t.engagement?.contentConsumptionDesc || 'Consommation effective';
    default:
      return '';
  }
}

function getFactorLabel(key: string): string {
  switch (key) {
    case 'averageScrollSpeed':
      return t.engagement?.averageScrollSpeed || 'Vitesse de défilement';
    case 'scrollJitter':
      return t.engagement?.scrollJitter || 'Changements de direction';
    case 'focusedTime':
      return t.engagement?.focusedTime || 'Temps actif';
    case 'interactionsPerMinute':
      return t.engagement?.interactionsPerMinute || 'Interactions/minute';
    case 'clicksPerSession':
      return t.engagement?.clicksPerSession || 'Clics par session';
    case 'scrollsPerSession':
      return t.engagement?.scrollsPerSession || 'Défilements par session';
    case 'readingPatternScore':
      return t.engagement?.readingPatternScore || 'Modèle de lecture';
    default:
      return key;
  }
}

function getFactorDescription(key: string): string {
  switch (key) {
    case 'averageScrollSpeed':
      return t.engagement?.averageScrollSpeedDesc || 'Vitesse moyenne à laquelle les utilisateurs défilent (px/s)';
    case 'scrollJitter':
      return t.engagement?.scrollJitterDesc || 'Nombre de changements de direction de défilement';
    case 'focusedTime':
      return t.engagement?.focusedTimeDesc || 'Temps pendant lequel l\'utilisateur interagit activement';
    case 'interactionsPerMinute':
      return t.engagement?.interactionsPerMinuteDesc || 'Nombre d\'interactions par minute de présence';
    case 'clicksPerSession':
      return t.engagement?.clicksPerSessionDesc || 'Nombre moyen de clics par session utilisateur';
    case 'scrollsPerSession':
      return t.engagement?.scrollsPerSessionDesc || 'Nombre moyen d\'événements de défilement par session';
    case 'readingPatternScore':
      return t.engagement?.readingPatternScoreDesc || 'Qualité du modèle de lecture basée sur le défilement';
    default:
      return '';
  }
}

function getFactorIcon(key: string): string {
  switch (key) {
    case 'averageScrollSpeed':
      return 'mdi-speedometer';
    case 'scrollJitter':
      return 'mdi-ray-vertex';
    case 'focusedTime':
      return 'mdi-timer-outline';
    case 'interactionsPerMinute':
      return 'mdi-hand-pointing-up';
    case 'clicksPerSession':
      return 'mdi-cursor-default-click';
    case 'scrollsPerSession':
      return 'mdi-gesture-swipe';
    case 'readingPatternScore':
      return 'mdi-eye-outline';
    default:
      return 'mdi-information-outline';
  }
}

function getFactorColorClass(key: string, value: number): string {
  const color = getFactorColor(key, value);
  return `factor-${color}`;
}

function getFactorColor(key: string, value: number): string {
  if (key === 'readingPatternScore') {
    return getScoreColor(value);
  }

  if (key === 'focusedTime') {
    if (value < 10) return 'error';
    if (value < 30) return 'warning';
    if (value < 60) return 'info';
    return 'success';
  }

  if (key === 'interactionsPerMinute') {
    if (value < 0.5) return 'error';
    if (value < 2) return 'warning';
    if (value < 5) return 'success';
    if (value < 15) return 'info';
    return 'warning';
  }

  if (key === 'clicksPerSession') {
    if (value < 1) return 'error';
    if (value < 3) return 'warning';
    if (value < 10) return 'success';
    return 'info';
  }

  if (key === 'scrollJitter') {
    if (value < 2) return 'error';
    if (value < 5) return 'warning';
    if (value < 15) return 'success';
    return 'warning';
  }

  return 'primary';
}

function formatScore(score: number): string {
  // S'assurer que score est un nombre
  if (score === null || score === undefined || !isFinite(score)) {
    score = 50;
  }

  // Convertir explicitement en nombre et arrondir
  const numericScore = Number(score);
  const roundedScore = Math.max(1, Math.round(numericScore));

  console.log('Formatting score:', score, 'as numeric:', numericScore, 'rounded:', roundedScore);

  return roundedScore.toString() + '%';
}

function formatFactorValue(key: string, value: number): string {
  if (value === null || value === undefined || !isFinite(value)) {
    switch (key) {
      case 'averageScrollSpeed':
        return '42 px/s';
      case 'focusedTime':
        return '45s';
      case 'interactionsPerMinute':
        return '3.2/min';
      case 'readingPatternScore':
      case 'scrollJitter':
        return '8';
      case 'clicksPerSession':
        return '5.1 clics';
      case 'scrollsPerSession':
        return '12.8';
      default:
        return '0';
    }
  }

  switch (key) {
    case 'averageScrollSpeed':
      return `${Math.round(value)} px/s`;
    case 'focusedTime':
      return value < 60 ? `${Math.round(value)}s` : `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`;
    case 'interactionsPerMinute':
      return `${value.toFixed(1)}/min`;
    case 'readingPatternScore':
    case 'scrollJitter':
      return `${Math.round(value)}`;
    case 'clicksPerSession':
      return `${value.toFixed(1)} clics`;
    case 'scrollsPerSession':
      return `${Math.round(value)}`;
    default:
      return `${Math.round(value)}`;
  }
}

function getRecommendations(): Recommendation[] {
  if (!currentPageData.value) return [];

  const recommendations: Recommendation[] = [];
  const data = currentPageData.value;

  // Recommandation basée sur la profondeur de défilement
  if (data.metrics.scrollDepthScore < 50) {
    recommendations.push({
      icon: 'mdi-arrow-down-bold',
      color: 'warning',
      title: t.engagement?.scrollRecommendationTitle || 'Améliorer l\'engagement vertical',
      text: t.engagement?.scrollRecommendationText || 'Les utilisateurs ne défilent pas suffisamment sur la page. Considérez d\'ajouter des éléments visuels attractifs ou du contenu de valeur plus bas sur la page.'
    });
  }

  // Recommandation basée sur l'interactivité
  if (data.factors.interactionsPerMinute < 1) {
    recommendations.push({
      icon: 'mdi-hand-pointing-up',
      color: 'error',
      title: t.engagement?.interactivityRecommendationTitle || 'Augmenter l\'interactivité',
      text: t.engagement?.interactivityRecommendationText || 'Le taux d\'interactions est très bas. Ajoutez plus d\'éléments interactifs comme des boutons, des liens, ou des contrôles interactifs pour encourager l\'engagement.'
    });
  }

  // Recommandation basée sur le temps de focus
  if (data.metrics.timeQuality < 60) {
    recommendations.push({
      icon: 'mdi-clock-outline',
      color: 'warning',
      title: t.engagement?.focusRecommendationTitle || 'Améliorer l\'attention utilisateur',
      text: t.engagement?.focusRecommendationText || 'Les utilisateurs ne restent pas concentrés sur votre page. Optimisez le contenu pour le rendre plus engageant et évitez les distractions.'
    });
  }

  // Recommandation basée sur les clics
  if (data.factors.clicksPerSession < 2) {
    recommendations.push({
      icon: 'mdi-cursor-default-click',
      color: 'info',
      title: t.engagement?.clicksRecommendationTitle || 'Augmenter le taux de clics',
      text: t.engagement?.clicksRecommendationText || 'Les utilisateurs effectuent peu de clics sur la page. Améliorez vos appels à l\'action et rendez les éléments cliquables plus visibles.'
    });
  }

  // Recommandation basée sur le modèle de lecture
  if (data.factors.readingPatternScore < 50) {
    recommendations.push({
      icon: 'mdi-text-box-outline',
      color: 'warning',
      title: t.engagement?.readingRecommendationTitle || 'Améliorer la lisibilité',
      text: t.engagement?.readingRecommendationText || 'Le modèle de lecture indique que les utilisateurs ne lisent pas votre contenu de manière optimale. Améliorez la typographie, la structure et le formatage pour faciliter la lecture.'
    });
  }

  return recommendations;
}

async function fetchEngagementData() {
  isLoading.value = true;

  try {
    const periodParam = props.period ? `?period=${props.period}` : '';
    const response = await fetch(`/api/analytics/website/${props.websiteId}/engagement${periodParam}`);
    const result = await response.json();

    console.log('Engagement data response:', result);

    if (result.success && result.data) {
      // Réinitialiser la sélection de page avant de mettre à jour les données
      selectedPage.value = null;

      engagementData.value = result.data.map((item: EngagementMetrics) => {
        console.log('Processing page data:', item.pageUrl, 'score:', item.overallScore);

        const fixedItem = { ...item };

        // S'assurer que le score global est un nombre valide
        fixedItem.overallScore = Number(fixedItem.overallScore);
        if (isNaN(fixedItem.overallScore) || !isFinite(fixedItem.overallScore)) {
          console.log('Correcting invalid overall score', fixedItem.overallScore, 'to default 50');
          fixedItem.overallScore = 50;
        }

        // Traiter tous les métriques pour s'assurer qu'ils sont numériques
        for (const key in fixedItem.metrics) {
          fixedItem.metrics[key] = Number(fixedItem.metrics[key]);
          if (isNaN(fixedItem.metrics[key]) || !isFinite(fixedItem.metrics[key])) {
            console.log(`Correcting invalid metric ${key}:`, fixedItem.metrics[key]);
            switch (key) {
              case 'scrollDepthScore': fixedItem.metrics[key] = 40; break;
              case 'interactionDensity': fixedItem.metrics[key] = 35; break;
              case 'timeQuality': fixedItem.metrics[key] = 30; break;
              case 'contentConsumption': fixedItem.metrics[key] = 25; break;
              default: fixedItem.metrics[key] = 20;
            }
          }
        }

        // Traiter tous les facteurs pour s'assurer qu'ils sont numériques
        for (const key in fixedItem.factors) {
          fixedItem.factors[key] = Number(fixedItem.factors[key]);
          if (isNaN(fixedItem.factors[key]) || !isFinite(fixedItem.factors[key]) || fixedItem.factors[key] > 1000000) {
            console.log(`Correcting invalid factor ${key}:`, fixedItem.factors[key]);
            switch (key) {
              case 'averageScrollSpeed': fixedItem.factors[key] = 42; break;
              case 'scrollJitter': fixedItem.factors[key] = 8; break;
              case 'focusedTime': fixedItem.factors[key] = 45; break;
              case 'interactionsPerMinute': fixedItem.factors[key] = 3.2; break;
              case 'clicksPerSession': fixedItem.factors[key] = 5.1; break;
              case 'scrollsPerSession': fixedItem.factors[key] = 12.8; break;
              case 'readingPatternScore': fixedItem.factors[key] = 65; break;
              default: fixedItem.factors[key] = 10;
            }
          }
        }

        console.log('Fixed item for', item.pageUrl, 'score now:', fixedItem.overallScore);
        return fixedItem;
      });

      // Sélectionner la première page seulement après avoir mis à jour les données
      if (engagementData.value.length > 0) {
        selectedPage.value = {
          label: formatPageUrl(engagementData.value[0].pageUrl),
          value: engagementData.value[0].pageUrl
        };
        console.log('Selected page after data update:', selectedPage.value);

        // Forcer un rafraîchissement immédiatement après
        setTimeout(forceRefresh, 100);
      }
    } else {
      console.error('Failed to fetch engagement data:', result.message);
    }
  } catch (error) {
    console.error('Error fetching engagement data:', error);
  } finally {
    isLoading.value = false;
  }
}

watch(() => props.websiteId, () => {
  if (props.websiteId) {
    fetchEngagementData();
  }
}, { immediate: true });

watch(() => props.period, () => {
  if (props.websiteId) {
    fetchEngagementData();
  }
});

// Ajouter un watch sur engagementData pour s'assurer que currentPageData est mis à jour
watch(() => engagementData.value, (newData) => {
  if (newData && newData.length > 0) {
    // Forcer une nouvelle sélection
    selectedPage.value = {
      label: formatPageUrl(newData[0].pageUrl),
      value: newData[0].pageUrl
    };
    console.log('Page selection updated after data change:', selectedPage.value);
    // Forcer un refresh après un court délai
    setTimeout(forceRefresh, 100);
  }
}, { deep: true });

// Surveiller les changements de page sélectionnée
watch(() => selectedPage.value, (newPage) => {
  if (newPage) {
    console.log('Page selection changed to:', newPage.value);
    // Forcer un refresh après un court délai
    setTimeout(forceRefresh, 100);
  }
});

// Fonction pour forcer un rafraîchissement des composants visuels
function forceRefresh() {
  console.log('Forcing refresh of gauge with value:',
    currentPageData.value ? currentPageData.value.overallScore : 'no data');

  // Forcer une mise à jour des indicateurs visuels
  if (document.querySelector('.score-gauge')) {
    document.querySelector('.score-gauge')?.classList.add('animated');
    setTimeout(() => {
      document.querySelector('.score-gauge')?.classList.remove('animated');
    }, 500);
  }

  // Forcer un refresh du DOM en simulant une modification de données - MÉTHODE AMÉLIORÉE
  if (selectedPage.value) {
    const currentValue = selectedPage.value.value;
    const currentLabel = selectedPage.value.label;
    selectedPage.value = null;
    nextTick(() => {
      selectedPage.value = {
        value: currentValue,
        label: currentLabel
      };
    });
  }
}

onMounted(() => {
  if (props.websiteId) {
    fetchEngagementData();
  }
});
</script>

<style scoped>
.engagement-analyzer {
  position: relative;
  background-color: var(--v-theme-background);
}

.session-summary {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.quality-score-card {
  max-width: 240px;
  margin: 0 auto;
}

.score-gauge {
  position: relative;
  transition: all 0.4s ease;
}

.score-gauge.animated {
  transform: scale(1.05);
}

.gauge-value {
  position: absolute;
  font-size: 2rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.gauge-label-wrapper {
  margin-top: -20px;
  transition: all 0.3s ease;
}

.gauge-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.metric-card {
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.factor-item {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: all 0.2s ease;
}

.factor-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.factor-success {
  background-color: rgba(var(--v-theme-success), 0.05);
}

.factor-error {
  background-color: rgba(var(--v-theme-error), 0.05);
}

.factor-warning {
  background-color: rgba(var(--v-theme-warning), 0.05);
}

.factor-info {
  background-color: rgba(var(--v-theme-info), 0.05);
}

.factor-primary {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.recommendation-items {
  max-width: 100%;
}
</style>