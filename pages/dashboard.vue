<template>
  <v-app>

    <v-main class="ma-4">
      <v-row>
        <v-col v-for="(card, index) in dashboardCards" :key="index" cols="12" md="3">
          <v-card class="rounded-lg" elevation="2" height="100%">
            <v-card-text class="d-flex flex-column align-center justify-center">
              <v-icon size="48" :color="card.color" class="mb-2">{{ card.icon }}</v-icon>
              <div class="text-h4 font-weight-bold">{{ card.count }}</div>
              <div class="text-subtitle-1 text-medium-emphasis">{{ card.title }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="rounded-lg mt-6 mb-2" elevation="2">
        <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
          <v-icon color="white" class="mr-2">mdi-chart-line</v-icon>
          System Performance
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-1">CPU Usage</div>
                <div class="text-subtitle-2">{{ systemData.cpu.usage.toFixed(2) }}%</div>
              </div>
              <v-progress-linear :model-value="systemData.cpu.usage" color="primary" height="10" rounded
                class="mb-4"></v-progress-linear>

              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-1">Memory Usage</div>
                <div class="text-subtitle-2">{{ Math.round((systemData.memory.used / systemData.memory.total) * 100)
                }}%</div>
              </div>
              <v-progress-linear :model-value="(systemData.memory.used / systemData.memory.total) * 100" color="info"
                height="10" rounded class="mb-4"></v-progress-linear>

              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-subtitle-1">Disk Space</div>
                <div class="text-subtitle-2" v-if="systemData.disks && systemData.disks.length > 0">
                  {{ Math.round(systemData.disks[0].use) }}%
                </div>
              </div>
              <v-progress-linear v-if="systemData.disks && systemData.disks.length > 0"
                :model-value="systemData.disks[0].use" color="success" height="10" rounded
                class="mb-4"></v-progress-linear>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
              <v-icon color="white" class="mr-2">mdi-folder-multiple</v-icon>
              Recent Projects
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row v-if="recentSnippets.length > 0">
                <v-col v-for="(snippet, index) in recentSnippets" :key="snippet.id" cols="12" sm="6" md="4">
                  <v-card :to="`/snippets?id=${snippet.id}`" class="project-card" flat hover>
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center mb-2">
                        <v-avatar :color="getFrameworkColor(snippet.framework)" size="36" class="mr-3">
                          <v-icon color="white">{{ getFrameworkIcon(snippet.framework) }}</v-icon>
                        </v-avatar>
                        <div>
                          <div class="text-subtitle-1 font-weight-medium text-truncate">{{ snippet.title }}</div>
                          <div class="text-caption text-grey">{{ getSnippetDate(snippet) }}</div>
                        </div>
                      </div>
                      <p class="text-body-2 text-truncate-2 mb-2">{{ snippet.description || 'No description available'
                      }}</p>
                      <div class="d-flex align-center justify-space-between">
                        <v-chip size="x-small" :color="getFrameworkColor(snippet.framework)" class="mr-2">
                          {{ snippet.framework }}
                        </v-chip>
                        <v-btn size="small" variant="text" color="primary" :to="`/snippets?id=${snippet.id}`">
                          View
                          <v-icon end size="small">mdi-arrow-right</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              <v-alert v-else type="info" variant="tonal" class="mb-0">
                You don't have any recent projects. Start by creating a new snippet!
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
              <v-icon color="white" class="mr-2">mdi-tools</v-icon>
              Quick Tools
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col v-for="(tool, index) in quickTools" :key="index" cols="6" md="3">
                  <v-card :disabled="tool.disabled" :to="tool.link" class="rounded-lg tool-card" flat>
                    <v-card-text class="d-flex flex-column align-center justify-center pa-4">
                      <v-icon size="36" :color="tool.color" class="mb-2">{{ tool.icon }}</v-icon>
                      <div class="text-subtitle-1 text-center">{{ tool.title }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="rounded-lg" elevation="2">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg">
              <v-icon color="white" class="mr-2">mdi-lightbulb</v-icon>
              Tips and Tricks
            </v-card-title>
            <v-card-text class="pa-4">
              <v-carousel hide-delimiters height="200" show-arrows="hover" cycle interval="10000">
                <v-carousel-item v-for="(tip, i) in tips" :key="i">
                  <v-sheet height="100%" class="d-flex align-center justify-center">
                    <div class="text-center px-4">
                      <v-icon size="36" :color="tip.color" class="mb-2">{{ tip.icon }}</v-icon>
                      <h3 class="text-h6 mb-2">{{ tip.title }}</h3>
                      <p>{{ tip.description }}</p>
                    </div>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-main>

  </v-app>

</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import PremiumFeature from '~/components/PremiumFeature.vue';
import { useUserStore } from '~/stores/userStore';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Dashboard - DevUnity',
  meta: [
    { name: 'description', content: 'Dashboard for DevUnity' },
    { name: 'keywords', content: 'DevUnity, dashboard, tools, snippets, SQL, Studio, Sitemaps' },
    { name: 'author', content: 'DevUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Dashboard - DevUnity' },
    { name: 'og:description', content: 'Dashboard for DevUnity' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ]
})

const userStore = useUserStore();

const systemData = computed(() => userStore.systemData);

const recentSnippets = computed(() => {
  return [...userStore.personalSnippets]
    .sort((a, b) => new Date(b.date || b.snippet_date).getTime() - new Date(a.date || a.snippet_date).getTime())
    .slice(0, 5);
});

const dashboardCards = computed(() => [
  {
    icon: 'mdi-code-tags',
    color: 'primary',
    count: userStore.personalSnippets.length,
    title: 'Snippets'
  },
  {
    icon: 'mdi-database',
    color: 'info',
    count: userStore.sqlSchemas.length,
    title: 'SQL Schemas'
  },
  {
    icon: 'mdi-palette',
    color: 'purple',
    count: userStore.studioComponents.length,
    title: 'Studio'
  },
  {
    icon: 'mdi-sitemap',
    color: 'warning',
    count: 0,
    title: 'Sitemaps'
  }
]);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Date unknown';

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date error';
  }
};

