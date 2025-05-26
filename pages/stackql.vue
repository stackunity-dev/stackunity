<template>
  <main class="fill-bg">
    <v-container fluid class="pa-4 fill-height">
      <v-row class="fill-height">
        <v-col cols="12">
          <v-tabs v-model="activeTab" color="primary" align-tabs="center">
            <v-tab value="terminal" class="text-subtitle-1">
              <v-icon start>mdi-console</v-icon>
              {{ t().tabs.terminal || 'SQL Terminal' }}
            </v-tab>
            <v-tab value="explorer" class="text-subtitle-1">
              <v-icon start>mdi-database</v-icon>
              {{ t().tabs.explorer || 'Database Explorer' }}
            </v-tab>
            <v-tab value="config" class="text-subtitle-1">
              <v-icon start>mdi-cogs</v-icon>
              {{ t().tabs.config || 'Configuration' }}
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="terminal">
              <v-row class="pa-4">
                <v-col cols="12">
                  <SQLTerminal :initialConnection="activeConnection" ref="sqlTerminalRef"
                    @connection-change="activeConnection = $event" @query-results="handleQueryResults"
                    @change-tab="activeTab = $event" />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="explorer">
              <v-row class="pa-4">
                <v-col cols="12">
                  <DatabaseExplorer :connection-id="activeConnection?.id || ''"
                    :active-connection="activeConnection ? { database: activeConnection.database, database_name: activeConnection.database_name || activeConnection.database } : undefined"
                    @apply-query="handleExplorerQuery" />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="config">
              <v-row class="pa-4">
                <v-col cols="12" md="6">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-database-cog</v-icon>
                      {{ t().database.connections || 'Database Connections' }}
                    </v-card-title>
                    <v-card-text class="py-4">
                      <v-alert v-if="isPremiumFeature" color="warning" variant="tonal" class="mb-4">
                        <div class="d-flex align-center">
                          <v-icon color="warning" class="mr-2">mdi-crown</v-icon>
                          <div>
                            <div class="text-subtitle-2">{{ t().premium.title || 'Premium Feature' }}</div>
                            <div class="text-body-2">{{ t().premium.message || 'Upgrade to access this feature' }}
                            </div>
                          </div>
                          <v-spacer></v-spacer>
                          <v-btn color="warning" variant="tonal" to="/pricing">
                            {{ t().premium.upgrade || 'Upgrade' }}
                          </v-btn>
                        </div>
                      </v-alert>

                      <div v-else>
                        <p class="text-body-1 mb-4">
                          {{ t().database.description || 'Manage your database connections' }}
                        </p>

                        <v-table v-if="connections.length > 0" class="rounded-lg border">
                          <thead>
                            <tr>
                              <th>{{ t().database.name || 'Name' }}</th>
                              <th>{{ t().database.type || 'Type' }}</th>
                              <th>{{ t().database.host || 'Host' }}</th>
                              <th>{{ t().database.database || 'Database' }}</th>
                              <th class="text-center">{{ t().database.actions || 'Actions' }}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="conn in connections" :key="conn.id">
                              <td>{{ conn.name }}</td>
                              <td>{{ conn.type }}</td>
                              <td>{{ conn.host }}:{{ conn.port }}</td>
                              <td>{{ conn.database_name }}</td>
                              <td class="text-center">
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn icon variant="text" size="small" color="primary"
                                      @click="connectToDatabase(conn)" v-bind="props">
                                      <v-icon>mdi-connection</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Connect</span>
                                </v-tooltip>
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn icon variant="text" size="small" color="primary"
                                      @click="editConnection(conn)" v-bind="props">
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Edit</span>
                                </v-tooltip>
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-btn icon variant="text" size="small" color="error"
                                      @click="deleteConnection(conn)" v-bind="props">
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Delete</span>
                                </v-tooltip>
                              </td>
                            </tr>
                          </tbody>
                        </v-table>

                        <v-alert v-else type="info" variant="tonal" class="mt-3">
                          {{ t().database.noConnections || 'No connections yet. Add one to get started.' }}
                        </v-alert>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-cog</v-icon>
                      Editor Preferences
                    </v-card-title>
                    <v-card-text class="py-4">
                      <div class="text-h6 mb-2">SQL Snippets</div>
                      <v-table density="compact" class="mb-4" aria-label="SQL snippets">
                        <thead>
                          <tr>
                            <th>Command</th>
                            <th>Shortcut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="snippet in sqlSnippets" :key="snippet.label">
                            <td>{{ snippet.description }}</td>
                            <td>
                              <v-text-field v-model="snippet.shortcut" density="compact" variant="outlined" hide-details
                                @update:model-value="updateSnippetShortcut(snippet)"></v-text-field>
                            </td>
                            <td>
                              <v-btn icon size="small" variant="text" color="error"
                                @click="resetSnippetShortcut(snippet)">
                                <v-icon>mdi-refresh</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <v-btn size="small" variant="tonal" color="secondary" @click="resetAllSnippetShortcuts">
                        Reset all shortcuts
                      </v-btn>

                      <div class="text-h6 mt-6 mb-2">Shortcuts</div>
                      <v-table density="compact" class="mb-4" aria-label="Editor shortcuts">
                        <thead>
                          <tr>
                            <th>Action</th>
                            <th>Shortcut</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(shortcut, key) in editorShortcuts" :key="key">
                            <td>{{ shortcut.label }}</td>
                            <td>{{ shortcut.value }}</td>
                            <td>
                              <v-btn icon size="small" variant="text" @click="editShortcut(key)">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <v-btn size="small" variant="tonal" color="secondary" @click="resetShortcuts">Reset all
                        shortcuts</v-btn>

                      <div class="text-h6 mt-6 mb-2">Font & Size</div>
                      <v-select v-model="editorFont" :items="fontOptions" label="Font" class="mb-2" />
                      <v-slider v-model="editorFontSize" min="12" max="22" step="1" label="Font Size" thumb-label
                        class="mb-2" />

                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showConnectionDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-secondary text-white">
          {{ editMode ? (t().database.editConnection || 'Edit Connection') : (t().database.addConnection ||
            'Add Connection') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="connectionForm" @submit.prevent="saveConnection">
            <v-text-field v-model="newConnection.name" :label="t().database.name || 'Connection Name'"
              variant="outlined" class="mb-2"
              :rules="[v => !!v || t().validation.required || 'Required']"></v-text-field>

            <v-select v-model="newConnection.type" :items="connectionTypes"
              :label="t().database.type || 'Database Type'" variant="outlined" class="mb-2"
              :rules="[v => !!v || t().validation.required || 'Required']"></v-select>

            <v-text-field v-model="newConnection.host" :label="t().database.host || 'Host'" variant="outlined"
              class="mb-2" :rules="[v => !!v || t().validation.required || 'Required']"></v-text-field>

            <v-text-field v-model.number="newConnection.port" :label="t().database.port || 'Port'" type="number"
              variant="outlined" class="mb-2"
              :rules="[v => !!v || t().validation.required || 'Required']"></v-text-field>

            <v-text-field v-model="newConnection.username" :label="t().database.username || 'Username'"
              variant="outlined" class="mb-2"
              :rules="[v => !!v || t().validation.required || 'Required']"></v-text-field>

            <v-text-field v-model="newConnection.password" :label="t().database.password || 'Password'"
              variant="outlined" type="password" class="mb-2"
              :rules="[v => !!v || t().validation.required || 'Required']"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="showConnectionDialog = false">
            {{ t().actions.cancel || 'Cancel' }}
          </v-btn>
          <v-btn color="primary" @click="saveConnection" :loading="saving">
            {{ t().actions.save || 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="bg-error text-white">
          {{ t().database.confirmDelete || 'Confirm Deletion' }}
        </v-card-title>
        <v-card-text class="pa-4 pt-5">
          {{
            (t().database.deleteWarning || 'Are you sure you want to delete the connection to {name}?').replace('{name}',
              connectionToDelete?.name || '')
          }}
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="showDeleteDialog = false">
            {{ t().actions.cancel || 'Cancel' }}
          </v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="deleting">
            {{ t().actions.delete || 'Delete' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSecurityNotice" max-width="540px" persistent>
      <v-card>
        <v-card-title class="bg-secondary text-white">
          <v-icon class="mr-2">mdi-shield-lock</v-icon>
          Security & Privacy Notice
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="mb-3">
            <h3 class="text-h6 mb-2 d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-lock-check</v-icon>
              Your Data is Safe
            </h3>
            <p class="mb-2">
              <strong>Your database credentials are always encrypted (AES-256).</strong>
            </p>
            <ul class="mb-2 pl-4">
              <li>No sensitive information is ever sent to third parties or stored on external servers.</li>
              <li>All connections use secure protocols (TLS/SSL when available).</li>
              <li>You are always in control of your data and can delete your credentials at any time.</li>
            </ul>
          </div>
          <v-alert type="info" variant="tonal" class="mb-2">
            You are always in control of your data.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" color="secondary" :href="'/privacy'" target="_blank" class="ml-2"
            aria-label="Read full security policy">
            <v-icon start size="small">mdi-file-document-outline</v-icon>
            Read full security policy
          </v-btn>
          <v-btn color="primary" @click="acceptSecurityNotice" autofocus>OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <snackbar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import SQLTerminal from '../components/database/sqlTerminal.vue';
import snackbar from '../components/snackbar.vue';
import { useTranslations } from '../languages';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import axios from 'axios';
import DatabaseExplorer from '../components/database/DatabaseExplorer.vue';
import { useUserStore } from '../stores/userStore';
import { SQL_SNIPPETS } from '../utils/database/command';

const t = useTranslations('databaseManagement');
const userStore = useUserStore();

const loadConnections = async () => {
  try {
    const response = await axios.get('/api/database/connections', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success && response.data.connections) {
      connections.value = response.data.connections;
    }
  } catch (error) {
    console.error('Error loading connections:', error);
    snackbarText.value = 'Failed to load connections';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

onMounted(() => {
  loadConnections();
  betaDialog.value = true;
  showSecurityNotice.value = localStorage.getItem('securityNoticeAccepted') !== 'true';
});

definePageMeta({
  layout: 'dashboard',
});

useHead({
  title: 'StackQL - SQL Database Management',
  meta: [
    { name: 'description', content: 'StackQL is a SQL Database Management tool that allows you to connect to various SQL databases, execute queries, and manage your database connections securely.' },
  ],
});

interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  database_name?: string;
  database: string;
  username: string;
  password: string;
}

const activeTab = ref('terminal');
const sqlTerminalRef = ref<InstanceType<typeof SQLTerminal> | null>(null);
const isPremiumFeature = ref(false);
const connections = ref<DatabaseConnection[]>([]);
const activeConnection = ref<DatabaseConnection | null>(null);
const connectionForm = ref<any>(null);

const lastExecutedQuery = ref('');
const analysisResults = ref({
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
const results = ref<any[]>([]);
const columns = ref<string[]>([]);
const isExecuting = ref(false);

const showConnectionDialog = ref(false);
const showDeleteDialog = ref(false);
const showInfoPanel = ref(false);
const editMode = ref(false);
const connectionToDelete = ref<DatabaseConnection | null>(null);
const betaDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showSnackbar = ref(false);
const showSecurityNotice = ref(false);

const newConnection = ref<DatabaseConnection>({
  id: '',
  name: '',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: '',
  username: '',
  password: ''
});

const connectionTypes = [
  { title: 'MySQL', value: 'mysql' },
  { title: 'PostgreSQL', value: 'postgres' },
  { title: 'SQLite', value: 'sqlite' },
  { title: 'SQL Server', value: 'mssql' }
];

const snackbarText = ref('');
const snackbarColor = ref('');

const defaultShortcuts: Record<string, { label: string; value: string }> = {
  run: { label: 'Run Query', value: 'Ctrl+Enter' },
  format: { label: 'Format SQL', value: 'Ctrl+Shift+F' },
  comment: { label: 'Toggle Comment', value: 'Ctrl+/' },
  save: { label: 'Save Query', value: 'Ctrl+S' },
  clear: { label: 'Clear Editor', value: 'Ctrl+L' }
};

const editorShortcuts = ref<Record<string, { label: string; value: string }>>(
  JSON.parse(localStorage.getItem('editorShortcuts') || 'null') || defaultShortcuts
);

function editShortcut(key: string) {
  const newValue = prompt(`Set new shortcut for ${editorShortcuts.value[key].label}:`, editorShortcuts.value[key].value);
  if (newValue) {
    editorShortcuts.value[key].value = newValue;
    localStorage.setItem('editorShortcuts', JSON.stringify(editorShortcuts.value));
  }
}

function resetShortcuts() {
  editorShortcuts.value = JSON.parse(JSON.stringify(defaultShortcuts));
  localStorage.setItem('editorShortcuts', JSON.stringify(editorShortcuts.value));
}

const fontOptions = ['Fira Code', 'Consolas', 'Menlo', 'Monaco', 'Source Code Pro'];
const editorFont = ref(localStorage.getItem('editorFont') || 'Fira Code');
const editorFontSize = ref(Number(localStorage.getItem('editorFontSize')) || 15);
watch(editorFont, v => localStorage.setItem('editorFont', v));
watch(editorFontSize, v => localStorage.setItem('editorFontSize', String(v)));

const editConnection = (connection: DatabaseConnection) => {
  editMode.value = true;
  newConnection.value = { ...connection };
  showConnectionDialog.value = true;
};

const deleteConnection = (connection: DatabaseConnection) => {
  connectionToDelete.value = connection;
  showDeleteDialog.value = true;
};

const saveConnection = async () => {
  try {
    const response = await fetch('/api/database/connection', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify(newConnection.value)
    });
    if (!response.ok) {
      throw new Error('Failed to save connection');
    }
    const data = await response.json();
  } catch (error) {
    console.error('Error saving connection:', error);
  }
};

const confirmDelete = async () => {
  try {
    const response = await fetch('/api/database/connection', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({ id: connectionToDelete.value?.id })
    });
    if (!response.ok) {
      throw new Error('Failed to delete connection');
    }
    const data = await response.json();
    if (data.success) {
      connections.value = connections.value.filter(conn => conn.id !== connectionToDelete.value?.id);
      snackbarText.value = data.message;
      snackbarColor.value = 'success';
      showSnackbar.value = true;
    }
  } catch (error) {
    console.error('Error deleting connection:', error);
  }
};

const connectToDatabase = async (connection: DatabaseConnection) => {
  try {
    const response = await axios.post('/api/database/connect', {
      connectionId: connection.id
    }, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success) {
      activeConnection.value = connection;
      snackbarText.value = t().database.connectedTo?.replace('{name}', connection.name) ||
        `Connected to ${connection.name}`;
      snackbarColor.value = 'success';
      showSnackbar.value = true;

      if (activeTab.value === 'config') {
        activeTab.value = 'terminal';
      }
    } else {
      throw new Error(response.data.message || 'Failed to connect');
    }
  } catch (error: any) {
    snackbarText.value = error.message || 'Connection failed';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const applyOptimization = (optimizedQuery: string) => {
  if (optimizedQuery && sqlTerminalRef.value) {
    if ('updateQuery' in sqlTerminalRef.value) {
      (sqlTerminalRef.value as any).updateQuery(optimizedQuery);
    }
  }
};

const handleQueryResults = (data: { query: string, results: any[], columns: string[], message?: string }) => {
  if (data.message) {
    results.value = [{ message: data.message }];
    columns.value = ['message'];
  } else {
    results.value = data.results;
    columns.value = data.columns;
  }
  lastExecutedQuery.value = data.query;
};

function acceptSecurityNotice() {
  showSecurityNotice.value = false;
  localStorage.setItem('securityNoticeAccepted', 'true');
}

const sqlSnippets = ref(SQL_SNIPPETS.map(snippet => ({
  ...snippet,
  shortcut: localStorage.getItem(`sqlSnippetShortcut_${snippet.label}`) || snippet.shortcut
})));

const updateSnippetShortcut = (snippet: any) => {
  localStorage.setItem(`sqlSnippetShortcut_${snippet.label}`, snippet.shortcut);
};

const resetSnippetShortcut = (snippet: any) => {
  snippet.shortcut = SQL_SNIPPETS.find(s => s.label === snippet.label)?.shortcut || '';
  localStorage.removeItem(`sqlSnippetShortcut_${snippet.label}`);
};

const resetAllSnippetShortcuts = () => {
  sqlSnippets.value = SQL_SNIPPETS.map(snippet => ({
    ...snippet,
    shortcut: snippet.shortcut
  }));
  localStorage.clear();
};

const handleExplorerQuery = (query: string) => {
  if (sqlTerminalRef.value) {
    sqlTerminalRef.value.executeQuery(query);
  }
};
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.max-width-200 {
  max-width: 200px;
}

.sql-info {
  max-height: 300px;
  overflow-y: auto;
}

main,
.v-application,
.v-main,
body,
html {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 30%, #0f172a, #0a0f1f);
}

.fill-bg {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 30%, #0f172a, #0a0f1f);
}
</style>
