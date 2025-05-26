<template>
  <div class="world-map-viewer">
    <div class="viewer-header d-flex align-center mb-4">
      <h3 class="text-subtitle-1 font-weight-medium mb-0">
        <v-icon color="primary" class="mr-2">mdi-earth</v-icon>
        {{ t.worldMap.title || 'Visiteurs dans le monde' }}
      </h3>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <v-chip v-if="period && period !== 'all'" color="primary" variant="outlined" size="small" class="mr-3">
          <v-icon start size="x-small">mdi-clock-outline</v-icon>
          <span v-if="period === '7d'">{{ t.analytics?.last7days || 'Derniers 7 jours' }}</span>
          <span v-else-if="period === '30d'">{{ t.analytics?.last30days || 'Derniers 30 jours' }}</span>
          <span v-else-if="period === '90d'">{{ t.analytics?.last90days || 'Derniers 90 jours' }}</span>
        </v-chip>
        <v-btn-toggle v-model="mapView" density="comfortable" color="primary" mandatory class="elevation-1">
          <v-btn value="map" size="small">
            <v-icon size="small">mdi-map</v-icon>
            <v-tooltip activator="parent">Carte</v-tooltip>
          </v-btn>
          <v-btn value="table" size="small">
            <v-icon size="small">mdi-table</v-icon>
            <v-tooltip activator="parent">Tableau</v-tooltip>
          </v-btn>
          <v-btn value="cities" size="small">
            <v-icon size="small">mdi-city</v-icon>
            <v-tooltip activator="parent">Villes</v-tooltip>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mt-2">{{ 'Loading...' }}</div>
    </div>

    <div v-else-if="!haveData" class="text-center py-8">
      <v-icon icon="mdi-earth" size="64" color="grey-darken-1" class="mb-4"></v-icon>
      <h3 class="text-h6 text-grey-darken-1">{{ t.worldMap.noData }}</h3>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" :md="mapView === 'map' ? 12 : 8">
          <v-card v-if="mapView === 'map'" variant="outlined" class="mb-6 map-card">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-2">
                <div class="text-subtitle-2">{{ t.worldMap.globalDistribution || 'Distribution mondiale des visiteurs'
                }}</div>
                <v-spacer></v-spacer>
                <v-chip size="x-small" color="primary" variant="outlined" class="mr-2">
                  <v-icon start size="x-small">mdi-account-group</v-icon>
                  {{ totalVisitors }} visiteurs
                </v-chip>
                <v-btn icon="mdi-refresh" size="x-small" variant="text" @click="refreshMap" :loading="isRefreshing"
                  :disabled="isRefreshing">
                  <v-tooltip activator="parent">Rafraîchir les données</v-tooltip>
                </v-btn>
              </div>
              <v-chart class="world-map-chart" :option="chartOption" autoresize />

              <div class="d-flex align-center justify-space-between mt-2">
                <div class="d-flex align-center">
                  <div class="color-scale mr-2"></div>
                  <div class="text-caption">Échelle: 0 à {{ maxVisitors }} visiteurs</div>
                </div>
                <div class="text-caption text-medium-emphasis">
                  <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
                  Déplacez la carte avec la souris et utilisez les boutons pour zoomer
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card v-if="mapView === 'table'" variant="outlined" class="mb-6">
            <v-card-title class="py-3 px-4 text-subtitle-1 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-flag</v-icon>
              <span>{{ t.worldMap.allCountries || 'Tous les pays' }}</span>
              <v-spacer></v-spacer>
              <v-text-field v-model="searchCountry" prepend-inner-icon="mdi-magnify" label="Rechercher un pays"
                hide-details density="compact" variant="outlined" class="max-width-200"></v-text-field>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table :headers="countryHeaders" :items="allCountries" :search="searchCountry" :items-per-page="10"
                density="comfortable">
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-2">
                      <img :src="`https://flagcdn.com/24x18/${item.code.toLowerCase()}.png`" :alt="item.name">
                    </v-avatar>
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:item.percentage="{ item }">
                  <div class="d-flex align-center">
                    <v-progress-linear :model-value="item.percentage" :color="getColorByPercentage(item.percentage)"
                      height="6" rounded class="mr-2" style="width: 60px;"></v-progress-linear>
                    {{ item.percentage.toFixed(1) }}%
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>

          <v-card v-if="mapView === 'cities'" variant="outlined" class="mb-6">
            <v-card-title class="py-3 px-4 text-subtitle-1 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-city</v-icon>
              <span>{{ t.worldMap.cities || 'Villes' }}</span>
              <v-spacer></v-spacer>
              <v-text-field v-model="searchCity" prepend-inner-icon="mdi-magnify" label="Rechercher une ville"
                hide-details density="compact" variant="outlined" class="max-width-200"></v-text-field>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
              <v-data-table :headers="cityHeaders" :items="cities" :search="searchCity" :items-per-page="10"
                density="comfortable">
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="info" class="mr-2">mdi-map-marker</v-icon>
                    {{ item.name }}
                  </div>
                </template>
                <template v-slot:item.country="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="20" class="mr-2">
                      <img :src="`https://flagcdn.com/24x18/${item.countryCode.toLowerCase()}.png`" :alt="item.country">
                    </v-avatar>
                    {{ item.country }}
                  </div>
                </template>
                <template v-slot:item.coordinates="{ item }">
                  <span class="text-caption">
                    {{ typeof item.latitude === 'number' ? item.latitude.toFixed(4) : 'N/A' }},
                    {{ typeof item.longitude === 'number' ? item.longitude.toFixed(4) : 'N/A' }}
                  </span>
                </template>
                <template v-slot:item.visitors="{ item }">
                  <v-chip size="small" :color="getColorByPercentage(item.percentage)" variant="tonal">
                    {{ item.visitors }}
                  </v-chip>
                </template>
                <template v-slot:item.percentage="{ item }">
                  <div class="d-flex align-center">
                    <v-progress-linear :model-value="item.percentage" :color="getColorByPercentage(item.percentage)"
                      height="6" rounded class="mr-2" style="width: 60px;"></v-progress-linear>
                    {{ item.percentage.toFixed(1) }}%
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="mapView === 'table' || mapView === 'cities'" cols="12" md="4">
          <v-card variant="outlined" class="h-100">
            <v-card-title class="py-3 px-4 text-subtitle-1 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-chart-pie</v-icon>
              <span>{{ t.worldMap.distribution || 'Distribution par région' }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-chart class="region-chart" :option="regionChartOption" autoresize style="height: 300px;" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card variant="outlined" class="mb-6">
        <v-card-title class="py-3 px-4 text-subtitle-1 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-podium</v-icon>
          <span>{{ t.worldMap.topCountries || 'Pays principaux' }}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <v-table>
            <thead>
              <tr>
                <th>{{ t.worldMap.country || 'Pays' }}</th>
                <th class="text-center">{{ t.worldMap.visits || 'Visites' }}</th>
                <th class="text-center">{{ t.worldMap.percentage || 'Pourcentage' }}</th>
                <th class="text-center">{{ t.worldMap.trend || 'Tendance' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(country, index) in topCountries" :key="index">
                <td>
                  <div class="d-flex align-center">
                    <div class="rank-indicator" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
                    <v-avatar size="24" class="mx-2">
                      <img :src="`https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`" :alt="country.name">
                    </v-avatar>
                    {{ country.name }}
                  </div>
                </td>
                <td class="text-center">
                  <v-chip size="small" :color="getColorByPercentage(country.percentage)" variant="tonal">
                    {{ country.value }}
                  </v-chip>
                </td>
                <td class="text-center">
                  <v-progress-linear :model-value="country.percentage" :color="getColorByPercentage(country.percentage)"
                    height="6" rounded class="mt-1 mx-auto" style="max-width: 120px;"></v-progress-linear>
                  {{ country.percentage.toFixed(1) }}%
                </td>
                <td class="text-center">
                  <v-icon :color="getTrendColor(country.trend)" size="small">
                    {{ getTrendIcon(country.trend) }}
                  </v-icon>
                  <span class="text-caption ml-1" :class="getTrendColorClass(country.trend)">
                    {{ country.trend !== undefined ? (country.trend > 0 ? '+' : '') + country.trend + '%' : 'N/A' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <v-card variant="outlined" class="stats-card">
        <v-card-title class="py-3 px-4 text-subtitle-1">
          <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
          {{ t.worldMap.stats || 'Statistiques globales' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <div class="stat-box">
                <div class="stat-title">
                  <v-icon color="primary" size="small" class="mr-1">mdi-earth</v-icon>
                  {{ t.worldMap.countriesCount || 'Pays' }}
                </div>
                <div class="stat-value">{{ allCountries.length }}</div>
                <div class="stat-subtitle">{{ t.worldMap.uniqueCountries || 'pays uniques' }}</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="stat-box">
                <div class="stat-title">
                  <v-icon color="success" size="small" class="mr-1">mdi-account-group</v-icon>
                  {{ t.worldMap.totalVisitors || 'Total visiteurs' }}
                </div>
                <div class="stat-value">{{ totalVisitors }}</div>
                <div class="stat-subtitle">{{ t.worldMap.allTime || 'tous temps confondus' }}</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="stat-box">
                <div class="stat-title">
                  <v-icon color="info" size="small" class="mr-1">mdi-map-marker</v-icon>
                  {{ t.worldMap.topRegion || 'Région principale' }}
                </div>
                <div class="stat-value">{{ topRegion.name }}</div>
                <div class="stat-subtitle">{{ topRegion.percentage.toFixed(1) }}% {{ t.worldMap.ofVisitors ||
                  'des visiteurs'
                }}</div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <div class="stat-box">
                <div class="stat-title">
                  <v-icon color="warning" size="small" class="mr-1">mdi-trending-up</v-icon>
                  {{ t.worldMap.growthRate || 'Taux de croissance' }}
                </div>
                <div class="stat-value" :class="{ 'text-success': growthRate > 0, 'text-error': growthRate < 0 }">
                  {{ growthRate > 0 ? '+' : '' }}{{ growthRate }}%
                </div>
                <div class="stat-subtitle">{{ t.worldMap.compared || 'par rapport à la période précédente' }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapChart, PieChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, onMounted, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { useTranslations } from '../../languages';

use([
  CanvasRenderer,
  MapChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  ToolboxComponent,
  LegendComponent
]);

const props = defineProps<{
  websiteId: string;
  period?: string;
}>();

const t = useTranslations('analytics')();
const isLoading = ref(true);
const isRefreshing = ref(false);
const mapData = ref<any[]>([]);
const worldMap = ref<any>(null);
const mapView = ref('map');
const searchCountry = ref('');
const searchCity = ref('');

const haveData = ref(true);

interface CountryData {
  name: string;
  code: string;
  value: number;
  percentage: number;
  trend?: number;
  region?: string;
}

interface RegionData {
  name: string;
  value: number;
  percentage: number;
}

interface CityData {
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  visitors: number;
  percentage: number;
}

const topCountries = ref<CountryData[]>([]);
const allCountries = ref<CountryData[]>([]);
const regions = ref<RegionData[]>([]);
const cities = ref<CityData[]>([]);
const totalVisitors = ref(0);
const maxVisitors = ref(3000);
const growthRate = ref(12.5);

const countryHeaders = [
  { title: 'Countries', key: 'name', sortable: true },
  { title: 'Views', key: 'value', sortable: true, align: 'center' as const },
  { title: 'Value', key: 'percentage', sortable: true, align: 'center' as const }
];

const cityHeaders = [
  { title: 'City', key: 'name', sortable: true },
  { title: 'Countries', key: 'country', sortable: true },
  { title: 'Data', key: 'coordinates', sortable: false },
  { title: 'Views', key: 'visitors', sortable: true, align: 'center' as const },
  { title: 'Value', key: 'percentage', sortable: true, align: 'center' as const }
];

const topRegion = computed(() => {
  if (regions.value.length === 0) {
    return { name: 'Europe', percentage: 0 };
  }
  return regions.value.reduce((prev, current) => (prev.value > current.value) ? prev : current);
});

const chartOption = computed(() => {
  return {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `${params.name}: ${params.value || 0} ${t.worldMap.visitors || 'visiteurs'}`;
      }
    },
    visualMap: {
      min: 0,
      max: maxVisitors.value,
      text: ['Élevé', 'Faible'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#f3f5ff', '#2196F3', '#1565C0']
      },
      textStyle: {
        color: '#888'
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        restore: { title: 'Réinitialiser' },
        saveAsImage: { title: 'Enregistrer' }
      }
    },
    series: [
      {
        name: t.worldMap.visitors || 'Visiteurs',
        type: 'map',
        map: 'world',
        roam: 'move',
        scaleLimit: {
          min: 1,
          max: 5
        },
        emphasis: {
          label: {
            show: true
          },
          itemStyle: {
            areaColor: '#4FC3F7',
            borderColor: '#fff'
          }
        },
        data: mapData.value
      }
    ]
  };
});

// Graphique de répartition par région
const regionChartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      type: 'scroll',
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Régions',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: regions.value.map(region => ({
          name: region.name,
          value: region.value
        }))
      }
    ]
  };
});

