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
            <div class="particles-container" :id="`particles-${index}`"></div>
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
import { computed, onMounted, ref } from 'vue';
import { useTranslations } from '../../languages/';


const t = useTranslations('index')

const badExperiences = computed(() => [
  {
    title: t().badExperiences.analytics.title,
    ctv: t().badExperiences.analytics.subtitle,
    icon: 'mdi-contrast',
    color: 'primary',
    text: t().badExperiences.analytics.description
  },
  {
    title: t().badExperiences.queries.title,
    ctv: t().badExperiences.queries.subtitle,
    icon: 'mdi-magnify',
    color: 'secondary',
    text: t().badExperiences.queries.description
  },
  {
    title: t().badExperiences.audits.title,
    ctv: t().badExperiences.audits.subtitle,
    icon: 'mdi-palette',
    color: 'tertiary',
    text: t().badExperiences.audits.description
  }
]);
</script>

<style scoped>
.bad-experience-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.bad-experience-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.border-primary {
  border-color: rgba(var(--v-theme-primary), 0.2) !important;
}

.border-secondary {
  border-color: rgba(var(--v-theme-secondary), 0.2) !important;
}

.border-tertiary {
  border-color: rgba(var(--v-theme-tertiary), 0.2) !important;
}
</style>