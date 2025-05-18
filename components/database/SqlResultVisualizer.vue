<template>
  <div class="sql-result-visualizer">
    <v-card class="result-visualizer-card elevation-3 mb-4">
      <v-card-title class="bg-tertiary text-white d-flex align-center">
        <v-icon class="mr-2">mdi-chart-box</v-icon>
        {{ t().sqlVisualizer.title }}
      </v-card-title>

      <v-expand-transition>
        <div v-if="isExpanded">
          <v-card-text class="pa-4">
            <v-alert v-if="!hasResults" type="info" variant="tonal" class="mb-4">
              {{ t().sqlVisualizer.noResults }}
            </v-alert>

            <template v-else>
              <div class="d-flex align-center mb-4">
                <v-chip-group v-model="selectedVisualization" mandatory>
                  <v-chip v-for="(type, index) in visualizationTypes" :key="index" filter :value="type.value"
                    :color="type.color">
                    <v-icon start size="small">{{ type.icon }}</v-icon>
                    {{ type.label }}
                  </v-chip>
                </v-chip-group>
                <v-spacer></v-spacer>
                <v-btn size="small" variant="tonal" color="secondary" prepend-icon="mdi-download"
                  @click="downloadVisualization">
                  {{ t().sqlVisualizer.download }}
                </v-btn>
              </div>

              <div class="visualization-container pa-4" ref="visualizationContainer">
                <div v-if="loading" class="d-flex justify-center align-center" style="height: 300px;">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <div v-else>
                  <div v-if="selectedVisualization === 'bar'" class="chart-wrapper">
                    <div ref="barChart" style="width: 100%; height: 350px;"></div>
                    <div class="text-center text-caption mt-2">{{ t().sqlVisualizer.barChartHint }}</div>
                  </div>

                  <div v-else-if="selectedVisualization === 'pie'" class="chart-wrapper">
                    <div ref="pieChart" style="width: 100%; height: 350px;"></div>
                    <div class="text-center text-caption mt-2">{{ t().sqlVisualizer.pieChartHint }}</div>
                  </div>

                  <div v-else-if="selectedVisualization === 'table'" class="table-container overflow-auto">
                    <v-data-table :headers="tableHeaders" :items="tableItems" :items-per-page="10" class="elevation-1"
                      density="comfortable" hover>
                      <template v-slot:top>
                        <div class="d-flex align-center pa-2">
                          <v-text-field v-model="tableSearch" prepend-inner-icon="mdi-magnify" label="Rechercher"
                            single-line hide-details density="compact" class="mr-4"></v-text-field>
                          <v-spacer></v-spacer>
                          <v-btn color="secondary" variant="tonal" prepend-icon="mdi-download" @click="exportTable">
                            Export
                          </v-btn>
                        </div>
                      </template>

                      <template v-slot:item="{ item, columns }">
                        <tr>
                          <td v-for="column in columns" :key="column.key || ''">
                            <template
                              v-if="column.key && typeof item[column.key] === 'object' && item[column.key]?.preview">
                              <div class="d-flex align-center">
                                <span class="text-truncate" style="max-width: 300px;">
                                  {{ item[column.key]?.preview }}
                                </span>
                                <v-btn size="small" variant="text" color="primary" class="ml-2"
                                  @click="showFullContent(item[column.key]?.full)">
                                  Voir plus
                                </v-btn>
                              </div>
                            </template>
                            <template v-else>
                              <span class="text-truncate" style="max-width: 300px;">
                                {{ column.key ? item[column.key] : '' }}
                              </span>
                            </template>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </div>
                </div>
              </div>

              <div class="chart-controls pt-4">
                <h3 class="text-subtitle-1 mb-3">{{ t().sqlVisualizer.customization }}</h3>

                <v-row dense>
                  <v-col cols="12" sm="6" md="6">
                    <v-select v-if="selectedVisualization === 'bar'" v-model="chartSettings.xAxis"
                      :items="availableColumns" label="Category (X axis)" variant="outlined" density="comfortable"
                      @update:modelValue="updateVisualization" />
                    <v-select v-else-if="selectedVisualization === 'pie'" v-model="chartSettings.xAxis"
                      :items="availablePieColumns" label="Category (X axis)" variant="outlined" density="comfortable"
                      @update:modelValue="updateVisualization" />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select v-if="selectedVisualization === 'bar'" v-model="chartSettings.yAxis"
                      :items="availableNumericColumns" label="Value (Y axis)" variant="outlined" density="comfortable"
                      @update:modelValue="updateVisualization" />
                    <v-select v-else-if="selectedVisualization === 'pie'" v-model="chartSettings.yAxis"
                      :items="availablePieValues" label="Value (Y axis)" variant="outlined" density="comfortable"
                      @update:modelValue="updateVisualization" />
                  </v-col>
                </v-row>

                <v-checkbox v-model="chartSettings.showLegend" :label="t().sqlVisualizer.showLegend"
                  @update:modelValue="updateVisualization" hide-details></v-checkbox>
              </div>

              <v-alert v-if="selectedVisualization === 'bar' && (!chartSettings.xAxis || !chartSettings.yAxis)"
                type="warning" class="mt-4">
                No suitable X/Y axis combination for bar chart. Please select other columns or try another
                visualization.
              </v-alert>
              <v-alert v-if="selectedVisualization === 'pie' && (!chartSettings.xAxis || !chartSettings.yAxis)"
                type="warning" class="mt-4">
                No suitable X/Y axis combination for pie chart. Please select other columns or try another
                visualization.
              </v-alert>
            </template>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>

    <v-dialog v-model="showContentDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h6 bg-secondary">
          <v-icon>mdi-code-braces</v-icon>
          Full content
        </v-card-title>
        <v-card-text>
          <pre class="content-pre" ref="contentPre"><code class="language-json">{{ fullContent }}</code></pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="showContentDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { BarChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useTranslations } from '../../languages';

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart
]);

