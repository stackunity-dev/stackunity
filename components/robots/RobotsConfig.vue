<template>
  <v-card variant="outlined" class="pa-4 mb-4 rounded-lg">
    <div class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-robot</v-icon>
      Robots.txt Settings
    </div>

    <v-select v-model="robotsConfig.userAgent" :items="['All robots', 'Google', 'Bing', 'Yahoo', 'Baidu', 'Custom']"
      label="User Agent" variant="outlined" density="comfortable" prepend-inner-icon="mdi-robot"
      class="mb-4"></v-select>

    <v-text-field v-if="robotsConfig.userAgent === 'Custom'" v-model="robotsConfig.customUserAgent"
      label="Custom User Agent" variant="outlined" density="comfortable" prepend-inner-icon="mdi-robot-outline"
      class="mb-4"></v-text-field>

    <v-text-field v-model="robotsConfig.crawlDelay" label="Crawl Delay (seconds)" variant="outlined"
      density="comfortable" type="number" prepend-inner-icon="mdi-timer" hint="Leave empty for no delay" persistent-hint
      class="mb-4"></v-text-field>

    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2 font-weight-medium">Disallowed Paths</span>
      <v-btn size="small" variant="text" color="primary" @click="addDisallowedPath">
        <v-icon>mdi-plus</v-icon> Add
      </v-btn>
    </div>

    <v-list class="bg-transparent pa-0 mb-4">
      <v-list-item v-for="(path, index) in robotsConfig.disallowedPaths" :key="`disallow-${index}`" class="px-0 py-1">
        <div class="d-flex align-center w-100">
          <v-text-field v-model="robotsConfig.disallowedPaths[index]" label="Path to disallow" variant="outlined"
            density="comfortable" hide-details class="mr-2" prepend-inner-icon="mdi-minus-circle"></v-text-field>
          <v-btn icon size="small" color="error" variant="text" @click="removeDisallowedPath(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-list-item>
    </v-list>

    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-subtitle-2 font-weight-medium">Allowed Paths</span>
      <v-btn size="small" variant="text" color="primary" @click="addAllowedPath">
        <v-icon>mdi-plus</v-icon> Add
      </v-btn>
    </div>

    <v-list class="bg-transparent pa-0 mb-4">
      <v-list-item v-for="(path, index) in robotsConfig.allowedPaths" :key="`allow-${index}`" class="px-0 py-1">
        <div class="d-flex align-center w-100">
          <v-text-field v-model="robotsConfig.allowedPaths[index]" label="Path to allow" variant="outlined"
            density="comfortable" hide-details class="mr-2" prepend-inner-icon="mdi-check-circle"></v-text-field>
          <v-btn icon size="small" color="error" variant="text" @click="removeAllowedPath(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-list-item>
    </v-list>

    <v-text-field v-model="robotsConfig.sitemapUrl" label="Sitemap URL" variant="outlined" density="comfortable"
      prepend-inner-icon="mdi-sitemap" placeholder="/sitemap.xml" class="mb-4"></v-text-field>
  </v-card>
</template>

<script setup lang="ts">
import { RobotsConfig } from './types';

const props = defineProps<{
  robotsConfig: RobotsConfig
}>();

const addDisallowedPath = () => {
  props.robotsConfig.disallowedPaths.push('/');
};

const removeDisallowedPath = (index: number) => {
  props.robotsConfig.disallowedPaths.splice(index, 1);
};

const addAllowedPath = () => {
  props.robotsConfig.allowedPaths.push('/');
};

const removeAllowedPath = (index: number) => {
  props.robotsConfig.allowedPaths.splice(index, 1);
};
</script>