<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold mb-4">
              {{ t.title }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-6">
              {{ t.description }}
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-4">
              <v-card-title class="text-h5">
                <v-icon class="mr-2">mdi-eye-outline</v-icon>
                {{ t.title }}
              </v-card-title>
              <v-card-text>
                <p>
                  {{ t.description }}
                </p>

                <v-btn color="secondary" class="mt-4" prepend-icon="mdi-plus" @click="showAddSiteDialog = true">
                  {{ t.addSite }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-alert v-if="websites.length === 0" type="info" variant="tonal" class="mt-4">
            {{ t.noSites }}
          </v-alert>
        </v-row>

        <v-row v-if="websites.length > 0">
          <v-col cols="12" md="6" lg="4" v-for="site in websites" :key="site.id">
            <v-card class="mb-4">
              <v-card-title>
                {{ site.name }}
              </v-card-title>
              <v-card-subtitle>
                {{ site.url }}
              </v-card-subtitle>
              <v-card-text>
                <p class="text-caption">{{ t.addedAt }} {{ formatDate(site.addedAt) }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="tonal" color="secondary" @click="selectSite(site)">
                  {{ t.viewAnalytics }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="showCodeDialog" max-width="800px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">
            <v-icon class="mr-2">mdi-code-tags</v-icon>
            {{ t.tracking.trackingCode }}
          </v-card-title>
          <v-card-text>
            <p class="mb-4">
              {{ t.tracking.trackingCodeDescription ||
                'Ajoutez ce code juste avant la balise de fermeture </body>'
                + ' de votre site web pour commencer à collecter des données.' }}
            </p>
            <pre id="code" class="bg-surface pa-2 rounded"></pre>
            <v-btn class="mt-2" prepend-icon="mdi-content-copy" variant="outlined" size="small"
              @click="copyTrackingCode(currentSite?.id || '')">
              {{ t.tracking.copyCode || 'Copier le code' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showAddSiteDialog" max-width="600px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">
            <v-icon class="mr-2">mdi-web-plus</v-icon>
            {{ t.addSite }}
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addWebsite">
              <v-text-field v-model="newSite.name" prepend-icon="mdi-domain" :label="t.name"
                :placeholder="t.form.namePlaceholder" variant="outlined" class="mb-4"
                :rules="[v => !!v || t.form.nameRequired]"></v-text-field>

              <v-text-field v-model="newSite.url" prepend-icon="mdi-web" :label="t.url"
                :placeholder="t.form.urlPlaceholder" variant="outlined" class="mb-4" :rules="[
                  v => !!v || t.urlRequired,
                  v => /^https?:\/\//.test(v) || t.urlMustStartWithHttp
                ]"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showAddSiteDialog = false">
              {{ t.cancel }}
            </v-btn>
            <v-btn color="secondary" variant="tonal" @click="addWebsite" :disabled="!isFormValid">
              {{ t.add }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showAnalyticsDialog" fullscreen>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon @click="showAnalyticsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ t.analyticsFor }} {{ currentSite?.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-0">
            <div v-if="currentSite" class="pa-4">
              <v-row>
                <v-col cols="12" md="6" lg="3" v-for="(metric, index) in metrics" :key="index">
                  <v-card class="h-100">
                    <v-card-text class="d-flex flex-column align-center text-center">
                      <v-avatar :color="metric.color" size="50" class="mb-3">
                        <v-icon>{{ metric.icon }}</v-icon>
                      </v-avatar>
                      <span class="text-h5 font-weight-bold">{{ metric.value }}</span>
                      <span class="text-subtitle-2 text-medium-emphasis">{{ metric.label }}</span>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-card class="mt-4">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                  {{ t.mostVisitedPages }}
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-table>
                    <thead>
                      <tr>
                        <th>{{ t.page }}</th>
                        <th class="text-right">{{ t.views }}</th>
                        <th class="text-right">{{ t.avgTime }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="page in pageViews" :key="page.page">
                        <td>
                          <div class="d-flex align-center">
                            <v-icon size="small" class="mr-2">mdi-file-document-outline</v-icon>
                            {{ page.page }}
                          </div>
                        </td>
                        <td class="text-right">{{ page.views }}</td>
                        <td class="text-right">{{ page.avgTime }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>

              <v-card class="mt-4">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-traffic-light</v-icon>
                  {{ t.analytics.trafficSources || 'Sources de trafic' }}
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-table>
                        <thead>
                          <tr>
                            <th>{{ t.analytics.source || 'Source' }}</th>
                            <th class="text-right">{{ t.analytics.visitors || 'Visiteurs' }}</th>
                            <th class="text-right">{{ t.analytics.percentage || 'Pourcentage' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="source in trafficSources" :key="source.source">
                            <td>
                              <div class="d-flex align-center">
                                <v-icon size="small" class="mr-2" :color="getSourceColor(source.source)">
                                  {{ getSourceIcon(source.source) }}
                                </v-icon>
                                {{ source.source }}
                              </div>
                            </td>
                            <td class="text-right">{{ source.visitors }}</td>
                            <td class="text-right">{{ source.percentage }}%</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="chart-container" style="position: relative; height: 200px;">
                        <div class="text-center text-caption">
                          {{ t.analytics.trafficDistribution || 'Répartition du trafic' }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mt-4">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-devices</v-icon>
                  {{ t.analytics.deviceStats || 'Statistiques par appareil' }}
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-table>
                        <thead>
                          <tr>
                            <th>{{ t.analytics.deviceType || 'Type d\'appareil' }}</th>
                            <th class="text-right">{{ t.analytics.count || 'Nombre' }}</th>
                            <th class="text-right">{{ t.analytics.percentage || 'Pourcentage' }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="device in deviceStats" :key="device.type">
                            <td>
                              <div class="d-flex align-center">
                                <v-icon size="small" class="mr-2">
                                  {{ getDeviceIcon(device.type) }}
                                </v-icon>
                                {{ getDeviceLabel(device.type) }}
                              </div>
                            </td>
                            <td class="text-right">{{ device.count }}</td>
                            <td class="text-right">{{ device.percentage }}%</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="chart-container" style="position: relative; height: 200px;">
                        <!-- Emplacement pour le graphique en camembert -->
                        <div class="text-center text-caption">
                          {{ t.analytics.deviceDistribution || 'Répartition des appareils' }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mt-4">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-map-marker-path</v-icon>
                  {{ t.analytics.userFlows || 'Parcours utilisateurs' }}
                </v-card-title>
                <v-card-text>
                  <v-table>
                    <thead>
                      <tr>
                        <th>{{ t.analytics.path || 'Parcours' }}</th>
                        <th class="text-right">{{ t.analytics.count || 'Nombre de visiteurs' }}</th>
                        <th class="text-right">{{ t.analytics.conversionRate || 'Taux de conversion' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(flow, index) in userFlows" :key="index">
                        <td>
                          <div class="d-flex align-center flex-wrap">
                            <template v-for="(step, stepIndex) in flow.path" :key="stepIndex">
                              <span class="user-flow-step">{{ step }}</span>
                              <v-icon v-if="stepIndex < flow.path.length - 1" size="small"
                                class="mx-1">mdi-arrow-right</v-icon>
                            </template>
                          </div>
                        </td>
                        <td class="text-right">{{ flow.count }}</td>
                        <td class="text-right">{{ flow.conversionRate }}%</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>

              <!-- Événements d'erreur -->
              <v-card class="mt-4">
                <v-card-title class="text-h6">
                  <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
                  {{ t.analytics.errorEvents || 'Événements d\'erreur' }}
                </v-card-title>
                <v-card-text>
                  <v-table>
                    <thead>
                      <tr>
                        <th>{{ t.page || 'Page' }}</th>
                        <th>{{ t.analytics.errorMessage || 'Message d\'erreur' }}</th>
                        <th class="text-right">{{ t.analytics.count || 'Occurrences' }}</th>
                        <th>{{ t.analytics.browserInfo || 'Navigateur' }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(error, index) in errorEvents" :key="index">
                        <td>{{ error.page }}</td>
                        <td>{{ error.errorMessage }}</td>
                        <td class="text-right">{{ error.count }}</td>
                        <td>{{ error.browserInfo }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <snackBar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import highlight from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import snackBar from '../components/snackBar.vue';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';
import { DeviceStats, DeviceType, ErrorEvent, PageView, TrafficSource, UserFlow, Website, WebsiteAnalytics } from '../utils/analytics/types';

const t = useTranslations('analytics')();

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Analyse du Comportement Utilisateur | StackUnity',
  meta: [
    { name: 'description', content: 'Analysez le comportement des utilisateurs sur votre site web avec des métriques détaillées et des visualisations avancées.' }
  ]
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData);
const showAddSiteDialog = ref(false);
const showAnalyticsDialog = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const currentSite = ref<Website | null>(null);
const currentSiteAnalytics = ref<WebsiteAnalytics | null>(null);
const showCodeDialog = ref(false);

const newSite = ref({
  name: websiteData.value.website_name || '',
  url: websiteData.value.main_url || ''
});

const websites = ref<Website[]>([]);

const applyHighlight = (code: string) => {
  const codeElement = document.getElementById('code');
  if (codeElement) {
    codeElement.innerHTML = highlight.highlight(code, { language: 'javascript' }).value;
  }
};

watch(showCodeDialog, (newVal) => {
  if (newVal) {
    nextTick(() => {
      applyHighlight(generateTrackingCode(currentSite.value?.id || ''));
    });
  }
});

const metrics = ref([
  {
    label: 'Visiteurs',
    value: 1254,
    icon: 'mdi-account-multiple',
    color: 'success'
  },
  {
    label: 'Temps moyen',
    value: '2m 34s',
    icon: 'mdi-clock-outline',
    color: 'info'
  },
  {
    label: 'Taux de rebond',
    value: '42%',
    icon: 'mdi-arrow-u-left-top',
    color: 'warning'
  },
  {
    label: 'Sessions frustrées',
    value: 123,
    icon: 'mdi-emoticon-sad-outline',
    color: 'error'
  }
]);

const pageViews = ref<PageView[]>([
  { page: '/', views: 1254, avgTime: '1m 28s' },
  { page: '/produits', views: 876, avgTime: '2m 15s' },
  { page: '/blog', views: 543, avgTime: '3m 42s' },
  { page: '/contact', views: 321, avgTime: '0m 58s' }
]);

const trafficSources = ref<TrafficSource[]>([
  { source: 'Recherche organique', visitors: 687, percentage: 54.8 },
  { source: 'Réseaux sociaux', visitors: 321, percentage: 25.6 },
  { source: 'Liens directs', visitors: 156, percentage: 12.4 },
  { source: 'Référents', visitors: 90, percentage: 7.2 }
]);

const deviceStats = ref<DeviceStats[]>([
  { type: DeviceType.DESKTOP, count: 724, percentage: 57.7 },
  { type: DeviceType.MOBILE, count: 456, percentage: 36.4 },
  { type: DeviceType.TABLET, count: 74, percentage: 5.9 }
]);

const userFlows = ref<UserFlow[]>([
  { path: ['/', '/produits', '/produits/123', '/panier', '/checkout'], count: 87, conversionRate: 27.5 },
  { path: ['/', '/blog', '/contact'], count: 43, conversionRate: 0 },
  { path: ['/', '/contact', '/plans'], count: 31, conversionRate: 16.2 }
]);

const errorEvents = ref<ErrorEvent[]>([
  { page: '/checkout', errorMessage: "Erreur de validation du formulaire", count: 32, browserInfo: "Chrome 98, Windows" },
  { page: '/produits', errorMessage: "Erreur de chargement des images", count: 18, browserInfo: "Safari 15, iOS" },
  { page: '/contact', errorMessage: "Erreur d'envoi du formulaire", count: 12, browserInfo: "Firefox 95, macOS" }
]);

const isFormValid = computed(() => {
  return newSite.value.name &&
    newSite.value.url &&
    /^https?:\/\//.test(newSite.value.url);
});

onMounted(() => {
  fetchWebsites();
});

async function fetchWebsites() {
  try {
    const response = await fetch('/api/analytics/websites');
    const result = await response.json();
    console.log(result);

    if (result.success) {
      websites.value = result.websites.map(site => ({
        id: site.trackingId,
        name: site.name,
        url: site.url,
        addedAt: site.createdAt
      }));
    } else {
      console.error('Error fetching websites:', result.message);
    }
  } catch (error) {
    console.error('Error fetching websites:', error);
  }
}

async function addWebsite() {
  if (!isFormValid.value) return;

  try {
    const response = await fetch('/api/analytics/register-website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newSite.value.name,
        url: newSite.value.url
      })
    });

    const result = await response.json();

    if (result.success) {
      const site: Website = {
        id: result.websiteId,
        name: newSite.value.name,
        url: newSite.value.url,
        addedAt: new Date().toISOString()
      };

      websites.value.push(site);
      currentSite.value = site;
      showCodeDialog.value = true;

      newSite.value = {
        name: '',
        url: ''
      };

      showAddSiteDialog.value = false;
      showMessage('Site ajouté avec succès', 'success');
    } else {
      showMessage(result.message || 'Erreur lors de l\'ajout du site', 'error');
    }
  } catch (error) {
    console.error('Error adding website:', error);
    showMessage('Erreur lors de l\'ajout du site', 'error');
  }
}

async function selectSite(site: Website) {
  currentSite.value = site;

  try {
    const response = await fetch(`/api/analytics/website/${site.id}`);
    const result = await response.json();

    if (result.success) {
      const data = result.data;

      metrics.value = [
        {
          label: 'Visiteurs',
          value: data.totalVisitors,
          icon: 'mdi-account-multiple',
          color: 'success'
        },
        {
          label: 'Temps moyen',
          value: data.timeOnSite,
          icon: 'mdi-clock-outline',
          color: 'info'
        },
        {
          label: 'Taux de rebond',
          value: `${data.bounceRate}%`,
          icon: 'mdi-arrow-u-left-top',
          color: 'warning'
        },
        {
          label: 'Sessions frustrées',
          value: data.frustratedSessions,
          icon: 'mdi-emoticon-sad-outline',
          color: 'error'
        }
      ];

      pageViews.value = data.topPages;
      trafficSources.value = data.trafficSources;
      deviceStats.value = data.devices.map((d: any) => ({
        type: d.type === 'desktop' ? DeviceType.DESKTOP :
          d.type === 'tablet' ? DeviceType.TABLET : DeviceType.MOBILE,
        count: d.count,
        percentage: d.percentage
      }));
      errorEvents.value = data.errorEvents;

      currentSiteAnalytics.value = {
        websiteId: site.id,
        totalVisitors: data.totalVisitors,
        totalPageViews: data.totalPageViews,
        avgSessionDuration: data.avgSessionDuration,
        bounceRate: data.bounceRate,
        frustratedSessions: data.frustratedSessions,
        timeOnSite: data.timeOnSite,
        topPages: data.topPages,
        trafficSources: data.trafficSources,
        devices: data.devices,
        userFlows: [],
        errorEvents: data.errorEvents
      };
    } else {
      showMessage(result.message || 'Erreur lors de la récupération des données', 'error');
    }
  } catch (error) {
    console.error('Error fetching website stats:', error);
    showMessage('Erreur lors de la récupération des données', 'error');
  }

  showAnalyticsDialog.value = true;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function showMessage(text: string, color: string) {
  snackbarText.value = text;
  snackbarColor.value = color;
  showSnackbar.value = true;
}

function generateTrackingCode(websiteId: string): string {
  return `
<script>
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '${window.location.origin}/tracker.js';
    s.setAttribute('data-website-id', '${websiteId}');
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
<\/script>
  `;
}

function getSourceColor(source: string): string {
  switch (source) {
    case 'Recherche organique':
      return 'success';
    case 'Réseaux sociaux':
      return 'info';
    case 'Liens directs':
      return 'primary';
    case 'Référents':
      return 'warning';
    default:
      return 'grey';
  }
}

function getSourceIcon(source: string): string {
  switch (source) {
    case 'Recherche organique':
      return 'mdi-magnify';
    case 'Réseaux sociaux':
      return 'mdi-account-group';
    case 'Liens directs':
      return 'mdi-link-variant';
    case 'Référents':
      return 'mdi-web';
    default:
      return 'mdi-help-circle-outline';
  }
}

function getDeviceIcon(type: DeviceType): string {
  switch (type) {
    case DeviceType.DESKTOP:
      return 'mdi-desktop-mac';
    case DeviceType.TABLET:
      return 'mdi-tablet';
    case DeviceType.MOBILE:
      return 'mdi-cellphone';
    default:
      return 'mdi-help-circle-outline';
  }
}

function getDeviceLabel(type: DeviceType): string {
  switch (type) {
    case DeviceType.DESKTOP:
      return 'Ordinateur';
    case DeviceType.TABLET:
      return 'Tablette';
    case DeviceType.MOBILE:
      return 'Mobile';
    default:
      return 'Inconnu';
  }
}

function copyTrackingCode(websiteId: string) {
  const code = generateTrackingCode(websiteId);
  navigator.clipboard.writeText(code)
    .then(() => {
      showMessage('Code de suivi copié dans le presse-papier', 'success');
    })
    .catch((err) => {
      console.error('Erreur lors de la copie du code:', err);
      showMessage('Erreur lors de la copie du code', 'error');
    });
}
</script>

<style scoped>
.page-header {
  min-height: 80px;
}
</style>