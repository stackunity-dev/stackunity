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

      <div class="steps-container">
        <v-card v-for="(step, i) in steps" :key="i" class="step-item" :color="step.color" variant="tonal">
          <div class="step-number" :class="`text-${step.color}`">0{{ i + 1 }}</div>
          <v-card-text class="step-content">
            <div class="step-icon">
              <v-icon :icon="getStepIcon(i)" :color="step.color" size="large"></v-icon>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-description">{{ step.description }}</p>
            <v-btn :color="step.color" variant="text" :to="step.link" aria-label="Learn more" class="mt-2">
              {{ t().cta.learnMore }}
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-text>
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

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.step-item {
  position: relative;
  transition: transform 0.3s ease;
  margin-top: 5px;
}

.step-item:hover {
  transform: translateY(-5px);
}

.step-number {
  position: absolute;
  top: -5px;
  right: 10px;
  font-size: 72px;
  font-weight: 800;
  opacity: 0.6;
  line-height: 1;
}

.step-content {
  padding: 24px !important;
  padding-top: 8px !important;
}

.step-icon {
  margin-bottom: 16px;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.step-description {
  margin-bottom: 16px;
  opacity: 0.85;
}

@media (min-width: 960px) {
  .steps-container {
    flex-direction: row;
    gap: 24px;
  }

  .step-item {
    flex: 1;
    margin-top: 8px;
  }

  .step-number {
    top: -8px;
    right: 15px;
    font-size: 90px;
  }
}
</style>