<template>
  <div class="analytics-container">
    <div class="analytics-header d-flex align-center mb-4">
      <h3 class="text-subtitle-1 font-weight-medium mb-0">{{ title || t.interactions.title }}</h3>
      <v-spacer></v-spacer>
      <v-chip v-if="period && period !== 'all'" color="primary" variant="outlined" size="small" class="mr-3">
        <v-icon start size="x-small">mdi-clock-outline</v-icon>
        <span v-if="period === '7d'">{{ t.analytics?.last7days || 'Derniers 7 jours' }}</span>
        <span v-else-if="period === '30d'">{{ t.analytics?.last30days || 'Derniers 30 jours' }}</span>
        <span v-else-if="period === '90d'">{{ t.analytics?.last90days || 'Derniers 90 jours' }}</span>
      </v-chip>
      <v-btn-toggle v-model="viewMode" mandatory density="comfortable" color="primary" variant="outlined" rounded="lg">
        <v-btn value="timeline" variant="text" aria-label="Vue chronologique" size="small">
          <v-icon size="small">mdi-chart-timeline-variant</v-icon>
          <span class="ml-1 d-none d-sm-inline">{{ t.interactions.timeline }}</span>
        </v-btn>
        <v-btn value="heatmap" variant="text" aria-label="Vue carte thermique" size="small">
          <v-icon size="small">mdi-chart-scatter-plot</v-icon>
          <span class="ml-1 d-none d-sm-inline">{{ t.interactions.heatmap }}</span>
        </v-btn>
        <v-btn value="data" variant="text" aria-label="Vue données" size="small">
          <v-icon size="small">mdi-table</v-icon>
          <span class="ml-1 d-none d-sm-inline">{{ t.interactions.data }}</span>
        </v-btn>
      </v-btn-toggle>
    </div>

    <div v-if="props.interactions.data.length === 0" class="text-center py-8">
      <v-icon icon="mdi-chart-timeline-variant" size="64" color="grey-darken-1" class="mb-4"></v-icon>
      <h3 class="text-h6 text-grey-darken-1">{{ t.interactions.noData || 'Aucune interaction disponible' }}</h3>
      <p class="text-body-2 text-medium-emphasis">
        {{ t.interactions.noDataDescription || 'Aucune donnée d\'interaction n\'a été enregistrée pour cette période.'
        }}
      </p>
    </div>

    <div v-else-if="viewMode === 'timeline'" class="analytics-content">
      <div class="analytics-filters d-flex flex-wrap align-center mb-3">
        <v-select v-model="selectedUrl" :items="uniqueUrls" label="Sélectionner une page" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-select v-model="filterType" :items="interactionTypeOptions" :label="t.interactions.type"
          density="comfortable" variant="outlined" hide-details class="filter-select mr-2"></v-select>

        <v-text-field v-model="searchQuery" :label="t.interactions.search" prepend-inner-icon="mdi-magnify"
          density="comfortable" variant="outlined" hide-details class="filter-search"></v-text-field>

        <v-switch v-model="groupSimilarInteractions" color="primary" density="compact" hide-details
          :label="t.interactions.groupSimilar" class="ml-2 mr-2" />

        <v-chip color="info" size="small" class="ml-2">
          {{ filteredInteractions.length }} / {{ props.interactions.total || 100 }} interactions affichées
        </v-chip>
      </div>

      <div class="analytics-metrics d-flex flex-wrap mb-4">
        <v-card v-for="(metric, index) in metricCards" :key="`metric-${index}`" variant="outlined" class="metric-card"
          elevation="2" :style="{
            borderLeft: `4px solid ${getMetricCardColor(metric.type)}`,
            transition: 'all 0.2s ease',
            background: 'linear-gradient(to right, rgba(var(--v-theme-surface-variant), 0.1), transparent)'
          }" hover>
          <v-card-text class="pa-3">
            <div class="d-flex align-center">
              <v-icon :color="getMetricCardColor(metric.type)" class="mr-2" size="24">
                {{ metric.icon }}
              </v-icon>
              <div>
                <div class="text-overline text-medium-emphasis">{{ metric.title }}</div>
                <div class="text-h5 font-weight-bold">{{ metric.value }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-card variant="outlined" class="pa-3 mb-4">
        <div class="chart-container">
          <v-chart class="chart" :option="timelineOption" autoresize />
        </div>
        <div class="d-flex justify-space-between mt-2 text-caption legend">
          <div><v-chip color="primary" size="x-small" class="mr-1"></v-chip> {{
            t.interactions.totalClicks.replace('Total', '') }}</div>
          <div><v-chip color="success" size="x-small" class="mr-1"></v-chip> {{ t.interactions.scrolls }}</div>
          <div><v-chip color="warning" size="x-small" class="mr-1"></v-chip> {{ t.interactions.forms }}</div>
          <div><v-chip color="deep-orange" size="x-small" class="mr-1"></v-chip> {{ t.interactions.inputs }}</div>
        </div>
      </v-card>

      <v-divider class="mb-4"></v-divider>

      <div v-if="recentInteractions.length > 0">
        <h4 class="text-subtitle-2 mb-2">{{ t.interactions.recentInteractions }}</h4>
        <v-table density="compact" class="recent-interactions">
          <thead>
            <tr>
              <th>{{ t.interactions.type }}</th>
              <th>{{ t.interactions.element }}</th>
              <th>{{ t.interactions.timestamp }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="interaction in recentInteractions" :key="interaction.id" class="interaction-row">
              <td>
                <v-chip :color="getInteractionColor(interaction.type)" size="x-small" class="font-weight-medium">
                  {{ interaction.type }}
                </v-chip>
              </td>
              <td class="text-body-2">{{ interaction.elementSelector }}</td>
              <td class="text-body-2">{{ formatTimestamp(interaction.timestamp) }}</td>
              <td class="text-right">
                <v-btn size="x-small" icon variant="text" density="comfortable"
                  @click="selectedInteraction = interaction">
                  <v-icon size="small">mdi-information-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <div v-else-if="viewMode === 'heatmap'" class="analytics-content">
      <div class="analytics-filters d-flex flex-wrap align-center mb-3">
        <v-select v-model="selectedUrl" :items="uniqueUrls" label="Sélectionner une page" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-chip size="small" label>{{ getInteractionCount('click') }} {{ t.interactions.clicksRecorded }}</v-chip>
        <v-spacer></v-spacer>
        <v-select v-if="showWebsiteFrame" v-model="selectedDevice" :items="deviceOptions" label="Appareil"
          density="comfortable" variant="outlined" hide-details class="device-select mr-2"
          style="max-width: 150px;"></v-select>
        <v-switch v-model="showWebsiteFrame" color="primary" density="compact" hide-details
          :label="t.interactions.showWebsite || 'Afficher le site'" class="ml-2 mr-2" />
      </div>

      <v-card variant="outlined" class="pa-4 mb-4">
        <div class="d-flex align-center mb-4 justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
            <span>Note : clicks can be unprecise, especially on mobile devices. Note an 5% error margin.</span>
          </div>
          <div>
            <v-chip color="warning" v-if="showWebsiteFrame && !isValidUrl(selectedUrl)">
              <v-icon start>mdi-alert-circle</v-icon>
              {{ t.interactions.urlNotDisplayable || 'URL non affichable' }}
            </v-chip>
          </div>
        </div>

        <div class="click-heatmap-container">
          <div class="click-heatmap-header">
            <div class="browser-mock" :class="{ 'mobile-frame': isMobileDevice, 'tablet-frame': isTabletDevice }">
              <div class="browser-controls">
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
                <span class="browser-dot"></span>
              </div>
              <div class="browser-address-bar">
                {{ selectedUrl === 'Toutes les pages' ? 'https://example.com' : (selectedUrl.startsWith('http') ?
                  selectedUrl : 'https://' + selectedUrl) }}
              </div>
            </div>
          </div>
          <div class="click-heatmap-viewport" :class="{
            'has-iframe': showWebsiteFrame && isValidUrl(selectedUrl),
            'mobile-viewport': isMobileDevice,
            'tablet-viewport': isTabletDevice
          }" ref="viewportRef">
            <div class="viewport-size-indicator" v-if="actualDimensions.width && actualDimensions.height">
              <v-chip size="small" color="info" variant="outlined">
                <v-icon start size="x-small">mdi-monitor</v-icon>
                {{ actualDimensions.width }}x{{ actualDimensions.height }}px
              </v-chip>
            </div>

            <div class="iframe-container" v-if="showWebsiteFrame && isValidUrl(selectedUrl)" :style="{
              width: `${actualDimensions.width}px`,
              height: `${actualDimensions.height}px`,
              maxWidth: '100%',
              overflow: 'hidden',
              position: 'relative',
              transform: `scale(${frameScale})`,
              transformOrigin: 'top left',
              border: '1px solid rgba(var(--v-border-color), 0.2)'
            }">
              <iframe :src="getFrameUrl(selectedUrl)" class="website-iframe" :style="{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0
              }" sandbox="allow-same-origin allow-scripts" loading="lazy" referrerpolicy="no-referrer">
              </iframe>
            </div>

            <div class="click-heatmap" ref="heatmapContainer" :style="{
              width: `${actualDimensions.width * frameScale}px`,
              height: `${actualDimensions.height * frameScale}px`,
              position: showWebsiteFrame ? 'absolute' : 'relative',
              top: 0,
              left: 0,
              pointerEvents: 'none'
            }">
              <v-chart class="chart" :option="heatmapOption" autoresize />
            </div>
          </div>
          <div class="heatmap-legend d-flex justify-center align-center mt-3">
            <span class="caption mr-2">{{ t.interactions.low || 'Faible' }}</span>
            <div class="heatmap-gradient"></div>
            <span class="caption ml-2">{{ t.interactions.high || 'Élevé' }}</span>
          </div>
        </div>
      </v-card>
    </div>

    <div v-else class="analytics-content">
      <div class="analytics-filters d-flex flex-wrap align-center mb-3">
        <v-select v-model="selectedUrl" :items="uniqueUrls" label="Sélectionner une page" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-select v-model="filterType" :items="interactionTypeOptions" :label="t.interactions.type"
          density="comfortable" variant="outlined" hide-details class="filter-select mr-2"></v-select>

        <v-text-field v-model="searchQuery" :label="t.interactions.search" prepend-inner-icon="mdi-magnify"
          density="comfortable" variant="outlined" hide-details class="filter-search"></v-text-field>

        <v-switch v-model="groupSimilarInteractions" color="primary" density="compact" hide-details
          :label="t.interactions.groupSimilar" class="ml-2 mr-2" />

        <v-chip color="info" size="small" class="ml-2">
          {{ filteredInteractions.length }} / {{ props.interactions.total || 100 }} interactions affichées
        </v-chip>
      </div>

      <v-data-table :headers="headers" :items="filteredInteractions" :items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions" class="elevation-0 interaction-table" density="comfortable">
        <template v-slot:item.type="{ item }">
          <div class="d-flex align-center">
            <v-chip :color="getInteractionColor(item.type)" size="small" class="font-weight-medium px-3 py-2">
              {{ item.type }}
            </v-chip>
            <v-chip v-if="item.count && item.count > 1" size="x-small" color="grey" class="ml-2">
              {{ item.count }}x
            </v-chip>
          </div>
        </template>

        <template v-slot:item.pageUrl="{ item }">
          <span class="text-body-1 url-text" :title="getPageUrl(item)">
            {{ formatUrl(getPageUrl(item)) }}
          </span>
        </template>

        <template v-slot:item.details="{ item }">
          <span class="text-body-1">
            {{ formatInteractionDetails(item) }}
          </span>
        </template>

        <template v-slot:item.timestamp="{ item }">
          <span class="text-body-1">{{ formatTimestamp(item.timestamp) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn size="small" icon variant="text" @click="selectedInteraction = item" title="Voir les détails"
            aria-label="Voir les détails de l'interaction">
            <v-icon>mdi-information-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <div v-if="props.interactions.hasMore" class="d-flex justify-center mt-4">
        <v-btn color="primary" variant="outlined" @click="loadMoreInteractions" :loading="loading">
          {{ t.interactions.loadMore }}
        </v-btn>
      </div>
    </div>

    <v-expand-transition>
      <v-card v-if="selectedInteraction" variant="outlined" class="mt-4 details-panel">
        <v-card-title class="d-flex align-center pa-3">
          <span class="text-subtitle-2">{{ t.interactions.interactionDetails }}</span>
          <v-spacer></v-spacer>
          <v-chip :color="getInteractionColor(selectedInteraction.type)" size="small" class="font-weight-medium">
            {{ selectedInteraction.type }}
          </v-chip>
          <v-btn icon size="small" @click="selectedInteraction = null" class="ml-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-3">
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.dateTime }}</div>
              <div class="text-body-1">{{ formatTimestamp(selectedInteraction.timestamp) }}</div>
            </v-col>

            <v-col cols="12" md="6" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.type }}</div>
              <div class="text-body-1">{{ selectedInteraction.type }}</div>
            </v-col>

            <v-col cols="12" md="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.element }}</div>
              <div class="text-body-1 selector-text">{{ selectedInteraction.elementSelector }}</div>
            </v-col>

            <v-col v-if="selectedInteraction.pageUrl || getPageUrl(selectedInteraction)" cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">URL</div>
              <div class="text-body-1">{{ getPageUrl(selectedInteraction) || 'URL non disponible' }}</div>
            </v-col>

            <v-col v-if="selectedInteraction.elementText" cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.text }}</div>
              <div class="text-body-1">{{ selectedInteraction.elementText }}</div>
            </v-col>

            <v-col v-if="selectedInteraction.value" cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.detailedData }}</div>
              <v-card variant="outlined" class="pa-2 value-card">
                <pre class="value-json ma-0">{{ formatSelectedValue(selectedInteraction.value) }}</pre>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script lang="ts" setup>
