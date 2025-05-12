<template>
  <v-app class="analytics-app">
    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12">
            <div class="d-flex flex-column mb-4">
              <div class="analytics-header pl-6 mb-8">
                <h1 class="text-h4 font-weight-bold mb-2">{{ t.title }}</h1>
                <div class="analytics-description text-body-1 text-medium-emphasis mb-3">
                  {{ t.description }}
                </div>
                <v-chip color="secondary" variant="flat" size="small" class="mb-4">
                  <v-icon start size="small">mdi-chart-timeline-variant</v-icon>
                  {{ t.analytics.realtime }}
                </v-chip>
              </div>
              <v-spacer></v-spacer>
              <div class="d-flex justify-end">
                <v-btn color="tertiary" prepend-icon="mdi-plus" @click="showAddSiteDialog = true"
                  class="primary-action-btn elevation-2">
                  {{ t.addSite }}
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <template v-if="isLoading">
          <v-row>
            <v-col v-for="i in 4" :key="`skeleton-site-${i}`" cols="12" sm="6" md="4" lg="3">
              <div class="skeleton-site-card"></div>
            </v-col>
          </v-row>
        </template>

        <template v-else-if="!currentSite">
          <template v-if="websites.length === 0">
            <v-card class="mb-6 bg-transparent rounded-lg" elevation="24">
              <v-card-text class="text-center py-8">
                <v-icon class="mb-4" icon="mdi-chart-timeline-variant" size="64" color="primary"></v-icon>
                <h2 class="text-h4 mb-2">{{ t.welcome.empty.title }}</h2>
                <p class="text-body-1 mb-6 mx-auto" style="max-width: 600px;">{{ t.welcome.empty.description }}
                </p>
                <v-btn color="primary" prepend-icon="mdi-plus" size="large" @click="showAddSiteDialog = true">
                  {{ t.welcome.empty.action }}
                </v-btn>
              </v-card-text>
            </v-card>
          </template>

          <template v-else-if="websites.length <= 3">
            <v-row>
              <v-col cols="12" md="8">
                <v-row>
                  <v-col v-for="(site, index) in websites" :key="site.id" cols="12" sm="6" md="6">
                    <v-card class="h-100 site-card modern-card" hover elevation="3" rounded="lg"
                      @click="selectSite(site)">
                      <div class="site-card-banner" :class="`bg-gradient-${getColorByIndex(index)}`">
                        <div class="site-card-overlay"></div>
                        <div class="site-icon-container">
                          <v-icon color="white" size="32">mdi-web</v-icon>
                        </div>
                        <div class="site-card-header pa-4">
                          <h3 class="text-h5 text-white font-weight-bold mb-1">{{ site.name }}</h3>
                          <div class="d-flex align-center">
                            <v-chip variant="flat" size="small" class="mb-2 site-url-chip"
                              :title="site.fullDomain || getFullDomain(site.url)">
                              {{ site.formattedUrl || formatUrl(site.url) }}
                            </v-chip>
                            <v-chip v-if="isLocalEnvironment(site.url)" color="purple" size="x-small"
                              class="mb-2 ml-1 dev-chip" title="Environnement de développement">
                              DEV
                            </v-chip>
                          </div>
                        </div>
                      </div>
                      <v-card-text class="pt-4">
                        <div class="d-flex align-center justify-space-between mb-3">
                          <div class="d-flex align-center">
                            <v-icon size="small" :color="getColorByIndex(index)" class="mr-2">mdi-calendar</v-icon>
                            <div class="text-caption">{{ t.addedAt }} {{ formatDate(site.addedAt) }}</div>
                          </div>
                          <v-chip size="x-small" color="success" class="status-chip">
                            {{ t.analytics.active }}
                          </v-chip>
                        </div>

                        <div class="site-stats d-flex align-center justify-space-between mt-4">
                          <div class="stat-item text-center">
                            <div class="text-caption text-medium-emphasis">{{ t.analytics.visites }}</div>
                            <div class="text-subtitle-1 font-weight-bold">{{ site.stats.visites }}</div>
                          </div>
                          <v-divider vertical class="mx-2"></v-divider>
                          <div class="stat-item text-center">
                            <div class="text-caption text-medium-emphasis">{{ t.analytics.pages }}</div>
                            <div class="text-subtitle-1 font-weight-bold">{{ site.stats.pages }}</div>
                          </div>
                          <v-divider vertical class="mx-2"></v-divider>
                          <div class="stat-item text-center">
                            <div class="text-caption text-medium-emphasis">{{ t.analytics.interactions || 'Interactions'
                              }}</div>
                            <div class="text-subtitle-1 font-weight-bold">
                              {{ site.stats && site.stats.totalInteractions || '0' }}
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn variant="tonal" :color="getColorByIndex(index)" block class="view-analytics-btn">
                          <v-icon start>mdi-chart-line</v-icon>
                          {{ t.viewAnalytics }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="h-100 add-site-card modern-card" elevation="3" rounded="lg" hover>
                  <v-card-text class="text-center py-8">
                    <div class="add-site-icon-container mb-4 pulse-animation">
                      <v-icon icon="mdi-web-plus" size="48" color="primary"></v-icon>
                    </div>
                    <h3 class="text-h5 font-weight-bold mb-3">{{ t.welcome.few.title }}</h3>
                    <p class="text-body-2 mb-6 mx-auto" style="max-width: 300px;">{{ t.welcome.few.description
                      }}</p>
                    <v-btn color="primary" prepend-icon="mdi-plus" size="large" class="px-6 elevation-2 scale-on-hover"
                      @click="showAddSiteDialog = true">
                      {{ t.welcome.few.action }}
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </template>


          <template v-else>
            <v-row>
              <v-col v-for="(site, index) in websites" :key="site.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="h-100 site-card modern-card" hover elevation="3" rounded="lg" @click="selectSite(site)">
                  <div class="site-card-banner" :class="`bg-gradient-${getColorByIndex(index)}`">
                    <div class="site-card-overlay"></div>
                    <div class="site-icon-container">
                      <v-icon color="white" size="32">mdi-web</v-icon>
                    </div>
                    <div class="site-card-header pa-4">
                      <h3 class="text-h5 text-white font-weight-bold mb-1">{{ site.name }}</h3>
                      <div class="d-flex align-center">
                        <v-chip variant="flat" size="small" class="mb-2 site-url-chip"
                          :title="site.fullDomain || getFullDomain(site.url)">
                          {{ site.formattedUrl || formatUrl(site.url) }}
                        </v-chip>
                        <v-chip v-if="isLocalEnvironment(site.url)" color="purple" size="x-small"
                          class="mb-2 ml-1 dev-chip" title="Environnement de développement">
                          DEV
                        </v-chip>
                      </div>
                    </div>
                  </div>
                  <v-card-text class="pt-4">
                    <div class="d-flex align-center justify-space-between mb-3">
                      <div class="d-flex align-center">
                        <v-icon size="small" :color="getColorByIndex(index)" class="mr-2">mdi-calendar</v-icon>
                        <div class="text-caption">{{ t.addedAt }} {{ formatDate(site.addedAt) }}</div>
                      </div>
                      <v-chip size="x-small" color="success" class="status-chip">
                        {{ t.analytics.active }}
                      </v-chip>
                    </div>

                    <div class="site-stats d-flex align-center justify-space-between mt-4">
                      <div class="stat-item text-center">
                        <div class="text-caption text-medium-emphasis">{{ t.analytics.visites }}</div>
                        <div class="text-subtitle-1 font-weight-bold">{{ site.stats.visites }}</div>
                      </div>
                      <v-divider vertical class="mx-2"></v-divider>
                      <div class="stat-item text-center">
                        <div class="text-caption text-medium-emphasis">{{ t.analytics.pages }}</div>
                        <div class="text-subtitle-1 font-weight-bold">{{ site.stats.pages }}</div>
                      </div>
                      <v-divider vertical class="mx-2"></v-divider>
                      <div class="stat-item text-center">
                        <div class="text-caption text-medium-emphasis">{{ t.analytics.interactions || 'Interactions' }}
                        </div>
                        <div class="text-subtitle-1 font-weight-bold">
                          {{ site.stats && site.stats.totalInteractions || '0' }}
                        </div>
                      </div>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="tonal" :color="getColorByIndex(index)" block class="view-analytics-btn">
                      <v-icon start>mdi-chart-line</v-icon>
                      {{ t.viewAnalytics }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <v-card v-if="websites.length <= 3" class="mt-6 bg-surface">
            <v-card-title class="text-h5">
              <v-icon start class="mr-2">mdi-lightbulb</v-icon>
              {{ t.welcome.features }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="(card, i) in t.welcome.cards" :key="i" cols="12" sm="6" md="3">
                  <v-card class="h-100" variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon :icon="card.icon" size="36" :color="card.color" class="mb-3"></v-icon>
                      <h3 class="text-h6 mb-2">{{ card.title }}</h3>
                      <p class="text-body-2">{{ card.description }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>

        <template v-else>
          <div class="d-flex align-center mb-6">
            <v-btn icon variant="text" @click="currentSite = null; currentSiteAnalytics = null;">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h2 class="text-h5 ml-2 mb-0">{{ currentSite.name }}</h2>
            <v-btn icon variant="text" size="small" class="ml-1" @click="showEditSiteNameDialog = true"
              :title="t.edit_name">
              <v-icon size="small">mdi-pencil</v-icon>
            </v-btn>
            <div class="d-flex align-center ml-2">
              <v-chip size="small" color="primary" variant="outlined"
                :title="currentSite.fullDomain || getFullDomain(currentSite.url)">
                {{ currentSite.formattedUrl || formatUrl(currentSite.url) }}
              </v-chip>
              <v-chip v-if="isLocalEnvironment(currentSite.url)" color="purple" size="x-small" class="ml-1"
                title="Environnement de développement">
                DEV
              </v-chip>
            </div>
            <v-spacer></v-spacer>

            <div class="d-flex align-center mx-2">
              <span class="text-caption mr-2">Période:</span>
              <v-select v-model="selectedPeriod" :items="periodOptions" variant="outlined" density="compact"
                hide-details class="period-select" style="max-width: 180px;"
                @update:model-value="fetchSiteDataForPeriod"></v-select>
            </div>

            <v-btn color="primary" variant="text" prepend-icon="mdi-code-tags" @click="showCodeDialog = true">
              {{ t.tracking.trackingCode || 'Code de suivi' }}
            </v-btn>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn icon variant="text" class="ml-2" title="Paramètres" v-bind="props">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item prepend-icon="mdi-database-remove" @click="showDataPurgeDialog = true">
                  <v-list-item-title>{{ t.engagement.purge.purgeData || 'Purger les données' }}</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-delete" @click="showDeleteSiteDialog = true">
                  <v-list-item-title>{{ t.analytics.deleteSite || 'Supprimer l\'analytique' }}</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-refresh" @click="refreshSiteData">
                  <v-list-item-title>{{ t.analytics.refreshData || 'Actualiser les données' }}</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-account-remove" @click="showExclusionsDialog = true">
                  <v-list-item-title>{{ t.analytics.exclusions || 'Gérer les exclusions' }}</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item prepend-icon="mdi-chart-timeline-variant" @click="showExportDialog = true">
                  <v-list-item-title>{{ t.analytics.exportAllData || 'Exporter toutes les données'
                    }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <v-alert v-if="showDataLimitAlert" color="warning" variant="tonal" closable class="mb-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-database-alert</v-icon>
              <div>
                <strong>{{ t.engagement.purge.dataLimitAlert }}</strong>
                <div>{{ t.engagement.purge.dataLimitDescription.replace('{count}', dataCount.toString()) }}</div>
              </div>
              <v-spacer></v-spacer>
              <v-btn v-if="isAdmin" color="warning" variant="text" @click="showDataPurgeDialog = true">
                {{ t.engagement.purge.purgeNow }}
              </v-btn>
            </div>
          </v-alert>

          <v-row v-if="isMetricsLoading">
            <v-col v-for="i in 4" :key="`skeleton-metric-${i}`" cols="6" md="3">
              <div class="skeleton-card"></div>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col v-for="(metric, index) in metrics" :key="index" cols="6" md="3">
              <v-card class="metric-card h-100 bg-surface">
                <v-card-text>
                  <div class="d-flex align-center">
                    <v-avatar :color="metric.color + '-lighten-4'" size="42" class="mr-3">
                      <v-icon :color="metric.color">{{ metric.icon }}</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-h5 font-weight-bold">{{ metric.value }}</div>
                      <div class="text-caption text-medium-emphasis">{{ metric.label }}</div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <div v-if="isMetricsLoading" class="skeleton-tabs mt-4"></div>

          <v-card v-else class="analytics-tabs-card mt-4">
            <v-tabs v-model="activeTab" bg-color="transparent" color="primary" slider-color="primary" show-arrows>
              <v-tab value="pages" class="tab-button">
                <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                {{ t.page }}
              </v-tab>
              <v-tab value="maps" class="tab-button">
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                {{ t.map }}
              </v-tab>
              <v-tab value="sources" class="tab-button">
                <v-icon class="mr-2">mdi-traffic-light</v-icon>
                {{ t.source }}
              </v-tab>
              <v-tab value="devices" class="tab-button">
                <v-icon class="mr-2">mdi-devices</v-icon>
                {{ t.device }}
              </v-tab>
              <v-tab value="interactions" class="tab-button">
                <v-icon class="mr-2">mdi-cursor-default-click-outline</v-icon>
                {{ t.interactionsTab }}
              </v-tab>
              <v-tab value="errors" class="tab-button">
                <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
                {{ t.errorTab }}
              </v-tab>
            </v-tabs>

            <v-divider></v-divider>

            <v-window v-model="activeTab" class="tab-content">
              <v-window-item value="pages">
                <v-card-text>
                  <div class="d-flex align-center mb-4">
                    <h3 class="text-subtitle-1 font-weight-medium">{{ t.analytics.topPages || 'Pages populaires' }}</h3>
                    <v-spacer></v-spacer>

                    <v-text-field v-model="pageSearch" prepend-inner-icon="mdi-magnify"
                      placeholder="Rechercher une page..." variant="outlined" density="compact" hide-details
                      class="mx-2" style="max-width: 250px;" @update:model-value="filterPages"></v-text-field>
                  </div>

                  <div v-if="isPagesLoading" class="skeleton-table mb-4" style="height: 350px;">
                    <div v-for="i in 8" :key="`skeleton-page-row-${i}`" class="skeleton-row"
                      :style="`opacity: ${1 - i * 0.1}`">
                    </div>
                  </div>

                  <v-data-table v-else :headers="pageHeaders" :items="filteredPages" :items-per-page="10"
                    :search="pageSearch" density="comfortable" class="page-data-table">
                    <template v-slot:item.page="{ item }">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-2" :color="getItemColor(item)">
                          {{ item.isHome ? 'mdi-home' : 'mdi-file-document-outline' }}
                        </v-icon>
                        <div class="text-truncate" style="max-width: 300px;">
                          <v-tooltip activator="parent" :text="item.page" location="top" max-width="400"></v-tooltip>
                          {{ formatPagePath(item.page, item.cleanPath, item.isHome) }}
                        </div>
                      </div>
                    </template>

                    <template v-slot:item.views="{ item }">
                      <div class="d-flex align-center">
                        <span class="font-weight-medium mr-2">{{ item.views }}</span>
                        <v-progress-linear :model-value="getPageViewPercentage(item.views)"
                          :color="getItemColor(item, true)" height="6" rounded class="views-progress"
                          style="width: 80px;"></v-progress-linear>
                      </div>
                    </template>

                    <template v-slot:item.avgTime="{ item }">
                      <div class="d-flex align-center">
                        <v-icon size="small" class="mr-2" :color="getTimeColor(item)">mdi-clock-outline</v-icon>
                        <span :class="{ 'text-grey': !item.hasDuration }">
                          {{ item.avgTime }}
                        </span>
                      </div>
                    </template>

                    <template v-slot:bottom>
                      <div class="text-center pt-2 pb-2">
                        <v-btn v-if="pageViews.length > 10" color="primary" variant="text" @click="exportPageData">
                          {{ t.analytics.exportData || 'Exporter les données' }}
                          <v-icon end>mdi-download</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-data-table>

                  <div v-if="isPageDistributionLoading" class="mt-4">
                    <div class="skeleton-header"></div>
                    <div class="skeleton-chart"></div>
                  </div>

                  <div v-else class="mt-4">
                    <div class="d-flex align-center mb-2">
                      <h3 class="text-subtitle-1 font-weight-medium">
                        <v-icon class="mr-2" color="primary">mdi-chart-pie</v-icon>
                        {{ t.analytics.chart.pageDistribution || 'Distribution des vues par page' }}
                      </h3>
                      <v-spacer></v-spacer>
                      <v-btn-toggle v-model="chartDisplayMode" mandatory density="comfortable" color="primary">
                        <v-btn value="pie" size="small">
                          <v-icon>mdi-chart-pie</v-icon>
                          <v-tooltip activator="parent">{{ t.analytics.chart.chartPie || 'Graphique circulaire'
                            }}</v-tooltip>
                        </v-btn>
                        <v-btn value="donut" size="small">
                          <v-icon>mdi-chart-donut</v-icon>
                          <v-tooltip activator="parent">{{ t.analytics.chart.chartDonut || 'Graphique annulaire'
                            }}</v-tooltip>
                        </v-btn>
                      </v-btn-toggle>
                    </div>

                    <v-card class="pa-4" variant="outlined">
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-chart class="page-distribution-chart" :option="pageDistributionChartData" autoresize />
                        </v-col>
                        <v-col cols="12" md="4">
                          <div class="page-legend">
                            <h4 class="text-subtitle-2 mb-2">{{ t.analytics.chart.topPages || 'Pages principales' }}
                            </h4>
                            <div v-for="(page, index) in topPagesForChart" :key="index"
                              class="page-legend-item mb-2 pa-2">
                              <div class="d-flex align-center justify-space-between">
                                <div class="d-flex align-center">
                                  <v-avatar :color="getColorByIndex(index)" size="10" class="mr-2"></v-avatar>
                                  <div class="text-caption text-truncate" style="max-width: 180px;" :title="page.page">
                                    {{ formatPagePath(page.page, page.cleanPath, page.isHome) }}
                                  </div>
                                </div>
                                <v-chip size="x-small" :color="getColorByIndex(index)" class="ml-2">
                                  {{ page.views }}
                                </v-chip>
                              </div>
                              <v-progress-linear :model-value="getPageViewPercentage(page.views)"
                                :color="getColorByIndex(index)" height="4" rounded class="mt-1">
                              </v-progress-linear>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card>
                  </div>
                </v-card-text>
              </v-window-item>

              <v-window-item value="maps">
                <WorldMapViewer :websiteId="currentSite?.id || ''" :period="selectedPeriod" />
              </v-window-item>

              <v-window-item value="sources">
                <v-card-text>
                  <v-row v-if="isSourcesLoading">
                    <v-col cols="12" md="8">
                      <div class="skeleton-table" style="height: 300px;">
                        <div v-for="i in 5" :key="`skeleton-source-row-${i}`" class="skeleton-row"
                          :style="`opacity: ${1 - i * 0.15}`"></div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="skeleton-chart"></div>
                    </v-col>
                  </v-row>

                  <v-row v-else>
                    <v-col cols="12" md="8">
                      <v-table density="comfortable">
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
                                {{ getSourceLabel(source.source) }}
                              </div>
                            </td>
                            <td class="text-right">{{ source.visitors }}</td>
                            <td class="text-right">{{ source.percentage }}%</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-chart class="traffic-chart" :option="trafficSourcesChartData" autoresize />
                    </v-col>
                  </v-row>

                  <v-divider class="my-6"></v-divider>

                  <v-row class="mt-6">
                    <v-col cols="12">
                      <h3 class="text-subtitle-1 font-weight-medium mb-4">{{ t.analytics.technicalInfo }}</h3>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="tech-stats-card h-100">
                        <v-card-title class="tech-card-title">
                          <v-icon start color="info">mdi-web-box</v-icon>
                          {{ t.analytics.browsers }}
                        </v-card-title>
                        <v-card-text>
                          <div v-for="(browser, index) in browsers" :key="'browser-' + index" class="tech-stat-item">
                            <div class="d-flex align-center justify-space-between mb-1">
                              <div class="d-flex align-center">
                                <v-icon size="small" class="mr-2" :color="getBrowserColor(browser.name)">
                                  {{ getBrowserIcon(browser.name) }}
                                </v-icon>
                                <span class="text-body-2">{{ browser.name }}</span>
                              </div>
                              <span class="text-caption tech-count">{{ browser.count }}</span>
                            </div>
                            <v-progress-linear :model-value="browser.percentage" :color="getBrowserColor(browser.name)"
                              height="8" rounded bg-color="grey-darken-3"></v-progress-linear>
                            <div class="text-caption text-right mt-1">{{ browser.percentage }}%</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card variant="outlined" class="tech-stats-card h-100">
                        <v-card-title class="tech-card-title">
                          <v-icon start color="success">mdi-laptop</v-icon>
                          {{ t.analytics.osSystems }}
                        </v-card-title>
                        <v-card-text>
                          <div v-for="(system, index) in osSystems" :key="'os-' + index" class="tech-stat-item">
                            <div class="d-flex align-center justify-space-between mb-1">
                              <div class="d-flex align-center">
                                <v-icon size="small" class="mr-2" :color="getOsColor(system.name)">
                                  {{ getOsIcon(system.name) }}
                                </v-icon>
                                <span class="text-body-2">{{ system.name }}</span>
                              </div>
                              <span class="text-caption tech-count">{{ system.count }}</span>
                            </div>
                            <v-progress-linear :model-value="system.percentage" :color="getOsColor(system.name)"
                              height="8" rounded bg-color="grey-darken-3"></v-progress-linear>
                            <div class="text-caption text-right mt-1">{{ system.percentage }}%</div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-window-item>

              <v-window-item value="devices">
                <v-card-text>
                  <v-row v-if="isDevicesLoading">
                    <v-col cols="12" md="8">
                      <div class="skeleton-table" style="height: 200px;">
                        <div v-for="i in 4" :key="`skeleton-device-row-${i}`" class="skeleton-row"
                          :style="`opacity: ${1 - i * 0.2}`"></div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="skeleton-chart"></div>
                    </v-col>
                  </v-row>

                  <v-row v-else>
                    <v-col cols="12" md="8">
                      <v-table density="comfortable">
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
                      <v-chart class="device-chart" :option="deviceStatsChartData" autoresize />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-window-item>

              <v-window-item value="interactions">
                <v-card-text class="pa-4">
                  <v-tabs v-model="interactionsTab" bg-color="transparent" color="primary" class="mb-4">
                    <v-tab value="interactions">
                      <v-icon class="mr-2">mdi-cursor-default-click-outline</v-icon>
                      {{ t.interactionsTab || 'Interactions utilisateur' }}
                    </v-tab>
                    <v-tab value="dead-zones">
                      <v-icon class="mr-2">mdi-eye-off-outline</v-icon>
                      {{ t.deadZoneViewer.title || 'Zones mortes' }}
                    </v-tab>
                    <v-tab value="engagement">
                      <v-icon class="mr-2">mdi-chart-bell-curve</v-icon>
                      {{ t.engagement?.title || 'Qualité d\'engagement' }}
                    </v-tab>
                  </v-tabs>

                  <v-window v-model="interactionsTab">
                    <v-window-item value="interactions">
                      <InteractionViewer :websiteId="currentSite.id" :interactions="{
                        data: userInteractions,
                        total: totalInteractionsCount || userInteractions.length,
                        limit: 200,
                        page: 1,
                        hasMore: (totalInteractionsCount || 0) > userInteractions.length
                      }" />
                    </v-window-item>

                    <v-window-item value="dead-zones">
                      <DeadZoneViewer :websiteId="currentSite.id" />
                    </v-window-item>

                    <v-window-item value="engagement">

                      <EngagementQualityViewer :websiteId="currentSite.id" />
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-window-item>

              <v-window-item value="errors">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-4">
                    <h3 class="text-subtitle-1 font-weight-medium">{{ t.errorTab || 'Suivi des erreurs' }}</h3>
                    <v-spacer></v-spacer>
                    <v-chip v-if="errorEvents && errorEvents.length > 0" color="error" size="small" class="mr-2">
                      {{ errorEvents.length }} {{ t.error.errorDetected }}
                    </v-chip>
                    <v-chip v-else color="success" size="small" class="mr-2">
                      <v-icon start size="small">mdi-check-circle</v-icon>
                      {{ t.error.noErrorDetected }}
                    </v-chip>
                  </div>

                  <v-card class="errors-card">
                    <v-table density="comfortable">
                      <thead>
                        <tr>
                          <th>{{ t.page || 'Page' }}</th>
                          <th>{{ t.analytics.errorMessage || 'Message d\'erreur' }}</th>
                          <th class="text-right">{{ t.analytics.count || 'Occurrences' }}</th>
                          <th>{{ t.analytics.browserInfo || 'Navigateur' }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(error, index) in errorEvents || []" :key="index" class="error-row">
                          <td>
                            <div class="d-flex align-center">
                              <v-icon size="small" color="error" class="mr-2">mdi-file-alert</v-icon>
                              <span class="text-body-2 text-truncate" style="max-width: 150px;" :title="error.page">{{
                                error.page
                                }}</span>
                            </div>
                          </td>
                          <td>
                            <div class="error-message text-truncate" style="max-width: 570px;"
                              :title="error.errorMessage">
                              {{ error.errorMessage }}
                            </div>
                          </td>
                          <td class="text-right">
                            <v-chip size="x-small" color="error" variant="outlined">{{ error.count }}</v-chip>
                          </td>
                          <td>
                            <div class="d-flex align-center">
                              <v-icon size="small" class="mr-2" :color="getBrowserColor(error.browserInfo)">
                                {{ getBrowserIcon(error.browserInfo) }}
                              </v-icon>
                              <span class="text-caption">{{ error.browserInfo }}</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card>

                  <v-card v-if="errorEvents && errorEvents.length" class="no-errors-card pa-6 text-center mt-4">
                    <v-icon :color="errorEvents && errorEvents.length > 0 ? 'error' : 'warning'" size="64"
                      class="mb-4">{{
                        errorEvents && errorEvents.length > 0 ?
                          'mdi-alert-circle' :
                          'mdi-check-circle'
                      }}</v-icon>
                    <h3 class="text-h6 mb-2">{{ errorEvents && errorEvents.length > 0 ? t.error.errorDetected :
                      t.error.noErrorDetected }}</h3>
                    <p class="text-body-2 text-medium-emphasis">
                      {{ errorEvents && errorEvents.length > 0 ? t.error.errorDetectedDescription :
                        t.error.noErrorDetectedDescription }}
                    </p>
                  </v-card>
                </v-card-text>
              </v-window-item>
            </v-window>
          </v-card>
        </template>
      </v-container>

      <v-dialog v-model="showCodeDialog" max-width="800px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">
            <v-icon class="mr-2">mdi-code-tags</v-icon>
            {{ t.tracking.trackingCode }}
          </v-card-title>
          <v-card-text>
            <p class="mb-4">
              {{ t.tracking.trackingCodeDescription || "Ajoutez ce code avant la balise de fermeture body de votre site"
              }}
            </p>
            <div class="code-container">
              <pre id="code" class="bg-surface pa-2 rounded"></pre>
            </div>
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
                :placeholder="t.form.urlPlaceholder || 'https://example.com'" variant="outlined" class="mb-4" :rules="[
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

      <v-dialog v-model="showDataPurgeDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h5 bg-error text-white">
            <v-icon class="mr-2">mdi-delete</v-icon>
            {{ t.engagement.purge.title }}
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-2">{{ t.engagement.purge.description }}</p>
            <v-select v-model="purgeOption" :items="purgeOptions" :label="t.engagement.purge.selectData"
              variant="outlined" class="mb-3"></v-select>
            <v-alert v-if="purgeOption === 'all'" type="warning" variant="tonal" class="mb-3">
              <strong>{{ t.engagement.purge.warning }}</strong> {{ t.engagement.purge.warningAllData }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showDataPurgeDialog = false">
              {{ t.engagement.purge.cancel }}
            </v-btn>
            <v-btn color="error" variant="tonal" @click="generateSecurityQuestion()">
              {{ t.engagement.purge.confirmDelete }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showConfirmationDialog" max-width="500px" persistent>
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-error">
            <v-icon class="mr-2">mdi-shield-lock</v-icon>
            {{ t.engagement.purge.security.title }}
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-2">{{ t.engagement.purge.security.description }}</p>
            <p class="mb-4 font-weight-bold">{{ securityQuestion }}</p>

            <v-text-field v-model="securityAnswer" :label="t.engagement.purge.security.placeholder" variant="outlined"
              type="number" class="mb-3" hide-details @keydown.enter="validateSecurityAnswer"></v-text-field>

            <v-checkbox v-model="confirmSecurityCheck" class="mt-4" color="error">
              <template v-slot:label>
                <div>{{ t.engagement.purge.security.confirm }}</div>
              </template>
            </v-checkbox>

            <v-alert v-if="securityError" type="error" variant="tonal" class="mt-3">
              {{ t.engagement.purge.security.incorrect }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="cancelSecurityDialog">
              {{ t.engagement.purge.cancel }}
            </v-btn>
            <v-btn color="error" variant="tonal" @click="validateSecurityAnswer"
              :disabled="!securityAnswer || !confirmSecurityCheck">
              {{ t.engagement.purge.security.validate }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showDeleteSiteDialog" max-width="500px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-error">
            <v-icon class="mr-2">mdi-delete-forever</v-icon>
            {{ t.analytics.deleteTitle || 'Supprimer l\'analytique' }}
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-2">{{ t.analytics.deleteDescription ||
              'Cette action supprimera définitivement toutes les données analytiques pour ce site.' +
              ' Cette opération est irréversible.'
              }}</p>
            <v-alert type="warning" variant="tonal" class="mb-3">
              <strong>{{ t.engagement.purge.warning }}</strong> {{ t.analytics.deleteWarning ||
                'Toutes les statistiques et les événements seront perdus.' }}
            </v-alert>
            <v-text-field v-model="deleteSiteConfirmation"
              :label="t.analytics.deleteConfirmLabel || 'Tapez le nom du site pour confirmer'" variant="outlined"
              class="mb-3"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showDeleteSiteDialog = false">
              {{ t.engagement.purge.cancel }}
            </v-btn>
            <v-btn color="error" variant="tonal" @click="deleteSite"
              :disabled="deleteSiteConfirmation !== currentSite?.name">
              {{ t.analytics.deleteConfirm || 'Supprimer définitivement' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showExportDialog" max-width="500px">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">
            <v-icon class="mr-2">mdi-export</v-icon>
            {{ t.analytics.exportTitle || 'Exporter les données' }}
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-4">{{ t.analytics.exportDescription || 'Sélectionnez le format et les données à exporter.' }}
            </p>

            <v-radio-group v-model="exportFormat" density="compact">
              <v-radio value="csv" label="CSV" color="primary"></v-radio>
              <v-radio value="json" label="JSON" color="primary"></v-radio>
            </v-radio-group>

            <v-divider class="my-3"></v-divider>

            <v-checkbox v-model="exportOptions.pages" label="Pages" color="primary"></v-checkbox>
            <v-checkbox v-model="exportOptions.interactions" label="Interactions" color="primary"></v-checkbox>
            <v-checkbox v-model="exportOptions.errors" label="Errors" color="primary"></v-checkbox>
            <v-checkbox v-model="exportOptions.devices" label="Devices" color="primary"></v-checkbox>
            <v-checkbox v-model="exportOptions.sources" label="Sources" color="primary"></v-checkbox>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showExportDialog = false">
              {{ t.engagement.purge.cancel }}
            </v-btn>
            <v-btn color="secondary" variant="tonal" @click="exportAnalyticsData"
              :disabled="!Object.values(exportOptions).some(v => v)">
              <v-icon start>mdi-download</v-icon>
              {{ t.analytics.exportButton || 'Exporter' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showEditSiteNameDialog" max-width="500">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">{{ t.edit_name }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="editSiteName" :label="t.name" variant="outlined"
              :rules="[v => !!v || t.form.nameRequired]" autofocus></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="showEditSiteNameDialog = false">
              {{ t.cancel }}
            </v-btn>
            <v-btn color="secondary" variant="tonal" @click="updateSiteName" :loading="updatingSiteName">
              {{ t.save }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showExclusionsDialog" max-width="600">
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 text-white bg-secondary">
            <v-icon class="mr-2">mdi-account-remove</v-icon>
            {{ t.analytics.exclusions || 'Exclusions des analytics' }}
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="mb-4">{{ t.analytics.exclusionsDescription ||
              'Exclure certaines adresses IP ou utilisateurs des statistiques(exemple : votre propre activité)' }}</p>

            <v-alert v-if="isCurrentlyExcluded" color="error" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-account-cancel</v-icon>
                <div>
                  <strong>{{ t.analytics.exclusionStatus || 'Statut d\'exclusion' }}</strong>
                  <div>{{ t.analytics.exclusionDescription ||
                    'Votre activité n\'est pas comptabilisée dans les statistiques' }}
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="outlined" @click="removeCurrentExclusion">
                  <v-icon start>mdi-account-check</v-icon>
                  {{ t.analytics.reactivateTracking || 'Réactiver le tracking' }}
                </v-btn>
              </div>
            </v-alert>

            <v-list class="mb-4 pa-0 bg-surface rounded-lg">
              <v-list-subheader>{{ t.analytics.currentExclusions || 'Exclusions actuelles' }}</v-list-subheader>
              <v-list-item v-for="(exclusion, index) in visitorExclusions" :key="index">
                <template v-slot:prepend>
                  <v-icon>{{ exclusion.type === 'visitor' ? 'mdi-account' : 'mdi-account' }}</v-icon>
                </template>
                <v-list-item-title>{{ exclusion.value }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn icon size="small" variant="text" color="error" @click="removeExclusion(index)"
                    aria-label="Supprimer l'exclusion">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
              <v-list-item v-if="visitorExclusions.length === 0">
                <v-list-item-title class="text-medium-emphasis">{{ t.analytics.noExclusions ||
                  'Aucune exclusion configurée'
                }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider class="mb-4"></v-divider>

            <v-btn color="secondary" block variant="outlined" class="mb-4" @click="addCurrentVisitor">
              <v-icon start>mdi-cellphone</v-icon>
              {{ t.analytics.excludeCurrentDevice || 'Exclure votre appareil actuel' }}
            </v-btn>

            <v-form @submit.prevent="addExclusion">
              <v-select v-model="newExclusion.type" :items="[
                { title: t.analytics.visitorId || 'ID Visiteur', value: 'visitor' },
                { title: t.analytics.userId || 'ID Utilisateur', value: 'user' }
              ]" :label="t.analytics.exclusionType || 'Type d\'exclusion'" variant="outlined" class="mb-3">
              </v-select>

              <v-text-field v-model="newExclusion.value"
                :label="newExclusion.type === 'visitor' ? (t.analytics.visitorIdPlaceholder || 'ID visiteur à exclure (ex: 123456)') : (t.analytics.userIdPlaceholder || 'ID utilisateur à exclure')"
                variant="outlined" class="mb-3" :rules="[v => !!v || t.form.valueRequired || 'Valeur requise']">
              </v-text-field>

              <div class="d-flex justify-end">
                <v-btn color="secondary" variant="tonal" :disabled="!newExclusion.value" @click="addExclusion">
                  <v-icon start>mdi-plus</v-icon>
                  {{ t.analytics.addExclusion || 'Ajouter l\'exclusion' }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" @click="showExclusionsDialog = false">
              {{ t.cancel }}
            </v-btn>
            <v-btn color="primary" variant="tonal" @click="saveExclusions">
              {{ t.save }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <snackBar v-if="showSnackbar" v-model="showSnackbar" :text="snackbarText" :color="snackbarColor"
        :timeout="3000" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, defineComponent, nextTick, onMounted, provide, ref, watch } from 'vue';
// @ts-ignore
import { definePageMeta, navigateTo, useHead } from '#imports';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import highlight from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { THEME_KEY } from 'vue-echarts';
import '../css/analytics.css';
import { useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';

const onAsyncError = (err) => {
  console.error('Erreur lors du chargement d\'un composant asynchrone:', err);
  return null;
};

const InteractionViewer = defineAsyncComponent({
  loader: () => import('../components/analytics/InteractionViewer.vue'),
  onError: onAsyncError
});

const DeadZoneViewer = defineAsyncComponent({
  loader: () => import('../components/analytics/DeadZoneViewer.vue'),
  onError: onAsyncError
});

const EngagementQualityViewer = defineAsyncComponent({
  loader: () => import('../components/analytics/EngagementQualityViewer.vue'),
  onError: onAsyncError
});

const WorldMapViewer = defineAsyncComponent({
  loader: () => import('../components/analytics/WorldMapViewer.vue'),
  onError: onAsyncError
});

const snackBar = defineAsyncComponent({
  loader: () => import('../components/snackbar.vue'),
  onError: onAsyncError
});

const VChart = defineAsyncComponent({
  loader: () => import('vue-echarts'),
  onError: onAsyncError
});

import {
  formatDate,
  formatDateToYYYYMMDD,
  formatDuration,
  formatPagePath,
  formatUrl as formatUrlUtil,
  generateTrackingCode,
  getBrowserColor,
  getBrowserIcon,
  getChartColor,
  getColorByIndex,
  getDeviceIcon,
  getDeviceLabel,
  getFullDomain,
  getOsColor,
  getOsIcon,
  getSourceColor,
  getSourceIcon,
  getSourceLabel,
  isLocalEnvironment,
  normalizeUrl
} from '../utils/analytics/functions';
import { BrowserOsStats, DetailedReferrer, DeviceStats, DeviceType, ErrorEvent, PageView, TrafficSource, UserFlow, UserInteraction, WebsiteAnalytics, WebsiteWithStats } from '../utils/analytics/types';

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
]);

const t = useTranslations('analytics')();

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: t.meta.title,
  meta: [
    { name: 'description', content: t.meta.description }
  ]
});

const userStore = useUserStore();
const websiteData = computed(() => userStore.websiteData || { website_name: '', main_url: '', all_urls: [], generated_sitemap: '' });
const showAddSiteDialog = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('');
const currentSite = ref<WebsiteWithStats | null>(null);
const currentSiteAnalytics = ref<WebsiteAnalytics | null>(null);
const showCodeDialog = ref(false);
const metrics = ref<Array<{ label: string, value: any, icon: string, color: string }>>([]);
const pageViews = ref<PageView[]>([]);
const trafficSources = ref<Array<TrafficSource>>([]);
const deviceStats = ref<Array<DeviceStats>>([]);
const errorEvents = ref<Array<ErrorEvent>>([]);
const userFlows = ref<Array<UserFlow>>([]);
const userInteractions = ref<Array<UserInteraction>>([]);
const browsers = ref<Array<BrowserOsStats>>([]);
const osSystems = ref<Array<BrowserOsStats>>([]);
const activeTab = ref('pages');
const totalInteractionsCount = ref<number>(0);
const websites = ref<WebsiteWithStats[]>([]);
const interactionsTab = ref('interactions');
const showDataPurgeDialog = ref(false);
const purgeOption = ref('older90');

const newSite = ref({
  name: websiteData.value?.website_name || '',
  url: websiteData.value?.main_url || ''
});

const purgeOptions = [
  { title: t.engagement.purge.options.older90, value: 'older90' },
  { title: t.engagement.purge.options.older30, value: 'older30' },
  { title: t.engagement.purge.options.older7, value: 'older7' },
  { title: t.engagement.purge.options.all, value: 'all' }
];
const purgeLoading = ref(false);
const dataCount = ref(0);
const showDataLimitAlert = computed(() => isAdmin.value && dataCount.value > 10000);
const isAdmin = computed(() => userStore.user?.isAdmin || userStore.user?.isPremium);

const showConfirmationDialog = ref(false);
const securityNum1 = ref(0);
const securityNum2 = ref(0);
const securityAnswer = ref('');
const securityError = ref(false);
const confirmSecurityCheck = ref(false);

const selectedPeriod = ref('all');
const periodOptions = [
  { title: t.analytics.all, value: 'all' },
  { title: t.analytics.last7days, value: '7d' },
  { title: t.analytics.last30days, value: '30d' },
  { title: t.analytics.last90days, value: '90d' }
];

const pageSearch = ref('');
const filteredPages = ref<PageView[]>([]);

const pageHeaders = [
  { title: t.page || 'Page', key: 'page', sortable: true, width: '40%' },
  { title: t.views || 'Vues', key: 'views', sortable: true, align: 'center' as const },
  { title: t.avgTime || 'Temps moyen', key: 'avgTime', sortable: true, align: 'center' as const },
  { title: '', key: 'actions', sortable: false, align: 'end' as const, width: '50px' }
];

const securityQuestion = computed(() => {
  return t.engagement.purge.security.question
    .replace('{num1}', securityNum1.value.toString())
    .replace('{num2}', securityNum2.value.toString());
});

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

const isFormValid = computed(() => {
  return newSite.value.name &&
    newSite.value.url &&
    /^https?:\/\//.test(newSite.value.url);
});

onMounted(() => {
  fetchWebsites();

  window.addEventListener('resize', () => {
    const charts = document.querySelectorAll('.chart');
    charts.forEach(chart => {
      const echartInstance = (chart as any).__echarts__;
      if (echartInstance) {
        echartInstance.resize();
      }
    });
  });

  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 500);

  initDefaultDateRange();
});

// Variables pour les états de chargement
const isLoading = ref(true);
const isMetricsLoading = ref(true);
const isPageDistributionLoading = ref(true);
const isPagesLoading = ref(true);
const isSourcesLoading = ref(true);
const isDevicesLoading = ref(true);

async function fetchWebsites() {
  isLoading.value = true;
  try {
    const response = await fetch('/api/analytics/websites');
    const result = await response.json();

    if (result.success) {
      const sitesWithStats = await Promise.all(result.websites.map(async site => {
        const siteData = {
          id: site.trackingId,
          name: site.name,
          url: site.url,
          formattedUrl: formatUrlUtil(site.url),
          fullDomain: getFullDomain(site.url),
          addedAt: site.createdAt,
          stats: {
            visites: 0,
            pages: 0,
            temps: '0m',
            dureePageMoyenne: '0m',
            totalInteractions: 0,
            qualiteDonnees: 0
          }
        };

        try {
          const statsResponse = await fetch(`/api/analytics/website/${site.trackingId}/basic-stats`);
          const statsResult = await statsResponse.json();

          if (statsResult.success && statsResult.data) {
            siteData.stats = {
              visites: statsResult.data.totalVisitors || 0,
              pages: statsResult.data.totalPageViews || 0,
              temps: formatDuration(statsResult.data.avgSessionDuration || 0),
              dureePageMoyenne: formatDuration(statsResult.data.avgPageDuration || 0),
              totalInteractions: statsResult.data.totalInteractions || 0,
              qualiteDonnees: statsResult.data.durationDataQuality || 0
            };
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des stats pour ${site.name}:`, error);
        }

        return siteData;
      }));

      websites.value = sitesWithStats;
    } else {
      console.error('Error fetching websites:', result.message);
    }
  } catch (error) {
    console.error('Error fetching websites:', error);
  } finally {
    isLoading.value = false;
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
      const site: WebsiteWithStats = {
        id: result.websiteId,
        name: newSite.value.name,
        url: newSite.value.url,
        formattedUrl: formatUrlUtil(newSite.value.url),
        fullDomain: getFullDomain(newSite.value.url),
        addedAt: new Date().toISOString(),
        stats: {
          visites: 0,
          pages: 0,
          temps: '0m',
          dureePageMoyenne: '0m',
          totalInteractions: 0,
          qualiteDonnees: 0
        }
      };

      websites.value.push(site);
      currentSite.value = site;
      showCodeDialog.value = true;

      newSite.value = {
        name: '',
        url: ''
      };

      showAddSiteDialog.value = false;
      showMessage(t.analytics.success, 'success');
    } else {
      showMessage(result.message || t.analytics.error, 'error');
    }
  } catch (error) {
    console.error('Error adding website:', error);
    showMessage(t.analytics.error, 'error');
  }
}

async function selectSite(site: WebsiteWithStats) {
  currentSite.value = site;
  isMetricsLoading.value = true;
  isPageDistributionLoading.value = true;
  isPagesLoading.value = true;
  isSourcesLoading.value = true;
  isDevicesLoading.value = true;

  try {
    loadExclusions();
    const response = await fetch(`/api/analytics/website/${site.id}?period=${selectedPeriod.value}&limit=500`);
    const result = await response.json();

    if (result.success) {
      updateAnalyticsData(result.data);
      isMetricsLoading.value = false;
      isSourcesLoading.value = false;
      isDevicesLoading.value = false;

      await loadPageDistribution();

      try {
        const timeSeriesResponse = await fetch(`/api/analytics/website/${site.id}/time-series?period=${selectedPeriod.value}`);
        const timeSeriesResult = await timeSeriesResponse.json();

        if (timeSeriesResult.success && timeSeriesResult.data) {
          pageViewsTimeSeries.value = timeSeriesResult.data.map(item => ({
            date: item.date,
            views: item.count
          }));

          updatePageTrackingData(null);
        } else {
          generateMockTimeSeriesData();
        }
      } catch (error) {
        console.error('Erreur de récupération des données temporelles:', error);
        generateMockTimeSeriesData();
      } finally {
        isPagesLoading.value = false;
      }
    } else {
      console.error('Erreur de récupération des données:', result.message);
      showMessage(result.message || t.analytics.error, 'error');
      isMetricsLoading.value = false;
      isPageDistributionLoading.value = false;
      isPagesLoading.value = false;
      isSourcesLoading.value = false;
      isDevicesLoading.value = false;
    }
  } catch (error) {
    console.error('Error fetching website stats:', error);
    showMessage(t.analytics.error, 'error');
    isMetricsLoading.value = false;
    isPageDistributionLoading.value = false;
    isPagesLoading.value = false;
    isSourcesLoading.value = false;
    isDevicesLoading.value = false;
  }
}

function showMessage(text: string, color: string) {
  snackbarText.value = text;
  snackbarColor.value = color;
  showSnackbar.value = true;
}

function copyTrackingCode(websiteId: string) {
  const code = generateTrackingCode(websiteId);
  navigator.clipboard.writeText(code)
    .then(() => {
      showMessage(t.analytics.copyCode, 'success');
    })
    .catch((err) => {
      console.error('Erreur lors de la copie du code:', err);
      showMessage(t.analytics.copyCodeError, 'error');
    });
}

const dateRange = ref({
  start: '',
  end: ''
});

const chartDisplayMode = ref('pie');

const topPagesForChart = computed(() => {
  if (!pageViews.value || !Array.isArray(pageViews.value)) return [];
  const sortedPages = [...pageViews.value].sort((a, b) => b.views - a.views);
  return sortedPages.slice(0, 10);
});

const pageDistributionChartData = computed(() => {
  // Vérifier si topPagesForChart.value existe et n'est pas vide
  if (!topPagesForChart.value || topPagesForChart.value.length === 0) {
    return {
      series: []
    };
  }

  const topPages = topPagesForChart.value;

  const chartData = topPages.map((page, index) => ({
    name: formatPagePath(page.page, page.cleanPath, page.isHome),
    value: page.views,
    itemStyle: {
      color: getChartColor(index)
    }
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: t.analytics.chart.pageViews || 'Vues de page',
        type: 'pie',
        radius: chartDisplayMode.value === 'pie' ? '70%' : ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: chartData
      }
    ]
  };
});

function initDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  dateRange.value = {
    start: formatDateToYYYYMMDD(start),
    end: formatDateToYYYYMMDD(end)
  };
}

const trafficSourcesChartData = computed(() => {
  // Vérifier si trafficSources.value existe et n'est pas vide
  if (!trafficSources.value || trafficSources.value.length === 0) {
    return {
      series: []
    };
  }

  return {
    darkMode: true,
    backgroundColor: '#1E1E1E',
    textStyle: {
      color: '#ffffff'
    },
    title: {
      text: t.analytics.trafficSources,
      left: 'center',
      textStyle: {
        color: '#ffffff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#cccccc'
      },
      data: trafficSources.value.map(source => getSourceLabel(source.source))
    },
    series: [
      {
        name: t.analytics.source,
        type: 'pie',
        radius: '70%',
        center: ['50%', '60%'],
        data: trafficSources.value.map(source => ({
          name: getSourceLabel(source.source),
          value: source.visitors,
          itemStyle: {
            color: getSourceColor(source.source) === 'grey' ? '#999999' :
              getSourceColor(source.source) === 'success' ? '#4CAF50' :
                getSourceColor(source.source) === 'info' ? '#2196F3' :
                  getSourceColor(source.source) === 'primary' ? '#1976D2' :
                    getSourceColor(source.source) === 'warning' ? '#FB8C00' : '#999999'
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
          color: '#ffffff'
        }
      }
    ]
  };
});


const deviceStatsChartData = computed(() => {
  if (!deviceStats.value || deviceStats.value.length === 0) {
    return {
      series: []
    };
  }

  return {
    darkMode: true,
    backgroundColor: '#1E1E1E',
    textStyle: {
      color: '#ffffff'
    },
    title: {
      text: t.analytics.deviceTypes,
      left: 'center',
      textStyle: {
        color: '#ffffff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#cccccc'
      },
      data: deviceStats.value.map(device => getDeviceLabel(device.type))
    },
    series: [
      {
        name: t.analytics.deviceTypes,
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
        data: deviceStats.value.map(device => ({
          name: getDeviceLabel(device.type),
          value: device.count,
          itemStyle: {
            color: device.type === DeviceType.DESKTOP ? '#4CAF50' :
              device.type === DeviceType.TABLET ? '#2196F3' :
                device.type === DeviceType.MOBILE ? '#FB8C00' : '#999999'
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
          color: '#ffffff'
        }
      }
    ]
  };
});

defineComponent({
  components: {
    VChart
  }
});

provide(THEME_KEY, 'dark');

function checkDataLimits() {
  if (!currentSiteAnalytics.value) return;

  const pageViewCount = pageViews.value && pageViews.value.length ? pageViews.value.reduce((sum, page) => sum + page.views, 0) : 0;
  const interactionCount = userInteractions.value && userInteractions.value.length ? userInteractions.value.length : 0;
  const sessionCount = currentSiteAnalytics.value.totalVisitors || 0;

  const totalRecords = pageViewCount + interactionCount + sessionCount;
  dataCount.value = totalRecords;
}

function generateSecurityQuestion() {
  securityNum1.value = Math.floor(Math.random() * 20) + 1;
  securityNum2.value = Math.floor(Math.random() * 20) + 1;
  securityAnswer.value = '';
  securityError.value = false;
  confirmSecurityCheck.value = false;
  showConfirmationDialog.value = true;
  showDataPurgeDialog.value = false;
}

function cancelSecurityDialog() {
  showConfirmationDialog.value = false;
  securityAnswer.value = '';
  securityError.value = false;
  confirmSecurityCheck.value = false;
}

function validateSecurityAnswer() {
  const correctAnswer = securityNum1.value + securityNum2.value;

  if (parseInt(securityAnswer.value) === correctAnswer && confirmSecurityCheck.value) {
    showConfirmationDialog.value = false;
    purgeAnalyticsData();
  } else {
    securityError.value = true;
  }
}

async function purgeAnalyticsData() {
  if (!currentSite.value) return;

  purgeLoading.value = true;
  try {
    const response = await fetch('/api/analytics/purge-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteId: currentSite.value.id,
        purgeOption: purgeOption.value
      }),
    });

    const result = await response.json();

    if (result.success) {
      snackbarText.value = `${t.engagement.purge.success} ${t.engagement.purge.successCount.replace('{count}', result.deletedCount || '')}`;
      snackbarColor.value = 'success';
      showSnackbar.value = true;

      if (currentSite.value) {
        selectSite(currentSite.value);
      }

      navigateTo('/dashboard');
    } else {
      snackbarText.value = result.message || t.engagement.purge.error;
      snackbarColor.value = 'error';
      showSnackbar.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de la purge des données:', error);
    snackbarText.value = `${t.engagement.purge.error} ${t.engagement.purge.tryAgain}`;
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    purgeLoading.value = false;
    showDataPurgeDialog.value = false;
  }
}

async function fetchSiteDataForPeriod() {
  if (!currentSite.value) return;

  isMetricsLoading.value = true;
  isPageDistributionLoading.value = true;
  isPagesLoading.value = true;
  isSourcesLoading.value = true;
  isDevicesLoading.value = true;

  try {
    const response = await fetch(`/api/analytics/website/${currentSite.value.id}?period=${selectedPeriod.value}&limit=500`);
    const result = await response.json();

    if (result.success) {
      updateAnalyticsData(result.data);
      isMetricsLoading.value = false;
      isSourcesLoading.value = false;
      isDevicesLoading.value = false;

      await loadPageDistribution();

      try {
        const timeSeriesResponse = await fetch(`/api/analytics/website/${currentSite.value.id}/time-series?period=${selectedPeriod.value}`);
        const timeSeriesResult = await timeSeriesResponse.json();

        if (timeSeriesResult.success && timeSeriesResult.data) {
          pageViewsTimeSeries.value = timeSeriesResult.data.map(item => ({
            date: item.date,
            views: item.count
          }));

          updatePageTrackingData(selectedPage.value);
        } else {
          generateMockTimeSeriesData();
        }
      } catch (error) {
        console.error('Erreur de récupération des données temporelles:', error);
        generateMockTimeSeriesData();
      } finally {
        isPagesLoading.value = false;
      }
    } else {
      console.error('Erreur de récupération des données par période:', result.message);
      showMessage(result.message || t.analytics.error, 'error');
      isMetricsLoading.value = false;
      isPageDistributionLoading.value = false;
      isPagesLoading.value = false;
      isSourcesLoading.value = false;
      isDevicesLoading.value = false;
    }
  } catch (error) {
    console.error('Error fetching website stats for period:', error);
    showMessage(t.analytics.error, 'error');
    isMetricsLoading.value = false;
    isPageDistributionLoading.value = false;
    isPagesLoading.value = false;
    isSourcesLoading.value = false;
    isDevicesLoading.value = false;
  }
}

function generateMockTimeSeriesData(useTestData = false) {
  const today = new Date();
  const data: Array<{ date: string, views: number }> = [];

  const period = useTestData ? 365 : (selectedPeriod.value === '7d' ? 7 : selectedPeriod.value === '30d' ? 30 : 90);

  for (let i = period; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    let views;
    if (useTestData) {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const baseTrend = isWeekend ? 20 : 45;

      const month = date.getMonth();
      let seasonalFactor = 1;

      if (month >= 5 && month <= 7) {
        seasonalFactor = 0.7;
      } else if (month >= 10 || month <= 1) {
        seasonalFactor = 1.3;
      }

      const growthFactor = 1 + (period - i) / period * 0.5;

      const randomVariation = Math.random() * 25 - 10;

      views = Math.max(1, Math.round((baseTrend * seasonalFactor * growthFactor) + randomVariation));

      if (Math.random() < 0.02) {
        views = views * (2 + Math.random() * 3);
      }
    } else {
      views = Math.floor(Math.random() * 45) + 5;
    }

    data.push({
      date: date.toISOString().split('T')[0],
      views: Math.round(views)
    });
  }

  pageViewsTimeSeries.value = data;
  updatePageTrackingData(selectedPage.value);
}

function updateAnalyticsData(data: any) {
  const totalVisitors = data.totalVisitors ?? 0;
  const totalPageViews = data.totalPageViews ?? 0;
  const avgSessionDuration = data.avgSessionDuration ?? 0;
  const avgPageDuration = data.avgPageDuration ?? 0;
  const bounceRate = data.bounceRate ?? 0;
  const bounceCount = data.bounceCount ?? 0;

  metrics.value = [
    {
      label: t.analytics.visitors || 'Visites',
      value: totalVisitors,
      icon: 'mdi-account-outline',
      color: 'primary'
    },
    {
      label: t.analytics.totalPageViews || 'Pages vues',
      value: totalPageViews,
      icon: 'mdi-file-document-outline',
      color: 'success'
    },
    {
      label: t.analytics.avgPageTime || 'Temps moyen / page',
      value: data.avgPageTime || formatDuration(avgPageDuration),
      icon: 'mdi-file-clock-outline',
      color: 'info'
    },
    {
      label: t.analytics.bounceRate || 'Taux de rebond',
      value: `${bounceRate}%`,
      icon: 'mdi-arrow-u-left-top',
      color: 'warning'
    }
  ];

  let processedPages = Array.isArray(data.topPages) ? data.topPages : [];

  const getNormalizedKey = (url: string): string => {
    try {
      let urlForNormalization = url;
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        urlForNormalization = 'http://' + urlObj.host + urlObj.pathname;
      }

      return normalizeUrl(urlForNormalization);
    } catch (e) {
      console.error('Erreur normalisation URL:', e);
      return url;
    }
  };

  const pageMap = new Map<string, PageView>();

  processedPages.forEach(page => {
    const cleanedPage = {
      page: page.page || 'Unknown page',
      views: typeof page.views === 'number' ? page.views : 0,
      avgTime: page.avgTime || '0m 0s',
      cleanPath: page.cleanPath || '',
      isHome: page.isHome === true,
      avgTimeSeconds: typeof page.avgTimeSeconds === 'number' ? page.avgTimeSeconds : 0,
      hasDuration: page.hasDuration === true,
      langPrefix: null as string | null
    };

    if (!cleanedPage.cleanPath && cleanedPage.page.startsWith('http')) {
      try {
        const url = new URL(cleanedPage.page);
        const pathname = url.pathname;

        const langMatch = pathname.match(/^\/(fr|en)(\/|$)/);
        const langPrefix = langMatch ? langMatch[1] : null;

        const normalizedPath = pathname.replace(/^\/(fr|en)(\/|$)/, '$2') || '/';

        cleanedPage.cleanPath = normalizedPath;
        cleanedPage.isHome = normalizedPath === '/' || normalizedPath === '';
        cleanedPage.langPrefix = langPrefix;
      } catch (error) {
        console.error('Erreur lors du traitement du chemin:', error);
      }
    }

    const normalizedPath = getNormalizedKey(cleanedPage.page);

    if (pageMap.has(normalizedPath)) {
      const existingPage = pageMap.get(normalizedPath)!;
      existingPage.views += cleanedPage.views;

      if (cleanedPage.hasDuration && existingPage.hasDuration) {
        const totalSeconds = (existingPage.avgTimeSeconds || 0) + (cleanedPage.avgTimeSeconds || 0);
        existingPage.avgTimeSeconds = totalSeconds / 2;
        existingPage.avgTime = formatDuration(existingPage.avgTimeSeconds);
      }
    } else {
      pageMap.set(normalizedPath, cleanedPage);
    }
  });

  const normalizedPages = Array.from(pageMap.values())
    .filter(page => page.page && page.page !== 'null' && page.page !== 'undefined');

  pageViews.value = normalizedPages;

  trafficSources.value = Array.isArray(data.trafficSources) ? data.trafficSources.map(source => ({
    source: source.source || 'unknown',
    visitors: typeof source.visitors === 'number' ? source.visitors : 0,
    percentage: typeof source.percentage === 'number' ? source.percentage : 0
  })) : [];

  deviceStats.value = Array.isArray(data.devices) ? data.devices.map(device => ({
    type: device.type || 'unknown',
    count: typeof device.count === 'number' ? device.count : 0,
    percentage: typeof device.percentage === 'number' ? device.percentage : 0
  })) : [];

  errorEvents.value = Array.isArray(data.errorEvents) ? data.errorEvents : [];
  userFlows.value = Array.isArray(data.userFlows) ? data.userFlows : [];
  browsers.value = Array.isArray(data.browsers) ? data.browsers : [];
  osSystems.value = Array.isArray(data.os) ? data.os : [];

  if (data.interactions && data.interactions.data) {
    userInteractions.value = Array.isArray(data.interactions.data) ? data.interactions.data : [];
    totalInteractionsCount.value = data.interactions.total || 0;
  } else {
    userInteractions.value = Array.isArray(data.userInteractions) ? data.userInteractions : [];
    totalInteractionsCount.value = userInteractions.value.length;
  }

  currentSiteAnalytics.value = {
    websiteId: currentSite.value?.id || '',
    totalVisitors: totalVisitors,
    totalPageViews: totalPageViews,
    avgSessionDuration: avgSessionDuration,
    avgPageDuration: avgPageDuration,
    avgPageTime: data.avgPageTime || formatDuration(avgPageDuration),
    pageViewsWithDuration: data.pageViewsWithDuration ?? 0,
    durationDataQuality: data.durationDataQuality ?? 0,
    bounceRate: data.bounceRate ?? 0,
    bounceCount: bounceCount,
    frustratedSessions: data.frustratedSessions ?? 0,
    timeOnSite: data.timeOnSite || '0m 0s',
    topPages: pageViews.value,
    trafficSources: trafficSources.value,
    devices: deviceStats.value,
    userFlows: userFlows.value,
    errorEvents: errorEvents.value,
    userInteractions: userInteractions.value
  };

  filteredPages.value = [...pageViews.value];

  checkDataLimits();
}

function formatUrl(url: string) {
  if (!url) return 'URL inconnue';

  try {
    let formatted = url.replace(/^https?:\/\//, '');

    formatted = formatted.replace(/^www\./, '');

    if (formatted.length > 30) {
      formatted = formatted.substring(0, 27) + '...';
    }

    return formatted;
  } catch (e) {
    console.error('Erreur lors du formatage de l\'URL:', e);
    return url;
  }
}

function getPageViewPercentage(views: number): number {
  if (!pageViews.value || !Array.isArray(pageViews.value)) return 0;
  const totalViews = pageViews.value.reduce((sum, page) => sum + page.views, 0);
  return totalViews > 0 ? (views / totalViews) * 100 : 0;
}

function expandPage(page: PageView) {
  console.log('Détails de la page:', page);
  updatePageTrackingData(page.page);
  showMessage(`Données de la page ${page.page} chargées`, 'info');
}

function filterPages() {
  filteredPages.value = pageViews.value.filter(page =>
    page.page.toLowerCase().includes(pageSearch.value.toLowerCase())
  );
}

const getItemColor = (item: PageView, isViews: boolean = false) => {
  const totalViews = pageViews.value.reduce((sum, page) => sum + page.views, 0);
  const percentage = (item.views / totalViews) * 100;
  if (percentage < 20) return 'success';
  if (percentage < 50) return 'info';
  if (percentage < 80) return 'warning';
  return 'error';
};

function exportPageData() {
  const headers = ['Page', 'Vues', 'Temps moyen'];
  const csvRows = [headers.join(',')];

  pageViews.value.forEach(page => {
    csvRows.push(`"${page.page}",${page.views},"${page.avgTime}"`);
  });

  const csvContent = csvRows.join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', `pages-${currentSite.value?.name || 'site'}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showMessage(t.analytics.exportSuccess, 'success');
}


watch(() => pageViews.value, (newPageViews) => {
  filteredPages.value = [...newPageViews];
}, { immediate: true });


const showDeleteSiteDialog = ref(false);
const deleteSiteConfirmation = ref('');
const showExportDialog = ref(false);
const exportFormat = ref('csv');
const exportOptions = ref({
  pages: true,
  interactions: true,
  errors: true,
  devices: true,
  sources: true
});

const referrerHeaders = [
  { title: 'Source', key: 'source', sortable: true },
  { title: 'URL', key: 'url', sortable: true },
  { title: 'Visites', key: 'visits', sortable: true, align: 'center' as const },
  { title: 'Dernière visite', key: 'lastVisit', sortable: true }
];

const detailedReferrers = ref<DetailedReferrer[]>([]);

async function deleteSite() {
  if (!currentSite.value || deleteSiteConfirmation.value !== currentSite.value.name) return;

  try {
    const response = await fetch(`/api/analytics/delete-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteId: currentSite.value.id
      }),
    });

    const result = await response.json();

    if (result.success) {
      snackbarText.value = t.analytics.deleteSuccess || 'Site supprimé avec succès';
      snackbarColor.value = 'success';
      showSnackbar.value = true;

      websites.value = websites.value.filter(site => site.id !== currentSite.value?.id);

      currentSite.value = null;
      currentSiteAnalytics.value = null;
    } else {
      snackbarText.value = result.message || t.analytics.deleteError || 'Erreur lors de la suppression';
      snackbarColor.value = 'error';
      showSnackbar.value = true;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du site:', error);
    snackbarText.value = t.analytics.deleteError || 'Erreur lors de la suppression';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    showDeleteSiteDialog.value = false;
    deleteSiteConfirmation.value = '';
  }
}

function refreshSiteData() {
  if (currentSite.value) {
    selectSite(currentSite.value);
    snackbarText.value = t.analytics.refreshSuccess || 'Données actualisées';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  }
}

function exportAnalyticsData() {
  if (!currentSite.value || !currentSiteAnalytics.value) return;

  let exportData: any = {
    siteInfo: {
      name: currentSite.value.name,
      url: currentSite.value.url,
      exportDate: new Date().toISOString()
    }
  };

  if (exportOptions.value.pages) {
    exportData.pages = pageViews.value;
  }

  if (exportOptions.value.interactions) {
    exportData.interactions = userInteractions.value;
  }

  if (exportOptions.value.errors) {
    exportData.errors = errorEvents.value;
  }

  if (exportOptions.value.devices) {
    exportData.devices = deviceStats.value;
  }

  if (exportOptions.value.sources) {
    exportData.sources = trafficSources.value;
  }

  let content = '';
  let filename = `analytics-${currentSite.value.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;

  if (exportFormat.value === 'json') {
    content = JSON.stringify(exportData, null, 2);
    filename += '.json';
    downloadFile(content, 'application/json', filename);
  } else {
    // Format CSV
    let csvContent = '';

    // En-tête du fichier
    csvContent += `"Données d'analytics pour ${currentSite.value.name}"\n`;
    csvContent += `"URL: ${currentSite.value.url}"\n`;
    csvContent += `"Date d'export: ${new Date().toLocaleString()}"\n\n`;

    if (exportOptions.value.pages) {
      csvContent += '"PAGES VUES"\n';
      csvContent += '"Page";"Vues";"Temps moyen"\n';
      pageViews.value.forEach(page => {
        const cleanPage = page.page.replace(/"/g, '""').replace(/[;\n\r]/g, ' ').substring(0, 250);
        csvContent += `"${cleanPage}";"${page.views}";"${page.avgTime}"\n`;
      });
      csvContent += '\n\n';
    }

    if (exportOptions.value.interactions && userInteractions.value.length) {
      csvContent += '"INTERACTIONS"\n';
      csvContent += '"Type";"Élément";"Page";"Timestamp";"Détails"\n';
      userInteractions.value.slice(0, 1000).forEach(interaction => {
        // Limiter et nettoyer les détails pour éviter les problèmes d'export
        let details = '';
        if (interaction.value) {
          try {
            const valueObj = typeof interaction.value === 'string' ? JSON.parse(interaction.value) : interaction.value;
            // Simplifier les détails complexes
            const simplifiedDetails = {};

            // Limiter les objets imbriqués et les tableaux pour garder l'export lisible
            Object.keys(valueObj).forEach(key => {
              const val = valueObj[key];
              if (typeof val === 'object' && val !== null) {
                simplifiedDetails[key] = typeof val.length === 'number' ?
                  `[Array:${val.length}]` :
                  `[Object]`;
              } else if (typeof val === 'string' && val.length > 50) {
                simplifiedDetails[key] = val.substring(0, 47) + '...';
              } else {
                simplifiedDetails[key] = val;
              }
            });

            details = JSON.stringify(simplifiedDetails).replace(/"/g, '""');
          } catch (e) {
            details = String(interaction.value).replace(/"/g, '""').substring(0, 100);
          }
        }

        // Nettoyer et tronquer chaque valeur pour assurer la compatibilité CSV
        const pageUrl = (interaction as any).pageUrl || '';
        const cleanElementSelector = (interaction.elementSelector || '')
          .replace(/"/g, '""')
          .replace(/[;\n\r]/g, ' ') // Remplacer les ; et sauts de ligne
          .substring(0, 150); // Limiter la longueur

        const cleanPageUrl = pageUrl
          .replace(/"/g, '""')
          .replace(/[;\n\r]/g, ' ')
          .substring(0, 150);

        csvContent += `"${interaction.type}";"${cleanElementSelector}";"${cleanPageUrl}";"${interaction.timestamp}";"${details}"\n`;
      });
      csvContent += '\n\n';
    }

    if (exportOptions.value.errors && errorEvents.value.length) {
      csvContent += '"ERREURS"\n';
      csvContent += '"Page";"Message";"Occurrences";"Navigateur"\n';
      errorEvents.value.forEach(error => {
        const cleanPage = error.page.replace(/"/g, '""').replace(/[;\n\r]/g, ' ').substring(0, 250);
        const cleanMessage = error.errorMessage.replace(/"/g, '""').replace(/[;\n\r]/g, ' ').substring(0, 500);
        const cleanBrowser = error.browserInfo.replace(/"/g, '""').replace(/[;\n\r]/g, ' ');
        csvContent += `"${cleanPage}";"${cleanMessage}";"${error.count}";"${cleanBrowser}"\n`;
      });
      csvContent += '\n\n';
    }

    if (exportOptions.value.devices) {
      csvContent += '"APPAREILS"\n';
      csvContent += '"Type";"Nombre";"Pourcentage"\n';
      deviceStats.value.forEach(device => {
        csvContent += `"${getDeviceLabel(device.type)}";"${device.count}";"${device.percentage}"\n`;
      });
      csvContent += '\n\n';
    }

    if (exportOptions.value.sources) {
      csvContent += '"SOURCES DE TRAFIC"\n';
      csvContent += '"Source";"Visiteurs";"Pourcentage"\n';
      trafficSources.value.forEach(source => {
        csvContent += `"${getSourceLabel(source.source)}";"${source.visitors}";"${source.percentage}"\n`;
      });
    }

    filename += '.csv';
    downloadFile(csvContent, 'text/csv', filename);
  }

  showExportDialog.value = false;

  snackbarText.value = t.analytics.exportSuccess || 'Données exportées avec succès';
  snackbarColor.value = 'success';
  showSnackbar.value = true;
}

function downloadFile(content: string, type: string, filename: string) {
  // Ajouter un BOM (Byte Order Mark) pour les fichiers CSV pour une meilleure compatibilité
  const bom = type.includes('csv') ? new Uint8Array([0xEF, 0xBB, 0xBF]) : new Uint8Array();

  // Créer un blob avec BOM + contenu
  const blob = new Blob([bom, content], { type: `${type};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const showEditSiteNameDialog = ref(false);
const editSiteName = ref('');
const updatingSiteName = ref(false);

watch(() => currentSite.value, (newSite) => {
  if (newSite) {
    editSiteName.value = newSite.name;
  }
});

function updateSiteName() {
  if (!editSiteName.value.trim()) return;

  updatingSiteName.value = true;

  fetch('/api/analytics/website/update-name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      websiteId: currentSite.value?.id,
      name: editSiteName.value
    })
  })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.success) {
        currentSite.value!.name = editSiteName.value;
        showSnackbar.value = true;
        snackbarText.value = 'Updated successfully';
        snackbarColor.value = 'success';
        showEditSiteNameDialog.value = false;
        if (websites.value) {
          const site = websites.value.find(s => s.id === currentSite.value?.id);
          if (site) {
            site.name = editSiteName.value;
          }
        }
      } else {
        showSnackbar.value = true;
        snackbarText.value = responseData.message || 'Erreur lors de la mise à jour du nom du site';
        snackbarColor.value = 'error';
      }
      updatingSiteName.value = false;
    })
    .catch(err => {
      console.error('Erreur lors de la mise à jour du nom du site:', err);
      showSnackbar.value = true;
      snackbarText.value = 'Erreur de connexion lors de la mise à jour du nom du site';
      snackbarColor.value = 'error';
      updatingSiteName.value = false;
    });
}

const showExclusionsDialog = ref(false);
const visitorExclusions = ref<Array<{ type: 'visitor' | 'user', value: string }>>([]);
const newExclusion = ref<{ type: 'visitor' | 'user', value: string }>({
  type: 'visitor',
  value: ''
});

function addExclusion() {
  if (newExclusion.value.value) {
    visitorExclusions.value.push({ ...newExclusion.value });
    newExclusion.value.value = '';
  }
}

function addCurrentVisitor() {
  const visitorId = localStorage.getItem('stackunity_visitor_id');
  if (visitorId) {
    const exists = visitorExclusions.value.some(exc =>
      exc.type === 'visitor' && exc.value === visitorId
    );

    if (!exists) {
      visitorExclusions.value.push({
        type: 'visitor',
        value: visitorId
      });
      showMessage('Votre appareil actuel a été ajouté aux exclusions', 'success');
    } else {
      showMessage('Votre appareil est déjà dans la liste des exclusions', 'info');
    }
  } else {
    showMessage('Impossible de récupérer votre identifiant visiteur', 'error');
  }
}

function removeExclusion(index: number) {
  visitorExclusions.value.splice(index, 1);
}

function saveExclusions() {
  if (!currentSite.value) return;

  try {
    const storageKey = `stackunity_exclusions_${currentSite.value.id}`;
    localStorage.setItem(storageKey, JSON.stringify(visitorExclusions.value));

    localStorage.setItem(`${storageKey}_updated`, new Date().toISOString());

    showMessage(t.analytics.exclusionsSaved || 'Exclusions sauvegardées avec succès', 'success');
    showExclusionsDialog.value = false;

    showMessage(t.analytics.exclusionsSaved ? 'Rechargez la page pour appliquer les exclusions' : 'Reload the page to apply exclusions', 'info');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des exclusions:', error);
    showMessage(t.analytics.exclusionsSaveError || 'Erreur lors de la sauvegarde des exclusions', 'error');
  }
}

function loadExclusions() {
  if (!currentSite.value) return;

  try {
    checkCurrentExclusionStatus();
    const storageKey = `stackunity_exclusions_${currentSite.value.id}`;
    const savedExclusions = localStorage.getItem(storageKey);

    if (savedExclusions) {
      const parsedExclusions = JSON.parse(savedExclusions);

      visitorExclusions.value = parsedExclusions.map(exc => {
        if (exc.type === 'ip') {
          return { type: 'visitor', value: exc.value };
        }
        return exc;
      });

    } else {
      visitorExclusions.value = [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des exclusions:', error);
    visitorExclusions.value = [];
  }
}

function getTimeColor(item: PageView) {
  if (!item.hasDuration) return 'grey';

  const seconds = item.avgTimeSeconds || 0;
  if (seconds < 10) return 'error';
  if (seconds < 30) return 'warning';
  if (seconds < 60) return 'info';
  if (seconds < 180) return 'success';
  return 'primary';
}

const pageViewsTimeSeries = ref<Array<{ date: string, views: number }>>([]);
const pagesTrackingData = ref<Array<{ date: string, page: string, views: number }>>([]);
const selectedPage = ref<string | null>(null);

function updatePageTrackingData(page: string | null) {
  selectedPage.value = page;

  if (page) {
    pagesTrackingData.value = pageViewsTimeSeries.value.map(item => ({
      date: item.date,
      page: page,
      views: Math.floor(item.views * (Math.random() * 0.5 + 0.1))
    }));
  } else {
    pagesTrackingData.value = pageViewsTimeSeries.value.map(item => ({
      date: item.date,
      page: 'Toutes les pages',
      views: item.views
    }));
  }
}

async function loadPageDistribution() {
  if (!currentSite.value) return;

  isPageDistributionLoading.value = true;

  try {
    const response = await fetch(`/api/analytics/website/${currentSite.value.id}/page-distribution?period=${selectedPeriod.value}&limit=20`);
    const result = await response.json();

    if (result.success && result.data) {
      const pages = result.data.pages.map(page => ({
        page: page.page,
        views: page.views,
        avgTime: '',
        cleanPath: page.cleanPath,
        isHome: page.isHome,
        percentage: page.percentage
      }));

      pageViews.value = pages;
      filteredPages.value = [...pages];

      snackbarText.value = t.analytics.dataLoaded || 'Données de distribution de pages chargées';
      snackbarColor.value = 'success';
      showSnackbar.value = true;
    } else {
      console.error('Erreur lors du chargement de la distribution des pages:', result.message);
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la distribution des pages:', error);
  } finally {
    isPageDistributionLoading.value = false;
  }
}

const isCurrentlyExcluded = ref(false);
const exclusionReason = ref('');

function checkCurrentExclusionStatus() {
  isCurrentlyExcluded.value = localStorage.getItem('stackunity_excluded') === 'true';
  exclusionReason.value = localStorage.getItem('stackunity_excluded_reason') || 'inconnue';
}

function removeCurrentExclusion() {
  localStorage.removeItem('stackunity_excluded');
  localStorage.removeItem('stackunity_excluded_reason');
  isCurrentlyExcluded.value = false;
  exclusionReason.value = '';
  showMessage(t.analytics.reactivateTracking || 'Tracking réactivé avec succès. Rechargez la page pour que les changements prennent effet.', 'success');
}

watch(() => showExclusionsDialog.value, (newVal) => {
  if (newVal) {
    checkCurrentExclusionStatus();
  }
});
</script>