<template>
  <div>
    <v-card class="rounded-lg mb-4">
      <v-tabs v-model="activeTab" color="primary" align-tabs="center">
        <v-tab value="code" class="py-3 px-4">
          <v-icon start>mdi-code-tags</v-icon>
          {{ t().codePreview.code }}
        </v-tab>
        <v-tab value="preview" class="py-3 px-4">
          <v-icon start>mdi-eye</v-icon>
          {{ t().codePreview.preview }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item value="code">
          <v-card-text class="pa-4 bg-grey-darken-4">
            <div class="code-preview pa-4">
              <v-card class="code-container bg-grey-darken-4 rounded" elevation="0">
                <pre class="pa-3" :class="{ 'robots-code': isRobots, 'schema-code': !isRobots }">{{ code }}</pre>
              </v-card>
            </div>
          </v-card-text>
        </v-window-item>

        <v-window-item value="preview">
          <v-card-text class="pa-4">
            <div v-if="isRobots">
              <div v-for="(line, index) in robotsLines" :key="`line-${index}`" class="py-1">
                <div :class="{ 'font-weight-bold': line.bold, 'text-grey': line.comment }">
                  {{ line.text }}
                </div>
              </div>
            </div>
            <div v-else>
              <v-card variant="outlined" class="pa-3 mb-3 rounded-lg" color="grey-darken-4">
                <div class="d-flex align-center mb-2">
                  <v-icon :color="getTypeColor(schemaType)" class="mr-2">{{ getTypeIcon(schemaType) }}</v-icon>
                  <span class="text-subtitle-2 font-weight-bold text-white">{{ schemaType }}</span>
                </div>
                <div v-html="schemaPreview"></div>
              </v-card>
            </div>
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-card-actions class="pa-4 pt-0 mt-4">
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-content-copy" variant="outlined" color="primary" class="mr-2" @click="copyToClipboard">
          {{ t().codePreview.copy }}
        </v-btn>
        <v-btn prepend-icon="mdi-download" color="primary" @click="downloadCode">
          {{ t().codePreview.download }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslations } from '../../languages';

const t = useTranslations('robots');

const props = defineProps<{
  code: string;
  isRobots: boolean;
  schemaType?: string;
  robotsLines?: {
    text: string;
    bold: boolean;
    comment: boolean;
  }[];
}>();

const activeTab = ref('code');

const robotsLines = computed(() => {
  if (props.isRobots && props.robotsLines) {
    return props.robotsLines;
  }

  if (props.isRobots && !props.robotsLines) {
    return props.code.split('\n').map(line => ({
      text: line,
      bold: line.startsWith('User-agent:') || line.startsWith('Allow:') || line.startsWith('Disallow:'),
      comment: line.startsWith('#')
    }));
  }

  return [];
});

const schemaPreview = computed(() => {
  if (!props.isRobots && props.code) {
    try {
      const schema = JSON.parse(props.code);
      return formatSchemaPreview(schema);
    } catch (e) {
      return `<span class="text-error">${t().codePreview.errorParsingJson}</span>`;
    }
  }
  return '';
});

const getTypeIcon = (type: string = '') => {
  const icons: Record<string, string> = {
    Organization: 'mdi-office-building',
    Person: 'mdi-account',
    Product: 'mdi-package-variant',
    Article: 'mdi-newspaper',
    LocalBusiness: 'mdi-store',
    WebSite: 'mdi-web',
    Event: 'mdi-calendar',
    Restaurant: 'mdi-food'
  };
  return icons[type] || 'mdi-shape';
};

const getTypeColor = (type: string = '') => {
  const colors: Record<string, string> = {
    Organization: 'blue',
    Person: 'purple',
    Product: 'green',
    Article: 'orange',
    LocalBusiness: 'cyan',
    WebSite: 'indigo',
    Event: 'red',
    Restaurant: 'amber'
  };
  return colors[type] || 'primary';
};

const formatSchemaPreview = (schema: any): string => {
  let html = '';

  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else if (value['@type']) {
        return `<span class="text-primary">${value['@type']}</span>: ${value.name || JSON.stringify(value)}`;
      } else {
        return JSON.stringify(value);
      }
    }
    return String(value);
  };

  for (const [key, value] of Object.entries(schema)) {
    if (key === '@context' || key === '@type') continue;
    html += `<div class="py-1 text-white"><span class="font-weight-medium">${key}:</span> ${formatValue(key, value)}</div>`;
  }

  return html;
};

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.code);
};

const downloadCode = () => {
  const filename = props.isRobots ? 'robots.txt' : 'schema.json';
  const blob = new Blob([props.code], { type: props.isRobots ? 'text/plain' : 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.code-preview {
  position: relative;
  font-family: monospace;
}

.code-container {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
}

pre {
  font-family: monospace;
  white-space: pre-wrap;
  margin: 0;
  font-size: 14px;
}

.robots-code {
  line-height: 1.5;
}

.schema-code {
  line-height: 1.5;
}
</style>