declare module 'vue-echarts';

import { HeatmapChart, LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, defineComponent, nextTick, onMounted, provide, ref, watch } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { useTranslations } from '../../languages';
import { UserInteraction } from '../../utils/analytics/types';

interface ExtendedUserInteraction extends UserInteraction {
  pageUrl?: string;
  count?: number;
}

use([
  CanvasRenderer,
  ScatterChart,
  LineChart,
  HeatmapChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent
]);

type DataPoint = {
  value: number[];
  name: string;
  itemStyle: { color: string };
};

type TimelineSeriesData = {
  click: DataPoint[];
  scroll: DataPoint[];
  form_submit: DataPoint[];
  input_change: DataPoint[];
};

const props = defineProps<{
  interactions: {
    data: ExtendedUserInteraction[];
    total: number;
    limit: number;
    page: number;
    hasMore: boolean;
  };
  title?: string;
  period?: string;
  websiteId: string;
  userInteractions?: ExtendedUserInteraction[];
}>();

const viewMode = ref('timeline');
const selectedInteraction = ref<ExtendedUserInteraction | null>(null);
const heatmapContainer = ref<HTMLElement | null>(null);
const filterType = ref('Tous');
const searchQuery = ref('');
const loading = ref(false);
const currentPage = ref(1);
const selectedUrl = ref('Toutes les pages');

