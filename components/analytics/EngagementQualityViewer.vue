<template>
  <div class="engagement-quality-viewer">
    <v-card v-if="loading" class="pa-4 text-center" flat>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <div class="mt-2">Loading engagement data...</div>
    </v-card>

    <EngagementQuality v-else :page-views-data="pageViewsData" :interactions-data="interactionsData"
      :preloaded-data="preloadedData" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { EngagementMetrics } from '../../utils/engagement-quality';
import EngagementQuality from './EngagementQuality.vue';

const props = defineProps({
  pageViewsData: {
    type: String,
    default: ''
  },
  interactionsData: {
    type: String,
    default: ''
  },
  preloadedData: {
    type: Object as () => EngagementMetrics,
    default: null
  }
});

const loading = ref(true);

onMounted(async () => {
  // Attendre le prochain tick pour s'assurer que le DOM est rendu
  await nextTick();

  // Donner le temps aux composants de s'initialiser
  setTimeout(() => {
    loading.value = false;
  }, 300);
});
</script>

<style scoped>
.engagement-quality-viewer {
  width: 100%;
  min-height: 200px;
}
</style>