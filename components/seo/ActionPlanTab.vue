<template>
  <div class="pa-4">
    <h3 class="text-h5 mb-4">Action Plan</h3>

    <v-card variant="outlined" class="mb-6">
      <v-card-title class="text-subtitle-1">
        <v-icon start color="primary">mdi-check-circle</v-icon>
        Overview of the action plan
      </v-card-title>
      <v-card-text>
        <div v-if="totalActions === 0" class="text-center pa-4">
          <v-icon color="success" size="large" class="mb-2">mdi-check-circle</v-icon>
          <p class="text-h6 text-success">Congratulations! No action required!</p>
          <p class="text-body-1">Your site is well optimized according to our analyses.</p>
        </div>
        <div v-else>
          <div class="d-flex flex-column align-center mb-4">
            <v-progress-circular :rotate="360" :size="120" :width="15" :model-value="metricsResult.seoScore || 0"
              :color="scoreColor" class="mb-2">
              {{ metricsResult.seoScore || 0 }}
            </v-progress-circular>
            <div class="text-h6 mt-2">Website score</div>
            <div :class="`text-${scoreColor} text-subtitle-2 font-weight-medium`">{{ scoreLabel }}</div>
          </div>

          <p class="text-body-1 mb-4 text-center">
            We have identified <strong>{{ totalActions }}</strong> actions to undertake to improve your SEO.
            Here is a detailed plan organized by priority.
          </p>

          <v-row class="mt-4">
            <v-col cols="12" sm="4" v-for="(item, index) in actionSummary" :key="index">
              <v-card variant="flat" class="rounded-lg pa-3" :color="item.color" min-height="100">
                <div class="d-flex flex-column justify-center align-center h-100">
                  <div class="text-h4 font-weight-bold">{{ item.count }}</div>
                  <div class="text-subtitle-2 text-center">{{ item.label }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <div v-if="totalActions > 0" class="mb-4">
      <div class="d-flex flex-wrap gap-2 mb-4">
        <v-text-field v-model="searchQuery" density="compact" label="Rechercher une action"
          prepend-inner-icon="mdi-magnify" variant="outlined" class="mr-2" style="max-width: 250px"></v-text-field>

        <v-select v-model="priorityFilter" :items="priorityOptions" density="compact" label="Priorité" multiple
          variant="outlined" chips class="mr-2" style="max-width: 200px"></v-select>

        <v-select v-model="categoryFilter" :items="categoryOptions" density="compact" label="Catégorie" multiple
          variant="outlined" chips class="mr-2" style="max-width: 200px"></v-select>
      </div>

      <div v-if="!filteredActions.length" class="text-center pa-6">
        <v-icon color="info" size="large" class="mb-2">mdi-filter-off</v-icon>
        <p class="text-h6">No action matches your filters</p>
        <v-btn variant="text" color="primary" @click="resetFilters" class="mt-2">Reset filters</v-btn>
      </div>

      <div v-else>
        <div v-if="criticalActions.length > 0" class="mb-8">
          <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
            Critical Actions
          </h3>

          <v-card v-for="(action, index) in criticalActions" :key="`critical-${index}`" class="mb-4 action-card"
            elevation="1" rounded="lg" border>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="error" size="36" class="me-4">
                  <v-icon color="white">{{ getCategoryIcon(action.category) }}</v-icon>
                </v-avatar>
              </template>
              <v-card-title>{{ action.title }}</v-card-title>
              <v-card-subtitle>{{ action.category }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="pt-2">
              <p class="mb-3">{{ action.description }}</p>

              <v-btn variant="tonal" color="primary" size="small" @click="showDetails(action)" class="mt-2">
                <v-icon start>mdi-information-outline</v-icon>
                See more details
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <div v-if="majorActions.length > 0" class="mb-8">
          <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
            Major Actions
          </h3>

          <v-card v-for="(action, index) in majorActions" :key="`major-${index}`" class="mb-4 action-card" elevation="1"
            rounded="lg" border>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="warning" size="36" class="me-4">
                  <v-icon color="white">{{ getCategoryIcon(action.category) }}</v-icon>
                </v-avatar>
              </template>
              <v-card-title>{{ action.title }}</v-card-title>
              <v-card-subtitle>{{ action.category }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="pt-2">
              <p class="mb-3">{{ action.description }}</p>

              <v-btn variant="tonal" color="primary" size="small" @click="showDetails(action)" class="mt-2">
                <v-icon start>mdi-information-outline</v-icon>
                See more details
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <div v-if="minorActions.length > 0" class="mb-8">
          <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center">
            <v-icon color="info" class="mr-2">mdi-information</v-icon>
            Minor Actions
          </h3>

          <v-card v-for="(action, index) in minorActions" :key="`minor-${index}`" class="mb-4 action-card" elevation="1"
            rounded="lg" border>
            <v-card-item>
              <template v-slot:prepend>
                <v-avatar color="info" size="36" class="me-4">
                  <v-icon color="white">{{ getCategoryIcon(action.category) }}</v-icon>
                </v-avatar>
              </template>
              <v-card-title>{{ action.title }}</v-card-title>
              <v-card-subtitle>{{ action.category }}</v-card-subtitle>
            </v-card-item>

            <v-card-text class="pt-2">
              <p class="mb-3">{{ action.description }}</p>

              <v-btn variant="tonal" color="primary" size="small" @click="showDetails(action)" class="mt-2">
                <v-icon start>mdi-information-outline</v-icon>
                See more details
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <v-dialog v-model="dialogOpen" max-width="700px">
      <v-card v-if="selectedAction">
        <v-card-title class="d-flex align-center">
          <v-avatar :color="getPriorityColor(selectedAction.priority)" size="36" class="me-4">
            <v-icon color="white">{{ getCategoryIcon(selectedAction.category) }}</v-icon>
          </v-avatar>
          {{ selectedAction.title || '' }}
        </v-card-title>

        <v-card-text class="pt-4">
          <div class="d-flex align-center mb-4">
            <v-chip :color="getPriorityColor(selectedAction.priority)" class="mr-2">
              {{ getPriorityLabel(selectedAction.priority) }}
            </v-chip>
            <v-chip variant="outlined">{{ selectedAction.category || 'Général' }}</v-chip>
          </div>

          <div class="mb-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Description</h4>
            <p>{{ selectedAction.description || 'No description available.' }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2 text-success">Recommended solution</h4>
            <p>{{ selectedAction.solution || 'No specific solution available.' }}</p>
          </div>

          <div class="mb-4" v-if="selectedAction.impact">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Impact on SEO</h4>
            <p>{{ selectedAction.impact }}</p>
          </div>

          <div class="mb-4" v-if="selectedAction.example">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Example</h4>
            <div class="bg-grey-lighten-4 rounded pa-3">
              <pre class="action-example">{{ selectedAction.example }}</pre>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="dialogOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { calculateAllMetrics } from '../../utils/seo/metrics';

const props = defineProps({
  result: {
    type: Object,
    required: true
  }
});

const dialogOpen = ref(false);
const selectedAction = ref<any>({});

const searchQuery = ref('');
const priorityFilter = ref<string[]>([]);
const categoryFilter = ref<string[]>([]);

const priorityOptions = ['critical', 'major', 'minor'];
const categoryOptions = computed(() => {
  const categories = new Set((allActions.value || []).map(a => a.category));
  return Array.from(categories);
});

const mapPriority = (severity: string): string => {
  if (!severity) return 'minor';
  const sev = severity.toLowerCase();
  if (sev === 'critical' || sev === 'high') return 'critical';
  if (sev === 'major' || sev === 'medium') return 'major';
  return 'minor';
};

const hasWarnings = computed(() => {
  return props.result &&
    props.result.warnings &&
    Array.isArray(props.result.warnings);
});

const allActions = computed(() => {
  if (!hasWarnings.value) {
    return [];
  }

  return props.result.warnings.map(issue => ({
    title: issue.title || issue.message || 'Action required',
    description: issue.description || issue.message || '',
    solution: issue.recommendation || 'Solve this problem to improve your SEO.',
    category: issue.category || getCategoryFromType(issue.type || ''),
    priority: mapPriority(issue.severity),
    impact: getImpactDescription(issue),
    example: issue.details || '',
    type: issue.type
  }));
});

const filteredActions = computed(() => {
  let filtered = [...(allActions.value || [])];

  if (priorityFilter.value && priorityFilter.value.length > 0) {
    filtered = filtered.filter(a => priorityFilter.value.includes(a.priority));
  }

  if (categoryFilter.value && categoryFilter.value.length > 0) {
    filtered = filtered.filter(a => categoryFilter.value.includes(a.category));
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(a =>
      (a.title && a.title.toLowerCase().includes(query)) ||
      (a.description && a.description.toLowerCase().includes(query)) ||
      (a.solution && a.solution.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const criticalActions = computed(() => (filteredActions.value || []).filter(a => a.priority === 'critical'));
const majorActions = computed(() => (filteredActions.value || []).filter(a => a.priority === 'major'));
const minorActions = computed(() => (filteredActions.value || []).filter(a => a.priority === 'minor'));

const totalActions = computed(() => (allActions.value || []).length);
const criticalCount = computed(() => (allActions.value || []).filter(a => a.priority === 'critical').length);
const majorCount = computed(() => (allActions.value || []).filter(a => a.priority === 'major').length);
const minorCount = computed(() => (allActions.value || []).filter(a => a.priority === 'minor').length);

const metricsResult = computed(() => {
  try {
    return calculateAllMetrics(props.result);
  } catch (e) {
    console.error("Error calculating metrics:", e);
    return { seoScore: 0 };
  }
});

const actionSummary = computed(() => [
  {
    count: criticalCount.value,
    label: 'Critical actions',
    color: 'error-lighten-5'
  },
  {
    count: majorCount.value,
    label: 'Major actions',
    color: 'warning-lighten-5'
  },
  {
    count: minorCount.value,
    label: 'Minor actions',
    color: 'info-lighten-5'
  }
]);

const resetFilters = () => {
  searchQuery.value = '';
  priorityFilter.value = [];
  categoryFilter.value = [];
};

const showDetails = (action) => {
  selectedAction.value = action || {};
  dialogOpen.value = true;
};

const getPriorityColor = (priority) => {
  if (!priority) return 'grey';
  switch (priority) {
    case 'critical': return 'error';
    case 'major': return 'warning';
    case 'minor': return 'info';
    default: return 'grey';
  }
};

const getPriorityLabel = (priority) => {
  if (!priority) return 'Information';
  switch (priority) {
    case 'critical': return 'Critical';
    case 'major': return 'Major';
    case 'minor': return 'Minor';
    default: return 'Information';
  }
};

const getCategoryIcon = (category) => {
  if (!category) return 'mdi-alert-circle-outline';
  switch (category.toLowerCase()) {
    case 'seo': return 'mdi-magnify';
    case 'security': return 'mdi-shield';
    case 'accessibility': return 'mdi-human';
    case 'performance': return 'mdi-speedometer';
    case 'content': return 'mdi-file-document';
    case 'mobile': return 'mdi-cellphone';
    case 'engagement': return 'mdi-chart-line';
    default: return 'mdi-alert-circle-outline';
  }
};

const getCategoryFromType = (type: string): string => {
  if (!type) return 'General';

  const typeStr = type.toLowerCase();
  if (typeStr === 'seo') return 'SEO';
  if (typeStr === 'security' || typeStr === 'xss' || typeStr === 'csrf' || typeStr === 'injection' || typeStr === 'info-leak') return 'Sécurité';
  if (typeStr === 'accessibility') return 'Accessibility';
  if (typeStr === 'performance') return 'Performance';
  if (typeStr === 'content') return 'Content';
  if (typeStr === 'mobile') return 'Mobile';
  if (typeStr === 'engagement') return 'Engagement';

  return 'General';
};

const getImpactDescription = (issue) => {
  if (!issue) return '';
  if (issue.impact) return issue.impact;

  const severity = issue.severity?.toLowerCase() || '';
  const type = issue.type?.toLowerCase() || '';

  if (severity === 'critical' || severity === 'high') {
    if (type === 'seo') return 'Major impact on SEO. Urgent correction recommended.';
    if (type === 'security') return 'Important security risk. Must be corrected immediately.';
    if (type === 'accessibility') return 'Significant barrier for certain users. Important correction recommended.';
    if (type === 'performance') return 'Affects the site speed and user experience significantly.';
  } else if (severity === 'major' || severity === 'medium') {
    if (type === 'seo') return 'Moderate impact on SEO. Recommended correction.';
    if (type === 'security') return 'Vulnerability to consider. Recommended correction.';
    if (type === 'accessibility') return 'Accessibility issue for certain users.';
    if (type === 'performance') return 'Can slow down the site and affect the user experience.';
  } else {
    return 'Minor improvement that can contribute to optimizing your site.';
  }

  return 'Solving this problem will improve your website.';
};

const scoreColor = computed(() => {
  const score = metricsResult.value?.seoScore || 0;
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
});

const scoreLabel = computed(() => {
  const score = metricsResult.value?.seoScore || 0;
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'To improve';
  return 'Critical';
});

defineExpose({
  totalActions
});
</script>

<style scoped>
.action-card {
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.action-example {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: monospace;
  font-size: 0.9rem;
}

.gap-2 {
  gap: 8px;
}
</style>