<template>
  <div class="engagement-quality" role="region" aria-labelledby="engagement-quality-title">
    <h2 id="engagement-quality-title" class="text-h4 mb-4">{{ t('qualityTitle') }}</h2>

    <v-card class="mb-6" elevation="2">
      <v-card-title class="primary white--text">
        <v-icon color="white" class="mr-2">mdi-chart-line</v-icon>
        {{ t('globalScore') }}
      </v-card-title>
      <v-card-text class="pa-4">
        <div class="d-flex align-center justify-center">
          <v-progress-circular :model-value="engagementData.globalScore" :size="150" :width="15"
            :color="getScoreColor(engagementData.globalScore)" class="ma-5">
            <div class="text-h4">{{ engagementData.globalScore }}</div>
          </v-progress-circular>
          <div class="ml-6">
            <h3 class="text-h6 mb-2">{{ t('scoreInterpretation') }}</h3>
            <p class="text-body-1">{{ getScoreInterpretation(engagementData.globalScore) }}</p>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon color="white" class="mr-2">mdi-clock-outline</v-icon>
            {{ t('timeMetrics') }}
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list dense>
              <v-list-item>
                <v-list-item-title>{{ t('averageSessionDuration') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ formatTime(engagementData.timeMetrics.averageSessionDuration) }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('averageTimeOnPage') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ formatTime(engagementData.timeMetrics.averageTimeOnPage) }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('bounceRate') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.timeMetrics.bounceRate.toFixed(1) }}%
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('totalTimeSpent') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ formatTime(engagementData.timeMetrics.totalTimeSpent) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-if="timeChartData" class="mt-4">
              <BarChart :chart-data="timeChartData" :chart-options="timeChartOptions" height="200" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon color="white" class="mr-2">mdi-arrow-down-bold</v-icon>
            {{ t('scrollMetrics') }}
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list dense>
              <v-list-item>
                <v-list-item-title>{{ t('averageScrollDepth') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.scrollMetrics.averageScrollDepth.toFixed(1) }}%
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('scrollReach', { percent: '75%' }) }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.scrollMetrics.percentagesReaching75.toFixed(1) }}%
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('scrollReach', { percent: '100%' }) }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.scrollMetrics.percentagesReaching100.toFixed(1) }}%
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-if="scrollChartData" class="mt-4">
              <BarChart :chart-data="scrollChartData" :chart-options="scrollChartOptions" height="200" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon color="white" class="mr-2">mdi-cursor-pointer</v-icon>
            {{ t('interactionMetrics') }}
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list dense>
              <v-list-item>
                <v-list-item-title>{{ t('clickRate') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ (engagementData.interactionMetrics.clickRate * 100).toFixed(1) }}%
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('clicksPerSession') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.interactionMetrics.clicksPerSession.toFixed(2) }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>{{ t('interactionsPerMinute') }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ engagementData.interactionMetrics.interactionsPerMinute.toFixed(2) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div v-if="clickElementsChartData" class="mt-4">
              <BarChart :chart-data="clickElementsChartData" :chart-options="clickElementsChartOptions" height="200" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon color="white" class="mr-2">mdi-file-document-outline</v-icon>
            {{ t('pageMetrics') }}
          </v-card-title>
          <v-card-text class="pa-4">
            <h3 class="text-subtitle-1 mb-2">{{ t('popularPages') }}</h3>
            <v-list dense class="mb-4">
              <v-list-item v-for="(page, index) in topPages" :key="index">
                <v-list-item-title class="text-body-2">{{ formatUrl(page.url) }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ page.views }} {{ t('views') }} ({{ formatTime(page.avgTime) }})
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <h3 class="text-subtitle-1 mb-2">{{ t('entryPages') }}</h3>
            <v-list dense>
              <v-list-item v-for="(page, index) in topEntryPages" :key="index">
                <v-list-item-title class="text-body-2">{{ formatUrl(page.url) }}</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ page.count }} {{ t('entries') }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-6" elevation="2">
      <v-card-title class="primary white--text">
        <v-icon color="white" class="mr-2">mdi-routes</v-icon>
        {{ t('navigationPaths') }}
      </v-card-title>
      <v-card-text class="pa-4">
        <v-list dense>
          <v-list-item v-for="(path, index) in topNavigationPaths" :key="index">
            <v-list-item-title class="text-body-2">
              <span v-for="(url, urlIndex) in path.path" :key="urlIndex">
                {{ formatUrl(url) }}
                <v-icon v-if="urlIndex < path.path.length - 1" small>mdi-arrow-right</v-icon>
              </span>
            </v-list-item-title>
            <v-list-item-subtitle class="text-right">
              {{ path.count }} {{ t('occurrences') }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import BarChart from '../../components/charts/BarChart.vue';
import { EngagementMetrics, useEngagementQuality, useEngagementVisualizations } from '../../utils/engagement-quality';

const props = defineProps({
  pageViewsData: {
    type: String,
    default: ''
  },
  interactionsData: {
    type: String,
    default: ''
  },
  preloadedData: {
    type: Object as () => EngagementMetrics,
    default: null
  }
});

const { engagementData, analyzeFromTextData } = useEngagementQuality();
const { timeChartData, scrollChartData, pagePopularityChartData, clickElementsChartData } = useEngagementVisualizations(engagementData.value);

// Traductions
const t = (key: string, params = {}) => {
  const translations = {
    qualityTitle: 'Quality of Engagement',
    globalScore: 'Global Engagement Score',
    scoreInterpretation: 'Interpretation',
    timeMetrics: 'Time Metrics',
    scrollMetrics: 'Scroll Metrics',
    interactionMetrics: 'Interaction Metrics',
    pageMetrics: 'Page Metrics',
    averageSessionDuration: 'Average Session Duration',
    averageTimeOnPage: 'Average Time on Page',
    bounceRate: 'Bounce Rate',
    totalTimeSpent: 'Total Time Spent',
    averageScrollDepth: 'Average Scroll Depth',
    scrollReach: 'Users Reaching {percent}',
    clickRate: 'Click Rate',
    clicksPerSession: 'Clicks per Session',
    interactionsPerMinute: 'Interactions per Minute',
    popularPages: 'Most Popular Pages',
    entryPages: 'Top Entry Pages',
    views: 'views',
    entries: 'entries',
    navigationPaths: 'Navigation Paths',
    occurrences: 'occurrences'
  };

  const translatedText = translations[key] || key;

  if (Object.keys(params).length === 0) {
    return translatedText;
  }

  return Object.entries(params).reduce((text, [key, value]) => {
    return text.replace(`{${key}}`, value);
  }, translatedText);
};

// Options pour les graphiques
const timeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw} seconds`
      }
    }
  }
};

const scrollChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.raw.toFixed(1)}% of users`
      }
    }
  }
};

const clickElementsChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as 'y',
  plugins: {
    legend: {
      display: false
    }
  }
};

// Formater l'URL pour un affichage plus propre
const formatUrl = (url: string) => {
  try {
    if (!url.startsWith('http')) {
      return url;
    }
    const urlObj = new URL(url);
    return urlObj.pathname || url;
  } catch (e) {
    return url;
  }
};

// Formater le temps en format lisible
const formatTime = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
};

// Obtenir la couleur en fonction du score
const getScoreColor = (score: number) => {
  if (score < 30) return 'error';
  if (score < 60) return 'warning';
  if (score < 80) return 'info';
  return 'success';
};

// Obtenir l'interprétation du score
const getScoreInterpretation = (score: number) => {
  if (score < 30) return 'Poor engagement. Users are not interacting well with your content.';
  if (score < 60) return 'Average engagement. Some improvement needed in user experience.';
  if (score < 80) return 'Good engagement. Users are actively interacting with your content.';
  return 'Excellent engagement. Users are highly engaged with your content.';
};

// Filtrer les données des pages pour l'affichage
const topPages = computed(() => engagementData.value.pageMetrics.pagePopularity.slice(0, 5));
const topEntryPages = computed(() => engagementData.value.pageMetrics.entryPages.slice(0, 5));
const topNavigationPaths = computed(() => engagementData.value.pageMetrics.navigationPaths.slice(0, 3));

onMounted(() => {
  if (props.preloadedData) {
    // Utiliser les données préchargées si disponibles
    Object.assign(engagementData.value, props.preloadedData);
  } else if (props.pageViewsData) {
    // Analyser les données à partir du texte brut
    analyzeFromTextData(props.pageViewsData, props.interactionsData);
  }
});
</script>

<style scoped>
.engagement-quality {
  padding: 1rem;
}
</style>