<template>
  <v-app>
    <v-main class="w-100 h-100 overflow-hidden d-flex" role="main">
      <div class="control-panel" role="complementary" aria-label="Card customization panel">
        <v-card flat class="fill-height">
          <div class="px-4 py-2 d-flex align-center" role="group" aria-label="Framework indicators">
            <v-chip color="primary" prepend-icon="mdi-vuejs" size="small" class="mr-2 px-4 py-2"
              aria-label="Vue.js framework">Vue.js</v-chip>
            <v-chip color="secondary" prepend-icon="mdi-vuetify" size="small" class="mr-2 px-4 py-2"
              aria-label="Vuetify framework">Vuetify</v-chip>
            <v-chip color="tertiary" prepend-icon="mdi-palette" size="small" class="mr-12 px-4 py-2"
              aria-label="Studio mode">{{ studioMode === 'studio' ? 'Studio' : 'SEO' }}</v-chip>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn v-if="studioMode === 'studio-seo'" class="ml-7" icon density="comfortable" variant="text"
                  v-bind="props" color="secondary" aria-label="Test vision impairments" size="small">
                  <v-icon>{{ visionTypeIcon }}</v-icon>
                  <v-tooltip activator="parent" location="top">
                    Try different vision types
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
                  <v-slider v-model="filterIntensity" :min="0" :max="100" :step="1" label="Intensity" hide-details
                    class="px-2 py-0" density="compact" @update:model-value="applyVisionFilter">
                  </v-slider>
                </v-list-item>
              </v-list>
            </v-menu>
            <PremiumFeature v-if="!userStore.user.isPremium" premium-link="/subscribe" title="Studio components"
              icon="mdi-palette" type="chip" feature-key="studioComponents" aria-label="Premium feature indicator" />
          </div>


          <v-tabs v-model="propertiesTab" color="primary" align-tabs="center" class="px-4" role="tablist"
            aria-label="Card properties tabs">
            <v-tab value="content" role="tab" aria-controls="content-panel">Content</v-tab>
            <v-tab value="style" role="tab" aria-controls="style-panel">Style</v-tab>
            <v-tab value="actions" role="tab" aria-controls="actions-panel">Actions</v-tab>
            <v-tab value="data" role="tab" aria-controls="data-panel">Data</v-tab>
            <v-tab v-if="studioMode === 'studio-seo'" value="ARIA" role="tab" aria-controls="ARIA-panel">ARIA</v-tab>
            <v-tab value="templates" role="tab" aria-controls="templates-panel">Templates</v-tab>
          </v-tabs>

          <v-divider role="separator"></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="propertiesTab" class="fill-height">
              <v-window-item value="content" role="tabpanel" id="content-panel">
                <div class="pa-4">
                  <v-text-field v-model="cardProperties.title" label="Title" variant="outlined" density="comfortable"
                    clearable prepend-inner-icon="mdi-format-title" class="mb-4"
                    aria-label="Card title input"></v-text-field>

                  <v-text-field v-model="cardProperties.subtitle" label="Subtitle" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-format-text" class="mb-4"
                    aria-label="Card subtitle input"></v-text-field>

                  <v-textarea v-model="cardProperties.text" label="Text" variant="outlined" density="comfortable"
                    auto-grow rows="3" row-height="20" clearable prepend-inner-icon="mdi-text" class="mb-4"
                    aria-label="Card content text"></v-textarea>

                  <v-text-field v-model="cardProperties.image" label="Image URL" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-image" class="mb-1"
                    aria-label="Card image URL input"></v-text-field>
                  <div class="d-flex flex-wrap mb-4">
                    <v-chip-group mandatory selected-class="bg-primary text-white" role="radiogroup"
                      aria-label="Image selection">
                      <v-chip size="small" value="none" @click="removeImage" role="radio"
                        aria-label="No image">None</v-chip>
                      <v-chip size="small" value="mountains" @click="setImage('mountains')" role="radio"
                        aria-label="Mountains image">Mountains</v-chip>
                      <v-chip size="small" value="beach" @click="setImage('beach')" role="radio"
                        aria-label="Beach image">Beach</v-chip>
                      <v-chip size="small" value="forest" @click="setImage('forest')" role="radio"
                        aria-label="Forest image">Forest</v-chip>
                    </v-chip-group>
                  </div>

                  <v-select v-model="cardProperties.icon" :items="icons" label="Icon" variant="outlined"
                    density="comfortable" clearable prepend-inner-icon="mdi-pencil" class="mb-4"
                    aria-label="Card icon selection">
                    <template v-slot:item="{ item, props }">
                      <v-list-item v-bind="props" role="option">
                        <template v-slot:prepend>
                          <v-icon :icon="item.raw" :aria-label="item.raw"></v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>

                  <div v-if="cardProperties.icon" class="mb-4">
                    <label class="text-subtitle-2 mb-1" id="icon-color-label">Icon color</label>
                    <div class="color-selector-container">
                      <v-btn-toggle v-model="iconColorIndex" mandatory density="comfortable"
                        selected-class="border-primary" role="radiogroup" aria-labelledby="icon-color-label">
                        <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1" role="radio" :aria-label="color.value">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="style" role="tabpanel" id="style-panel">
                <div class="pa-4">
                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block" id="elevation-slider">Elevation</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-card-outline</v-icon>
                      <v-slider v-model="cardProperties.elevation" min="0" max="24" step="1" thumb-label class="mx-2"
                        aria-labelledby="elevation-slider" role="slider"></v-slider>
                      <v-icon size="small" color="primary">mdi-layers-triple</v-icon>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1" id="variant-selection">Variant</label>
                    <v-chip-group v-model="cardVariantIndex" mandatory selected-class="bg-primary text-white"
                      role="radiogroup" aria-labelledby="variant-selection">
                      <v-chip v-for="(variant, index) in cardVariants" :key="variant" size="small" :value="index"
                        role="radio" :aria-label="variant">
                        {{ variant }}
                      </v-chip>
                    </v-chip-group>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1" id="color-selection">Color</label>
                    <div class="color-selector-container">
                      <v-btn-toggle v-model="cardColorIndex" mandatory density="comfortable"
                        selected-class="border-primary" role="radiogroup" aria-labelledby="color-selection">
                        <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                          :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                          width="40" height="40" class="ma-1" role="radio" :aria-label="color.value">
                          <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>

                  <v-switch v-model="cardProperties.loading" color="primary" label="Loading" hide-details class="mb-2"
                    role="switch" aria-label="Toggle loading state"></v-switch>
                  <v-switch v-model="cardProperties.disabled" color="primary" label="Disabled" hide-details class="mb-4"
                    role="switch" aria-label="Toggle disabled state"></v-switch>
                  <v-switch v-model="cardProperties.hoverEffect" color="primary" label="Hover effect" hide-details
                    class="mb-4" role="switch" aria-label="Toggle hover effect"></v-switch>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block" id="padding-slider">Padding</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-arrow-collapse</v-icon>
                      <v-slider v-model="cardProperties.padding" min="0" max="16" step="4" thumb-label class="mx-2"
                        aria-labelledby="padding-slider" role="slider"></v-slider>
                      <v-icon size="small" color="primary">mdi-arrow-expand</v-icon>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block" id="border-radius-slider">Border radius</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-square-outline</v-icon>
                      <v-slider v-model="roundedIndex" :min="0" :max="roundedLabels.length - 1" step="1" thumb-label
                        :thumb-label-text="roundedLabels[roundedIndex]" class="mx-2"
                        aria-labelledby="border-radius-slider" role="slider"></v-slider>
                      <v-icon size="small" color="primary">mdi-rectangle-outline</v-icon>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="actions" role="tabpanel" id="actions-panel">
                <div class="pa-4">
                  <v-switch v-model="cardProperties.showButtons" color="primary" label="Show buttons" hide-details
                    class="mb-4" role="switch" aria-label="Toggle button visibility"></v-switch>

                  <template v-if="cardProperties.showButtons">
                    <v-text-field v-model="cardProperties.buttonText" label="Button text" variant="outlined"
                      density="comfortable" prepend-inner-icon="mdi-button-cursor" class="mb-4"
                      aria-label="Button text input"></v-text-field>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1" id="button-style">Button style</label>
                      <v-chip-group v-model="buttonVariantIndex" mandatory selected-class="bg-primary text-white"
                        role="radiogroup" aria-labelledby="button-style">
                        <v-chip v-for="(variant, index) in buttonVariants" :key="variant" size="small" :value="index"
                          role="radio" :aria-label="variant">
                          {{ variant }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1" id="button-color">Button color</label>
                      <div class="d-flex overflow-x-auto">
                        <v-btn-toggle v-model="buttonColorIndex" mandatory density="comfortable" class="d-flex"
                          role="radiogroup" aria-labelledby="button-color">
                          <v-btn v-for="(color, index) in cardColors" :key="color.value" :value="index"
                            :color="color.value !== 'default' ? color.value : undefined" size="small" variant="tonal"
                            width="40" height="40" class="ma-1" role="radio" :aria-label="color.value">
                            <v-icon v-if="color.value === 'default'">mdi-palette-outline</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1 d-block" id="button-width">Button width</label>
                      <div class="d-flex align-center">
                        <v-chip size="x-small" aria-label="Auto width">Auto</v-chip>
                        <v-slider v-model="cardProperties.buttonWidth" min="0" max="100" step="25" thumb-label
                          :thumb-label-text="cardProperties.buttonWidth + '%'" class="mx-2"
                          aria-labelledby="button-width" role="slider"></v-slider>
                        <v-chip size="x-small" aria-label="Full width">100%</v-chip>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1" id="button-position">Button position</label>
                      <div class="d-flex justify-space-between">
                        <v-btn-toggle v-model="cardProperties.buttonPosition" mandatory density="comfortable"
                          role="radiogroup" aria-labelledby="button-position">
                          <v-btn value="start" icon="mdi-format-align-left" role="radio"
                            aria-label="Align left"></v-btn>
                          <v-btn value="center" icon="mdi-format-align-center" role="radio"
                            aria-label="Align center"></v-btn>
                          <v-btn value="end" icon="mdi-format-align-right" role="radio"
                            aria-label="Align right"></v-btn>
                          <v-btn value="space-between" icon="mdi-format-align-justify" role="radio"
                            aria-label="Space between"></v-btn>
                        </v-btn-toggle>
                      </div>
                    </div>

                    <v-autocomplete v-model="cardProperties.buttonIcon" :items="icons" label="Icon" variant="outlined"
                      density="comfortable" class="mb-2 mt-2" aria-label="Button icon selection"></v-autocomplete>

                    <v-text-field v-model="cardProperties.buttonLink" label="Link" variant="outlined"
                      density="comfortable" class="mb-2" aria-label="Button link URL"></v-text-field>

                  </template>

                  <v-switch v-model="cardProperties.showProgress" color="primary" label="Show progress circular"
                    hide-details class="mb-4" role="switch" aria-label="Toggle progress indicator"></v-switch>

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

              <v-window-item value="ARIA">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-access-point-check</v-icon>
                      <span class="text-h6">ARIA Attributes</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Add ARIA attributes to your card</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">Personnalisez les attributs ARIA pour améliorer l'accessibilité de votre
                    carte.</p>

                  <v-form>
                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-2">1. Select the element to improve</label>
                      <v-select v-model="selectedElement" :items="cardElements" item-title="name" item-value="id"
                        variant="outlined" density="comfortable" return-object class="mb-2"
                        prepend-inner-icon="mdi-selection" aria-label="Sélection de l'élément à modifier"></v-select>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div v-if="selectedElement" class="mb-4">
                      <div class="d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">{{ selectedElement.icon }}</v-icon>
                        <span class="text-subtitle-1">Configuration for "{{ selectedElement.name }}"</span>
                      </div>

                      <v-autocomplete v-model="selectedElement.ariaRole" :items="filteredAriaRoles" label="ARIA Role"
                        item-title="role" item-value="role" variant="outlined" density="comfortable" clearable
                        prepend-inner-icon="mdi-sitemap" return-object class="mb-4" role="combobox"
                        aria-label="Sélection du rôle ARIA">
                        <template v-slot:item="{ item, props }">
                          <v-list-item v-bind="props" class="role-item">
                            <template v-slot:prepend>
                              <v-icon color="primary" size="small">mdi-tag</v-icon>
                            </template>
                            <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
                          </v-list-item>
                        </template>
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title>
                              No ARIA role found
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-autocomplete>

                      <v-expansion-panels variant="accordion" class="mb-4">
                        <v-expansion-panel title="Attributs ARIA principaux">
                          <v-expansion-panel-text>
                            <v-text-field v-model="selectedElement.ariaProps.label" label="aria-label"
                              variant="outlined" density="comfortable" clearable prepend-inner-icon="mdi-tag-text"
                              class="mb-2" hint="Concise text description of the element" persistent-hint>
                              <template v-slot:append>
                                <v-chip v-if="isRecommendedAttribute('label', selectedElement)" color="success"
                                  size="x-small" class="ml-1">
                                  Recommended
                                </v-chip>
                              </template>
                            </v-text-field>

                            <v-text-field v-model="selectedElement.ariaProps.labelledby" label="aria-labelledby"
                              variant="outlined" density="comfortable" clearable prepend-inner-icon="mdi-tag-multiple"
                              class="mb-2" hint="ID of an element that labels this element" persistent-hint>
                              <template v-slot:append>
                                <v-chip v-if="isRecommendedAttribute('labelledby', selectedElement)" color="success"
                                  size="x-small" class="ml-1">
                                  Recommended
                                </v-chip>
                              </template>
                            </v-text-field>

                            <v-text-field v-model="selectedElement.ariaProps.describedby" label="aria-describedby"
                              variant="outlined" density="comfortable" clearable prepend-inner-icon="mdi-text-box"
                              class="mb-2" hint="ID of an element that describes this element" persistent-hint>
                              <template v-slot:append>
                                <v-chip v-if="isRecommendedAttribute('describedby', selectedElement)" color="success"
                                  size="x-small" class="ml-1">
                                  Recommended
                                </v-chip>
                              </template>
                            </v-text-field>
                          </v-expansion-panel-text>
                        </v-expansion-panel>

                        <v-expansion-panel title="États et propriétés">
                          <v-expansion-panel-text>
                            <div class="d-flex flex-wrap gap-2">
                              <v-switch v-model="selectedElement.ariaProps.expanded" color="primary"
                                label="aria-expanded" hide-details class="mr-4 mb-2"></v-switch>

                              <v-switch v-model="selectedElement.ariaProps.hidden" color="primary" label="aria-hidden"
                                hide-details class="mr-4 mb-2"></v-switch>

                              <v-switch v-model="selectedElement.ariaProps.disabled" color="primary"
                                label="aria-disabled" hide-details class="mr-4 mb-2"></v-switch>

                              <v-switch v-model="selectedElement.ariaProps.required" color="primary"
                                label="aria-required" hide-details class="mr-4 mb-2"></v-switch>

                              <v-switch v-model="selectedElement.ariaProps.selected" color="primary"
                                label="aria-selected" hide-details class="mr-4 mb-2"></v-switch>

                              <v-switch v-model="selectedElement.ariaProps.checked" color="primary" label="aria-checked"
                                hide-details class="mr-4 mb-2"></v-switch>
                            </div>
                          </v-expansion-panel-text>
                        </v-expansion-panel>

                        <v-expansion-panel title="Relations">
                          <v-expansion-panel-text>
                            <v-text-field v-model="selectedElement.ariaProps.controls" label="aria-controls"
                              variant="outlined" density="comfortable" clearable class="mb-2"
                              hint="ID of the element controlled by this one" persistent-hint></v-text-field>

                            <v-text-field v-model="selectedElement.ariaProps.owns" label="aria-owns" variant="outlined"
                              density="comfortable" clearable class="mb-2" hint="ID of the elements owned by this one"
                              persistent-hint></v-text-field>

                            <v-text-field v-model="selectedElement.ariaProps.flowto" label="aria-flowto"
                              variant="outlined" density="comfortable" clearable class="mb-2"
                              hint="ID of the next element in the reading sequence" persistent-hint></v-text-field>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>

                      <v-divider class="my-4"></v-divider>

                      <div class="d-flex align-center mb-4">
                        <v-icon color="primary" class="mr-2">mdi-eye-outline</v-icon>
                        <span class="text-subtitle-1">Preview of the ARIA attributes for "{{ selectedElement.name
                        }}"</span>
                      </div>

                      <v-alert type="info" variant="tonal" class="mb-4 aria-preview">
                        <pre v-if="getFormattedAriaAttributesForElement(selectedElement)" class="text-body-2">{{
                          getFormattedAriaAttributesForElement(selectedElement) }}</pre>
                        <span v-else>No ARIA attributes defined for this element</span>
                      </v-alert>
                    </div>

                    <v-btn color="primary" variant="tonal" class="mr-2" @click="applyAriaToCard">
                      <v-icon start>mdi-content-save</v-icon>
                      Apply modifications
                    </v-btn>

                    <v-btn color="error" variant="text" @click="resetAriaAttributes">
                      <v-icon start>mdi-refresh</v-icon>
                      Reset
                    </v-btn>
                  </v-form>
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </div>

      <div class="pa-4 d-flex flex-column"
        :class="studioMode === 'studio-seo' ? 'preview-area-seo' : 'preview-area-classic'">
        <div class="d-flex justify-space-between align-center mb-3">
          <div>
            <v-chip :color="studioMode === 'studio-seo' ? 'secondary' : 'primary'" variant="flat" size="small"
              class="mr-2">
              <v-icon start size="small">mdi-eye</v-icon>
              Live preview
            </v-chip>
          </div>
        </div>

        <div class="preview-canvas flex-grow-1 d-flex align-center justify-center pa-4" :style="filterStyle">
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

        <div class="d-flex justify-end mt-3">
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            Preview Code
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyCardCode">
            Copy code
          </v-btn>
        </div>
      </div>

      <v-dialog v-model="showCodeDialog" width="800">
        <v-card class="bg-grey-darken-4" :loading="loading">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <v-tabs v-model="codeTab" color="primary">
              <v-tab value="template">Template</v-tab>
              <v-tab value="theme">Theme</v-tab>
            </v-tabs>
            <v-btn icon="mdi-close" variant="text" @click="showCodeDialog = false"></v-btn>
          </v-card-title>
          <v-card-text>
            <v-window v-model="codeTab">
              <v-window-item value="template">
                <pre class="code-block"><code class="language-vue" ref="codeElement">{{ highlightedTemplateCode }}</code>
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
              Copy Current Tab
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
    </v-main>
  </v-app>

  <svg width="0" height="0" style="position: absolute; visibility: hidden; z-index: -1;">
    <filter id="protanopia-filter">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.567, 0.433, 0, 0, 0
                0.558, 0.442, 0, 0, 0
                0, 0.242, 0.758, 0, 0
                0, 0, 0, 1, 0" />
    </filter>

    <filter id="deuteranopia-filter">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.625, 0.375, 0, 0, 0
                0.7, 0.3, 0, 0, 0
                0, 0.3, 0.7, 0, 0
                0, 0, 0, 1, 0" />
    </filter>

    <filter id="tritanopia-filter">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.95, 0.05, 0, 0, 0
                0, 0.433, 0.567, 0, 0
                0, 0.475, 0.525, 0, 0
                0, 0, 0, 1, 0" />
    </filter>
  </svg>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref, watch, type Ref } from 'vue';
