<template>
  <section class="py-16 how-it-works-section" aria-labelledby="how-it-works-heading">
    <v-container>
      <div class="text-center mb-12">
        <h2 id="how-it-works-heading" class="text-h3 text-gradient font-weight-bold mb-3">{{ t().howItWorks.title
        }}
        </h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
          {{ t().howItWorks.description }}
        </p>
      </div>

      <v-timeline align="start" line-color="secondary" line-width="2" :direction="timelineDirection"
        :truncate-line="truncateLine" :density="density">
        <v-timeline-item v-for="(step, i) in steps" :key="i" :dot-color="step.color" size="large" :icon="getStepIcon(i)"
          line-inset="12" :hide-opposite="oppositeHidden">
          <template v-slot:opposite>
            <div v-if="$vuetify.display.smAndUp" class="text-h2 font-weight-bold" :class="`text-${step.color}`">
              0{{ i + 1 }}</div>
          </template>
          <v-card :class="`border-${step.color} timeline-card`" elevation="0">
            <v-card-item>
              <v-card-title class="text-h5 font-weight-bold">
                <span v-if="$vuetify.display.smAndDown" class="mr-2" :class="`text-${step.color}`">0{{ i + 1
                }}.</span>
                {{ step.title }}
              </v-card-title>
              <v-card-text class="text-body-1">{{ step.description }}</v-card-text>
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
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { useTranslations } from '../../languages/';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')
const display = useDisplay()
const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const timelineDirection = computed(() => {
  return display.smAndUp.value ? 'horizontal' : 'vertical';
});

const truncateLine = computed(() => {
  return display.smAndUp.value ? 'start' : 'both';
});

const density = computed(() => {
  return display.smAndDown.value ? 'compact' : 'default';
});

const oppositeHidden = computed(() => {
  return display.smAndDown.value;
});

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