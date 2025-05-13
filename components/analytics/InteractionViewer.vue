<template>
  <div class="analytics-container">
    <div class="analytics-header d-flex align-center mb-4">
      <h3 class="text-subtitle-1 font-weight-medium mb-0 ml-2">{{ title || t.interactions.title }}</h3>
      <v-spacer></v-spacer>
      <v-chip v-if="period && period !== 'all'" color="primary" variant="outlined" size="small" class="mr-3">
        <v-icon start size="x-small">mdi-clock-outline</v-icon>
        <span v-if="period === '7d'">{{ t.analytics?.last7days || 'Derniers 7 jours' }}</span>
        <span v-else-if="period === '30d'">{{ t.analytics?.last30days || 'Derniers 30 jours' }}</span>
        <span v-else-if="period === '90d'">{{ t.analytics?.last90days || 'Derniers 90 jours' }}</span>
      </v-chip>
      <v-btn-toggle v-model="viewMode" mandatory density="comfortable" color="primary" variant="outlined" rounded="lg">
        <v-btn value="timeline" variant="text" aria-label="Vue chronologie" size="small">
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
        <v-select v-model="selectedUrl" :items="uniqueUrls" :label="t.interactions.selectPage" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-select v-model="filterType" :items="interactionTypeOptions" :label="t.interactions.type"
          density="comfortable" variant="outlined" hide-details class="filter-select mr-2"></v-select>

        <v-text-field v-model="searchQuery" :label="t.interactions.search" prepend-inner-icon="mdi-magnify"
          density="comfortable" variant="outlined" hide-details class="filter-search"></v-text-field>

        <v-switch v-model="groupSimilarInteractions" color="primary" density="compact" hide-details
          :label="t.interactions.groupSimilar" class="ml-2 mr-2" />
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

      <v-card variant="outlined" class="pa-4 mb-4">
        <div class="chart-container">
          <v-chart class="chart" :option="timelineOption" autoresize
            aria-label="Graphique chronologique des interactions" />
        </div>
        <div class="d-flex justify-space-between mt-2 text-caption legend">
          <div><v-chip color="primary" size="x-small" class="mr-1"></v-chip> {{
            t.interactions.totalClicks.replace('Total', '') }}</div>
          <div><v-chip color="success" size="x-small" class="mr-1"></v-chip> {{ t.interactions.scrolls }}</div>
          <div><v-chip color="warning" size="x-small" class="mr-1"></v-chip> {{ t.interactions.forms }}</div>
          <div><v-chip color="deep-orange" size="x-small" class="mr-1"></v-chip> {{ t.interactions.inputs }}</div>
        </div>
      </v-card>
    </div>

    <div v-else-if="viewMode === 'heatmap'" class="analytics-content">
      <div class="analytics-filters d-flex flex-wrap align-center mb-3">
        <v-select v-model="selectedUrl" :items="uniqueUrls" :label="t.interactions.selectPage" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-chip size="small" label>{{ getInteractionCount('click') }} {{ t.interactions.clicksRecorded }}</v-chip>
        <v-spacer></v-spacer>
        <v-btn-toggle v-model="visualizationType" density="comfortable" color="primary" variant="outlined" class="mr-2">
          <v-btn value="elements" variant="text" aria-label="Vue par éléments">
            <v-icon size="small">mdi-chart-bar</v-icon>
            <span class="ml-1 d-none d-sm-inline">Bar Chart</span>
          </v-btn>
          <v-btn value="zones" variant="text" aria-label="Vue par zones">
            <v-icon size="small">mdi-chart-pie</v-icon>
            <span class="ml-1 d-none d-sm-inline">Pie Chart</span>
          </v-btn>
        </v-btn-toggle>
      </div>

      <v-card variant="outlined" class="pa-4 mb-4">
        <div class="d-flex align-center mb-4 justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
            <span>
              {{ visualizationType === 'elements' ?
                'Clicks by element (Bar Chart)' :
                'Clicks by element type (Pie Chart)'
              }}
            </span>
          </div>
        </div>

        <div v-if="visualizationType === 'elements'" class="element-visualization mb-4">
          <v-card variant="flat" class="pa-3 mb-2">
            <div class="visualization-header d-flex align-center justify-space-between mb-3">
              <h4 class="text-subtitle-2">{{ t.interactions.elementClicks }}</h4>
              <v-select v-model="elementSort" :items="elementSortOptions" :label='t.interactions.sortBy'
                density="compact" variant="outlined" hide-details style="max-width: 150px;"></v-select>
            </div>

            <div v-if="elementClickData.length === 0" class="text-center py-4">
              <v-icon icon="mdi-chart-timeline-variant" size="48" color="grey-darken-1" class="mb-2"></v-icon>
              <div class="text-body-1 text-medium-emphasis">{{ t.interactions.notAvailable }}</div>
            </div>

            <div v-else class="chart-container">
              <v-chart class="chart" :option="chartOption" autoresize
                :aria-label="t.interactions.elementClicksDescription" />
            </div>
          </v-card>
        </div>

        <div v-else class="zone-visualization mb-4">
          <v-card variant="flat" class="pa-3 mb-4">
            <div class="visualization-header d-flex align-center justify-space-between mb-3">
              <h4 class="text-subtitle-2">{{ t.interactions.elementClicks }}</h4>
            </div>

            <div v-if="elementClickData.length === 0" class="text-center py-4">
              <v-icon icon="mdi-chart-timeline-variant" size="48" color="grey-darken-1" class="mb-2"></v-icon>
              <div class="text-body-1 text-medium-emphasis">{{ t.interactions.notAvailable }}</div>
            </div>

            <div v-else class="chart-container">
              <v-chart class="chart" :option="chartOption" autoresize
                :aria-label="t.interactions.elementClicksDescription" />
            </div>
          </v-card>

          <v-card variant="flat" class="pa-3">
            <h4 class="text-subtitle-2 mb-3">{{ t.interactions.elementClicks }}</h4>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>{{ t.interactions.elementType }}</th>
                  <th>{{ t.interactions.numberOfClicks }}</th>
                  <th>{{ t.interactions.percentage }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in elementTypeData" :key="index">
                  <td>
                    <div class="d-flex align-center">
                      <v-icon size="small" :color="getElementTypeColor(item.type)" class="mr-2">
                        {{ getElementTypeIcon(item.type) }}
                      </v-icon>
                      {{ getElementTypeName(item.type) }}
                    </div>
                  </td>
                  <td>{{ item.value }}</td>
                  <td>
                    <div class="d-flex align-center">
                      <v-progress-linear :model-value="getElementPercentage(item.value)"
                        :color="getElementTypeColor(item.type)" height="6" rounded class="mr-2" style="width: 60px;">
                      </v-progress-linear>
                      {{ Math.round(getElementPercentage(item.value)) }}%
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
      </v-card>
    </div>

    <div v-else class="analytics-content">
      <div class="analytics-filters d-flex flex-wrap align-center mb-3">
        <v-select v-model="selectedUrl" :items="uniqueUrls" :label="t.interactions.selectPage" density="comfortable"
          variant="outlined" hide-details class="filter-select mr-2"></v-select>
        <v-select v-model="filterType" :items="interactionTypeOptions" :label="t.interactions.type"
          density="comfortable" variant="outlined" hide-details class="filter-select mr-2"></v-select>

        <v-text-field v-model="searchQuery" :label="t.interactions.search" prepend-inner-icon="mdi-magnify"
          density="comfortable" variant="outlined" hide-details class="filter-search"></v-text-field>

        <v-switch v-model="groupSimilarInteractions" color="primary" density="compact" hide-details
          :label="t.interactions.groupSimilar" class="ml-2 mr-2" />

        <v-spacer></v-spacer>

        <v-select v-model="groupByOption" :items="groupByOptions" :label="t.interactions.groupBy" density="comfortable"
          variant="outlined" hide-details class="filter-select ml-2" style="max-width: 150px;"></v-select>
      </div>

      <v-tabs v-model="dataViewTab" density="comfortable" color="primary" class="mb-4">
        <v-tab value="cards">
          <v-icon size="small" class="mr-2">mdi-card-bulleted-outline</v-icon>
          {{ t.interactions.cards }}
        </v-tab>
        <v-tab value="table">
          <v-icon size="small" class="mr-2">mdi-table</v-icon>
          {{ t.interactions.table }}
        </v-tab>
      </v-tabs>

      <v-window v-model="dataViewTab">
        <v-window-item value="cards">
          <div class="interaction-cards mb-4">
            <div v-for="(group, index) in interactionGroups" :key="index" class="interaction-group mb-6"
              :data-type="group.type">
              <div class="d-flex align-center mb-4">
                <v-chip :color="getInteractionColor(group.type)" class="mr-2">
                  {{ group.type }}
                </v-chip>
                <div class="text-subtitle-2 font-weight-medium">{{ group.items.length }} {{ t.interactions.interactions
                }}</div>
                <v-spacer></v-spacer>
                <v-btn variant="text" size="small" :color="getInteractionColor(group.type)"
                  @click.stop="toggleExpansion(group.type)">
                  {{ isExpanded(group.type) ? t.interactions.collapse : t.interactions.expand }}
                  <v-icon right>{{ isExpanded(group.type) ? 'mdi-chevron-up' : 'mdi-chevron-down'
                  }}</v-icon>
                </v-btn>
              </div>

              <v-expand-transition>
                <div v-if="isExpanded(group.type)">
                  <v-row>
                    <v-col v-for="(item, itemIndex) in group.items.slice(0, 9)" :key="itemIndex" cols="12" sm="6"
                      md="4">
                      <v-card variant="outlined" hover class="interaction-card h-100"
                        @click="selectedInteraction = item">
                        <v-card-item>
                          <div class="d-flex align-center">
                            <v-icon :color="getInteractionColor(item.type)" size="small" class="mr-2">
                              {{ getInteractionTypeIcon(item.type) }}
                            </v-icon>
                            <v-card-subtitle class="pa-0 text-truncate" style="max-width: 180px;"
                              :title="formatTimestamp(item.timestamp)">
                              {{ formatTimestamp(item.timestamp) }}
                            </v-card-subtitle>
                            <v-spacer></v-spacer>
                            <v-chip v-if="item.count && item.count > 1" size="x-small"
                              :color="getInteractionColor(item.type)" class="ml-2">
                              {{ item.count }}x
                            </v-chip>
                          </div>
                        </v-card-item>

                        <v-card-text class="pt-0">
                          <div v-if="item.elementSelector" class="element-section">
                            <div class="d-flex align-center">
                              <v-icon size="x-small"
                                :color="getElementTypeColor(determineElementType({ elementSelector: item.elementSelector }))"
                                class="mr-1">
                                {{ getElementTypeIcon(determineElementType({ elementSelector: item.elementSelector }))
                                }}
                              </v-icon>
                              <div class="text-caption text-medium-emphasis">{{ t.interactions.element }}</div>
                            </div>
                            <div class="text-caption selector-text text-truncate" style="max-width: 100%;"
                              :title="item.elementSelector">
                              {{ item.elementSelector }}
                            </div>
                          </div>

                          <div v-if="item.type === 'scroll_depth' && item.value && item.value.depth"
                            class="scroll-section mt-2">
                            <div class="d-flex align-center">
                              <v-icon size="x-small" color="success" class="mr-1">mdi-gesture-swipe</v-icon>
                              <div class="text-caption text-medium-emphasis">{{ t.interactions.scrollDepth }}</div>
                            </div>
                            <div class="d-flex align-center mt-1">
                              <v-progress-linear :model-value="item.value.depth" color="success" rounded height="6"
                                class="mr-2" style="min-width: 60px;"></v-progress-linear>
                              <div class="text-caption">{{ item.value.depth }}% {{ t.interactions.page }}</div>
                            </div>
                            <div v-if="item.value.pixelY" class="text-caption mt-1">
                              {{ t.interactions.position }} {{ Math.round(Number(item.value.pixelY)) }}px
                              <span v-if="item.value.documentHeight">/ {{ Math.round(Number(item.value.documentHeight))
                              }}px</span>
                            </div>
                          </div>

                          <div v-if="item.type === 'input_change'" class="input-section mt-2">
                            <div class="d-flex align-center">
                              <v-icon size="x-small" color="warning" class="mr-1">
                                {{ getElementTypeIcon(determineElementType({ elementSelector: item.elementSelector }))
                                }}
                              </v-icon>
                              <div class="text-caption text-medium-emphasis">Champ</div>
                            </div>
                            <div
                              v-if="item.value.fieldPurpose && item.value.fieldPurpose !== 'other' && item.value.fieldPurpose !== 'unknown'"
                              class="text-caption">Type: {{ formatFieldPurpose(item.value.fieldPurpose) }}</div>
                            <div v-if="item.value.fieldName" class="text-caption">Nom: {{ item.value.fieldName }}</div>
                            <div v-if="item.value.hasValue" class="text-caption">
                              <v-chip size="x-small" :color="item.value.isValid === false ? 'error' : 'success'"
                                class="mr-1">
                                {{ item.value.isValid === false ? 'Invalide' : 'Valide' }}
                              </v-chip>
                              <span>{{ item.value.valueLength }} {{ t.interactions.characters }}</span>
                            </div>
                          </div>

                          <div v-if="item.pageUrl" class="url-section mt-2">
                            <div class="d-flex align-center">
                              <v-icon size="x-small" color="primary" class="mr-1">mdi-web</v-icon>
                              <div class="text-caption text-medium-emphasis">{{ t.interactions.page }}</div>
                            </div>
                            <div class="text-caption url-text text-truncate" :title="item.pageUrl">
                              {{ formatUrl(item.pageUrl) }}
                            </div>
                          </div>

                          <div v-if="getInteractionDetailsSummary(item)" class="details-section mt-2">
                            <div class="d-flex align-center">
                              <v-icon size="x-small" color="info" class="mr-1">mdi-information-outline</v-icon>
                              <div class="text-caption text-medium-emphasis">{{ t.interactions.details }}</div>
                            </div>
                            <div class="text-caption details-text">
                              {{ getInteractionDetailsSummary(item) }}
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <div v-if="group.items.length > 9" class="text-center mt-2">
                    <v-btn variant="outlined" size="small" :color="getInteractionColor(group.type)"
                      @click="showMoreItems(group)">
                      {{ t.interactions.seeMore }} {{ group.items.length - 9 }} {{ t.interactions.interactions }}
                    </v-btn>
                  </div>
                </div>
              </v-expand-transition>

              <v-card v-if="!isExpanded(group.type)" variant="flat" class="group-summary pa-3">
                <div class="d-flex flex-wrap">
                  <v-chip v-for="n in Math.min(5, group.items.length)" :key="n" class="ma-1" size="small"
                    variant="outlined" :color="getInteractionColor(group.type)">
                    {{ getItemPreview(group.items[n - 1]) }}
                  </v-chip>
                  <v-chip v-if="group.items.length > 5" class="ma-1" size="small"
                    :color="getInteractionColor(group.type)" variant="tonal">
                    +{{ group.items.length - 5 }} {{ t.interactions.others }}
                  </v-chip>
                </div>
              </v-card>
            </div>
          </div>

          <div v-if="interactionGroups.length === 0" class="text-center py-8">
            <v-icon icon="mdi-emoticon-sad-outline" size="48" color="grey-darken-1" class="mb-2"></v-icon>
            <div class="text-body-1 text-medium-emphasis">{{ t.interactions.noInteractionsFound }}</div>
          </div>

          <div v-if="props.interactions.hasMore" class="d-flex justify-center mt-4">
            <v-btn color="primary" variant="outlined" @click="loadMoreInteractions" :loading="loading">
              {{ t.interactions.loadMore }}
            </v-btn>
          </div>
        </v-window-item>

        <v-window-item value="table">
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

            <template v-slot:item.elementSelector="{ item }">
              <div class="d-flex align-center">
                <v-icon size="small"
                  :color="getElementTypeColor(determineElementType({ elementSelector: item.elementSelector }))"
                  class="mr-2">
                  {{ getElementTypeIcon(determineElementType({ elementSelector: item.elementSelector })) }}
                </v-icon>
                <span class="text-body-1 text-truncate selector-text" style="max-width: 300px;"
                  :title="item.elementSelector">
                  {{ item.elementSelector }}
                </span>
              </div>
            </template>

            <template v-slot:item.details="{ item }">
              <span class="text-body-1">
                {{ formatInteractionDetails(item) }}
              </span>
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
        </v-window-item>
      </v-window>
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
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.type }}</div>
              <div class="d-flex align-center">
                <v-chip :color="getInteractionColor(selectedInteraction.type)" size="small"
                  class="font-weight-medium mr-2">
                  {{ selectedInteraction.type }}
                </v-chip>
                <span v-if="selectedInteraction.count && selectedInteraction.count > 1" class="text-caption">
                  ({{ selectedInteraction.count }}x {{ t.interactions.occurrences }})
                </span>
              </div>
            </v-col>

            <v-col cols="12" md="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.element }}</div>
              <div class="d-flex align-center">
                <v-icon size="small"
                  :color="getElementTypeColor(determineElementType({ elementSelector: selectedInteraction.elementSelector }))"
                  class="mr-2">
                  {{ getElementTypeIcon(determineElementType({ elementSelector: selectedInteraction.elementSelector }))
                  }}
                </v-icon>
                <div class="text-body-1 selector-text">{{ selectedInteraction.elementSelector }}</div>
              </div>
              <div class="text-caption mt-1">
                {{ t.interactions.elementType }}: {{ getElementTypeName(determineElementType({
                  elementSelector:
                    selectedInteraction.elementSelector
                })) }}
              </div>
            </v-col>

            <v-col v-if="selectedInteraction.pageUrl || getPageUrl(selectedInteraction)" cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.url }}</div>
              <div class="text-body-1">{{ getPageUrl(selectedInteraction) || 'URL non disponible' }}</div>
            </v-col>

            <v-col v-if="selectedInteraction.elementText" cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.text }}</div>
              <div class="text-body-1">{{ selectedInteraction.elementText }}</div>
            </v-col>

            <v-col
              v-if="selectedInteraction.type === 'scroll_depth' && selectedInteraction.value && selectedInteraction.value.depth"
              cols="12" class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.scrollDepth }}</div>
              <v-card variant="outlined" class="pa-3">
                <div class="d-flex align-center mb-2">
                  <v-progress-linear :model-value="selectedInteraction.value.depth" color="success" height="12" rounded
                    class="mr-3" style="width: 200px;"></v-progress-linear>
                  <div class="text-h6 font-weight-bold">{{ selectedInteraction.value.depth }}%</div>
                </div>

                <div class="d-flex align-center mb-2">
                  <v-icon color="info" size="small" class="mr-2">mdi-ruler</v-icon>
                  <div class="text-body-1">
                    Position: {{ Math.round(Number(selectedInteraction.value.pixelY || 0)) }}px
                    <span v-if="selectedInteraction.value.documentHeight">sur {{
                      Math.round(Number(selectedInteraction.value.documentHeight)) }}px de hauteur totale</span>
                  </div>
                </div>

                <div class="d-flex align-center">
                  <v-icon color="primary" size="small" class="mr-2">mdi-monitor</v-icon>
                  <div class="text-body-1">
                    Viewport: {{ Math.round(Number(selectedInteraction.value.viewportHeight || 0)) }}px
                    <span v-if="selectedInteraction.value.documentHeight">
                      ({{ Math.round((Number(selectedInteraction.value.viewportHeight || 0) /
                        Number(selectedInteraction.value.documentHeight)) * 100) }}% de la page visible)
                    </span>
                  </div>
                </div>

                <v-divider class="my-3"></v-divider>

                <div class="d-flex align-center">
                  <v-icon color="warning" size="small" class="mr-2">mdi-map-marker-radius</v-icon>
                  <div class="text-body-1">
                    Zone:
                    <v-chip v-if="selectedInteraction.value.depth < 25" color="info" size="small" class="ml-2">Haut de
                      page</v-chip>
                    <v-chip v-else-if="selectedInteraction.value.depth < 50" color="success" size="small"
                      class="ml-2">Premier tiers</v-chip>
                    <v-chip v-else-if="selectedInteraction.value.depth < 75" color="warning" size="small"
                      class="ml-2">Milieu de page</v-chip>
                    <v-chip v-else-if="selectedInteraction.value.depth < 90" color="deep-orange" size="small"
                      class="ml-2">Bas de page</v-chip>
                    <v-chip v-else color="error" size="small" class="ml-2">Pied de page</v-chip>
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-col v-if="selectedInteraction.type === 'input_change' && selectedInteraction.value" cols="12"
              class="py-1">
              <div class="text-overline text-medium-emphasis mb-1">{{ t.interactions.fieldDetails }}</div>
              <v-card variant="outlined" class="pa-3">
                <div class="d-flex align-center mb-3">
                  <v-icon
                    :color="getElementTypeColor(determineElementType({ elementSelector: selectedInteraction.elementSelector }))"
                    size="small" class="mr-2">
                    {{ getElementTypeIcon(determineElementType({
                      elementSelector: selectedInteraction.elementSelector
                    })) }}
                  </v-icon>
                  <div class="text-h6">
                    {{ selectedInteraction.value.fieldName ||
                      (selectedInteraction.value.fieldPurpose && selectedInteraction.value.fieldPurpose !== 'other' &&
                        selectedInteraction.value.fieldPurpose !== 'unknown' ?
                        formatFieldPurpose(selectedInteraction.value.fieldPurpose) : t.interactions.inputField) }}
                  </div>
                </div>

                <v-list density="compact" class="bg-transparent pa-0">
                  <v-list-item
                    v-if="selectedInteraction.value.fieldPurpose && selectedInteraction.value.fieldPurpose !== 'other' && selectedInteraction.value.fieldPurpose !== 'unknown'">
                    <template v-slot:prepend>
                      <v-icon color="primary" size="small">mdi-tag</v-icon>
                    </template>
                    <v-list-item-title>{{ t.interactions.type }}: {{
                      formatFieldPurpose(selectedInteraction.value.fieldPurpose)
                    }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="selectedInteraction.value.inputType">
                    <template v-slot:prepend>
                      <v-icon color="info" size="small">mdi-form-dropdown</v-icon>
                    </template>
                    <v-list-item-title>{{ t.interactions.htmlType }}: {{ selectedInteraction.value.inputType
                    }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="selectedInteraction.value.hasValue">
                    <template v-slot:prepend>
                      <v-icon color="warning" size="small">mdi-text-box-outline</v-icon>
                    </template>
                    <v-list-item-title>
                      {{ t.interactions.value }}: {{ selectedInteraction.value.valueLength }} {{
                        t.interactions.characters
                      }}
                      <v-chip v-if="selectedInteraction.value.isValid !== undefined"
                        :color="selectedInteraction.value.isValid ? 'success' : 'error'" size="x-small" class="ml-2">
                        {{ selectedInteraction.value.isValid ? t.interactions.valid : t.interactions.invalid }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="selectedInteraction.value.validationError">
                    <template v-slot:prepend>
                      <v-icon color="error" size="small">mdi-alert-circle</v-icon>
                    </template>
                    <v-list-item-title>{{ t.interactions.error }}: {{ selectedInteraction.value.validationError
                    }}</v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="selectedInteraction.value.required !== undefined">
                    <template v-slot:prepend>
                      <v-icon size="small">mdi-asterisk</v-icon>
                    </template>
                    <v-list-item-title>{{ t.interactions.required }}: {{ selectedInteraction.value.required ?
                      t.interactions.yes : t.interactions.no }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
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

import { BarChart, HeatmapChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, defineComponent, nextTick, onMounted, provide, ref, watch } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import '../../css/interactions.css';
import { useTranslations } from '../../languages';
import { normalizeUrl } from '../../utils/analytics/functions';
import { formatFieldPurpose, formatSelectedValue, formatTimestamp, formatUrl, getInteractionTypeIcon, getMetricCardColor, getPageUrl } from '../../utils/analytics/interactions/function';
import { ExtendedUserInteraction, TimelineSeriesData } from '../../utils/analytics/types';

use([
  CanvasRenderer,
  ScatterChart,
  LineChart,
  HeatmapChart,
  BarChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  TitleComponent
]);

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
const filterType = ref('All');
const searchQuery = ref('');
const loading = ref(false);
const currentPage = ref(1);
const selectedUrl = ref('All Pages');
const itemsPerPage = ref(50);
const itemsPerPageOptions = [10, 25, 50, 100, 200, -1];
const groupByOption = ref('aucun');
const groupByOptions = [
  { title: 'No grouping', value: 'aucun' },
  { title: 'By Element', value: 'element' },
  { title: 'By Type', value: 'type' },
  { title: 'By Page', value: 'page' }
];

const excludedInteractionTypes = ['page_viewexit', 'pageViewExit', 'visibility_snapshot', 'segment_visibility', 'page_duration', 'pageVisitDuration', 'page_exit'];
const interactionTypeOptions = ['All', 'click', 'scroll_depth', 'scroll', 'form_submit', 'input_change'];

const t = useTranslations('analytics')();

const headers = [
  { title: t.interactions.type, key: 'type', sortable: true },
  { title: 'URL', key: 'pageUrl', sortable: true, width: '25%' },
  { title: t.interactions.element, key: 'elementSelector', sortable: true, width: '25%' },
  { title: t.interactions.details, key: 'details', sortable: false, width: '25%' },
  { title: t.interactions.actions, key: 'actions', sortable: false, width: '60px' }
];

const uniqueUrls = computed(() => {
  const urlMap = new Map();

  urlMap.set('All Pages', 'All Pages');

  props.interactions.data.forEach(interaction => {
    if (interaction.pageUrl && interaction.pageUrl !== 'Unknown URL') {
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

    if (selectedUrl.value !== 'All Pages') {
      if (!interaction.pageUrl) return false;

      const normalizedInteractionUrl = normalizeUrl(interaction.pageUrl);
      const normalizedSelectedUrl = normalizeUrl(selectedUrl.value);

      return normalizedInteractionUrl === normalizedSelectedUrl;
    }

    return true;
  });
});

const groupSimilarInteractions = ref(true);

const filteredInteractions = computed(() => {
  let interactions = props.interactions.data.filter(interaction =>
    !excludedInteractionTypes.includes(interaction.type)
  );

  if (selectedUrl.value && selectedUrl.value !== 'All Pages') {
    interactions = interactions.filter(interaction => {
      // Vérifier si l'URL correspond, en gérant les cas où l'URL est undefined
      if (!interaction.pageUrl) return false;

      // Normaliser les URLs pour une comparaison plus fiable
      const normalizedInteractionUrl = normalizeUrl(interaction.pageUrl);
      const normalizedSelectedUrl = normalizeUrl(selectedUrl.value);

      return normalizedInteractionUrl === normalizedSelectedUrl;
    });
  }

  if (filterType.value && filterType.value !== 'All') {
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

  if (groupSimilarInteractions.value) {
    const groups = new Map();
    interactions.forEach(interaction => {
      let key;

      if (groupByOption.value === 'element' && interaction.elementSelector) {
        key = `element-${interaction.elementSelector}`;
      } else if (groupByOption.value === 'type') {
        key = `type-${interaction.type}`;
      } else if (groupByOption.value === 'page' && interaction.pageUrl) {
        key = `page-${interaction.pageUrl}`;
      } else {
        // Comportement par défaut
        key = interaction.type === 'scroll_depth' && interaction.value && interaction.value.depth
          ? `${interaction.type}-${interaction.elementSelector}-depth-${interaction.value.depth}`
          : `${interaction.type}-${interaction.elementSelector}`;
      }

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

const timelineData = computed<TimelineSeriesData>(() => {
  const series: TimelineSeriesData = {
    click: [],
    scroll: [],
    form_submit: [],
    input_change: []
  };

  if (filteredInteractionsByUrl.value.length === 0) {
    return series;
  }

  let oldestDate = new Date();
  let newestDate = new Date(0);

  filteredInteractionsByUrl.value.forEach(interaction => {
    const time = new Date(interaction.timestamp);
    if (time < oldestDate) oldestDate = new Date(time);
    if (time > newestDate) newestDate = new Date(time);
  });

  const timeRange = newestDate.getTime() - oldestDate.getTime();

  let aggregationStep = 3600000; // 1 heure par défaut
  let formatTime = (date: Date) => `${date.getHours()}:00`;

  if (timeRange > 7 * 24 * 3600000) {
    aggregationStep = 24 * 3600000;
    formatTime = (date: Date) => date.toLocaleDateString();
  } else if (timeRange < 12 * 3600000) {
    aggregationStep = 900000;
    formatTime = (date: Date) => `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  }

  const aggregatedData: {
    [timeKey: string]: {
      click: number;
      scroll: number;
      form_submit: number;
      input_change: number;
      timestamp: number;
    }
  } = {};

  filteredInteractionsByUrl.value.forEach(interaction => {
    const time = new Date(interaction.timestamp);
    const timeKey = Math.floor(time.getTime() / aggregationStep) * aggregationStep;

    if (!aggregatedData[timeKey]) {
      aggregatedData[timeKey] = {
        click: 0,
        scroll: 0,
        form_submit: 0,
        input_change: 0,
        timestamp: timeKey
      };
    }

    if (interaction.type === 'click') {
      aggregatedData[timeKey].click += 1;
    } else if (interaction.type === 'scroll' || interaction.type === 'scroll_depth') {
      aggregatedData[timeKey].scroll += 1;
    } else if (interaction.type === 'form_submit') {
      aggregatedData[timeKey].form_submit += 1;
    } else if (interaction.type === 'input_change') {
      aggregatedData[timeKey].input_change += 1;
    }
  });

  const timeKeys = Object.keys(aggregatedData).sort();

  timeKeys.forEach(timeKey => {
    const data = aggregatedData[timeKey];
    const formattedTime = formatTime(new Date(data.timestamp));

    series.click.push({
      value: [data.timestamp, data.click],
      name: formattedTime,
      itemStyle: { color: '#1976D2' }
    });

    series.scroll.push({
      value: [data.timestamp, data.scroll],
      name: formattedTime,
      itemStyle: { color: '#4CAF50' }
    });

    series.form_submit.push({
      value: [data.timestamp, data.form_submit],
      name: formattedTime,
      itemStyle: { color: '#FB8C00' }
    });

    series.input_change.push({
      value: [data.timestamp, data.input_change],
      name: formattedTime,
      itemStyle: { color: '#FF5722' }
    });
  });

  return series;
});

const timelineOption = computed(() => {
  const data = timelineData.value;

  return {
    backgroundColor: 'transparent',
    textStyle: {
      color: '#ffffff'
    },
    title: {
      text: t.interactions.timeline,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        color: '#e0e0e0'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let content = ``;

        params.forEach(param => {
          content += `
            <div style="display: flex; justify-content: space-between; margin-top: 3px;">
              <span style="color:${param.color};">● ${param.seriesName}:</span>
              <span style="font-weight: bold;">${param.value[1]}</span>
            </div>
          `;
        });

        return content;
      }
    },
    legend: {
      data: [t.interactions.clicks, t.interactions.scrolls, t.interactions.forms, t.interactions.inputs],
      top: 30,
      textStyle: {
        color: '#cccccc'
      }
    },
    grid: {
      left: 60,
      right: 30,
      top: 70,
      bottom: 60
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      },
      axisLabel: {
        color: '#cccccc',
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: t.interactions.interactions,
      nameTextStyle: {
        color: '#cccccc'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#333333'
        }
      },
      axisLabel: {
        color: '#cccccc'
      },
      axisLine: {
        lineStyle: {
          color: '#555'
        }
      }
    },
    series: [
      {
        name: t.interactions.clicks,
        type: 'line',
        sampling: 'average',
        data: data.click.map(item => item.value),
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#1976D2',
          width: 2
        },
        itemStyle: {
          color: '#1976D2'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(25, 118, 210, 0.3)' },
              { offset: 1, color: 'rgba(25, 118, 210, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        smooth: 0.1
      },
      {
        name: t.interactions.scrolls,
        type: 'line',
        sampling: 'average',
        data: data.scroll.map(item => item.value),
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#4CAF50',
          width: 2
        },
        itemStyle: {
          color: '#4CAF50'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
              { offset: 1, color: 'rgba(76, 175, 80, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        smooth: 0.1
      },
      {
        name: t.interactions.forms,
        type: 'line',
        sampling: 'average',
        data: data.form_submit.map(item => item.value),
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#FB8C00',
          width: 2
        },
        itemStyle: {
          color: '#FB8C00'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(251, 140, 0, 0.3)' },
              { offset: 1, color: 'rgba(251, 140, 0, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        smooth: 0.1
      },
      {
        name: t.interactions.inputs,
        type: 'line',
        sampling: 'average',
        data: data.input_change.map(item => item.value),
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#FF5722',
          width: 2
        },
        itemStyle: {
          color: '#FF5722'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 87, 34, 0.3)' },
              { offset: 1, color: 'rgba(255, 87, 34, 0.05)' }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        smooth: 0.1
      }
    ],
    animation: true
  };
});

const viewportScale = ref(1);
const viewportRef = ref<HTMLElement | null>(null);

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

      // Coordonnées absolues du clic
      const x = hasPageProps ? Number(value.pageX) : (Number(value.x) || Number(value.clientX) || 0);
      const y = hasPageProps ? Number(value.pageY) : (Number(value.y) || Number(value.clientY) || 0);

      // Dimensions de la page où le clic a été enregistré
      const pageWidth = hasPageProps ? Number(value.pageWidth) : 1366;
      const pageHeight = hasPageProps ? Number(value.pageHeight) : 768;

      // Coordonnées relatives (pourcentage) pour s'adapter à différentes tailles d'écran
      const relativeX = hasPageProps ? (x / pageWidth) * actualDimensions.value.width : x;
      const relativeY = hasPageProps ? (y / pageHeight) * actualDimensions.value.height : y;

      // Pour le tooltip ou informations supplémentaires
      const elementText = interaction.elementText || value.elementText || '';

      // Mise à jour des dimensions globales si on trouve des données de page valides
      if (hasPageProps && value.pageWidth > 0 && value.pageHeight > 0) {
        // Mettre à jour deviceDimensions seulement si on n'a pas déjà défini
        if (deviceDimensions.value.width === 1024 && deviceDimensions.value.height === 768) {
          deviceDimensions.value = {
            width: Number(value.pageWidth),
            height: Number(value.pageHeight)
          };
        }
      }

      return {
        x,
        y,
        relativeX,
        relativeY,
        pageWidth,
        pageHeight,
        elementText,
        elementSelector: interaction.elementSelector || value.elementSelector || ''
      };
    });
});

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
    const documentHeight = interaction.value.documentHeight || 0;
    const viewportHeight = interaction.value.viewportHeight || 0;

    let scrollDetails = `${depth}% de profondeur (${Math.round(Number(pixelY))}px)`;

    if (documentHeight > 0) {
      const visiblePercent = viewportHeight > 0 ? Math.round((viewportHeight / documentHeight) * 100) : 0;
      scrollDetails += ` | Page visible: ${visiblePercent}%`;
    }

    // Catégoriser le défilement
    if (depth < 25) {
      scrollDetails += ' | Zone: Haut de page';
    } else if (depth < 50) {
      scrollDetails += ' | Zone: Premier tiers';
    } else if (depth < 75) {
      scrollDetails += ' | Zone: Milieu de page';
    } else if (depth < 90) {
      scrollDetails += ' | Zone: Bas de page';
    } else {
      scrollDetails += ' | Zone: Pied de page';
    }

    return scrollDetails;
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

    // Catégoriser le défilement
    const depthPercentage = (position / total) * 100;
    if (depthPercentage < 25) {
      description += ' | Haut de page';
    } else if (depthPercentage < 50) {
      description += ' | Premier tiers';
    } else if (depthPercentage < 75) {
      description += ' | Milieu de page';
    } else if (depthPercentage < 90) {
      description += ' | Bas de page';
    } else {
      description += ' | Pied de page';
    }
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

        // Ajouter le type d'élément déterminé
        const elementType = determineElementType({ elementSelector: interaction.elementSelector });
        if (elementType !== 'other') {
          clickDetails += clickDetails ? ` | Type: ${getElementTypeName(elementType)}` :
            `Type d'élément: ${getElementTypeName(elementType)}`;
        }

        return countPrefix + (clickDetails || t.interactions.detailsNotAvailable);
      case 'form_submit':
        let formDetails = '';

        if (interaction.value.formId || interaction.value.action) {
          formDetails = `Formulaire: ${interaction.value.formId || interaction.value.action || t.interactions.notIdentified}`;
        }

        if (interaction.value.fields && Array.isArray(interaction.value.fields)) {
          formDetails += ` | ${interaction.value.fields.length} champs`;
        }

        if (interaction.value.success !== undefined) {
          formDetails += ` | Statut: ${interaction.value.success ? 'Succès' : 'Échec'}`;
        }

        return countPrefix + (formDetails || t.interactions.detailsNotAvailable);
      case 'input_change':
        let inputInfo: string[] = [];

        // Type de champ déterminé
        const inputType = determineElementType({ elementSelector: interaction.elementSelector });
        if (inputType.startsWith('input-')) {
          inputInfo.push(`Type: ${getElementTypeName(inputType)}`);
        } else if (interaction.value.inputType) {
          inputInfo.push(`Type: ${interaction.value.inputType}`);
        }

        // Informations sur la valeur
        if (interaction.value.hasValue) {
          inputInfo.push(`Valeur présente (${interaction.value.valueLength} caractères)`);
        }

        // Objectif du champ
        if (interaction.value.fieldPurpose && interaction.value.fieldPurpose !== 'other' && interaction.value.fieldPurpose !== 'unknown') {
          inputInfo.push(`Fonction: ${formatFieldPurpose(interaction.value.fieldPurpose)}`);
        }

        // Nom du champ
        if (interaction.value.fieldName) {
          inputInfo.push(`Champ: ${interaction.value.fieldName}`);
        }

        // État de validation
        if (typeof interaction.value.isValid !== 'undefined') {
          inputInfo.push(interaction.value.isValid ? 'Valide' : 'Invalide');

          if (interaction.value.validationError) {
            inputInfo.push(`Erreur: ${interaction.value.validationError}`);
          }
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
  // Dimensions fixes par type d'appareil
  const width = isMobileDevice.value ? 390 : isTabletDevice.value ? 768 : 1366;
  const height = isMobileDevice.value ? 844 : isTabletDevice.value ? 1024 : 768;

  // Définir des dimensions simples sans calculs complexes
  actualDimensions.value = { width, height };
  frameScale.value = 1.0; // Échelle fixe de 1.0

  // Appliquer les dimensions au conteneur de la heatmap
  if (heatmapContainer.value) {
    heatmapContainer.value.style.width = `${width}px`;
    heatmapContainer.value.style.height = `${height}px`;
  }
}

watch([selectedDevice, showWebsiteFrame], () => {
  updateHeatmapDimensions();
}, { immediate: false });

watch(clickDotsData, () => {
  setTimeout(() => {
    updateHeatmapDimensions();
  }, 300);
}, { immediate: false });

const visualizationType = ref('elements');
const elementSort = ref('clicks');
const elementSortOptions = [
  { title: t.interactions.clicksDescending, value: 'clicks' },
  { title: t.interactions.name, value: 'name' }
];

const elementClickData = computed(() => {
  const elementsMap = new Map();

  filteredInteractionsByUrl.value
    .filter(i => i.type === 'click')
    .forEach(interaction => {
      let elementKey = interaction.elementSelector || 'Unknown';
      elementKey = elementKey.replace(/\s*>\s*/g, ' > ')
        .replace(/:nth-child\(\d+\)/g, '')
        .replace(/#[a-zA-Z0-9-_]+/g, match => match.substring(0, 10))
        .replace(/\.[a-zA-Z0-9-_]+/g, match => match.substring(0, 10));

      if (elementKey.length > 50) {
        elementKey = elementKey.substring(0, 50) + '...';
      }

      let elementType = determineElementType(interaction);

      let displayName = interaction.elementText || elementKey;
      if (interaction.elementText && interaction.elementText.length > 30) {
        displayName = interaction.elementText.substring(0, 30) + '...';
      } else if (!interaction.elementText && elementKey.length > 30) {
        displayName = elementKey.substring(0, 30) + '...';
      }

      if (!elementsMap.has(elementKey)) {
        elementsMap.set(elementKey, {
          name: displayName,
          selector: interaction.elementSelector,
          type: elementType,
          clicks: 1
        });
      } else {
        const element = elementsMap.get(elementKey);
        element.clicks += 1;
      }
    });

  let elements = Array.from(elementsMap.values());

  if (elementSort.value === 'clicks') {
    elements = elements.sort((a, b) => b.clicks - a.clicks);
  } else if (elementSort.value === 'name') {
    elements = elements.sort((a, b) => a.name.localeCompare(b.name));
  }

  return elements;
});

function getElementPercentage(clicks) {
  const totalClicks = getInteractionCount('click');
  if (totalClicks === 0) return 0;
  return (clicks / totalClicks) * 100;
}

const getElementTypeName = (type) => {
  switch (type) {
    case 'button': return t.interactions.types.buttons;
    case 'link': return t.interactions.types.links;
    case 'input': return t.interactions.types.inputFields;
    case 'input-email': return t.interactions.types.emailFields;
    case 'input-password': return t.interactions.types.passwordFields;
    case 'input-search': return t.interactions.types.searchFields;
    case 'input-checkbox': return t.interactions.types.checkboxes;
    case 'input-radio': return t.interactions.types.radioButtons;
    case 'input-textarea': return t.interactions.types.textAreas;
    case 'image': return t.interactions.types.images;
    case 'navigation': return t.interactions.types.navigation;
    case 'icon': return t.interactions.types.icons;
    case 'list': return t.interactions.types.lists;
    case 'card': return t.interactions.types.cards;
    case 'tab': return t.interactions.types.tabs;
    case 'control': return t.interactions.types.controls;
    case 'chip': return t.interactions.types.chips;
    case 'dialog': return t.interactions.types.dialogs;
    case 'heading': return t.interactions.types.headings;
    case 'form': return t.interactions.types.forms;
    case 'table': return t.interactions.types.tables;
    case 'pagination': return t.interactions.types.pagination;
    default: return t.interactions.types.otherElements;
  }
};

const getElementTypeDescription = (type) => {
  switch (type) {
    case 'button':
      return t.interactions.typesDescriptions.buttonsAndInteractiveActions;
    case 'link':
      return t.interactions.typesDescriptions.navigationLinksAndReferences;
    case 'input':
      return t.interactions.typesDescriptions.formFieldsAndInputAreas;
    case 'image':
      return t.interactions.typesDescriptions.imagesAndVisualElements;
    case 'navigation':
      return t.interactions.typesDescriptions.navigationMenusAndElements;
    case 'icon':
      return t.interactions.typesDescriptions.iconsAndGraphicalSymbols;
    case 'list':
      return t.interactions.typesDescriptions.listItemsAndNavigationElements;
    case 'card':
      return t.interactions.typesDescriptions.cardsAndInformationContainers;
    case 'tab':
      return t.interactions.typesDescriptions.tabsAndViewSelectors;
    case 'control':
      return t.interactions.typesDescriptions.checkboxesAndRadioButtonsAndSwitches;
    case 'chip':
      return t.interactions.typesDescriptions.chipsAndBadgesAndLabels;
    case 'dialog':
      return t.interactions.typesDescriptions.dialogsAndModalsAndWindows;
    case 'heading':
      return t.interactions.typesDescriptions.headersAndTitles;
    case 'form':
      return t.interactions.typesDescriptions.formsAndFields;
    case 'table':
      return t.interactions.typesDescriptions.dataTablesAndGrids;
    case 'pagination':
      return t.interactions.typesDescriptions.paginationControlsAndPageNavigation;
    default:
      return t.interactions.typesDescriptions.variousAndUnclassifiedElements;
  }
};

function getElementTypeColor(type) {
  switch (type) {
    case 'button': return 'primary';
    case 'link': return 'info';
    case 'input': return 'warning';
    case 'image': return 'success';
    case 'navigation': return 'deep-purple';
    case 'icon': return 'pink';
    case 'list': return 'teal';
    case 'card': return 'indigo';
    case 'tab': return 'cyan';
    case 'control': return 'amber';
    case 'chip': return 'light-blue';
    case 'dialog': return 'deep-orange';
    case 'heading': return 'purple';
    case 'form': return 'orange';
    case 'table': return 'blue-grey';
    case 'pagination': return 'lime';
    default: return 'grey';
  }
}

function getElementTypeIcon(type) {
  switch (type) {
    case 'button': return 'mdi-gesture-tap-button';
    case 'link': return 'mdi-link';
    case 'input': return 'mdi-form-textbox';
    case 'input-email': return 'mdi-email-outline';
    case 'input-password': return 'mdi-lock-outline';
    case 'input-search': return 'mdi-magnify';
    case 'input-checkbox': return 'mdi-checkbox-marked-outline';
    case 'input-radio': return 'mdi-radiobox-marked';
    case 'input-textarea': return 'mdi-text-box-outline';
    case 'image': return 'mdi-image';
    case 'navigation': return 'mdi-menu';
    case 'icon': return 'mdi-circle-slice-4';
    case 'list': return 'mdi-format-list-bulleted';
    case 'card': return 'mdi-card-outline';
    case 'tab': return 'mdi-tab';
    case 'control': return 'mdi-checkbox-marked-outline';
    case 'chip': return 'mdi-label-outline';
    case 'dialog': return 'mdi-window-open';
    case 'heading': return 'mdi-format-header-1';
    case 'form': return 'mdi-form-select';
    case 'table': return 'mdi-table';
    case 'pagination': return 'mdi-page-next-outline';
    default: return 'mdi-code-tags';
  }
}

const elementTypeData = computed(() => {
  const typeMap = new Map();

  elementClickData.value.forEach(element => {
    if (!typeMap.has(element.type)) {
      typeMap.set(element.type, {
        type: element.type,
        value: element.clicks,
        count: 1
      });
    } else {
      const typeData = typeMap.get(element.type);
      typeData.value += element.clicks;
      typeData.count += 1;
    }
  });

  return Array.from(typeMap.values())
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      ...item,
      percentage: getElementPercentage(item.value)
    }));
});

// Fusionner les options de graphique en une seule fonction
const chartOption = computed(() => {
  const typeData = elementTypeData.value;
  const isBarChart = visualizationType.value === 'elements';

  // Palette de couleurs commune
  const colorPalette = {
    button: '#1976D2',
    link: '#42A5F5',
    input: '#FFA726',
    image: '#66BB6A',
    navigation: '#7E57C2',
    icon: '#EC407A',
    list: '#009688',
    card: '#3F51B5',
    tab: '#00BCD4',
    control: '#FFC107',
    chip: '#03A9F4',
    dialog: '#FF5722',
    heading: '#9C27B0',
    form: '#FF9800',
    table: '#607D8B',
    pagination: '#CDDC39',
    other: '#78909C'
  };

  // Options communes
  const commonOptions = {
    backgroundColor: 'transparent',
    title: {
      text: t.interactions.elementClicks,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        color: '#e0e0e0'
      }
    },
  };

  // Options spécifiques au type de graphique
  if (isBarChart) {
    return {
      ...commonOptions,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params) {
          const data = params[0];
          const element = typeData[data.dataIndex];
          return `
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${getElementTypeName(element.type)}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Clics:</span>
              <span style="font-weight: bold;">${element.value}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>% of total:</span>
              <span style="font-weight: bold;">${Math.round(element.percentage)}%</span>
            </div>
            <div style="margin-top: 5px; font-size: 12px; color: #bbb;">
              <i>${t.interactions.uniqueElements}: ${element.count}</i>
            </div>
            <div style="margin-top: 3px; font-size: 11px; color: #aaa;">
              ${getElementTypeDescription(element.type)}
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '15%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: typeData.map(item => getElementTypeName(item.type)),
        axisLabel: {
          interval: 0,
          rotate: typeData.length > 8 ? 45 : 0,
          color: '#bdbdbd',
          fontWeight: 'normal',
          fontSize: 12
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: '#555'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: t.interactions.clicks,
        nameTextStyle: {
          color: '#bdbdbd'
        },
        axisLabel: {
          color: '#bdbdbd'
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#555'
          }
        }
      },
      series: [
        {
          name: t.interactions.clicks,
          type: 'bar',
          barWidth: '60%',
          data: typeData.map(item => ({
            value: item.value,
            itemStyle: {
              color: colorPalette[item.type] || colorPalette.other
            }
          })),
          itemStyle: {
            borderRadius: [6, 6, 0, 0]
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}',
            color: '#e0e0e0'
          },
          animationDelay: function (idx) {
            return idx * 100;
          }
        }
      ],
      animation: true
    };
  } else {
    // Options pour le graphique en camembert
    return {
      ...commonOptions,
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `
            <div style="font-weight: bold; margin-bottom: 5px;">
              ${getElementTypeName(params.data.originalType)}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>${t.interactions.clicks}:</span>
              <span style="font-weight: bold;">${params.data.value}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>${t.interactions.percentage}:</span>
              <span style="font-weight: bold;">${params.percent.toFixed(1)}%</span>
            </div>
            <div style="margin-top: 5px; font-size: 12px; color: #bbb;">
              <i>${t.interactions.numberOfElements}: ${params.data.count}</i>
            </div>
            <div style="margin-top: 3px; font-size: 11px; color: #aaa;">
              ${getElementTypeDescription(params.data.originalType)}
            </div>
          `;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 10,
        top: 'middle',
        itemWidth: 25,
        itemHeight: 14,
        textStyle: {
          color: '#bdbdbd'
        },
        formatter: function (name) {
          const data = elementTypeData.value.find(item => getElementTypeName(item.type) === name);
          if (data) {
            if (data.percentage >= 3) {
              return `${name}: ${data.value} (${Math.round(data.percentage)}%)`;
            }
            return `${name}: ${data.value}`;
          }
          return name;
        },
        pageButtonItemGap: 5,
        pageButtonGap: 5,
        pageButtonPosition: 'end'
      },
      series: [
        {
          name: t.interactions.elementClicks,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#1E1E1E',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#FFFFFF'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: typeData.map(item => ({
            value: item.value,
            name: getElementTypeName(item.type),
            originalType: item.type,
            count: item.count,
            itemStyle: {
              color: colorPalette[item.type] || colorPalette.other
            }
          })),
          animationType: 'scale',
          animationEasing: 'cubicOut',
          animationDelay: function (idx) {
            return idx * 50;
          }
        }
      ]
    };
  }
});

// Stocker les états d'expansion dans un objet réactif
const expandedGroups = ref<Record<string, boolean>>({});

const dataViewTab = ref('cards');
const interactionGroups = computed(() => {
  const typeGroups = new Map();

  filteredInteractions.value.forEach(interaction => {
    const type = interaction.type;
    if (!typeGroups.has(type)) {
      typeGroups.set(type, {
        type,
        items: []
      });
    }
    typeGroups.get(type).items.push(interaction);
  });

  // Convertir la Map en tableau et trier
  return Array.from(typeGroups.values())
    .sort((a, b) => b.items.length - a.items.length);
});

// Fonction pour vérifier si un groupe est développé
function isExpanded(type: string): boolean {
  return !!expandedGroups.value[type];
}

// Fonction pour basculer l'état d'expansion d'un groupe
function toggleExpansion(type: string) {
  expandedGroups.value[type] = !expandedGroups.value[type];

  nextTick(() => {
    if (expandedGroups.value[type]) {
      const groupContainer = document.querySelector(`.interaction-group[data-type="${type}"]`);
      if (groupContainer) {
        groupContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

function showMoreItems(group) {
  selectedInteraction.value = null;

  // Définir l'état d'expansion directement
  expandedGroups.value[group.type] = true;

  nextTick(() => {
    const groupContainer = document.querySelector(`.interaction-group[data-type="${group.type}"]`);
    if (groupContainer) {
      groupContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function getInteractionDetailsSummary(interaction) {
  try {
    if (!interaction.value) return '';

    if (interaction.type === 'click') {
      if (interaction.elementText) {
        const elementType = determineElementType({ elementSelector: interaction.elementSelector });
        return `"${interaction.elementText}" (${getElementTypeName(elementType)})`;
      }

      if (interaction.value.pageX !== undefined && interaction.value.pageY !== undefined) {
        return `Position: (${interaction.value.pageX}, ${interaction.value.pageY})`;
      }
    }

    if (interaction.type === 'scroll' || interaction.type === 'scroll_depth') {
      if (interaction.type === 'scroll_depth' && interaction.value.depth) {
        const depth = interaction.value.depth;
        let zoneText = '';
        if (depth < 25) zoneText = '(Haut de page)';
        else if (depth < 50) zoneText = '(Premier tiers)';
        else if (depth < 75) zoneText = '(Milieu de page)';
        else if (depth < 90) zoneText = '(Bas de page)';
        else zoneText = '(Pied de page)';

        return `${interaction.value.depth}% de la page ${zoneText}`;
      }

      const scrollDepthValue = typeof interaction.value.scrollDepth === 'number' ?
        interaction.value.scrollDepth :
        parseFloat(interaction.value.scrollDepth) || 0;

      return `${Math.min(100, parseFloat(scrollDepthValue.toFixed(2)))}% de défilement`;
    }

    if (interaction.type === 'form_submit') {
      let summary = interaction.value.formId || interaction.value.action || 'Soumission de formulaire';
      if (interaction.value.success !== undefined) {
        summary += ` (${interaction.value.success ? 'Succès' : 'Échec'})`;
      }
      return summary;
    }

    if (interaction.type === 'input_change') {
      const inputType = determineElementType({ elementSelector: interaction.elementSelector });
      let inputTypeText = inputType.startsWith('input-') ? getElementTypeName(inputType) : '';

      if (interaction.value.fieldName) {
        return `Champ: ${interaction.value.fieldName}${inputTypeText ? ` (${inputTypeText})` : ''}`;
      }

      if (interaction.value.fieldPurpose && interaction.value.fieldPurpose !== 'other' && interaction.value.fieldPurpose !== 'unknown') {
        return `${formatFieldPurpose(interaction.value.fieldPurpose)}${inputTypeText ? ` (${inputTypeText})` : ''}`;
      }

      if (interaction.value.hasValue) {
        return `Valeur saisie${inputTypeText ? ` (${inputTypeText})` : ''}`;
      }

      return inputTypeText || 'Modification de champ';
    }

    return '';
  } catch (e) {
    console.error('Erreur lors du formatage des détails:', e);
    return '';
  }
}

function getItemPreview(item) {
  if (!item) return '';

  if (item.elementText) {
    const text = item.elementText.substring(0, 12);
    return text.length < item.elementText.length ? `${text}...` : text;
  }

  const elementType = determineElementType({ elementSelector: item.elementSelector });
  return getElementTypeName(elementType);
}

// Définir la fonction determineElementType
function determineElementType(interaction: any): string {
  const selector = interaction.elementSelector || '';

  if (!selector) return 'other';

  // Détection des boutons
  if (selector.includes('button') || selector.includes('btn') ||
    selector.includes('[type="button"]') || selector.includes('[role="button"]')) {
    return 'button';
  }

  // Détection des liens
  if (selector.includes('a[') || selector.startsWith('a.') || selector === 'a' ||
    selector.includes('[href]') || selector.includes('link')) {
    return 'link';
  }

  // Détection des champs de formulaire
  if (selector.includes('input')) {
    if (selector.includes('[type="email"]')) return 'input-email';
    if (selector.includes('[type="password"]')) return 'input-password';
    if (selector.includes('[type="search"]')) return 'input-search';
    if (selector.includes('[type="checkbox"]')) return 'input-checkbox';
    if (selector.includes('[type="radio"]')) return 'input-radio';
    return 'input';
  }

  if (selector.includes('textarea')) return 'input-textarea';
  if (selector.includes('select')) return 'input';
  if (selector.includes('form')) return 'form';

  // Détection des images
  if (selector.includes('img') || selector.includes('image') ||
    selector.includes('svg') || selector.includes('icon')) {
    return 'image';
  }

  // Navigation
  if (selector.includes('nav') || selector.includes('menu') ||
    selector.includes('navbar') || selector.includes('sidebar')) {
    return 'navigation';
  }

  // Éléments de liste
  if (selector.includes('li') || selector.includes('ul') ||
    selector.includes('ol') || selector.includes('list')) {
    return 'list';
  }

  // Cards
  if (selector.includes('card')) return 'card';

  // Tabs
  if (selector.includes('tab')) return 'tab';

  // Contrôles
  if (selector.includes('control') || selector.includes('switch') ||
    selector.includes('toggle') || selector.includes('slider')) {
    return 'control';
  }

  // Chips/badges
  if (selector.includes('chip') || selector.includes('badge') ||
    selector.includes('tag') || selector.includes('label')) {
    return 'chip';
  }

  // Dialogues
  if (selector.includes('dialog') || selector.includes('modal') ||
    selector.includes('popup') || selector.includes('drawer')) {
    return 'dialog';
  }

  // Titres
  if (selector.includes('h1') || selector.includes('h2') ||
    selector.includes('h3') || selector.includes('h4') ||
    selector.includes('h5') || selector.includes('h6') ||
    selector.includes('header') || selector.includes('title')) {
    return 'heading';
  }

  // Tables
  if (selector.includes('table') || selector.includes('tr') ||
    selector.includes('td') || selector.includes('th')) {
    return 'table';
  }

  // Pagination
  if (selector.includes('pagination') || selector.includes('pager')) {
    return 'pagination';
  }

  return 'other';
}
</script>