import PremiumFeature from '../../components/PremiumFeature.vue';
import Snackbar from '../../components/snackbar.vue';
import { useUserStore } from '../../stores/userStore';
import { getCardTemplate } from '../../utils/cardTemplates';
import { applyVisionFilter, filterIntensity, filterStyle, selectedVisionType, visionTypeIcon, visionTypes } from '../../utils/filter';
import icons from '../../utils/icons';
import theme from '../../utils/theme';
import { StudioModeInjection } from './studio-types';
import { highlightCode, highlightCodeFromSource } from './types/highlight';
import { CardElement } from './types/types-card';
import { isRecommendedAttribute, allAriaRoles } from './types/types-aria';
import { cardVariants, cardColors, buttonVariants, progressSizes, roundedLabels, iconColorIndex, cardVariantIndex, cardColorIndex, buttonColorIndex, buttonVariantIndex, progressSizeIndex, progressColorIndex, cardVariant, cardColor, buttonVariant, buttonColor, progressColor, progressSize, iconColor, cardProperties, progressBgColorIndex, progressBgColor, sparklineColorIndex, sparklineColor, sparklineDataText, sparklineLabelsText, progressPositions, roundedIndexToValue, roundedValueToIndex, cardElements } from './types/types-card';

const generatedCode: Ref<string> = ref('');
const codeElement: Ref<HTMLElement | null> = ref(null);
const themeCodeElement: Ref<HTMLElement | null> = ref(null);
const loading = ref(false);

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

