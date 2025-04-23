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

          <v-tabs v-model="tab" color="primary" align-tabs="center" class="px-4">
            <v-tab value="content">Content</v-tab>
            <v-tab value="style">Style</v-tab>
            <v-tab value="cards">Cards</v-tab>
            <v-tab value="actions">Actions</v-tab>
            <v-tab value="templates">Templates</v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-card-text class="pa-0 fill-height" style="overflow-y: auto">
            <v-window v-model="tab" class="fill-height">
              <v-window-item value="content">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-timeline</v-icon>
                    <span class="text-h6">Timeline Items</span>
                  </div>

                  <v-card class="mb-4 pa-3">
                    <div v-for="(item, index) in timelineItems" :key="index" class="mb-4">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <span class="text-subtitle-2">Item {{ index + 1 }}</span>
                        <v-btn icon="mdi-delete" color="error" variant="text" density="compact"
                          @click="removeTimelineItem(index)"></v-btn>
                      </div>

                      <v-text-field v-model="item.title" label="Title" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-format-title" class="mb-2"></v-text-field>

                      <v-textarea v-model="item.text" label="Content" variant="outlined" density="compact" auto-grow
                        rows="2" row-height="20" prepend-inner-icon="mdi-text" class="mb-2"></v-textarea>

                      <div class="d-flex gap-2">
                        <v-select v-model="item.icon" :items="timelineIcons" label="Icon" variant="outlined"
                          density="compact" prepend-inner-icon="mdi-pencil" class="mb-2" style="flex: 1">
                          <template v-slot:item="{ item, props }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon :icon="item.raw"></v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-select v-model="item.color" :items="colors" label="Dot Color" variant="outlined"
                          density="compact" prepend-inner-icon="mdi-palette" class="mb-2" style="flex: 1">
                          <template v-slot:item="{ item, props }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon :color="item.raw !== 'default' ? item.raw : undefined">mdi-circle</v-icon>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </div>

                      <v-text-field v-model="item.time" label="Time/Date" variant="outlined" density="compact"
                        prepend-inner-icon="mdi-clock-outline" class="mb-2"></v-text-field>

                      <v-switch v-model="item.hideOpposite" color="primary" label="Hide opposite content" hide-details
                        class="mb-2"></v-switch>
                    </div>

                    <v-btn color="primary" prepend-icon="mdi-plus" variant="tonal" block @click="addTimelineItem">
                      Add timeline item
                    </v-btn>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="style">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-palette</v-icon>
                    <span class="text-h6">Appearance</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2 d-block">Timeline Color</label>
                    <v-btn-toggle v-model="timelineProperties.lineColor" mandatory density="comfortable"
                      selected-class="border-primary">
                      <v-btn v-for="color in colors" :key="color" :value="color"
                        :color="color !== 'default' ? color : undefined" size="small" variant="tonal" width="40"
                        height="40" class="ma-1">
                        <v-icon v-if="color === 'default'">mdi-palette-outline</v-icon>
                      </v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Line Width</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-minus</v-icon>
                      <v-slider v-model="timelineProperties.lineWidth" min="1" max="5" step="1" thumb-label
                        class="mx-2"></v-slider>
                      <v-icon size="small" color="primary">mdi-plus</v-icon>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-1 d-block">Dot Size</label>
                    <div class="d-flex align-center">
                      <v-icon size="small" color="primary">mdi-circle-small</v-icon>
                      <v-slider v-model="timelineProperties.dotSize" min="10" max="48" step="2" thumb-label
                        class="mx-2"></v-slider>
                      <v-icon size="small" color="primary">mdi-circle-large</v-icon>
                    </div>
                  </div>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-monitor-dashboard</v-icon>
                    <span class="text-h6">Layout & Position</span>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Alignment</label>
                    <v-btn-toggle v-model="timelineProperties.align" mandatory density="comfortable" class="mb-3">
                      <v-btn value="start" prepend-icon="mdi-format-align-left">Left</v-btn>
                      <v-btn value="center" prepend-icon="mdi-format-align-center">Center</v-btn>
                      <v-btn value="end" prepend-icon="mdi-format-align-right">Right</v-btn>
                    </v-btn-toggle>
                  </div>

                  <div class="mb-4">
                    <label class="text-subtitle-2 mb-2">Direction</label>
                    <v-btn-toggle v-model="timelineProperties.direction" mandatory density="comfortable" class="mb-3">
                      <v-btn value="vertical" prepend-icon="mdi-arrow-up-down">Vertical</v-btn>
                      <v-btn value="horizontal" prepend-icon="mdi-arrow-left-right">Horizontal</v-btn>
                    </v-btn-toggle>
                  </div>

                  <v-switch v-model="timelineProperties.reverse" color="primary" label="Reverse order" hide-details
                    class="mb-2"></v-switch>
                  <v-switch v-model="timelineProperties.dense" color="primary" label="Dense" hide-details
                    class="mb-2"></v-switch>
                  <v-switch v-model="timelineProperties.rounded" color="primary" label="Rounded dots" hide-details
                    class="mb-2"></v-switch>
                </div>
              </v-window-item>

              <v-window-item value="cards">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-card-outline</v-icon>
                    <span class="text-h6">Card Style</span>
                  </div>

                  <v-switch v-model="timelineProperties.showCards" color="primary" label="Show cards" hide-details
                    class="mb-4"></v-switch>

                  <div v-if="timelineProperties.showCards">
                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Card Variant</label>
                      <v-chip-group v-model="cardVariantIndex" mandatory selected-class="bg-primary text-white">
                        <v-chip v-for="(variant, index) in cardVariants" :key="variant" size="small" :value="index">
                          {{ variant }}
                        </v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1 d-block">Card Elevation</label>
                      <div class="d-flex align-center">
                        <v-icon size="small" color="primary">mdi-card-outline</v-icon>
                        <v-slider v-model="timelineProperties.cardElevation" min="0" max="24" step="1" thumb-label
                          class="mx-2"></v-slider>
                        <v-icon size="small" color="primary">mdi-layers-triple</v-icon>
                      </div>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Card Background Color</label>
                      <v-btn-toggle v-model="timelineProperties.cardColor" mandatory density="comfortable"
                        selected-class="border-primary">
                        <v-btn v-for="color in colors" :key="color" :value="color"
                          :color="color !== 'default' ? color : undefined" size="small" variant="tonal" width="40"
                          height="40" class="ma-1">
                          <v-icon v-if="color === 'default'">mdi-palette-outline</v-icon>
                        </v-btn>
                      </v-btn-toggle>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Title Style</label>
                      <v-chip-group v-model="timelineProperties.titleStyle" mandatory
                        selected-class="bg-primary text-white">
                        <v-chip size="small" value="regular">Regular</v-chip>
                        <v-chip size="small" value="bold">Bold</v-chip>
                        <v-chip size="small" value="italic">Italic</v-chip>
                        <v-chip size="small" value="uppercase">uppercase</v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Card Padding</label>
                      <v-chip-group v-model="timelineProperties.cardPadding" mandatory
                        selected-class="bg-primary text-white">
                        <v-chip size="small" value="pa-0">None</v-chip>
                        <v-chip size="small" value="pa-2">xs</v-chip>
                        <v-chip size="small" value="pa-4">sm</v-chip>
                        <v-chip size="small" value="pa-6">md</v-chip>
                        <v-chip size="small" value="pa-8">lg</v-chip>
                        <v-chip size="small" value="pa-10">xl</v-chip>
                      </v-chip-group>
                    </div>

                    <div class="mb-4">
                      <label class="text-subtitle-2 mb-1">Card Border Radius</label>
                      <v-chip-group v-model="timelineProperties.cardBorderRadius" mandatory
                        selected-class="bg-primary text-white">
                        <v-chip size="small" value="rounded-0">None</v-chip>
                        <v-chip size="small" value="rounded">Default</v-chip>
                        <v-chip size="small" value="rounded-lg">Large</v-chip>
                        <v-chip size="small" value="rounded-xl">X-Large</v-chip>
                        <v-chip size="small" value="rounded-pill">Pill</v-chip>
                      </v-chip-group>
                    </div>

                    <v-switch v-model="timelineProperties.cardHoverEffect" color="primary" label="Hover effect"
                      hide-details class="mb-2"></v-switch>
                    <v-switch v-model="timelineProperties.separateHeader" color="primary" label="Separate header"
                      hide-details class="mb-2"></v-switch>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="actions">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-animation-outline</v-icon>
                    <span class="text-h6">Animations</span>
                  </div>

                  <v-switch v-model="timelineProperties.animated" color="primary" label="Enable animations" hide-details
                    class="mb-4"></v-switch>

                  <div v-if="timelineProperties.animated">
                    <v-select v-model="timelineProperties.transition" :items="transitions" label="Transition effect"
                      variant="outlined" density="comfortable" class="mb-4"></v-select>

                    <v-slider v-model="timelineProperties.transitionDuration" min="1000" max="10000" step="100"
                      label="Transition duration (ms)" thumb-label class="mb-4"></v-slider>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="templates">
                <div class="pa-4">
                  <div class="section-title d-flex align-center mb-3 justify-space-between">
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-file-document-outline</v-icon>
                      <span class="text-h6">Timeline Templates</span>
                    </div>
                    <v-tooltip location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-help-circle-outline" variant="text" size="small" v-bind="props"></v-btn>
                      </template>
                      <span>Apply pre-defined templates or save your own</span>
                    </v-tooltip>
                  </div>

                  <p class="text-body-2 mb-4">Choose a pre-defined template to quickly create common timeline layouts.
                  </p>

                  <v-card class="mb-4">
                    <v-list>
                      <v-list-item @click="applyTemplate('project')" prepend-icon="mdi-flag" title="Project Timeline"
                        subtitle="Project management milestones"></v-list-item>
                      <v-list-item @click="applyTemplate('routine')" prepend-icon="mdi-clock-time-eight"
                        title="Daily Routine" subtitle="Daily schedule management"></v-list-item>
                      <v-list-item @click="applyTemplate('history')" prepend-icon="mdi-history" title="Company History"
                        subtitle="Historical milestones"></v-list-item>
                      <v-list-item @click="applyTemplate('process')" prepend-icon="mdi-clipboard-flow"
                        title="Workflow Process" subtitle="Step-by-step workflow"></v-list-item>
                    </v-list>
                  </v-card>

                  <v-alert type="info" variant="tonal" class="mb-4">
                    Applying a template will replace your current timeline settings.
                  </v-alert>

                  <v-divider class="my-4"></v-divider>

                  <div class="section-title d-flex align-center mb-3">
                    <v-icon color="primary" class="mr-2">mdi-content-save</v-icon>
                    <span class="text-h6">Save Current Timeline</span>
                  </div>

                  <v-text-field v-model="customTemplateName" label="Template Name" variant="outlined"
                    density="comfortable" prepend-inner-icon="mdi-tag" class="mb-4"></v-text-field>

                  <v-btn color="primary" prepend-icon="mdi-content-save" block @click="saveCurrentTemplate">
                    Save Current Timeline as Template
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
            Live preview
          </v-chip>
        </div>

        <div class="preview-canvas flex-grow-1 pa-4" :style="filterStyle">
          <v-btn v-if="timelineProperties.animated" color="primary" class="mb-4" @click="triggerAnimation">
            View animation
          </v-btn>

          <transition :name="timelineProperties.transition" v-if="timelineProperties.animated">
            <v-timeline v-show="showTimeline" :align="timelineProperties.align as any"
              :direction="timelineProperties.direction" :side="timelineProperties.side"
              :density="timelineProperties.dense ? 'compact' : 'default'"
              :line-color="timelineProperties.lineColor !== 'default' ? timelineProperties.lineColor : undefined"
              :line-width="timelineProperties.lineWidth" :dot-size="timelineProperties.dotSize"
              :reverse="timelineProperties.reverse" :truncate-line="timelineProperties.truncateLine as any">
              <v-timeline-item v-for="(item, index) in timelineItems" :key="index"
                :dot-color="item.color !== 'default' ? item.color : undefined" :icon="item.icon"
                :hide-opposite="item.hideOpposite" :size="timelineProperties.dotSize"
                :rounded="timelineProperties.rounded">
                <template v-slot:opposite>
                  <div v-if="!item.hideOpposite" class="text-caption">
                    {{ item.time }}
                  </div>
                </template>

                <template v-if="timelineProperties.showCards">
                  <v-card :variant="cardVariant" :elevation="timelineProperties.cardElevation"
                    :color="timelineProperties.cardColor !== 'default' ? timelineProperties.cardColor : undefined"
                    class="mb-4" :class="getCardClasses()"
                    v-bind="timelineProperties.animated ? { transition: timelineProperties.transition } : {}"
                    :style="timelineProperties.animated ? `transition-duration: ${timelineProperties.transitionDuration}ms` : ''">
                    <v-card-title :class="getTitleStyleClass()">{{ item.title }}</v-card-title>
                    <v-divider v-if="timelineProperties.separateHeader"></v-divider>
                    <v-card-text>{{ item.text }}</v-card-text>
                  </v-card>
                </template>
                <template v-else>
                  <div :class="['text-h6', getTitleStyleClass()]"
                    v-bind="timelineProperties.animated ? { transition: timelineProperties.transition } : {}"
                    :style="timelineProperties.animated ? `transition-duration: ${timelineProperties.transitionDuration}ms` : ''">
                    {{ item.title }}
                  </div>
                  <div v-bind="timelineProperties.animated ? { transition: timelineProperties.transition } : {}"
                    :style="timelineProperties.animated ? `transition-duration: ${timelineProperties.transitionDuration}ms` : ''">
                    {{ item.text }}
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </transition>

          <v-timeline v-if="!timelineProperties.animated" :align="timelineProperties.align as any"
            :direction="timelineProperties.direction" :side="timelineProperties.side"
            :density="timelineProperties.dense ? 'compact' : 'default'"
            :line-color="timelineProperties.lineColor !== 'default' ? timelineProperties.lineColor : undefined"
            :line-width="timelineProperties.lineWidth" :dot-size="timelineProperties.dotSize"
            :reverse="timelineProperties.reverse" :truncate-line="timelineProperties.truncateLine as any">
            <v-timeline-item v-for="(item, index) in timelineItems" :key="index"
              :dot-color="item.color !== 'default' ? item.color : undefined" :icon="item.icon"
              :hide-opposite="item.hideOpposite" :size="timelineProperties.dotSize"
              :rounded="timelineProperties.rounded">
              <template v-slot:opposite>
                <div v-if="!item.hideOpposite" class="text-caption">
                  {{ item.time }}
                </div>
              </template>

              <template v-if="timelineProperties.showCards">
                <v-card :variant="cardVariant" :elevation="timelineProperties.cardElevation"
                  :color="timelineProperties.cardColor !== 'default' ? timelineProperties.cardColor : undefined"
                  class="mb-4" :class="getCardClasses()">
                  <v-card-title :class="getTitleStyleClass()">{{ item.title }}</v-card-title>
                  <v-divider v-if="timelineProperties.separateHeader"></v-divider>
                  <v-card-text>{{ item.text }}</v-card-text>
                </v-card>
              </template>
              <template v-else>
                <div :class="['text-h6', getTitleStyleClass()]">{{ item.title }}</div>
                <div>{{ item.text }}</div>
              </template>
            </v-timeline-item>
          </v-timeline>
        </div>

        <div class="d-flex justify-end mt-3">
          <v-btn color="secondary" class="mr-2" prepend-icon="mdi-eye" @click="previewCode">
            Preview Code
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-copy" @click="copyTimelineCode">
            Copy to Clipboard
          </v-btn>
        </div>
      </div>
    </v-main>

    <v-dialog v-model="showCodeDialog" width="800">
      <v-card class="bg-grey-darken-4">
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
            Copy Current Tab
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Snackbar v-model="showSnackbarMessage" :text="snackbarText" :color="snackbarColor" />
  </v-app>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/atom-one-dark.css';
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue';
import Snackbar from '../../components/snackbar.vue';
import { useUserStore } from '../../stores/userStore';
import { applyVisionFilter, filterIntensity, filterStyle, selectedVisionType, visionTypeIcon, visionTypes } from '../../utils/filter';
import theme from '../../utils/theme';
import { getTimelineTemplate } from '../../utils/timelineTemplates';
import { StudioModeInjection } from './studio-types';
import { timelineItems, timelineProperties, timelineIcons, colors, cardVariants, cardVariant, transitions, cardVariantIndex } from './types/type-timeline';

