<template>
  <div class="engagement-analytics" role="region" aria-labelledby="engagement-analytics-title">
    <v-card class="mb-6 pa-2 bg-grey-darken-4" elevation="3" rounded="lg">
      <v-card-text class="pa-6">
        <div class="d-flex flex-column flex-md-row align-center justify-space-between">
          <div class="text-center text-md-left mb-4 mb-md-0">
            <h2 id="engagement-analytics-title" class="text-h4 font-weight-bold mb-2">Engagement Analytics</h2>
            <p class="text-subtitle-1 text-medium-emphasis">Complete analysis of user engagement in your website</p>
          </div>
          <div class="d-flex align-center">
            <v-progress-circular :model-value="engagementScore" :size="120" :width="12"
              :color="getScoreColor(engagementScore)" class="score-circle" role="progressbar"
              :aria-valuenow="engagementScore" aria-valuemin="0" aria-valuemax="100">
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
      <v-col cols="12" md="6" lg="4">
        <v-card class="metric-card h-100" :color="getMetricCardColor('scroll')" elevation="2" rounded="lg">
          <div class="metric-icon-container" aria-hidden="true">
            <v-icon size="36" color="white">mdi-arrow-down-bold</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Scroll Depth</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ scrollMetrics.averageScrollDepth.toFixed(0) }}<span class="text-h5">%</span>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Average depth</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('scroll')">mdi-chevron-double-down</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Reaching 75%</span>
                  <strong>{{ Math.min(100, scrollMetrics.percentagesReaching75).toFixed(0) }}%</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('scroll')">mdi-arrow-down-bold-box</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Reaching 100%</span>
                  <strong>{{ Math.min(100, scrollMetrics.percentagesReaching100).toFixed(0) }}%</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="metric-card h-100" :color="getMetricCardColor('session')" elevation="2" rounded="lg">
          <div class="metric-icon-container" aria-hidden="true">
            <v-icon size="36" color="white">mdi-account-group</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Sessions</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ sessionMetrics.totalSessions.toLocaleString() }}
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Total sessions</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('session')">mdi-account</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Unique visitors</span>
                  <strong>{{ sessionMetrics.uniqueVisitors.toLocaleString() }}</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('session')">mdi-account-multiple-check</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Sessions/visitor</span>
                  <strong>{{ sessionMetrics.sessionsPerVisitor.toFixed(1) }}</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="metric-card h-100" :color="getMetricCardColor('click')" elevation="2" rounded="lg">
          <div class="metric-icon-container" aria-hidden="true">
            <v-icon size="36" color="white">mdi-cursor-pointer</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Click rate</div>
          </v-card-title>
          <v-card-text>
            <div class="metric-value text-h3 font-weight-bold mb-2">
              {{ Math.min(100, (clickMetrics.clickRate * 100)).toFixed(0) }}<span class="text-h5">%</span>
            </div>
            <div class="text-subtitle-2 text-medium-emphasis mb-4">Average</div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('click')">mdi-gesture-tap</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Clicks/session</span>
                  <strong>{{ clickMetrics.clicksPerSession.toFixed(1) }}</strong>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small" :color="getMetricCardColor('click')">mdi-gesture-tap-button</v-icon>
                </template>
                <v-list-item-title class="d-flex justify-space-between">
                  <span>Clicks/minute</span>
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
            <v-icon :color="getMetricCardColor('scroll')" class="mr-2" aria-hidden="true">mdi-chart-bell-curve</v-icon>
            <span id="scroll-depth-chart-title">Scroll depth distribution</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div v-if="scrollChartData" class="chart-container">
              <BarChart :chart-data="scrollChartData" :chart-options="scrollChartOptions" height="250"
                aria-labelledby="scroll-depth-chart-title" />
            </div>
            <div v-else class="d-flex justify-center align-center" style="height: 250px;">
              <v-progress-circular indeterminate :color="getMetricCardColor('scroll')"
                aria-label="Chargement des données de défilement"></v-progress-circular>
            </div>

          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="chart-card" elevation="2" rounded="lg">
          <v-card-title class="d-flex align-center">
            <v-icon :color="getMetricCardColor('click')" class="mr-2" aria-hidden="true">mdi-gesture-tap-hold</v-icon>
            <span id="most-clicked-elements-title">Most clicked elements</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div v-if="clickMetrics.mostClickedElements.length > 0" class="d-flex flex-column flex-md-row">
              <div class="pie-chart-container" style="width: 100%; max-width: 250px; margin: 0 auto;">
                <PieChart v-if="clickChartData" :chart-data="clickChartData" :chart-options="clickChartOptions"
                  height="200" aria-labelledby="most-clicked-elements-title" />
              </div>

              <v-list density="compact" class="flex-grow-1 ml-md-4 mt-4 mt-md-0"
                aria-labelledby="most-clicked-elements-title">
                <v-list-item v-for="(element, index) in clickMetrics.mostClickedElements" :key="index">
                  <template v-slot:prepend>
                    <v-avatar :color="getColorByIndex(index)" size="32" class="mr-3" aria-hidden="true">
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
            </div>
            <div v-else class="text-center py-4 text-medium-emphasis">
              Aucune donnée de clic disponible
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6" lg="6">
        <v-card class="metric-card h-100" color="purple" elevation="2" rounded="lg">
          <div class="metric-icon-container" aria-hidden="true">
            <v-icon size="36" color="white">mdi-form-select</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Form engagement</div>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap align-center justify-space-between">
              <div class="metric-stat mr-4 mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ formMetrics.totalFormSubmits.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Submissions</div>
              </div>

              <div class="metric-stat mr-4 mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ Math.min(100, (formMetrics.formSubmitRate * 100)).toFixed(0) }}<span
                    class="text-subtitle-1">%</span>
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Conversion rate</div>
              </div>

              <div class="metric-stat mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ formMetrics.uniqueForms }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Unique forms</div>
              </div>
            </div>

            <div v-if="formMetrics.topForms && formMetrics.topForms.length > 0" class="mt-4">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Most used forms</h3>
              <div class="d-flex flex-column flex-md-row">
                <div class="pie-chart-container" style="width: 100%; max-width: 180px; margin: 0 auto;">
                  <PieChart v-if="formChartData" :chart-data="formChartData" :chart-options="clickChartOptions"
                    height="150" aria-labelledby="top-forms-title" />
                </div>

                <v-list density="compact" class="flex-grow-1 ml-md-4 mt-4 mt-md-0" id="top-forms-title">
                  <v-list-item v-for="(form, index) in formMetrics.topForms" :key="index">
                    <template v-slot:prepend>
                      <v-avatar :color="`purple-lighten-${index + 1}`" size="32" class="mr-3" aria-hidden="true">
                        <span class="text-white">{{ index + 1 }}</span>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="d-flex justify-space-between align-center">
                      <code class="element-selector">{{ form.selector }}</code>
                      <v-chip size="small" :color="`purple-lighten-${index + 1}`" variant="tonal">
                        {{ form.count }} soumissions
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="6">
        <v-card class="metric-card h-100" color="pink" elevation="2" rounded="lg">
          <div class="metric-icon-container" aria-hidden="true">
            <v-icon size="36" color="white">mdi-form-textbox</v-icon>
          </div>
          <v-card-title class="pb-0 pt-6">
            <div class="text-h6 font-weight-bold">Input field interaction</div>
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap align-center justify-space-between">
              <div class="metric-stat mr-4 mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ inputMetrics.totalInputChanges.toLocaleString() }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Changes</div>
              </div>

              <div class="metric-stat mr-4 mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ Math.min(100, (inputMetrics.inputChangeRate * 100)).toFixed(0) }}<span
                    class="text-subtitle-1">%</span>
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Sessions with input</div>
              </div>

              <div class="metric-stat mb-2">
                <div class="metric-value text-h4 font-weight-bold">
                  {{ inputMetrics.averageInputChangesPerSession.toFixed(1) }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">Changes/session</div>
              </div>
            </div>

            <div class="mt-4">
              <h3 class="text-subtitle-1 font-weight-medium mb-2">Input field interaction distribution</h3>
              <v-card class="pa-2 bg-pink-lighten-5">
                <div class="d-flex align-center mb-2">
                  <div class="text-body-1 font-weight-medium" style="width: 120px;">Unique fields:</div>
                  <v-chip color="pink-lighten-1">{{ inputMetrics.uniqueInputs }}</v-chip>
                </div>

                <div class="d-flex align-center mb-2">
                  <div class="text-body-1 font-weight-medium" style="width: 120px;">Enga gement:</div>
                  <v-rating :model-value="Math.min(5, Math.ceil(inputMetrics.averageInputChangesPerSession))"
                    color="pink" density="compact" size="small" readonly></v-rating>
                </div>

                <div class="d-flex align-center">
                  <div class="text-body-1 font-weight-medium" style="width: 120px;">Efficiency:</div>
                  <v-progress-linear
                    :model-value="capPercentage((formMetrics.formSubmitRate / Math.max(0.01, inputMetrics.inputChangeRate)) * 100)"
                    color="pink-darken-1" height="8" rounded></v-progress-linear>
                </div>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import BarChart from '../charts/BarChart.vue';
import PieChart from '../charts/PieChart.vue';

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

const formMetrics = ref({
  totalFormSubmits: 0,
  formSubmitRate: 0,
  averageFormSubmitsPerSession: 0,
  uniqueForms: 0,
  topForms: [] as Array<{ selector: string; count: number }>
});

const inputMetrics = ref({
  totalInputChanges: 0,
  inputChangeRate: 0,
  averageInputChangesPerSession: 0,
  uniqueInputs: 0
});

const scrollChartData = ref<any>(null);
const clickChartData = ref<any>(null);
const formChartData = ref<any>(null);

const capPercentage = (value: number): number => {
  return Math.min(100, Math.max(0, value));
};

const scrollSegments = computed(() => [
  {
    label: '0-25%',
    value: capPercentage(scrollMetrics.value.percentagesReaching25),
    color: 'indigo'
  },
  {
    label: '25-50%',
    value: capPercentage(scrollMetrics.value.percentagesReaching50 - scrollMetrics.value.percentagesReaching25),
    color: 'teal'
  },
  {
    label: '50-75%',
    value: capPercentage(scrollMetrics.value.percentagesReaching75 - scrollMetrics.value.percentagesReaching50),
    color: 'deep-purple'
  },
  {
    label: '75-100%',
    value: capPercentage(scrollMetrics.value.percentagesReaching100 - scrollMetrics.value.percentagesReaching75),
    color: 'amber-darken-2'
  }
]);

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
        weight: 'bold' as const
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

const clickChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        boxWidth: 15,
        font: { size: 11 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: 'bold' as const
      },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8
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
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Low';
};

