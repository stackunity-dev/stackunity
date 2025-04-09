<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mobile-breakpoint="960" :permanent="!display.smAndDown.value"
      :temporary="display.smAndDown.value" location="left" class="dashboard-drawer">
      <div class="drawer-header pa-4">
        <div class="d-flex align-center mb-4">
          <div class="logo-container mr-3">
            <img src="/logo/stackunity-letter.png" alt="StackUnity" class="logo-devunity" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">StackUnity</div>
            <div class="text-caption text-medium-emphasis">v1.0.1</div>
          </div>
        </div>

        <v-text-field v-model="search" density="compact" variant="outlined" placeholder="Search..."
          prepend-inner-icon="mdi-magnify" hide-details rounded class="mb-2" bg-color="surface"></v-text-field>
      </div>

      <v-divider></v-divider>

      <v-list density="compact" v-model:opened="open" nav class="px-2">
        <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard-outline" title="Dashboard" rounded="lg"
          class="mb-1" color="primary" nuxt @click="closeDrawer" data-plausible-feature="dashboard_menu">
        </v-list-item>

        <v-list-group value="Recent Projects" class="mb-1" prepend-icon="mdi-history">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Recent Projects" rounded="lg" color="primary" />
          </template>

          <v-list-item v-for="(snippet, index) in recentSnippets" :key="index" :to="`/snippets?id=${snippet.id}`"
            :title="snippet.title" :prepend-icon="getFrameworkIcon(snippet.framework)" class="ml-4" rounded="lg"
            color="primary" nuxt @click="closeDrawer">
            <template #subtitle>
              <span class="text-caption">{{ getSnippetDate(snippet) }}</span>
            </template>
          </v-list-item>

          <v-list-item v-if="recentSnippets.length === 0" class="ml-4" title="No recent projects" disabled />
        </v-list-group>

        <v-list-group value="Recent SQL schemas" class="mb-1" prepend-icon="mdi-database-outline">
          <template #activator="{ props }">
            <v-list-item v-bind="props" title="Recent SQL schemas" rounded="lg" color="primary" />
          </template>

          <v-list-item v-for="(schema, index) in recentSQLSchemas" :key="index" :to="`/sql-generator?id=${schema.id}`"
            :title="schema.database_name" prepend-icon="mdi-database" class="ml-4" rounded="lg" color="primary" nuxt
            @click="closeDrawer">
            <template #subtitle>
              <span class="text-caption">{{ getSchemaTablesCount(schema) }} tables</span>
            </template>
          </v-list-item>

          <v-list-item v-if="recentSQLSchemas.length === 0" class="ml-4" title="No recent SQL schemas" disabled />
        </v-list-group>

        <v-list-subheader class="mt-2 text-uppercase font-weight-bold text-caption">Applications</v-list-subheader>

        <v-list-group v-for="(item, index) in items" :key="index" :value="item.title" class="mb-1"
          :prepend-icon="item.prependIcon">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title" rounded="lg" color="primary" />
          </template>

          <template v-for="(child, idx) in item.children" :key="idx">
            <component v-if="child.component" :is="child.component.component" v-bind="child.component.props"
              class="ml-4 my-1 premium-menu-item" />
            <v-list-item v-else :to="child.link" :title="child.title" :prepend-icon="child.icon || 'mdi-circle-small'"
              class="ml-4" rounded="lg" color="primary" nuxt @click="closeDrawer" />
          </template>
        </v-list-group>

        <v-divider class="my-3"></v-divider>

        <v-list-subheader class="text-uppercase font-weight-bold text-caption">System</v-list-subheader>

        <client-only>
          <v-list-group v-if="userStore.user?.isAdmin" value="Administration" class="mb-1"
            prepend-icon="mdi-shield-account">
            <template #activator="{ props }">
              <v-list-item v-bind="props" title="Administration" rounded="lg" color="primary" />
            </template>

            <v-list-item to="/admin/newsletter-admin" prepend-icon="mdi-email-outline" title="Newsletter" rounded="lg"
              class="ml-4" color="primary" nuxt @click="closeDrawer" />
          </v-list-group>
        </client-only>

        <v-list-item v-if="!userStore.user.isPremium" to="/checkout" prepend-icon="mdi-credit-card-outline"
          title="Premium" rounded="lg" class="mb-1" color="primary" nuxt @click="closeDrawer" />

        <v-list-item to="/settings" prepend-icon="mdi-cog-outline" title="Settings" rounded="lg" class="mb-1"
          color="primary" nuxt @click="closeDrawer" />

        <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout" rounded="lg" color="error" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="border-b page-header px-4" color="primary" flat scroll-behavior="elevate" :elevation="0">
      <v-app-bar-nav-icon v-if="display.smAndDown.value" @click="drawer = !drawer"
        color="on-surface"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-icon size="large" class="mr-3">{{ getCurrentPageIcon() }}</v-icon>
        <div class="text-h5 font-weight-bold">{{ currentPageTitle }}</div>
      </div>
    </v-app-bar>

    <v-main class="pa-0">
      <div class="content-wrapper">
        <NuxtPage />
        <Task v-if="openTask" />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import premiumFeatures from '../components/PremiumFeature.vue';
