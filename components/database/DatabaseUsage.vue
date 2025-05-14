<template>
  <v-card class="rounded-lg" elevation="2">
    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
      <v-icon color="white" class="mr-2">mdi-database-check</v-icon>
      {{ t.databaseUsage.title }}
    </v-card-title>
    <v-card-text class="py-4">
      <v-alert v-if="!activeConnection" color="info" variant="tonal" class="mb-4">
        <div class="d-flex align-center">
          <v-avatar color="info" size="32" variant="tonal" class="mr-2">
            <v-icon>mdi-database-off</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-2">{{ t.databaseUsage.notConnected }}</div>
            <div class="text-body-2">{{ t.databaseUsage.connectToSeeUsage }}</div>
          </div>
        </div>
      </v-alert>

      <div v-else>
        <v-alert v-if="loading" color="info" variant="tonal" class="mb-4">
          <div class="d-flex align-center">
            <v-progress-circular indeterminate color="primary" size="24" class="mr-2"></v-progress-circular>
            <div class="text-subtitle-2">{{ t.databaseUsage.loadingUsageData }}</div>
          </div>
        </v-alert>

        <div v-else-if="error" class="text-center py-4">
          <v-icon color="error" size="48" class="mb-2">mdi-alert-circle</v-icon>
          <div class="text-h6 text-error">{{ t.databaseUsage.errorLoadingData }}</div>
          <div class="text-body-2 mb-4">{{ error }}</div>
          <v-btn color="primary" @click="fetchDatabaseUsage">{{ t.databaseUsage.retry }}</v-btn>
        </div>

        <div v-else>
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <div class="text-h6">{{ t.databaseUsage.totalSpace }}</div>
              <div class="text-h4 font-weight-bold">{{ totalSizeMB.toFixed(2) }} MB</div>
            </div>
            <v-btn color="primary" variant="tonal" @click="fetchDatabaseUsage" :loading="refreshing">
              <v-icon start>mdi-refresh</v-icon>
              {{ t.databaseUsage.refresh }}
            </v-btn>
          </div>

          <v-chart class="chart" :option="chartOption" autoresize />

          <v-divider class="my-4"></v-divider>

          <div class="text-h6 mb-2">{{ t.databaseUsage.topTables }}</div>
          <v-table density="compact" class="table-rounded">
            <thead>
              <tr>
                <th>{{ t.databaseUsage.table }}</th>
                <th class="text-right">{{ t.databaseUsage.size }}</th>
                <th class="text-right">{{ t.databaseUsage.percentage }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(table, index) in sortedTables.slice(0, 30)" :key="index">
                <td>{{ table.table_name }}</td>
                <td class="text-right">{{ table.size_mb.toFixed(2) }}</td>
                <td class="text-right">{{ ((table.size_mb / totalSizeMB) * 100).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import axios from 'axios';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { getColorByIndex } from '../../utils/database/function';
import { TableSize } from '../../utils/database/types';
import { useTranslations } from '../../languages';

const t = useTranslations('databaseManagement')();

use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

const props = defineProps<{
  activeConnection: any | null;
}>();

const loading = ref(false);
const refreshing = ref(false);
const error = ref<string | null>(null);
const tableData = ref<TableSize[]>([]);
const totalSizeMB = ref(0);

const sortedTables = computed(() => {
  return [...tableData.value].sort((a, b) => b.size_mb - a.size_mb);
});

const chartOption = computed(() => {
  const chartData = tableData.value.slice(0, 30).map((table, index) => ({
    name: table.table_name,
    value: table.size_mb,
    itemStyle: {
      color: getColorByIndex(index)
    }
  }));

  if (tableData.value.length > 30) {
    const otherTablesSize = tableData.value.slice(30).reduce((sum, table) => sum + table.size_mb, 0);
    chartData.push({
      name: 'Autres tables',
      value: otherTablesSize,
      itemStyle: {
        color: '#9C27B0'
      }
    });
  }

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} MB ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'middle',
      type: 'scroll',
      formatter: (name) => {
        const displayName = name.length > 20 ? name.substring(0, 20) + '...' : name;
        return displayName;
      }
    },
    series: [
      {
        name: 'Utilisation de l\'espace',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  };
});

const fetchDatabaseUsage = async () => {
  if (!props.activeConnection) return;

  loading.value = true;
  error.value = null;
  refreshing.value = true;

  try {
    const sizeQuery = props.activeConnection.type === 'mysql'
      ? `SELECT 
          TABLE_NAME AS table_name,
          ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS size_mb
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC`
      : props.activeConnection.type === 'postgres'
        ? `SELECT
            table_name,
            pg_table_size(quote_ident(table_name)) / 1024.0 / 1024.0 AS size_mb
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY size_mb DESC`
        : '';

    if (!sizeQuery) {
      error.value = "Type de base de données non supporté pour l'analyse d'espace";
      loading.value = false;
      refreshing.value = false;
      return;
    }

    const sizeResponse = await axios.post('/api/database/query', {
      connectionId: props.activeConnection.id,
      query: sizeQuery
    });

    if (sizeResponse.data.success && Array.isArray(sizeResponse.data.results)) {
      tableData.value = sizeResponse.data.results.map((row: any) => ({
        table_name: row.table_name,
        size_mb: parseFloat(row.size_mb) || 0
      }));

      totalSizeMB.value = tableData.value.reduce((sum, table) => sum + table.size_mb, 0);

      if (totalSizeMB.value === 0) {
        tableData.value = tableData.value.map((table) => ({
          ...table,
          size_mb: 1
        }));

        totalSizeMB.value = tableData.value.length;
      }
    } else {
      error.value = sizeResponse.data.message || "Erreur lors de la récupération des données de taille";
    }
  } catch (err: any) {
    error.value = err.message || "Une erreur s'est produite";
    console.error("Erreur lors de la récupération des données d'utilisation:", err);
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

watch(() => props.activeConnection, (newVal) => {
  if (newVal) {
    fetchDatabaseUsage();
  } else {
    tableData.value = [];
    totalSizeMB.value = 0;
  }
}, { immediate: true });
</script>

<style scoped>
.table-rounded {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.chart {
  height: 300px;
  width: 100%;
}
</style>