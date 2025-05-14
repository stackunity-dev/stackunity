<template>
  <div class="engagement-analytics" role="region" aria-labelledby="engagement-analytics-title">
    <v-card class="mb-6 engagement-score-card" elevation="3" rounded="lg">
      <v-card-text class="pa-6">
        <div class="d-flex flex-column flex-md-row align-center justify-space-between">
          <div class="text-center text-md-left mb-4 mb-md-0">
            <h2 id="engagement-analytics-title" class="text-h4 font-weight-bold mb-2">Engagement Analytics</h2>
            <p class="text-subtitle-1 text-medium-emphasis">Analyse complète de l'engagement utilisateur</p>
          </div>
          <div class="d-flex align-center">
            <v-progress-circular :model-value="engagementScore" :size="120" :width="12"
              :color="getScoreColor(engagementScore)" class="score-circle">
              <div class="text-h4 font-weight-bold">{{ engagementScore }}</div>
            </v-progress-circular>
            <div class="ml-6 score-interpretation">
              <h3 class="text-h6 font-weight-medium mb-1">{{ getScoreLabel(engagementScore) }}</h3>
              <p class="text-body-2">{{ getScoreInterpretation(engagementScore) }}</p>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card class="metric-card h-100" :color="getMetricCardColor('scroll')" elevation="2" rounded="lg">
          <div class="metric-icon-container">
            <v-icon size="36" color="white">mdi-arrow-down-bold</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Profondeur de Défilement</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ scrollMetrics.averageScrollDepth.toFixed(0) }}<span class="text-h5">%</span>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Profondeur moyenne</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('scroll')">mdi-chevron-double-down</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Atteignant 75%</span>
                  <strong>{{ scrollMetrics.percentagesReaching75.toFixed(0) }}%</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('scroll')">mdi-arrow-down-bold-box</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Atteignant 100%</span>
                  <strong>{{ scrollMetrics.percentagesReaching100.toFixed(0) }}%</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="metric-card h-100" :color="getMetricCardColor('time')" elevation="2" rounded="lg">
          <div class="metric-icon-container">
            <v-icon size="36" color="white">mdi-clock-outline</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Temps de Lecture</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ Math.floor(timeMetrics.averageTimeOnPage / 60) }}<span class="text-h5">min</span>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Temps moyen par page</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('time')">mdi-clock-time-four</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Par session</span>
                  <strong>{{ formatTime(timeMetrics.averageSessionDuration) }}</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('time')">mdi-timer-sand</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Taux de rebond</span>
                  <strong>{{ timeMetrics.bounceRate.toFixed(0) }}%</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="metric-card h-100" :color="getMetricCardColor('session')" elevation="2" rounded="lg">
          <div class="metric-icon-container">
            <v-icon size="36" color="white">mdi-account-group</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Sessions</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ sessionMetrics.totalSessions.toLocaleString() }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Nombre total</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('session')">mdi-account</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Visiteurs uniques</span>
                  <strong>{{ sessionMetrics.uniqueVisitors.toLocaleString() }}</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('session')">mdi-account-multiple-check</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Sessions/visiteur</span>
                  <strong>{{ sessionMetrics.sessionsPerVisitor.toFixed(1) }}</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="3">
        <v-card class="metric-card h-100" :color="getMetricCardColor('click')" elevation="2" rounded="lg">
          <div class="metric-icon-container">
            <v-icon size="36" color="white">mdi-cursor-pointer</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Taux de Clics</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ (clickMetrics.clickRate * 100).toFixed(0) }}<span class="text-h5">%</span>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Taux moyen</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('click')">mdi-gesture-tap</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Clics/session</span>
                  <strong>{{ clickMetrics.clicksPerSession.toFixed(1) }}</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('click')">mdi-gesture-tap-button</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Clics/minute</span>
                  <strong>{{ clickMetrics.clicksPerMinute.toFixed(1) }}</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center">
            <v-icon :color="getMetricCardColor('scroll')" class="mr-2">mdi-chart-bell-curve</v-icon>
            Distribution de la Profondeur de Défilement
          </v-card-title>
          <v-card-text class="pa-4">
            <div v-if="scrollChartData" class="chart-container">
              <BarChart :chart-data="scrollChartData" :chart-options="scrollChartOptions" height="250" />
            </div>
            <div v-else class="d-flex justify-center align-center" style="height: 250px;">
              <v-progress-circular indeterminate :color="getMetricCardColor('scroll')"></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center">
            <v-icon :color="getMetricCardColor('click')" class="mr-2">mdi-gesture-tap-hold</v-icon>
            Éléments les Plus Cliqués
          </v-card-title>
          <v-card-text class="pa-4">
            <v-list v-if="clickMetrics.mostClickedElements.length > 0" density="compact">
              <v-list-item v-for="(element, index) in clickMetrics.mostClickedElements" :key="index">
                <template v-slot:prepend>
                  <v-avatar :color="getColorByIndex(index)" size="32" class="mr-3">
                    <span class="text-white">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="d-flex justify-space-between align-center">
                  <code class="element-selector">{{ element.selector }}</code>
                  <v-chip size="small" :color="getColorByIndex(index)" variant="tonal">
                    {{ element.count }} clics
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
            <div v-else class="text-center py-4 text-medium-emphasis">
              Aucune donnée de clic disponible
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import BarChart from '../charts/BarChart.vue';

const props = defineProps({
  websiteId: {
    type: String,
    required: true
  },
  period: {
    type: String,
    default: 'all'
  }
});