const itemsPerPage = ref(50);
const itemsPerPageOptions = [10, 25, 50, 100, 200, -1];

const excludedInteractionTypes = ['page_viewexit', 'pageViewExit', 'visibility_snapshot', 'segment_visibility', 'page_duration', 'pageVisitDuration', 'page_exit'];
const interactionTypeOptions = ['Tous', 'click', 'scroll_depth', 'scroll', 'form_submit', 'input_change'];

const t = useTranslations('analytics')();

const headers = [
  { title: t.interactions.type, key: 'type', sortable: true },
  { title: 'URL', key: 'pageUrl', sortable: true, width: '25%' },
  { title: t.interactions.element, key: 'elementSelector', sortable: true, width: '25%' },
  { title: t.interactions.details, key: 'details', sortable: false, width: '25%' },
  { title: t.interactions.timestamp, key: 'timestamp', sortable: true },
  { title: t.interactions.actions, key: 'actions', sortable: false, width: '60px' }
];

function normalizeUrl(url) {
  if (!url) return '';

  let normalized = url.replace(/\/+$/, '');

  normalized = normalized.split('?')[0];

  normalized = normalized.split('#')[0];

  return normalized;
}

const uniqueUrls = computed(() => {
  const urlMap = new Map();

  urlMap.set('Toutes les pages', 'Toutes les pages');

  props.interactions.data.forEach(interaction => {
    if (interaction.pageUrl && interaction.pageUrl !== 'URL inconnue') {
      const normalizedUrl = normalizeUrl(interaction.pageUrl);
      if (normalizedUrl) {
        urlMap.set(normalizedUrl, normalizedUrl);
      }
    }
  });

  return Array.from(urlMap.values());
});

