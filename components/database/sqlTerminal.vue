<template>
  <v-container class="sql-terminal" fluid>
    <v-card class="sql-terminal-card elevation-3">
      <v-card-title class="bg-secondary d-flex align-center">
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
        <v-btn icon @click="showNewConnectionDialog = true" color="white" variant="text" class="add-connection-btn">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{ t().sqlTerminal.new }}
          </v-tooltip>
        </v-btn>
      </v-card-title>

      <v-slide-y-transition>
        <div v-if="showExportProgress" class="pa-2">
          <v-progress-linear :model-value="exportProgress" color="secondary" height="20" striped>
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </div>
      </v-slide-y-transition>

      <v-card-text class="pa-0">
        <div v-if="!isConnected" class="connection-grid pa-6">
          <div class="connection-header mb-6">
            <h2 class="text-h4 font-weight-bold mb-2">Database connections</h2>
            <p class="text-subtitle-1 text-grey">Select a connection to start working</p>
          </div>

          <v-row>
            <v-col v-for="connection in savedConnections" :key="connection.id" cols="12" sm="6" md="4" lg="4">
              <v-card
                :class="['connection-card', selectedConnection?.id === connection.id ? 'selected-connection' : '']"
                elevation="3" @click="selectConnection(connection)" hover>
                <div class="connection-card-header" :class="`bg-${getConnectionTypeColor(connection.type)}`">
                  <div class="connection-type-indicator">
                    <v-icon size="large" color="white">{{ getConnectionTypeIcon(connection.type) }}</v-icon>
                  </div>
                  <div class="connection-title">
                    <h3 class="text-h6 text-white font-weight-bold">{{ connection.name }}</h3>
                    <span class="text-caption text-white">{{ connection.type.toUpperCase() }}</span>
                  </div>
                  <div class="connection-actions">
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
                <v-card-text class="connection-card-content">
                  <div class="connection-details">
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-server</v-icon>
                      <div class="detail-content">
                        <span class="text-caption text-grey">Server</span>
                        <span class="text-body-2">{{ connection.host }}:{{ connection.port }}</span>
                      </div>
                    </div>
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-database</v-icon>
                      <div class="detail-content">
                        <span class="text-caption text-grey">Database</span>
                        <span class="text-body-2">{{ connection.database || connection.name }}</span>
                      </div>
                    </div>
                    <div class="connection-detail-item">
                      <v-icon size="small" color="primary" class="mr-2">mdi-account</v-icon>
                      <div class="detail-content">
                        <span class="text-caption text-grey">Username</span>
                        <span class="text-body-2">{{ connection.username }}</span>
                      </div>
                    </div>
                  </div>
                  <v-divider class="my-3"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <v-chip :color="selectedConnection?.id === connection.id ? 'success' : 'secondary'" size="small"
                      :variant="selectedConnection?.id === connection.id ? 'flat' : 'tonal'" class="status-chip">
                      <v-icon size="x-small" start>{{ selectedConnection?.id === connection.id ? 'mdi-check-circle' :
                        'mdi-circle' }}</v-icon>
                      {{ selectedConnection?.id === connection.id ? t().sqlTerminal.connected : 'Available' }}
                    </v-chip>
                    <v-btn color="secondary" size="small" variant="tonal" @click.stop="selectConnection(connection)"
                      class="connect-btn">
                      <v-icon start size="small">mdi-connection</v-icon>
                      {{ selectedConnection?.id === connection.id ? 'Reconnect' : 'Connect' }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-alert v-if="savedConnections.length === 0" type="info" variant="tonal" class="mt-3">
            {{ t().sqlTerminal.empty }}
          </v-alert>
        </div>
        <div v-else class="terminal-content">
          <div class="terminal-layout">
            <div class="connection-info bg-grey-darken-4 d-flex align-center px-4 py-2">
              <v-avatar color="primary" size="32" variant="tonal" class="mr-2">
                <v-icon size="small">mdi-database</v-icon>
              </v-avatar>
              <div>
                <div class="text-subtitle-2">{{ selectedConnection?.name }}</div>
                <div class="text-caption">{{ selectedConnection?.host }}</div>
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

            <div class="sql-input-container bg-grey-darken-4 pa-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
                <div class="flex-grow-1 font-weight-bold text-primary text-body-2">SQL Query</div>
                <v-spacer></v-spacer>
                <v-chip size="small" variant="outlined" color="secondary" class="mr-2">
                  <v-icon size="x-small" start>mdi-keyboard</v-icon>
                  Ctrl+Enter = Execute
                </v-chip>
                <v-btn icon variant="text" color="primary" @click="executeCommand" :loading="isExecuting"
                  :disabled="!sqlCommand || isExecuting" class="mr-1">
                  <v-icon>mdi-play</v-icon>
                  <v-tooltip activator="parent" location="top">Execute</v-tooltip>
                </v-btn>
                <v-btn icon variant="text" size="small" color="secondary"
                  @click="showSaveQueryDialog = true; newQuery.query = sqlCommand; newQuery.name = generateQueryName(sqlCommand)">
                  <v-icon>mdi-content-save</v-icon>
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
                      <v-btn icon variant="text" color="secondary" size="small" @click="showSaveQueryDialog = true">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-list density="compact" class="query-history-list">
                      <v-list-item v-for="query in savedQueries" :key="query.id" :title="query.name"
                        :subtitle="query.description" class="mb-2">
                        <template v-slot:prepend>
                          <v-icon :icon="getQueryIcon(query.query_text)" color="primary" size="small"></v-icon>
                        </template>

                        <template v-slot:append>
                          <div class="d-flex align-center">
                            <v-btn icon variant="text" size="small" color="primary" @click="loadSavedQuery(query)"
                              class="mr-2">
                              <v-icon>mdi-play</v-icon>
                            </v-btn>
                            <v-btn icon variant="text" size="small" color="primary" @click="editSavedQuery(query)"
                              class="mr-2">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon variant="text" size="small" color="error" @click="confirmDeleteQuery(query)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>
            </div>
            <div class="codemirror-wrapper" @keydown.ctrl.enter="executeCommand">
              <Codemirror v-model="sqlCommand" :extensions="[
                sql({
                  upperCaseKeywords: true,
                  dialect: getSQLDialect(selectedConnection?.type)
                }),
                lineNumbers(),
                lintGutter(),
                linter(sqlLinter),
                autocompletion({
                  override: [sqlCompletions, customCompletions],
                  activateOnTyping: true,
                  defaultKeymap: true
                }),
                EditorView.theme({
                  '.cm-tooltip': {
                    backgroundColor: '#1e1e2f',
                    color: '#fff',
                    border: '1px solid #444',
                    fontSize: '13px',
                    borderRadius: '8px',
                    padding: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  '.cm-lintRange': {
                    backgroundImage: 'none',
                    borderBottom: '2px wavy #ff5370'
                  },
                  '.cm-lintRange-error': {
                    borderBottom: '2px wavy #ff5370'
                  },
                  '.cm-lintRange-warning': {
                    borderBottom: '2px wavy #ffb300'
                  }
                }),
                myTheme,
                syntaxHighlighting(getSQLHighlightStyle(selectedConnection?.type)),
                keymap.of([
                  {
                    key: 'Enter',
                    run: (view) => {
                      const line = view.state.doc.lineAt(view.state.selection.main.from);
                      const text = line.text.trim();
                      const upperText = text.toUpperCase();

                      if (text && !text.endsWith(';') &&
                        (upperText.startsWith('SELECT') ||
                          upperText.startsWith('INSERT') ||
                          upperText.startsWith('UPDATE') ||
                          upperText.startsWith('DELETE')) &&
                        !upperText.includes('(')) {
                        view.dispatch({
                          changes: {
                            from: line.from + line.length,
                            insert: ';'
                          }
                        });
                      }
                      return false;
                    }
                  }
                ])
              ]" :style="{
                height: '400px',
                fontSize: editorFontSize + 'px',
                fontFamily: editorFont,
                borderRadius: '8px',
                border: '1px solid #444',
                background: '#232323',
                color: '#e0e0e0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }" placeholder="Enter your SQL query here... (type 'help' for help and ctrl+enter to execute)" />

            </div>
          </div>
        </div>
        <div v-if="sqlError && hasIntentionalError" class="sql-error-container pa-4">
          <v-alert type="error" variant="tonal" class="mb-0">
            <template v-slot:prepend>
              <v-icon>mdi-alert-circle</v-icon>
            </template>
            <div class="d-flex align-center">
              <span class="text-subtitle-2 mr-2">SQL error:</span>
              <span>{{ sqlError.message }}</span>
            </div>
            <div v-if="sqlError.code" class="text-caption mt-1">
              Error code: {{ sqlError.code }}
            </div>
            <div v-if="sqlError.sqlState" class="text-caption">
              SQL state: {{ sqlError.sqlState }}
            </div>
          </v-alert>
        </div>
        <div v-else-if="isExecuting" class="sql-results-container has-results">
          <div class="d-flex align-center pa-2 bg-grey-darken-4">
            <v-icon size="small" color="primary" class="mr-2">mdi-loading mdi-spin</v-icon>
            <span class="text-caption">Executing query...</span>
          </div>
        </div>
        <div v-else-if="dataTableHeaders.length > 0 && dataTableItems.length > 0"
          class="sql-results-container has-results" tabindex="0" aria-label="SQL results table">
          <div class="d-flex align-center pa-2 bg-grey-darken-4">
            <v-icon size="small" color="primary" class="mr-2">mdi-table</v-icon>
            <span class="text-caption">{{queryResults.reduce((total, result) => total + result.items.length, 0)}} {{
              queryResults.reduce((total, result) => total + result.items.length, 0) > 1 ? 'rows' : 'row'}}
              returned</span>
            <v-divider vertical class="mx-4"></v-divider>
            <span class="text-caption text-grey">{{ queryResults[0].query }}</span>
          </div>
          <div class="query-results-grid" :class="{ 'single-query': queryResults.length === 1 }">
            <div v-for="(result, index) in queryResults" :key="index" class="query-result-section">
              <div v-if="queryResults.length > 1" class="d-flex align-center pa-2 bg-grey-darken-3">
                <span class="text-caption text-grey">{{ result.query }}</span>
              </div>
              <table class="terminal-table">
                <thead>
                  <tr>
                    <th v-for="header in result.headers" :key="header.key" scope="col">{{ header.title }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in result.items" :key="rowIndex">
                    <td v-for="header in result.headers" :key="header.key"
                      @click="showCellContent(row[header.key], header.title)" class="clickable-cell">
                      {{ typeof row[header.key] === 'object' ? JSON.stringify(row[header.key]) : row[header.key] }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <v-row :no-gutters="false" class="mt-2">
                <v-col cols="12">
                  <v-text-field v-model="newConnection.name" :label="t().sqlTerminal.form.name" variant="outlined"
                    class="mb-2" :rules="[v => !!v || t().sqlTerminal.validation.required]"
                    hint="This name will be used both as the display name and the database name"
                    persistent-hint></v-text-field>
                </v-col>
              </v-row>

              <v-row :no-gutters="false">
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
        <v-card-title class="bg-secondary text-white">
          <v-icon class="mr-2">mdi-content-save</v-icon>
          {{ newQuery.id ? 'Edit Query' : 'Save Query' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="saveQueryForm" @submit.prevent="saveQuery">
            <v-text-field v-model="newQuery.name" label="Query Name" variant="outlined" class="mb-2"
              :rules="[v => !!v || 'The name is required']"></v-text-field>
            <v-textarea v-model="newQuery.query" label="SQL Query" variant="outlined" rows="5" class="mb-2"
              :rules="[v => !!v || 'The query is required']"></v-textarea>
            <v-text-field v-model="newQuery.description" label="Description (optional)"
              variant="outlined"></v-text-field>
            <v-text-field v-model="newQuery.shortcut" label="Shortcut (optional)" variant="outlined"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="showSaveQueryDialog = false">
            Cancel
          </v-btn>
          <v-btn color="secondary" @click="saveQuery" :loading="isSavingQuery">
            {{ newQuery.id ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showJsonDialog" max-width="700px">
      <v-card>
        <v-card-title class="bg-primary text-white">{{ jsonDialogTitle }}</v-card-title>
        <v-card-text style="background: #232323;">
          <pre style="margin:0;"><code id="json-dialog-code" class="hljs json" v-html="jsonDialogContent"></code></pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showJsonDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showTooltip" max-width="80vw" max-height="80vh">
      <v-card class="tooltip-card">
        <v-card-title class="d-flex align-center bg-secondary text-white">
          <v-icon class="mr-2">mdi-code-tags</v-icon>
          {{ tooltipTitle }}
          <v-spacer></v-spacer>
          <v-icon @click="showTooltip = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <pre class="tooltip-content"><code class="language-json" ref="jsonCode">{{ tooltipContent }}</code></pre>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import { MySQL, PostgreSQL, sql } from '@codemirror/lang-sql';
// @ts-ignore
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { tags } from '@lezer/highlight';
import axios from 'axios';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github-dark.css';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
// @ts-ignore
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { linter, lintGutter } from '@codemirror/lint';
import { Codemirror } from 'vue-codemirror';
import { useTranslations } from '../../languages';
import { useShortcutsStore } from '../../stores/shortcutsStore';
import { useUserStore } from '../../stores/userStore';
import { SQL_FUNCTIONS, SQL_SNIPPETS, sqlCompletions, updateCurrentDbType, updateDatabaseTables } from '../../utils/database/command';
import { sqlLinter } from '../../utils/database/error';
import { DatabaseConnection } from '../../utils/database/types';

hljs.registerLanguage('json', json);

const t = useTranslations('databaseManagement');

const emit = defineEmits<{
  (e: 'connection-change', connection: DatabaseConnection | null): void;
  (e: 'query-results', data: { query: string, results: any[], columns: string[] }): void;
  (e: 'change-tab', tab: string): void;
}>();

const props = defineProps<{
  initialConnection?: DatabaseConnection | null
}>();

const showConnections = ref(false);
const showNewConnectionDialog = ref(false);
const showDeleteDialog = ref(false);
const showSaveQueryDialog = ref(false);
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
const customCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\w*/);
  if (!word || word.from == word.to) return null;
  return {
    from: word.from,
    options: [
      { label: 'INT', type: 'keyword', info: 'Integer number' },
      { label: 'TINYINT', type: 'keyword', info: 'Small integer' },
      { label: 'SMALLINT', type: 'keyword', info: 'Small integer' },
      { label: 'MEDIUMINT', type: 'keyword', info: 'Medium integer' },
      { label: 'BIGINT', type: 'keyword', info: 'Large integer' },
      { label: 'VARCHAR', type: 'keyword', info: 'Character string' },
      { label: 'TEXT', type: 'keyword', info: 'Long text' },
      { label: 'MEDIUMTEXT', type: 'keyword', info: 'Medium text' },
      { label: 'LONGTEXT', type: 'keyword', info: 'Long text' },
      { label: 'DATE', type: 'keyword', info: 'Date' },
      { label: 'DATETIME', type: 'keyword', info: 'Date and time' },
      { label: 'BOOLEAN', type: 'keyword', info: 'Boolean value' },
      { label: 'DECIMAL', type: 'keyword', info: 'Decimal number' },
      { label: 'FLOAT', type: 'keyword', info: 'Floating point number' },
      { label: 'JSON', type: 'keyword', info: 'JSON data' },
      { label: 'BLOB', type: 'keyword', info: 'Binary data' },
    ],
  };
};

const getSQLDialect = (connectionType) => {
  switch (connectionType?.toLowerCase()) {
    case 'postgres':
    case 'postgresql':
      return PostgreSQL;
    case 'mysql':
    default:
      return MySQL;
  }
};

const getSQLHighlightStyle = (dbType) => {
  return HighlightStyle.define([
    { tag: tags.keyword, color: '#7dd0ff', fontWeight: 'bold' },
    { tag: tags.string, color: '#f1fa8c' },
    { tag: tags.number, color: '#ffb300' },
    { tag: tags.operator, color: '#7dd0ff' },
    { tag: tags.punctuation, color: '#f8f8f2' },
    { tag: tags.bracket, color: '#f8f8f2' },
    { tag: tags.comment, color: '#6272a4', fontStyle: 'italic' },
    { tag: tags.function(tags.variableName), color: '#50fa7b' },
    { tag: tags.typeName, color: '#8be9fd' },
    { tag: tags.className, color: '#ffb86c' }
  ]);
};

const sqlCommand = ref('');

const connectionTypes = [
  { title: 'MySQL', value: 'mysql' },
  { title: 'PostgreSQL', value: 'postgres' }
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

const savedQueries = ref<{
  id: string;
  name: string;
  query_text: string;
  description: string;
  query_shortcut: string;
  connection_id: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}[]>([]);
const newQuery = ref<{ id?: string; name: string; query: string; description: string; shortcut: string }>({ name: '', query: '', description: '', shortcut: '' });
const saveQueryForm = ref<any>(null);

const userStore = useUserStore();
const dataTableHeaders = ref<{ title: string; key: string; align?: "start" | "end" | "center" }[]>([]);
const dataTableItems = ref<any[]>([]);
const queryResults = ref<Array<{
  query: string;
  headers: { title: string; key: string; align?: "start" | "end" | "center" }[];
  items: any[];
}>>([]);

const isExporting = ref(false);
const exportProgress = ref(0);
const showExportProgress = ref(false);
const results = ref<any[]>([]);
const columns = ref<string[]>([]);
const lastExecutedQuery = ref('');
const isAnalyzing = ref(false);
const analysisResults = ref({
  queryType: '',
  affectedTables: [] as string[],
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

const showJsonDialog = ref(false);
const jsonDialogContent = ref('');
const jsonDialogTitle = ref('JSON value');

const myTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e1e2f',
    color: '#e0e0e0',
    height: '100%',
    fontFamily: "'Fira Code', monospace"
  },
  '.cm-cursor': {
    borderLeft: '2px solid #e0e0e0'
  }
});

const shortcutsStore = useShortcutsStore();

const editorFont = ref(localStorage.getItem('editorFont') || 'Fira Code');
const editorFontSize = ref(Number(localStorage.getItem('editorFontSize')) || 15);
watch(editorFont, v => localStorage.setItem('editorFont', v));
watch(editorFontSize, v => localStorage.setItem('editorFontSize', String(v)));

const showTooltip = ref(false);
const tooltipContent = ref('');
const tooltipTitle = ref('');

const jsonCode = ref<HTMLElement | null>(null);

const sqlError = ref<{
  message: string;
  code?: string;
  sqlState?: string;
} | null>(null);

// Ajout d'une variable pour suivre si une erreur a été intentionnellement déclenchée
const hasIntentionalError = ref(false);

const queryCounter = ref(1);

const realTimeTableAnalysis = ref(localStorage.getItem('realTimeTableAnalysis') === 'true');
watch(realTimeTableAnalysis, v => localStorage.setItem('realTimeTableAnalysis', String(v)));

const tableStructure = ref<any>(null);
const showTableStructure = ref(false);

watch(() => props.initialConnection, (newConnection) => {
  if (newConnection && !isConnected.value) {
    const connection = savedConnections.value.find(c => c.id === newConnection.id);
    if (connection) {
      selectConnection(connection);
    }
  }
}, { immediate: true });


const selectConnection = async (connection: DatabaseConnection) => {
  try {
    isConnected.value = false;
    selectedConnection.value = connection;

    if (isConnected.value && selectedConnection.value?.id === connection.id) {
      showConnections.value = false;
      return;
    }

    const response = await axios.post('/api/database/connect',
      { connectionId: connection.id },
      {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      }
    );

    if (response.data.success) {
      isConnected.value = true;
      showConnections.value = false;
      currentDatabase.value = connection.database_name || connection.database;

      updateCurrentDbType(connection.type);
      await updateDatabaseTables(connection.id);

      emit('connection-change', connection);
    } else {
      console.error('Connection error:', response.data.message || 'Failed to connect');
    }
  } catch (error: any) {
    console.error('Connection error:', error.message || 'Unknown error');
  }
};

const disconnect = async () => {
  try {
    if (selectedConnection.value) {
      await axios.post('/api/database/disconnect', {
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        },
        connectionId: selectedConnection.value.id
      });
    }
  } catch (error) {
    console.error('Error disconnecting:', error);
  } finally {
    isConnected.value = false;
    selectedConnection.value = null;
    currentDatabase.value = '';

    emit('connection-change', null);
  }
};

const executeCommand = async () => {
  if (!sqlCommand.value.trim() || isExecuting.value) return;

  showTableStructure.value = false;
  isExecuting.value = true;
  lastExecutedQuery.value = sqlCommand.value;
  sqlError.value = null;
  hasIntentionalError.value = false;
  queryResults.value = [];

  try {
    const command = sqlCommand.value.toLowerCase().trim();

    if (command === 'help' || command === 'help -function' || command === 'help -data' || command === 'help -snippet') {
      displayHelp();
      isExecuting.value = false;
      return;
    }

    if (!isConnected.value) {
      console.error('Not connected to database');
      isExecuting.value = false;
      return;
    }

    // Séparer les requêtes par point-virgule
    const queries = sqlCommand.value.split(';').filter(q => q.trim());
    const results: Array<{
      query: string;
      headers: { title: string; key: string; align?: "start" | "end" | "center" }[];
      items: any[];
    }> = [];

    for (const query of queries) {
      if (!query.trim()) continue;

      if (query.toLowerCase().trim().startsWith('use ')) {
        const dbName = query.substring(4).trim();
        await handleUseDatabase(dbName);
      } else if (query.toLowerCase().trim() === 'show databases') {
        await handleShowDatabases();
      } else if (query.toLowerCase().trim() === 'show tables') {
        await handleShowTables();
      } else if (query.toLowerCase().trim().startsWith('show tables by space used')) {
        await handleShowTablesBySpace(query);
      } else if (query.toLowerCase().trim() === 'show relations') {
        await handleShowRelations();
      } else if (query.toLowerCase().trim() === 'show unused tables') {
        await handleShowUnusedTables();
      } else {
        await executeComplexQuery(query);
      }

      console.log(results);

      // Stocker les résultats de chaque requête
      results.push({
        query: query.trim(),
        headers: [...dataTableHeaders.value],
        items: [...dataTableItems.value]
      });
    }

    // Mettre à jour les résultats
    queryResults.value = results;

    // Afficher les résultats de toutes les requêtes
    if (results.length > 0) {
      dataTableHeaders.value = results[0].headers;
      dataTableItems.value = results[0].items;

      // Émettre les résultats pour chaque requête
      for (const result of results) {
        emit('query-results', {
          query: result.query,
          results: result.items,
          columns: result.headers.map(header => header.title)
        });
      }

      analyzeQuery(lastExecutedQuery.value);
    }

  } catch (error: any) {
    console.error('Query execution error:', error);
    hasIntentionalError.value = true;
    sqlError.value = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'exécution de la requête',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
  } finally {
    isExecuting.value = false;
  }
};

const handleUseDatabase = async (dbName: string) => {
  if (!selectedConnection.value) return;

  try {
    const response = await axios.post('/api/database/use-database', {
      connectionId: selectedConnection.value.id,
      database: dbName
    }, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success) {
      currentDatabase.value = dbName;
      dataTableHeaders.value = [{ title: 'Message', key: 'message' }];
      dataTableItems.value = [{ message: `Base de données '${dbName}' sélectionnée` }];
    } else {
      throw new Error(response.data.message || 'Échec du changement de base de données');
    }
  } catch (error: any) {
    sqlError.value = {
      message: error.message || 'Erreur lors du changement de base de données',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
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
    }, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success && response.data.results) {
      const results = response.data.results;
      const columnName = selectedConnection.value.type === 'mysql' ? 'Database' :
        selectedConnection.value.type === 'postgres' ? 'datname' :
          selectedConnection.value.type === 'mssql' ? 'name' : 'name';

      dataTableHeaders.value = [{ title: 'Base de données', key: columnName }];
      dataTableItems.value = results;
    } else {
      throw new Error(response.data.message || 'Échec de la récupération des bases de données');
    }
  } catch (error: any) {
    sqlError.value = {
      message: error.message || 'Erreur lors de la récupération des bases de données',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
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
    }, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success && response.data.results) {
      const results = response.data.results;
      const columnName = selectedConnection.value.type === 'mysql' ? 'Tables_in_' + currentDatabase.value :
        selectedConnection.value.type === 'postgres' ? 'table_name' :
          selectedConnection.value.type === 'mssql' ? 'table_name' : 'name';

      dataTableHeaders.value = [{ title: 'Tables', key: columnName }];
      dataTableItems.value = results;
    } else {
      throw new Error(response.data.message || 'Échec de la récupération des tables');
    }
  } catch (error: any) {
    sqlError.value = {
      message: error.message || 'Erreur lors de la récupération des tables',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
  }
};

const executeComplexQuery = async (query: string) => {
  if (!selectedConnection.value) return;

  try {
    const response = await axios.post('/api/database/query', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      },
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
        const columns = Object.keys(results[0] || {});

        dataTableHeaders.value = columns.map(col => ({ title: col, key: col }));
        dataTableItems.value = results;

        if (results.length > 0) {
          nextTick(() => {
            const emittedColumns = dataTableHeaders.value.length > 0
              ? dataTableHeaders.value.map(header => header.title)
              : columns;
            const emittedResults = dataTableItems.value.length > 0
              ? dataTableItems.value
              : results;
            emit('query-results', {
              query: query,
              results: emittedResults,
              columns: emittedColumns
            });
          });
        } else {
          emit('query-results', {
            query: query,
            results: [],
            columns: columns
          });
        }
      } else if (response.data.affectedRows !== undefined) {
        const queryType = query.trim().toUpperCase().split(' ')[0];
        let message = '';

        switch (queryType) {
          case 'INSERT':
            message = `${response.data.affectedRows} row(s) inserted successfully`;
            break;
          case 'UPDATE':
            message = `${response.data.affectedRows} row(s) updated successfully`;
            break;
          case 'DELETE':
            message = `${response.data.affectedRows} row(s) deleted successfully`;
            break;
          default:
            message = `Operation successful: ${response.data.affectedRows} row(s) affected`;
        }

        dataTableHeaders.value = [{ title: 'Message', key: 'message' }];
        dataTableItems.value = [{ message }];

        emit('query-results', {
          query: query,
          results: [{ message }],
          columns: ['message']
        });
      } else {
        dataTableHeaders.value = [{ title: 'Message', key: 'message' }];
        dataTableItems.value = [{ message: 'Operation successful' }];

        emit('query-results', {
          query: query,
          results: [{ message: 'Operation successful' }],
          columns: ['message']
        });
      }
    } else {
      throw {
        response: {
          data: {
            message: response.data.message || 'Erreur lors de l\'exécution de la requête',
            code: response.data.error?.code || response.data.code,
            sqlState: response.data.error?.sqlState || response.data.sqlState
          }
        }
      };
    }
  } catch (error: any) {
    dataTableHeaders.value = [];
    dataTableItems.value = [];

    const errorDetails = error.response?.data || error;
    sqlError.value = {
      message: errorDetails.message || error.message || 'Une erreur est survenue lors de l\'exécution de la requête',
      code: errorDetails.error?.code || errorDetails.code || error.code,
      sqlState: errorDetails.error?.sqlState || errorDetails.sqlState || error.sqlState
    };

    throw error;
  }
};

const displayHelp = () => {
  const command = sqlCommand.value.toLowerCase().trim();

  if (command === 'help -function') {
    dataTableHeaders.value = [
      { title: 'Function', key: 'function' },
      { title: 'Description', key: 'description' }
    ];

    dataTableItems.value = SQL_FUNCTIONS.map(func => ({
      function: func.label,
      description: func.info
    })).sort((a, b) => a.function.localeCompare(b.function));
  } else if (command === 'help -data') {
    dataTableHeaders.value = [
      { title: 'Type', key: 'type' },
      { title: 'Description', key: 'description' }
    ];
    dataTableItems.value = [
      { type: 'INT', description: 'Integer' },
      { type: 'TINYINT', description: 'little integer (-128 to 127)' },
      { type: 'SMALLINT', description: 'small integer (-32768 to 32767)' },
      { type: 'MEDIUMINT', description: 'medium integer (-8388608 to 8388607)' },
      { type: 'BIGINT', description: 'big integer' },
      { type: 'FLOAT', description: 'Single precision floating point number' },
      { type: 'DOUBLE', description: 'Double precision floating point number' },
      { type: 'DECIMAL', description: 'Exact decimal number' },
      { type: 'VARCHAR', description: 'Variable length character string' },
      { type: 'TEXT', description: 'Variable length text' },
      { type: 'MEDIUMTEXT', description: 'Medium length text' },
      { type: 'LONGTEXT', description: 'Long length text' },
      { type: 'DATE', description: 'Date (YYYY-MM-DD)' },
      { type: 'DATETIME', description: 'Date and time (YYYY-MM-DD HH:MM:SS)' },
      { type: 'TIMESTAMP', description: 'Timestamp' },
      { type: 'BOOLEAN', description: 'Boolean value (TRUE/FALSE)' },
      { type: 'JSON', description: 'JSON format data' },
      { type: 'BLOB', description: 'Binary data' }
    ].sort((a, b) => a.type.localeCompare(b.type));
  } else if (command === 'help -snippet') {
    dataTableHeaders.value = [
      { title: 'Snippet', key: 'snippet' },
      { title: 'Description', key: 'description' },
      { title: 'Shortcut', key: 'shortcut' }
    ];

    dataTableItems.value = SQL_SNIPPETS
      .filter(snippet => !snippet.dbType || snippet.dbType.includes(selectedConnection.value?.type || ''))
      .map(snippet => ({
        snippet: snippet.label,
        description: snippet.description,
        shortcut: snippet.shortcut || '-'
      }))
      .sort((a, b) => a.snippet.localeCompare(b.snippet));
  } else {
    dataTableHeaders.value = [
      { title: 'Commands', key: 'command' },
      { title: 'Description', key: 'description' }
    ];

    dataTableItems.value = [
      { command: 'SELECT', description: 'Query data from tables' },
      { command: 'INSERT', description: 'Add new records' },
      { command: 'UPDATE', description: 'Modify existing records' },
      { command: 'DELETE', description: 'Delete records' },
      { command: 'CREATE', description: 'Create new database objects' },
      { command: 'ALTER', description: 'Modify database objects' },
      { command: 'DROP', description: 'Delete database objects' },
      { command: 'SHOW DATABASES', description: 'List available databases' },
      { command: 'SHOW TABLES', description: 'List tables in current database' },
      { command: 'SHOW TABLES BY SPACE USED', description: 'List tables by size' },
      { command: 'SHOW RELATIONS', description: 'Show relationships between tables' },
      { command: 'USE [database]', description: 'Switch database' },
      { command: 'CLEAR', description: 'Clear terminal output' },
      { command: 'HELP', description: 'Show this help message' },
      { command: 'HELP -FUNCTION', description: 'Show list of available SQL functions' },
      { command: 'HELP -DATA', description: 'Show list of SQL data types' },
      { command: 'HELP -SNIPPET', description: 'Show list of available SQL snippets' }
    ].sort((a, b) => a.command.localeCompare(b.command));
  }
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
        username: newConnection.value.username,
        password: newConnection.value.password,
        userId: userStore.user?.id || userStore.user?.userId
      },
      headers: {
        'Authorization': `Bearer ${userStore.token}`
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
      console.error('Error saving connection:', response.data.message || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Error saving connection:', error);
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
      },
      headers: {
        'Authorization': `Bearer ${userStore.token}`
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
      console.error('Error deleting connection:', response.data.message || 'Unknown error');
    }
  } catch (error: any) {
    console.error('Error deleting connection:', error);
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
    const response = await axios.get('/api/database/connections', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success && response.data.connections) {
      savedConnections.value = response.data.connections;
    }
  } catch (error) {
    console.error('Error loading connections:', error);
  }
};

const loadSavedQueries = async () => {
  try {
    const response = await axios.get('/api/database/saved-queries', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });
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
    const method = newQuery.value.id ? 'PUT' : 'POST';
    const url = newQuery.value.id
      ? `/api/database/saved-queries?id=${newQuery.value.id}`
      : '/api/database/saved-queries';

    const queryData = {
      id: newQuery.value.id,
      name: newQuery.value.name,
      query: newQuery.value.query,
      description: newQuery.value.description,
      shortcut: newQuery.value.shortcut,
      connection_id: selectedConnection.value?.id || null,
      user_id: userStore.user?.id || userStore.user?.userId
    };

    const response = await fetch(url, {
      method,
      body: JSON.stringify(queryData),
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (newQuery.value.id) {
        const index = savedQueries.value.findIndex(q => q.id === newQuery.value.id);
        if (index !== -1) {
          savedQueries.value[index] = data.query;
        }
      } else {
        savedQueries.value.push(data.query);
      }
      showSaveQueryDialog.value = false;
      newQuery.value = { name: '', query: '', description: '', shortcut: '' };
    }
  } catch (error) {
    console.error('Error saving query:', error);
    if (error.response?.data?.message) {
      console.error('Server error message:', error.response.data.message);
    }
  } finally {
    isSavingQuery.value = false;
  }
};

const loadSavedQuery = (query: any) => {
  sqlCommand.value = query.query_text;
};

const exportDatabase = async () => {
  if (!selectedConnection.value) return;

  isExporting.value = true;
  showExportProgress.value = true;
  exportProgress.value = 0;
  console.log(`Exporting ${selectedConnection.value.name}...`);

  const connectionId = selectedConnection.value.id;

  try {
    await new Promise<void>((resolve, reject) => {
      const eventSource = new EventSource(`/api/database/export-progress?connectionId=${connectionId}`);

      let totalTables = 1;

      eventSource.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.status === 'start') {
          totalTables = msg.total;
          exportProgress.value = 0;
        } else if (msg.status === 'progress') {
          const percent = Math.floor((msg.current / totalTables) * 100);
          exportProgress.value = percent;
        } else if (msg.status === 'done') {
          exportProgress.value = 100;
          eventSource.close();
          resolve();
        } else if (msg.status === 'error') {
          console.error(`Error processing: ${msg.error}`);
        }
      };


      eventSource.onerror = (err) => {
        console.error('Error during export progress stream.');
        eventSource.close();
        reject(err);
      };
    });

    const response = await fetch('/api/database/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId }),
    });

    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`);

    const data = await response.json();

    const blobData = JSON.stringify(data, null, 2);
    const blob = new Blob([blobData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dbName = selectedConnection.value?.database_name || selectedConnection.value?.name || 'database';

    link.href = url;
    link.setAttribute('download', `${dbName}_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error: any) {
    console.error(`Export error: ${error.message}`);
  } finally {
    isExporting.value = false;
    setTimeout(() => {
      showExportProgress.value = false;
      exportProgress.value = 0;
    }, 1000);
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

const analyzeQuery = async (query) => {
  if (!query.trim()) return;

  isAnalyzing.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    analysisResults.value = {
      queryType: query.trim().toUpperCase().split(' ')[0],
      affectedTables: extractTablesFromQuery(query),
      tableDetails: [],
      warnings: [],
      indexSuggestions: [],
      optimizations: [],
      executionPlan: {
        totalCost: 100,
        steps: []
      },
      efficiency: Math.floor(Math.random() * 100),
      estimatedTime: Math.floor(Math.random() * 500)
    };

  } catch (error) {
    console.error('Error analyzing query:', error);
  } finally {
    isAnalyzing.value = false;
  }
};

