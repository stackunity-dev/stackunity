<template>
  <div class="sql-editor-container">
    <div class="editor-toolbar d-flex align-center mb-2">
      <v-icon color="primary" class="mr-2">mdi-code-braces</v-icon>
      <div class="flex-grow-1 font-weight-bold text-primary text-body-2">SQL Query</div>
      <v-spacer></v-spacer>
      <v-chip size="small" variant="outlined" color="secondary" class="mr-2">
        <v-icon size="x-small" start>mdi-keyboard</v-icon>
        Enter = Execute | Shift+Enter = New Line
      </v-chip>
      <v-btn icon variant="text" color="primary" @click="executeQuery" :loading="isExecuting"
        :disabled="!modelValue || isExecuting" class="mr-1">
        <v-icon>mdi-play</v-icon>
        <v-tooltip activator="parent" location="top">Execute</v-tooltip>
      </v-btn>
      <v-btn variant="tonal" size="small" @click="$emit('save')" :disabled="!modelValue" class="mr-1">
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
            <v-btn icon variant="text" size="small" @click="$emit('save')">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-list density="compact" class="query-history-list">
            <v-list-item v-for="(query, index) in savedQueries" :key="index" @click="loadQuery(query)">
              <v-list-item-title class="text-caption">{{ query.name }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-truncate">{{ query.query }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="savedQueries.length === 0" class="text-center">
              <v-list-item-title class="text-caption">No saved queries</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <v-textarea v-model="internalValue" variant="outlined" placeholder="Enter your SQL query here..." auto-grow rows="4"
      @keydown="handleKeydown" hide-details class="sql-textarea" :disabled="isExecuting" bg-color="grey-darken-4"
      color="primary"></v-textarea>

    <div v-if="isPremium" class="premium-features mt-3">
      <v-expansion-panels variant="accordion">
        <v-expansion-panel title="Query Suggestions" class="mb-2">
          <template v-slot:title>
            <div class="d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-lightbulb</v-icon>
              <span>Query Suggestions</span>
            </div>
          </template>
          <v-expansion-panel-text>
            <div class="suggestion-item" v-for="(suggestion, i) in querySuggestions" :key="i">
              <div class="d-flex align-center mb-2">
                <v-icon color="warning" size="small" class="mr-2">mdi-lightbulb-outline</v-icon>
                <span class="font-weight-medium">{{ suggestion.title }}</span>
              </div>
              <p class="text-body-2 mb-2">{{ suggestion.description }}</p>
              <v-btn size="small" variant="tonal" color="warning" @click="applySuggestion(suggestion)">
                Apply Suggestion
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel title="Query Templates">
          <template v-slot:title>
            <div class="d-flex align-center">
              <v-icon color="info" class="mr-2">mdi-file-document-outline</v-icon>
              <span>Query Templates</span>
            </div>
          </template>
          <v-expansion-panel-text>
            <v-chip-group>
              <v-chip v-for="(template, i) in queryTemplates" :key="i" @click="applyTemplate(template)">
                {{ template.name }}
              </v-chip>
            </v-chip-group>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  isExecuting: boolean;
  isPremium?: boolean;
  savedQueries: { id: string; name: string; query: string; description?: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'execute'): void;
  (e: 'save'): void;
}>();

const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && event.shiftKey) {
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey && !props.isExecuting && internalValue.value.trim()) {
    event.preventDefault();
    executeQuery();
  }
};

const executeQuery = () => {
  emit('execute');
};

const loadQuery = (query: { id: string; name: string; query: string; description?: string }) => {
  internalValue.value = query.query;
};

const querySuggestions = ref([
  {
    title: 'Add Index for Better Performance',
    description: 'Adding an index on the "customer_id" column could improve query performance by up to 70%',
    sql: 'CREATE INDEX idx_customer_id ON orders(customer_id);'
  },
  {
    title: 'Optimize JOIN Operation',
    description: 'Consider using an INNER JOIN instead of a LEFT JOIN for better performance',
    sql: 'SELECT p.name, c.category_name FROM products p INNER JOIN categories c ON p.category_id = c.id'
  }
]);

const queryTemplates = ref([
  {
    name: 'List Tables',
    sql: 'SHOW TABLES;'
  },
  {
    name: 'Table Structure',
    sql: 'DESCRIBE table_name;'
  },
  {
    name: 'Basic SELECT',
    sql: 'SELECT * FROM table_name LIMIT 10;'
  },
  {
    name: 'JOIN Example',
    sql: 'SELECT a.*, b.* FROM table_a a JOIN table_b b ON a.id = b.a_id;'
  }
]);

const applySuggestion = (suggestion: { title: string; description: string; sql: string }) => {
  internalValue.value = suggestion.sql;
};

const applyTemplate = (template: { name: string; sql: string }) => {
  internalValue.value = template.sql;
};
</script>

<style scoped>
.sql-editor-container {
  width: 100%;
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

.premium-features {
  border-top: 1px solid #444;
  padding-top: 12px;
}

.suggestion-item {
  margin-bottom: 16px;
  padding: 12px;
  background-color: rgba(255, 193, 7, 0.05);
  border-left: 3px solid #FFC107;
  border-radius: 4px;
}
</style>