<template>
  <div>
    <v-container fluid class="pa-4 fill-height">
      <v-row class="fill-height">
        <v-col cols="12">
          <v-tabs v-model="activeTab" color="primary" align-tabs="center">
            <v-tab value="terminal" class="text-subtitle-1">
              <v-icon start>mdi-console</v-icon>
              {{ t().tabs.terminal || 'SQL Terminal' }}
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
                  <SQLTerminal :initialConnection="activeConnection" ref="sqlTerminalRef" />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="config">
              <v-row class="pa-4">
                <v-col cols="12" md="6">
                  <v-card class="rounded-lg" elevation="2">
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
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

                        <v-btn color="primary" prepend-icon="mdi-plus" class="mb-4" @click="showAddConnectionDialog">
                          {{ t().database.addConnection || 'Add Connection' }}
                        </v-btn>

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
                              <td>{{ conn.database }}</td>
                              <td class="text-center">
                                <v-btn icon variant="text" size="small" color="primary"
                                  @click="connectToDatabase(conn)">
                                  <v-icon>mdi-connection</v-icon>
                                </v-btn>
                                <v-btn icon variant="text" size="small" color="primary" @click="editConnection(conn)">
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon variant="text" size="small" color="error" @click="deleteConnection(conn)">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
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
                    <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                      <v-icon color="white" class="mr-2">mdi-information-outline</v-icon>
                      {{ t().database.info || 'SQL Database Information' }}
                    </v-card-title>
                    <v-card-text class="py-4">
                      <v-alert v-if="activeConnection" color="success" variant="tonal" class="mb-4">
                        <div class="d-flex align-center">
                          <v-avatar color="success" size="32" variant="tonal" class="mr-2">
                            <v-icon>mdi-database-check</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-subtitle-2">{{ t().database.connected || 'Connected to database' }}
                            </div>
                            <div class="text-body-2">{{ activeConnection.name }} - {{ activeConnection.database }}
                            </div>
                          </div>
                        </div>
                      </v-alert>

                      <v-alert v-else color="info" variant="tonal" class="mb-4">
                        <div class="d-flex align-center">
                          <v-avatar color="info" size="32" variant="tonal" class="mr-2">
                            <v-icon>mdi-database-off</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-subtitle-2">{{ t().database.notConnected || 'Not connected' }}</div>
                            <div class="text-body-2">{{ t().database.connectPrompt ||
                              'Connect to a database to start'
                            }}</div>
                          </div>
                        </div>
                      </v-alert>

                      <div class="sql-info mb-4">
                        <h3 class="text-h6 mb-2">{{ t().database.features || 'SQL Database Studio Features' }}</h3>
                        <v-list>
                          <v-list-item prepend-icon="mdi-console" title="SQL Terminal"
                            subtitle="Connect and execute SQL commands directly"></v-list-item>
                          <v-list-item prepend-icon="mdi-code-braces" title="SQL Editor"
                            subtitle="Write and execute complex SQL queries with syntax highlighting"></v-list-item>
                          <v-list-item prepend-icon="mdi-chart-line" title="Query Results"
                            subtitle="Visualize results in tables with export capabilities"></v-list-item>
                          <v-list-item prepend-icon="mdi-database-export" title="Import/Export"
                            subtitle="Import and export SQL data"></v-list-item>
                        </v-list>
                      </div>

                      <div class="text-body-2 text-grey-darken-1">
                        {{ t().database.securityNote || 'Your connection details are securely encrypted locally.' }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <DatabaseUsage :activeConnection="activeConnection" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showConnectionDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
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

            <v-text-field v-model="newConnection.database" :label="t().database.database || 'Database Name'"
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

    <v-dialog v-model="showInfoPanel" max-width="700px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          {{ t().database.help || 'SQL Database Studio Help' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <h3 class="text-h6 mb-2">{{ t().database.about || 'About SQL Database Studio' }}</h3>
          <p class="mb-4">
            {{ t().database.aboutText ||
              'SQL Database Studio allows you to connect to various SQL databases, execute ' +
              'queries, and manage your database connections securely.' }}
          </p>

          <h3 class="text-h6 mb-2">{{ t().database.quickStart || 'Quick Start Guide' }}</h3>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="32" variant="tonal">
                  <span class="text-body-1">1</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ t().database.step1Title || 'Add a Database Connection' }}</v-list-item-title>
              <v-list-item-subtitle>{{ t().database.step1Text ||
                'Go to Configuration tab and add your database details'
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="32" variant="tonal">
                  <span class="text-body-1">2</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ t().database.step2Title || 'Connect to Your Database' }}</v-list-item-title>
              <v-list-item-subtitle>{{ t().database.step2Text || 'Click the connect icon next to your database'
              }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="primary" size="32" variant="tonal">
                  <span class="text-body-1">3</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ t().database.step3Title || 'Run SQL Queries' }}</v-list-item-title>
              <v-list-item-subtitle>{{ t().database.step3Text || 'Use the SQL Terminal or Editor to execute commands'
              }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-h6 mb-2">{{ t().database.supportedDatabases || 'Supported Databases' }}</h3>
          <div class="d-flex flex-wrap mb-4">
            <v-chip class="ma-1" color="primary" variant="tonal">MySQL</v-chip>
            <v-chip class="ma-1" color="primary" variant="tonal">PostgreSQL</v-chip>
            <v-chip class="ma-1" color="primary" variant="tonal">SQLite</v-chip>
            <v-chip class="ma-1" color="primary" variant="tonal">SQL Server</v-chip>
          </div>

          <v-alert color="info" variant="tonal">
            {{ t().database.securityMessage ||
              'Your database credentials are encrypted and stored locally on your ' +
              'device for security.' }}
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showInfoPanel = false">
            {{ t().actions.close || 'Close' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="betaDialog" max-width="600px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-secondary text-white">
          <v-icon color="white" class="mr-2">mdi-information-outline</v-icon>
          Beta Feature
        </v-card-title>
        <v-card-text class="pa-4">
          <p>
            This is a beta feature for now. <br>
            Please come in few days for the full version.
          </p>
          <v-btn color="warning" variant="tonal" class="ma-2" @click="betaDialog = false">
            Close
          </v-btn>
          <v-btn color="secondary" variant="tonal" class="ma-2" @click="betaDialog = false">
            Continue
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <snackbar v-model="showSnackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DatabaseUsage from '../components/database/DatabaseUsage.vue';
import SQLTerminal from '../components/database/sqlTerminal.vue';
import { useTranslations } from '../languages';
import snackbar from '../components/snackbar.vue';
// @ts-ignore
import { definePageMeta, navigateTo } from '#imports';

const t = useTranslations('databaseManagement');

onMounted(() => {
  betaDialog.value = true;
});

definePageMeta({
  layout: 'dashboard',
});

interface DatabaseConnection {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
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

const showConnectionDialog = ref(false);
const showDeleteDialog = ref(false);
const showInfoPanel = ref(false);
const editMode = ref(false);
const connectionToDelete = ref<DatabaseConnection | null>(null);
const betaDialog = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showSnackbar = ref(false);

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

const showAddConnectionDialog = () => {
  editMode.value = false;
  newConnection.value = {
    id: '',
    name: '',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    database: '',
    username: '',
    password: ''
  };
  showConnectionDialog.value = true;
};

onMounted(() => {
  const savedConnectionsJson = localStorage.getItem('database_connections');
  if (savedConnectionsJson) {
    try {
      connections.value = JSON.parse(savedConnectionsJson);
    } catch (e) {
      console.error('Error parsing saved connections:', e);
    }
  }
});

const connectToDatabase = (connection: DatabaseConnection) => {
  activeConnection.value = connection;

  snackbarText.value = t().database.connectedTo?.replace('{name}', connection.name) ||
    `Connected to ${connection.name}`;
  snackbarColor.value = 'success';
  showSnackbar.value = true;

  if (activeTab.value === 'config') {
    activeTab.value = 'terminal';
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
</style>