const getScoreInterpretation = (score) => {
  if (score >= 80) return 'The users are actively interacting with your content.';
  if (score >= 60) return 'Your content is well received by users.';
  if (score >= 40) return 'There is room for improvement to better engage your users.';
  return 'Your content does not retain enough attention from users.';
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

      scrollMetrics.value = {
        averageScrollDepth: parseFloat(data.data.scrollMetrics.averageScrollDepth) || 0,
        percentagesReaching25: parseFloat(data.data.scrollMetrics.percentagesReaching25) || 0,
        percentagesReaching50: parseFloat(data.data.scrollMetrics.percentagesReaching50) || 0,
        percentagesReaching75: parseFloat(data.data.scrollMetrics.percentagesReaching75) || 0,
        percentagesReaching100: parseFloat(data.data.scrollMetrics.percentagesReaching100) || 0
      };

      timeMetrics.value = {
        averageSessionDuration: parseFloat(data.data.timeMetrics.averageSessionDuration) || 0,
        averageTimeOnPage: parseFloat(data.data.timeMetrics.averageTimeOnPage) || 0,
        totalTimeSpent: parseFloat(data.data.timeMetrics.totalTimeSpent) || 0,
        bounceRate: parseFloat(data.data.timeMetrics.bounceRate) || 0
      };

      sessionMetrics.value = {
        totalSessions: parseInt(data.data.sessionMetrics.totalSessions) || 0,
        uniqueVisitors: parseInt(data.data.sessionMetrics.uniqueVisitors) || 0,
        sessionsPerVisitor: parseFloat(data.data.sessionMetrics.sessionsPerVisitor) || 0,
        returningVisitors: parseInt(data.data.sessionMetrics.returningVisitors) || 0
      };

      clickMetrics.value = {
        clickRate: parseFloat(data.data.clickMetrics.clickRate) || 0,
        clicksPerSession: parseFloat(data.data.clickMetrics.clicksPerSession) || 0,
        clicksPerMinute: parseFloat(data.data.clickMetrics.clicksPerMinute) || 0,
        mostClickedElements: data.data.clickMetrics.mostClickedElements || []
      };

      if (data.data.formMetrics) {
        formMetrics.value = {
          totalFormSubmits: parseInt(data.data.formMetrics.totalFormSubmits) || 0,
          formSubmitRate: parseFloat(data.data.formMetrics.formSubmitRate) || 0,
          averageFormSubmitsPerSession: parseFloat(data.data.formMetrics.averageFormSubmitsPerSession) || 0,
          uniqueForms: parseInt(data.data.formMetrics.uniqueForms) || 0,
          topForms: data.data.formMetrics.topForms || []
        };
      }

      if (data.data.inputMetrics) {
        inputMetrics.value = {
          totalInputChanges: parseInt(data.data.inputMetrics.totalInputChanges) || 0,
          inputChangeRate: parseFloat(data.data.inputMetrics.inputChangeRate) || 0,
          averageInputChangesPerSession: parseFloat(data.data.inputMetrics.averageInputChangesPerSession) || 0,
          uniqueInputs: parseInt(data.data.inputMetrics.uniqueInputs) || 0
        };
      }

      engagementScore.value = parseInt(data.data.globalScore) || 0;

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
    datasets: [
      {
        label: 'Percentage of users',
        data: [
          capPercentage(scrollMetrics.value.percentagesReaching25),
          capPercentage(scrollMetrics.value.percentagesReaching50 - scrollMetrics.value.percentagesReaching25),
          capPercentage(scrollMetrics.value.percentagesReaching75 - scrollMetrics.value.percentagesReaching50),
          capPercentage(scrollMetrics.value.percentagesReaching100 - scrollMetrics.value.percentagesReaching75)
        ],
        backgroundColor: [
          'rgba(63, 81, 181, 0.7)',
          'rgba(0, 150, 136, 0.7)',
          'rgba(103, 58, 183, 0.7)',
          'rgba(255, 193, 7, 0.7)'
        ],
        borderColor: [
          'rgb(63, 81, 181)',
          'rgb(0, 150, 136)',
          'rgb(103, 58, 183)',
          'rgb(255, 193, 7)'
        ],
        borderWidth: 1
      }
    ]
  };

  if (clickMetrics.value.mostClickedElements.length > 0) {
    const clickLabels = clickMetrics.value.mostClickedElements.map(el => {
      const selector = el.selector;
      return selector.length > 15 ? selector.substring(0, 15) + '...' : selector;
    });

    const clickCounts = clickMetrics.value.mostClickedElements.map(el => el.count);

    const backgroundColors = [
      'rgba(63, 81, 181, 0.8)',
      'rgba(0, 150, 136, 0.8)',
      'rgba(103, 58, 183, 0.8)',
      'rgba(255, 193, 7, 0.8)',
      'rgba(76, 175, 80, 0.8)'
    ];

    const borderColors = [
      'rgb(63, 81, 181)',
      'rgb(0, 150, 136)',
      'rgb(103, 58, 183)',
      'rgb(255, 193, 7)',
      'rgb(76, 175, 80)'
    ];

    clickChartData.value = {
      labels: clickLabels,
      datasets: [{
        data: clickCounts,
        backgroundColor: backgroundColors.slice(0, clickCounts.length),
        borderColor: borderColors.slice(0, clickCounts.length),
        borderWidth: 1
      }]
    };
  }

  if (formMetrics.value.topForms && formMetrics.value.topForms.length > 0) {
    const formLabels = formMetrics.value.topForms.map(el => {
      const selector = el.selector;
      return selector.length > 15 ? selector.substring(0, 15) + '...' : selector;
    });

    const formCounts = formMetrics.value.topForms.map(el => el.count);

    formChartData.value = {
      labels: formLabels,
      datasets: [{
        data: formCounts,
        backgroundColor: [
          'rgba(156, 39, 176, 0.8)',
          'rgba(233, 30, 99, 0.8)',
          'rgba(216, 27, 96, 0.8)'
        ],
        borderColor: [
          'rgb(156, 39, 176)',
          'rgb(233, 30, 99)',
          'rgb(216, 27, 96)'
        ],
        borderWidth: 1
      }]
    };
  }
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

  formMetrics.value = {
    totalFormSubmits: 450,
    formSubmitRate: 0.25,
    averageFormSubmitsPerSession: 0.36,
    uniqueForms: 5,
    topForms: [
      { selector: '#contact-form', count: 180 },
      { selector: '#newsletter-form', count: 120 },
      { selector: '#search-form', count: 95 }
    ]
  };

  inputMetrics.value = {
    totalInputChanges: 2800,
    inputChangeRate: 0.65,
    averageInputChangesPerSession: 2.24,
    uniqueInputs: 12
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

.scroll-indicators {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.pie-chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .score-interpretation {
    margin-top: 16px;
    text-align: center;
  }
}

.metric-stat {
  text-align: center;
  flex: 1;
  min-width: 100px;
}
</style>