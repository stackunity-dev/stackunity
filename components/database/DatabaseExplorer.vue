<template>
  <div class="database-explorer">
    <v-card class="explorer-card elevation-3 mb-4">
      <v-card-title class="bg-secondary d-flex align-center">
        <v-icon class="mr-2">mdi-database-search</v-icon>
        {{ isExplorer ? 'Database Explorer' : 'Database Usage' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="isExplorer = !isExplorer" color="white" variant="text">
          <v-icon>{{ isExplorer ? 'mdi-chart-bar' : 'mdi-database-search' }}</v-icon>
        </v-btn>
      </v-card-title>
      <v-expand-transition>
        <div v-if="isExpanded">
          <v-card-text class="pa-4">
            <div v-if="isLoading" class="database-loading">
              <div class="loading-container">
                <v-icon class="loading-icon" size="64">mdi-database</v-icon>
                <div class="loading-text">Loading database structure...</div>
              </div>
            </div>
            <template v-else>
              <DatabaseUsage v-if="!isExplorer" :connection-id="connectionId" :active-connection="activeConnection" />
              <v-row v-else>
                <v-col cols="12" md="4" class="explorer-nav">
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-2 d-flex align-center">
                      <v-icon start color="primary">mdi-filter</v-icon>
                      Filters
                    </v-card-title>
                    <v-card-text>
                      <v-text-field v-model="searchQuery" density="compact" variant="outlined" placeholder="Search..."
                        prepend-inner-icon="mdi-magnify" hide-details class="mb-2"></v-text-field>
                    </v-card-text>
                  </v-card>

                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-2 d-flex align-center">
                      <v-icon start color="primary">mdi-database</v-icon>
                      {{ activeConnection?.database_name }}
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact" class="database-tree">
                        <template v-for="item in filteredDatabaseStructure" :key="item.name">
                          <v-list-item v-if="item.type === 'table'" @click="handleNodeSelect([item])"
                            :class="{ 'selected-node': selectedNode?.name === item.name }">
                            <template v-slot:prepend>
                              <v-icon color="primary" size="small">mdi-table</v-icon>
                            </template>
                            <v-list-item-title class="d-flex align-center">
                              <span>{{ item.name }}</span>
                              <v-chip v-if="item.rowCount" size="x-small" class="ml-2" color="primary" variant="tonal">
                                {{ formatNumber(item.rowCount) }} rows
                              </v-chip>
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="8">
                  <v-card v-if="selectedNode" variant="outlined" class="mb-4">
                    <v-card-title class="d-flex align-center">
                      <v-icon start :color="getNodeColor(selectedNode.type)">{{ getNodeIcon(selectedNode.type)
                      }}</v-icon>
                      {{ selectedNode.name }}
                      <v-spacer></v-spacer>
                      <v-btn-group>
                        <v-btn size="small" color="primary" variant="tonal" @click="generateSelectQuery">
                          <v-icon start>mdi-database-search</v-icon>
                          SELECT
                        </v-btn>
                        <v-btn size="small" color="primary" variant="tonal" @click="copyCreateStatement">
                          <v-icon start>{{ isCopying ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
                          CREATE
                        </v-btn>
                      </v-btn-group>
                    </v-card-title>
                    <v-card-text>
                      <template v-if="selectedNode.type === 'table'">
                        <div class="table-info">
                          <div class="info-section">
                            <div class="section-title">Structure</div>
                            <v-table density="compact">
                              <thead>
                                <tr>
                                  <th>Column</th>
                                  <th>Type</th>
                                  <th>Nullable</th>
                                  <th>Default</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="column in selectedNode.columns || []" :key="column.name">
                                  <td>
                                    <div class="d-flex align-center">
                                      <v-icon size="small" :color="column.isPrimary ? 'primary' : 'grey'" class="mr-2">
                                        {{ column.isPrimary ? 'mdi-key' : 'mdi-table-column' }}
                                      </v-icon>
                                      {{ column.name }}
                                    </div>
                                  </td>
                                  <td>{{ formatColumnType(column) }}</td>
                                  <td>{{ formatNullable(column.nullable) }}</td>
                                  <td>{{ column.default || '-' }}</td>
                                </tr>
                              </tbody>
                            </v-table>
                          </div>

                          <div v-if="selectedNode.indexes?.length" class="info-section">
                            <div class="section-title">Index</div>
                            <v-table density="compact">
                              <thead>
                                <tr>
                                  <th>Nom</th>
                                  <th>Colonnes</th>
                                  <th>Type</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="index in selectedNode.indexes" :key="index.name">
                                  <td>
                                    <div class="d-flex align-center">
                                      <v-icon size="small" color="success" class="mr-2">mdi-database-search</v-icon>
                                      {{ index.name }}
                                    </div>
                                  </td>
                                  <td>{{ Array.isArray(index.columns) ? index.columns.join(', ') : index.columns }}</td>
                                  <td>{{ index.type || 'INDEX' }}</td>
                                </tr>
                              </tbody>
                            </v-table>
                          </div>

                          <div v-if="selectedNode.relations?.length" class="info-section">
                            <div class="section-title">Relations</div>
                            <v-table density="compact">
                              <thead>
                                <tr>
                                  <th>Foreign Key</th>
                                  <th>Relation</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="relation in selectedNode.relations" :key="relation.name">
                                  <td>
                                    <div class="d-flex align-center">
                                      <v-icon size="small" color="primary" class="mr-2">mdi-link</v-icon>
                                      {{ relation.name }}
                                    </div>
                                  </td>
                                  <td>
                                    <div class="relation-path">
                                      <span class="source">{{ relation.description.split(' → ')[0] }}</span>
                                      <v-icon size="small" color="primary" class="mx-2">mdi-arrow-right</v-icon>
                                      <span class="target">{{ relation.description.split(' → ')[1] }}</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </v-table>
                          </div>
                        </div>
                      </template>

                      <template v-else-if="selectedNode.type === 'view'">
                        <div class="view-definition">
                          <div class="section-title">Définition de la vue</div>
                          <pre class="code-block">{{ selectedNode.definition }}</pre>
                        </div>
                      </template>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../../stores/userStore';
import DatabaseUsage from './DatabaseUsage.vue';

interface DatabaseNode {
  name: string;
  type: 'table' | 'view' | 'index' | 'function';
  columns?: Array<{
    name: string;
    type: string;
    nullable: boolean;
    default: string | null;
    isPrimary: boolean;
    index?: string;
  }>;
  definition?: string;
  table?: string;
  relations?: Array<{
    name: string;
    type: 'foreign' | 'primary';
    description: string;
  }>;
  rowCount?: number;
  children?: DatabaseNode[];
  indexes?: Array<{
    name: string;
    columns: string[];
    type: string;
  }>;
  isExpanded?: boolean;
}

interface PreviewData {
  columns: string[];
  rows: any[];
}

const props = defineProps<{
  connectionId: string;
  activeConnection?: {
    id: string;
    database: string;
    database_name: string;
    type: string;
  };
}>();

const emit = defineEmits<{
  (e: 'apply-query', query: string): void;
  (e: 'query-results', result: { query: string; results: any[]; columns: string[]; message: string }): void;
}>();

const userStore = useUserStore();
const isExpanded = ref(true);
const selectedNode = ref<DatabaseNode | null>(null);
const searchQuery = ref('');
const selectedType = ref<string | null>(null);
const previewData = ref<PreviewData>({ columns: [], rows: [] });
const databaseStructure = ref<DatabaseNode[]>([]);
const isLoading = ref(true);
const isCopying = ref(false);
const isExplorer = ref(true);

const getNodeColor = (type: string) => {
  switch (type) {
    case 'table': return 'primary';
    case 'view': return 'secondary';
    case 'index': return 'success';
    case 'function': return 'warning';
    default: return 'grey';
  }
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'table': return 'mdi-table';
    case 'view': return 'mdi-eye';
    case 'index': return 'mdi-database-search';
    case 'function': return 'mdi-function';
    default: return 'mdi-database';
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

const formatColumnType = (column: any) => {
  if (column.type.toLowerCase().includes('varchar')) {
    return `varchar(${column.type.match(/\d+/)?.[0] || 255})`;
  }
  return column.type;
};

const formatNullable = (nullable: boolean) => {
  return nullable ? 'NULL' : 'NOT NULL';
};

const handleNodeSelect = async (nodes: DatabaseNode[]) => {
  if (!Array.isArray(nodes) || nodes.length === 0) return;
  selectedNode.value = nodes[0];
  if (selectedNode.value?.type === 'table') {
    await loadTablePreview();
  }
};

const loadTablePreview = async () => {
  if (!selectedNode.value) return;
  try {
    const response = await fetch('/api/database/table-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        connectionId: props.connectionId,
        table: selectedNode.value.name,
        limit: 10
      })
    });
    const data = await response.json();
    if (data.success) {
      previewData.value = data.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
};

const generateSelectQuery = () => {
  if (!selectedNode.value) return;
  const query = `SELECT * FROM ${selectedNode.value.name} LIMIT 100;`;
  emit('apply-query', query);
};

const copyCreateStatement = async () => {
  if (!selectedNode.value) return;
  isCopying.value = true;
  try {
    const response = await fetch('/api/database/object-definition', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        connectionId: props.connectionId,
        objectName: selectedNode.value.name,
        objectType: selectedNode.value.type
      })
    });
    const data = await response.json();
    if (data.success) {
      const cleanedDefinition = data.definition.replace(/"([^"]+)"/g, '$1');
      await navigator.clipboard.writeText(cleanedDefinition);
      setTimeout(() => {
        isCopying.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error('Erreur lors de la copie de la définition:', error);
    isCopying.value = false;
  }
};

const loadDatabaseStructure = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('/api/database/structure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        connectionId: props.connectionId
      })
    });
    const data = await response.json();
    if (data.success) {
      const tables = data.structure.filter((item: DatabaseNode) => item.type === 'table');
      const indexes = data.structure.filter((item: DatabaseNode) => item.type === 'index');

      tables.forEach((table: DatabaseNode) => {
        table.indexes = indexes
          .filter((index: DatabaseNode) => index.table === table.name)
          .map((index: DatabaseNode) => ({
            name: index.name,
            columns: Array.isArray(index.columns)
              ? index.columns.map(col => typeof col === 'object' ? col.name : col)
              : [],
            type: index.type || 'INDEX'
          }));
      });

      databaseStructure.value = tables;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la structure:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.connectionId, (newId) => {
  if (newId) {
    loadDatabaseStructure();
  } else {
    databaseStructure.value = [];
    selectedNode.value = null;
    previewData.value = { columns: [], rows: [] };
  }
}, { immediate: true });

