<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Warnings</h3>

    <v-card variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="warning">mdi-alert</v-icon>
        Summary of Warnings
      </v-card-title>
      <v-card-text>
        <div v-if="totalWarnings === 0" class="text-center pa-4">
          <v-icon color="success" size="large" class="mb-2">mdi-check-circle</v-icon>
          <p class="text-h6 text-success">No warnings detected!</p>
          <p class="text-body-1">Your site seems well optimized.</p>
        </div>
        <div v-else>
          <p class="text-body-1 mb-4">
            <strong>{{ totalWarnings }}</strong> warnings have been detected on your site.
            Solving these problems could improve your SEO score.
          </p>

          <v-row>
            <v-col cols="12" sm="6" md="3" v-for="(item, index) in warningsSummary" :key="index">
              <v-card variant="flat" class="rounded-lg pa-3" :color="item.color" min-height="100">
                <div class="d-flex flex-column justify-center align-center h-100">
                  <div class="text-h4 font-weight-bold">{{ item.count }}</div>
                  <div class="text-caption text-center">{{ item.label }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <div v-if="totalWarnings > 0">
      <div class="d-flex flex-wrap gap-2 mb-4">
        <v-text-field v-model="searchQuery" density="compact" label="Search warnings" prepend-inner-icon="mdi-magnify"
          variant="outlined" class="mr-2"></v-text-field>

        <v-select v-model="severityFilter" :items="severityOptions" density="compact" label="Severity" multiple
          variant="outlined" chips class="mr-2"></v-select>

        <v-select v-model="categoryFilter" :items="categoryOptions" density="compact" label="Category" multiple
          variant="outlined" chips class="mr-2"></v-select>
      </div>

      <v-expansion-panels variant="accordion">
        <v-expansion-panel v-for="(warning, index) in filteredWarnings" :key="index" class="mb-2">
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon :color="getSeverityColor(warning.severity)" class="mr-2">
                {{ getSeverityIcon(warning.severity) }}
              </v-icon>
              <div>
                <div class="text-subtitle-1">{{ warning.title || warning.message }}</div>
                <div class="text-caption text-grey">
                  {{ warning.category }} ·
                  <span :class="`text-${getSeverityColor(warning.severity)}`">
                    {{ getSeverityLabel(warning.severity) }}
                  </span>
                </div>
              </div>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-card variant="flat" class="mb-3">
              <v-card-text>
                <div v-if="warning.description" class="text-body-1 mb-4">
                  {{ warning.description }}
                </div>

                <div v-if="warning.details" class="mb-3">
                  <div class="text-subtitle-2 mb-2">Details :</div>
                  <div class="bg-grey-lighten-4 rounded pa-3">
                    <pre class="warning-detail">{{ warning.details }}</pre>
                  </div>
                </div>

                <div v-if="warning.recommendation" class="mb-3">
                  <div class="text-subtitle-2 mb-2 text-success">How to solve :</div>
                  <div class="text-body-2">{{ warning.recommendation }}</div>
                </div>

                <div v-if="warning.location" class="mb-3">
                  <div class="text-subtitle-2 mb-2">Location :</div>
                  <div class="text-body-2">
                    <code>{{ warning.location }}</code>
                  </div>
                </div>

                <div v-if="warning.references && warning.references.length > 0" class="mt-4">
                  <div class="text-subtitle-2 mb-2">References :</div>
                  <div class="text-body-2">
                    <ul>
                      <li v-for="(reference, i) in warning.references" :key="i">
                        <a :href="reference.url" target="_blank" rel="noopener">{{ reference.title }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <div v-if="filteredWarnings.length === 0" class="text-center pa-4 mt-4">
        <v-icon color="info" size="large" class="mb-2">mdi-filter-off</v-icon>
        <p class="text-h6">No warning matches your filters</p>
        <v-btn variant="text" color="primary" @click="resetFilters">Reset filters</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const searchQuery = ref('');
const severityFilter = ref<string[]>([]);
const categoryFilter = ref<string[]>([]);

// Utiliser directement les warnings fournis par le backend
const allWarnings = computed(() => {
  // S'assurer que les warnings ont le bon format
  if (!props.result || !props.result.warnings || !Array.isArray(props.result.warnings)) {
    return [];
  }

  return props.result.warnings.map(issue => ({
    title: issue.title || issue.message,
    message: issue.message,
    description: issue.description,
    recommendation: issue.recommendation,
    category: issue.category || getCategoryFromType(issue.type),
    severity: mapSeverity(issue.severity),
    details: issue.details || null,
    location: issue.location || null,
    references: issue.references || [],
    type: issue.type
  }));
});

const filteredWarnings = computed(() => {
  let filtered = [...allWarnings.value];

  if (severityFilter.value.length > 0) {
    filtered = filtered.filter(w => severityFilter.value.includes(w.severity));
  }

  if (categoryFilter.value.length > 0) {
    filtered = filtered.filter(w => categoryFilter.value.includes(w.category));
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(w =>
      (w.title && w.title.toLowerCase().includes(query)) ||
      (w.description && w.description.toLowerCase().includes(query)) ||
      (w.message && w.message.toLowerCase().includes(query)) ||
      (w.details && w.details.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const totalWarnings = computed(() => allWarnings.value.length);
const criticalCount = computed(() => allWarnings.value.filter(w => w.severity === 'critical').length);
const majorCount = computed(() => allWarnings.value.filter(w => w.severity === 'major').length);
const minorCount = computed(() => allWarnings.value.filter(w => w.severity === 'minor').length);
const infoCount = computed(() => allWarnings.value.filter(w => w.severity === 'info').length);

// Options pour les filtres
const severityOptions = computed(() => {
  const options = new Set(allWarnings.value.map(w => w.severity));
  return Array.from(options);
});

const categoryOptions = computed(() => {
  const options = new Set(allWarnings.value.map(w => w.category));
  return Array.from(options);
});

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'error';
    case 'major': return 'warning';
    case 'minor': return 'info';
    case 'info': return 'grey';
    default: return 'grey';
  }
};

const getSeverityIcon = (severity) => {
  switch (severity) {
    case 'critical': return 'mdi-alert-circle';
    case 'major': return 'mdi-alert';
    case 'minor': return 'mdi-information';
    case 'info': return 'mdi-information-outline';
    default: return 'mdi-information-outline';
  }
};

const getSeverityLabel = (severity) => {
  switch (severity) {
    case 'critical': return 'Critical';
    case 'major': return 'Major';
    case 'minor': return 'Minor';
    case 'info': return 'Information';
    default: return 'Information';
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  severityFilter.value = [];
  categoryFilter.value = [];
};

const mapSeverity = (severity: any): string => {
  if (!severity) return 'minor';

  const severityStr = String(severity).toLowerCase();

  switch (severityStr) {
    case 'critical':
      return 'critical';
    case 'high':
      return 'major';
    case 'major':
      return 'major';
    case 'medium':
      return 'major';
    case 'minor':
    case 'low':
      return 'minor';
    case 'info':
    case 'information':
      return 'info';
    default:
      return 'minor';
  }
};

const getCategoryFromType = (type: any): string => {
  if (!type) return 'General';

  const typeStr = String(type).toLowerCase();
  if (typeStr === 'seo') return 'SEO';
  if (typeStr === 'security' || typeStr === 'xss' || typeStr === 'csrf' || typeStr === 'injection' || typeStr === 'info-leak') return 'Security';
  if (typeStr === 'accessibility') return 'Accessibility';
  if (typeStr === 'performance') return 'Performance';
  if (typeStr === 'content') return 'Content';
  if (typeStr === 'mobile') return 'Mobile';
  if (typeStr === 'social') return 'Social';

  return 'General';
};

const warningsSummary = computed(() => [
  {
    count: criticalCount.value,
    label: 'Critics problems',
    color: 'error'
  },
  {
    count: majorCount.value,
    label: 'Major problems',
    color: 'warning'
  },
  {
    count: minorCount.value,
    label: 'Minor problems',
    color: 'info'
  },
  {
    count: infoCount.value,
    label: 'Informations',
    color: 'grey-lighten-3'
  }
]);

// Exposer le total d'avertissements
defineExpose({
  totalWarnings
});
</script>

<style scoped>
.warning-detail {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
}

.code-snippet {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #eee;
  overflow-x: auto;
}

.gap-2 {
  gap: 8px;
}
</style>