const extractTablesFromQuery = (query: string) => {
  const tables = new Set<string>();
  const patterns = [
    /from\s+`?([a-zA-Z0-9_]+)`?/gi,
    /join\s+`?([a-zA-Z0-9_]+)`?/gi,
    /update\s+`?([a-zA-Z0-9_]+)`?/gi,
    /into\s+`?([a-zA-Z0-9_]+)`?/gi,
    /table\s+`?([a-zA-Z0-9_]+)`?/gi
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(query)) !== null) {
      tables.add(match[1]);
    }
  });

  return Array.from(tables);
};

const updateQuery = (query: string) => {
  sqlCommand.value = query;
};

function isShortcut(event: KeyboardEvent, shortcut: string | undefined) {
  if (!shortcut) return false;

  if (!shortcut.includes('+')) {
    return event.key.toLowerCase() === shortcut.toLowerCase();
  }

  const parts = shortcut.toLowerCase().split('+');
  const key = parts.pop();
  const ctrl = parts.includes('ctrl');
  const shift = parts.includes('shift');
  const alt = parts.includes('alt');

  return (
    event.key.toLowerCase() === key &&
    event.ctrlKey === ctrl &&
    event.shiftKey === shift &&
    event.altKey === alt
  );
}

const handleKeyDown = (event: KeyboardEvent) => {
  const shortcuts = shortcutsStore.shortcuts;

  // Vérifier les raccourcis des requêtes sauvegardées
  const currentText = sqlCommand.value;
  const matchingQuery = savedQueries.value.find(query =>
    query.query_shortcut &&
    (query.query_shortcut.includes('+') ?
      isShortcut(event, query.query_shortcut) :
      currentText.toLowerCase() === query.query_shortcut.toLowerCase())
  );

  if (matchingQuery) {
    event.preventDefault();
    sqlCommand.value = matchingQuery.query_text;
    return;
  }

  // Gestion des raccourcis directs
  if (isShortcut(event, shortcuts.run.value)) {
    event.preventDefault();
    showTableStructure.value = false;
    executeCommand();
  }

  if (isShortcut(event, shortcuts.save.value)) {
    event.preventDefault();
    showSaveQueryDialog.value = true;
  }

  if (isShortcut(event, shortcuts.clear.value)) {
    event.preventDefault();
    sqlCommand.value = '';
  }

  // Nouveaux raccourcis SQL
  if (isShortcut(event, 'Ctrl+Space')) {
    event.preventDefault();
    // Déclencher l'autocomplétion
    const editor = document.querySelector('.cm-editor');
    if (editor) {
      const keyboardEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        ctrlKey: true,
        bubbles: true
      });
      editor.dispatchEvent(keyboardEvent);
    }
  }

  if (isShortcut(event, 'Ctrl+Enter')) {
    event.preventDefault();
    executeCommand();
  }
};