import Task from '../components/task.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const open = ref([]);
const search = ref('');
const display = useDisplay();
const drawer = ref(!display.smAndDown.value);
const currentPageTitle = ref('Dashboard');
const openTask = ref(false);

watch(() => route.path, (newPath, oldPath) => {
  if (display.smAndDown.value) {
    drawer.value = false;
  }
  updatePageTitle();
});

const isSmall = computed(() => display.smAndDown.value);

watch(isSmall, (isSmall) => {
  if (!isSmall) {
    drawer.value = true;
  }
});

const updatePageTitle = () => {
  const path = route.path;

  if (path === '/dashboard') {
    currentPageTitle.value = 'Dashboard';
  } else if (path.includes('/snippets')) {
    currentPageTitle.value = 'Snippets';
  } else if (path.includes('/sql-generator')) {
    currentPageTitle.value = 'Database Designer';
  } else if (path.includes('/studio')) {
    currentPageTitle.value = 'Studio';
  } else if (path.includes('/responsive')) {
    currentPageTitle.value = 'Responsive';
  } else if (path.includes('/accessibility')) {
    currentPageTitle.value = 'Accessibility';
  } else if (path.includes('/seo-audit')) {
    currentPageTitle.value = 'SEO Audit';
  } else if (path.includes('/settings')) {
    currentPageTitle.value = 'Settings';
  } else if (path.includes('/newsletter-admin')) {
    currentPageTitle.value = 'Newsletter';
  } else {
    const routeName = path.split('/').pop() || 'Dashboard';
    currentPageTitle.value = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  }
};

const recentSnippets = computed(() => {
  return [...userStore.personalSnippets]
    .sort((a, b) => {
      const dateA = getDateValue(a);
      const dateB = getDateValue(b);
      return dateB - dateA;
    })
    .slice(0, 5);
});

const recentSQLSchemas = computed(() => {
  return [...userStore.sqlSchemas]
    .slice(0, 5);
});

const getSchemaTablesCount = (schema: any): number => {
  if (schema && schema.schema_data) {
    try {
      const data = typeof schema.schema_data === 'string'
        ? JSON.parse(schema.schema_data)
        : schema.schema_data;

      return data.tables ? data.tables.length : 0;
    } catch (e) {
      console.error('Error parsing schema data:', e);
      return 0;
    }
  }
  return 0;
};

const getDateValue = (snippet: any): number => {
  if (snippet) {
    const dateStr = snippet.date || snippet.snippet_date;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
    }
  }
  return 0;
};

const getSnippetDate = (snippet: any): string => {
  if (snippet) {
    const dateStr = snippet.date || snippet.snippet_date;
    if (dateStr) {
      return formatDate(dateStr);
    }
  }
  return 'Date unknown';
};

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
  switch (framework?.toLowerCase()) {
    case 'react':
      return 'mdi-react';
    case 'vue.js 3':
    case 'vue':
      return 'mdi-vuejs';
    case 'angular':
      return 'mdi-angular';
    case 'nest.js':
      return 'mdi-nodejs';
    case 'nuxt 3':
    case 'nuxt':
      return 'mdi-nuxt';
    default:
      return 'mdi-code-tags';
  }
};