const studioModeInjection = inject<StudioModeInjection>('studioMode')
if (!studioModeInjection) {
  console.error('studioMode injection not found')
}

const studioMode = computed(() => studioModeInjection?.mode?.value || 'studio')


const emit = defineEmits(['update:content', 'save'])

const userStore = useUserStore()
const propertiesTab = ref('content')
const showCodeDialog = ref(false)
const showSnackbarMessage = ref(false)
const snackbarText = ref('Code copied to clipboard')
const snackbarColor = ref('success')
const componentType = ref('card')
const codeTab = ref('template')

const timelineItemsCount = ref(3)

const selectedElement = ref<CardElement | null>(null);

const filteredAriaRoles = computed(() => {
  if (!selectedElement.value) return [];

  return allAriaRoles.value.filter(role =>
    selectedElement.value?.recommendedRoles.includes(role.role)
  );
});

const applyAriaToCard = () => {
  generateCardCodeSilently();

  snackbarText.value = 'ARIA attributes applied successfully';
  snackbarColor.value = 'success';
  showSnackbarMessage.value = true;
};

const resetAriaAttributes = () => {
  cardElements.value.forEach(element => {
    element.ariaRole = null;
    Object.keys(element.ariaProps).forEach(key => {
      if (typeof element.ariaProps[key] === 'boolean') {
        element.ariaProps[key] = false;
      } else {
        element.ariaProps[key] = '';
      }
    });
  });

  selectedElement.value = null;

  snackbarText.value = 'ARIA attributes reset';
  snackbarColor.value = 'info';
  showSnackbarMessage.value = true;
};