const getCursorLine = () => {
  const editor = document.querySelector('.cm-editor');
  if (editor) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editor);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      const text = preCaretRange.toString();
      return text.split('\n').length - 1;
    }
  }
  return -1;
};


const showCellContent = (content: any, title: string) => {
  showTableStructure.value = false;
  tooltipContent.value = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
  tooltipTitle.value = title;
  showTooltip.value = true;
  nextTick(() => {
    if (jsonCode.value) {
      hljs.highlightElement(jsonCode.value);
    }
  });
};

const generateQueryName = (sql: string) => {
  const query = sql.toLowerCase().trim();
  let prefix = '';

  if (query.startsWith('select')) {
    const fromMatch = query.match(/from\s+(\w+)/i);
    const table = fromMatch ? fromMatch[1] : 'table';
    const whereMatch = query.match(/where\s+(.+?)(?:\s+group|\s+order|\s+limit|$)/i);
    const condition = whereMatch ? whereMatch[1].replace(/[^a-z0-9]/g, '_').slice(0, 20) : '';
    prefix = `select_${table}${condition ? '_' + condition : ''}`;
  } else if (query.startsWith('insert')) {
    const intoMatch = query.match(/into\s+(\w+)/i);
    const table = intoMatch ? intoMatch[1] : 'table';
    prefix = `insert_${table}`;
  } else if (query.startsWith('update')) {
    const tableMatch = query.match(/update\s+(\w+)/i);
    const table = tableMatch ? tableMatch[1] : 'table';
    prefix = `update_${table}`;
  } else if (query.startsWith('delete')) {
    const fromMatch = query.match(/from\s+(\w+)/i);
    const table = fromMatch ? fromMatch[1] : 'table';
    prefix = `delete_${table}`;
  } else if (query.startsWith('create')) {
    const typeMatch = query.match(/create\s+(table|view|index|database)\s+(\w+)/i);
    const type = typeMatch ? typeMatch[1] : 'object';
    const name = typeMatch ? typeMatch[2] : 'new';
    prefix = `create_${type}_${name}`;
  } else {
    prefix = 'custom_query';
  }

  const number = queryCounter.value.toString().padStart(4, '0');
  queryCounter.value++;
  return `${prefix}_${number}`;
};

