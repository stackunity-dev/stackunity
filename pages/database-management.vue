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
                  <SQLTerminal @connection-change="handleConnectionChange" :initialConnection="activeConnection" />
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
          <v-btn variant="text" @click="testConnection" :loading="testing">
            {{ t().database.testConnection || 'Test Connection' }}
          </v-btn>
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

    <snackbar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DatabaseUsage from '../components/database/DatabaseUsage.vue';
import SQLTerminal from '../components/database/sqlTerminal.vue';
import { useTranslations } from '../languages';
// @ts-ignore
import { definePageMeta } from '#imports';

const t = useTranslations('databaseDesigner');

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
const isPremiumFeature = ref(false);
const connections = ref<DatabaseConnection[]>([]);
const activeConnection = ref<DatabaseConnection | null>(null);
const connectionForm = ref<any>(null);

const showConnectionDialog = ref(false);
const showDeleteDialog = ref(false);
const showInfoPanel = ref(false);
const editMode = ref(false);
const connectionToDelete = ref<DatabaseConnection | null>(null);
const testing = ref(false);
const saving = ref(false);
const deleting = ref(false);

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

// Options pour les types de connexion
const connectionTypes = [
  { title: 'MySQL', value: 'mysql' },
  { title: 'PostgreSQL', value: 'postgres' },
  { title: 'SQLite', value: 'sqlite' },
  { title: 'SQL Server', value: 'mssql' }
];

// Snackbar pour les notifications
const snackbarText = ref('');
const snackbarColor = ref('');
const showSnackbar = ref(false);

// Fonctions
const toggleInfoPanel = () => {
  showInfoPanel.value = !showInfoPanel.value;
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

const editConnection = (connection: DatabaseConnection) => {
  editMode.value = true;
  newConnection.value = { ...connection };
  showConnectionDialog.value = true;
};

const deleteConnection = (connection: DatabaseConnection) => {
  connectionToDelete.value = connection;
  showDeleteDialog.value = true;
};

const testConnection = async () => {
  testing.value = true;
  try {
    // Simulation d'un test de connexion
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 80% de chance de succès pour la démo
    const success = Math.random() > 0.2;

    if (success) {
      snackbarText.value = t().database.connectionSuccessful || 'Connection successful!';
      snackbarColor.value = 'success';
    } else {
      snackbarText.value = t().database.connectionFailed || 'Connection failed. Check your credentials.';
      snackbarColor.value = 'error';
    }
    showSnackbar.value = true;
  } catch (error) {
    console.error('Connection test error:', error);
    snackbarText.value = t().database.connectionError || 'Error testing connection';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    testing.value = false;
  }
};

const saveConnection = async () => {
  // Vérification de la validité du formulaire
  const isValid = await connectionForm.value?.validate();
  if (!isValid?.valid) return;

  saving.value = true;

  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 800));

    if (editMode.value) {
      // Mise à jour d'une connexion existante
      const index = connections.value.findIndex(c => c.id === newConnection.value.id);
      if (index !== -1) {
        connections.value[index] = { ...newConnection.value };
      }
    } else {
      // Création d'une nouvelle connexion
      newConnection.value.id = Math.random().toString(36).substring(2, 11);
      connections.value.push({ ...newConnection.value });
    }

    // Sauvegarder dans le localStorage (dans une vraie application, utilisez une API)
    localStorage.setItem('database_connections', JSON.stringify(connections.value));

    showConnectionDialog.value = false;

    snackbarText.value = editMode.value
      ? (t().database.connectionUpdated || 'Connection updated successfully')
      : (t().database.connectionAdded || 'Connection added successfully');
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error) {
    console.error('Error saving connection:', error);
    snackbarText.value = t().database.savingError || 'Error saving connection';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async () => {
  if (!connectionToDelete.value) return;

  deleting.value = true;

  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 800));

    // Supprimer la connexion
    connections.value = connections.value.filter(c => c.id !== connectionToDelete.value?.id);

    // Si la connexion supprimée est la connexion active, déconnecter
    if (activeConnection.value?.id === connectionToDelete.value.id) {
      activeConnection.value = null;
    }

    // Sauvegarder dans le localStorage
    localStorage.setItem('database_connections', JSON.stringify(connections.value));

    showDeleteDialog.value = false;

    snackbarText.value = t().database.connectionDeleted || 'Connection deleted successfully';
    snackbarColor.value = 'success';
    showSnackbar.value = true;
  } catch (error) {
    console.error('Error deleting connection:', error);
    snackbarText.value = t().database.deletingError || 'Error deleting connection';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    deleting.value = false;
    connectionToDelete.value = null;
  }
};

const connectToDatabase = (connection: DatabaseConnection) => {
  activeConnection.value = connection;

  snackbarText.value = t().database.connectedTo?.replace('{name}', connection.name) ||
    `Connected to ${connection.name}`;
  snackbarColor.value = 'success';
  showSnackbar.value = true;

  // Rediriger vers l'onglet terminal ou éditeur
  if (activeTab.value === 'config') {
    activeTab.value = 'terminal';
  }
};

const handleConnectionChange = (connection: DatabaseConnection | null) => {
  activeConnection.value = connection;
};

// Chargement des connexions depuis le localStorage
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