const getCurrentPageIcon = () => {
  const path = route.path;

  if (path === '/dashboard') {
    return 'mdi-view-dashboard-outline';
  } else if (path.includes('/snippets')) {
    return 'mdi-code-tags';
  } else if (path.includes('/sql-generator')) {
    return 'mdi-database-cog';
  } else if (path.includes('/studio')) {
    return 'mdi-palette';
  } else if (path.includes('/responsive')) {
    return 'mdi-responsive';
  } else if (path.includes('/accessibility')) {
    return 'mdi-access-point';
  } else if (path.includes('/seo-audit')) {
    return 'mdi-magnify';
  } else if (path.includes('/robots')) {
    return 'mdi-robot';
  } else if (path.includes('/settings')) {
    return 'mdi-cog-outline';
  } else if (path.includes('/newsletter-admin')) {
    return 'mdi-email-outline';
  } else {
    return 'mdi-application';
  }
};

const closeDrawer = () => {
  if (display.smAndDown.value) {
    drawer.value = false;
  }
};

const logout = async () => {
  try {
    await userStore.logout();
    closeDrawer();
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

onMounted(() => {
  userStore.loadSnippets();
  userStore.loadSQLSchemas();
  updatePageTitle();
  openTask.value = true;
});

function createPremiumMenuItem(title: string, link: string, icon: string, featureKey: string): any {
  if (userStore.user?.isPremium) {
    return {
      title: title,
      link: link,
      icon: icon
    };
  } else {
    return {
      title: `${title} (Premium)`,
      link: '#',
      icon: icon,
      component: {
        component: markRaw(premiumFeatures),
        props: {
          type: 'list-item' as 'list-item',
          title: title,
          icon: icon,
          featureKey: featureKey
        }
      }
    };
  }
}

const items = computed(() => [
  {
    title: 'Frontend',
    prependIcon: 'mdi-web',
    link: true,
    children: [
      { title: 'Snippets', link: '/snippets', icon: 'mdi-code-tags' },
      { title: 'Studio', link: '/studio', icon: 'mdi-palette' }
    ]
  },
  {
    title: 'Backend',
    prependIcon: 'mdi-database-outline',
    link: true,
    children: [
      createPremiumMenuItem('Database Designer', '/sql-generator', 'mdi-database', 'databaseDesigner')
    ]
  },
  {
    title: 'UI/UX',
    prependIcon: 'mdi-palette',
    link: true,
    children: [
      { title: 'Responsive', link: '/responsive', icon: 'mdi-responsive' },
      { title: 'Accessibility', link: '/accessibility', icon: 'mdi-access-point' }
    ]
  },
  {
    title: 'SEO',
    prependIcon: 'mdi-rocket-launch-outline',
    link: true,
    children: [
      createPremiumMenuItem('SEO Audit', '/seo-audit', 'mdi-magnify', 'seoAudit'),
      createPremiumMenuItem('Robots & Schema', '/robots', 'mdi-robot', 'robots')
    ]
  },
]);
</script>

<style scoped>
.drawer-header {
  background: linear-gradient(to bottom, rgba(var(--v-theme-surface-variant), 0.3), transparent)
}

.page-header {
  position: relative;
  z-index: 4;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .page-header {
    margin-bottom: 0;
  }
}

.premium-menu-item {
  width: 100%;
  display: block;
  padding-right: 8px;
}

.premium-menu-item :deep(.v-list-item) {
  min-height: 40px;
  width: 100%;
  border-radius: 8px;
}

.premium-menu-item :deep(.premium-text) {
  max-width: 100%;
  opacity: 1;
  margin-left: 8px;
}

.logo-container {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 30%, rgba(var(--v-theme-secondary), 0.18), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(var(--v-theme-surface), 0.1), transparent 50%);
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.logo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 15% 85%, rgba(var(--v-theme-primary), 0.12), transparent 50%);
  z-index: 0;
}

.logo-devunity {
  width: 32px;
  height: 32px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  margin-left: 256px;
  width: calc(100% - 256px);
  padding-top: 64px;
}

@media (max-width: 600px) {
  .content-wrapper {
    margin-left: 0;
    width: 100%;
    padding-top: 64px;
  }
}
</style>