<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-6">
        <v-row>
          <v-col cols="12">
            <v-card class="rounded-lg" elevation="2">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-chart-box</v-icon>
                <span>Tableau de bord analytique</span>
                <v-spacer></v-spacer>
                <v-btn color="white" variant="text" @click="refreshData" :loading="loading">
                  <v-icon>mdi-refresh</v-icon>
                  Rafraîchir
                </v-btn>
              </v-card-title>

              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-text>
                        <div class="text-h6 mb-2">Visiteurs uniques</div>
                        <div class="text-h4">{{ analyticsData.uniqueVisitors }}</div>
                        <div class="text-caption text-grey">
                          +{{ analyticsData.visitorGrowth }}% vs mois dernier
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-text>
                        <div class="text-h6 mb-2">Pages vues</div>
                        <div class="text-h4">{{ analyticsData.pageViews }}</div>
                        <div class="text-caption text-grey">
                          Moyenne: {{ analyticsData.avgPagesPerVisit }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-text>
                        <div class="text-h6 mb-2">Temps moyen</div>
                        <div class="text-h4">{{ analyticsData.avgTimeOnSite }}s</div>
                        <div class="text-caption text-grey">
                          Taux de rebond: {{ analyticsData.bounceRate }}%
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-text>
                        <div class="text-h6 mb-2">Taux de conversion</div>
                        <div class="text-h4">{{ analyticsData.conversionRate }}%</div>
                        <div class="text-caption text-grey">
                          Objectif: {{ analyticsData.conversionGoal }}
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="8">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-chart-line</v-icon>
                        Trafic par jour
                      </v-card-title>
                      <v-card-text>
                        <v-chart class="chart" :option="trafficChartOption" autoresize />
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-map-marker</v-icon>
                        Répartition géographique
                      </v-card-title>
                      <v-card-text>
                        <v-chart class="chart" :option="geoChartOption" autoresize />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-web</v-icon>
                        Pages les plus visitées
                      </v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item v-for="page in analyticsData.topPages" :key="page.url">
                            <v-list-item-title>{{ page.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ page.url }}</v-list-item-subtitle>
                            <template v-slot:append>
                              <v-chip size="small" color="primary">{{ page.views }} vues</v-chip>
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-devices</v-icon>
                        Appareils utilisés
                      </v-card-title>
                      <v-card-text>
                        <v-chart class="chart" :option="devicesChartOption" autoresize />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-account-group</v-icon>
                        Comportement des utilisateurs
                      </v-card-title>
                      <v-card-text>
                        <v-data-table :headers="behaviorHeaders" :items="analyticsData.userBehavior" :items-per-page="5"
                          class="elevation-1">
                          <template v-slot:item.percentage="{ item }">
                            <v-progress-linear :model-value="item.percentage" :color="getBehaviorColor(item.type)"
                              height="20">
                              <template v-slot:default>
                                <strong>{{ item.percentage }}%</strong>
                              </template>
                            </v-progress-linear>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { Component } from 'vue';
import { defineAsyncComponent, onMounted, ref } from 'vue';

definePageMeta({
  layout: 'dashboard'
})

interface TopPage {
  url: string;
  title: string;
  views: number;
}

interface UserBehavior {
  type: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  uniqueVisitors: number;
  visitorGrowth: number;
  pageViews: number;
  avgPagesPerVisit: number;
  avgTimeOnSite: number;
  bounceRate: number;
  conversionRate: number;
  conversionGoal: string;
  topPages: TopPage[];
  userBehavior: UserBehavior[];
}

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
]);

const userStore = useUserStore();
const loading = ref(false);

const analyticsData = ref<AnalyticsData>({
  uniqueVisitors: 0,
  visitorGrowth: 0,
  pageViews: 0,
  avgPagesPerVisit: 0,
  avgTimeOnSite: 0,
  bounceRate: 0,
  conversionRate: 0,
  conversionGoal: '5%',
  topPages: [],
  userBehavior: []
});

const trafficChartOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line',
    smooth: true
  }]
});

const geoChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    type: 'pie',
    radius: '50%',
    data: []
  }]
});

const devicesChartOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    type: 'pie',
    radius: '50%',
    data: []
  }]
});

const behaviorHeaders = [
  { title: 'Comportement', key: 'type' },
  { title: 'Nombre d\'utilisateurs', key: 'count' },
  { title: 'Pourcentage', key: 'percentage' }
];

const getBehaviorColor = (type: string) => {
  const colors: Record<string, string> = {
    'Nouveau visiteur': 'primary',
    'Retour': 'success',
    'Conversion': 'info',
    'Abandon': 'error'
  };
  return colors[type] || 'grey';
};

const fetchAnalyticsData = async () => {
  try {
    loading.value = true;
    const token = userStore.getTokenFromCookie();

    const url = '/api/analytics';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données analytiques');
    }

    const data = await response.json();
    console.log(data);
    analyticsData.value = {
      uniqueVisitors: data.uniqueVisitors || 0,
      visitorGrowth: data.visitorGrowth || 0,
      pageViews: data.pageViews || 0,
      avgPagesPerVisit: data.avgPagesPerVisit || 0,
      avgTimeOnSite: data.avgTimeOnSite || 0,
      bounceRate: data.bounceRate || 0,
      conversionRate: data.conversionRate || 0,
      conversionGoal: '5%',
      topPages: data.topPages || [],
      userBehavior: data.userBehavior || []
    };

    if (data.traffic && data.traffic.length > 0) {
      trafficChartOption.value.xAxis.data = data.traffic.map((item: any) => item.date);
      trafficChartOption.value.series[0].data = data.traffic.map((item: any) => item.count);
    }

    if (data.geographicDistribution && data.geographicDistribution.length > 0) {
      geoChartOption.value.series[0].data = data.geographicDistribution.map((item: any) => ({
        name: item.country,
        value: item.count
      }));
    }

    if (data.deviceUsage && data.deviceUsage.length > 0) {
      devicesChartOption.value.series[0].data = data.deviceUsage.map((item: any) => ({
        name: item.deviceType,
        value: item.count
      }));
    }
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    loading.value = false;
  }
};

const refreshData = () => {
  fetchAnalyticsData();
};

const VChart = defineAsyncComponent<Component>(() => {
  return new Promise((resolve) => {
    if (process.client) {
      import('vue-echarts').then((module) => {
        resolve(module.default);
      });
    } else {
      resolve({ template: '<div></div>' } as Component);
    }
  });
});

onMounted(() => {
  fetchAnalyticsData();
  console.log(analyticsData.value);
});
</script>

<style scoped>
.chart {
  height: 300px;
}
</style>