const handleConnectionChange = (connection: any) => {
  if (connection) {
    loadDatabaseStructure();
  } else {
    databaseStructure.value = [];
    selectedNode.value = null;
    previewData.value = { columns: [], rows: [] };
  }
};

const filteredDatabaseStructure = computed(() => {
  return databaseStructure.value.filter(item => {
    const matchesSearch = searchQuery.value === '' ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = !selectedType.value || item.type === selectedType.value;
    return matchesSearch && matchesType;
  });
});

defineExpose({
  handleConnectionChange
});
</script>

<style scoped>
.database-explorer {
  margin-bottom: 1rem;
}

.explorer-nav {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.code-block {
  font-family: 'Fira Code', monospace;
  background: #1e1e2f;
  color: #e0e0e0;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
}

.relations-list {
  max-height: 300px;
  overflow-y: auto;
}

.database-tree {
  background: transparent;
}

.selected-node {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

:deep(.v-list-item) {
  min-height: 36px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
  transform: translateX(4px);
}

.database-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-container {
  text-align: center;
}

.loading-icon {
  animation: pulse 2s infinite;
  color: rgb(var(--v-theme-secondary));
}

.loading-text {
  margin-top: 16px;
  font-size: 1.1em;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.table-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-section {
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-definition {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  padding: 16px;
}

:deep(.v-table) {
  background: transparent !important;
}

:deep(.v-table .v-table__wrapper > table) {
  background: transparent !important;
}

:deep(.v-table .v-table__wrapper > table > thead > tr > th) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.8em;
  letter-spacing: 0.5px;
}

:deep(.v-table .v-table__wrapper > table > tbody > tr) {
  transition: background-color 0.2s ease;
}

:deep(.v-table .v-table__wrapper > table > tbody > tr:nth-child(even)) {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

:deep(.v-table .v-table__wrapper > table > tbody > tr:hover) {
  background: rgba(var(--v-theme-primary), 0.1) !important;
}

:deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  padding: 8px 16px;
  font-size: 0.9em;
}

.relation-path {
  display: flex;
  align-items: center;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.relation-path .source {
  color: var(--v-theme-primary);
}

.relation-path .target {
  color: var(--v-theme-secondary);
}
</style>