function getColorByPercentage(percentage: number): string {
  if (percentage > 40) return 'primary';
  if (percentage > 20) return 'info';
  if (percentage > 10) return 'success';
  if (percentage > 5) return 'warning';
  return 'error';
}

function getTrendColor(trend: number | undefined): string {
  if (trend === undefined) return 'grey';
  if (trend > 10) return 'success';
  if (trend > 0) return 'info';
  if (trend > -10) return 'warning';
  return 'error';
}

function getTrendColorClass(trend: number | undefined): string {
  if (trend === undefined) return 'text-medium-emphasis';
  if (trend > 10) return 'text-success';
  if (trend > 0) return 'text-info';
  if (trend > -10) return 'text-warning';
  return 'text-error';
}

function getTrendIcon(trend: number | undefined): string {
  if (trend === undefined) return 'mdi-minus';
  if (trend > 10) return 'mdi-trending-up';
  if (trend > 0) return 'mdi-trending-up';
  if (trend > -10) return 'mdi-trending-down';
  return 'mdi-trending-down';
}

async function fetchMapData() {
  isLoading.value = true;

  try {
    const periodParam = props.period ? `period=${props.period}` : '';
    const response = await fetch(`/api/analytics/website/${props.websiteId}/geography?${periodParam}`);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
    }

    const result = await response.json();

    try {
      const echarts = await import('echarts');
      const worldJson = await fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95368/world.json').then(res => res.json());
      echarts.registerMap('world', worldJson);

      if (result.success && result.data && result.data.countries) {
        mapData.value = result.data.countries.map(country => ({
          name: country.name,
          value: country.visitors,
          code: country.code,
          percentage: country.percentage,
          trend: country.trend || 0,
          region: country.region
        }));

        allCountries.value = mapData.value;
        topCountries.value = [...mapData.value].sort((a, b) => b.value - a.value).slice(0, 5);
        totalVisitors.value = result.data.totalVisitors || mapData.value.reduce((sum, country) => sum + country.value, 0);
        maxVisitors.value = Math.max(...mapData.value.map(country => country.value));

        if (result.data.cities && Array.isArray(result.data.cities)) {
          cities.value = result.data.cities.map(city => ({
            name: city.name,
            country: city.country,
            countryCode: city.countryCode,
            latitude: city.latitude,
            longitude: city.longitude,
            visitors: city.visitors,
            percentage: city.percentage
          }));
        } else {
        }

        const regionMap = new Map<string, number>();
        mapData.value.forEach(country => {
          if (country.region) {
            if (!regionMap.has(country.region)) {
              regionMap.set(country.region, 0);
            }
            const currentValue = regionMap.get(country.region) || 0;
            regionMap.set(country.region, currentValue + country.value);
          }
        });

        regions.value = Array.from(regionMap.entries()).map(([name, value]) => ({
          name,
          value,
          percentage: (value / totalVisitors.value) * 100
        }));

        growthRate.value = result.data.growthRate || 0;

        haveData.value = mapData.value.length > 0;
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la carte du monde:', err);
      haveData.value = false;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données géographiques:', error);
    haveData.value = false;
  } finally {
    isLoading.value = false;
  }
}

async function refreshMap() {
  isRefreshing.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  isRefreshing.value = false;
}

onMounted(async () => {
  await fetchMapData();
});

watch(() => props.period, async () => {
  await fetchMapData();
});
</script>

<style scoped>
.world-map-viewer {
  width: 100%;
}

.world-map-chart {
  height: 500px;
  width: 100%;
}

.region-chart {
  height: 300px;
  width: 100%;
}

.map-card {
  position: relative;
}

.color-scale {
  width: 100px;
  height: 10px;
  background: linear-gradient(to right, #f3f5ff, #2196F3, #1565C0);
  border-radius: 5px;
}

.rank-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.rank-1 {
  background-color: #FFD700;
}

.rank-2 {
  background-color: #C0C0C0;
}

.rank-3 {
  background-color: #CD7F32;
}

.rank-4,
.rank-5 {
  background-color: #607D8B;
}

.stat-box {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
  height: 100%;
}

.stat-title {
  font-size: 14px;
  color: var(--v-medium-emphasis-color);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-subtitle {
  font-size: 12px;
  color: var(--v-medium-emphasis-color);
}

.max-width-200 {
  max-width: 200px;
}

.text-success {
  color: rgb(76, 175, 80);
}

.text-error {
  color: rgb(244, 67, 54);
}

.text-info {
  color: rgb(33, 150, 243);
}

.text-warning {
  color: rgb(255, 152, 0);
}
</style>