const emit = defineEmits(['update:content', 'save']);

const studioModeInjection = inject<StudioModeInjection>('studioMode')
if (!studioModeInjection) {
  console.error('studioMode injection not found')
}

const studioMode = computed(() => studioModeInjection?.mode?.value || 'studio')

const codeTab = ref('template');
const tab = ref('content');
const codeElement = ref<HTMLElement | null>(null);
const themeCodeElement = ref<HTMLElement | null>(null);
const scriptCodeElement = ref<HTMLElement | null>(null);
const previewMode = ref('desktop');
const showCodeDialog = ref(false);
const generatedCode = ref('');
const showSnackbarMessage = ref(false);
const snackbarColor = ref('success');
const userStore = useUserStore();
const snackbarText = ref('');

const customTemplateName = ref('');

const addTimelineItem = () => {
  timelineItems.value.push({
    title: 'New milestone',
    text: 'Add your description here',
    icon: 'mdi-star',
    color: 'primary',
    time: 'Date/Time',
    hideOpposite: false
  });
};

const removeTimelineItem = (index: number) => {
  timelineItems.value.splice(index, 1);
};

const applyTemplate = (template: string) => {
  const templateData = getTimelineTemplate(template);

  if (!templateData) {
    showSnackbarMessage.value = true;
    return;
  }

  Object.assign(timelineProperties.value, templateData);

  if (templateData.items) {
    timelineItems.value = [...templateData.items];
  }

  showSnackbarMessage.value = true;
  snackbarText.value = `${template} template applied successfully`;
  generateTimelineCodeSilently();
};