const getQueryIcon = (query: string) => {
  if (!query) return 'mdi-database';
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.startsWith('select')) return 'mdi-database-search';
  if (lowerQuery.startsWith('insert')) return 'mdi-database-plus';
  if (lowerQuery.startsWith('update')) return 'mdi-database-edit';
  if (lowerQuery.startsWith('delete')) return 'mdi-database-remove';
  if (lowerQuery.startsWith('create')) return 'mdi-database-plus';
  return 'mdi-database';
};

const editSavedQuery = (query: any) => {
  newQuery.value = {
    id: query.id,
    name: query.name,
    query: query.query_text,
    description: query.description,
    shortcut: query.query_shortcut
  };
  showSaveQueryDialog.value = true;
};

const confirmDeleteQuery = async (query: any) => {
  if (confirm(`Really delete query "${query.name}" ?`)) {
    try {
      await fetch(`/api/database/saved-queries?id=${query.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userStore.token}`
        }
      });
      await loadSavedQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  }
};

const analyzeQueryForTables = async (query: string) => {
  if (!realTimeTableAnalysis.value || !isConnected.value || !selectedConnection.value) return;

  const tables = extractTablesFromQuery(query);
  if (tables.length === 0) {
    tableStructure.value = null;
    showTableStructure.value = false;
    return;
  }

  try {
    const response = await axios.post('/api/database/describe', {
      connectionId: selectedConnection.value.id,
      table: tables[0]
    }, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (response.data.success) {
      tableStructure.value = response.data.structure;
      showTableStructure.value = true;
    }
  } catch (error) {
    console.error('Error getting table structure:', error);
  }
};

watch(sqlCommand, (newValue) => {
  const customShortcuts = SQL_SNIPPETS.map(snippet => ({
    ...snippet,
    shortcut: localStorage.getItem(`sqlSnippetShortcut_${snippet.label}`) || snippet.shortcut
  }));

  const matchingSnippet = customShortcuts.find(snippet =>
    snippet.shortcut && newValue.toLowerCase() === snippet.shortcut.toLowerCase()
  );

  if (matchingSnippet) {
    sqlCommand.value = matchingSnippet.snippet;
    nextTick(() => {
      const event = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        ctrlKey: true,
        bubbles: true
      });
      document.querySelector('.cm-editor')?.dispatchEvent(event);
    });
  }

  if (realTimeTableAnalysis.value) {
    analyzeQueryForTables(newValue);
  }
});

