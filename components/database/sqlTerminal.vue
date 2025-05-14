<template>
  <div class="sql-terminal">
    <v-card class="sql-terminal-card elevation-3">
      <v-card-title class="bg-secondary text-white d-flex align-center">
        <v-icon class="mr-2">mdi-database-search</v-icon>
        {{ t().sqlTerminal.title }}
        <v-spacer></v-spacer>
        <v-btn v-if="isConnected" icon @click="exportDatabase" :loading="isExporting" :disabled="isExporting"
          color="white" variant="text" class="mr-2">
          <v-icon>mdi-upload</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{ t().sqlTerminal.exportDatabase }}
          </v-tooltip>
        </v-btn>
        <v-btn icon @click="toggleConnectionPanel" :color="showConnections ? 'surface' : 'white'" variant="text">
          <v-icon>{{ showConnections ? 'mdi-close' : 'mdi-database-cog' }}</v-icon>
        </v-btn>
      </v-card-title>

      <v-slide-x-transition>
        <div v-if="showConnections" class="pa-4">
          <div class="d-flex align-center mb-4">
            <h3 class="text-h6">{{ t().sqlTerminal.title }}</h3>
            <v-spacer></v-spacer>
            <v-btn color="secondary" size="small" prepend-icon="mdi-plus" @click="showNewConnectionDialog = true">
              {{ t().sqlTerminal.new }}
            </v-btn>
          </div>

          <v-row v-if="savedConnections.length > 0">
            <v-col v-for="connection in savedConnections" :key="connection.id" cols="12" sm="6" md="4">
              <v-card
                :class="['connection-card', selectedConnection?.id === connection.id ? 'selected-connection' : '']"
                elevation="3" @click="selectConnection(connection)" hover>
                <div class="connection-card-header" :class="`bg-${getConnectionTypeColor(connection.type)}`">
                  <v-avatar color="white" size="42" variant="tonal" class="connection-avatar">
                    <v-icon size="small" color="secondary">{{ getConnectionTypeIcon(connection.type) }}</v-icon>
                  </v-avatar>
                  <div class="d-flex justify-space-between align-center w-100">
                    <h4 class="text-h6 text-white ml-2">{{ connection.name }}</h4>
                    <div>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn icon size="small" color="white" variant="text" v-bind="props"
                            @click.stop="editConnection(connection)">
                            <v-icon size="small">mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ t().sqlTerminal.edit }}</span>
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn icon size="small" color="white" variant="text" v-bind="props"
                            @click.stop="confirmDeleteConnection(connection)">
                            <v-icon size="small">mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>{{ t().sqlTerminal.delete }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </div>
                <v-card-text class="connection-card-content">
                  <div class="connection-details">
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-server</v-icon>
                      <span class="text-body-2">{{ connection.host }}:{{ connection.port }}</span>
                    </div>
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-database</v-icon>
                      <span class="text-body-2">{{ connection.database || connection.name }}</span>
                    </div>
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-account</v-icon>
                      <span class="text-body-2">{{ connection.username }}</span>
                    </div>
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <v-chip :color="selectedConnection?.id === connection.id ? 'success' : 'secondary'" size="small"
                      :variant="selectedConnection?.id === connection.id ? 'flat' : 'tonal'">
                      {{ selectedConnection?.id === connection.id ? t().sqlTerminal.connected : 'Disponible' }}
                    </v-chip>
                    <v-btn color="secondary" size="small" variant="tonal" @click.stop="selectConnection(connection)">
                      <v-icon start size="small">mdi-connection</v-icon>
                      {{ selectedConnection?.id === connection.id ? 'Reconnexion' : 'Connexion' }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-alert v-else type="info" variant="tonal" class="mt-3">
            {{ t().sqlTerminal.empty }}
          </v-alert>
        </div>
      </v-slide-x-transition>

      <v-card-text class="pa-0">
        <div v-if="!isConnected" class="connection-status pa-6 text-center">
          <v-icon size="64" color="grey-lighten-1" class="mb-3">mdi-database-off</v-icon>
          <h3 class="text-h6 mb-2">{{ t().sqlTerminal.notConnected }}</h3>
          <p class="text-body-2 mb-4">{{ t().sqlTerminal.connectPrompt }}</p>
          <v-btn color="secondary" prepend-icon="mdi-database-cog" @click="showConnections = true">
            {{ t().sqlTerminal.connect }}
          </v-btn>
        </div>
        <div v-else class="terminal-content">
          <div v-if="showDataTable" class="data-table-container">
            <div class="data-table-header">
              <button class="close-btn" @click="showDataTable = false">×</button>
            </div>
            <div class="data-table">
              <v-data-table :headers="dataTableHeaders" :items="dataTableItems" :items-per-page="10"
                class="elevation-1"></v-data-table>
            </div>
          </div>

          <div v-else class="terminal-layout">
            <div class="connection-info d-flex align-center px-4 py-2 bg-grey-darken-3">
              <v-avatar color="primary" size="32" variant="tonal" class="mr-2">
                <v-icon size="small">mdi-database</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2">{{ selectedConnection?.name }}</div>
                <div class="text-caption">{{ selectedConnection?.database }} @ {{ selectedConnection?.host }}</div>
              </div>
              <v-spacer></v-spacer>
              <v-chip color="success" size="small" class="px-2">
                <v-icon size="x-small" start>mdi-circle</v-icon>
                {{ t().sqlTerminal.connected }}
              </v-chip>
              <v-btn icon variant="text" size="small" @click="disconnect" class="ml-2">
                <v-icon>mdi-logout</v-icon>
              </v-btn>
            </div>

            <div class="terminal-output pa-4" ref="terminalOutput">
              <div v-for="(line, index) in terminalLines" :key="index" class="terminal-line">
                <pre :class="['line-content', line.type]">{{ line.content }}</pre>
              </div>
            </div>

            <div class="sql-input-container bg-grey-darken-3 pa-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
                <div class="flex-grow-1 font-weight-bold text-primary text-body-2">SQL Query</div>
                <v-spacer></v-spacer>
                <v-chip size="small" variant="outlined" color="secondary" class="mr-2">
                  <v-icon size="x-small" start>mdi-keyboard</v-icon>
                  Enter = Execute | Shift+Enter = New Line
                </v-chip>
                <v-btn icon variant="text" color="primary" @click="executeCommand" :loading="isExecuting"
                  :disabled="!sqlCommand || isExecuting" class="mr-1">
                  <v-icon>mdi-play</v-icon>
                  <v-tooltip activator="parent" location="top">Exécuter</v-tooltip>
                </v-btn>
                <v-btn variant="tonal" size="small" @click="showSaveQueryDialog = true" :disabled="!sqlCommand"
                  class="mr-1">
                  <v-icon start size="small">mdi-content-save</v-icon>
                  Save
                </v-btn>
                <v-menu location="top" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" color="primary" v-bind="props">
                      <v-icon>mdi-history</v-icon>
                      <v-tooltip activator="parent" location="top">History</v-tooltip>
                    </v-btn>
                  </template>
                  <v-card min-width="300" class="query-history-card">
                    <v-card-title class="d-flex align-center">
                      <span class="text-subtitle-1">Saved Queries</span>
                      <v-spacer></v-spacer>
                      <v-btn icon variant="text" size="small" @click="showSaveQueryDialog = true">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list density="compact" class="query-history-list">
                      <v-list-item v-for="(query, index) in savedQueries" :key="index" @click="loadSavedQuery(query)">
                        <v-list-item-title class="text-caption">{{ query.name }}</v-list-item-title>
                        <v-list-item-subtitle class="text-caption text-truncate">{{ query.query
                          }}</v-list-item-subtitle>
                      </v-list-item>
                      <v-list-item v-if="savedQueries.length === 0" class="text-center">
                        <v-list-item-title class="text-caption">No saved queries</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>
              <v-textarea v-model="sqlCommand" variant="outlined" placeholder="Entrez votre requête SQL ici..."
                auto-grow rows="4" @keydown="handleKeydown" hide-details class="sql-textarea" :disabled="isExecuting"
                bg-color="grey-darken-4" color="primary"></v-textarea>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showNewConnectionDialog" max-width="600px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-secondary text-white">
          <v-icon class="mr-2">mdi-database-cog</v-icon>
          {{ editingConnection ? t().sqlTerminal.edit : t().sqlTerminal.new }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-alert type="info" variant="tonal" class="pa-4 mb-4">
            Your safety is our priority. Your connection details are encrypted and stored securely.
          </v-alert>
          <v-responsive class="mx-auto" max-width="600px">
            <v-form ref="connectionForm" @submit.prevent="saveConnection">
              <v-row :no-gutters="$vuetify.display.xs" class="mt-2">
                <v-col cols="12">
                  <v-text-field v-model="newConnection.name" :label="t().sqlTerminal.form.name" variant="outlined"
                    class="mb-2" :rules="[v => !!v || t().sqlTerminal.validation.required]"
                    hint="This name will be used both as the display name and the database name"
                    persistent-hint></v-text-field>
                </v-col>
              </v-row>

              <v-row :no-gutters="$vuetify.display.xs">
                <v-col cols="12" sm="6">
                  <v-select v-model="newConnection.type" :items="connectionTypes" :label="t().sqlTerminal.form.type"
                    variant="outlined" class="mb-2"
                    :rules="[v => !!v || t().sqlTerminal.validation.required]"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="newConnection.port" :label="t().sqlTerminal.form.port" type="number"
                    variant="outlined" class="mb-2"
                    :rules="[v => !!v || t().sqlTerminal.validation.required]"></v-text-field>
                </v-col>
              </v-row>

              <v-text-field v-model="newConnection.host" :label="t().sqlTerminal.form.host" variant="outlined"
                class="mb-2" :rules="[v => !!v || t().sqlTerminal.validation.required]"></v-text-field>

              <v-text-field v-model="newConnection.username" :label="t().sqlTerminal.form.username" variant="outlined"
                class="mb-2" :rules="[v => !!v || t().sqlTerminal.validation.required]"></v-text-field>

              <v-text-field v-model="newConnection.password" :label="t().sqlTerminal.form.password" variant="outlined"
                type="password" class="mb-2" :rules="[v => !!v || t().sqlTerminal.validation.required]"></v-text-field>
            </v-form>
          </v-responsive>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" color="error" @click="showNewConnectionDialog = false">
            {{ t().actions.cancel }}
          </v-btn>
          <v-btn color="secondary" @click="saveConnection" :loading="isSaving">
            {{ t().actions.save }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="bg-error text-white">
          {{ t().sqlTerminal.confirmDelete }}
        </v-card-title>
        <v-card-text class="pa-4 pt-5">
          {{ t().sqlTerminal.deleteWarning.replace('{name}', connectionToDelete?.name || '') }}
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="showDeleteDialog = false">
            {{ t().actions.cancel }}
          </v-btn>
          <v-btn color="error" @click="deleteConnection" :loading="isDeleting">
            {{ t().actions.delete }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showSaveQueryDialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-content-save</v-icon>
          Save Query
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="saveQueryForm" @submit.prevent="saveQuery">
            <v-text-field v-model="newQueryName" label="Query Name" variant="outlined" class="mb-2"
              :rules="[v => !!v || 'The name is required']"></v-text-field>
            <v-textarea v-model="newQueryDescription" label="Description (optional)" variant="outlined"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="showSaveQueryDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="saveQuery" :loading="isSavingQuery">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useTranslations } from '../../languages';
import { DatabaseConnection, TerminalLine } from '../../utils/database/types';

const t = useTranslations('databaseDesigner');

const emit = defineEmits<{
  (e: 'connection-change', connection: DatabaseConnection | null): void
}>();

const props = defineProps<{
  initialConnection?: DatabaseConnection | null
}>();

const showConnections = ref(false);
const showNewConnectionDialog = ref(false);
const showDeleteDialog = ref(false);
const showSaveQueryDialog = ref(false);
const terminalOutput = ref<HTMLElement | null>(null);
const connectionForm = ref<any>(null);

const savedConnections = ref<DatabaseConnection[]>([]);
const selectedConnection = ref<DatabaseConnection | null>(null);
const isConnected = ref(false);
const isExecuting = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const isSavingQuery = ref(false);
const editingConnection = ref(false);
const connectionToDelete = ref<DatabaseConnection | null>(null);
const currentDatabase = ref('');

const sqlCommand = ref('');
const terminalLines = ref<TerminalLine[]>([
  { content: 'SQL Terminal ready. Please connect to a database.', type: 'info' }
]);

const connectionTypes = [
  { title: 'MySQL', value: 'mysql' },
  { title: 'PostgreSQL', value: 'postgres' },
  { title: 'SQLite', value: 'sqlite' },
  { title: 'SQL Server', value: 'mssql' }
];

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

const savedQueries = ref<{ id: string; name: string; query: string; description?: string }[]>([]);
const newQueryName = ref('');
const newQueryDescription = ref('');
const saveQueryForm = ref<any>(null);

const showDataTable = ref(false);
const dataTableTitle = ref('');
const dataTableHeaders = ref<{ title: string; key: string; align?: "start" | "end" | "center" }[]>([]);
const dataTableItems = ref<any[]>([]);

const isExporting = ref(false);

watch(() => props.initialConnection, (newConnection) => {
  if (newConnection && !isConnected.value) {
    const connection = savedConnections.value.find(c => c.id === newConnection.id);
    if (connection) {
      selectConnection(connection);
    }
  }
}, { immediate: true });

const toggleConnectionPanel = () => {
  showConnections.value = !showConnections.value;
};

const selectConnection = async (connection: DatabaseConnection) => {
  try {
    isConnected.value = false;
    selectedConnection.value = connection;

    if (isConnected.value && selectedConnection.value?.id === connection.id) {
      showConnections.value = false;
      return;
    }

    addTerminalLine(`Connecting to ${connection.name}...`, 'info');

    const response = await axios.post('/api/database/connect', {
      connectionId: connection.id
    });

    if (response.data.success) {
      isConnected.value = true;
      showConnections.value = false;
      currentDatabase.value = connection.database_name || connection.database;

      addTerminalLine(`Connected to database '${connection.database_name || connection.database}' on ${connection.host}`, 'info');
      addTerminalLine(`Type 'help' for available commands or enter your SQL query.`, 'info');

      emit('connection-change', connection);
    } else {
      addTerminalLine(`Connection error: ${response.data.message || 'Failed to connect'}`, 'error');
    }
  } catch (error: any) {
    addTerminalLine(`Connection error: ${error.message || 'Unknown error'}`, 'error');
  }
};

const disconnect = async () => {
  try {
    if (selectedConnection.value) {
      await axios.post('/api/database/disconnect', {
        connectionId: selectedConnection.value.id
      });
    }
  } catch (error) {
    console.error('Error disconnecting:', error);
  } finally {
    isConnected.value = false;
    selectedConnection.value = null;
    currentDatabase.value = '';
    addTerminalLine('Disconnected from database', 'info');

    emit('connection-change', null);
  }
};

const addTerminalLine = (content: string, type: 'command' | 'result' | 'error' | 'info') => {
  terminalLines.value.push({ content, type });
  nextTick(() => {
    if (terminalOutput.value) {
      terminalOutput.value.scrollTop = terminalOutput.value.scrollHeight;
    }
  });
};

const executeCommand = async () => {
  if (!sqlCommand.value || !isConnected.value) return;

  const command = sqlCommand.value.trim();
  addTerminalLine(command, 'command');

  isExecuting.value = true;

  try {
    if (command.toLowerCase() === 'help') {
      displayHelp();
    } else if (command.toLowerCase() === 'clear') {
      terminalLines.value = [];
    } else if (command.toLowerCase().startsWith('use ')) {
      const dbName = command.substring(4).trim();
      await handleUseDatabase(dbName);
    } else if (command.toLowerCase() === 'show databases') {
      await handleShowDatabases();
    } else if (command.toLowerCase() === 'show tables') {
      await handleShowTables();
    } else {
      await executeComplexQuery(command);
    }
  } catch (error: any) {
    addTerminalLine(`Error executing query: ${error.message}`, 'error');
  } finally {
    sqlCommand.value = '';
    isExecuting.value = false;
  }
};

const handleUseDatabase = async (dbName: string) => {
  if (!selectedConnection.value) return;

  try {
    const response = await axios.post('/api/database/use-database', {
      connectionId: selectedConnection.value.id,
      database: dbName
    });

    if (response.data.success) {
      currentDatabase.value = dbName;
      addTerminalLine(`Database changed to ${dbName}`, 'result');
    } else {
      addTerminalLine(`Failed to change database: ${response.data.message}`, 'error');
    }
  } catch (error: any) {
    addTerminalLine(`Error changing database: ${error.message}`, 'error');
  }
};

const handleShowDatabases = async () => {
  if (!selectedConnection.value) return;

  try {
    const response = await axios.post('/api/database/query', {
      connectionId: selectedConnection.value.id,
      query: selectedConnection.value.type === 'mysql' ? 'SHOW DATABASES' :
        selectedConnection.value.type === 'postgres' ? 'SELECT datname FROM pg_database WHERE datistemplate = false' :
          selectedConnection.value.type === 'mssql' ? 'SELECT name FROM sys.databases' :
            'SELECT name FROM sqlite_master WHERE type="database"'
    });

    if (response.data.success && response.data.results) {
      let result = '';

      if (Array.isArray(response.data.results)) {
        if (selectedConnection.value.type === 'mysql') {
          result = 'Databases:\n-----------\n';
          response.data.results.forEach((row: any) => {
            result += `${row.Database || Object.values(row)[0]}\n`;
          });
        } else if (selectedConnection.value.type === 'postgres') {
          result = 'Databases:\n-----------\n';
          response.data.results.forEach((row: any) => {
            result += `${row.datname || Object.values(row)[0]}\n`;
          });
        } else if (selectedConnection.value.type === 'mssql') {
          result = 'Databases:\n-----------\n';
          response.data.results.forEach((row: any) => {
            result += `${row.name || Object.values(row)[0]}\n`;
          });
        } else {
          result = 'Databases:\n-----------\n';
          response.data.results.forEach((row: any) => {
            result += `${row.name || Object.values(row)[0]}\n`;
          });
        }
      } else {
        result = 'No databases found';
      }

      addTerminalLine(result, 'result');
    } else {
      addTerminalLine(`Failed to retrieve databases: ${response.data.message || 'Unknown error'}`, 'error');
    }
  } catch (error: any) {
    addTerminalLine(`Error retrieving databases: ${error.message}`, 'error');
  }
};

const handleShowTables = async () => {
  if (!selectedConnection.value) return;

  try {
    const query = selectedConnection.value.type === 'mysql' ? 'SHOW TABLES' :
      selectedConnection.value.type === 'postgres' ? 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'' :
        selectedConnection.value.type === 'mssql' ? 'SELECT table_name FROM information_schema.tables' :
          'SELECT name FROM sqlite_master WHERE type="table"';

    const response = await axios.post('/api/database/query', {
      connectionId: selectedConnection.value.id,
      query: query
    });

    if (response.data.success && response.data.results) {
      let result = '';

      if (Array.isArray(response.data.results)) {
        result = 'Tables:\n-----------\n';
        response.data.results.forEach((row: any) => {
          const tableName = selectedConnection.value?.type === 'mysql' ?
            Object.values(row)[0] :
            selectedConnection.value?.type === 'postgres' ?
              row.table_name :
              selectedConnection.value?.type === 'mssql' ?
                row.table_name :
                row.name;

          result += `${tableName}\n`;
        });
      } else {
        result = 'No tables found';
      }

      addTerminalLine(result, 'result');
    } else {
      addTerminalLine(`Failed to retrieve tables: ${response.data.message || 'Unknown error'}`, 'error');
    }
  } catch (error: any) {
    addTerminalLine(`Error retrieving tables: ${error.message}`, 'error');
  }
};

const executeComplexQuery = async (query: string) => {
  if (!selectedConnection.value) return;

  try {
    const response = await axios.post('/api/database/query', {
      connectionId: selectedConnection.value.id,
      query: query,
      options: {
        timeout: 30000,
        maxRows: 1000,
        allowAggregateFunctions: true
      }
    });

    if (response.data.success) {
      if (response.data.results && Array.isArray(response.data.results)) {
        const results = response.data.results;

        if (results.length > 10) {
          addTerminalLine(`Query returned ${results.length} rows. Displaying in table view.`, 'info');
          showTableView(results, `Results for: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`);
        } else {
          if (results.length > 0) {
            const columns = Object.keys(results[0]);

            const columnWidths = columns.map(col => {
              let maxWidth = col.length;
              for (const row of results) {
                const cellValue = String(row[col] !== null ? row[col] : 'NULL');
                maxWidth = Math.max(maxWidth, cellValue.length);
              }
              return maxWidth + 2;
            });

            let resultTable = columns.map((col, i) => col.padEnd(columnWidths[i])).join('');
            resultTable += '\n';

            resultTable += columns.map((_, i) => '-'.repeat(columnWidths[i])).join('');
            resultTable += '\n';

            for (const row of results) {
              resultTable += columns.map((col, i) => {
                const cellValue = row[col] !== null ? row[col] : 'NULL';
                return String(cellValue).padEnd(columnWidths[i]);
              }).join('');
              resultTable += '\n';
            }

            resultTable += `\n${results.length} rows returned (${response.data.executionTime || 0} ms)`;
            addTerminalLine(resultTable, 'result');

            if (results.length > 0) {
              addTerminalLine('', 'info');
              const tableViewBtn = document.createElement('button');
              tableViewBtn.className = 'table-view-btn';
              tableViewBtn.textContent = 'Afficher en vue tabulaire';
              tableViewBtn.onclick = () => showTableView(results, `Results for: ${query}`);

              setTimeout(() => {
                const lastLine = terminalOutput.value?.lastElementChild;
                if (lastLine) {
                  const btnContainer = document.createElement('div');
                  btnContainer.className = 'terminal-btn-container';
                  btnContainer.appendChild(tableViewBtn);
                  lastLine.appendChild(btnContainer);
                }
              }, 10);
            }
          } else {
            addTerminalLine('Query executed successfully. 0 rows returned.', 'result');
          }
        }
      } else if (response.data.affectedRows !== undefined) {
        addTerminalLine(`Query executed successfully. ${response.data.affectedRows} rows affected.`, 'result');
      } else {
        addTerminalLine('Query executed successfully.', 'result');
      }
    } else {
      addTerminalLine(`Error: ${response.data.message || 'Unknown error'}`, 'error');
    }
  } catch (error: any) {
    if (error.message && error.message.includes('Malformed communication packet')) {
      addTerminalLine('Error: The query contains complex operations that cannot be processed correctly. Try simplifying your query or using smaller result sets.', 'error');
    } else {
      addTerminalLine(`Error executing query: ${error.message}`, 'error');
    }
  }
};

const displayHelp = () => {
  addTerminalLine(`
Available commands:
  - SELECT - Query data from tables
  - INSERT - Add new records
  - UPDATE - Modify existing records
  - DELETE - Remove records
  - CREATE - Create new database objects
  - ALTER - Modify database objects
  - DROP - Delete database objects
  - SHOW DATABASES - List available databases
  - SHOW TABLES - List tables in current database
  - USE [database] - Switch to another database
  - CLEAR - Clear terminal output
  - HELP - Display this help message
`, 'info');
};

const saveConnection = async () => {
  const isValid = await connectionForm.value?.validate();
  if (!isValid?.valid) return;

  isSaving.value = true;

  try {
    const method = editingConnection.value ? 'put' : 'post';
    const response = await axios({
      method,
      url: '/api/database/connection',
      data: {
        id: editingConnection.value ? newConnection.value.id : undefined,
        name: newConnection.value.name,
        type: newConnection.value.type,
        host: newConnection.value.host,
        port: newConnection.value.port,
        database: newConnection.value.database,
        username: newConnection.value.username,
        password: newConnection.value.password
      }
    });

    if (response.data.success) {
      if (editingConnection.value) {
        const index = savedConnections.value.findIndex(c => c.id === newConnection.value.id);
        if (index !== -1) {
          savedConnections.value[index] = {
            ...newConnection.value,
            password: '********'
          };
        }
      } else {
        const newConn = {
          ...newConnection.value,
          id: response.data.connection.id,
          password: '********'
        };
        savedConnections.value.push(newConn);
      }

      resetConnectionForm();
      showNewConnectionDialog.value = false;
    } else {
      addTerminalLine(`Error saving connection: ${response.data.message || 'Unknown error'}`, 'error');
    }
  } catch (error: any) {
    console.error('Error saving connection:', error);
    addTerminalLine(`Error saving connection: ${error.message}`, 'error');
  } finally {
    isSaving.value = false;
  }
};

const editConnection = (connection: DatabaseConnection) => {
  editingConnection.value = true;
  newConnection.value = {
    ...connection,
    password: ''
  };
  showNewConnectionDialog.value = true;
};

const confirmDeleteConnection = (connection: DatabaseConnection) => {
  connectionToDelete.value = connection;
  showDeleteDialog.value = true;
};

const deleteConnection = async () => {
  if (!connectionToDelete.value) return;

  isDeleting.value = true;

  try {
    const response = await axios({
      method: 'delete',
      url: '/api/database/connection',
      data: {
        id: connectionToDelete.value.id
      }
    });

    if (response.data.success) {
      savedConnections.value = savedConnections.value.filter(c => c.id !== connectionToDelete.value?.id);

      if (selectedConnection.value?.id === connectionToDelete.value.id) {
        disconnect();
      }

      showDeleteDialog.value = false;
      connectionToDelete.value = null;
    } else {
      addTerminalLine(`Error deleting connection: ${response.data.message || 'Unknown error'}`, 'error');
    }
  } catch (error: any) {
    console.error('Error deleting connection:', error);
    addTerminalLine(`Error deleting connection: ${error.message}`, 'error');
  } finally {
    isDeleting.value = false;
  }
};

const resetConnectionForm = () => {
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
  editingConnection.value = false;
};

const loadConnections = async () => {
  try {
    const response = await axios.get('/api/database/connections');

    if (response.data.success && response.data.connections) {
      savedConnections.value = response.data.connections;
    }
  } catch (error) {
    console.error('Error loading connections:', error);
  }
};

const loadSavedQueries = async () => {
  try {
    const response = await axios.get('/api/database/saved-queries');
    if (response.data.success) {
      savedQueries.value = response.data.queries || [];
    }
  } catch (error) {
    console.error('Error loading saved queries:', error);
  }
};

const saveQuery = async () => {
  const isValid = await saveQueryForm.value?.validate();
  if (!isValid?.valid) return;

  isSavingQuery.value = true;

  try {
    const response = await axios.post('/api/database/saved-queries', {
      name: newQueryName.value,
      query: sqlCommand.value,
      description: newQueryDescription.value
    });

    if (response.data.success) {
      savedQueries.value.push({
        id: response.data.query.id,
        name: newQueryName.value,
        query: sqlCommand.value,
        description: newQueryDescription.value
      });
      showSaveQueryDialog.value = false;
      newQueryName.value = '';
      newQueryDescription.value = '';
    }
  } catch (error) {
    console.error('Error saving query:', error);
  } finally {
    isSavingQuery.value = false;
  }
};

const loadSavedQuery = (query: { id: string; name: string; query: string; description?: string }) => {
  sqlCommand.value = query.query;
};

const showTableView = (results: any[], title: string) => {
  if (!results || results.length === 0) return;

  const columns = Object.keys(results[0]);
  dataTableHeaders.value = columns.map(col => ({
    title: col,
    key: col,
    align: typeof results[0][col] === 'number' ? 'end' : 'start'
  }));

  dataTableItems.value = results;

  dataTableTitle.value = title || 'Query Results';

  showDataTable.value = true;
};

const exportDatabase = async () => {
  if (!selectedConnection.value) return;

  isExporting.value = true;
  addTerminalLine(`Starting database export for ${selectedConnection.value.name}...`, 'info');

  try {
    const response = await axios.post('/api/database/export', {
      connectionId: selectedConnection.value.id
    }, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    const dbName = selectedConnection.value.database || 'database';
    link.href = url;
    link.setAttribute('download', `${dbName}_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addTerminalLine('Database export completed successfully!', 'result');
  } catch (error: any) {
    addTerminalLine(`Error exporting database: ${error.message || 'Unknown error'}`, 'error');
    console.error('Export error:', error);
  } finally {
    isExporting.value = false;
  }
};

const getConnectionTypeColor = (type: string): string => {
  switch (type) {
    case 'mysql':
      return 'secondary';
    case 'postgres':
      return 'blue-darken-1';
    case 'sqlite':
      return 'indigo-darken-1';
    case 'mssql':
      return 'blue-grey-darken-1';
    default:
      return 'secondary';
  }
};

const getConnectionTypeIcon = (type: string): string => {
  switch (type) {
    case 'mysql':
      return 'mdi-database';
    case 'postgres':
      return 'mdi-elephant';
    case 'sqlite':
      return 'mdi-database-outline';
    case 'mssql':
      return 'mdi-microsoft';
    default:
      return 'mdi-database';
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && event.shiftKey) {
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey && !isExecuting.value && sqlCommand.value.trim()) {
    event.preventDefault();
    executeCommand();
  }
};

onMounted(() => {
  loadConnections();
  loadSavedQueries();
});
</script>

<style scoped>
.sql-terminal-card {
  border-radius: 8px;
  overflow: hidden;
  height: 650px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.connection-list {
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.connection-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.connection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.connection-card.selected-connection {
  border: 2px solid #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.connection-card-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  position: relative;
}

.connection-avatar {
  background-color: rgba(255, 255, 255, 0.8) !important;
  z-index: 1;
}

.connection-card-content {
  padding: 16px !important;
}

.connection-details {
  margin-bottom: 12px;
}

.connection-detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.data-table-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.data-table {
  flex-grow: 1;
  overflow: auto;
}

.terminal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.terminal-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #1e1e1e;
  color: #fff;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
  height: 200px;
  min-height: 150px;
  padding: 12px;
  border-radius: 0;
}

.sql-input-container {
  border-top: 1px solid #444;
  padding: 12px !important;
  flex-shrink: 0;
}

.sql-textarea {
  font-family: 'Consolas', 'Monaco', monospace !important;
  font-size: 14px !important;
  border-radius: 8px;
  margin-top: 8px;
}

:deep(.sql-textarea .v-field__input) {
  padding: 12px !important;
  min-height: 120px !important;
  color: #e0e0e0 !important;
  line-height: 1.5 !important;
}

:deep(.sql-textarea .v-field__outline) {
  color: #555 !important;
}

.terminal-line {
  margin-bottom: 10px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  border-radius: 4px;
  padding: 2px 4px;
}

.line-content.command {
  color: #64B5F6;
  font-weight: bold;
  border-left: 2px solid #64B5F6;
  padding-left: 8px;
}

.line-content.result {
  color: #A5D6A7;
  background-color: rgba(165, 214, 167, 0.05);
}

.line-content.error {
  color: #EF5350;
  background-color: rgba(239, 83, 80, 0.05);
  border-left: 2px solid #EF5350;
  padding-left: 8px;
}

.line-content.info {
  color: #E0E0E0;
}

.terminal-input-field {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  background-color: #2d2d2d;
  color: #ffffff;
}

.terminal-input {
  background-color: #2d2d2d !important;
  border-top: 1px solid #444;
  padding: 8px 12px !important;
}

.terminal-btn-container {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
}

.table-view-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.table-view-btn:hover {
  background-color: #45a049;
}

:deep(.v-field__input) {
  color: #ffffff !important;
}

:deep(.v-field__outline) {
  color: #444444 !important;
}

.data-table-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0 8px;
}

.close-btn:hover {
  color: #333;
}

.connection-status {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
  color: #ffffff;
}

.connection-info {
  background-color: #2d2d2d !important;
  color: #ffffff;
  border-bottom: 1px solid #444;
  padding: 8px 12px !important;
}
</style>