const saveCurrentTemplate = async () => {
  if (!customTemplateName.value) {
    snackbarText.value = 'Please enter a template name';
    showSnackbarMessage.value = true;
    return;
  }

  const templateData = {
    ...JSON.parse(JSON.stringify(timelineProperties.value)),
    items: [...timelineItems.value]
  };

  const response = await userStore.saveTemplate(customTemplateName.value, templateData, 'timeline');

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

const generateTimelineCode = () => {
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
  let code = '<v-timeline\n';

  if (timelineProperties.value.align !== 'center') code += `  align="${timelineProperties.value.align}"\n`;
  if (timelineProperties.value.direction !== 'vertical') code += `  direction="${timelineProperties.value.direction}"\n`;
  if (timelineProperties.value.side) code += `  side="${timelineProperties.value.side}"\n`;
  if (timelineProperties.value.dense) code += `  density="compact"\n`;
  if (timelineProperties.value.lineColor !== 'default') code += `  line-color="${timelineProperties.value.lineColor}"\n`;
  if (timelineProperties.value.lineWidth !== 2) code += `  :line-width="${timelineProperties.value.lineWidth}"\n`;
  if (timelineProperties.value.dotSize !== 36) code += `  :dot-size="${timelineProperties.value.dotSize}"\n`;
  if (timelineProperties.value.reverse) code += `  reverse\n`;
  if (timelineProperties.value.truncateLine) code += `  truncate-line\n`;

  code += '>\n';

  code += '  <v-timeline-item\n';
  code += '    v-for="(item, index) in timelineItems"\n';
  code += '    :key="index"\n';
  code += '    :dot-color="item.color !== \'default\' ? item.color : undefined"\n';
  code += '    :icon="item.icon"\n';
  code += '    :hide-opposite="item.hideOpposite"\n';
  code += `    :size="${timelineProperties.value.dotSize}"\n`;
  if (timelineProperties.value.rounded) code += '    rounded\n';
  code += '  >\n';

  code += '    <template v-slot:opposite>\n';
  code += '      <div v-if="!item.hideOpposite" class="text-caption">{{ item.time }}</div>\n';
  code += '    </template>\n';

  if (timelineProperties.value.showCards) {
    code += '    <v-card\n';
    code += `      variant="${cardVariant.value}"\n`;
    if (timelineProperties.value.cardElevation !== 2) code += `      :elevation="${timelineProperties.value.cardElevation}"\n`;
    if (timelineProperties.value.cardColor !== 'default') code += `      :color="timelineProperties.cardColor !== 'default' ? timelineProperties.cardColor : undefined"\n`;

    let cardClasses = ['mb-4'];
    cardClasses.push(timelineProperties.value.cardPadding);
    cardClasses.push(timelineProperties.value.cardBorderRadius);

    if (timelineProperties.value.cardHoverEffect) {
      cardClasses.push('timeline-card-hover');
    }

    code += `      class="${cardClasses.join(' ')}"\n`;

    if (timelineProperties.value.animated) {
      code += `      :transition="timelineProperties.transition"\n`;
      code += `      :style="{ transitionDuration: timelineProperties.transitionDuration + 'ms' }"\n`;
    }

    code += '    >\n';

    if (timelineProperties.value.separateHeader) {
      code += '      <v-card-title>{{ item.title }}</v-card-title>\n';
      code += '      <v-divider></v-divider>\n';
      code += '      <v-card-text>{{ item.text }}</v-card-text>\n';
    } else {
      code += '      <v-card-title :class="getTitleStyleClass()">{{ item.title }}</v-card-title>\n';
      code += '      <v-card-text>{{ item.text }}</v-card-text>\n';
    }

    code += '    </v-card>\n';
  } else {
    code += '    <div :class="[\'text-h6\', getTitleStyleClass()]"';

    if (timelineProperties.value.animated) {
      code += ' :transition="timelineProperties.transition"';
      code += ' :style="{ transitionDuration: timelineProperties.transitionDuration + \'ms\' }"';
    }

    code += '>{{ item.title }}</div>\n';

    code += '    <div';

    if (timelineProperties.value.animated) {
      code += ' :transition="timelineProperties.transition"';
      code += ' :style="{ transitionDuration: timelineProperties.transitionDuration + \'ms\' }"';
    }

    code += '>{{ item.text }}</div>\n';
  }

  code += '  </v-timeline-item>\n';
  code += '</v-timeline>';

  return code;
};

const generateScriptCode = () => {
  let code = `
import { ref, computed } from 'vue';

const timelineItems = ref([`;

  timelineItems.value.forEach((item, index) => {
    code += `
  {
    title: "${item.title}",
    text: "${item.text}",
    icon: "${item.icon}",
    color: "${item.color}",
    time: "${item.time}",
    hideOpposite: ${item.hideOpposite}
  }`;
    if (index < timelineItems.value.length - 1) {
      code += ',';
    }
  });

  code += `
]);`;

  return code;
};

const getTitleStyleClass = () => {
  switch (timelineProperties.value.titleStyle) {
    case 'bold': return 'font-weight-bold';
    case 'italic': return 'font-italic';
    case 'uppercase': return 'text-uppercase';
    default: return '';
  }
};

const previewCode = () => {
  generatedCode.value = generateTimelineCode();
  showCodeDialog.value = true;
};

const copyTimelineCode = () => {
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

const generateTimelineCodeSilently = () => {
  const code = generateTimelineCode();
  emit('update:content', code);
};

watch([timelineProperties, timelineItems, cardVariantIndex], () => {
  generateTimelineCodeSilently();
}, { deep: true });

watch(previewMode, () => {
  generateTimelineCodeSilently();
});

const getCardClasses = () => {
  const classes = {
    [timelineProperties.value.cardPadding]: true,
    [timelineProperties.value.cardBorderRadius]: true,
    'timeline-card-hover': timelineProperties.value.cardHoverEffect
  };

  return classes;
};

const showTimeline = ref(true);

const triggerAnimation = () => {
  showTimeline.value = false;
  setTimeout(() => {
    showTimeline.value = true;
  }, 300);
};

onMounted(() => {
  applyTemplate('project');
});

const loadTemplateFromStore = () => {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('templateId');

  if (!templateId) return;

  console.log('Loading template with ID:', templateId);

  const template = userStore.studioComponents.find(t => t.id === parseInt(templateId) && t.component_type === 'timeline');

  if (template && template.content) {
    console.log('Template found in store:', template.name);

    if (template.content.trim().startsWith('<v-timeline')) {
      console.log('HTML content detected, applying directly');
      emit('update:content', template.content);
      return;
    }

    try {
      const templateData = JSON.parse(template.content);
      console.log('Template data loaded:', templateData);

      Object.assign(timelineProperties.value, templateData);

      if (templateData.items) {
        timelineItems.value = [...templateData.items];
      }

      generateTimelineCodeSilently();

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

.timeline-card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.timeline-card-hover:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-x-transition-enter-active,
.slide-x-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-x-transition-enter-from,
.slide-x-transition-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-y-transition-enter-active,
.slide-y-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-y-transition-enter-from,
.slide-y-transition-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.scale-transition-enter-active,
.scale-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}
.scale-transition-enter-from,
.scale-transition-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.scroll-x-transition-enter-active,
.scroll-x-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}
.scroll-x-transition-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.scroll-x-transition-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.scroll-y-transition-enter-active,
.scroll-y-transition-leave-active {
  transition: transform 0.3s ease-in-out;
}
.scroll-y-transition-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.scroll-y-transition-leave-to {
  transform: translateY(100%);
  opacity: 0;
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