const convertDbType = (type: string): string => {
  switch (type) {
    case 'mysql':
      return 'mysql';
    case 'postgres':
      return 'postgresql';
    case 'mssql':
      return 'mssql';
    case 'sqlite':
      return 'sqlite';
    default:
      return type;
  }
};

const handleShowTablesBySpace = async (command: string) => {
  try {
    if (!selectedConnection.value?.id) {
      throw new Error('Aucune connexion sélectionnée');
    }

    const orderBy = command.toUpperCase().includes('ASC') ? 'ASC' : 'DESC';
    const dbType = convertDbType(selectedConnection.value.type || '');


    const response = await fetch('/api/database/database-usage', {
      method: 'POST',
      body: JSON.stringify({
        connectionId: selectedConnection.value.id,
        orderBy,
        dbType
      }),
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      if (!data.headers || !data.results) {
        throw new Error('Format de réponse invalide: headers ou results manquants');
      }

      const formattedResults = data.results.map(row => ({
        table: row.Table,
        size_mb: parseFloat(row['Size (MB)']).toFixed(2),
        rows: row.Rows
      }));

      dataTableHeaders.value = data.headers;
      dataTableItems.value = formattedResults;
    } else {
      throw new Error(data.message || 'Échec de la récupération des tables par espace');
    }
  } catch (error: any) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      type: error.response?.data?.type
    });

    sqlError.value = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'affichage des tables par espace',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
  }
};