const timelineItems = ref([
  { title: 'User 1', message: 'Message sent', color: 'primary' },
  { title: 'User 2', message: 'File uploaded', color: 'success' },
  { title: 'User 3', message: 'Task completed', color: 'info' },
  { title: 'User 4', message: 'Comment added', color: 'warning' },
  { title: 'User 5', message: 'Status updated', color: 'error' }
])

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

const generateCardCode = () => {
  const templateCode = generateTemplateCode();
  const themeCode = theme;

  switch (codeTab.value) {
    case 'template':
      return templateCode;
    case 'style':
      return themeCode;
    default:
      return `${templateCode}\n\n${themeCode}`;
  }
};

function generateTemplateCode() {
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

  const cardElement = cardElements.value.find(e => e.id === 'card');
  if (cardElement && cardElement.ariaRole) {
    code += ` role="${cardElement.ariaRole.role}"`;
  }

  if (cardElement) {
    Object.entries(cardElement.ariaProps).forEach(([key, value]) => {
      if (value !== '' && value !== false) {
        if (typeof value === 'boolean') {
          code += ` aria-${key}="true"`;
        } else {
          code += ` aria-${key}="${value}"`;
        }
      }
    });
  }

  code += '>';

  if (card.image) {
    code += `\n  <v-img src="${card.image}" height="200" cover`;

    const imageElement = cardElements.value.find(e => e.id === 'image');
    if (imageElement && imageElement.ariaRole) {
      code += ` role="${imageElement.ariaRole.role}"`;
    }

    if (imageElement) {
      Object.entries(imageElement.ariaProps).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          if (typeof value === 'boolean') {
            code += ` aria-${key}="true"`;
          } else {
            code += ` aria-${key}="${value}"`;
          }
        }
      });
    }

    code += `></v-img>`;
  }

  if (card.title) {
    code += `\n  <v-card-title`;

    const titleElement = cardElements.value.find(e => e.id === 'title');
    if (titleElement && titleElement.ariaRole) {
      code += ` role="${titleElement.ariaRole.role}"`;
    }

    if (titleElement) {
      Object.entries(titleElement.ariaProps).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          if (typeof value === 'boolean') {
            code += ` aria-${key}="true"`;
          } else {
            code += ` aria-${key}="${value}"`;
          }
        }
      });
    }

    code += `>\n`;

    if (card.icon) {
      code += `<v-icon start`;
      if (cardColors[iconColorIndex.value].value !== 'default') {
        code += ` color="${cardColors[iconColorIndex.value].value}"`;
      }
      code += `>${card.icon}</v-icon> `;
    }
    code += `${card.title}\n</v-card-title>`;
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

    const sparklineElement = cardElements.value.find(e => e.id === 'sparkline');
    if (sparklineElement && sparklineElement.ariaRole) {
      code += `\n        role="${sparklineElement.ariaRole.role}"`;
    }

    if (sparklineElement) {
      Object.entries(sparklineElement.ariaProps).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          if (typeof value === 'boolean') {
            code += `\n        aria-${key}="true"`;
          } else {
            code += `\n        aria-${key}="${value}"`;
          }
        }
      });
    }

    code += `\n      ></v-sparkline>`;
    code += `\n    </div>`;
    code += `\n  </v-card-text>`;
  }

  if (card.showTimeline) {
    code += `\n  <v-card-text>`;
    code += `\n    <div class="font-weight-bold ms-1 mb-2">Today</div>`;
    code += `\n    <v-timeline align="start" density="compact"`;

    const timelineElement = cardElements.value.find(e => e.id === 'timeline');
    if (timelineElement && timelineElement.ariaRole) {
      code += ` role="${timelineElement.ariaRole.role}"`;
    }

    if (timelineElement) {
      Object.entries(timelineElement.ariaProps).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          if (typeof value === 'boolean') {
            code += ` aria-${key}="true"`;
          } else {
            code += ` aria-${key}="${value}"`;
          }
        }
      });
    }

    code += `>`;

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
      code += `\n    <v-btn ${cardColors[buttonColorIndex.value].value !== 'default' ? `color="${cardColors[buttonColorIndex.value].value}" ` : ''}variant="${buttonVariants[buttonVariantIndex.value]}"${card.buttonWidth > 0 ? ` style="width: ${card.buttonWidth}%"` : ''} ${card.buttonIcon ? `append-icon="${card.buttonIcon}"` : ''} ${card.buttonLink ? `to="${card.buttonLink}"` : ''}`;

      const buttonElement = cardElements.value.find(e => e.id === 'button');
      if (buttonElement && buttonElement.ariaRole) {
        code += ` role="${buttonElement.ariaRole.role}"`;
      }

      if (buttonElement) {
        Object.entries(buttonElement.ariaProps).forEach(([key, value]) => {
          if (value !== '' && value !== false) {
            if (typeof value === 'boolean') {
              code += ` aria-${key}="true"`;
            } else {
              code += ` aria-${key}="${value}"`;
            }
          }
        });
      }

      code += `>${card.buttonText || 'Action'}</v-btn>`;
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

      const progressElement = cardElements.value.find(e => e.id === 'progress');
      if (progressElement && progressElement.ariaRole) {
        code += ` role="${progressElement.ariaRole.role}"`;
      }

      if (progressElement) {
        Object.entries(progressElement.ariaProps).forEach(([key, value]) => {
          if (value !== '' && value !== false) {
            if (typeof value === 'boolean') {
              code += ` aria-${key}="true"`;
            } else {
              code += ` aria-${key}="${value}"`;
            }
          }
        });
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

    code += '\n</v-card>\n\n';
  }

  try {
    return highlightCodeFromSource(code);
  } finally {
    loading.value = false;
  }
}

