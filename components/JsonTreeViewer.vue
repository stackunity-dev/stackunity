<template>
  <div class="json-tree">
    <div v-if="typeof data === 'object' && data !== null" class="tree-container">
      <div v-for="(value, key) in data" :key="key" class="tree-node">
        <div class="node-header" @click="toggleNode(key)">
          <v-icon :icon="isExpanded(key) ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
          <span class="key">{{ key }}:</span>
        </div>
        <div v-if="isExpanded(key)" class="node-content">
          <json-tree-viewer v-if="typeof value === 'object' && value !== null" :data="value" />
          <span v-else class="value">{{ formatValue(value) }}</span>
        </div>
      </div>
    </div>
    <span v-else class="value">{{ formatValue(data) }}</span>
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
}

.node-header:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.key {
  color: #9cdcfe;
  margin-left: 0.5rem;
}

.value {
  color: #ce9178;
}

.node-content {
  margin-left: 1.5rem;
}
</style>