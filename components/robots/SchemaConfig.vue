<template>
  <v-card variant="outlined" class="pa-4 rounded-lg">
    <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-code-json</v-icon>
      Schema.org Settings
    </div>

    <v-select v-model="schemaConfig.type"
      :items="['Organization', 'WebSite', 'LocalBusiness', 'Person', 'Product', 'Event', 'Article', 'Restaurant']"
      label="Schema Type" variant="outlined" density="comfortable" prepend-inner-icon="mdi-shape"
      class="mb-4"></v-select>

    <v-text-field v-model="schemaConfig.name" label="Name" variant="outlined" density="comfortable"
      prepend-inner-icon="mdi-rename" class="mb-4"></v-text-field>

    <v-textarea v-model="schemaConfig.description" label="Description" variant="outlined" density="comfortable"
      prepend-inner-icon="mdi-text" auto-grow rows="3" class="mb-4"></v-textarea>

    <v-text-field v-model="schemaConfig.url" label="URL" variant="outlined" density="comfortable"
      prepend-inner-icon="mdi-link" class="mb-4"></v-text-field>

    <!-- Propriétés communes -->
    <div class="d-flex align-center mb-2">
      <v-icon color="primary" class="mr-2">mdi-card-account-details</v-icon>
      <span class="text-subtitle-2 font-weight-medium">Common Properties</span>
    </div>

    <div class="d-flex flex-wrap">
      <v-text-field v-model="schemaConfig.image" label="Image URL" variant="outlined" density="comfortable"
        prepend-inner-icon="mdi-image" class="mb-4 mr-2" style="flex: 1;"></v-text-field>

      <v-text-field v-model="schemaConfig.telephone" label="Telephone" variant="outlined" density="comfortable"
        prepend-inner-icon="mdi-phone" class="mb-4" style="flex: 1;"></v-text-field>
    </div>

    <div class="d-flex flex-wrap">
      <v-text-field v-model="schemaConfig.email" label="Email" variant="outlined" density="comfortable"
        prepend-inner-icon="mdi-email" class="mb-4 mr-2" style="flex: 1;"></v-text-field>

      <v-text-field v-model="schemaConfig.address" label="Address" variant="outlined" density="comfortable"
        prepend-inner-icon="mdi-map-marker" class="mb-4" style="flex: 1;"></v-text-field>
    </div>

    <v-text-field v-model="schemaConfig.logo" label="Logo URL" variant="outlined" density="comfortable"
      prepend-inner-icon="mdi-image" class="mb-4"></v-text-field>

    <!-- Propriétés spécifiques par type -->
    <div v-if="typeProperties.length > 0" class="d-flex align-center mb-2">
      <v-icon :color="getTypeColor(schemaConfig.type)" class="mr-2">{{ getTypeIcon() }}</v-icon>
      <span class="text-subtitle-2 font-weight-medium">{{ schemaConfig.type }} Properties</span>
    </div>

    <div v-for="prop in typeProperties" :key="prop.key" class="mb-4">
      <v-text-field v-if="!prop.type || prop.type === 'text'" v-model="schemaConfig[prop.key]" :label="prop.label"
        variant="outlined" density="comfortable" :prepend-inner-icon="prop.icon">
      </v-text-field>

      <v-text-field v-else-if="prop.type === 'date'" v-model="schemaConfig[prop.key]" :label="prop.label"
        variant="outlined" density="comfortable" :prepend-inner-icon="prop.icon" type="date">
      </v-text-field>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SchemaConfig, typePropertiesConfig } from './types';

const props = defineProps<{
  schemaConfig: SchemaConfig
}>();

const typeProperties = computed(() => {
  return typePropertiesConfig[props.schemaConfig.type as keyof typeof typePropertiesConfig] || [];
});

const getTypeIcon = () => {
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
  return icons[props.schemaConfig.type] || 'mdi-shape';
};

const getTypeColor = (type: string) => {
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
</script>