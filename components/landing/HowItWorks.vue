<template>
  <section class="py-16 how-it-works-section" aria-labelledby="how-it-works-heading">
    <v-container>
      <div class="text-center mb-12">
        <h2 id="how-it-works-heading" class="text-h3 text-gradient font-weight-bold mb-3">
          {{ t().howItWorks.title }}
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
          {{ t().howItWorks.description }}
        </p>
      </div>

      <v-timeline v-if="$vuetify.display.mdAndUp" align="start" class="mt-12">
        <v-timeline-item v-for="(step, i) in steps" :key="i" :icon="getStepIcon(i)" :dot-color="step.color"
          size="large">
          <template v-slot:opposite>
            <div class="d-flex align-center justify-end h-100 pe-4">
              <div class="text-h2 font-weight-bold" :class="`text-${step.color}`">0{{ i + 1 }}</div>
            </div>
          </template>
          <v-card :class="`border-${step.color} timeline-card mx-2 my-4`" variant="outlined">
            <v-card-item>
              <v-card-title class="text-h5 font-weight-bold">
                {{ step.title }}
              </v-card-title>
              <v-card-text class="text-body-1 py-3">
                {{ step.description }}
              </v-card-text>
              <v-card-actions>
                <v-btn :color="step.color" variant="text" :to="step.link" aria-label="Learn more" class="px-0">
                  {{ t().cta.learnMore }}
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-item>
          </v-card>
        </v-timeline-item>
      </v-timeline>

      <div v-else>
        <v-card v-for="(step, i) in steps" :key="i" :class="`border-${step.color} timeline-card mb-6`"
          variant="outlined">
          <v-card-item>
            <div class="d-flex align-center mb-2">
              <v-avatar :color="step.color" size="40" class="mr-4">
                <v-icon :icon="getStepIcon(i)" color="white"></v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">
                <span class="mr-2" :class="`text-${step.color}`">0{{ i + 1 }}.</span>
                {{ step.title }}
              </div>
            </div>
            <v-card-text class="text-body-1 py-3">
              {{ step.description }}
            </v-card-text>
            <v-card-actions>
              <v-btn :color="step.color" variant="text" :to="step.link" aria-label="Learn more" class="px-0">
                {{ t().cta.learnMore }}
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card-item>
        </v-card>
      </div>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useTranslations } from '../../languages/';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')
const display = useDisplay()
const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const getStepIcon = (index) => {
  const icons = ['mdi-account-plus', 'mdi-tools', 'mdi-rocket-launch'];
  return icons[index];
};

const steps = computed(() => [
  {
    title: t().howItWorks.steps[0].title,
    description: t().howItWorks.steps[0].description,
    link: localePath('/signup'),
    color: 'primary'
  },
  {
    title: t().howItWorks.steps[1].title,
    description: t().howItWorks.steps[1].description,
    link: localePath('/signup'),
    color: 'secondary'
  },
  {
    title: t().howItWorks.steps[2].title,
    description: t().howItWorks.steps[2].description,
    link: localePath('/signup'),
    color: 'tertiary'
  }
]);
</script>

<style scoped>
.timeline-card {
  transition: transform 0.3s ease;
  border-width: 2px !important;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.border-secondary {
  border-color: rgb(var(--v-theme-secondary)) !important;
}

.border-tertiary {
  border-color: rgb(var(--v-theme-tertiary)) !important;
}

.text-gradient {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.v-timeline .v-timeline-divider__dot {
  background-color: transparent !important;
}

.v-timeline-item:not(:last-child) .v-timeline-divider__line {
  background-color: rgba(var(--v-theme-secondary), 0.3);
}

@media (max-width: 959px) {
  .v-timeline {
    padding-bottom: 32px;
  }
}
</style>