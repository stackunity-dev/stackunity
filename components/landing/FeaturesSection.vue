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
            <v-card class="feature-card h-100 rounded-lg" flat :class="[
              feature.badge?.variant === 'premium' ? 'analytics-feature-card pulse-animation' : '',
              feature.badge?.variant === 'success' ? 'audit-feature-card' : '',
              feature.badge?.variant === 'warning' ? 'stackql-feature-card' : ''
            ]" :elevation="feature.badge?.variant === 'premium' ? 4 : 2">

              <div v-if="feature.title === t().features.analytics.title" class="analytics-mini-viz">
                <div class="mini-bar" style="height: 60%;"></div>
                <div class="mini-bar" style="height: 80%;"></div>
                <div class="mini-bar" style="height: 40%;"></div>
                <div class="mini-bar" style="height: 90%;"></div>
                <div class="mini-line"></div>
              </div>

              <div v-if="feature.title === t().features.queries.title" class="stackql-mini-viz">
                <div class="mini-db-schema">
                  <div class="mini-table">
                    <div class="mini-table-header"></div>
                    <div class="mini-table-row"></div>
                    <div class="mini-table-row"></div>
                  </div>
                  <div class="mini-table">
                    <div class="mini-table-header"></div>
                    <div class="mini-table-row"></div>
                    <div class="mini-table-row"></div>
                  </div>
                  <div class="mini-relation"></div>
                </div>
              </div>

              <div v-if="feature.title === t().features.audits.title" class="audit-mini-viz">
                <div class="mini-radar">
                  <div class="mini-radar-circle"></div>
                  <div class="mini-radar-circle"></div>
                  <div class="mini-radar-circle"></div>
                  <div class="mini-radar-scan"></div>
                  <div class="mini-radar-dot"></div>
                </div>
              </div>

              <div v-if="feature.badge" class="feature-badge" :class="feature.badge.variant">
                <v-icon size="x-small" class="mr-1">mdi-star</v-icon>
                <span>{{ feature.badge.label }}</span>
              </div>

              <div v-if="feature.showViz" class="analytics-mini-viz">
                <div class="mini-bar" style="height: 60%;"></div>
                <div class="mini-bar" style="height: 80%;"></div>
                <div class="mini-bar" style="height: 40%;"></div>
                <div class="mini-bar" style="height: 90%;"></div>
                <div class="mini-line"></div>
              </div>


              <v-card-text class="pa-6">
                <v-avatar :color="feature.color" size="56" class="mb-4" aria-hidden="true">
                  <v-icon dark size="32">{{ feature.icon }}</v-icon>
                </v-avatar>

                <div class="d-flex align-center justify-space-between">
                  <h3 id="feature-title-{{ index }}" class="text-h5 font-weight-bold mb-3">
                    {{ feature.title }}
                  </h3>
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
import { computed } from 'vue';
import { useTranslations } from '../../languages/';
import { getElevation, setHoverOff, setHoverOn } from '../../utils/hover-state';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const features = computed(() => [
  {
    title: t().features.audits.title,
    description: t().features.audits.description,
    icon: 'mdi-magnify-scan',
    color: 'primary',
    badge: {
      label: 'AUDIT',
      variant: 'success'
    }
  },
  {
    title: t().features.queries.title,
    description: t().features.queries.description,
    icon: 'mdi-database-search',
    color: 'secondary',
    badge: {
      label: 'STACKQL',
      variant: 'warning'
    }
  },
  {
    title: t().features.analytics.title,
    description: t().features.analytics.description,
    icon: 'mdi-chart-box',
    color: 'tertiary',
    badge: {
      label: 'Analytics',
      variant: 'premium'
    },
    showViz: true
  }
])
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
.feature-card:hover .analytics-mini-viz {
  opacity: 0.5;
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

.feature-badge {
  position: absolute;
  top: 0;
  right: 0;
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
  color: white;
}

.feature-badge.premium {
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 1), rgba(var(--v-theme-primary), 0.8));
}

.feature-badge.success {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 1), rgba(var(--v-theme-primary), 0.6));
}

.feature-badge.warning {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 1), rgba(var(--v-theme-secondary), 0.7));
}

.audit-feature-card {
  border: 1px solid rgba(var(--v-theme-success), 0.3);
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.02), rgba(var(--v-theme-success), 0.06));
}

.stackql-feature-card {
  border: 1px solid rgba(var(--v-theme-warning), 0.3);
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.02), rgba(var(--v-theme-warning), 0.06));
}

.stackql-mini-viz {
  position: absolute;
  bottom: 0;
  right: 10px;
  width: 60px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.mini-db-schema {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}

.mini-table {
  width: 20px;
  height: 35px;
  background: rgba(var(--v-theme-warning), 0.1);
  border: 1px solid rgba(var(--v-theme-warning), 0.8);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  padding: 2px;
}

.mini-table-header {
  height: 4px;
  background: rgba(var(--v-theme-warning), 0.8);
  border-radius: 1px;
  margin-bottom: 2px;
}

.mini-table-row {
  height: 2px;
  background: rgba(var(--v-theme-warning), 0.4);
  border-radius: 1px;
  margin-bottom: 2px;
}

.mini-relation {
  position: absolute;
  width: 15px;
  height: 1px;
  background: rgba(var(--v-theme-warning), 0.8);
  left: 50%;
  transform: translateX(-50%);
}

.mini-relation::before,
.mini-relation::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid rgba(var(--v-theme-warning), 0.8);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.mini-relation::before {
  left: -2px;
}

.mini-relation::after {
  right: -2px;
}

.audit-mini-viz {
  position: absolute;
  bottom: 5px;
  right: 10px;
  width: 60px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.mini-radar {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-radar-circle {
  position: absolute;
  border: 1px solid rgba(var(--v-theme-success), 0.8);
  border-radius: 50%;
}

.mini-radar-circle:nth-child(1) {
  width: 100%;
  height: 100%;
}

.mini-radar-circle:nth-child(2) {
  width: 70%;
  height: 70%;
}

.mini-radar-circle:nth-child(3) {
  width: 40%;
  height: 40%;
}

.mini-radar-scan {
  position: absolute;
  width: 50%;
  height: 50%;
  background: linear-gradient(90deg,
      rgba(var(--v-theme-success), 0),
      rgba(var(--v-theme-success), 0.2));
  transform-origin: bottom right;
  animation: radar-scan 2s linear infinite;
}

.mini-radar-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(var(--v-theme-success), 1);
  border-radius: 50%;
  top: 30%;
  left: 60%;
  animation: radar-dot 2s linear infinite;
}

@keyframes radar-scan {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes radar-dot {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.feature-card:hover .stackql-mini-viz,
.feature-card:hover .audit-mini-viz {
  opacity: 0.5;
}
</style>