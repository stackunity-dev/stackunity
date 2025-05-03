<template>
  <v-app>
    <v-main class="w-100 h-100 overflow-hidden d-flex" role="main">
      <div class="control-panel" role="complementary" aria-label="Card customization panel">
        <v-card flat class="fill-height">
          <div class="px-4 py-2 d-flex align-center" role="group" aria-label="Framework indicators">
            <v-chip color="primary" prepend-icon="mdi-vuejs" size="small" class="mr-2" aria-label="Vue.js framework">{{
              t.framework.vue }}</v-chip>
            <v-chip color="secondary" prepend-icon="mdi-vuetify" size="small" class="mr-2"
              aria-label="Vuetify framework">{{ t.framework.vuetify }}</v-chip>
            <v-chip color="tertiary" prepend-icon="mdi-palette" size="small" class="mr-12" aria-label="Studio mode">{{
              studioMode === 'studio' ? t.framework.studio : t.framework.seo }}</v-chip>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn v-if="studioMode === 'studio-seo'" class="ml-7" icon density="comfortable" variant="text"
                  v-bind="props" color="secondary" aria-label="Test vision impairments" size="small">
                  <v-icon>{{ visionTypeIcon }}</v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ t.vision.tryDifferent }}
                  </v-tooltip>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item v-for="type in visionTypes" :key="type.value"
                  @click="selectedVisionType = type.value; applyVisionFilter()">
                  <template v-slot:prepend>
                    <v-icon :icon="type.icon" :color="selectedVisionType === type.value ? 'primary' : ''"></v-icon>
                  </template>
                  <v-list-item-title>{{ type.title }}</v-list-item-title>
                </v-list-item>
                <v-divider v-if="selectedVisionType !== 'normal'"></v-divider>
                <v-list-item v-if="selectedVisionType !== 'normal'">
                  <v-slider v-model="filterIntensity" :min="0" :max="100" :step="1" :label="t.vision.intensity"
                    hide-details class="px-2 py-0" density="compact" @update:model-value="applyVisionFilter">
                  </v-slider>
                </v-list-item>
              </v-list>
            </v-menu>
            <PremiumFeature v-if="!userStore.user.isPremium" premium-link="/subscribe" title="Studio components"
              icon="mdi-palette" type="chip" feature-key="studioComponents" aria-label="Premium feature indicator" />
          </div>

          <v-tabs v-model="tab" color="primary" align-tabs="center" class="px-4">
            <v-tab value="type">{{ t.tabs.type }}</v-tab>
            <v-tab value="style">{{ t.tabs.style }}</v-tab>
            <v-tab value="content">{{ t.tabs.content }}</v-tab>
            <v-tab value="actions">{{ t.tabs.actions }}</v-tab>
            <v-tab value="templates">{{ t.tabs.templates }}</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="tab" class="fill-height">
              <v-window-item value="type">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-shape</v-icon>
                    <span class="text-h6">{{ t.tabs.type }}</span>
                  </div>

                  <v-card class="mb-4 pa-3">
                    <v-radio-group v-model="selectedType" class="mb-4">
                      <v-radio v-for="type in componentTypes" :key="type.value" :value="type.value"
                        :label="type.text"></v-radio>
                    </v-radio-group>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="style">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                    <span class="text-h6">{{ t.tabs.style }}</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">{{ t.style.variant }}</label>
                    <v-chip-group v-model="properties.variant" mandatory selected-class="bg-primary text-white">
                      <v-chip v-for="variant in variants" :key="variant" size="small" :value="variant">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">{{ t.style.size }}</label>
                    <v-chip-group v-model="properties.size" mandatory selected-class="bg-primary text-white">
                      <v-chip v-for="size in sizes" :key="size" size="small" :value="size">
                        {{ size }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">{{ t.style.color }}</label>
                    <v-btn-toggle v-model="properties.color" mandatory density="comfortable"
                      selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color.value" :value="color.value"
                        :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                        width="40" height="40" class="ma-1" :class="{ 'bg-grey-lighten-3': color.value === 'default' }">
                        <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <v-switch v-model="properties.rounded" color="primary" :label="t.style.rounded" hide-details
                    class="mb-2">
                  </v-switch>
                  <v-switch v-model="properties.block" color="primary" :label="t.style.block" hide-details class="mb-2">
                  </v-switch>
                  <v-switch v-model="properties.disabled" color="primary" :label="t.style.disabled" hide-details
                    class="mb-2">
                  </v-switch>
                </div>
              </v-window-item>

              <v-window-item value="content">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-text</v-icon>
                    <span class="text-h6">{{ t.tabs.content }}</span>
                  </div>

                  <v-text-field v-model="properties.text" :label="t.content.text" variant="outlined"
                    density="comfortable" class="mb-4"></v-text-field>

                  <v-text-field v-if="showIconField" v-model="properties.icon" :label="t.content.icon"
                    variant="outlined" density="comfortable" class="mb-4"></v-text-field>

                  <template v-if="selectedType === 'button'">
                    <v-text-field v-model="properties.href" :label="t.content.href" variant="outlined"
                      density="comfortable" class="mb-4"></v-text-field>
                    <v-select v-model="properties.target" :items="['_self', '_blank', '_parent', '_top']"
                      label="Link Target" variant="outlined" density="comfortable" class="mb-4"></v-select>
                    <v-slider v-model="properties.elevation" :min="0" :max="24" :label="t.content.elevation"
                      class="mb-4"></v-slider>
                    <v-select v-model="properties.gradient" :items="gradients" :label="t.content.gradient"
                      variant="outlined" density="comfortable" class="mb-4"></v-select>
                    <v-switch v-model="properties.loading" color="primary" :label="t.content.loading" hide-details
                      class="mb-2"></v-switch>
                  </template>

                  <template v-if="selectedType === 'date'">
                    <v-switch v-model="properties.landscape" color="primary" label="Landscape" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.multiple" color="primary" :label="t.content.multiple" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.fullWidth" color="primary" :label="t.content.fullWidth" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.showAdjacentMonths" color="primary"
                      :label="t.content.showAdjacentMonths" hide-details class="mb-2"></v-switch>

                    <v-text-field v-model="properties.title" :label="t.content.title" variant="outlined"
                      density="comfortable" class="mb-4"></v-text-field>
                  </template>

                  <v-select v-if="showPosition" v-model="properties.position" :items="positions"
                    :label="t.content.position" variant="outlined" density="comfortable" class="mb-4"></v-select>

                  <v-textarea v-if="showDescription" v-model="properties.description" :label="t.content.description"
                    variant="outlined" density="comfortable" auto-grow rows="3" class="mb-4"></v-textarea>

                  <template v-if="selectedType === 'table'">
                    <div class="text-subtitle-1 mb-2">{{ t.content.tableHeaders }}</div>
                    <v-card class="mb-4 pa-3">
                      <div v-for="(header, index) in properties.tableHeaders" :key="index"
                        class="d-flex align-center mb-2">
                        <v-text-field v-model="header.title" :label="t.content.headerTitle" variant="outlined"
                          density="compact" class="mr-2"></v-text-field>
                        <v-text-field v-model="header.key" :label="t.content.key" variant="outlined" density="compact"
                          class="mr-2"></v-text-field>
                        <v-switch v-model="header.sortable" color="primary" :label="t.content.sortable" hide-details
                          class="mr-2"></v-switch>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="properties.tableHeaders.splice(index, 1)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addTableHeader"
                        class="mt-2">
                        {{ t.content.addHeader }}
                      </v-btn>
                    </v-card>

                    <div class="text-subtitle-1 mb-2">{{ t.content.tableItems }}</div>
                    <v-card class="mb-4 pa-3">
                      <div v-for="(item, index) in properties.tableItems" :key="index" class="d-flex align-center mb-2">
                        <div v-for="header in properties.tableHeaders" :key="header.key" class="mr-2">
                          <v-text-field v-model="item[header.key]" :label="header.title" variant="outlined"
                            density="compact"></v-text-field>
                        </div>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="properties.tableItems.splice(index, 1)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addTableItem"
                        class="mt-2">
                        {{ t.content.addItem }}
                      </v-btn>
                    </v-card>

                    <v-slider v-model="properties.itemsPerPage" :min="5" :max="25" :step="5"
                      :label="t.content.itemsPerPage" class="mb-4" thumb-label></v-slider>

                    <v-select v-model="properties.sortBy" :items="getSortableKeys()" :label="t.content.defaultSortBy"
                      variant="outlined" density="comfortable" class="mb-4"></v-select>

                    <v-select v-model="properties.sortOrder" :items="['asc', 'desc']" :label="t.content.sortOrder"
                      variant="outlined" density="comfortable" class="mb-4"></v-select>

                    <v-switch v-model="properties.showSelect" color="primary" :label="t.content.showSelection"
                      hide-details class="mb-2"></v-switch>
                    <v-switch v-model="properties.showFooter" color="primary" :label="t.content.showFooter" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.dense" color="primary" :label="t.content.dense" hide-details
                      class="mb-2"></v-switch>
                  </template>

                  <template v-if="selectedType === 'chart'">
                    <v-select v-model="properties.chartType"
                      :items="['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea']" label="Chart Type"
                      variant="outlined" density="comfortable" class="mb-4"></v-select>

                    <div class="text-subtitle-1 mb-2">{{ t.content.chartData }}</div>
                    <v-card class="mb-4 pa-3">
                      <div v-for="(value, index) in properties.chartData" :key="index" class="d-flex align-center mb-2">
                        <v-text-field v-model="properties.chartLabels[index]" label="Label" variant="outlined"
                          density="compact" class="mr-2"></v-text-field>
                        <v-text-field v-model.number="properties.chartData[index]" label="Value" variant="outlined"
                          density="compact" type="number" class="mr-2"></v-text-field>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeChartDataPoint(index)"></v-btn>
                      </div>
                      <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addChartDataPoint"
                        class="mt-2">
                        {{ t.content.addDataPoint }}
                      </v-btn>
                    </v-card>

                    <v-switch v-model="properties.showLegend" color="primary" label="Show Legend" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.responsive" color="primary" :label="t.content.responsive" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.maintainAspectRatio" color="primary"
                      :label="t.content.maintainAspectRatio" hide-details class="mb-2"></v-switch>
                  </template>

                  <template v-if="selectedType === 'file'">
                    <v-text-field v-model="properties.dropzoneText" :label="t.content.dropzoneText" variant="outlined"
                      density="comfortable" class="mb-4"></v-text-field>

                    <v-text-field v-model="properties.acceptTypes" :label="t.content.acceptTypes" variant="outlined"
                      density="comfortable" placeholder="image/*, .pdf, .docx" class="mb-4"></v-text-field>

                    <v-slider v-model="properties.maxFiles" :min="1" :max="20" :label="t.content.maxFiles" class="mb-4"
                      thumb-label></v-slider>

                    <v-slider v-model="properties.maxSize" :min="1" :max="50" label="Max Size (MB)" class="mb-4"
                      thumb-label></v-slider>

                    <v-switch v-model="properties.multiple" color="primary" :label="t.content.multiple" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.showPreview" color="primary" :label="t.content.showPreview"
                      hide-details class="mb-2"></v-switch>
                    <v-switch v-model="properties.autoUpload" color="primary" :label="t.content.autoUpload" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.chips" color="primary" :label="t.content.chips" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.counter" color="primary" :label="t.content.counter" hide-details
                      class="mb-2"></v-switch>
                    <v-switch v-model="properties.validateOnSelect" color="primary" :label="t.content.validateOnSelect"
                      hide-details class="mb-2"></v-switch>
                    <v-switch v-model="properties.returnObject" color="primary" :label="t.content.returnObject"
                      hide-details class="mb-2"></v-switch>
                  </template>
                </div>
              </v-window-item>

              <v-window-item value="actions">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-gesture-tap-button</v-icon>
                    <span class="text-h6">{{ t.tabs.actions }}</span>
                  </div>

                  <v-card class="mb-4 pa-3">
                    <div class="text-subtitle-1 mb-2">{{ t.content.eventHandling }}</div>

                    <v-select v-model="properties.eventType" :items="eventTypes" :label="t.content.eventType"
                      variant="outlined" density="comfortable" class="mb-3"></v-select>

                    <v-text-field v-model="properties.eventHandler" :label="t.content.eventHandler"
                      placeholder="methodName" variant="outlined" density="comfortable" class="mb-3"></v-text-field>

                    <v-switch v-model="properties.stopPropagation" color="primary" :label="t.content.stopPropagation"
                      hide-details class="mb-2"></v-switch>

                    <v-switch v-model="properties.preventDefault" color="primary" :label="t.content.preventDefault"
                      hide-details class="mb-4"></v-switch>
                  </v-card>

                  <v-card class="mb-4 pa-3">
                    <div class="text-subtitle-1 mb-2">{{ t.content.animationTransitions }}</div>

                    <v-select v-model="properties.transition" :items="transitions" :label="t.content.transitionEffect"
                      variant="outlined" density="comfortable" class="mb-3"></v-select>

                    <div class="d-flex align-center mb-3">
                      <v-icon size="small" color="primary" class="mr-2">mdi-clock-outline</v-icon>
                      <v-slider v-model="properties.transitionDuration" min="0" max="1000" step="50"
                        label="Duration (ms)" class="mx-2" thumb-label></v-slider>
                      <span class="text-caption">{{ properties.transitionDuration }}ms</span>
                    </div>
                  </v-card>

                  <v-card class="mb-4 pa-3">
                    <div class="text-subtitle-1 mb-2">{{ t.content.advancedOptions }}</div>

                    <v-switch v-model="properties.ripple" color="primary" :label="t.content.rippleEffect" hide-details
                      class="mb-2"></v-switch>

                    <v-switch v-model="properties.eager" color="primary" :label="t.content.eagerLoading" hide-details
                      class="mb-2"></v-switch>

                    <v-switch v-model="properties.closeOnContentClick" color="primary"
                      :label="t.content.closeOnContentClick" hide-details class="mb-2"
                      v-if="['badge'].includes(selectedType)"></v-switch>

                    <v-switch v-model="properties.closeOnBack" color="primary" :label="t.content.closeOnBackNavigation"
                      hide-details class="mb-2" v-if="['alert'].includes(selectedType)"></v-switch>
                  </v-card>

                  <v-card v-if="selectedType === 'button'" class="mb-4 pa-3">
                    <div class="text-subtitle-1 mb-2">{{ t.content.buttonSpecificActions }}</div>

                    <v-select v-model="properties.buttonType" :items="buttonTypes" :label="t.content.buttonType"
                      variant="outlined" density="comfortable" class="mb-3"></v-select>

                    <v-text-field v-model="properties.formAction" :label="t.content.formAction"
                      placeholder="https://example.com/submit" variant="outlined" density="comfortable"
                      v-if="properties.buttonType === 'submit'" class="mb-3"></v-text-field>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="templates">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-h6">{{ t.tabs.templates }}</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>{{ t.tabs.templatesTooltip }}</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">{{ t.tabs.templatesDescription }}</p>

                  <v-card class="mb-4">
                    <v-list>
                      <v-list-item @click="applyTemplate('info')" prepend-icon="mdi-information" title="Info Alert"
                        subtitle="Informational message"></v-list-item>
                      <v-list-item @click="applyTemplate('status')" prepend-icon="mdi-account-check"
                        :title="t.content.statusBadge" :subtitle="t.content.userStatusIndicator"></v-list-item>
                      <v-list-item @click="applyTemplate('barChart')" prepend-icon="mdi-chart-bar" title="Bar Chart"
                        subtitle="Monthly data visualization"></v-list-item>
                      <v-list-item @click="applyTemplate('lineChart')" prepend-icon="mdi-chart-line" title="Line Chart"
                        subtitle="Weekly trend visualization"></v-list-item>
                      <v-list-item @click="applyTemplate('pieChart')" prepend-icon="mdi-chart-pie" title="Pie Chart"
                        :subtitle="t.content.distributionVisualization"></v-list-item>
                      <v-list-item @click="applyTemplate('doughnutChart')" prepend-icon="mdi-chart-donut"
                        :title="t.content.doughnutChart" :subtitle="t.content.productDistribution"></v-list-item>
                      <v-list-item @click="applyTemplate('radarChart')" prepend-icon="mdi-chart-scatter-plot"
                        :title="t.content.radarChart" :subtitle="t.content.performanceMetrics"></v-list-item>
                      <v-list-item @click="applyTemplate('polarAreaChart')" prepend-icon="mdi-chart-arc"
                        :title="t.content.polarAreaChart" :subtitle="t.content.regionalDistribution"></v-list-item>
                      <v-list-item @click="applyTemplate('dataTable')" prepend-icon="mdi-table" title="Data Table"
                        :subtitle="t.content.structuredDataDisplay"></v-list-item>
                      <v-list-item @click="applyTemplate('fileUpload')" prepend-icon="mdi-file-upload"
                        :title="t.content.fileUpload" :subtitle="t.content.documentUploadComponent"></v-list-item>
                    </v-list>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    {{ t.tabs.templatesAlert }}
                  </v-alert>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
                    <span class="text-h6">{{ t.tabs.saveCurrentComponent }}</span>
                  </div>

                  <v-text-field v-model="customTemplateName" :label="t.tabs.templateName" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-tag" class="mb-4"></v-text-field>

                  <v-btn color="primary" prepend-icon="mdi-content-save" block @click="saveCurrentTemplate">
                    {{ t.tabs.saveCurrentComponentButton }}
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <div class="pa-4 d-flex flex-column"
        :class="studioMode === 'studio-seo' ? 'preview-area-seo' : 'preview-area-classic'">
        <div class="d-flex justify-space-between align-center mb-3">
          <v-chip :color="studioMode === 'studio-seo' ? 'secondary' : 'primary'" variant="flat" size="small"
            class="mr-2">
            <v-icon start size="small">mdi-eye</v-icon>
            {{ t.tabs.livePreview }}
          </v-chip>
        </div>

        <div class="preview-canvas flex-grow-1 pa-4 bg-transparent rounded-lg" :style="filterStyle">
          <div class="d-flex align-center justify-center w-100 h-100">
            <v-btn v-if="selectedType === 'button'" :color="properties.color" :variant="properties.variant"
              :size="properties.size" :disabled="properties.disabled" :block="properties.block"
              :rounded="properties.rounded" :prepend-icon="properties.icon" :href="properties.href"
              :target="properties.target" :elevation="properties.elevation" :loading="properties.loading"
              :style="properties.gradient ? { background: `linear-gradient(${properties.gradient}, ${properties.color}, ${properties.color}80)` } : {}">
              {{ properties.text || 'Button' }}
            </v-btn>

            <v-badge v-else-if="selectedType === 'badge'" :content="properties.text" :color="properties.color"
              :location="properties.position">
              <v-avatar size="48">
                <v-icon>{{ properties.icon || 'mdi-account' }}</v-icon>
              </v-avatar>
            </v-badge>

            <v-alert v-else-if="selectedType === 'alert'"
              :type="properties.color === 'default' ? undefined : properties.color as AlertType"
              :variant="properties.variant" :title="properties.text" :text="properties.description"
              :icon="properties.icon" class="w-100"></v-alert>

            <v-chip v-else-if="selectedType === 'chip'" :color="properties.color" :variant="properties.variant"
              :size="properties.size" :prepend-icon="properties.icon">
              {{ properties.text || 'Chip' }}
            </v-chip>

            <v-date-picker v-else-if="selectedType === 'date'" v-model="properties.date" :color="properties.color"
              :variant="properties.variant" :multiple="properties.multiple" :landscape="properties.landscape"
              :show-week-numbers="properties.showWeek" :show-adjacent-months="properties.showAdjacentMonths"
              :title="properties.title" :width="properties.fullWidth ? '100%' : undefined"
              class="elevation-4"></v-date-picker>

            <v-data-table v-else-if="selectedType === 'table'" :headers="properties.tableHeaders"
              :items="properties.tableItems" :items-per-page="properties.itemsPerPage"
              :sort-by="[{ key: properties.sortBy, order: properties.sortOrder }]" :show-select="properties.showSelect"
              :show-footer="properties.showFooter" :dense="properties.dense" class="w-100"></v-data-table>

            <div v-else-if="selectedType === 'chart'" class="w-100 h-100 d-flex align-center justify-center">
              <v-card class="pa-4 w-100" max-width="500">
                <v-card-title>{{ properties.chartType.charAt(0).toUpperCase() + properties.chartType.slice(1) }}
                  Chart</v-card-title>
                <v-card-text>
                  <div style="position: relative; height: 300px;">
                    <component :is="properties.chartType === 'bar' ? Bar :
                      properties.chartType === 'line' ? Line :
                        properties.chartType === 'pie' ? Pie :
                          properties.chartType === 'doughnut' ? Doughnut :
                            properties.chartType === 'polarArea' ? PolarArea : Radar" :data="chartData"
                      :options="chartOptions" />
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <div v-else-if="selectedType === 'file'" class="w-100 h-100 d-flex align-center justify-center">
              <v-card class="pa-4 w-100" max-width="500">
                <v-card-title>File Upload</v-card-title>
                <v-card-text>
                  <v-file-input :multiple="properties.multiple" :accept="properties.acceptTypes"
                    :max-files="properties.maxFiles" :max-size="properties.maxSize * 1024 * 1024" :show-size="true"
                    :label="properties.dropzoneText"
                    :color="properties.color !== 'default' ? properties.color : undefined" variant="outlined"
                    :show-preview="properties.showPreview" :chips="properties.chips" :counter="properties.counter"
                    :validate-on-select="properties.validateOnSelect" :return-object="properties.returnObject"
                    prepend-icon="mdi-file-upload"></v-file-input>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>

        <div class="d-flex justify-end mt-3">
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            {{ t.tabs.previewCode }}
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyUtilsCode">
            {{ t.tabs.copyCode }}
          </v-btn>
        </div>
      </div>
    </v-main>

    <v-dialog v-model="showCodeDialog" width="800">
      <v-card class="bg-grey-darken-4">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <v-tabs v-model="codeTab" color="primary">
            <v-tab value="template">{{ t.tabs.template }}</v-tab>
            <v-tab value="script">{{ t.tabs.script }}</v-tab>
            <v-tab value="theme">{{ t.tabs.theme }}</v-tab>
          </v-tabs>
          <v-btn icon="mdi-close" variant="text" @click="showCodeDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-window v-model="codeTab">
            <v-window-item value="template">
              <pre class="code-block"><code class="language-vue" ref="codeElement">{{ highlightedTemplateCode }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="script">
              <pre class="code-block"><code class="language-javascript" ref="scriptCodeElement">{{ highlightedScriptCode
              }}</code>
          </pre>
            </v-window-item>
            <v-window-item value="theme">
              <pre class="code-block"><code class="language-css" ref="themeCodeElement">{{ highlightedThemeCode }}</code>
          </pre>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn color="secondary" prepend-icon="mdi-content-copy" @click="copyCurrentTab">
            {{ t.tabs.copyCurrentTab }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
  </v-app>
</template>

<script setup lang="ts">
import {
  ArcElement,
  BarElement, CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement, PointElement,
  RadialLinearScale,
  Title, Tooltip
} from 'chart.js';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import { computed, inject, nextTick, ref, watch } from 'vue';
import { Bar, Doughnut, Line, Pie, PolarArea, Radar } from 'vue-chartjs';
import Snackbar from '../../components/snackbar.vue';
import { useTranslations } from '../../languages';
import { useUserStore } from '../../stores/userStore';
import { applyVisionFilter, filterIntensity, filterStyle, selectedVisionType, visionTypeIcon, visionTypes } from '../../utils/filter';
import theme from '../../utils/theme';
import { getUtilsTemplate } from '../../utils/utilsTemplates';
import { StudioModeInjection } from './studio-types';
import { AlertType, buttonTypes, chartData, chartOptions, colors, componentTypes, eventTypes, gradients, positions, properties, selectedType, showDescription, showIconField, showPosition, sizes, transitions, variants } from './types/type-utils';

const t = useTranslations('studioUtilsTemplates')();

const emit = defineEmits(['update:content', 'save']);
const userStore = useUserStore();

const studioModeInjection = inject<StudioModeInjection>('studioMode')
if (!studioModeInjection) {
  console.error('studioMode injection not found')
}

const studioMode = computed(() => studioModeInjection?.mode?.value || 'studio')

const tab = ref('type');
const codeElement = ref<HTMLElement | null>(null);
const themeCodeElement = ref<HTMLElement | null>(null);
const scriptCodeElement = ref<HTMLElement | null>(null);
const showCodeDialog = ref(false);
const codeTab = ref('template');
const generatedCode = ref('');
const showSnackbarMessage = ref(false);
const snackbarText = ref('Code copied to clipboard');
const snackbarColor = ref('success');
const customTemplateName = ref('');

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const generateUtilsCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const themeCode = theme;

  switch (codeTab.value) {
    case 'template':
      return templateCode;
    case 'script':
      return scriptCode;
    case 'style':
      return themeCode;
    default:
      return `${templateCode}\n\n${scriptCode}\n\n${themeCode}`;
  }
};

const generateTemplateCode = () => {
  let code = '';

  switch (selectedType.value) {
    case 'button':
      code = `<v-btn\n`;
      if (properties.value.color !== 'default') code += `  color="${properties.value.color}"\n`;
      if (properties.value.variant !== 'elevated') code += `  variant="${properties.value.variant}"\n`;
      if (properties.value.size !== 'default') code += `  size="${properties.value.size}"\n`;
      if (properties.value.disabled) code += `  disabled\n`;
      if (properties.value.block) code += `  block\n`;
      if (properties.value.rounded) code += `  rounded\n`;
      if (properties.value.icon) code += `  prepend-icon="${properties.value.icon}"\n`;
      if (properties.value.href) code += `  href="${properties.value.href}"\n`;
      if (properties.value.target !== '_self') code += `  target="${properties.value.target}"\n`;
      if (properties.value.elevation > 0) code += `  elevation="${properties.value.elevation}"\n`;
      if (properties.value.loading) code += `  loading\n`;
      if (properties.value.gradient) {
        code += `  :style="{ background: 'linear-gradient(${properties.value.gradient}, ${properties.value.color}, ${properties.value.color}80)' }"\n`;
      }
      if (properties.value.buttonType !== 'button') code += `  type="${properties.value.buttonType}"\n`;
      if (properties.value.buttonType === 'submit' && properties.value.formAction) {
        code += `  form-action="${properties.value.formAction}"\n`;
      }
      if (properties.value.ripple === false) code += `  :ripple="false"\n`;
      if (properties.value.eventHandler) {
        const eventModifiers: string[] = [];
        if (properties.value.stopPropagation) eventModifiers.push('stop');
        if (properties.value.preventDefault) eventModifiers.push('prevent');

        const eventWithModifiers = eventModifiers.length > 0
          ? `${properties.value.eventType}.${eventModifiers.join('.')}`
          : properties.value.eventType;

        code += `  @${eventWithModifiers}="${properties.value.eventHandler}"\n`;
      }
      if (properties.value.transition !== 'none') {
        code += `  transition="${properties.value.transition}"\n`;
        code += `  :transition-duration="${properties.value.transitionDuration}"\n`;
      }
      code += `>\n  ${properties.value.text || 'Button'}\n</v-btn>`;
      break;

    case 'badge':
      code = `<v-badge\n`;
      code += `  content="${properties.value.text}"\n`;
      if (properties.value.color !== 'default') code += `  color="${properties.value.color}"\n`;
      code += `  location="${properties.value.position}"\n`;
      if (properties.value.transition !== 'none') {
        code += `  transition="${properties.value.transition}"\n`;
        code += `  :transition-duration="${properties.value.transitionDuration}"\n`;
      }
      if (properties.value.closeOnContentClick) code += `  close-on-content-click\n`;
      if (properties.value.eager) code += `  eager\n`;
      code += `>\n  <v-avatar size="48">\n`;
      code += `    <v-icon>${properties.value.icon || 'mdi-account'}</v-icon>\n`;
      code += `  </v-avatar>\n</v-badge>`;
      break;

    case 'alert':
      code = `<v-alert\n`;
      if (properties.value.color !== 'default') code += `  type="${properties.value.color}"\n`;
      if (properties.value.variant !== 'elevated') code += `  variant="${properties.value.variant}"\n`;
      if (properties.value.text) code += `  title="${properties.value.text}"\n`;
      if (properties.value.description) code += `  text="${properties.value.description}"\n`;
      if (properties.value.icon) code += `  icon="${properties.value.icon}"\n`;
      if (properties.value.transition !== 'none') {
        code += `  transition="${properties.value.transition}"\n`;
        code += `  :transition-duration="${properties.value.transitionDuration}"\n`;
      }
      if (properties.value.closeOnBack) code += `  close-on-back\n`;
      if (properties.value.eventHandler) {
        const eventModifiers: string[] = [];
        if (properties.value.stopPropagation) eventModifiers.push('stop');
        if (properties.value.preventDefault) eventModifiers.push('prevent');

        const eventWithModifiers = eventModifiers.length > 0
          ? `${properties.value.eventType}.${eventModifiers.join('.')}`
          : properties.value.eventType;

        code += `  @${eventWithModifiers}="${properties.value.eventHandler}"\n`;
      }
      code += `></v-alert>`;
      break;

    case 'chip':
      code = `<v-chip\n`;
      if (properties.value.color !== 'default') code += `  color="${properties.value.color}"\n`;
      if (properties.value.variant !== 'elevated') code += `  variant="${properties.value.variant}"\n`;
      if (properties.value.size !== 'default') code += `  size="${properties.value.size}"\n`;
      if (properties.value.icon) code += `  prepend-icon="${properties.value.icon}"\n`;
      if (properties.value.ripple === false) code += `  :ripple="false"\n`;
      if (properties.value.transition !== 'none') {
        code += `  transition="${properties.value.transition}"\n`;
        code += `  :transition-duration="${properties.value.transitionDuration}"\n`;
      }
      if (properties.value.eventHandler) {
        const eventModifiers: string[] = [];
        if (properties.value.stopPropagation) eventModifiers.push('stop');
        if (properties.value.preventDefault) eventModifiers.push('prevent');

        const eventWithModifiers = eventModifiers.length > 0
          ? `${properties.value.eventType}.${eventModifiers.join('.')}`
          : properties.value.eventType;

        code += `  @${eventWithModifiers}="${properties.value.eventHandler}"\n`;
      }
      code += `>\n  ${properties.value.text || 'Chip'}\n</v-chip>`;
      break;

    case 'date':
      code = `<v-date-picker\n`;
      code += `  v-model="date"\n`;
      if (properties.value.color !== 'default') code += `  color="${properties.value.color}"\n`;
      if (properties.value.variant !== 'elevated') code += `  variant="${properties.value.variant}"\n`;
      if (properties.value.multiple) code += `  multiple\n`;
      if (properties.value.landscape) code += `  landscape\n`;
      if (properties.value.showWeek) code += `  show-week-numbers\n`;
      if (properties.value.showAdjacentMonths) code += `  show-adjacent-months\n`;
      if (properties.value.title) code += `  title="${properties.value.title}"\n`;
      if (properties.value.fullWidth) code += `  width="100%"\n`;
      if (properties.value.transition !== 'none') {
        code += `  transition="${properties.value.transition}"\n`;
        code += `  :transition-duration="${properties.value.transitionDuration}"\n`;
      }
      if (properties.value.eager) code += `  eager\n`;
      if (properties.value.eventHandler) {
        const eventModifiers: string[] = [];
        if (properties.value.stopPropagation) eventModifiers.push('stop');
        if (properties.value.preventDefault) eventModifiers.push('prevent');

        const eventWithModifiers = eventModifiers.length > 0
          ? `${properties.value.eventType}.${eventModifiers.join('.')}`
          : properties.value.eventType;

        code += `  @${eventWithModifiers}="${properties.value.eventHandler}"\n`;
      }
      code += `  class="elevation-4"\n`;
      code += `></v-date-picker>`;
      break;

    case 'table':
      code = `<v-data-table\n`;
      code += `  :headers="tableHeaders"\n`;
      code += `  :items="tableItems"\n`;
      code += `  :items-per-page="${properties.value.itemsPerPage}"\n`;
      code += `  :sort-by="[{ key: '${properties.value.sortBy}', order: '${properties.value.sortOrder}' }]"\n`;
      if (properties.value.showSelect) code += `  show-select\n`;
      if (properties.value.showFooter) code += `  show-footer\n`;
      if (properties.value.dense) code += `  dense\n`;
      code += `>\n`;
      code += `</v-data-table>`;
      break;

    case 'chart':
      code = `<div style="position: relative; height: 300px;">\n`;

      const chartComponent = properties.value.chartType === 'bar' ? 'Bar' :
        properties.value.chartType === 'line' ? 'Line' :
          properties.value.chartType === 'pie' ? 'Pie' :
            properties.value.chartType === 'doughnut' ? 'Doughnut' :
              properties.value.chartType === 'polarArea' ? 'PolarArea' : 'Radar';

      code += `  <${chartComponent}\n`;
      code += `    :data="chartData"\n`;
      code += `    :options="chartOptions"\n`;
      code += `  />\n`;
      code += `</div>`;
      break;

    case 'file':
      code = `<v-file-input\n`;
      if (properties.value.multiple) code += `  multiple\n`;
      code += `  :accept="${properties.value.acceptTypes}"\n`;
      code += `  :max-files="${properties.value.maxFiles}"\n`;
      code += `  :max-size="${properties.value.maxSize * 1024 * 1024}"\n`;
      code += `  :show-size="true"\n`;
      code += `  label="${properties.value.dropzoneText}"\n`;
      if (properties.value.color !== 'default') code += `  color="${properties.value.color}"\n`;
      code += `  variant="outlined"\n`;
      if (properties.value.showPreview) code += `  show-preview\n`;
      if (properties.value.chips) code += `  chips\n`;
      if (properties.value.counter) code += `  counter\n`;
      if (properties.value.validateOnSelect) code += `  validate-on-select\n`;
      if (properties.value.returnObject) code += `  return-object\n`;
      if (properties.value.autoUpload) code += `  auto-upload\n`;
      if (properties.value.disabled) code += `  disabled\n`;
      if (properties.value.eventHandler) {
        const eventModifiers: string[] = [];
        if (properties.value.stopPropagation) eventModifiers.push('stop');
        if (properties.value.preventDefault) eventModifiers.push('prevent');

        const eventWithModifiers = eventModifiers.length > 0
          ? `${properties.value.eventType}.${eventModifiers.join('.')}`
          : properties.value.eventType;

        code += `  @${eventWithModifiers}="${properties.value.eventHandler}"\n`;
      }
      code += `  prepend-icon="mdi-file-upload"\n`;
      code += `></v-file-input>`;
      break;
  }

  return code;
};

const generateScriptCode = () => {
  let code = '';

  if (selectedType.value === 'chart') {
    code = `
import { ref } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ${properties.value.chartType === 'bar' ? 'Bar' :
        properties.value.chartType === 'line' ? 'Line' :
          properties.value.chartType === 'pie' ? 'Pie' :
            properties.value.chartType === 'doughnut' ? 'Doughnut' :
              properties.value.chartType === 'polarArea' ? 'PolarArea' : 'Radar'} } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const chartColors = ref(['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']);

const chartData = ref({
  labels: ${JSON.stringify(properties.value.chartLabels)},
  datasets: [{
    label: 'Dataset',
    data: ${JSON.stringify(properties.value.chartData)},
    backgroundColor: chartColors.value,
    borderColor: ${properties.value.chartType === 'line' ? "'#36A2EB'" : "chartColors.value"},
    borderWidth: 1
  }]
});

const chartOptions = ref({
  responsive: ${properties.value.responsive},
  maintainAspectRatio: ${properties.value.maintainAspectRatio},
  plugins: { 
    legend: { 
      display: ${properties.value.showLegend} 
    } 
  }
});
`;
  } else if (selectedType.value === 'table') {
    code = `
import { ref } from 'vue';

const tableHeaders = ref(${JSON.stringify(properties.value.tableHeaders, null, 2)});

const tableItems = ref(${JSON.stringify(properties.value.tableItems, null, 2)});
`;
  } else {
    code = `
import { ref } from 'vue';
`;
  }

  return code;
};

const previewCode = () => {
  generatedCode.value = generateUtilsCode();
  showCodeDialog.value = true;
};

const copyUtilsCode = () => {
  const templateCode = generateTemplateCode();
  const scriptCode = generateScriptCode();
  const fullCode = `${templateCode}\n\n${scriptCode}`;

  navigator.clipboard.writeText(fullCode)
    .then(() => {
      snackbarText.value = 'Code copied to clipboard!';
      showSnackbarMessage.value = true;
    })
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const copyCurrentTab = () => {
  let code;
  switch (codeTab.value) {
    case 'template':
      code = generateTemplateCode();
      break;
    case 'script':
      code = generateScriptCode();
      break;
    case 'style':
      code = theme;
      break;
    default:
      code = '';
  }
  window.navigator.clipboard.writeText(code)
    .catch(err => {
      console.error('Error copying:', err);
    });
};

const generateCodeSilently = () => {
  const code = generateUtilsCode();
  emit('update:content', code);
};

const applyTemplate = (template: string) => {
  const templateData = getUtilsTemplate(template);

  if (!templateData) {
    snackbarText.value = 'Template not found';
    showSnackbarMessage.value = true;
    return;
  }

  if (templateData.type) {
    selectedType.value = templateData.type;
  }

  Object.assign(properties.value, templateData);

  snackbarText.value = `Template "${template}" applied successfully!`;
  showSnackbarMessage.value = true;
  generateCodeSilently();
};

const saveCurrentTemplate = async () => {
  if (!customTemplateName.value) {
    snackbarText.value = 'Please enter a template name';
    showSnackbarMessage.value = true;
    return;
  }

  const templateData = {
    type: selectedType.value,
    properties: JSON.parse(JSON.stringify(properties.value)),
    tableHeaders: properties.value.tableHeaders ? [...properties.value.tableHeaders] : [],
    tableItems: properties.value.tableItems ? [...properties.value.tableItems] : [],
    chartData: properties.value.chartData ? [...properties.value.chartData] : [],
    chartLabels: properties.value.chartLabels ? [...properties.value.chartLabels] : []
  };

  const response = await userStore.saveTemplate(customTemplateName.value, templateData, 'utils');

  if (response) {
    snackbarText.value = `Template "${customTemplateName.value}" saved successfully`;
    showSnackbarMessage.value = true;
    customTemplateName.value = '';
    await userStore.loadData();
  } else {
    snackbarText.value = `Failed to save template "${customTemplateName.value}"`;
    showSnackbarMessage.value = true;
  }
};

const addTableHeader = () => {
  properties.value.tableHeaders.push({
    title: 'New Column',
    key: 'newColumn' + properties.value.tableHeaders.length,
    sortable: true
  });
};

const addTableItem = () => {
  const newItem: Record<string, string> = {};
  properties.value.tableHeaders.forEach(header => {
    newItem[header.key] = '';
  });
  properties.value.tableItems.push(newItem);
};

const getSortableKeys = () => {
  return properties.value.tableHeaders
    .filter(header => header.sortable)
    .map(header => header.key);
};

const addChartDataPoint = () => {
  properties.value.chartData.push(0);
  properties.value.chartLabels.push('Label ' + properties.value.chartLabels.length);
};

const removeChartDataPoint = (index: number) => {
  properties.value.chartData.splice(index, 1);
  properties.value.chartLabels.splice(index, 1);
};

const loadTemplateFromStore = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (!templateId) return;

  console.log('Loading template with ID:', templateId);

  const template = userStore.studioComponents.find(t => t.id === parseInt(templateId) && t.component_type === 'utils');

  if (template && template.content) {
    console.log('Template found in store:', template.name);

    if (template.content.trim().startsWith('<v-')) {
      console.log('HTML content detected, applying directly');
      emit('update:content', template.content);
      return;
    }

    try {
      const templateData = JSON.parse(template.content);
      console.log('Template data loaded:', templateData);

      selectedType.value = templateData.type || 'datepicker';
      Object.assign(properties.value, templateData.properties || {});

      if (templateData.tableHeaders) {
        properties.value.tableHeaders = [...templateData.tableHeaders];
      }

      if (templateData.tableItems) {
        properties.value.tableItems = [...templateData.tableItems];
      }

      if (templateData.chartData) {
        properties.value.chartData = [...templateData.chartData];
      }

      if (templateData.chartLabels) {
        properties.value.chartLabels = [...templateData.chartLabels];
      }

      generateUtilsCode();

      snackbarText.value = 'Template loaded successfully';
      showSnackbarMessage.value = true;
    } catch (error) {
      console.error('Error parsing template:', error);
      emit('update:content', template.content);
    }
  }
};

const highlightedTemplateCode = computed(() => {
  return generateTemplateCode();
});

const highlightedScriptCode = computed(() => {
  return generateScriptCode();
});

const highlightedThemeCode = computed(() => {
  return theme;
});


watch(() => {
  if (typeof window !== 'undefined') {
    return window.location.search;
  }
  return '';
}, () => {
  if (typeof window !== 'undefined') {
    loadTemplateFromStore();
  }
}, { immediate: true });

watch([selectedType, properties], () => {
  generateCodeSilently();
}, { deep: true });

watch(codeTab, () => {
  nextTick(() => {
    if (codeTab.value === 'template' && codeElement.value) {
      hljs.highlightElement(codeElement.value);
    } else if (codeTab.value === 'script' && scriptCodeElement.value) {
      hljs.highlightElement(scriptCodeElement.value);
    } else if (codeTab.value === 'theme' && themeCodeElement.value) {
      hljs.highlightElement(themeCodeElement.value);
    }
  });
});

</script>

<style scoped>
.fill-height {
  height: 100%;
}

.control-panel {
  width: 350px;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}


.preview-area-seo {
  flex: 1;
  background:
    radial-gradient(circle at 70% 30%, rgba(103, 90, 200, 0.4), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(45, 158, 225, 0.4), transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(200, 80, 190, 0.3), transparent 40%),
    radial-gradient(circle at 10% 10%, rgba(24, 144, 132, 0.3), transparent 35%),
    linear-gradient(120deg, rgba(10, 15, 30, 0.1), rgba(20, 35, 60, 0.2));
  overflow: auto
}

.preview-area-classic {
  flex: 1;
  background:
    radial-gradient(circle at 75% 25%, rgba(var(--v-theme-info), 0.3), transparent 40%),
    radial-gradient(circle at 25% 75%, rgba(70, 130, 180, 0.3), transparent 35%),
    radial-gradient(circle at 90% 85%, rgba(60, 179, 113, 0.2), transparent 30%),
    linear-gradient(135deg, rgba(25, 25, 40, 0.05), rgba(45, 45, 60, 0.1));
  overflow: auto;
}
.preview-canvas {
  min-height: 60vh;
  border: 1px dashed rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  background-image: repeating-linear-gradient(45deg, var(--v-theme-surface) 0, var(--v-theme-surface) 10px, var(--v-theme-surface-variant) 10px, var(--v-theme-surface-variant) 20px);
}

canvas {
  max-width: 100%;
  height: auto !important;
}

.caption-overlay {
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
}

.code-block {
  margin: 0;
  padding: 0;
  border-radius: 8px;
  background-color: #282c34;
  overflow: auto;
  max-height: 60vh;
}

.code-block code {
  display: block;
  padding: 1rem;
  font-family: "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