const handleShowRelations = async () => {
  try {
    if (!selectedConnection.value?.id) {
      throw new Error('Aucune connexion sélectionnée');
    }

    const dbType = convertDbType(selectedConnection.value.type || '');

    const response = await fetch('/api/database/database-relations', {
      method: 'POST',
      body: JSON.stringify({
        connectionId: selectedConnection.value.id,
        dbType
      }),
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      if (!data.headers || !data.results) {
        throw new Error('Format de réponse invalide: headers ou results manquants');
      }

      const formattedResults = data.results.map(row => ({
        table: row.Table,
        column: row.Column,
        references_table: row['References Table'],
        references_column: row['References Column'],
        constraint_name: row['Constraint Name']
      }));

      dataTableHeaders.value = data.headers;
      dataTableItems.value = formattedResults;
    } else {
      throw new Error(data.message || 'Échec de la récupération des relations');
    }
  } catch (error: any) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    sqlError.value = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'affichage des relations',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
  }
};

const executeQuery = (query: string) => {
  sqlCommand.value = query;
  executeCommand();
};

defineExpose({
  executeQuery
});

onMounted(() => {
  loadConnections();
  loadSavedQueries();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

async function handleShowUnusedTables() {
  if (!selectedConnection.value) {
    return;
  }

  try {
    const response = await fetch('/api/database/database-usage', {
      method: 'POST',
      body: JSON.stringify({
        connectionId: selectedConnection.value.id,
        action: 'unused-tables',
        dbType: selectedConnection.value.type
      }),
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      if (!data.headers || !data.results) {
        throw new Error('Format de réponse invalide: headers ou results manquants');
      }

      dataTableHeaders.value = data.headers;
      dataTableItems.value = data.results;
    } else {
      throw new Error(data.message || 'Échec de la récupération des tables non utilisées');
    }
  } catch (error: any) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    sqlError.value = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'affichage des tables non utilisées',
      code: error.response?.data?.code,
      sqlState: error.response?.data?.sqlState
    };
  }
}
</script>

<style scoped>
.sql-terminal-card {
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #1e1e2f;
}

.terminal-content,
.terminal-layout {
  height: auto;
  overflow: auto;
  transition: all 0.3s ease-in-out;
}

.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #1e1e1e;
  color: #fff;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
  height: 200px;
  min-height: 150px;
  padding: 12px;
}

