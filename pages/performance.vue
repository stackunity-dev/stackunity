<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 font-weight-bold mb-2">Website Performance Analysis</h1>
          <p class="text-body-1">Analyze the loading speed and performance metrics of your website</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-text>
              <v-form @submit.prevent="analyzeUrl">
                <v-text-field v-model="url" label="URL du site à analyser" placeholder="https://example.com"
                  hint="Enter the complete URL including https://" persistent-hint prepend-inner-icon="mdi-web"
                  variant="outlined" required autocomplete="url" aria-label="URL to analyze"
                  :rules="[(v) => v.startsWith('http://') || v.startsWith('https://') || 'Please enter a valid URL starting with http:// or https://']"></v-text-field>

                <div class="d-flex mt-4">
                  <v-btn color="secondary" type="submit" size="large" :loading="loading" :disabled="!url"
                    prepend-icon="mdi-speedometer" aria-label="Analyze performance">
                    Analyze performance
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

      <v-row v-else-if="performanceData">
        <v-col cols="12" class="mb-6">
          <h2 id="analysis-results">Performance Analysis Results</h2>

          <v-card class="mt-4 mb-6 bg-surface">
            <v-card-item>
              <v-card-title class="d-flex align-center mb-4">
                <v-icon icon="mdi-speedometer" color="primary" class="mr-2" aria-hidden="true" />
                Average Performance Score
                <v-chip :color="getScoreColor(performanceData.averageScore)" class="ml-4"
                  :aria-label="`Average performance score: ${performanceData.averageScore}%`">
                  {{ performanceData.averageScore }}%
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageMetric('firstContentfulPaint')"
                        :color="getMetricColor('firstContentfulPaint')" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">FCP</div>
                          <div class="text-h6">{{ calculateAverageMetric('firstContentfulPaint', true) }}ms</div>
                        </div>
                      </v-progress-circular>
                      <p class="mt-2">First Contentful Paint</p>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageMetric('largestContentfulPaint')"
                        :color="getMetricColor('largestContentfulPaint')" :size="100" :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">LCP</div>
                          <div class="text-h6">{{ calculateAverageMetric('largestContentfulPaint', true) }}ms</div>
                        </div>
                      </v-progress-circular>
                      <p class="mt-2">Largest Contentful Paint</p>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="4">
                    <div class="text-center">
                      <v-progress-circular :model-value="calculateAverageMetric('cumulativeLayoutShift', false) * 100"
                        :color="getCLSColor(calculateAverageMetric('cumulativeLayoutShift', false))" :size="100"
                        :width="10">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold">CLS</div>
                          <div class="text-h6">{{ calculateAverageMetric('cumulativeLayoutShift', false, 1).toFixed(2)
                            }}</div>
                        </div>
                      </v-progress-circular>
                      <p class="mt-2">Cumulative Layout Shift</p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-item>
          </v-card>

          <v-expansion-panels aria-labelledby="analysis-results">
            <v-expansion-panel v-for="(result, index) in performanceData.performanceResults" :key="index">
              <v-expansion-panel-title>
                <v-row no-gutters align="center">
                  <v-col cols="8" class="text-body-1">{{ result.url }}</v-col>
                  <v-col cols="4" class="text-right d-flex align-center justify-end flex-wrap">
                    <v-chip :color="getScoreColor(result.overallScore)" class="mr-2"
                      :aria-label="`Score: ${result.overallScore}%`">
                      Score: {{ result.overallScore }}%
                    </v-chip>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-tabs v-model="activeTab" color="primary" aria-label="Performance categories">
                  <v-tab value="metrics" aria-label="Core Metrics tab">Core Metrics</v-tab>
                  <v-tab value="resources" aria-label="Resources tab">Resources</v-tab>
                  <v-tab value="optimization" aria-label="Optimization tab">Optimization</v-tab>
                </v-tabs>

                <v-window v-model="activeTab">
                  <v-window-item value="metrics">
                    <v-row class="mt-4">
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-timer" class="mr-2" aria-hidden="true" />
                            Loading Metrics
                          </v-card-title>
                          <v-card-text>
                            <v-list density="compact">
                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getTimeMetricColor(result.firstContentfulPaint)" aria-hidden="true">
                                    {{ getTimeMetricIcon(result.firstContentfulPaint) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>First Contentful Paint</v-list-item-title>
                                <v-list-item-subtitle>{{ result.firstContentfulPaint }}ms</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getTimeMetricColor(result.largestContentfulPaint)" aria-hidden="true">
                                    {{ getTimeMetricIcon(result.largestContentfulPaint) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Largest Contentful Paint</v-list-item-title>
                                <v-list-item-subtitle>{{ result.largestContentfulPaint }}ms</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getTimeMetricColor(result.speedIndex)" aria-hidden="true">
                                    {{ getTimeMetricIcon(result.speedIndex) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Speed Index</v-list-item-title>
                                <v-list-item-subtitle>{{ result.speedIndex }}ms</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getTimeMetricColor(result.totalBlockingTime, 300, 100)"
                                    aria-hidden="true">
                                    {{ getTimeMetricIcon(result.totalBlockingTime, 300, 100) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Total Blocking Time</v-list-item-title>
                                <v-list-item-subtitle>{{ result.totalBlockingTime }}ms</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getCLSColor(result.cumulativeLayoutShift)" aria-hidden="true">
                                    {{ getCLSIcon(result.cumulativeLayoutShift) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Cumulative Layout Shift</v-list-item-title>
                                <v-list-item-subtitle>{{ result.cumulativeLayoutShift }}</v-list-item-subtitle>
                              </v-list-item>

                              <v-list-item>
                                <template v-slot:prepend>
                                  <v-icon :color="getTimeMetricColor(result.timeToInteractive, 7500, 3500)"
                                    aria-hidden="true">
                                    {{ getTimeMetricIcon(result.timeToInteractive, 7500, 3500) }}
                                  </v-icon>
                                </template>
                                <v-list-item-title>Time to Interactive</v-list-item-title>
                                <v-list-item-subtitle>{{ result.timeToInteractive }}ms</v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-chart-bar" class="mr-2" aria-hidden="true" />
                            Performance Score Breakdown
                          </v-card-title>
                          <v-card-text>
                            <v-progress-linear v-model="result.overallScore" :color="getScoreColor(result.overallScore)"
                              height="25" :aria-label="`Overall score: ${result.overallScore}%`">
                              <template v-slot:default="{ value }">
                                <strong>{{ value }}%</strong>
                              </template>
                            </v-progress-linear>

                            <p class="text-subtitle-1 mt-4 mb-2">Score interpretation:</p>
                            <div class="d-flex align-center">
                              <div class="progress-legend">
                                <div class="d-flex align-center">
                                  <div class="score-indicator success"></div>
                                  <span>90-100: Excellent</span>
                                </div>
                                <div class="d-flex align-center">
                                  <div class="score-indicator warning"></div>
                                  <span>50-89: Needs improvement</span>
                                </div>
                                <div class="d-flex align-center">
                                  <div class="score-indicator error"></div>
                                  <span>0-49: Poor</span>
                                </div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="resources">
                    <v-row class="mt-4">
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-server-network" class="mr-2" aria-hidden="true" />
                            Network Requests
                          </v-card-title>
                          <v-card-text>
                            <div class="d-flex flex-column">
                              <div class="d-flex justify-space-between">
                                <span>Total requests:</span>
                                <strong>{{ result.networkRequests.total }}</strong>
                              </div>
                              <div class="d-flex justify-space-between">
                                <span>Total size:</span>
                                <strong>{{ formatBytes(result.networkRequests.size) }}</strong>
                              </div>
                            </div>

                            <v-divider class="my-4"></v-divider>

                            <h3 class="text-subtitle-1 mb-3">Request breakdown by type:</h3>
                            <v-list density="compact">
                              <v-list-item v-for="(value, type) in result.networkRequests.byType" :key="type">
                                <template v-slot:prepend>
                                  <v-icon :icon="getResourceTypeIcon(type as string)" aria-hidden="true" />
                                </template>
                                <v-list-item-title>{{ formatResourceType(type as string) }}</v-list-item-title>
                                <v-list-item-subtitle>
                                  {{ value.count }} requests ({{ formatBytes(value.size) }})
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-chart-pie" class="mr-2" aria-hidden="true" />
                            Resource Distribution
                          </v-card-title>
                          <v-card-text>
                            <canvas ref="resourceChart" height="200" aria-label="Resource distribution chart"></canvas>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-window-item>

                  <v-window-item value="optimization">
                    <v-row class="mt-4">
                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-check-circle" class="mr-2" aria-hidden="true" />
                            Resource Optimization
                          </v-card-title>
                          <v-card-text>
                            <div class="d-flex flex-wrap gap-2" role="list" aria-label="Resource optimization status">
                              <v-chip v-for="(value, key) in result.resourceOptimization" :key="key"
                                :color="value ? 'success' : 'error'" variant="tonal" class="ma-1" role="listitem"
                                :aria-label="getOptimizationTitle(key) + ' is ' + (value ? 'implemented' : 'missing')">
                                <v-icon :icon="value ? 'mdi-check-circle' : 'mdi-alert-circle'" class="mr-2"
                                  aria-hidden="true" /> {{
                                    getOptimizationTitle(key) }}
                              </v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <v-icon icon="mdi-lightbulb-on" class="mr-2" aria-hidden="true" />
                            Optimization Tips
                          </v-card-title>
                          <v-card-text>
                            <v-list>
                              <v-list-item v-for="(tip, index) in performanceData.optimizationTips" :key="index"
                                :class="`importance-${tip.importance}`" density="compact">
                                <template v-slot:prepend>
                                  <v-icon
                                    :icon="tip.importance === 'high' ? 'mdi-alert-circle' : (tip.importance === 'medium' ? 'mdi-information' : 'mdi-lightbulb-on')"
                                    :color="tip.importance === 'high' ? 'error' : (tip.importance === 'medium' ? 'warning' : 'info')"
                                    aria-hidden="true" />
                                </template>
                                <v-list-item-title>{{ tip.title }}</v-list-item-title>
                                <v-list-item-subtitle class="wrap-text">{{ tip.description }}</v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
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

      <v-row v-else-if="error">
        <v-col cols="12">
          <v-alert type="error" title="Error" :text="error" variant="tonal"></v-alert>
        </v-col>
      </v-row>
    </v-container>

    <snackBar v-model="snackbar.show" :color="snackbar.color" :text="snackbar.text" :timeout="3000">
    </snackBar>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import Chart from 'chart.js/auto';
import { computed, onMounted, ref, watch } from 'vue';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
import { PerformanceData, PerformanceMetrics, sendPerformanceScoreToWebsitePage } from '../utils/performance-utils';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Website Performance Analysis - StackUnity',
  meta: [
    {
      name: 'description',
      content: 'Analyze the loading speed and performance metrics of your website for optimal user experience'
    }
  ]
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const url = computed(() => websiteData.value?.main_url || '');
const loading = ref(false);
const error = ref('');
const performanceData = ref<PerformanceData | null>(null);
const activeTab = ref('metrics');
const resourceChart = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);
const snackbar = ref({
  show: false,
  color: 'success',
  text: ''
});

const analyzeUrl = async () => {
  if (!url.value.startsWith('http://') && !url.value.startsWith('https://')) {
    error.value = 'Please enter a valid URL starting with http:// or https://';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    performanceData.value = null;

    const response = await fetch(`/api/analyze/performance-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url.value,
        delayBetweenRequests: 3000
      })
    });

    if (!response.ok) {
      if (response.status === 524) {
        throw new Error('The server took too long to respond. Try with a smaller site or fewer pages.');
      }
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    performanceData.value = data;

    if (data && data.averageScore) {
      const firstResult = data.performanceResults && data.performanceResults.length > 0
        ? data.performanceResults[0]
        : null;

      sendPerformanceScoreToWebsitePage(url.value, data.averageScore, firstResult);
    }

    snackbar.value = {
      show: true,
      color: 'success',
      text: `Analysis completed! ${data.performanceResults?.length || 0} pages analyzed.`
    };
  } catch (err) {
    console.error('Error during site analysis:', err);
    error.value = err instanceof Error ? err.message : 'An unknown error occurred during analysis';
    snackbar.value = {
      show: true,
      color: 'error',
      text: error.value
    };
  } finally {
    loading.value = false;
  }
};

const calculateAverageMetric = (metricName: keyof PerformanceMetrics, isTime = true, maxValue = 5000) => {
  if (!performanceData.value || !performanceData.value.performanceResults.length) return 0;

  const results = performanceData.value.performanceResults;
  const sum = results.reduce((acc, result) => {
    const value = result[metricName];
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);

  const average = sum / results.length;

  if (isTime) {
    if (metricName === 'firstContentfulPaint' || metricName === 'largestContentfulPaint') {
      return Math.round(average);
    }

    return Math.max(0, Math.min(100, (1 - (average / maxValue)) * 100));
  }

  return average;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
};

const getTimeMetricColor = (value: number, poor = 4000, good = 2000) => {
  if (value <= good) return 'success';
  if (value <= poor) return 'warning';
  return 'error';
};

const getTimeMetricIcon = (value: number, poor = 4000, good = 2000) => {
  if (value <= good) return 'mdi-check-circle';
  if (value <= poor) return 'mdi-alert';
  return 'mdi-alert-circle';
};

const getCLSColor = (value: number) => {
  if (value < 0.1) return 'success';
  if (value < 0.25) return 'warning';
  return 'error';
};

const getCLSIcon = (value: number) => {
  if (value < 0.1) return 'mdi-check-circle';
  if (value < 0.25) return 'mdi-alert';
  return 'mdi-alert-circle';
};

const getMetricColor = (metricName: string, inversed = false) => {
  const value = calculateAverageMetric(metricName as keyof PerformanceMetrics);

  if (metricName.includes('cumultative')) {
    return getCLSColor(value);
  }

  if (inversed) {
    if (value >= 90) return 'error';
    if (value >= 50) return 'warning';
    return 'success';
  }

  if (value >= 90) return 'success';
  if (value >= 50) return 'warning';
  return 'error';
};

const getResourceTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'image': return 'mdi-image';
    case 'script': return 'mdi-code-json';
    case 'stylesheet': return 'mdi-language-css3';
    case 'font': return 'mdi-format-font';
    default: return 'mdi-file-document-outline';
  }
};

const formatResourceType = (type: string) => {
  const typeMap: Record<string, string> = {
    'image': 'Images',
    'script': 'JavaScript',
    'stylesheet': 'CSS',
    'font': 'Fonts',
    'other': 'Other'
  };

  return typeMap[type.toLowerCase()] || type;
};

const getOptimizationTitle = (key: string) => {
  const titleMap: Record<string, string> = {
    'compressedImages': 'Image compression',
    'minifiedCss': 'CSS minification',
    'minifiedJs': 'JS minification',
    'responsiveImages': 'Responsive images',
    'lazyLoading': 'Lazy loading',
    'browserCaching': 'Browser caching'
  };

  return titleMap[key] || key;
};

watch(() => performanceData.value, () => {
  if (performanceData.value) {
    setTimeout(() => {
      createResourceChart();
    }, 100);
  }
});

const createResourceChart = () => {
  if (!performanceData.value) {
    return;
  }

  setTimeout(() => {
    try {
      const activePanel = document.querySelector('.v-window-item--active');
      if (!activePanel) {
        return;
      }

      const canvas = activePanel.querySelector('canvas');
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      if (canvas.clientWidth === 0 || canvas.clientHeight === 0) {
        return;
      }

      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;

      const results = performanceData.value?.performanceResults;
      if (!results || !results.length) {
        return;
      }

      const result = results[0];
      const labels: string[] = [];
      const data: number[] = [];
      const colors: string[] = [];

      if (!result.networkRequests || !result.networkRequests.byType) {
        return;
      }

      Object.entries(result.networkRequests.byType).forEach(([type, value]) => {
        if (!type || !value) return;

        const typeString = type as string;
        labels.push(formatResourceType(typeString));
        data.push(value.size);

        const colorMap: Record<string, string> = {
          'image': 'rgba(54, 162, 235, 0.8)',
          'script': 'rgba(255, 206, 86, 0.8)',
          'stylesheet': 'rgba(75, 192, 192, 0.8)',
          'font': 'rgba(153, 102, 255, 0.8)',
          'other': 'rgba(255, 159, 64, 0.8)'
        };

        colors.push(colorMap[typeString.toLowerCase()] || 'rgba(201, 203, 207, 0.8)');
      });

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      if (labels.length && data.length) {
        try {
          chartInstance.value = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels,
              datasets: [{
                data,
                backgroundColor: colors,
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'right'
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const value = context.raw as number;
                      return `${context.label}: ${formatBytes(value)}`;
                    }
                  }
                }
              }
            }
          });
        } catch (err) {
          console.error('Error creating the chart:', err);
        }
      } else {
        console.log('No data to display in the chart');
      }
    } catch (err) {
      console.error('Failed to create the chart:', err);
    }
  }, 1500);
};

watch(activeTab, (newTab) => {
  if (newTab === 'resources' && performanceData.value) {
    setTimeout(() => {
      createResourceChart();
    }, 300);
  }
});

onMounted(() => {
  return () => {
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }
  };
});
</script>

<style scoped>
.score-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 8px;
}

.score-indicator.success {
  background-color: var(--v-success-base, #4caf50);
}

.score-indicator.warning {
  background-color: var(--v-warning-base, #fb8c00);
}

.score-indicator.error {
  background-color: var(--v-error-base, #ff5252);
}

.progress-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.importance-high {
  border-left: 4px solid var(--v-error-base, #ff5252);
}

.importance-medium {
  border-left: 4px solid var(--v-warning-base, #fb8c00);
}

.importance-low {
  border-left: 4px solid var(--v-info-base, #2196f3);
}

.wrap-text {
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
  display: block;
}
</style>