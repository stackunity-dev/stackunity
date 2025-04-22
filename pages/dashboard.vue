<template>
  <v-app>
    <v-main>
      <div class="dashboard-container pa-6">
        <div class="welcome-section text-center mb-10">
          <h1 class="text-h3 font-weight-bold text-gradient mb-2">
            Welcome {{ userStore.user?.username || 'Developer' }}
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            What do you want to create today ?
          </p>
        </div>

        <v-row class="launchpad-grid" dense>
          <v-hover v-for="(item, index) in launchpadItems" :key="index" v-slot="{ isHovering, props }">
            <v-card v-bind="props" :to="item.disabled ? undefined : item.route" :disabled="item.disabled" :class="[
              'launchpad-card',
              `border-${item.color}`,
              isHovering ? 'card-hover' : '',
              item.disabled ? 'disabled-card' : ''
            ]" flat>
              <div class="card-content">
                <v-icon size="64" :color="item.color" class="icon-pulse">{{ item.icon }}</v-icon>
                <h2 class="text-h5 font-weight-medium mt-6">{{ item.title }}</h2>
                <p class="text-body-1 text-medium-emphasis mt-2">{{ item.description }}</p>

                <v-chip v-if="item.disabled && !userStore.user?.isPremium" color="amber" variant="flat" size="small"
                  class="premium-chip">
                  <v-icon start size="small">mdi-crown</v-icon>
                  Premium
                </v-chip>

                <v-btn :color="item.color" variant="text" :to="item.disabled ? undefined : item.route"
                  :disabled="item.disabled" class="mt-4">
                  Explore
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-hover>
        </v-row>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead, useRouter } from '#imports';
import { TokenUtils } from '../utils/token';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Dashboard - StackUnity',
  meta: [
    { name: 'description', content: 'Launch your development with StackUnity' },
    { name: 'keywords', content: 'StackUnity, dashboard, tools, snippets, SQL, Studio, SEO, fast access, web development' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Dashboard - StackUnity' },
    { name: 'og:description', content: 'Launch your development with StackUnity' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/dashboard' }
  ]
})

const userStore = useUserStore();
const router = useRouter();

const launchpadItems = computed(() => [
  {
    title: 'Snippets',
    description: 'Create and manage reusable code snippets for all your projects',
    icon: 'mdi-code-tags',
    color: 'primary',
    route: '/snippets',
    disabled: false
  },
  {
    title: 'Studio',
    description: 'Create components and visually user interfaces',
    icon: 'mdi-palette',
    color: 'secondary',
    route: '/studio',
    disabled: false
  },
  {
    title: 'Semantic',
    description: 'Check the semantic and ARIA attributes of your website',
    icon: 'mdi-semantic-web',
    color: 'tertiary',
    route: '/semantic',
    disabled: !userStore.user?.isPremium
  },
  {
    title: 'Database designer',
    description: 'Generate and visualize complex SQL schemas in just a few clicks',
    icon: 'mdi-database',
    color: 'info',
    route: '/database-designer',
    disabled: !userStore.user?.isPremium
  },
  {
    title: 'API Testing',
    description: 'Test and document your APIs easily',
    icon: 'mdi-api',
    color: 'success',
    route: '/api-testing-hub',
    disabled: false
  },
  {
    title: 'Accessibility',
    description: 'Make your website accessible to all users',
    icon: 'mdi-access-point',
    color: 'warning',
    route: '/accessibility',
    disabled: false
  },
  {
    title: 'Responsive',
    description: 'Test the display of your site on different devices',
    icon: 'mdi-responsive',
    color: 'error',
    route: '/responsive',
    disabled: false
  },
  {
    title: 'Website Audit',
    description: 'Analyze and optimize the performance of your website',
    icon: 'mdi-magnify',
    color: 'indigo',
    route: '/website-analyzer',
    disabled: !userStore.user?.isPremium
  },
  {
    title: 'User Engagement',
    description: 'Analyze and optimize the user engagement of your website',
    icon: 'mdi-account-group',
    color: 'primary',
    route: '/user-engagement',
    disabled: !userStore.user?.isPremium
  },
]);

onMounted(async () => {
  try {
    const token = TokenUtils.retrieveToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const isAuthenticated = await userStore.checkAuthentication();
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
    } catch (authError) {
      console.error('[Dashboard] Erreur d\'authentification:', authError);
      try {
        await userStore.logout();
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/login');
        return;
      } catch (e) {
        console.error('[Dashboard] Erreur lors de la déconnexion:', e);
        router.push('/login');
        return;
      }
    }

    try {
      const result = await userStore.loadData();
      if (result && result.error) {
        router.push('/login');
        return;
      }
    } catch (dataError) {
      console.error('[Dashboard] Erreur de chargement des données:', dataError);
      router.push('/login');
      return;
    }


    await loadWithRetries('snippets', () => userStore.loadSnippets());
    await loadWithRetries('sqlSchemas', () => userStore.loadSQLSchemas());

  } catch (error) {
    console.error('[Dashboard] Erreur d\'initialisation:', error);
    router.push('/login');
  }
});

async function loadWithRetries(name: string, loadFunction: () => Promise<any>, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      await loadFunction();
      break;
    } catch (err) {
      if (i === retries) {
        console.error(`Erreur lors du chargement de ${name}:`, err);
      }
    }
  }
}

</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-top: 2rem;
}

.text-gradient {
  background-image: linear-gradient(45deg,
      #2196F3,
      #00BCD4,
      #4CAF50);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: gradient 3s linear infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}

.launchpad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.launchpad-card {
  position: relative;
  height: 100%;
  min-height: 260px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(10px);
  background-color: rgba(var(--v-theme-surface), 0.8);
  overflow: hidden;
}

.border-primary {
  border-left: 3px solid rgb(var(--v-theme-primary));
}
.border-secondary {
  border-left: 3px solid rgb(var(--v-theme-secondary));
}
.border-tertiary {
  border-left: 3px solid rgb(var(--v-theme-tertiary));
}
.border-info {
  border-left: 3px solid rgb(var(--v-theme-info));
}
.border-success {
  border-left: 3px solid rgb(var(--v-theme-success));
}
.border-warning {
  border-left: 3px solid rgb(var(--v-theme-warning));
}
.border-error {
  border-left: 3px solid rgb(var(--v-theme-error));
}
.border-indigo {
  border-left: 3px solid #3F51B5;
}

.card-content {
  padding: 32px;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-hover {
  transform: translateY(-8px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.12);
}

.disabled-card {
  opacity: 0.75;
}

.premium-chip {
  margin-top: 16px;
  font-weight: 500;
}

.icon-pulse {
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 600px) {
  .launchpad-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .card-content {
    padding: 24px;
  }
}
</style>