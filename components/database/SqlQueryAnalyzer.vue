<template>
  <div class="sql-query-analyzer">
    <v-card class="sql-analyzer-card elevation-3 mb-4">
      <v-card-title class="bg-primary text-white d-flex align-center">
        <v-icon class="mr-2">mdi-database-check</v-icon>
        {{ t().sqlAnalyzer.title }}
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleAnalyzer" color="white" variant="text">
          <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-expand-transition>
        <div v-if="isExpanded">
          <v-card-text class="pa-4">
            <v-alert v-if="!hasQuery" type="info" variant="tonal" class="mb-4">
              {{ t().sqlAnalyzer.noQuery }}
            </v-alert>

            <template v-else>
              <v-tabs v-model="activeTab" color="primary" grow>
                <v-tab value="analysis">
                  <v-icon start>mdi-magnify</v-icon>
                  {{ t().sqlAnalyzer.tabs.analysis }}
                </v-tab>
                <v-tab value="optimization">
                  <v-icon start>mdi-rocket-launch</v-icon>
                  {{ t().sqlAnalyzer.tabs.optimization }}
                </v-tab>
                <v-tab value="execution">
                  <v-icon start>mdi-chart-timeline-variant</v-icon>
                  {{ t().sqlAnalyzer.tabs.execution }}
                </v-tab>
              </v-tabs>

              <v-window v-model="activeTab" class="mt-4">
                <v-window-item value="analysis">
                  <div class="query-analysis">
                    <h3 class="text-h6 mb-3">Query Analysis</h3>

                    <!-- Affichage de la requête SQL reçue -->
                    <v-card variant="outlined" class="mb-4">
                      <v-card-title class="text-subtitle-2">Analyzed SQL Query</v-card-title>
                      <v-card-text>
                        <pre class="code-block"
                          style="background:#181818;color:#e0e0e0;padding:12px;border-radius:6px;">