const filteredInteractionsByUrl = computed(() => {
  return props.interactions.data.filter(interaction => {
    if (excludedInteractionTypes.includes(interaction.type)) {
      return false;
    }

    if (selectedUrl.value !== 'Toutes les pages') {
      return interaction.pageUrl === selectedUrl.value;
    }

    return true;
  });
});

const groupSimilarInteractions = ref(true);

const filteredInteractions = computed(() => {
  let interactions = props.interactions.data.filter(interaction =>
    !excludedInteractionTypes.includes(interaction.type)
  );

  if (selectedUrl.value && selectedUrl.value !== 'Toutes les pages') {
    interactions = interactions.filter(interaction => interaction.pageUrl === selectedUrl.value);
  }

  if (filterType.value && filterType.value !== 'Tous') {
    interactions = interactions.filter(interaction =>
      interaction.type === filterType.value
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    interactions = interactions.filter(interaction => {
      return (
        (interaction.elementSelector && interaction.elementSelector.toLowerCase().includes(query)) ||
        (interaction.elementText && interaction.elementText.toLowerCase().includes(query)) ||
        (interaction.value && JSON.stringify(interaction.value).toLowerCase().includes(query))
      );
    });
  }

  if (groupSimilarInteractions) {
    const groups = new Map();
    interactions.forEach(interaction => {
      let key = interaction.type === 'scroll_depth' && interaction.value && interaction.value.depth
        ? `${interaction.type}-${interaction.elementSelector}-depth-${interaction.value.depth}`
        : `${interaction.type}-${interaction.elementSelector}`;

      if (!groups.has(key)) {
        groups.set(key, { ...interaction, count: 1 });
      } else {
        const group = groups.get(key);
        group.count = (group.count || 1) + 1;
      }
    });
    interactions = Array.from(groups.values());
  }

  return interactions.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
});

const recentInteractions = computed(() => {
  return [...filteredInteractionsByUrl.value]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
});

function getInteractionCount(type: string): number {
  if (type === 'scroll') {
    return filteredInteractionsByUrl.value.filter(i => i.type === 'scroll' || i.type === 'scroll_depth').length;
  }
  return filteredInteractionsByUrl.value.filter(i => i.type === type).length;
}

const metricCards = computed(() => [
  {
    title: t.interactions.totalClicks,
    value: getInteractionCount('click'),
    type: 'click',
    icon: 'mdi-cursor-default-click'
  },
  {
    title: t.interactions.scrolls,
    value: getInteractionCount('scroll'),
    type: 'scroll',
    icon: 'mdi-mouse-scroll-wheel'
  },
  {
    title: t.interactions.forms,
    value: getInteractionCount('form_submit'),
    type: 'form_submit',
    icon: 'mdi-form-select'
  },
  {
    title: t.interactions.inputs,
    value: getInteractionCount('input_change'),
    type: 'input_change',
    icon: 'mdi-form-textbox'
  }
]);

function getMetricCardColor(type: string): string {
  switch (type) {
    case 'click':
      return 'rgb(var(--v-theme-primary))';
    case 'scroll':
      return 'rgb(var(--v-theme-success))';
    case 'form_submit':
      return 'rgb(var(--v-theme-warning))';
    case 'input_change':
      return '#FF5722';
    default:
      return 'rgb(var(--v-theme-surface-variant))';
  }
}

const timelineData = computed<TimelineSeriesData>(() => {
  const series: TimelineSeriesData = {
    click: [],
    scroll: [],
    form_submit: [],
    input_change: []
  };

  filteredInteractionsByUrl.value.forEach(interaction => {
    const time = new Date(interaction.timestamp);
    const timeValue = time.getTime();
    const formattedTime = time.toISOString();
    const value = [timeValue, getTypeValue(interaction.type)];

    if (interaction.type === 'click') {
      series.click.push({
        value,
        name: formattedTime,
        itemStyle: { color: '#1976D2' }
      });
    } else if (interaction.type === 'scroll' || interaction.type === 'scroll_depth') {
      series.scroll.push({
        value,
        name: formattedTime,
        itemStyle: { color: '#4CAF50' }
      });
    } else if (interaction.type === 'form_submit') {
      series.form_submit.push({
        value,
        name: formattedTime,
        itemStyle: { color: '#FB8C00' }
      });
    } else if (interaction.type === 'input_change') {
      series.input_change.push({
        value,
        name: formattedTime,
        itemStyle: { color: '#FF5722' }
      });
    }
  });

  return series;
});

const timelineOption = computed(() => {
  const data = timelineData.value;
  const now = new Date();

  let minTime = now;

  if (props.interactions.data.length > 0) {
    minTime = props.interactions.data.reduce((earliest, interaction) => {
      const date = new Date(interaction.timestamp);
      return date < earliest ? date : earliest;
    }, new Date());
  } else {
    minTime = new Date(now.getTime() - 24 * 3600 * 1000);
  }

  if (now.getTime() - minTime.getTime() < 24 * 3600 * 1000) {
    minTime = new Date(now.getTime() - 24 * 3600 * 1000);
  }

  return {
    backgroundColor: '#1E1E1E',
    textStyle: {
      color: '#ffffff'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const date = new Date(params.value[0]);
        return `
          <div style="font-weight:bold;">${params.seriesName}</div>
          <div>${formatTimestamp(date.toISOString())}</div>
        `;
      }
    },
    grid: {
      left: 80,
      right: 20,
      top: 40,
      bottom: 60
    },
    xAxis: {
      type: 'time',
      min: minTime.getTime(),
      max: now.getTime(),
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value);
          return date.getHours() + ':00';
        },
        color: '#cccccc',
        margin: 12
      }
    },
    yAxis: {
      type: 'category',
      data: ['Click', 'Scroll', 'Form', 'Input'],
      boundaryGap: true,
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#333333'
        }
      },
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: '#cccccc',
        margin: 16,
        fontSize: 13
      }
    },
    series: [
      {
        name: 'Click',
        type: 'scatter',
        data: data.click,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#1976D2'
        }
      },
      {
        name: 'Scroll',
        type: 'scatter',
        data: data.scroll,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#4CAF50'
        }
      },
      {
        name: 'Form',
        type: 'scatter',
        data: data.form_submit,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#FB8C00'
        }
      },
      {
        name: 'Input',
        type: 'scatter',
        data: data.input_change,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#FF5722'
        }
      }
    ]
  };
});