const isLoading = ref(true);
const engagementScore = ref(0);
const engagementData = ref(null);

const scrollMetrics = ref({
  averageScrollDepth: 0,
  percentagesReaching25: 0,
  percentagesReaching50: 0,
  percentagesReaching75: 0,
  percentagesReaching100: 0
});

const timeMetrics = ref({
  averageSessionDuration: 0,
  averageTimeOnPage: 0,
  totalTimeSpent: 0,
  bounceRate: 0
});

const sessionMetrics = ref({
  totalSessions: 0,
  uniqueVisitors: 0,
  sessionsPerVisitor: 0,
  returningVisitors: 0
});

const clickMetrics = ref({
  clickRate: 0,
  clicksPerSession: 0,
  clicksPerMinute: 0,
  mostClickedElements: [] as Array<{ selector: string; count: number }>
});

const scrollChartData = ref<any>(null);
const timeChartData = ref<any>(null);
const sessionChartData = ref<any>(null);
const clickChartData = ref<any>(null);

// Options pour les graphiques améliorées
const scrollChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 12
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        }
      }
    }
  }
};

const timeChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

const sessionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

const clickChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0m 0s';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}m ${remainingSeconds}s`;
};

const getScoreColor = (score) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'Faible';
};

const getScoreInterpretation = (score) => {
  if (score >= 80) return 'Les utilisateurs interagissent activement avec votre contenu.';
  if (score >= 60) return 'Votre contenu est bien reçu par les utilisateurs.';
  if (score >= 40) return 'Il y a place à l\'amélioration pour mieux engager vos utilisateurs.';
  return 'Votre contenu ne retient pas suffisamment l\'attention des utilisateurs.';
};

const getMetricCardColor = (type) => {
  const colors = {
    scroll: 'indigo',
    time: 'teal',
    session: 'deep-purple',
    click: 'amber-darken-2'
  };
  return colors[type] || 'primary';
};

const getColorByIndex = (index) => {
  const colors = ['indigo', 'teal', 'deep-purple', 'amber-darken-2', 'green'];
  return colors[index % colors.length];
};

const loadEngagementData = async () => {
  isLoading.value = true;

  try {
    const response = await fetch(`/api/analytics/website/${props.websiteId}/engagement?period=${props.period}`);

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des données d\'engagement');
    }

    const data = await response.json();

    if (data.success) {
      engagementData.value = data.data;

      scrollMetrics.value = data.data.scrollMetrics;
      timeMetrics.value = data.data.timeMetrics;
      sessionMetrics.value = data.data.sessionMetrics;
      clickMetrics.value = data.data.clickMetrics;
      engagementScore.value = data.data.globalScore;

      prepareChartData();
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données d\'engagement:', error);

    useDemoData();
  } finally {
    isLoading.value = false;
  }
};

const prepareChartData = () => {
  scrollChartData.value = {
    labels: ['0-25%', '25-50%', '50-75%', '75-100%'],
    datasets: [{
      label: 'Pourcentage d\'utilisateurs',
      data: [
        scrollMetrics.value.percentagesReaching25,
        scrollMetrics.value.percentagesReaching50 - scrollMetrics.value.percentagesReaching25,
        scrollMetrics.value.percentagesReaching75 - scrollMetrics.value.percentagesReaching50,
        scrollMetrics.value.percentagesReaching100 - scrollMetrics.value.percentagesReaching75
      ],
      backgroundColor: ['rgba(63, 81, 181, 0.7)', 'rgba(0, 150, 136, 0.7)', 'rgba(103, 58, 183, 0.7)', 'rgba(255, 193, 7, 0.7)']
    }]
  };
};

const useDemoData = () => {
  engagementScore.value = 65;

  scrollMetrics.value = {
    averageScrollDepth: 62.5,
    percentagesReaching25: 85.0,
    percentagesReaching50: 70.0,
    percentagesReaching75: 45.0,
    percentagesReaching100: 25.0
  };

  timeMetrics.value = {
    averageSessionDuration: 180,
    averageTimeOnPage: 95,
    totalTimeSpent: 54000,
    bounceRate: 35.0
  };

  sessionMetrics.value = {
    totalSessions: 1250,
    uniqueVisitors: 850,
    sessionsPerVisitor: 1.47,
    returningVisitors: 320
  };

  clickMetrics.value = {
    clickRate: 0.15,
    clicksPerSession: 3.2,
    clicksPerMinute: 1.8,
    mostClickedElements: [
      { selector: '.cta-button', count: 320 },
      { selector: '.nav-link', count: 280 },
      { selector: '.product-card', count: 245 },
      { selector: '.header-search', count: 189 },
      { selector: '.footer-link', count: 156 }
    ]
  };

  prepareChartData();
};

watch(() => [props.websiteId, props.period], () => {
  if (props.websiteId) {
    loadEngagementData();
  }
}, { immediate: true });

onMounted(() => {
  if (props.websiteId) {
    loadEngagementData();
  } else {
    useDemoData();
  }
});
</script>

<style scoped>
.engagement-analytics {
  width: 100%;
}

.engagement-score-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  border-left: 4px solid var(--v-primary-base);
}

.score-circle {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.metric-icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-value {
  color: white;
}

.chart-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08) !important;
}

.chart-container {
  height: 250px;
  position: relative;
}

.element-selector {
  font-size: 0.9rem;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 960px) {
  .score-interpretation {
    margin-top: 16px;
    text-align: center;
  }
}
</style>