function generateCardCodeSilently() {
  const code = generateCardCode()
  emit('update:content', code)
}

const previewCode = () => {
  generatedCode.value = generateCardCode();
  showCodeDialog.value = true;
  nextTick(() => {
    if (codeElement.value && themeCodeElement.value && codeTab.value) {
      highlightCode(codeElement.value, themeCodeElement.value, codeTab.value);
    }
  });
};

const copyCardCode = () => {
  const templateCode = generateTemplateCode();

  const fullCode = `${templateCode}\n\n${theme}`;

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

          if (templateData.ariaRole) {
            const roleObj = allAriaRoles.value.find(r => r.role === templateData.ariaRole);
            if (roleObj) {
              const cardElement = cardElements.value.find(e => e.id === 'card');
              if (cardElement) {
                cardElement.ariaRole = roleObj;
                selectedElement.value = cardElement;

                if (templateData.ariaLabel) {
                  cardElement.ariaProps.label = templateData.ariaLabel;
                }

                if (templateData.ariaLabelledBy) {
                  cardElement.ariaProps.labelledby = templateData.ariaLabelledBy;
                }

                if (templateData.ariaDescribedBy) {
                  cardElement.ariaProps.describedby = templateData.ariaDescribedBy;
                }

                if (templateData.ariaControls) {
                  cardElement.ariaProps.controls = templateData.ariaControls;
                }
              }
            }
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

const highlightedTemplateCode = computed(() => {
  return generateTemplateCode();
});

const highlightedThemeCode = computed(() => {
  return theme;
});

watch(codeTab, (newTab) => {
  nextTick(() => {
    const element = newTab === 'template' ? codeElement.value : themeCodeElement.value;
    if (element && codeElement.value && themeCodeElement.value) {
      highlightCode(codeElement.value, themeCodeElement.value, codeTab.value);
    }
  });
});

watch([highlightedTemplateCode, highlightedThemeCode], () => {
  nextTick(() => {
    if (codeTab.value === 'template' && codeElement.value && themeCodeElement.value) {
      highlightCode(codeElement.value, themeCodeElement.value, codeTab.value);
    } else if (codeTab.value === 'theme' && codeElement.value && themeCodeElement.value) {
      highlightCode(codeElement.value, themeCodeElement.value, codeTab.value);
    }
  });
}, { immediate: true });

onMounted(() => {
  nextTick(() => {
    const element = codeTab.value === 'template' ? codeElement.value : themeCodeElement.value;
    if (element && codeElement.value && themeCodeElement.value) {
      highlightCode(codeElement.value, themeCodeElement.value, codeTab.value);
    }
  });
});

const getFormattedAriaAttributesForElement = (element: CardElement | null) => {
  if (!element) return null;

  const attributes: Array<string> = [];

  if (element.ariaRole) {
    attributes.push(`role="${element.ariaRole.role}"`);
  }

  Object.entries(element.ariaProps).forEach(([key, value]) => {
    if (value !== '' && value !== false) {
      if (typeof value === 'boolean') {
        attributes.push(`aria-${key}="true"`);
      } else {
        attributes.push(`aria-${key}="${value}"`);
      }
    }
  });

  return attributes.length ? attributes.join('\n') : null;
};

const suggestAriaAttributesForRole = (element: CardElement | null) => {
  if (!element || !element.ariaRole) return;

  const roleValue = element.ariaRole.role;

  if (roleValue === 'button') {
    if (!element.ariaProps.pressed) element.ariaProps.pressed = false;
    if (!element.ariaProps.label && !element.ariaProps.labelledby) element.ariaProps.label = `Bouton ${element.id}`;
    if (!element.ariaProps.disabled) element.ariaProps.disabled = false;
  }

  if (roleValue === 'progressbar') {
    if (!element.ariaProps.valuemin) element.ariaProps.valuemin = '0';
    if (!element.ariaProps.valuemax) element.ariaProps.valuemax = '100';
    if (!element.ariaProps.valuenow) element.ariaProps.valuenow = '0';
  }

  if (roleValue === 'link') {
    if (!element.ariaProps.label && !element.ariaProps.labelledby) element.ariaProps.label = `Lien ${element.id}`;
  }

  if (roleValue === 'img' || roleValue === 'image') {
    if (!element.ariaProps.label && !element.ariaProps.labelledby) element.ariaProps.label = `Image ${element.id}`;
  }

  if (roleValue === 'heading') {
    if (!element.ariaProps.level) element.ariaProps.level = '2';
  }

  if (roleValue === 'checkbox') {
    if (!element.ariaProps.checked) element.ariaProps.checked = false;
  }

  if (roleValue === 'combobox' || roleValue === 'listbox') {
    if (!element.ariaProps.expanded) element.ariaProps.expanded = false;
    if (!element.ariaProps.controls) element.ariaProps.controls = `${element.id}-list`;
  }

  if (roleValue === 'grid' || roleValue === 'table') {
    if (!element.ariaProps.rowcount) element.ariaProps.rowcount = '0';
    if (!element.ariaProps.colcount) element.ariaProps.colcount = '0';
  }

  if (roleValue === 'dialog' || roleValue === 'alertdialog') {
    if (!element.ariaProps.modal) element.ariaProps.modal = true;
  }

  if (roleValue === 'slider') {
    if (!element.ariaProps.valuemin) element.ariaProps.valuemin = '0';
    if (!element.ariaProps.valuemax) element.ariaProps.valuemax = '100';
    if (!element.ariaProps.valuenow) element.ariaProps.valuenow = '50';
    if (!element.ariaProps.orientation) element.ariaProps.orientation = 'horizontal';
  }
};

watch(() => selectedElement.value?.ariaRole, (newRole, oldRole) => {
  if (selectedElement.value && newRole && newRole !== oldRole) {
    suggestAriaAttributesForRole(selectedElement.value);
  }
});

</script>

<style scoped>
.fill-height {
  height: 100%
}
.gap-2 {
  gap: 8px
}
.control-panel {
  width: 400px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
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