const viewportScale = ref(1);
const viewportRef = ref<HTMLElement | null>(null);

function getScaledPosition(position, dimension) {
  return position * (viewportScale.value || 1);
}

const deviceDimensions = ref({
  width: 1024,
  height: 768
});

const frameScale = ref(1);

const clickDotsData = computed(() => {
  return filteredInteractionsByUrl.value
    .filter(i => i.type === 'click' && i.value)
    .map(interaction => {
      const value = interaction.value || {};
      const hasPageProps = value.pageWidth && value.pageHeight && value.pageX !== undefined && value.pageY !== undefined;

      const x = hasPageProps ? value.pageX : (value.x || value.clientX || 0);
      const y = hasPageProps ? value.pageY : (value.y || value.clientY || 0);

      const pageWidth = hasPageProps ? value.pageWidth : (viewportWidth.value || 1024);
      const pageHeight = hasPageProps ? value.pageHeight : (viewportHeight.value || 768);

      const relativeX = hasPageProps ? (value.relativeX || (x / pageWidth * 100)) : (x / pageWidth * 100);
      const relativeY = hasPageProps ? (value.relativeY || (y / pageHeight * 100)) : (y / pageHeight * 100);

      return {
        x: getScaledPosition(x, 'width'),
        y: getScaledPosition(y, 'height'),
        relativeX: relativeX,
        relativeY: relativeY,
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        viewportWidth: value.viewportWidth || viewportWidth.value,
        viewportHeight: value.viewportHeight || viewportHeight.value,
        color: '#1976D2',
        timestamp: interaction.timestamp,
        text: interaction.elementText || ''
      };
    });
});

function isValidUrl(url: string): boolean {
  if (url === 'Toutes les pages') return false;

  try {
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
    return true;
  } catch (e) {
    return false;
  }
}

function getFrameUrl(url: string): string {
  if (!url || url === 'Toutes les pages') return '';

  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }

  return url;
}

function getTypeValue(type: string): number {
  switch (type) {
    case 'click': return 0;
    case 'scroll': return 1;
    case 'scroll_depth': return 1;
    case 'form_submit': return 2;
    case 'input_change': return 3;
    default: return 4;
  }
}

function getInteractionColor(type: string): string {
  const interactionType = type.toLowerCase();

  if (interactionType.includes('click')) {
    return 'primary';
  } else if (interactionType.includes('scroll') || interactionType === 'scroll_depth') {
    return 'success';
  } else if (interactionType.includes('form') || interactionType === 'form_submit') {
    return 'warning';
  } else if (interactionType.includes('input') || interactionType === 'input_change') {
    return 'deep-orange';
  } else if (interactionType.includes('error')) {
    return 'error';
  } else {
    return 'grey';
  }
}

