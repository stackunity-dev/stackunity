<template>
  <section id="features" class="py-16" aria-labelledby="features-heading">
    <v-container>
      <div class="text-center mb-12">
        <span class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 d-block">{{
          t().features.subtitle }}</span>
        <h2 id="features-heading" class="text-h3 text-gradient font-weight-bold mb-3">{{ t().features.title }}
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
          {{ t().features.description }}
        </p>
      </div>

      <v-row>
        <v-col v-for="(feature, index) in features" :key="index" cols="12" md="4" class="mb-8">
          <article class="feature-card h-100 rounded-lg" role="article" aria-labelledby="feature-title-{{ index }}">
            <v-card class="feature-card h-100 rounded-lg" flat>
              <v-card-text class="pa-6">
                <v-avatar :color="feature.color" size="56" class="mb-4" aria-hidden="true">
                  <v-icon dark size="32">{{ feature.icon }}</v-icon>
                </v-avatar>

                <div class="d-flex align-center justify-space-between">
                  <h3 id="feature-title-{{ index }}" class="text-h5 font-weight-bold mb-3">
                    {{ feature.title }}
                  </h3>

                  <div v-if="feature.title === t().features.accessibility.title" class="vision-filter-wrapper ml-2">
                    <v-menu offset-y>
                      <template v-slot:activator="{ props }">
                        <v-btn icon density="comfortable" variant="text" v-bind="props"
                          :color="selectedVisionType !== 'normal' ? 'primary' : feature.color"
                          aria-label="Test vision impairments" size="small">
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
                            <v-icon :icon="type.icon"
                              :color="selectedVisionType === type.value ? 'primary' : ''"></v-icon>
                          </template>
                          <v-list-item-title>{{ type.title }}</v-list-item-title>
                        </v-list-item>
                        <v-divider v-if="selectedVisionType !== 'normal'"></v-divider>
                        <v-list-item v-if="selectedVisionType !== 'normal'">
                          <v-slider v-model="filterIntensity" :min="0" :max="100" :step="1" label="Intensity"
                            hide-details class="px-2 py-0" density="compact" @update:model-value="applyVisionFilter">
                          </v-slider>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                </div>

                <p class="text-body-1 text-medium-emphasis">{{ feature.description }}</p>
              </v-card-text>
            </v-card>
          </article>
        </v-col>
      </v-row>
      <div class="d-flex justify-center mt-4">
        <v-btn size="large" color="secondary" variant="elevated" class="px-8 rounded-pill"
          :elevation="getElevation('get-started-now', 2, 20)" @mouseenter="setHoverOn('get-started-now')"
          @mouseleave="setHoverOff('get-started-now')" :to="localePath('/signup')" aria-label="Get started now" nuxt>
          {{ t().features.cta }}
          <v-icon end aria-hidden="true">mdi-rocket-launch-outline</v-icon>
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useTranslations } from '../../languages/';
import { setHoverOn, setHoverOff, getElevation } from '../../utils/hover-state';
import { applyVisionFilter, filterIntensity, selectedVisionType, visionTypeIcon, visionTypes } from '../../utils/filter';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const features = computed(() => [
  {
    title: t().features.cssAnimations.title,
    description: t().features.cssAnimations.description,
    icon: 'mdi-animation',
    color: 'primary'
  },
  {
    title: t().features.studio.title,
    description: t().features.studio.description,
    icon: 'mdi-palette',
    color: 'secondary'
  },
  {
    title: t().features.semantic.title,
    description: t().features.semantic.description,
    icon: 'mdi-semantic-web',
    color: 'tertiary'
  },
  {
    title: t().features.apiTesting.title,
    description: t().features.apiTesting.description,
    icon: 'mdi-api',
    color: 'info'
  },
  {
    title: t().features.websiteAnalysis.title,
    description: t().features.websiteAnalysis.description,
    icon: 'mdi-magnify',
    color: 'success'
  },
  {
    title: t().features.accessibility.title,
    description: t().features.accessibility.description,
    icon: 'mdi-access-point',
    color: 'warning'
  }
]);

</script>