<code>{{ props.query }}</code>
                        </pre>
                      </v-card-text>
                    </v-card>

                    <v-card variant="outlined" class="mb-4">
                      <v-card-text>
                        <div class="d-flex mb-2">
                          <v-chip color="primary" size="small" class="mr-2">{{ queryType }}</v-chip>
                          <v-chip color="secondary" size="small" class="mr-2" v-if="affectedTables.length">
                            {{ affectedTables.length }} Tables
                          </v-chip>
                          <v-chip color="success" size="small" class="mr-2" v-if="executionEfficiency !== undefined">
                            Efficiency: {{ executionEfficiency }}%
                          </v-chip>
                          <v-chip color="info" size="small" class="mr-2" v-if="executionTime !== undefined">
                            Time: {{ executionTime }}ms
                          </v-chip>
                        </div>

                        <div v-if="affectedTables.length" class="affected-tables mb-4">
                          <div class="text-subtitle-2 mb-2">Tables:</div>
                          <div class="d-flex flex-wrap gap-2">
                            <v-chip v-for="table in affectedTables" :key="table" variant="tonal">
                              {{ table }}
                            </v-chip>
                          </div>
                        </div>

                        <div v-if="warnings.length" class="query-warnings mb-2">
                          <div class="text-subtitle-2 mb-2 text-warning">Warnings:</div>
                          <v-alert v-for="(warning, index) in warnings" :key="index" variant="outlined" type="warning"
                            density="compact" class="mb-2">
                            <div class="d-flex align-center">
                              <v-icon start color="warning">{{ warning.icon }}</v-icon>
                              <div>
                                <div class="font-weight-medium">{{ warning.title }}</div>
                                <div class="text-caption">{{ warning.description }}</div>
                              </div>
                            </div>
                          </v-alert>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-window-item>

                <v-window-item value="optimization">
                  <div class="query-optimization">
                    <h3 class="text-h6 mb-3">{{ t().sqlAnalyzer.queryOptimization.title }}</h3>

                    <div v-if="optimizations.length">
                      <v-card variant="outlined" class="mb-3" v-for="(optimization, index) in optimizations"
                        :key="index">
                        <v-card-title class="d-flex align-center py-2 text-subtitle-1">
                          <v-icon start color="success" class="mr-2">{{ optimization.icon }}</v-icon>
                          {{ optimization.title }}
                          <v-spacer></v-spacer>
                          <v-chip color="success" size="small" variant="tonal">
                            {{ optimization.improvementPercent }}% {{ t().sqlAnalyzer.queryOptimization.faster }}
                          </v-chip>
                        </v-card-title>
                        <v-card-text class="pt-2">
                          <p class="text-body-2 mb-3">{{ optimization.description }}</p>
                          <div class="bg-grey-darken-4 pa-3 rounded code-block">
                            <pre class="ma-0"><code>{{ optimization.optimizedQuery }}</code></pre>
                          </div>
                          <v-btn class="mt-3" size="small" prepend-icon="mdi-content-copy" variant="tonal"
                            @click="copyOptimizedQuery(optimization.optimizedQuery)">
                            {{ t().sqlAnalyzer.queryOptimization.copy }}
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </div>
                    <v-alert v-else type="info" variant="tonal">
                      {{ t().sqlAnalyzer.queryOptimization.noSuggestions }}
                    </v-alert>

                    <v-card class="mt-4" variant="outlined">
                      <v-card-title class="text-subtitle-1">
                        <v-icon start>mdi-lightbulb</v-icon>
                        {{ t().sqlAnalyzer.queryOptimization.indexSuggestions }}
                      </v-card-title>
                      <v-card-text>
                        <div v-if="indexSuggestions.length">
                          <div v-for="(suggestion, index) in indexSuggestions" :key="index" class="mb-2">
                            <div class="d-flex align-center">
                              <v-icon color="info" size="small" class="mr-2">mdi-database-plus</v-icon>
                              <code class="index-suggestion">{{ suggestion.sql }}</code>
                            </div>
                            <div class="text-caption text-medium-emphasis ml-6 mt-1">
                              {{ suggestion.description }}
                            </div>
                          </div>
                        </div>
                        <p v-else class="text-body-2">
                          {{ t().sqlAnalyzer.queryOptimization.noIndexSuggestions }}
                        </p>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-window-item>

                <v-window-item value="execution">
                  <div class="execution-plan">
                    <h3 class="text-h6 mb-3">{{ t().sqlAnalyzer.executionPlan.title }}</h3>

                    <v-alert v-if="!executionPlan.steps.length" type="info" variant="tonal">
                      {{ t().sqlAnalyzer.executionPlan.notAvailable }}
                    </v-alert>

                    <template v-else>
                      <div class="execution-summary d-flex align-center mb-4">
                        <v-progress-circular :model-value="executionEfficiency"
                          :color="getEfficiencyColor(executionEfficiency)" size="50" width="7">
                          {{ executionEfficiency }}%
                        </v-progress-circular>
                        <div class="ml-4">
                          <div class="text-h6">{{ t().sqlAnalyzer.executionPlan.efficiency }}</div>
                          <div class="text-caption">{{ getEfficiencyDescription(executionEfficiency) }}</div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-chip :color="getTimeColor(executionTime)">
                          {{ t().sqlAnalyzer.executionPlan.estimatedTime }}: {{ executionTime }}ms
                        </v-chip>
                      </div>

                      <div class="execution-steps">
                        <v-timeline density="compact" align="start">
                          <v-timeline-item v-for="(step, index) in executionPlan.steps" :key="index"
                            :dot-color="getStepColor(step)" :size="getStepSize(step)">
                            <div class="d-flex align-center">
                              <div class="font-weight-medium">{{ step.operation }}</div>
                              <v-chip size="x-small" class="ml-2" :color="getStepColor(step)" variant="tonal">
                                {{ step.cost }}
                              </v-chip>
                            </div>
                            <div class="text-body-2 text-medium-emphasis">
                              {{ step.description }}
                            </div>
                            <div v-if="step.warning" class="text-caption text-warning mt-1">
                              <v-icon size="x-small" color="warning" class="mr-1">mdi-alert-circle</v-icon>
                              {{ step.warning }}
                            </div>
                          </v-timeline-item>
                        </v-timeline>
                      </div>
                    </template>
                  </div>
                </v-window-item>
              </v-window>
            </template>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslations } from '../../languages';

// Interfaces pour typer les données d'analyse
interface Warning {
  icon: string;
  title: string;
  description: string;
}

interface Optimization {
  icon: string;
  title: string;
  description: string;
  improvementPercent: number;
  optimizedQuery: string;
}

interface IndexSuggestion {
  sql: string;
  description: string;
}

interface ExecutionStep {
  operation: string;
  description: string;
  cost: number;
  warning?: string;
}

interface ExecutionPlan {
  totalCost: number;
  steps: ExecutionStep[];
}

interface AnalysisResult {
  queryType: string;
  affectedTables: string[];
  tableDetails: Array<{ name: string; columns: string[] }>;
  warnings: Warning[];
  indexSuggestions: IndexSuggestion[];
  optimizations: Optimization[];
  executionPlan: ExecutionPlan;
  efficiency: number;
  estimatedTime: number;
}