function formatScrollData(interaction: ExtendedUserInteraction): string {
  if (!interaction.value) return '-';

  if (interaction.type === 'scroll_depth') {
    const depth = interaction.value.depth || 0;
    const pixelY = interaction.value.pixelY || 0;
    return `${depth}% de profondeur (${Math.round(Number(pixelY))}px)`;
  }

  if (interaction.type !== 'scroll' || !interaction.value.scrollDepth) {
    return '-';
  }

  const scrollDepthValue = typeof interaction.value.scrollDepth === 'number' ?
    interaction.value.scrollDepth :
    parseFloat(interaction.value.scrollDepth) || 0;

  const depth = Math.min(100, parseFloat(scrollDepthValue.toFixed(2)));
  let description = `${depth}% ${t.interactionsCard.scrollDepth}`;

  if (interaction.value.documentHeight && interaction.value.scrollPosition) {
    const position = Math.round(interaction.value.scrollPosition);
    const total = Math.round(interaction.value.documentHeight);
    description += ` (${position}px / ${total}px)`;
  }

  return description;
}

function formatInteractionDetails(interaction: ExtendedUserInteraction) {
  if (!interaction.value) return '-';

  try {
    let countPrefix = '';
    if (interaction.count && interaction.count > 1) {
      countPrefix = `[${interaction.count}x] `;
    }

    switch (interaction.type) {
      case 'scroll':
      case 'scroll_depth':
        return countPrefix + formatScrollData(interaction);
      case 'click':
        let clickDetails = '';
        if (interaction.elementText) {
          clickDetails = `"${interaction.elementText}"`;
        }

        const value = interaction.value;
        if (value) {
          const hasPageCoords = value.pageX !== undefined && value.pageY !== undefined;
          const hasClientCoords = value.clientX !== undefined && value.clientY !== undefined;

          if (hasPageCoords && hasClientCoords) {
            clickDetails += clickDetails ?
              ` à la position (${value.pageX}, ${value.pageY}) | relatif: (${value.relativeX?.toFixed(2) || 0}%, ${value.relativeY?.toFixed(2) || 0}%)` :
              `Position: absolue (${value.pageX}, ${value.pageY}) | relative (${value.relativeX?.toFixed(2) || 0}%, ${value.relativeY?.toFixed(2) || 0}%)`;

            if (value.pageWidth && value.pageHeight) {
              clickDetails += ` sur page ${value.pageWidth}x${value.pageHeight}px`;
            }
          } else if (value.x !== undefined && value.y !== undefined) {
            clickDetails += clickDetails ? ` à la position (${value.x}, ${value.y})` :
              `Position: (${value.x}, ${value.y})`;
          }
        }

        return countPrefix + (clickDetails || t.interactions.detailsNotAvailable);
      case 'form_submit':
        if (interaction.value.formId || interaction.value.action) {
          return countPrefix + `Formulaire: ${interaction.value.formId || interaction.value.action || t.interactions.notIdentified}`;
        }
        break;
      case 'input_change':
        let inputInfo: string[] = [];

        if (interaction.value.hasValue) {
          inputInfo.push(`Valeur présente (${interaction.value.valueLength} caractères)`);
        }

        if (interaction.value.fieldPurpose && interaction.value.fieldPurpose !== 'other' && interaction.value.fieldPurpose !== 'unknown') {
          inputInfo.push(`Type: ${formatFieldPurpose(interaction.value.fieldPurpose)}`);
        }

        if (interaction.value.fieldName) {
          inputInfo.push(`Champ: ${interaction.value.fieldName}`);
        }

        if (typeof interaction.value.isValid !== 'undefined') {
          inputInfo.push(interaction.value.isValid ? 'Valide' : 'Invalide');
        }

        return countPrefix + inputInfo.join(' | ');
      default:
        return countPrefix + t.interactions.detailsNotAvailable;
    }
  } catch (e) {
    console.error('Erreur lors du formatage des détails:', e);
    return t.interactions.detailsNotAvailable;
  }
}

function formatFieldPurpose(purpose: string): string {
  const purposeMap = {
    'email': 'Email',
    'phone': 'Téléphone',
    'name': 'Nom',
    'first_name': 'Prénom',
    'last_name': 'Nom de famille',
    'address': 'Adresse',
    'city': 'Ville',
    'country': 'Pays',
    'postal_code': 'Code postal',
    'payment': 'Paiement',
    'message': 'Message',
    'subject': 'Sujet',
    'company': 'Entreprise',
    'website': 'Site web',
    'search': 'Recherche',
    'password': 'Mot de passe'
  };

  return purposeMap[purpose] || purpose;
}

function formatTimestamp(timestamp: string): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatUrl(url: string): string {
  if (!url) return 'N/A';

  const withoutProtocol = url.replace(/^https?:\/\//, '');

  if (withoutProtocol.length > 40) {
    return withoutProtocol.substring(0, 37) + '...';
  }

  return withoutProtocol;
}

function getPageUrl(interaction: ExtendedUserInteraction): string {
  return interaction.pageUrl || '';
}

function formatSelectedValue(value: any): string {
  try {
    if (typeof value !== 'object' || value === null) {
      return String(value);
    }

    if (value.depth !== undefined && value.pixelY !== undefined) {
      return JSON.stringify({
        depth: value.depth,
        pixelY: Math.round(Number(value.pixelY))
      }, null, 2);
    }

    if (Object.keys(value).length === 0) {
      return '{}';
    }

    return JSON.stringify(value, null, 2);
  } catch (e) {
    console.error('Erreur lors du formatage des données JSON:', e);
    return '{"error": "Impossible de formater ces données"}';
  }
}

const loadMoreInteractions = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    currentPage.value++;
    const response = await fetch(`/api/analytics/website/${props.websiteId}/interactions?page=${currentPage.value}&limit=${itemsPerPage.value}`);
    const data = await response.json();

    if (data.success) {
      const newInteractions = data.data.interactions.data.filter(i =>
        !excludedInteractionTypes.includes(i.type)
      );
      props.interactions.data = [...props.interactions.data, ...newInteractions];
      props.interactions.hasMore = data.data.interactions.hasMore;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des interactions:', error);
  } finally {
    loading.value = false;
  }
};

