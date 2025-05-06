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

      <!-- Timeline pour desktop et tablette -->
      <v-timeline v-if="$vuetify.display.mdAndUp" align="start" class="mt-12">
        <v-timeline-item v-for="(step, i) in steps" :key="i" :icon="getStepIcon(i)" :dot-color="step.color" size="large"
          :line-color="i < steps.length - 1 ? step.color : undefined">
          <template v-slot:opposite>
            <div class="d-flex align-center justify-end h-100 pe-4">
              <div class="text-h2 font-weight-bold" :class="`text-${step.color}`">0{{ i + 1 }}</div>
            </div>
          </template>

          <div class="timeline-content pa-4 rounded-lg" :class="`border-left-${step.color}`">
            <h3 class="text-h5 font-weight-bold mb-2">{{ step.title }}</h3>
            <p class="text-body-1 mb-4">{{ step.description }}</p>
            <v-btn :color="step.color" variant="text" :to="step.link" aria-label="Learn more" class="pa-0">
              {{ t().cta.learnMore }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-timeline-item>
      </v-timeline>

      <!-- Version mobile simplifiée -->
      <div v-else>
        <div v-for="(step, i) in steps" :key="i" class="timeline-mobile-item mb-8 pa-4 rounded-lg"
          :class="`border-left-${step.color}`">
          <div class="d-flex align-center mb-4">
            <v-avatar :color="step.color" size="40" class="mr-4">
              <v-icon :icon="getStepIcon(i)" color="white"></v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">
              <span class="mr-2" :class="`text-${step.color}`">0{{ i + 1 }}.</span>
              {{ step.title }}
            </h3>
          </div>
          <p class="text-body-1 mb-4">{{ step.description }}</p>
          <v-btn :color="step.color" variant="text" :to="step.link" aria-label="Learn more" class="pa-0">
            {{ t().cta.learnMore }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
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
.text-gradient {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline-content,
.timeline-mobile-item {
  background-color: rgb(var(--v-theme-surface));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left-width: 5px !important;
  border-left-style: solid;
}

.timeline-content:hover,
.timeline-mobile-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.border-left-primary {
  border-left-color: rgb(var(--v-theme-primary)) !important;
}

.border-left-secondary {
  border-left-color: rgb(var(--v-theme-secondary)) !important;
}

.border-left-tertiary {
  border-left-color: rgb(var(--v-theme-tertiary)) !important;
}

.v-timeline-divider__dot {
  box-shadow: 0 0 0 4px rgb(var(--v-theme-surface));
}

@media (max-width: 959px) {
  .timeline-mobile-item {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
}
</style>