const props = defineProps({
  query: {
    type: String,
    default: '',
  },
  databaseType: {
    type: String,
    default: 'mysql',
  },
  analysisResults: {
    type: Object as () => AnalysisResult,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  connectionId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['apply-optimization']);

const t = useTranslations('databaseManagement');
const isExpanded = ref(true);
const activeTab = ref('analysis');
const isAnalyzing = ref(false);

// État pour stocker les résultats d'analyse de l'API
const queryAnalysis = ref<AnalysisResult>({
  queryType: '',
  affectedTables: [],
  tableDetails: [],
  warnings: [],
  indexSuggestions: [],
  optimizations: [],
  executionPlan: {
    totalCost: 0,
    steps: []
  },
  efficiency: 0,
  estimatedTime: 0
});

// Calculs dérivés des résultats de l'API
const queryType = computed(() => queryAnalysis.value.queryType || getQueryTypeFromQuery());
const hasQuery = computed(() => props.query.trim().length > 0);
const affectedTables = computed(() => queryAnalysis.value.affectedTables || []);
const warnings = computed((): Warning[] => queryAnalysis.value.warnings || []);
const indexSuggestions = computed((): IndexSuggestion[] => queryAnalysis.value.indexSuggestions || []);
const optimizations = computed((): Optimization[] => queryAnalysis.value.optimizations || []);
const executionPlan = computed((): ExecutionPlan => queryAnalysis.value.executionPlan || { totalCost: 0, steps: [] });
const executionEfficiency = computed(() => queryAnalysis.value.efficiency || 0);
const executionTime = computed(() => queryAnalysis.value.estimatedTime || 0);

function getQueryTypeFromQuery() {
  const query = props.query.trim().toUpperCase();
  if (query.startsWith('SELECT')) return 'SELECT';
  if (query.startsWith('INSERT')) return 'INSERT';
  if (query.startsWith('UPDATE')) return 'UPDATE';
  if (query.startsWith('DELETE')) return 'DELETE';
  if (query.startsWith('CREATE')) return 'CREATE';
  if (query.startsWith('ALTER')) return 'ALTER';
  if (query.startsWith('DROP')) return 'DROP';
  return 'QUERY';
}

async function analyzeQuery() {
  if (!props.query.trim() || !props.connectionId) return;

  isAnalyzing.value = true;

  try {
    const response = await fetch('/api/database/analyze-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionId: props.connectionId,
        query: props.query
      })
    });

    const result = await response.json();

    if (result.success && result.data) {
      queryAnalysis.value = result.data;
    } else {
      console.error('Erreur lors de l\'analyse de la requête:', result.message);
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API d\'analyse:', error);
  } finally {
    isAnalyzing.value = false;
  }
}

const toggleAnalyzer = () => {
  isExpanded.value = !isExpanded.value;
};

const copyOptimizedQuery = (query) => {
  navigator.clipboard.writeText(query);
  // Un feedback pourrait être ajouté ici
};

const getMetricColor = (score) => {
  switch (score) {
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'error': return 'error';
    default: return 'primary';
  }
};

const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 80) return 'success';
  if (efficiency >= 50) return 'warning';
  return 'error';
};

const getTimeColor = (time) => {
  if (time < 100) return 'success';
  if (time < 500) return 'warning';
  return 'error';
};

const getEfficiencyDescription = (efficiency) => {
  if (efficiency >= 80) return 'Excellente performance';
  if (efficiency >= 50) return 'Performance acceptable';
  return 'Amélioration recommandée';
};

const getStepColor = (step) => {
  if (step.warning) return 'warning';
  if (step.cost > 50) return 'error';
  if (step.cost > 20) return 'warning';
  return 'success';
};

const getStepSize = (step) => {
  if (step.cost > 50) return 'large';
  if (step.cost > 20) return 'default';
  return 'small';
};

// Analyse la requête quand elle change
watch(
  [() => props.query, () => props.connectionId],
  ([newQuery, newConnId]) => {
    if (newQuery && newQuery.trim() && newConnId) {
      analyzeQuery();
    } else {
      activeTab.value = 'analysis';
      queryAnalysis.value = {
        queryType: '',
        affectedTables: [],
        tableDetails: [],
        warnings: [],
        indexSuggestions: [],
        optimizations: [],
        executionPlan: { totalCost: 0, steps: [] },
        efficiency: 0,
        estimatedTime: 0
      };
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.sql-query-analyzer {
  margin-bottom: 1rem;
}

.code-block {
  font-family: 'Fira Code', monospace;
  overflow-x: auto;
}

.index-suggestion {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 4px 8px;
  border-radius: 4px;
}

.gap-2 {
  gap: 8px;
}
</style>