const loadInitialInteractions = async () => {
  if (loading.value || itemsPerPage.value <= props.interactions.limit) return;

  loading.value = true;
  try {
    const response = await fetch(`/api/analytics/website/${props.websiteId}/interactions?page=1&limit=${itemsPerPage.value}`);
    const data = await response.json();

    if (data.success) {
      const newInteractions = data.data.interactions.data.filter(i =>
        !excludedInteractionTypes.includes(i.type)
      );
      props.interactions.data = newInteractions;
      props.interactions.total = data.data.interactions.total;
      props.interactions.limit = itemsPerPage.value;
      props.interactions.hasMore = data.data.interactions.hasMore;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des interactions:', error);
  } finally {
    loading.value = false;
  }
};

const showWebsiteFrame = ref(false);

const selectedDevice = ref('desktop');

const deviceOptions = [
  { title: 'Bureau', value: 'desktop' },
  { title: 'Tablette', value: 'tablet' },
  { title: 'Mobile', value: 'mobile' }
];

const isMobileDevice = computed(() => selectedDevice.value === 'mobile');
const isTabletDevice = computed(() => selectedDevice.value === 'tablet');

onMounted(() => {
  if (props.interactions && props.interactions.data) {
    props.interactions.data = props.interactions.data.filter(i =>
      !excludedInteractionTypes.includes(i.type)
    );
  }

  if (props.userInteractions && props.userInteractions.length > 0) {
    const filteredUserInteractions = props.userInteractions.filter(i =>
      !excludedInteractionTypes.includes(i.type)
    );

    if (filteredUserInteractions.length > 0) {
      props.interactions.data = filteredUserInteractions;
      props.interactions.total = filteredUserInteractions.length;
    }
  } else if (props.interactions.limit < itemsPerPage.value) {
    loadInitialInteractions();
  }

  watch(selectedDevice, () => {
    setTimeout(updateViewportScale, 300);
  });

  setTimeout(() => {
    const charts = document.querySelectorAll('.chart');
    charts.forEach(chart => {
      const echartInstance = (chart as any).__echarts__;
      if (echartInstance) {
        echartInstance.resize();
      }
    });

    updateViewportScale();
  }, 300);

  const updateViewportScale = () => {
    if (viewportRef.value) {
      const viewport = viewportRef.value;
      const rect = viewport.getBoundingClientRect();

      const baseWidth = isMobileDevice.value ? 375 : isTabletDevice.value ? 768 : 1920;
      viewportScale.value = rect.width / baseWidth;
      console.log('Viewport scale updated:', viewportScale.value, 'for device:', selectedDevice.value);
    }
  };

  window.addEventListener('resize', updateViewportScale);
});

defineComponent({
  components: {
    VChart
  }
});

provide(THEME_KEY, 'dark');

const viewportWidth = ref(1920);
const viewportHeight = ref(1080);

const actualDimensions = ref({
  width: 1024,
  height: 768
});

function updateHeatmapDimensions() {
  let width = deviceDimensions.value.width;
  let height = deviceDimensions.value.height;
  let scale = 1;

  const pageData = clickDotsData.value.find(click => click.pageWidth && click.pageHeight);
  if (pageData) {
    width = pageData.pageWidth;
    height = pageData.pageHeight;

    if (isMobileDevice.value) {
      width = 390;
      height = 844;
    } else if (isTabletDevice.value) {
      width = 768;
      height = 1024;
    }

    const containerWidth = viewportRef.value ? viewportRef.value.clientWidth * 0.9 : 1000;
    if (width > containerWidth) {
      scale = containerWidth / width;
    }
  }

  actualDimensions.value = { width, height };
  frameScale.value = scale;

  if (heatmapContainer.value) {
    heatmapContainer.value.style.width = `${width * scale}px`;
    heatmapContainer.value.style.height = `${height * scale}px`;
  }
}

const heatmapOption = computed(() => {
  const points = clickDotsData.value.map(point => {
    return [point.relativeX, point.relativeY, 1];
  });

  return {
    backgroundColor: showWebsiteFrame.value ? 'transparent' : '#1E1E1E40',
    textStyle: {
      color: '#ffffff'
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `
          <div style="padding: 5px;">
            <div style="font-weight: bold;">${t.interactions.position || 'Position du clic'}</div>
            <div>X: ${params.value[0]}px, Y: ${params.value[1]}px</div>
            ${params.data[3] ? `<div>${t.interactions.element || 'Élément'}: "${params.data[3]}"</div>` : ''}
          </div>
        `;
      }
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 40,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 1920,
      show: !showWebsiteFrame,
      splitLine: {
        show: !showWebsiteFrame,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        formatter: (value) => `${value}px`,
        color: '#cccccc',
        margin: 12
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1080,
      inverse: true,
      show: !showWebsiteFrame,
      splitLine: {
        show: !showWebsiteFrame,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLabel: {
        formatter: (value) => `${value}px`,
        color: '#cccccc',
        margin: 12
      }
    },
    visualMap: {
      show: false,
      min: 0,
      max: 5,
      inRange: {
        symbolSize: [8, 25],
        colorLightness: [0.8, 0],
        color: [showWebsiteFrame ? 'rgba(255, 87, 34, 0.8)' : 'rgba(25, 118, 210, 0.7)']
      }
    },
    series: [
      {
        name: 'Click Map',
        type: 'scatter',
        data: points,
        symbol: 'circle',
        symbolSize: function (val) {
          return showWebsiteFrame ? val[2] * 20 : val[2] * 15;
        },
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: showWebsiteFrame ? [
              { offset: 0, color: 'rgba(255, 87, 34, 0.9)' },
              { offset: 1, color: 'rgba(255, 87, 34, 0.4)' }
            ] : [
              { offset: 0, color: 'rgba(66, 165, 245, 0.9)' },
              { offset: 1, color: 'rgba(25, 118, 210, 0.4)' }
            ]
          },
          shadowBlur: 15,
          shadowColor: showWebsiteFrame ? 'rgba(255, 87, 34, 0.7)' : 'rgba(25, 118, 210, 0.5)'
        },
        emphasis: {
          scale: true,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: showWebsiteFrame ? 'rgba(255, 87, 34, 0.8)' : 'rgba(25, 118, 210, 0.8)'
          }
        }
      }
    ]
  };
});