.sql-input-container {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px !important;
  flex-shrink: 0;
  transition: all 0.3s ease;
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

.connection-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  background: #232323;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 200px;
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
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px !important;
  transition: all 0.3s ease;
}

.json-preview {
  color: #64B5F6;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  margin-right: 4px;
}

.json-plus {
  background: #64B5F6;
  color: #181818;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  padding: 0 6px;
  cursor: pointer;
  outline: none;
  margin-left: 2px;
  vertical-align: middle;
  transition: background 0.2s;
}

.json-plus:focus,
.json-plus:hover {
  outline: 2px solid #64B5F6;
  background: #90caf9;
}

.codemirror-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e2f;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 200px;
  transition: all 0.3s ease;
}

.codemirror-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.cm-gutters) {
  background-color: #1e1e2f;
  color: #6d6d6d;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 8px;
  transition: all 0.3s ease;
}

:deep(.cm-lineNumbers .cm-gutterElement) {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  padding: 0 10px;
  color: #6d6d6d;
  transition: all 0.3s ease;
}

:deep(.cm-activeLineGutter) {
  background-color: rgba(255, 179, 0, 0.05);
  color: #e0e0e0;
}

.sql-results-container {
  overflow-x: auto;
  overflow-y: auto;
  max-width: 100%;
  max-height: 320px;
  margin: 16px 0 0 0;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: transparent;
  transition: all 0.3s ease;
  position: relative;
  min-height: 100px;
}

