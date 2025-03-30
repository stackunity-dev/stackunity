<template>
  <v-app>
    <v-main class="w-100 h-100 overflow-hidden d-flex">
      <div class="control-panel">
        <v-card flat class="fill-height">
          <div class="px-4 py-2 d-flex align-center">
            <v-chip color="success" prepend-icon="mdi-vuejs" size="small" class="mr-2 px-4 py-2">Vue.js</v-chip>
            <v-chip color="info" prepend-icon="mdi-vuetify" size="small" class="mr-2 px-4 py-2">Vuetify</v-chip>
            <PremiumFeature premium-link="/subscribe" title="Studio components" icon="mdi-palette" type="chip"
              feature-key="studioComponents" />
          </div>

          <v-tabs v-model="propertiesTab" color="primary" align-tabs="center" class="px-4">
            <v-tab value="content">Content</v-tab>
            <v-tab value="style">Style</v-tab>
            <v-tab value="actions">Actions</v-tab>
            <v-tab value="data">Data</v-tab>
            <v-tab value="templates">Templates</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="propertiesTab" class="fill-height">
              <v-window-item value="content">
                <div class="pa-4">
                  <v-text-field v-model="cardProperties.title" label="Title" variant="outlined" density="comfortable"
                    clearable prepend-inner-icon="mdi-format-title" class="mb-4"></v-text-field>

                  <v-text-field v-model="cardProperties.subtitle" label="Subtitle" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-format-text" class="mb-4"></v-text-field>

                  <v-textarea v-model="cardProperties.text" label="Text" variant="outlined" density="comfortable"
                    auto-grow rows="3" row-height="20" clearable prepend-inner-icon="mdi-text"
                    class="mb-4"></v-textarea>

                  <v-text-field v-model="cardProperties.image" label="Image URL" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-image" class="mb-1"></v-text-field>
                  <div class="d-flex flex-wrap mb-4">
                    <v-chip-group mandatory selected-class="bg-primary text-white">
                      <v-chip size="small" value="none" @click="removeImage">None</v-chip>
                      <v-chip size="small" value="mountains" @click="setImage('mountains')">Mountains</v-chip>
                      <v-chip size="small" value="beach" @click="setImage('beach')">Beach</v-chip>
                      <v-chip size="small" value="forest" @click="setImage('forest')">Forest</v-chip>
                    </v-chip-group>
                  </div>

                  <v-select v-model="cardProperties.icon" :items="icons" label="Icon" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-pencil" class="mb-4">
                    <template v-slot:item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template v-slot:prepend>
                          <v-icon :icon="item.raw"></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>

                  <div v-if="cardProperties.icon" class="mb-4">
                    <label class="text-subtitle-2 mb-1">Icon color</label>
                    <div class="color-selector-container">
                      <v-btn-toggle v-model="iconColorIndex" mandatory density="comfortable"
                        selected-class="border-primary">
                        <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="style">
                <div class="pa-4">
                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Elevation</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-card-outline</v-icon>
                      <v-slider v-model="cardProperties.elevation" min="0" max="24" step="1" thumb-label
                        class="mx-2"></v-slider>
                      <v-icon size="small" color="primary">mdi-layers-triple</v-icon>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1">Variant</label>
                    <v-chip-group v-model="cardVariantIndex" mandatory selected-class="bg-primary text-white">
                      <v-chip v-for="(variant, index) in cardVariants" :key="variant" size="small" :value="index">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1">Color</label>
                    <div class="color-selector-container">
                      <v-btn-toggle v-model="cardColorIndex" mandatory density="comfortable"
                        selected-class="border-primary">
                        <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>

                  <v-switch v-model="cardProperties.loading" color="primary" label="Loading" hide-details
                    class="mb-2"></v-switch>
                  <v-switch v-model="cardProperties.disabled" color="primary" label="Disabled" hide-details
                    class="mb-4"></v-switch>
                  <v-switch v-model="cardProperties.hoverEffect" color="primary" label="Hover effect" hide-details
                    class="mb-4"></v-switch>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Padding</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-arrow-collapse</v-icon>
                      <v-slider v-model="cardProperties.padding" min="0" max="16" step="4" thumb-label
                        class="mx-2"></v-slider>
                      <v-icon size="small" color="primary">mdi-arrow-expand</v-icon>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Border radius</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-square-outline</v-icon>
                      <v-slider v-model="roundedIndex" :min="0" :max="roundedLabels.length - 1" step="1" thumb-label
                        :thumb-label-text="roundedLabels[roundedIndex]" class="mx-2"></v-slider>
                      <v-icon size="small" color="primary">mdi-rectangle-outline</v-icon>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="actions">
                <div class="pa-4">
                  <v-switch v-model="cardProperties.showButtons" color="primary" label="Show buttons" hide-details
                    class="mb-4"></v-switch>

                  <template v-if="cardProperties.showButtons">
                    <v-text-field v-model="cardProperties.buttonText" label="Button text" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-button-cursor" class="mb-4"></v-text-field>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Button style</label>
                      <v-chip-group v-model="buttonVariantIndex" mandatory selected-class="bg-primary text-white">
                        <v-chip v-for="(variant, index) in buttonVariants" :key="variant" size="small" :value="index">
                          {{ variant }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Button color</label>
                      <div class="d-flex overflow-x-auto">
                        <v-btn-toggle v-model="buttonColorIndex" mandatory density="comfortable" class="d-flex">
                          <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                            :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                            width="40" height="40" class="ma-1">
                            <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1 d-block">Button width</label>
                      <div class="d-flex align-center">
                        <v-chip size="x-small">Auto</v-chip>
                        <v-slider v-model="cardProperties.buttonWidth" min="0" max="100" step="25" thumb-label
                          :thumb-label-text="cardProperties.buttonWidth + '%'" class="mx-2"></v-slider>
                        <v-chip size="x-small">100%</v-chip>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Button position</label>
                      <div class="d-flex justify-space-between">
                        <v-btn-toggle v-model="cardProperties.buttonPosition" mandatory density="comfortable">
                          <v-btn value="start" icon="mdi-format-align-left"></v-btn>
                          <v-btn value="center" icon="mdi-format-align-center"></v-btn>
                          <v-btn value="end" icon="mdi-format-align-right"></v-btn>
                          <v-btn value="space-between" icon="mdi-format-align-justify"></v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <v-autocomplete v-model="cardProperties.buttonIcon" :items="icons" label="Icon" variant="outlined"
                      density="comfortable" class="mb-2 mt-2"></v-autocomplete>

                    <v-text-field v-model="cardProperties.buttonLink" label="Link" variant="outlined"
                      density="comfortable" class="mb-2"></v-text-field>

                  </template>

                  <v-switch v-model="cardProperties.showProgress" color="primary" label="Show progress circular"
                    hide-details class="mb-4"></v-switch>

                  <template v-if="cardProperties.showProgress">
                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1 d-block">Progress value</label>
                      <div class="d-flex align-center">
                        <v-icon size="small" color="primary">mdi-percent</v-icon>
                        <v-slider v-model="cardProperties.progressValue" min="0" max="100" step="5" thumb-label
                          :thumb-label-text="cardProperties.progressValue + '%'" class="mx-2"></v-slider>
                      </div>
                      <div class="d-flex align-center mt-2">
                        <v-icon size="small" color="primary">mdi-circle-slice-8</v-icon>
                        <v-slider v-model="cardProperties.progressWidth" min="1" max="10" step="1" thumb-label
                          :thumb-label-text="cardProperties.progressWidth" class="mx-2"></v-slider>
                      </div>
                    </div>

                    <v-switch v-model="cardProperties.indeterminate" color="primary" hide-details class="mb-2"
                      label="Indeterminate"></v-switch>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Progress color</label>
                      <div class="d-flex flex-wrap gap-2">
                        <v-btn-toggle v-model="progressColorIndex" mandatory density="comfortable"
                          selected-class="border-primary">
                          <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                            :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                            width="40" height="40" class="ma-1">
                            <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Progress size</label>
                      <v-chip-group v-model="progressSizeIndex" mandatory selected-class="bg-primary text-white">
                        <v-chip v-for="(size, index) in progressSizes" :key="size" size="small" :value="index">
                          {{ size }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Progress position</label>
                      <v-select v-model="cardProperties.progressPosition" :items="progressPositions" label="Position"
                        variant="outlined" density="comfortable" class="mb-2"></v-select>
                    </div>

                    <v-switch v-model="cardProperties.showProgressLabel" color="primary" hide-details class="mb-2"
                      label="Show value"></v-switch>

                    <div v-if="cardProperties.showProgressLabel" class="mb-4">
                      <label class="text-subtitle-2 mb-1">Label style</label>
                      <v-chip-group v-model="cardProperties.progressLabelStyle" mandatory
                        selected-class="bg-primary text-white">
                        <v-chip size="small" value="value">Value (%)</v-chip>
                        <v-chip size="small" value="custom">Custom</v-chip>
                      </v-chip-group>

                      <v-text-field v-if="cardProperties.progressLabelStyle === 'custom'"
                        v-model="cardProperties.progressLabelText" label="Custom label" variant="outlined"
                        density="comfortable" class="mt-2">
                      </v-text-field>
                    </div>

                    <div class="mb-4">
                      <v-switch v-model="cardProperties.showProgressBg" color="primary" hide-details class="mb-2"
                        label="Background color"></v-switch>

                      <div v-if="cardProperties.showProgressBg" class="d-flex flex-wrap gap-2 mt-2">
                        <v-btn-toggle v-model="progressBgColorIndex" mandatory density="comfortable"
                          selected-class="border-primary">
                          <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                            :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                            width="40" height="40" class="ma-1">
                            <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>
                  </template>
                </div>
              </v-window-item>

              <v-window-item value="data">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                      <span class="text-h6">Data Visualization</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Add data visualizations to your card</span>
                    </v-tooltip>
                  </div>

                  <v-switch v-model="cardProperties.showSparkline" color="primary" label="Show sparkline" hide-details
                    class="mb-4"></v-switch>

                  <template v-if="cardProperties.showSparkline">

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Sparkline color</label>
                      <div class="color-selector-container">
                        <v-btn-toggle v-model="sparklineColorIndex" mandatory density="comfortable"
                          selected-class="border-primary">
                          <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                            :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                            width="40" height="40" class="ma-1">
                            <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Sparkline data</label>
                      <v-textarea v-model="sparklineDataText" label="Enter comma-separated values" variant="outlined"
                        density="comfortable" auto-grow rows="2" row-height="20" class="mb-2"
                        hint="Example: 0,2,5,9,5,10,3,5,0,0,1,8,2,9,0" persistent-hint
                        @update:model-value="updateSparklineData"></v-textarea>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1 d-block">Line width</label>
                      <div class="d-flex align-center">
                        <v-icon size="small" color="primary">mdi-minus</v-icon>
                        <v-slider v-model="cardProperties.sparklineLineWidth" min="1" max="5" step="1" thumb-label
                          class="mx-2"></v-slider>
                        <v-icon size="small" color="primary">mdi-minus-thick</v-icon>
                      </div>
                    </div>

                    <v-switch v-model="cardProperties.sparklineGradient" color="primary" label="Show gradient"
                      hide-details class="mb-4"></v-switch>

                    <v-switch v-model="cardProperties.sparklineShowLabels" color="primary" label="Show labels"
                      hide-details class="mb-4"></v-switch>

                    <div v-if="cardProperties.sparklineShowLabels" class="mb-4">
                      <label class="text-subtitle-2 mb-1">Labels</label>
                      <v-textarea v-model="sparklineLabelsText" label="Enter comma-separated labels" variant="outlined"
                        density="comfortable" auto-grow rows="2" row-height="20" class="mb-2"
                        hint="Example: Jan,Fév,Mar,Avr,Mai,Juin" persistent-hint
                        @update:model-value="updateSparklineLabels"></v-textarea>
                    </div>
                  </template>

                  <v-divider class="my-4"></v-divider>

                  <v-switch v-model="cardProperties.showTimeline" color="primary" label="Show timeline" hide-details
                    class="mb-4"></v-switch>

                  <template v-if="cardProperties.showTimeline">
                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Timeline items</label>
                      <v-select v-model="timelineItemsCount" :items="[1, 2, 3, 4, 5]" label="Number of items"
                        variant="outlined" density="comfortable" class="mb-2"></v-select>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Timeline content</label>
                      <v-expansion-panels variant="accordion">
                        <v-expansion-panel v-for="(item, index) in timelineItems.slice(0, timelineItemsCount)"
                          :key="index">
                          <v-expansion-panel-title>
                            Item {{ index + 1 }}: {{ item.title }}
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-text-field v-model="timelineItems[index].title" label="Title" variant="outlined"
                              density="comfortable" class="mb-2"></v-text-field>
                            <v-text-field v-model="timelineItems[index].message" label="Message" variant="outlined"
                              density="comfortable" class="mb-2"></v-text-field>
                            <div class="mb-2">
                              <label class="text-subtitle-2 mb-1">Point color</label>
                              <div class="color-selector-container">
                                <v-btn-toggle v-model="timelineItems[index].color" mandatory density="comfortable">
                                  <v-btn
                                    v-for="color in ['primary', 'secondary', 'success', 'info', 'warning', 'error']"
                                    :key="color" :value="color" :color="color" size="small" variant="tonal" width="40"
                                    height="40" class="ma-1">
                                  </v-btn>
                                </v-btn-toggle>
                              </div>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </template>
                </div>
              </v-window-item>

              <v-window-item value="templates">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-h6">Card Templates</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Apply pre-defined templates or save your own</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">Choose a pre-defined template to quickly create common cards.</p>

                  <v-card class="mb-4">
                    <v-list>
                      <v-list-item @click="applyTemplate('timeline')" prepend-icon="mdi-timeline" title="Timeline Card"
                        subtitle="Activity timeline display"></v-list-item>
                      <v-list-item @click="applyTemplate('weather')" prepend-icon="mdi-weather-partly-cloudy"
                        title="Weather Card" subtitle="Weather forecast display"></v-list-item>
                      <v-list-item @click="applyTemplate('statistics')" prepend-icon="mdi-currency-usd"
                        title="Statistics Card" subtitle="Financial or metrics display"></v-list-item>
                      <v-list-item @click="applyTemplate('file')" prepend-icon="mdi-file-document-outline"
                        title="File Card" subtitle="Document or file presentation"></v-list-item>
                    </v-list>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    Applying a template will replace your current card settings.
                  </v-alert>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
                    <span class="text-h6">Save Current Card</span>
                  </div>

                  <v-text-field v-model="customTemplateName" label="Template Name" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-tag" class="mb-4"></v-text-field>

                  <v-btn color="primary" variant="tonal" @click="saveCurrentTemplate">
                    <v-icon start>mdi-content-save</v-icon>
                    Save Current Card
                  </v-btn>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <div class="preview-area pa-4 d-flex flex-column">
        <div class="d-flex justify-space-between align-center mb-3">
          <div>
            <v-chip color="primary" variant="flat" size="small" class="mr-2">
              <v-icon start size="small">mdi-eye</v-icon>
              Live preview
            </v-chip>
          </div>
        </div>

        <div class="preview-canvas flex-grow-1 d-flex align-center justify-center pa-4">
          <v-card :elevation="cardProperties.elevation" :variant="cardVariant"
            :color="cardColor !== 'default' ? cardColor : undefined" :loading="cardProperties.loading"
            :disabled="cardProperties.disabled" class="mx-auto preview-component"
            :class="{ 'hover-effect': cardProperties.hoverEffect }" :rounded="cardProperties.rounded"
            :style="`padding: ${cardProperties.padding}px;`">
            <v-img v-if="cardProperties.image" :src="cardProperties.image" height="200" cover></v-img>

            <v-card-title v-if="cardProperties.title">
              <v-icon v-if="cardProperties.icon" start :color="iconColor !== 'default' ? iconColor : undefined">{{
                cardProperties.icon }}</v-icon>
              {{ cardProperties.title }}
            </v-card-title>

            <v-card-subtitle v-if="cardProperties.subtitle">
              {{ cardProperties.subtitle }}
            </v-card-subtitle>

            <v-card-text v-if="cardProperties.text">
              {{ cardProperties.text }}
            </v-card-text>

            <v-card-text v-if="cardProperties.showSparkline">
              <div class="d-flex flex-column align-center">
                <v-sparkline :model-value="cardProperties.sparklineData" :line-width="cardProperties.sparklineLineWidth"
                  :color="sparklineColor !== 'default' ? sparklineColor : undefined"
                  :gradient="cardProperties.sparklineGradient ? [sparklineColor !== 'default' ? sparklineColor : 'primary'] : undefined"
                  :labels="cardProperties.sparklineShowLabels ? cardProperties.sparklineLabels : undefined" padding="16"
                  auto-draw smooth></v-sparkline>
              </div>
            </v-card-text>

            <v-card-text v-if="cardProperties.showTimeline">
              <div class="font-weight-bold ms-1 mb-2">Today</div>
              <v-timeline align="start" density="compact">
                <v-timeline-item v-for="(item, i) in timelineItems.slice(0, timelineItemsCount)" :key="i"
                  :dot-color="item.color" size="x-small">
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>{{ item.title }}</strong> @{{ new Date().getHours() }}:{{ new Date().getMinutes() }}
                    </div>
                    <div>{{ item.message }}</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>

            <v-card-actions :class="'justify-' + cardProperties.buttonPosition">
              <v-btn v-if="cardProperties.showButtons" :color="buttonColor !== 'default' ? buttonColor : undefined"
                :variant="buttonVariant"
                :style="cardProperties.buttonWidth > 0 ? `width: ${cardProperties.buttonWidth}%` : ''"
                :prepend-icon="cardProperties.buttonIcon" :to="cardProperties.buttonLink">
                {{ cardProperties.buttonText || 'Action' }}
              </v-btn>

              <div v-if="cardProperties.showProgress" :class="getProgressPositionClass()">
                <v-progress-circular :model-value="cardProperties.progressValue"
                  :color="progressColor !== 'default' ? progressColor : undefined" :size="progressSize"
                  :indeterminate="cardProperties.indeterminate" :width="cardProperties.progressWidth"
                  :bg-color="cardProperties.showProgressBg ? (progressBgColor !== 'default' ? progressBgColor : 'grey-lighten-3') : undefined">
                  <template v-if="cardProperties.showProgressLabel" v-slot:default>
                    <span :class="getProgressLabelClass()">
                      {{ getProgressLabelText() }}
                    </span>
                  </template>
                </v-progress-circular>
              </div>
            </v-card-actions>
          </v-card>
        </div>

        <div v-if="userStore.user.isPremium" class="d-flex justify-end mt-3">
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            Preview Code
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyCardCode">
            Copy code
          </v-btn>
        </div>
        <div v-else class="d-flex justify-end mt-3">
          <PremiumFeature title="Preview code" icon="mdi-eye" featureKey="studioComponents" variant="elevated"
            class="premium-feature-button mr-2" type="button" />
          <PremiumFeature title="Copy code" icon="mdi-content-copy" featureKey="studioComponents" variant="elevated"
            class="premium-feature-button" type="button" />
        </div>
      </div>

      <v-dialog v-model="showCodeDialog" width="800">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <span>Generated Code</span>
            <v-btn icon="mdi-close" variant="text" @click="showCodeDialog = false"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-sheet class="bg-grey-darken-4 rounded pa-4" style="white-space: pre-wrap; font-family: monospace;">
              {{ generatedCode }}
            </v-sheet>
          </v-card-text>
          <v-card-actions class="pa-4">

            <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyCardCode">
              Copy to Clipboard
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import PremiumFeature from '~/components/PremiumFeature.vue';
import Snackbar from '~/components/snackbar.vue';
import { useUserStore } from '~/stores/userStore';
import { getCardTemplate } from '~/utils/cardTemplates';
import icons from '~/utils/icons';
import theme from '~/utils/theme';

const props = defineProps({
  initialContent: {
    type: String,
    default: ''
  },
  isPremium: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:content', 'save'])

type CardVariant = typeof cardVariants[number]
type CardColor = typeof cardColors[number]['value']
type ButtonVariant = typeof buttonVariants[number]
type ProgressSize = typeof progressSizes[number]
type RoundedSize = typeof roundedLabels[number]

const cardVariants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const
const cardColors = [
  { text: 'Default', value: 'default' },
  { text: 'Primary', value: 'primary' },
  { text: 'Secondary', value: 'secondary' },
  { text: 'Success', value: 'success' },
  { text: 'Info', value: 'info' },
  { text: 'Warning', value: 'warning' },
  { text: 'Error', value: 'error' }
] as const

const buttonVariants = ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'] as const
const progressSizes = ['x-small', 'small', 'default', 'large', 'x-large'] as const
const roundedLabels = ['sm', 'md', 'lg', 'xl', 'pill'] as const

const userStore = useUserStore()
const propertiesTab = ref('content')
const iconColorIndex = ref(5)
const cardVariantIndex = ref(0)
const cardColorIndex = ref(0)
const buttonColorIndex = ref(5)
const buttonVariantIndex = ref(2)
const buttonLinkIndex = ref('')
const progressSizeIndex = ref(2)
const progressColorIndex = ref(1)
const showCodeDialog = ref(false)
const generatedCode = ref('')
const showSnackbarMessage = ref(false)
const snackbarText = ref('Code copied to clipboard')
const snackbarColor = ref('success')
const componentType = ref('card')
const timelineItemsCount = ref(3)

const timelineItems = ref([
  { title: 'User 1', message: 'Message sent', color: 'primary' },
  { title: 'User 2', message: 'File uploaded', color: 'success' },
  { title: 'User 3', message: 'Task completed', color: 'info' },
  { title: 'User 4', message: 'Comment added', color: 'warning' },
  { title: 'User 5', message: 'Status updated', color: 'error' }
])

const cardProperties = ref({
  title: 'Premium features',
  subtitle: 'Unlock all UI components with a premium plan',
  text: 'Lifetime access to all premium features and updates for only 300€ one time payment',
  image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
  icon: 'mdi-crown',
  elevation: 2,
  padding: 8,
  rounded: 'md' as RoundedSize,
  loading: false,
  disabled: false,
  hoverEffect: false,
  showButtons: true,
  buttonText: 'Checkout',
  buttonWidth: 0,
  buttonLink: '/checkout',
  buttonPosition: 'start',
  buttonIcon: 'mdi-cart-outline',
  showProgress: false,
  progressValue: 75,
  indeterminate: false,
  progressWidth: 6,
  progressPosition: 'inline',
  showProgressLabel: false,
  progressLabelStyle: 'value',
  progressLabelText: '',
  showProgressBg: false,
  showTimeline: false,
  showSparkline: false,
  sparklineData: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
  sparklineColor: 'primary',
  sparklineGradient: false,
  sparklineLineWidth: 2,
  sparklineShowLabels: false,
  sparklineLabels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar']
})

const cardVariant = computed((): CardVariant => cardVariants[cardVariantIndex.value])
const cardColor = computed((): CardColor => cardColors[cardColorIndex.value].value)
const buttonVariant = computed((): ButtonVariant => buttonVariants[buttonVariantIndex.value])
const buttonColor = computed((): CardColor => cardColors[buttonColorIndex.value].value)
const progressColor = computed((): CardColor => cardColors[progressColorIndex.value].value)
const progressSize = computed((): ProgressSize => progressSizes[progressSizeIndex.value])
const iconColor = computed((): CardColor => cardColors[iconColorIndex.value].value)

const setImage = (type: string) => {
  switch (type) {
    case 'mountains':
      cardProperties.value.image = 'https://images.unsplash.com/photo-1519681393784-d120267933ba'
      break
    case 'beach':
      cardProperties.value.image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
      break
    case 'forest':
      cardProperties.value.image = 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e'
      break
  }
  generateCardCodeSilently()
}

const removeImage = () => {
  cardProperties.value.image = ''
  generateCardCodeSilently()
}

const progressPositions = [
  'inline',
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'absolute'
]

const progressBgColorIndex = ref(0)
const progressBgColor = computed((): CardColor => cardColors[progressBgColorIndex.value].value)
const sparklineColorIndex = ref(1)
const sparklineColor = computed((): CardColor => cardColors[sparklineColorIndex.value].value)
const sparklineDataText = ref(cardProperties.value.sparklineData.join(','))
const sparklineLabelsText = ref(cardProperties.value.sparklineLabels.join(','))

const updateSparklineData = () => {
  try {
    const values = sparklineDataText.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
    if (values.length > 0) {
      cardProperties.value.sparklineData = values
    }
  } catch (e) {
    console.error('Error parsing sparkline data:', e)
  }
}

const updateSparklineLabels = () => {
  try {
    const labels = sparklineLabelsText.value.split(',').map(v => v.trim())
    if (labels.length > 0) {
      cardProperties.value.sparklineLabels = labels
    }
  } catch (e) {
    console.error('Error parsing sparkline labels:', e)
  }
}

function generateCardCode() {
  const card = cardProperties.value;
  let code = '<v-card';
  code += ` elevation="${card.elevation}"`;
  if (cardVariants[cardVariantIndex.value] !== 'elevated') code += ` variant="${cardVariants[cardVariantIndex.value]}"`;
  if (cardColors[cardColorIndex.value].value !== 'default') code += ` color="${cardColors[cardColorIndex.value].value}"`;
  if (card.loading) code += ' loading';
  if (card.disabled) code += ' disabled';
  if (card.rounded !== 'md') code += ` rounded="${card.rounded}"`;
  if (card.padding !== 16) code += ` style="padding: ${card.padding}px;"`;
  if (card.hoverEffect) code += ' class="hover-effect"';

  code += '>';

  if (card.image) code += `\n  <v-img src="${card.image}" height="200" cover></v-img>`;

  if (card.title) {
    code += `\n  <v-card-title>`;
    if (card.icon) {
      code += `<v-icon start`;
      if (cardColors[iconColorIndex.value].value !== 'default') {
        code += ` color="${cardColors[iconColorIndex.value].value}"`;
      }
      code += `>${card.icon}</v-icon> `;
    }
    code += `${card.title}</v-card-title>`;
  }

  if (card.subtitle) code += `\n  <v-card-subtitle>${card.subtitle}</v-card-subtitle>`;
  if (card.text) code += `\n  <v-card-text>${card.text}</v-card-text>`;

  if (card.showSparkline) {
    code += `\n  <v-card-text>`;
    code += `\n    <div class="d-flex flex-column align-center">`;

    code += `\n      <v-sparkline`;
    code += `\n        :model-value="[${card.sparklineData.join(', ')}]"`;
    if (cardColors[sparklineColorIndex.value].value !== 'default') {
      code += `\n        color="${cardColors[sparklineColorIndex.value].value}"`;
    }
    code += `\n        :line-width="${card.sparklineLineWidth}"`;
    code += `\n        :gradient="${card.sparklineGradient ? [cardColors[sparklineColorIndex.value].value !== 'default' ? cardColors[sparklineColorIndex.value].value : 'primary'] : undefined}"`;
    code += `\n        :labels="${card.sparklineShowLabels ? JSON.stringify(card.sparklineLabels) : undefined}"`;
    code += `\n        padding="16"`;
    code += `\n        auto-draw`;
    code += `\n        smooth`;
    code += `\n      ></v-sparkline>`;
    code += `\n    </div>`;
    code += `\n  </v-card-text>`;
  }

  if (card.showTimeline) {
    code += `\n  <v-card-text>`;
    code += `\n    <div class="font-weight-bold ms-1 mb-2">Today</div>`;
    code += `\n    <v-timeline align="start" density="compact">`;

    for (let i = 0; i < timelineItemsCount.value; i++) {
      const item = timelineItems.value[i];
      const color = item.color;

      code += `\n      <v-timeline-item`;
      code += `\n        dot-color="${color}"`;
      code += `\n        size="x-small"`;
      code += `\n      >`;
      code += `\n        <div class="mb-4">`;
      code += `\n          <div class="font-weight-normal">`;
      code += `\n            <strong>${item.title}</strong> @{{ new Date().getHours() }}:{{ new Date().getMinutes() }}`;
      code += `\n          </div>`;
      code += `\n          <div>${item.message}</div>`;
      code += `\n        </div>`;
      code += `\n      </v-timeline-item>`;
    }

    code += `\n    </v-timeline>`;
    code += `\n  </v-card-text>`;
  }

  if (card.showButtons || card.showProgress) {
    code += `\n  <v-card-actions${card.buttonPosition !== 'start' ? ` class="justify-${card.buttonPosition}"` : ''}>`;
    if (card.showButtons) {
      code += `\n    <v-btn ${cardColors[buttonColorIndex.value].value !== 'default' ? `color="${cardColors[buttonColorIndex.value].value}" ` : ''}variant="${buttonVariants[buttonVariantIndex.value]}"${card.buttonWidth > 0 ? ` style="width: ${card.buttonWidth}%"` : ''} ${card.buttonIcon ? `append-icon="${card.buttonIcon}"` : ''} ${card.buttonLink ? `to="${card.buttonLink}"` : ''}>${card.buttonText || 'Action'}</v-btn>`;
    }
    if (card.showProgress) {
      if (card.progressPosition !== 'inline') {
        code += `\n    <div class="${card.progressPosition === 'absolute' ? 'progress-absolute' : `progress-${card.progressPosition}`}">`;
      }

      code += `\n    <v-progress-circular`;
      code += ` model-value="${card.progressValue}"`;
      if (cardColors[progressColorIndex.value].value !== 'default') code += ` color="${cardColors[progressColorIndex.value].value}"`;
      if (progressSizes[progressSizeIndex.value] !== 'default') code += ` size="${progressSizes[progressSizeIndex.value]}"`;
      if (card.progressPosition === 'inline') code += ` class="ml-4"`;
      if (card.indeterminate) code += ` indeterminate`;
      if (card.progressWidth !== 6) code += ` width="${card.progressWidth}"`;
      if (card.showProgressBg && cardColors[progressBgColorIndex.value].value !== 'default') {
        code += ` bg-color="${cardColors[progressBgColorIndex.value].value}"`;
      }

      if (card.showProgressLabel) {
        code += `>\n      <template v-slot:default>\n        <span class="${progressSizes[progressSizeIndex.value] === 'x-small' || progressSizes[progressSizeIndex.value] === 'small' ? 'text-caption' : 'text-body-2'}">${card.progressLabelStyle === 'value' ? `{{ ${card.progressValue} }}%` : card.progressLabelText}</span>\n      </template>\n    </v-progress-circular>`;
      } else {
        code += `></v-progress-circular>`;
      }

      if (card.progressPosition !== 'inline') {
        code += `\n    </div>`;
      }
    }
    code += '\n  </v-card-actions>';
  }

  return code + '\n</v-card>' + theme;
}

function generateCardCodeSilently() {
  const code = generateCardCode()
  emit('update:content', code)
}

const previewCode = () => {
  generatedCode.value = generateCardCode();
  showCodeDialog.value = true;
};

function generateDefaultCardCode() {
  return generateCardCode()
}

const onComponentTypeChange = () => {
  generateCardCodeSilently()
}

const saveContent = () => {
  const code = generateCardCode()
  emit('save', code)
}

const copyCardCode = () => {
  const code = generateCardCode();
  navigator.clipboard.writeText(code)
    .then(() => {
      snackbarText.value = 'Code copied to clipboard!';
      showSnackbarMessage.value = true;
    })
    .catch(err => {
      console.error('Error copying code:', err);
    });
  console.log(cardProperties.value)
};

watch([
  () => cardProperties.value,
  cardVariantIndex,
  cardColorIndex,
  buttonVariantIndex,
  buttonColorIndex,
  progressSizeIndex,
  progressColorIndex,
  sparklineColorIndex,
  timelineItemsCount
], () => {
  generateCardCodeSilently()
}, { deep: true })

onMounted(async () => {
  await userStore.loadData();

  if (props.initialContent) {
    try {
      if (props.initialContent.trim().startsWith('{')) {
        const templateData = JSON.parse(props.initialContent);

        if (templateData) {
          Object.assign(cardProperties.value, templateData);

          const variantIndex = cardVariants.findIndex(v => v === templateData.variant);
          if (variantIndex !== -1) cardVariantIndex.value = variantIndex;

          const colorIndex = cardColors.findIndex(c => c.value === templateData.color);
          if (colorIndex !== -1) cardColorIndex.value = colorIndex;

          const btnVariantIndex = buttonVariants.findIndex(v => v === templateData.buttonVariant);
          if (btnVariantIndex !== -1) buttonVariantIndex.value = btnVariantIndex;

          const btnColorIndex = cardColors.findIndex(c => c.value === templateData.buttonColor);
          if (btnColorIndex !== -1) buttonColorIndex.value = btnColorIndex;

          const progSizeIndex = progressSizes.findIndex(s => s === templateData.progressSize);
          if (progSizeIndex !== -1) progressSizeIndex.value = progSizeIndex;

          const progColorIndex = cardColors.findIndex(c => c.value === templateData.progressColor);
          if (progColorIndex !== -1) progressColorIndex.value = progColorIndex;

          const sparkColorIndex = cardColors.findIndex(c => c.value === templateData.sparklineColor);
          if (sparkColorIndex !== -1) sparklineColorIndex.value = sparkColorIndex;

          if (templateData.sparklineData) {
            sparklineDataText.value = templateData.sparklineData.join(',');
            updateSparklineData();
          }

          generateCardCodeSilently();
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
    }
  }
  generateCardCodeSilently()
})

const roundedIndexToValue = (index: number): RoundedSize => roundedLabels[index]
const roundedValueToIndex = (value: RoundedSize): number => roundedLabels.indexOf(value)

const roundedIndex = computed({
  get: () => roundedValueToIndex(cardProperties.value.rounded),
  set: (index: number) => {
    cardProperties.value.rounded = roundedIndexToValue(index)
  }
})

const getProgressPositionClass = () => {
  if (cardProperties.value.progressPosition === 'inline') {
    return 'ml-4';
  }

  return `progress-${cardProperties.value.progressPosition}`;
}

const getProgressLabelClass = () => {
  return progressSizes[progressSizeIndex.value] === 'x-small' ||
    progressSizes[progressSizeIndex.value] === 'small'
    ? 'text-caption'
    : 'text-body-2';
}

const getProgressLabelText = () => {
  return cardProperties.value.progressLabelText || `${cardProperties.value.progressValue}%`;
}

const applyTemplate = (template: string) => {
  const templateData = getCardTemplate(template);

  Object.assign(cardProperties.value, templateData);

  const variantIndex = cardVariants.findIndex(v => v === templateData.variant);
  if (variantIndex !== -1) cardVariantIndex.value = variantIndex;

  const colorIndex = cardColors.findIndex(c => c.value === templateData.color);
  if (colorIndex !== -1) cardColorIndex.value = colorIndex;

  const btnVariantIndex = buttonVariants.findIndex(v => v === templateData.buttonVariant);
  if (btnVariantIndex !== -1) buttonVariantIndex.value = btnVariantIndex;

  const btnColorIndex = cardColors.findIndex(c => c.value === templateData.buttonColor);
  if (btnColorIndex !== -1) buttonColorIndex.value = btnColorIndex;

  const progSizeIndex = progressSizes.findIndex(s => s === templateData.progressSize);
  if (progSizeIndex !== -1) progressSizeIndex.value = progSizeIndex;

  const progColorIndex = cardColors.findIndex(c => c.value === templateData.progressColor);
  if (progColorIndex !== -1) progressColorIndex.value = progColorIndex;

  const sparkColorIndex = cardColors.findIndex(c => c.value === templateData.sparklineColor);
  if (sparkColorIndex !== -1) sparklineColorIndex.value = sparkColorIndex;

  if (templateData.sparklineData) {
    sparklineDataText.value = templateData.sparklineData.join(',');
  }

  if (template === 'timeline') {
    timelineItems.value = [
      { title: 'Documentation', message: 'Document added: Q3 Report', color: 'primary' },
      { title: 'Communication', message: 'Comment on presentation', color: 'success' },
      { title: 'Development', message: 'Task completed: Website update', color: 'info' },
      { title: 'Planning', message: 'Meeting scheduled for tomorrow', color: 'warning' },
      { title: 'Project', message: 'New project created: UI Redesign', color: 'error' }
    ];
  }

  snackbarText.value = `${template.charAt(0).toUpperCase() + template.slice(1)} template applied
                    successfully!`;
  showSnackbarMessage.value = true;

  generateCardCodeSilently();
}

const customTemplateName = ref('');

const loadTemplateFromStore = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (!templateId) return;

  console.log('Loading template with ID:', templateId);

  const template = userStore.studioComponents.find(t => t.id === parseInt(templateId) && t.component_type === 'card');

  if (template && template.content) {
    console.log('Template found in store:', template.name);

    if (template.content.trim().startsWith('<v-card')) {
      console.log('HTML content detected, applying directly');
      emit('update:content', template.content);
      return;
    }

    try {
      const templateData = JSON.parse(template.content);
      console.log('Template data loaded:', templateData);

      Object.assign(cardProperties.value, templateData);

      const variantIndex = cardVariants.findIndex(v => v === templateData.variant);
      if (variantIndex !== -1) cardVariantIndex.value = variantIndex;

      const colorIndex = cardColors.findIndex(c => c.value === templateData.color);
      if (colorIndex !== -1) cardColorIndex.value = colorIndex;

      const btnVariantIndex = buttonVariants.findIndex(v => v === templateData.buttonVariant);
      if (btnVariantIndex !== -1) buttonVariantIndex.value = btnVariantIndex;

      const btnColorIndex = cardColors.findIndex(c => c.value === templateData.buttonColor);
      if (btnColorIndex !== -1) buttonColorIndex.value = btnColorIndex;

      generateCardCodeSilently();

      snackbarText.value = 'Template loaded successfully';
      showSnackbarMessage.value = true;
    } catch (error) {
      console.error('Error parsing template:', error);
      emit('update:content', template.content);
    }
  }
};

const saveCurrentTemplate = async () => {
  if (!customTemplateName.value) {
    snackbarText.value = 'Please enter a template name';
    snackbarColor.value = 'error'
    showSnackbarMessage.value = true;
    return;
  }

  const templateData = {
    ...JSON.parse(JSON.stringify(cardProperties.value)),
    variant: cardVariants[cardVariantIndex.value],
    color: cardColors[cardColorIndex.value].value,
    buttonVariant: buttonVariants[buttonVariantIndex.value],
    buttonColor: cardColors[buttonColorIndex.value].value,
    progressSize: progressSizes[progressSizeIndex.value],
    progressColor: cardColors[progressColorIndex.value].value
  };

  const response = await userStore.saveTemplate(customTemplateName.value, templateData, componentType.value)

  if (response) {
    snackbarText.value = `Template "${customTemplateName.value}" saved successfully`;
    showSnackbarMessage.value = true;
    customTemplateName.value = '';
    await userStore.loadData();
  } else {
    snackbarText.value = `Failed to save template "${customTemplateName.value}"`;
    showSnackbarMessage.value = true;
    snackbarColor.value = 'error'
  }
};

onMounted(async () => {
  await userStore.loadData();
  console.log('Components available:', userStore.studioComponents);

  loadTemplateFromStore();

  if (!props.initialContent) {
    generateCardCodeSilently();
  }
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

const userIsPremium = computed(() => userStore.user.isPremium);
</script>

<style scoped>
.fill-height {
  height: 100%
}
.gap-2 {
  gap: 8px
}
.control-panel {
  width: 320px;
  overflow: hidden
}
.preview-area {
  flex: 1;
  background-color: #f5f5f5;
  overflow: auto
}
.preview-canvas {
  background-color: white;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05)
}
.preview-desktop {
  padding: 32px
}
.progress-top-left {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1
}
.progress-top-center {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1
}
.progress-top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1
}
.progress-center-left {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  z-index: 1
}
.progress-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1
}
.progress-center-right {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  z-index: 1
}
.progress-bottom-left {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1
}
.progress-bottom-center {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1
}
.progress-bottom-right {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1
}
.progress-absolute {
  position: absolute;
  z-index: 1
}
.preview-component {
  position: relative;
  transition: all 0.3s ease;
}
.preview-component.hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
.v-card-actions {
  position: static !important
}
.v-card-actions>div[class^="progress-"] {
  position: absolute
}
.v-card-actions>.progress-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}
.color-selector-container {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 5px;
  margin-bottom: 5px;
  -webkit-scrollbar-width: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.color-selector-container::-webkit-scrollbar {
  display: none;
}

.v-btn-toggle {
  display: flex;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.v-btn-toggle::-webkit-scrollbar {
  display: none;
}

.v-btn-toggle .v-btn {
  flex: 0 0 auto;
}
</style>