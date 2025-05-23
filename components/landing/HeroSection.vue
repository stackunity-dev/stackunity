<template>
  <section class="hero-section py-16" aria-labelledby="hero-heading">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" md="9" class="justify-center d-flex flex-column align-center">
          <h1 id="hero-heading" class="text-h3 text-gradient text-center font-weight-bold mb-4 arabic-text-fix"
            style="max-width: 800px">
            {{ t().hero.title }}
          </h1>
          <p class="text-h5 text-center mb-4 text-medium-emphasis">
            {{ t().hero.description }}
          </p>
          <div class="features-banner d-flex flex-wrap justify-center mb-6">
            <div class="mini-feature mr-4 mb-2" v-for="feature in heroFeatures" :key="feature">
              <v-icon color="secondary" size="small" class="mr-1" aria-hidden="true">mdi-check-circle</v-icon>
              <span class="text-body-2">{{ feature }}</span>
            </div>
          </div>
          <div class="d-flex flex-column flex-sm-row ga-4 justify-center align-center " role="group"
            aria-label="Call to action">
            <v-btn color="secondary" size="x-large" aria-label="Get started" :to="localePath('/signup')"
              variant="elevated" class="my-4" :elevation="getElevation('start-free-trial', 6, 20)"
              @mouseenter="setHoverOn('start-free-trial')" @mouseleave="setHoverOff('start-free-trial')"
              style="width: 100%; max-width: 400px;">

              {{ display.smAndDown.value ? t().hero.ctaMobile : t().hero.cta }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useTranslations } from '../../languages/';
import { getElevation, setHoverOff, setHoverOn } from '../../utils/hover-state';
// @ts-ignore
import { useNuxtApp } from '#app';
import './landing.css';

const t = useTranslations('index')
const display = useDisplay()

const nuxtApp = useNuxtApp()
const localePath = nuxtApp.$localePath

const heroFeatures = computed(() => t().hero.features.slice(0, 4))
</script>

<style scoped>
:lang(ar) .arabic-text-fix {
  line-height: 1.4;
  letter-spacing: 0;
  word-spacing: 0.1em;
  padding-bottom: 0.3em;
}
</style>