.sql-results-container.has-results {
  background: #1e1e2f;
}

.terminal-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  min-width: 100%;
  table-layout: fixed;
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 13px;
  background: #1e1e2f;
  color: #e0e0e0;
  overflow: auto;
}

.terminal-table th,
.terminal-table td {
  border: 1px solid #333;
  padding: 7px 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  max-width: 320px;
  min-width: 100px;
}

.terminal-table th {
  background: linear-gradient(90deg, #232323 60%, #2a2a2a 100%);
  color: #ffe082;
  font-weight: bold;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #ffb300;
  position: sticky;
  top: 0;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.terminal-table tr:nth-child(even) {
  background: #20232a;
}

.terminal-table tr:nth-child(odd) {
  background: #181818;
}

.terminal-table tr:hover {
  background: #263238;
  transition: background 0.15s;
}

.terminal-table td {
  color: #e0e0e0;
  font-size: 13px;
  border: 1px solid #333;
  padding: 7px 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  max-width: 320px;
  min-width: 100px;
  position: relative;
  cursor: help;
}

.terminal-table td:hover::after {
  display: none;
}

.terminal-table td:first-child {
  color: #90caf9;
  font-weight: 500;
}

.terminal-table td:last-child {
  color: #ffd54f;
}

.terminal-table td:empty::after {
  content: 'NULL';
  color: #bdbdbd;
  font-style: italic;
}

.terminal-table td[data-type="number"],
.terminal-table td[data-type="integer"],
.terminal-table td[data-type="float"],
.terminal-table td[data-type="decimal"] {
  color: var(--v-secondary-base);
}

.sql-results-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.sql-results-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}

.sql-results-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sql-results-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-slide-y-transition-enter-from,
.v-slide-y-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.v-slide-x-transition-enter-active,
.v-slide-x-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-slide-x-transition-enter-from,
.v-slide-x-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.tooltip-card {
  background: #1e1e2f;
  color: #e0e0e0;
}

.tooltip-content {
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
  overflow-x: auto;
  max-height: 70vh;
  padding: 16px;
  margin: 0;
  background: #1e1e2f;
  color: #e0e0e0;
  border-radius: 4px;
  tab-size: 2;
}

:deep(.hljs) {
  background: transparent;
  padding: 0;
}

:deep(.hljs-string) {
  color: #8ae234;
}

:deep(.hljs-number) {
  color: #29b6f6;
}

:deep(.hljs-literal) {
  color: #ff5370;
}

:deep(.hljs-keyword) {
  color: #7dd0ff;
}

:deep(.hljs-punctuation) {
  color: #e0e0e0;
}

.clickable-cell {
  cursor: pointer;
}

.clickable-cell:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sql-error-container {
  background: #1e1e2f;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.v-alert) {
  background: rgba(255, 82, 82, 0.1) !important;
  border: 1px solid rgba(255, 82, 82, 0.2);
}

:deep(.v-alert__content) {
  color: #ff5252;
}

:deep(.v-alert__prepend) {
  color: #ff5252;
}

.connection-grid {
  background: #1e1e2f;
  min-height: 400px;
}

.connection-header {
  text-align: center;
  color: #e0e0e0;
}

.connection-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  background: #232323;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 200px;
}

.connection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

.connection-card.selected-connection {
  border: 2px solid #4CAF50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.connection-card-header {
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  min-height: 100px;
  background: linear-gradient(45deg, var(--v-primary-base), var(--v-secondary-base));
}

.connection-type-indicator {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  margin-right: 16px;
}

.connection-title {
  flex-grow: 1;
}

.connection-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.connection-card:hover .connection-actions {
  opacity: 1;
}

.connection-card-content {
  padding: 20px !important;
  background: #232323;
}

.connection-details {
  margin-bottom: 16px;
}

.connection-detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  color: #e0e0e0;
}

.detail-content {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.status-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.connect-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
}

.add-connection-btn {
  transition: transform 0.3s ease;
}

.add-connection-btn:hover {
  transform: rotate(90deg);
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
}

.loading-icon {
  animation: pulse 2s infinite;
  color: rgb(var(--v-theme-secondary));
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

.query-result-section {
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e2f;
}

.query-result-section:last-child {
  margin-bottom: 0;
}

.query-result-section .terminal-table {
  margin: 0;
}

.query-result-section .d-flex {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.query-results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.query-results-grid.single-query {
  grid-template-columns: 1fr;
  padding: 0;
}

.query-result-section {
  background: #1e1e2f;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.query-result-section .terminal-table {
  width: 100%;
  margin: 0;
}

.query-result-section .d-flex {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-table th,
.terminal-table td {
  padding: 8px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.bg-grey-darken-4 {
  background: #1e1e2f !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.text-caption {
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  opacity: 0.8;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.mdi-spin {
  animation: spin 1s linear infinite;
}
</style>