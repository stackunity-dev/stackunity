<template>
  <div class="sql-query-analyzer">
    <v-card class="sql-analyzer-card elevation-3 mb-4">
      <v-card-title class="bg-secondary text-white d-flex align-center">
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

            <v-tabs v-model="activeTab" color="secondary" align-tabs="center">
              <v-tab value="query">Query</v-tab>
              <v-tab value="database">Database</v-tab>
            </v-tabs>

            <v-window v-model="activeTab" class="mt-4">
              <v-window-item value="query">
                <div class="query-analysis">
                  <h3 class="text-h6 mb-3">Query Analysis</h3>

                  <v-alert variant="tonal" type="info" class="mb-4">
                    Analyze your query to improve performance
                  </v-alert>

                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-2">Analyzed SQL Query</v-card-title>
                    <v-card-text>
                      <pre class="code-block" style="background:#181818;color:#e0e0e0;padding:12px;border-radius:6px;">
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

                      <div v-if="queryAnalysis.indexSuggestions.length" class="index-suggestions mb-4">
                        <div class="text-subtitle-2 mb-2 text-primary">{{
                          t().sqlAnalyzer.queryOptimization.indexSuggestions }}:</div>
                        <v-card v-for="(suggestion, index) in queryAnalysis.indexSuggestions" :key="index"
                          variant="outlined" class="mb-2">
                          <v-card-text>
                            <div class="d-flex align-center">
                              <v-icon start color="primary" class="mr-2">mdi-database-plus</v-icon>
                              <div class="flex-grow-1">
                                <div class="font-weight-medium mb-1">{{ suggestion.description }}</div>
                                <div class="index-sql text-caption">{{ suggestion.sql }}</div>
                              </div>
                              <v-btn size="small" variant="text" color="primary" class="ml-2"
                                @click="copyToClipboard(suggestion.sql)"
                                :title="t().sqlAnalyzer.queryOptimization.copy">
                                <v-icon>mdi-content-copy</v-icon>
                              </v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-window-item>

              <v-window-item value="database">
                <DatabaseUsage :activeConnection="activeConnection" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslations } from '../../languages';
import DatabaseUsage from './DatabaseUsage.vue';

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
  },
  activeConnection: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['apply-optimization']);

const t = useTranslations('databaseManagement');
const isExpanded = ref(true);
const activeTab = ref('query');
const isAnalyzing = ref(false);

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

const queryType = computed(() => queryAnalysis.value.queryType || getQueryTypeFromQuery());
const affectedTables = computed(() => queryAnalysis.value.affectedTables || []);
const warnings = computed((): Warning[] => queryAnalysis.value.warnings || []);
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
    console.log(result);

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

watch(
  [() => props.query, () => props.connectionId],
  ([newQuery, newConnId]) => {
    if (newQuery && newQuery.trim() && newConnId) {
      analyzeQuery();
    } else {
      activeTab.value = 'query';
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

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
  }).catch(err => {
    console.error('Erreur lors de la copie:', err);
  });
};
</script>

<style scoped>
.sql-query-analyzer {
  margin-bottom: 1rem;
}

.code-block {
  font-family: 'Fira Code', monospace;
  overflow-x: auto;
}

.index-sql {
  font-family: 'Fira Code', monospace;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}

.index-suggestions .v-card {
  transition: all 0.2s ease;
}

.index-suggestions .v-card:hover {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  transform: translateY(-1px);
}

.index-suggestions .v-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.index-suggestions .v-card:hover .v-btn {
  opacity: 1;
}

.gap-2 {
  gap: 8px;
}
</style>