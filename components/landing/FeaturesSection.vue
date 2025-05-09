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
            <v-card class="feature-card h-100 rounded-lg" flat :class="{
              'analytics-feature-card': feature.title === t().features.analytics.title || feature.title === t().features.websiteAnalysis.title,
              'pulse-animation': feature.title === t().features.analytics.title
            }"
              :elevation="(feature.title === t().features.analytics.title || feature.title === t().features.websiteAnalysis.title) ? 4 : 0">
              <div
                v-if="feature.title === t().features.analytics.title || feature.title === t().features.websiteAnalysis.title"
                class="analytics-badge">
                <v-icon size="x-small" class="mr-1">mdi-star</v-icon>
                <span>PREMIUM</span>
              </div>

              <div v-if="feature.title === t().features.analytics.title" class="analytics-mini-viz">
                <div class="mini-bar" style="height: 60%;"></div>
                <div class="mini-bar" style="height: 80%;"></div>
                <div class="mini-bar" style="height: 40%;"></div>
                <div class="mini-bar" style="height: 90%;"></div>
                <div class="mini-line"></div>
              </div>

              <div v-if="feature.title === t().features.websiteAnalysis.title"
                class="analytics-mini-viz website-mini-viz">
                <div class="mini-dot" style="top: 20%; left: 20%"></div>
                <div class="mini-dot" style="top: 40%; left: 60%"></div>
                <div class="mini-dot" style="top: 70%; left: 30%"></div>
                <div class="mini-dot" style="top: 50%; left: 80%"></div>
                <div class="mini-line website-line"></div>
              </div>

              <div v-if="feature.title === t().features.cssAnimations.title"
                class="analytics-mini-viz animations-mini-viz">
                <div class="mini-square" style="top: 30%; left: 30%; animation-delay: 0s;"></div>
                <div class="mini-square" style="top: 30%; left: 55%; animation-delay: 0.2s;"></div>
                <div class="mini-square" style="top: 60%; left: 30%; animation-delay: 0.4s;"></div>
                <div class="mini-square" style="top: 60%; left: 55%; animation-delay: 0.6s;"></div>
              </div>

              <div v-if="feature.title === t().features.studio.title" class="analytics-mini-viz studio-mini-viz">
                <div class="mini-grid">
                  <div v-for="(theme, index) in availableThemes" :key="index" class="grid-item"
                    :style="{ backgroundColor: theme.color }" @click.stop="changeTheme(theme.name)" role="button"
                    :aria-label="`Switch to ${theme.name} theme`" tabindex="0"></div>
                </div>
              </div>

              <div v-if="feature.title === t().features.apiTesting.title" class="analytics-mini-viz api-mini-viz">
                <div class="api-lines">
                  <div class="api-line" style="width: 70%; animation-delay: 0s;"></div>
                  <div class="api-line" style="width: 40%; animation-delay: 0.2s;"></div>
                  <div class="api-line" style="width: 60%; animation-delay: 0.4s;"></div>
                  <div class="api-line" style="width: 30%; animation-delay: 0.6s;"></div>
                </div>
                <div class="api-status"></div>
              </div>

              <div v-if="feature.title === t().features.accessibility.title"
                class="analytics-mini-viz accessibility-mini-viz">
                <div class="a11y-waves">
                  <div class="a11y-wave"></div>
                  <div class="a11y-wave"></div>
                  <div class="a11y-wave"></div>
                </div>
                <div class="access-point"></div>
              </div>

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
      <div class="d-flex justify-center mt-8">
        <v-btn size="large" color="secondary" variant="elevated" class="get-started-btn px-8 rounded-pill"
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
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import { useTranslations } from '../../languages/';
import { applyVisionFilter, filterIntensity, selectedVisionType, visionTypeIcon, visionTypes } from '../../utils/filter';
import { getElevation, setHoverOff, setHoverOn } from '../../utils/hover-state';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')
const vuetifyTheme = useTheme();

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const changeTheme = (themeName) => {
  vuetifyTheme.global.name.value = themeName;
}

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
    title: t().features.analytics.title,
    description: t().features.analytics.description,
    icon: 'mdi-chart-box',
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

const availableThemes = ref([
  { name: 'dark', color: 'rgba(var(--v-theme-primary), 0.8)' },
  { name: 'light', color: 'rgba(var(--v-theme-secondary), 0.8)' },
  { name: 'greenAmbiance', color: 'rgba(var(--v-theme-success), 0.8)' },
  { name: 'landingPage', color: 'rgba(var(--v-theme-error), 0.8)' }
]);

</script>

