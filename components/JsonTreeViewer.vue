<template>
  <div class="json-tree" role="tree" aria-label="JSON tree viewer">
    <div v-if="typeof data === 'object' && data !== null" class="tree-container">
      <div v-for="(value, key) in data" :key="key" class="tree-node" role="treeitem" :aria-expanded="isExpanded(key)">
        <div class="node-header" @click="toggleNode(key)" @keydown="handleKeyDown($event, key)" :tabindex="0"
          :aria-label="`${key}: ${getNodeDescription(value)}`">
          <v-icon :icon="isExpanded(key) ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" aria-hidden="true" />
          <span class="key">{{ key }}:</span>
          <span v-if="typeof value !== 'object' || value === null" class="value-preview">
            {{ getValuePreview(value) }}
          </span>
        </div>
        <div v-if="isExpanded(key)" class="node-content" role="group" :aria-label="`Content of ${key}`">
          <json-tree-viewer v-if="typeof value === 'object' && value !== null" :data="value" />
          <span v-else class="value" role="treeitem" aria-selected="false">{{ formatValue(value) }}</span>
        </div>
      </div>
    </div>
    <span v-else class="value" role="treeitem" aria-selected="false">{{ formatValue(data) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  data: any;
}>();

const expandedNodes = ref(new Set<string>());

function isExpanded(key: string | number): boolean {
  return expandedNodes.value.has(String(key));
}

function toggleNode(key: string | number): void {
  const keyStr = String(key);
  if (expandedNodes.value.has(keyStr)) {
    expandedNodes.value.delete(keyStr);
  } else {
    expandedNodes.value.add(keyStr);
  }
}

function formatValue(value: any): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

function getValuePreview(value: any): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return value.length > 20 ? `"${value.substring(0, 20)}..."` : `"${value}"`;
  if (typeof value === 'object') return '';
  return String(value);
}

function getNodeDescription(value: any): string {
  if (value === null) return 'null value';
  if (typeof value === 'object') return Array.isArray(value) ? 'array' : 'object';
  return typeof value;
}

function handleKeyDown(event: KeyboardEvent, key: string | number): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      toggleNode(key);
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (!isExpanded(key)) {
        toggleNode(key);
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (isExpanded(key)) {
        toggleNode(key);
      }
      break;
  }
}
</script>

<style scoped>
.json-tree {
  font-family: monospace;
  padding: 1rem;
  background-color: #1e1e1e;
  color: #d4d4d4;
  border-radius: 4px;
  overflow-x: auto;
}

.tree-container {
  margin-left: 1rem;
}

.tree-node {
  margin: 0.25rem 0;
}

.node-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 0.25rem;
  border-radius: 4px;
  outline: none;
}

.node-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.node-header:focus {
  box-shadow: 0 0 0 2px #0090f1;
  background-color: rgba(255, 255, 255, 0.05);
}

.key {
  color: #9cdcfe;
  margin-left: 0.5rem;
}

.value {
  color: #ce9178;
}

.value-preview {
  color: #ce9178;
  margin-left: 0.5rem;
  opacity: 0.7;
}

.node-content {
  margin-left: 1.5rem;
}
</style>