watch([clickDotsData, selectedDevice, showWebsiteFrame], () => {
  nextTick(() => {
    updateHeatmapDimensions();
  });
});
</script>

<style scoped>
.analytics-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.analytics-header {
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.analytics-metrics {
  gap: 12px;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}

.metric-card {
  flex: 1;
  min-width: 150px;
  margin: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.metric-card .text-overline {
  font-size: 11px;
  letter-spacing: 0.5px;
}

.chart-container {
  width: 100%;
  height: 350px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
}

.click-heatmap-container {
  position: relative;
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.click-heatmap-viewport {
  position: relative;
  width: 100%;
  min-height: 400px;
  margin: 0 auto;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 16px;
}

.click-heatmap-viewport.has-iframe {
  background-color: rgba(var(--v-theme-background), 1);
}

.click-heatmap-viewport.mobile-viewport {
  max-width: 390px;
}

.click-heatmap-viewport.tablet-viewport {
  max-width: 768px;
}

.click-heatmap {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.click-heatmap-header {
  background-color: rgba(var(--v-theme-surface), 1);
  padding: 8px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
}

.browser-mock {
  display: flex;
  align-items: center;
  background-color: rgba(var(--v-theme-surface), 1);
}

.browser-controls {
  display: flex;
  margin-right: 16px;
}

.browser-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  opacity: 0.7;
}

.browser-dot:nth-child(1) {
  background-color: #ff5f57;
}

.browser-dot:nth-child(2) {
  background-color: #ffbd2e;
}

.browser-dot:nth-child(3) {
  background-color: #28ca42;
}

.browser-address-bar {
  flex: 1;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.heatmap-gradient {
  height: 12px;
  width: 100px;
  background: linear-gradient(to right, #3366cc, #dc3912, #ff9900, #109618);
  border-radius: 2px;
}

.viewport-size-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.iframe-container {
  margin: 0 auto;
  transform-origin: top left;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .click-heatmap-viewport {
    padding: 8px;
  }
}

.filter-select {
  min-width: 250px;
}

.filter-search {
  max-width: 300px;
}

.interaction-table :deep(th) {
  font-weight: 600 !important;
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 14px !important;
  background-color: #2a2a2a;
  padding: 16px !important;
  height: 56px !important;
}

.interaction-table :deep(td) {
  padding: 16px !important;
  height: 64px !important;
}

.interaction-row:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.interaction-table :deep(.v-data-table-footer) {
  padding: 16px !important;
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.interaction-table :deep(.v-data-table-footer__items-per-page) {
  margin-right: 16px !important;
}

.interaction-table :deep(.v-data-table-footer__pagination) {
  margin-left: 16px !important;
}

.interaction-table :deep(.v-chip) {
  height: 32px !important;
  font-size: 13px !important;
}

.selector-text {
  font-family: monospace;
  word-break: break-all;
}

.url-text {
  font-family: system-ui, -apple-system, sans-serif;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value-card {
  background-color: #1a1a1a;
}

.value-json {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
  font-size: 12px;
  color: #b3b3b3;
  max-height: 250px;
  overflow-y: auto;
}

.details-panel {
  border-top: 3px solid #1976D2;
  background-color: #1E1E1E;
}

.recent-interactions :deep(th) {
  font-weight: 600 !important;
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.7) !important;
  background-color: #2a2a2a;
}

@media (max-width: 599px) {
  .metric-card {
    flex-basis: calc(50% - 1rem);
  }
}

@media (max-width: 419px) {
  .metric-card {
    flex-basis: 100%;
  }
}

.interaction-table {
  border-radius: 8px;
  overflow: hidden;
}

.v-data-table-footer {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>