<style scoped>
.feature-card {
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.analytics-feature-card {
  border: 2px solid rgba(var(--v-theme-tertiary), 0.5);
  box-shadow: 0 8px 24px rgba(var(--v-theme-tertiary), 0.15) !important;
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 0.03), rgba(var(--v-theme-tertiary), 0.1));
}

.analytics-feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(var(--v-theme-tertiary), 0.3) !important;
}

.analytics-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 1), rgba(var(--v-theme-primary), 0.8));
  color: white;
  padding: 4px 10px;
  font-size: 0.7rem;
  font-weight: bold;
  border-bottom-left-radius: 8px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}

.analytics-mini-viz {
  position: absolute;
  bottom: 0;
  right: 10px;
  width: 80px;
  height: 60px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 5px;
  opacity: 0.3;
  transition: opacity 0.3s ease;
  z-index: 1;
  overflow: hidden;
}

.feature-card:hover .analytics-mini-viz {
  opacity: 0.5;
}

.mini-bar {
  width: 15%;
  background-color: rgba(var(--v-theme-tertiary), 0.8);
  border-radius: 2px 2px 0 0;
}

.mini-line {
  position: absolute;
  width: 95%;
  height: 2px;
  background: linear-gradient(90deg, rgba(var(--v-theme-primary), 0.1), rgba(var(--v-theme-primary), 0.8));
  bottom: 0;
  border-radius: 2px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-tertiary), 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(var(--v-theme-tertiary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-tertiary), 0);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

.website-mini-viz {
  align-items: center;
  justify-content: center;
}

.mini-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-success), 0.8);
}

.website-line {
  background: linear-gradient(90deg, rgba(var(--v-theme-success), 0.1), rgba(var(--v-theme-success), 0.8));
}

.animations-mini-viz {
  align-items: center;
  justify-content: center;
}

.mini-square {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: rgba(var(--v-theme-primary), 0.8);
  animation: rotate-mini 3s infinite linear;
}

@keyframes rotate-mini {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.studio-mini-viz {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 3px;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid-item {
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.grid-item:hover {
  transform: scale(1.15) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.grid-item:active {
  transform: scale(0.95) !important;
}

.grid-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-item:hover::after {
  opacity: 1;
}

.api-mini-viz {
  display: flex;
  align-items: center;
  justify-content: center;
}

.api-lines {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 60%;
  height: 60%;
  position: absolute;
  top: 50%;
  left: 35%;
  transform: translateY(-50%);
  gap: 6px;
}

.api-line {
  height: 2px;
  background: linear-gradient(to right, rgba(var(--v-theme-info), 0.8), rgba(var(--v-theme-info), 0.2));
  border-radius: 1px;
  animation: scan 2s infinite ease-in-out;
}

@keyframes scan {
  0% {
    transform: translateX(-5%);
    opacity: 0.5;
  }
  50% {
    transform: translateX(10%);
    opacity: 1;
  }
  100% {
    transform: translateX(-5%);
    opacity: 0.5;
  }
}

.api-status {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(var(--v-theme-success), 0.8);
  top: 50%;
  left: 15%;
  transform: translateY(-50%);
  box-shadow: 0 0 8px rgba(var(--v-theme-success), 0.4);
  animation: pulse-status 2s infinite;
}

@keyframes pulse-status {
  0% {
    transform: translateY(-50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 0.7;
  }
}

.accessibility-mini-viz {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.a11y-waves {
  position: absolute;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.a11y-wave {
  position: absolute;
  border: 1px solid rgba(var(--v-theme-warning), 0.5);
  border-radius: 50%;
  opacity: 0;
  animation: wave-out 2s infinite;
}

.a11y-wave:nth-child(1) {
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.a11y-wave:nth-child(2) {
  width: 30px;
  height: 30px;
  animation-delay: 0.3s;
}

.a11y-wave:nth-child(3) {
  width: 40px;
  height: 40px;
  animation-delay: 0.6s;
}

@keyframes wave-out {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.access-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: rgba(var(--v-theme-warning), 0.9);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(var(--v-theme-warning), 0.6);
  z-index: 2;
  animation: pulse-access 2s infinite;
}

@keyframes pulse-access {
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.7);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 12px 5px rgba(var(--v-theme-warning), 0.3);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0);
  }
}

.get-started-btn {
  background-image: linear-gradient(135deg, rgba(var(--v-theme-secondary), 1), rgba(var(--v-theme-primary), 0.8));
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: none;
  box-shadow: 0 5px 15px rgba(var(--v-theme-secondary), 0.3);
}

.get-started-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(var(--v-theme-secondary), 0.5);
  background-image: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.9), rgba(var(--v-theme-primary), 1));
}

.get-started-btn:active {
  transform: translateY(1px) scale(0.98);
}
</style>