const applyHighlight = (content: string) => {
  const preElement = contentPre.value;
  if (preElement) {
    hljs.highlightElement(preElement as HTMLElement);
  }
};

const props = defineProps({
  results: {
    type: Array as () => Array<Record<string, any>>,
    default: () => [],
  },
  columns: {
    type: Array as () => string[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const t = useTranslations('databaseManagement');
const isExpanded = ref(true);
const selectedVisualization = ref('bar');
const visualizationContainer = ref(null);
const barChart = ref(null);
const contentPre = ref<HTMLPreElement | null>(null);
const pieChart = ref(null);
const chartInstances = ref({});

// Palette de couleurs pour les graphiques
const colorPalette = [
  '#1976D2', // Bleu
  '#FFC107', // Jaune
  '#F44336', // Rouge
  '#FF9800', // Orange
  '#4CAF50', // Vert
  '#9C27B0', // Violet
  '#00BCD4', // Bleu clair
  '#FFEB3B', // Jaune clair
  '#FF5722', // Orange foncé
  '#8BC34A', // Vert clair
  '#E91E63', // Rose
  '#673AB7'  // Violet foncé
];

// Chart settings
const chartSettings = ref({
  xAxis: '',
  yAxis: '',
  groupBy: '',
  limit: 20,
  showLegend: true,
  theme: 'dark'
});

// Dashboard widgets
interface DashboardWidget {
  title: string;
  type: string;
  xAxis: string;
  yAxis: string;
  groupBy: string;
}

const dashboardWidgets = ref<DashboardWidget[]>([]);

const hasResults = computed(() => props.results && props.results.length > 0);

const availableColumns = computed(() => {
  if (!props.columns.length || !props.results.length) return [];
  // Catégorielles : pas id, pas unique, peu de valeurs distinctes
  return props.columns.filter(col => {
    const values = props.results.map(row => row[col]);
    const unique = new Set(values);
    return (
      !/\b(id|_id|Id|ID)\b/.test(col) &&
      unique.size > 1 &&
      unique.size < props.results.length * 0.5
    );
  }).map(col => ({ title: col, value: col }));
});

const availableNumericColumns = computed(() => {
  if (!props.columns.length || !props.results.length) return [];
  const columns = ['count'];
  props.columns.forEach(col => {
    if (props.results.some(row => typeof row[col] === 'number' || (!isNaN(Number(row[col])) && row[col] !== null))) {
      columns.push(col);
    }
  });
  return columns.map(col => ({ title: col === 'count' ? 'Count' : col, value: col }));
});

const availablePieColumns = computed(() => {
  if (!props.columns.length || !props.results.length) return [];
  return props.columns.filter(col => {
    const values = props.results.map(row => row[col]);
    const unique = new Set(values);
    return (
      !/\b(id|_id|Id|ID)\b/.test(col) &&
      unique.size > 1 &&
      unique.size < props.results.length * 0.5
    );
  }).map(col => ({ title: col, value: col }));
});

const availablePieValues = computed(() => {
  if (!props.columns.length || !props.results.length) return [{ title: 'Count', value: 'count' }];
  const columns = ['count'];
  props.columns.forEach(col => {
    if (props.results.some(row => typeof row[col] === 'number' || (!isNaN(Number(row[col])) && row[col] !== null))) {
      columns.push(col);
    }
  });
  return columns.map(col => ({ title: col === 'count' ? 'Count' : col, value: col }));
});

const visualizationTypes = [
  { label: 'Bar', value: 'bar', icon: 'mdi-chart-bar', color: 'primary' },
  { label: 'Pie', value: 'pie', icon: 'mdi-chart-pie', color: 'secondary' },
  { label: 'Table', value: 'table', icon: 'mdi-table', color: 'tertiary' }
];

onMounted(() => {
  if (hasResults.value && props.columns.length > 0) {
    selectSmartColumns();
  }
});

watch(() => props.results, (newResults) => {
  if (newResults && newResults.length > 0 && isExpanded.value) {
    nextTick(() => {
      initCharts();
    });
  }

  // Set default X and Y axes when results change
  if (newResults && newResults.length > 0 && props.columns.length > 0) {
    if (!chartSettings.value.xAxis && availableColumns.value.length) {
      chartSettings.value.xAxis = props.columns[0];
    }
    if (!chartSettings.value.yAxis && availableNumericColumns.value.length) {
      chartSettings.value.yAxis = availableNumericColumns.value[0].value;
    }
  }
}, { deep: true });

// Update charts when visualization type changes
watch(selectedVisualization, () => {
  if (isExpanded.value && hasResults.value) {
    nextTick(() => {
      initCharts();
    });
  }
});

// Initialize all charts
const initCharts = () => {
  if (selectedVisualization.value === 'bar') {
    initBarChart();
  } else if (selectedVisualization.value === 'pie') {
    initPieChart();
  } else if (selectedVisualization.value === 'table') {
    initTable();
  }

  // Update dashboard widgets
  updateDashboardWidgets();
};

// Initialize bar chart
const initBarChart = () => {
  if (!barChart.value) return;

  const xAxis = chartSettings.value.xAxis || props.columns[0];
  const yAxis = chartSettings.value.yAxis || availableNumericColumns.value[0]?.value || props.columns[0];

  let chartData = [...props.results];

  let yMin = Infinity;
  let yMax = -Infinity;
  let yValues: number[] = [];

  if (yAxis === 'count') {
    const countMap = new Map();
    chartData.forEach(row => {
      const key = String(row[xAxis]);
      countMap.set(key, (countMap.get(key) || 0) + 1);
    });
    chartData = Array.from(countMap.entries()).map(([key, value]) => ({
      [xAxis]: key,
      count: value
    }));
    yValues = chartData.map(row => row.count);
  } else {
    yValues = chartData.map(row => {
      const value = row[yAxis];
      if (value === null || value === undefined) return 0;
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    });
  }

  yMin = Math.min(...yValues);
  yMax = Math.max(...yValues);

  const padding = (yMax - yMin) * 0.1;
  yMin = Math.max(0, yMin - padding);
  yMax = yMax + padding;

  yMin = Math.floor(yMin);
  yMax = Math.ceil(yMax);

  const range = yMax - yMin;
  let step = 1;
  if (range > 1000) step = 200;
  else if (range > 500) step = 100;
  else if (range > 100) step = 20;
  else if (range > 50) step = 10;
  else if (range > 20) step = 5;
  else if (range > 10) step = 2;

  const chart = echarts.init(barChart.value);
  chartInstances.value['bar'] = chart;

  const seriesData = chartData.map((row, index) => {
    const value = yAxis === 'count' ? row.count : yValues[index];
    return {
      value: value,
      itemStyle: {
        color: colorPalette[index % colorPalette.length]
      }
    };
  });

  chart.setOption({
    title: {
      text: yAxis === 'count' ? `Distribution of ${xAxis}` : `${yAxis} by ${xAxis}`,
      left: 'center',
      textStyle: {
        color: '#e0e0e0'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const value = params[0].value;
        return `${params[0].name}<br/>${yAxis === 'count' ? 'Nombre' : yAxis}: ${value.toLocaleString()}`;
      }
    },
    grid: {
      top: 40,
      left: 60,
      right: 20,
      bottom: 60,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(row => row[xAxis]),
      axisLabel: {
        color: '#e0e0e0',
        rotate: chartData.length > 10 ? 45 : 0,
        interval: 0,
        formatter: (value) => {
          if (typeof value === 'string' && value.length > 20) {
            return value.substring(0, 20) + '...';
          }
          return value;
        }
      }
    },
    yAxis: {
      type: 'value',
      name: yAxis === 'count' ? 'Number of occurrences' : yAxis,
      min: yMin,
      max: yMax,
      interval: step,
      axisLabel: {
        color: '#e0e0e0',
        formatter: (value) => {
          if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
          }
          if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k';
          }
          return value.toLocaleString();
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [{
      type: 'bar',
      data: seriesData,
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      barWidth: '60%',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.1)',
        borderRadius: [4, 4, 0, 0]
      }
    }],
    backgroundColor: 'transparent'
  });

  window.addEventListener('resize', () => {
    chart.resize();
  });
};

// Initialize pie chart
const initPieChart = () => {
  if (!pieChart.value) return;

  const xAxis = chartSettings.value.xAxis || props.columns[0];
  const yAxis = chartSettings.value.yAxis || availableNumericColumns.value[0]?.value || props.columns[0];

  let chartData = [...props.results];

  const groupedData = new Map();

  chartData.forEach(row => {
    const category = String(row[xAxis]);
    let value = 0;

    if (yAxis === 'count') {
      value = (groupedData.get(category) || 0) + 1;
    } else {
      const rawValue = row[yAxis];
      if (typeof rawValue === 'number') {
        value = rawValue;
      } else if (typeof rawValue === 'string') {
        value = parseFloat(rawValue) || 0;
      }
      value += (groupedData.get(category) || 0);
    }

    groupedData.set(category, value);
  });

  const pieData = Array.from(groupedData.entries()).map(([name, value]) => ({
    name,
    value
  }));

  pieData.sort((a, b) => b.value - a.value);

  const limit = chartSettings.value.limit;
  const limitedData = pieData.slice(0, limit);

  const total = limitedData.reduce((sum, item) => sum + item.value, 0);

  const chart = echarts.init(pieChart.value);
  chartInstances.value['pie'] = chart;

  chart.setOption({
    title: {
      text: yAxis === 'count' ? `Distribution of ${xAxis}` : `${yAxis} by ${xAxis}`,
      left: 'center',
      textStyle: {
        color: '#e0e0e0'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const percentage = ((params.value / total) * 100).toFixed(1);
        return `${params.name}<br/>${yAxis === 'count' ? 'Count' : yAxis}: ${params.value.toLocaleString()}<br/>(${percentage}%)`;
      }
    },
    legend: {
      show: chartSettings.value.showLegend,
      bottom: 0,
      textStyle: {
        color: '#e0e0e0'
      },
      type: 'scroll',
      orient: 'horizontal'
    },
    series: [
      {
        name: yAxis === 'count' ? 'Distribution' : yAxis,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: limitedData.map((item, index) => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: (params) => {
            const percentage = ((params.value / total) * 100).toFixed(1);
            return `${params.name}\n${percentage}%`;
          },
          color: '#e0e0e0'
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      }
    ],
    backgroundColor: 'transparent'
  });

  window.addEventListener('resize', () => {
    chart.resize();
  });
};

// Initialize table
const tableSearch = ref('');
const tableHeaders = ref<{ title: string; key: string; sortable: boolean; align: 'start' | 'end' | 'center' }[]>([]);
const tableItems = ref<Record<string, any>[]>([]);

const initTable = () => {
  if (!props.results || !props.results.length) return;

  const columns = props.columns.map(col => ({
    title: col,
    key: col,
    sortable: true,
    align: 'start' as const
  }));

  const items = props.results.map(row => {
    const item = { ...row };
    Object.keys(item).forEach(key => {
      if (item[key] === null) {
        item[key] = 'NULL';
      } else if (typeof item[key] === 'boolean') {
        item[key] = item[key] ? 'Oui' : 'Non';
      } else if (typeof item[key] === 'number') {
        item[key] = item[key].toLocaleString();
      } else if (typeof item[key] === 'string' && item[key].length > 50) {
        item[key] = {
          full: item[key],
          preview: item[key].substring(0, 50) + '...'
        };
      } else if (typeof item[key] === 'object' && item[key] !== null) {
        const jsonStr = JSON.stringify(item[key], null, 2);
        item[key] = {
          full: jsonStr,
          preview: jsonStr.length > 50 ? jsonStr.substring(0, 50) + '...' : jsonStr
        };
      }
    });
    return item;
  });

  tableHeaders.value = columns;
  tableItems.value = items;
};

// Update visualization based on changed settings
const updateVisualization = () => {
  if (!hasResults.value) return;

  nextTick(() => {
    initCharts();
  });
};

// Add a widget to dashboard
const addDashboardWidget = () => {
  if (!hasResults.value) return;

  const widget = {
    title: `Widget ${dashboardWidgets.value.length + 1}`,
    type: selectedVisualization.value,
    xAxis: chartSettings.value.xAxis,
    yAxis: chartSettings.value.yAxis,
    groupBy: chartSettings.value.groupBy
  };

  dashboardWidgets.value.push(widget);

  nextTick(() => {
    updateDashboardWidgets();
  });
};

// Remove a widget from dashboard
const removeWidget = (index) => {
  dashboardWidgets.value.splice(index, 1);
};

// Update all dashboard widgets
const updateDashboardWidgets = () => {
  nextTick(() => {
    dashboardWidgets.value.forEach((widget, index) => {
      const widgetRef = document.querySelector(`[ref="widget${index}"]`);
      if (!widgetRef) return;

      const chart = echarts.init(widgetRef as HTMLElement);
      chart.clear();

      const xAxis = widget.xAxis;
      const yAxis = widget.yAxis;
      const limit = 10; // Smaller limit for widgets

      let chartData = [...props.results].slice(0, limit);

      if (widget.type === 'pie') {
        const pieData = chartData.map(row => ({
          name: row[xAxis],
          value: Number(row[yAxis]) || 0
        }));

        chart.setOption({
          title: {
            text: widget.title,
            textStyle: {
              fontSize: 12,
              color: '#e0e0e0'
            },
            left: 'center',
            top: 5
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              type: 'pie',
              radius: '60%',
              center: ['50%', '55%'],
              data: pieData,
              label: {
                show: false
              }
            }
          ],
          backgroundColor: 'transparent'
        });
      } else if (widget.type === 'bar') {
        chart.setOption({
          title: {
            text: widget.title,
            textStyle: {
              fontSize: 12,
              color: '#e0e0e0'
            },
            left: 'center',
            top: 5
          },
          grid: {
            top: 30,
            left: 40,
            right: 10,
            bottom: 20
          },
          xAxis: {
            type: 'category',
            data: chartData.map(row => row[xAxis]),
            axisLabel: {
              color: '#e0e0e0',
              fontSize: 10
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#e0e0e0',
              fontSize: 10
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          series: [
            {
              data: chartData.map(row => Number(row[yAxis]) || 0),
              type: 'bar'
            }
          ],
          backgroundColor: 'transparent'
        });
      }

      window.addEventListener('resize', () => {
        chart.resize();
      });
    });
  });
};

// Download the current visualization
const downloadVisualization = () => {
  const chart = chartInstances.value[selectedVisualization.value];
  if (!chart) return;

  const url = chart.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#222'
  });

  const link = document.createElement('a');
  link.download = `sql-chart-${selectedVisualization.value}.png`;
  link.href = url;
  link.click();
};

// Analyse intelligente des données pour sélectionner les colonnes appropriées
const selectSmartColumns = () => {
  if (!props.results || !props.results.length) return;
  // X = première colonne catégorielle, Y = première numérique ou count
  const x = availableColumns.value.length ? availableColumns.value[0].value : '';
  const y = availableNumericColumns.value.length ? availableNumericColumns.value[0].value : '';
  chartSettings.value.xAxis = x;
  chartSettings.value.yAxis = y;
  nextTick(() => {
    initCharts();
  });
};

// Nouvelle fonction pour analyser la structure des données
const analyzeDataStructure = () => {
  if (!props.results.length || !props.columns.length) return;

  const columnAnalysis = props.columns.map(col => {
    const values = props.results.map(row => row[col]);
    const uniqueValues = new Set(values);
    const nonNullValues = values.filter(v => v !== null && v !== undefined);

    const isNumeric = nonNullValues.every(v => typeof v === 'number' || !isNaN(Number(v)));
    const isDate = nonNullValues.every(v => !isNaN(Date.parse(String(v))));
    const isBoolean = nonNullValues.every(v =>
      typeof v === 'boolean' ||
      ['true', 'false', '0', '1', 'yes', 'no'].includes(String(v).toLowerCase())
    );

    const stats = {
      uniqueCount: uniqueValues.size,
      nullCount: values.length - nonNullValues.length,
      isId: col.toLowerCase().includes('id') && uniqueValues.size === props.results.length,
      isNumeric,
      isDate,
      isBoolean,
      isCategorical: !isNumeric && !isDate && !isBoolean && uniqueValues.size < props.results.length * 0.5,
      isText: !isNumeric && !isDate && !isBoolean && !col.toLowerCase().includes('id'),
      hasPattern: detectPattern(values)
    };

    return { name: col, ...stats };
  });

  const numericColumns = columnAnalysis.filter(c => c.isNumeric);
  const dateColumns = columnAnalysis.filter(c => c.isDate);
  const categoricalColumns = columnAnalysis.filter(c => c.isCategorical);
  const textColumns = columnAnalysis.filter(c => c.isText);

  if (dateColumns.length > 0 && numericColumns.length > 0) {
    selectedVisualization.value = 'line';
    chartSettings.value.xAxis = dateColumns[0].name;
    chartSettings.value.yAxis = numericColumns[0].name;
  } else if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    selectedVisualization.value = 'bar';
    chartSettings.value.xAxis = categoricalColumns[0].name;
    chartSettings.value.yAxis = numericColumns[0].name;
  } else if (categoricalColumns.length > 0) {
    selectedVisualization.value = 'pie';
    chartSettings.value.xAxis = categoricalColumns[0].name;
    chartSettings.value.yAxis = 'count';
  } else if (numericColumns.length >= 2) {
    selectedVisualization.value = 'scatter';
    chartSettings.value.xAxis = numericColumns[0].name;
    chartSettings.value.yAxis = numericColumns[1].name;
  }

  prepareVisualizationData(columnAnalysis);
};

// Fonction pour détecter les patterns dans les données
const detectPattern = (values) => {
  if (values.length < 2) return null;

  const nonNullValues = values.filter(v => v !== null && v !== undefined);
  if (nonNullValues.length < 2) return null;

  const numericValues = nonNullValues.map(v => Number(v));
  if (numericValues.every(v => !isNaN(v))) {
    const differences: number[] = [];
    for (let i = 1; i < numericValues.length; i++) {
      differences.push(numericValues[i] - numericValues[i - 1]);
    }

    const isArithmetic = differences.every(d => d === differences[0]);
    if (isArithmetic) return 'arithmetic';

    const ratios: number[] = [];
    for (let i = 1; i < numericValues.length; i++) {
      if (numericValues[i - 1] !== 0) {
        ratios.push(numericValues[i] / numericValues[i - 1]);
      }
    }
    const isGeometric = ratios.every(r => r === ratios[0]);
    if (isGeometric) return 'geometric';
  }

  const uniqueValues = new Set(nonNullValues);
  if (uniqueValues.size < nonNullValues.length * 0.3) {
    return 'cyclic';
  }

  return null;
};

// Fonction pour préparer les données de visualisation
const prepareVisualizationData = (columnAnalysis) => {
  const xAxis = chartSettings.value.xAxis;
  const yAxis = chartSettings.value.yAxis;

  if (!xAxis || !yAxis) return;

  let processedData = [...props.results];

  switch (selectedVisualization.value) {
    case 'bar':
      if (yAxis === 'count') {
        const groupedData: Record<string, number> = {};
        processedData.forEach(row => {
          const key = row[xAxis];
          groupedData[key] = (groupedData[key] || 0) + 1;
        });
        processedData = Object.entries(groupedData).map(([key, value]: [string, number]) => ({
          [xAxis]: key,
          count: value
        }));
      }
      break;

    case 'line':
      if (columnAnalysis.find(c => c.name === xAxis)?.isDate) {
        processedData.sort((a, b) => new Date(a[xAxis]).getTime() - new Date(b[xAxis]).getTime());
      }
      break;

    case 'pie':
      const groupedData: Record<string, number> = {};
      processedData.forEach(row => {
        const key = row[xAxis];
        groupedData[key] = (groupedData[key] || 0) + 1;
      });
      const total: number = Object.values(groupedData).reduce((a: number, b: number) => a + b, 0);
      processedData = Object.entries(groupedData).map(([key, value]: [string, number]) => ({
        [xAxis]: key,
        percentage: (value / total) * 100
      }));
      break;
  }

  if (processedData.length > chartSettings.value.limit) {
    if (selectedVisualization.value === 'pie') {
      processedData.sort((a, b) => b.percentage - a.percentage);
    } else {
      const step = Math.ceil(processedData.length / chartSettings.value.limit);
      processedData = processedData.filter((_, i) => i % step === 0);
    }
  }

  updateChartData(processedData);
};

// Fonction pour mettre à jour les données du graphique
const updateChartData = (processedData) => {
  const chart = chartInstances.value[selectedVisualization.value];
  if (!chart) return;

  const xAxis = chartSettings.value.xAxis;
  const yAxis = chartSettings.value.yAxis;

  const options = {
    title: {
      text: generateChartTitle(),
      left: 'center',
      textStyle: {
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'bold'
      },
      top: 10
    },
    tooltip: {
      trigger: selectedVisualization.value === 'pie' ? 'item' : 'axis',
      formatter: generateTooltipFormatter(),
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#666',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      show: chartSettings.value.showLegend,
      bottom: 10,
      textStyle: {
        color: '#e0e0e0',
        fontSize: 12
      }
    },
    grid: {
      top: 60,
      left: 60,
      right: 40,
      bottom: 60,
      containLabel: true
    },
    xAxis: selectedVisualization.value !== 'pie' ? {
      type: 'category',
      data: processedData.map(row => row[xAxis]),
      axisLabel: {
        color: '#e0e0e0',
        rotate: processedData.length > 10 ? 45 : 0,
        fontSize: 12,
        margin: 15
      },
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisTick: {
        alignWithLabel: true
      }
    } : undefined,
    yAxis: selectedVisualization.value !== 'pie' ? {
      type: 'value',
      name: yAxis === 'count' ? 'Nombre d\'occurrences' : yAxis,
      nameTextStyle: {
        color: '#e0e0e0',
        fontSize: 12,
        padding: [0, 0, 0, 40]
      },
      axisLabel: {
        color: '#e0e0e0',
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(102, 102, 102, 0.3)'
        }
      }
    } : undefined,
    series: generateSeriesData(processedData).map(series => ({
      ...series,
      itemStyle: {
        borderRadius: 4
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    })),
    backgroundColor: 'transparent',
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicInOut'
  };

  chart.setOption(options);
};

// Fonction pour générer un titre de graphique pertinent
const generateChartTitle = () => {
  const xAxis = chartSettings.value.xAxis;
  const yAxis = chartSettings.value.yAxis;

  switch (selectedVisualization.value) {
    case 'bar':
      return yAxis === 'count'
        ? `Distribution de ${xAxis}`
        : `${yAxis} par ${xAxis}`;
    case 'line':
      return `Évolution de ${yAxis} dans le temps`;
    case 'pie':
      return `Répartition de ${xAxis}`;
    case 'scatter':
      return `Corrélation entre ${xAxis} et ${yAxis}`;
    default:
      return 'Visualisation des données';
  }
};

// Fonction pour générer le formateur de tooltip
const generateTooltipFormatter = () => {
  const xAxis = chartSettings.value.xAxis;
  const yAxis = chartSettings.value.yAxis;

  switch (selectedVisualization.value) {
    case 'pie':
      return '{b}: {c} ({d}%)';
    case 'bar':
    case 'line':
      return yAxis === 'count'
        ? `${xAxis}: {b}<br/>Nombre: {c}`
        : `${xAxis}: {b}<br/>${yAxis}: {c}`;
    case 'scatter':
      return `${xAxis}: {c[0]}<br/>${yAxis}: {c[1]}`;
    default:
      return '{b}: {c}';
  }
};

// Fonction pour générer les données de série
const generateSeriesData = (processedData) => {
  const xAxis = chartSettings.value.xAxis;
  const yAxis = chartSettings.value.yAxis;

  switch (selectedVisualization.value) {
    case 'bar':
      return [{
        type: 'bar',
        data: processedData.map((row, index) => ({
          value: yAxis === 'count' ? row.count : row[yAxis],
          itemStyle: {
            color: colorPalette[index % colorPalette.length]
          }
        })),
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        barWidth: '60%',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.1)',
          borderRadius: [4, 4, 0, 0]
        }
      }];
    case 'line':
      return [{
        type: 'line',
        smooth: true,
        data: processedData.map(row => row[yAxis]),
        lineStyle: {
          width: 3,
          color: '#5470c6'
        },
        itemStyle: {
          color: '#5470c6',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(84, 112, 198, 0.5)' },
            { offset: 1, color: 'rgba(84, 112, 198, 0.1)' }
          ])
        }
      }];
    case 'pie':
      return [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: processedData.map(row => ({
          name: row[xAxis],
          value: yAxis === 'count' ? row.count : row[yAxis]
        })),
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
          color: '#e0e0e0'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }];
    case 'scatter':
      return [{
        type: 'scatter',
        data: processedData.map(row => [row[xAxis], row[yAxis]]),
        symbolSize: 10,
        itemStyle: {
          color: '#5470c6',
          borderColor: '#fff',
          borderWidth: 2
        }
      }];
    default:
      return [];
  }
};