const getFrameworkIcon = (framework: string) => {
  switch (framework.toLowerCase()) {
    case 'react':
      return 'mdi-react';
    case 'vue.js 3':
      return 'mdi-vuejs';
    case 'angular':
      return 'mdi-angular';
    case 'nest.js':
      return 'mdi-nodejs';
    case 'nuxt 3':
      return 'mdi-nuxt';
    default:
      return 'mdi-code-tags';
  }
};

const getFrameworkColor = (framework: string) => {
  switch (framework.toLowerCase()) {
    case 'react':
      return '#61DAFB';
    case 'vue.js 3':
      return '#42B883';
    case 'angular':
      return '#DD0031';
    case 'nest.js':
      return '#68A063';
    case 'nuxt 3':
      return '#00DC82';
    default:
      return '#9E9E9E';
  }
};

const quickTools = ref([
  {
    title: 'SEO Audit',
    icon: 'mdi-magnify',
    color: 'primary',
    link: '/seo-audit',
    disabled: !userStore.user.isPremium
  },
  {
    title: 'SQL Generator',
    icon: 'mdi-database',
    color: 'info',
    link: '/sql-generator',
    disabled: !userStore.user.isPremium
  },
  {
    title: 'Robots.txt & Schema.org',
    icon: 'mdi-robot',
    color: 'success',
    link: '/robots',
    disabled: !userStore.user.isPremium
  },
  {
    title: 'Accessibility',
    icon: 'mdi-access-point',
    color: 'warning',
    link: '/accessibility',
    disabled: false
  },
  {
    title: 'Responsive',
    icon: 'mdi-responsive',
    color: 'error',
    link: '/responsive',
    disabled: false
  },
  {
    title: 'Snippets',
    icon: 'mdi-code-tags',
    color: 'secondary',
    link: '/snippets',
    disabled: false
  },
  {
    title: 'Studio',
    icon: 'mdi-palette',
    color: 'purple',
    link: '/studio',
    disabled: false
  },
  {
    title: 'Sitemaps',
    icon: 'mdi-sitemap',
    color: 'grey',
    link: '/seo-audit',
    disabled: !userStore.user.isPremium
  },
]);

const tips = ref([
  {
    title: 'Optimize Your SEO',
    description: 'Use the SEO audit tool to analyze and improve your website\'s search engine ranking.',
    icon: 'mdi-magnify',
    color: 'primary'
  },
  {
    title: 'Create Reusable Snippets',
    description: 'Save time by creating code snippets that you can reuse in your projects.',
    icon: 'mdi-code-tags',
    color: 'info'
  },
  {
    title: 'Test Responsiveness',
    description: 'Make sure your website displays correctly on all devices with the Responsive tool.',
    icon: 'mdi-responsive',
    color: 'error'
  },
  {
    title: 'Improve Accessibility',
    description: 'Make your website accessible to all users with the accessibility tool.',
    icon: 'mdi-access-point',
    color: 'warning'
  }
]);

onMounted(async () => {
  try {
    await userStore.loadData();
    setInterval(async () => {
      await userStore.getMonitoringData();
    }, 5000);
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const getSnippetDate = (snippet: any): string => {
  if (snippet && (snippet.date || snippet.snippet_date)) {
    return formatDate(snippet.date || snippet.snippet_date);
  }
  return 'Date unknown';
};
</script>

<style scoped>
.tool-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.project-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  height: 100%;
}

.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-tool {
  position: relative;
  opacity: 0.9;
  cursor: not-allowed;
}

.admin-tool:hover {
  transform: none !important;
  box-shadow: none !important;
}

.admin-tool .v-icon {
  opacity: 0.8;
}

.admin-tool .text-subtitle-1 {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

.admin-tool .v-chip {
  background: transparent;
  color: #FFD700;
  font-weight: 600;
  border: none;
  padding: 0;
}

.admin-tool .v-chip .v-icon {
  opacity: 1;
  color: #FFD700;
  font-size: 20px;
}

.admin-tool .v-card-text {
  position: relative;
  z-index: 1;
}
</style>