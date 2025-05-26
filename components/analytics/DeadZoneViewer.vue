<template>
  <div class="dead-zone-viewer" role="region" aria-label="Visualisation des zones mortes">
    <div class="viewer-header d-flex align-center mb-4">
      <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ t.deadZoneViewer.title || 'Zones mortes' }}</h3>
      <v-spacer></v-spacer>
      <v-chip v-if="period && period !== 'all'" color="primary" variant="outlined" size="small" class="mr-3">
        <v-icon start size="x-small">mdi-clock-outline</v-icon>
        <span v-if="period === '7d'">{{ t.analytics?.last7days || 'Derniers 7 jours' }}</span>
        <span v-else-if="period === '30d'">{{ t.analytics?.last30days || 'Derniers 30 jours' }}</span>
        <span v-else-if="period === '90d'">{{ t.analytics?.last90days || 'Derniers 90 jours' }}</span>
      </v-chip>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"
        aria-label="Chargement des données de zones mortes"></v-progress-circular>
      <div class="mt-2">{{ t.deadZoneViewer.loading }}</div>
    </div>

    <div v-else-if="!haveData" class="text-center py-8">
      <v-icon icon="mdi-chart-bubble" size="64" color="grey-darken-1" class="mb-4"></v-icon>
      <h3 class="text-h6 text-grey-darken-1">{{ t.deadZoneViewer.noData }}</h3>
      <p class="text-body-2 text-medium-emphasis">
        {{ t.deadZoneViewer.noDataDescription }}
      </p>
    </div>

    <div v-else>
      <div class="analytics-filters d-flex flex-wrap align-center mb-4">
        <v-select v-model="selectedUrl" :items="uniqueUrls" :label="t.deadZoneViewer.selectPage" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-3" aria-label="Select a page to analyze"></v-select>
      </div>

      <v-card variant="outlined" class="mb-6">
        <v-card-title class="py-3 px-4 text-subtitle-1">
          {{ t.deadZoneViewer.overview }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <div class="text-center">
                <div class="text-overline text-medium-emphasis mb-1">
                  {{ t.deadZoneViewer.interactionCoverage }}
                </div>
                <div class="score-gauge d-flex flex-column align-center justify-center">
                  <v-progress-circular :model-value="coverageScore" :color="getCoverageColor" :rotate="-90" :size="100"
                    :width="10" class="gauge-progress mb-2">
                    {{ coverageScore }}%
                  </v-progress-circular>
                  <span class="gauge-label text-caption">{{ getCoverageLabel }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="9">
              <v-row>
                <v-col v-for="(zone, index) in deadZones" :key="index" cols="12" sm="6" md="4">
                  <v-card variant="outlined" class="zone-card h-100">
                    <v-card-text class="pa-3">
                      <div class="d-flex align-center mb-1">
                        <v-icon :color="getZoneSeverityColor(zone.interactionDensity)" size="small" class="mr-2">
                          {{ zone.interactionDensity < 20 ? 'mdi-alert' : 'mdi-alert-outline' }} </v-icon>
                            <div class="text-subtitle-2 font-weight-medium">
                              {{ zone.interactionDensity < 20 ? t.deadZoneViewer.critical :
                                t.deadZoneViewer.needsAttention }} </div>
                            </div>
                            <div class="text-body-2">
                              {{ t.deadZoneViewer.zoneBetween }} {{ zone.start }}% et {{ zone.end }}%
                            </div>
                            <v-progress-linear :model-value="zone.interactionDensity"
                              :color="getZoneSeverityColor(zone.interactionDensity)" height="6" rounded
                              class="mt-2"></v-progress-linear>
                            <div class="d-flex justify-space-between mt-1">
                              <span class="text-caption text-medium-emphasis">{{ t.deadZoneViewer.activity }}</span>
                              <span class="text-caption font-weight-medium">{{ zone.interactionDensity }}%</span>
                            </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="mb-6">
        <v-card-title class="py-3 px-4 text-subtitle-1 d-flex align-center">
          <span>{{ t.deadZoneViewer.pageInteractionVisualization }}</span>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="viewType" density="comfortable" color="primary" mandatory>
            <v-btn value="heatmap" variant="text" size="small" aria-label="Vue carte thermique">
              <v-icon size="small">mdi-gradient-vertical</v-icon>
              <span class="ml-1 d-none d-sm-inline">{{ t.deadZoneViewer.heatmap }}</span>
            </v-btn>
            <v-btn value="segments" variant="text" size="small" aria-label="Vue segments">
              <v-icon size="small">mdi-view-sequential</v-icon>
              <span class="ml-1 d-none d-sm-inline">{{ t.deadZoneViewer.segments }}</span>
            </v-btn>
          </v-btn-toggle>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <div class="visualization-container pa-4">
            <div v-if="viewType === 'heatmap'" class="heatmap-container" ref="heatmapContainer">
              <v-chart class="chart" :option="heatmapOption" autoresize ref="heatmapChart" />
            </div>
            <div v-else class="segments-container">
              <div class="d-flex align-center mb-3">
                <div class="text-body-1 font-weight-medium">{{ t.deadZoneViewer.pageSections }}</div>
                <v-spacer></v-spacer>
                <v-tooltip location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon size="small" variant="text" v-bind="props">
                      <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>
                    {{ t.deadZoneViewer.pageSectionsDescription }}
                  </span>
                </v-tooltip>
              </div>
              <div class="page-representation" :style="`height: ${pageHeight}px`">
                <div class="page-ruler">
                  <div v-for="i in 5" :key="`ruler-${i}`" class="ruler-mark">
                    <div class="ruler-line"></div>
                    <div class="ruler-text">{{ (i - 1) * 20 }}%</div>
                  </div>
                  <div class="ruler-mark">
                    <div class="ruler-line"></div>
                    <div class="ruler-text">100%</div>
                  </div>
                </div>
                <div v-for="(segment, index) in pageSegments" :key="index" class="page-segment" :style="`top: ${segment.startPos}px; height: ${segment.height}px; 
                          background-color: ${getSegmentColor(segment.interactionDensity)}`"
                  :class="{ 'dead-zone': segment.interactionDensity < 30 }">
                  <div class="segment-content" v-if="segment.height > 40">
                    <div class="segment-percentage font-weight-medium">{{ segment.interactionDensity }}% d'interactions
                    </div>
                    <div class="segment-range text-caption">Section {{ segment.start }}-{{ segment.end }}%</div>
                    <div v-if="segment.interactionDensity < 30" class="segment-warning text-caption">
                      <v-icon size="x-small" color="error" class="mr-1">mdi-alert</v-icon>
                      {{ t.deadZoneViewer.lowActivityZone }}
                    </div>
                  </div>
                  <div v-else class="segment-mini">
                    {{ segment.interactionDensity }}%
                  </div>
                </div>
              </div>
              <div class="segment-legend d-flex justify-space-between mt-3">
                <div class="d-flex align-center">
                  <div class="legend-color" style="background-color: rgba(244, 67, 54, 0.7);"></div>
                  <span class="text-caption">{{ t.deadZoneViewer.critical20 }}</span>
                </div>
                <div class="d-flex align-center">
                  <div class="legend-color" style="background-color: rgba(255, 152, 0, 0.7);"></div>
                  <span class="text-caption">{{ t.deadZoneViewer.problematic40 }}</span>
                </div>
                <div class="d-flex align-center">
                  <div class="legend-color" style="background-color: rgba(255, 235, 59, 0.7);"></div>
                  <span class="text-caption">{{ t.deadZoneViewer.average60 }}</span>
                </div>
                <div class="d-flex align-center">
                  <div class="legend-color" style="background-color: rgba(76, 175, 80, 0.7);"></div>
                  <span class="text-caption">{{ t.deadZoneViewer.good100 }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-expansion-panels v-model="expandedPanel" variant="accordion" class="mb-4">
        <v-expansion-panel>
          <v-expansion-panel-title>
            {{ t.deadZoneViewer.recommendations }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <v-list-item v-for="(recommendation, index) in recommendations" :key="index" :title="recommendation.title"
                :subtitle="recommendation.description" class="mb-2" rounded="lg">
                <template v-slot:prepend>
                  <v-avatar color="primary" variant="tonal" size="36">
                    <v-icon :icon="recommendation.icon" size="small"></v-icon>
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts';
import { BarChart, HeatmapChart } from 'echarts/charts';
import { GridComponent, LegendComponent, ToolboxComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, onMounted, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { useTranslations } from '../../languages';

use([
  CanvasRenderer,
  HeatmapChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendComponent,
  ToolboxComponent
]);

interface DeadZone {
  start: number;
  end: number;
  interactionDensity: number;
}

interface PageSegment {
  startPos: number;
  height: number;
  interactionDensity: number;
  start: number;
  end: number;
}

interface Recommendation {
  icon: string;
  title: string;
  description: string;
}

interface PageInteractionData {
  url: string;
  pageHeight: number;
  segments: {
    start: number;
    end: number;
    interactionCount: number;
    interactionDensity: number;
    clicks: number;
    scrolls: number;
    formSubmits: number;
    inputChanges: number;
  }[];
  deadZones: DeadZone[];
  coverageScore: number;
  totalInteractions: number;
  interactionCount: {
    clicks: number;
    scrolls: number;
    formSubmits: number;
    inputChanges: number;
  };
}

const props = defineProps<{
  websiteId: string;
  period?: string;
  title?: string;
}>();

const t = useTranslations('analytics')();
const isLoading = ref(true);
const viewType = ref('heatmap');
const expandedPanel = ref(0);
const pageHeight = ref(1000);
const heatmapContainer = ref(null);
const heatmapChart = ref(null);
const interactionData = ref<PageInteractionData[]>([]);
const selectedUrl = ref('');
const uniqueUrls = ref<string[]>([]);
const coverageScore = ref(0);
const deadZones = ref<DeadZone[]>([]);
const pageSegments = ref<PageSegment[]>([]);

const haveData = computed(() => {
  return interactionData.value.length > 0;
});

const getCoverageColor = computed(() => {
  const score = coverageScore.value;
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'error';
});

const getCoverageLabel = computed(() => {
  const score = coverageScore.value;
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'Faible';
});

const currentPageData = computed(() => {
  if (!selectedUrl.value) return null;
  return interactionData.value.find(data => data.url === selectedUrl.value) || null;
});

const recommendations = computed(() => {
  const zones = deadZones.value;
  const baseRecommendations: Recommendation[] = [
    {
      icon: 'mdi-magnify',
      title: t.deadZoneViewer.recommendationAnalyze.title,
      description: t.deadZoneViewer.recommendationAnalyze.description
    },
    {
      icon: 'mdi-image',
      title: t.deadZoneViewer.recommendationVisual.title,
      description: t.deadZoneViewer.recommendationVisual.description
    }
  ];

  if (zones.some(z => z.interactionDensity < 20)) {
    baseRecommendations.push({
      icon: 'mdi-alert',
      title: t.deadZoneViewer.recommendationCritical.title,
      description: t.deadZoneViewer.recommendationCritical.description
    });
  }

  if (coverageScore.value < 50) {
    baseRecommendations.push({
      icon: 'mdi-page-layout-body',
      title: t.deadZoneViewer.recommendationLayout.title,
      description: t.deadZoneViewer.recommendationLayout.description
    });
  }

  return baseRecommendations;
});

const heatmapOption = computed(() => {
  if (!currentPageData.value) {
    return {};
  }

  const data = currentPageData.value.segments.map((segment, index) => {
    return [0, index, segment.interactionDensity];
  });

  const option: EChartsOption = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const segment = currentPageData.value?.segments[params.data[1]];
        return `<div style="padding: 5px; font-weight: bold;">
                  Section ${params.data[1] + 1} (${segment?.start}%-${segment?.end}%)
                </div>
                <div style="padding: 5px;">
                  <b>${params.data[2]}%</b> of activity<br/>
                  ${segment?.clicks || 0} ${t.deadZoneViewer.clicks}<br/>
                  ${segment?.scrolls || 0} ${t.deadZoneViewer.scrolls}
                </div>`;
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Interactions'],
      splitArea: {
        show: true
      },
      axisLabel: {
        show: true,
        fontSize: 14,
        fontWeight: 'bold'
      },
      axisLine: {
        show: true
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: currentPageData.value.segments.map((segment, i) => `${segment.start}% - ${segment.end}%`),
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 12
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      text: [t.deadZoneViewer.highActivity, t.deadZoneViewer.lowActivity],
      color: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336'],
      textStyle: {
        fontSize: 12
      }
    },
    title: {
      text: t.deadZoneViewer.heatmapTitle,
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 14
      }
    },
    series: [{
      name: t.deadZoneViewer.interactionDensity,
      type: 'heatmap',
      data: data,
      label: {
        show: true,
        formatter: (params: any) => {
          return `${params.data[2]}%`;
        },
        fontSize: 14,
        fontWeight: 'bold'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return option;
});

function getZoneSeverityColor(density: number): string {
  if (density < 20) return 'error';
  if (density < 40) return 'warning';
  if (density < 60) return 'info';
  return 'success';
}

function getSegmentColor(density: number): string {
  if (density < 20) return 'rgba(244, 67, 54, 0.7)'; // Rouge
  if (density < 40) return 'rgba(255, 152, 0, 0.7)'; // Orange
  if (density < 60) return 'rgba(255, 235, 59, 0.7)'; // Jaune
  return 'rgba(76, 175, 80, 0.7)'; // Vert
}

async function fetchDeadZoneData() {
  isLoading.value = true;

  try {
    const periodParam = props.period ? `?period=${props.period}` : '';
    const response = await fetch(`/api/analytics/website/${props.websiteId}/deadzones${periodParam}`);
    const result = await response.json();

    if (result.success && result.data && result.data.length > 0) {
      interactionData.value = result.data;
      uniqueUrls.value = result.data.map((data: PageInteractionData) => data.url);
      selectedUrl.value = uniqueUrls.value[0];
      updatePageData();
    } else {
      console.error('Aucune donnée de zone morte disponible');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données de zone morte:', error);
  } finally {
    isLoading.value = false;
  }
}

function updatePageData() {
  if (!currentPageData.value) return;

  pageHeight.value = currentPageData.value.pageHeight;

  // Calculer les segments de page pour la visualisation
  pageSegments.value = currentPageData.value.segments.map(segment => {
    const startPos = (segment.start / 100) * pageHeight.value;
    const endPos = (segment.end / 100) * pageHeight.value;
    return {
      startPos,
      height: endPos - startPos,
      interactionDensity: segment.interactionDensity,
      start: segment.start,
      end: segment.end
    };
  });

  // Récupérer les zones mortes
  deadZones.value = currentPageData.value.deadZones;

  // Récupérer le score de couverture
  coverageScore.value = currentPageData.value.coverageScore;
}

watch(selectedUrl, () => {
  updatePageData();
});

onMounted(() => {
  fetchDeadZoneData();
});
</script>

<style scoped>
.dead-zone-viewer {
  position: relative;
  z-index: 1;
  background-color: var(--v-theme-background);
  border-radius: 8px;
  overflow: hidden;
}

.gauge-progress {
  position: relative;
}

.gauge-value {
  position: absolute;
  font-size: 1.25rem;
  font-weight: bold;
}

.zone-card {
  border-left-width: 4px;
}

.visualization-container {
  height: 500px;
  position: relative;
  z-index: 1;
  background-color: var(--v-theme-background);
}

.heatmap-container {
  height: 100%;
  width: 100%;
  z-index: 2;
  position: relative;
}

.chart {
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 3;
}

.segments-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.page-representation {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  position: relative;
  border-radius: 4px;
  flex-grow: 1;
  overflow: hidden;
}

.page-segment {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 4;
}

.page-segment:hover {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.dead-zone {
  border-left: 4px solid #F44336;
}

.segment-label {
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.7);
}

.segment-legend {
  width: 100%;
  margin-top: 8px;
  z-index: 4;
  position: relative;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 4px;
}

.page-ruler {
  width: 100%;
  height: 20px;
  position: relative;
  margin-bottom: 8px;
  z-index: 3;
  display: flex;
  justify-content: space-between;
}

.ruler-mark {
  position: relative;
  flex: 1;
}

.ruler-line {
  width: 100%;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.1);
}

.ruler-text {
  position: absolute;
  top: -20px;
  left: 0;
  font-size: 0.75rem;
  font-weight: 500;
}

.ruler-mark:last-child .ruler-text {
  left: auto;
  right: 0;
}

.segment-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.segment-percentage {
  font-size: 1rem;
  font-weight: 500;
}

.segment-range {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
}

.segment-warning {
  font-size: 0.75rem;
  color: rgba(255, 0, 0, 0.8);
}

.segment-mini {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 600px) {
  .visualization-container {
    height: 400px;
  }
}
</style>
