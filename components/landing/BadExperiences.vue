<template>
  <section class="py-16 bad-experiences-section" aria-labelledby="bad-experiences-heading">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-gradient font-weight-bold mb-4">{{ t().badExperiences.title }}</h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto">
          {{ t().badExperiences.description }}
        </p>
      </div>

      <v-row class="mx-0">
        <v-col cols="12" md="4" v-for="(badExperience, index) in badExperiences" :key="badExperience.title">
          <v-card class="bad-experience-card h-100" :class="`border-${badExperience.color}`" elevation="0">
            <v-card-item>
              <v-avatar :color="badExperience.color" size="56" class="mb-4">
                <v-icon size="24">{{ badExperience.icon }}</v-icon>
              </v-avatar>
              <v-card-title class="text-h5 font-weight-bold pt-2">
                {{ badExperience.title }}
              </v-card-title>
              <v-card-subtitle class="pt-2 text-medium-emphasis d-flex flex-wrap">
                {{ badExperience.ctv }}
              </v-card-subtitle>
              <v-card-text class="text-body-1">
                {{ badExperience.text }}
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { useTranslations } from '../../languages/';
import { computed } from 'vue';
import './landing.css';

const t = useTranslations('index')

const badExperiences = computed(() => [
  {
    title: t().badExperiences.accessibility.title,
    ctv: t().badExperiences.accessibility.subtitle,
    icon: 'mdi-contrast',
    color: 'primary',
    text: t().badExperiences.accessibility.description
  },
  {
    title: t().badExperiences.seo.title,
    ctv: t().badExperiences.seo.subtitle,
    icon: 'mdi-magnify',
    color: 'secondary',
    text: t().badExperiences.seo.description
  },
  {
    title: t().badExperiences.design.title,
    ctv: t().badExperiences.design.subtitle,
    icon: 'mdi-palette',
    color: 'tertiary',
    text: t().badExperiences.design.description
  }
]);
</script>