// New function for table visualization
const exportTable = () => {
  const separator = ';'; // Compatible Excel FR
  const headers = props.columns;
  const rows = props.results.map(row =>
    headers.map(col => {
      let value = row[col];
      if (value === null || value === undefined) value = '';
      if (typeof value === 'object') value = JSON.stringify(value);
      let str = String(value);
      if (str.length > 200) str = str.substring(0, 200) + '...';
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }).join(separator)
  );
  const csv = [headers.map(h => `"${h}"`).join(separator), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'export.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Ajouter dans la section script
const showContentDialog = ref(false);
const fullContent = ref('');

const showFullContent = (content: string) => {
  fullContent.value = content;
  showContentDialog.value = true;
  nextTick(() => {
    if (contentPre.value) {
      hljs.highlightElement(contentPre.value);
    }
  });
};
</script>

<style scoped>
.sql-result-visualizer {
  margin-bottom: 1rem;
}

.visualization-container {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.chart-wrapper {
  width: 100%;
}

.dashboard-widget {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.dashboard-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.content-pre {
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 4px;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #e0e0e0;
}

.table-container {
  width: 100%;
  max-width: 1150px;
  overflow-x: auto;
  background: var(--v-theme-surface);
  border-radius: 8px;
  position: relative;
}

:deep(.v-data-table) {
  width: fit-content;
  min-width: 100%;
}

:deep(.v-data-table__wrapper) {
  overflow-x: auto;
  width: 100%;
}

:deep(.v-data-table__td) {
  max-width: 300px;
  min-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 8px 16px;
  vertical-align: top;
}

:deep(.v-data-table__td .text-truncate) {
  display: inline-block;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

:deep(.v-data-table__th) {
  white-space: nowrap;
  background: var(--v-theme-surface);
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 8px 16px;
  min-width: 150px;
}

:deep(.v-data-table__top) {
  background: var(--v-theme-surface);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  position: sticky;
  top: 0;
  z-index: 2;
}

:deep(.v-data-table__footer) {
  position: sticky;
  bottom: 0;
  background: var(--v-theme-surface);
  z-index: 1;
}

:deep(.hljs) {
  background: transparent;
  padding: 0;
}
</style>