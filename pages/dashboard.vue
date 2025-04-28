<template>
  <v-app>
    <v-main>
      <v-overlay v-model="isLoading" class="align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-overlay>

      <v-dialog v-model="showSessionDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="text-h5">
            <v-icon color="warning" class="mr-2">mdi-clock-alert</v-icon>
            Expired session
          </v-card-title>
          <v-card-text>
            <p>Your session is about to expire for security reasons.</p>
            <p class="mt-2">Do you want to continue your session?</p>
            <p class="text-center text-h5 mt-4">{{ sessionCountdown }}</p>
            <v-progress-linear :value="(sessionCountdown / 60) * 100" color="warning" height="10"></v-progress-linear>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="handleSessionExpired">
              Logout
            </v-btn>
            <v-btn color="primary" @click="continueSession">
              Continue session
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div class="dashboard-container pa-6" :class="{ 'compact-mode': isCompactMode }">
        <div class="welcome-section text-center mb-8">
          <h1 class="text-h3 font-weight-bold text-gradient mb-2">
            Welcome {{ userStore.user?.username || 'Developer' }}
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            What do you want to create today ?
          </p>
        </div>

        <div class="action-buttons text-center mb-8 d-flex flex-wrap justify-center">
          <v-tooltip location="bottom" text="Customize the display">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="primary" prepend-icon="mdi-cog" @click="showSettingsDialog = true"
                class="mr-2">
                Customize
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Change the appearance of the cards">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="secondary" prepend-icon="mdi-palette" @click="showThemeDialog = true"
                class="mr-2">
                Themes
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip location="bottom" text="Compact mode for mobile">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="grey" icon="mdi-view-compact" @click="toggleCompactMode"
                class="ml-auto d-md-none">
              </v-btn>
            </template>
          </v-tooltip>
        </div>

        <div class="filters-section mb-6">
          <v-chip-group v-model="selectedCategory" mandatory>
            <v-chip filter value="all" color="primary"
              :class="{ 'v-chip--active': selectedCategory === 'all' }">All</v-chip>
            <v-chip filter value="design" color="secondary"
              :class="{ 'v-chip--active': selectedCategory === 'design' }">Design</v-chip>
            <v-chip filter value="development" color="tertiary"
              :class="{ 'v-chip--active': selectedCategory === 'development' }">Development</v-chip>
            <v-chip filter value="testing" color="info"
              :class="{ 'v-chip--active': selectedCategory === 'testing' }">Tests</v-chip>
            <v-chip filter value="analysis" color="indigo"
              :class="{ 'v-chip--active': selectedCategory === 'analysis' }">Analysis</v-chip>
          </v-chip-group>


          <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search for a tool"
            variant="outlined" density="compact" hide-details class="mt-3" clearable></v-text-field>
        </div>

        <div class="launchpad-grid">
          <div v-for="(element, index) in filteredItems" :key="element.title">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" :to="element.disabled ? undefined : element.route" :disabled="element.disabled"
                :class="[
                  'launchpad-card',
                  `border-${element.color}`,
                  `theme-${currentTheme}`,
                  isHovering ? 'card-hover' : '',
                  element.disabled ? 'disabled-card' : ''
                ]" flat>
                <div class="card-content">
                  <v-icon size="64" :color="element.color" class="icon-pulse">{{ element.icon }}</v-icon>
                  <h2 class="text-h5 font-weight-medium mt-6">{{ element.title }}</h2>
                  <p class="text-body-1 text-medium-emphasis mt-2">{{ element.description }}</p>

                  <v-chip v-if="element.isNew" color="purple" size="small" class="feature-chip new-chip">
                    <v-icon start size="small">mdi-new-box</v-icon>
                    New
                  </v-chip>

                  <v-chip v-if="element.disabled && !userStore.user?.isPremium" color="amber" variant="flat"
                    size="small" class="premium-chip">
                    <v-tooltip location="top" text="Available only for premium accounts">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="d-flex align-center">
                          <v-icon start size="small">mdi-crown</v-icon>
                          Premium
                        </div>
                      </template>
                    </v-tooltip>
                  </v-chip>

                  <v-btn :color="element.color" variant="text" :to="element.disabled ? undefined : element.route"
                    :disabled="element.disabled" class="mt-4">
                    Explore
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </v-hover>
          </div>
        </div>
      </div>

      <v-dialog v-model="showSettingsDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
            Customize the dashboard
          </v-card-title>
          <v-card-text>
            <p class="text-subtitle-1 mb-2">Visibility of tools</p>
            <v-checkbox v-for="(item, index) in allTools" :key="index" v-model="item.visible" :label="item.title"
              hide-details dense></v-checkbox>

            <v-divider class="my-4"></v-divider>

            <p class="text-subtitle-1 mb-2">Display options</p>
            <v-switch v-model="isCompactMode" color="primary" label="Compact mode (mobiles)"></v-switch>
            <v-select v-model="cardsPerRow" :items="[
              { title: 'Auto (default)', value: 'auto' },
              { title: '2 cards', value: 2 },
              { title: '3 cards', value: 3 },
              { title: '4 cards', value: 4 },
              { title: '5 cards', value: 5 }
            ]" label="Cards per row" item-title="title" item-value="value" variant="outlined" density="compact"
              class="mt-4"></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="showSettingsDialog = false">
              Cancel
            </v-btn>
            <v-btn color="primary" @click="saveSettings">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showThemeDialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5 d-flex align-center">
            <v-icon color="secondary" class="mr-2">mdi-palette</v-icon>
            Choose a theme
          </v-card-title>
          <v-card-text>
            <v-radio-group v-model="currentTheme">
              <v-radio value="default" label="Default"></v-radio>
              <v-radio value="dark" label="Dark"></v-radio>
              <v-radio value="vibrant" label="Vibrant"></v-radio>
              <v-radio value="minimal" label="Minimal"></v-radio>
              <v-radio value="elegant" label="Elegant"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="showThemeDialog = false">
              Cancel
            </v-btn>
            <v-btn color="secondary" @click="applyTheme">
              Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <snackBar v-model="showSnackbar" :text="snackBarText" :color="snackBarColor" :timeout="3000" />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead, useRouter } from '#imports';
import { TokenUtils } from '../utils/token';
import snackBar from '../components/snackbar.vue';

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
const isLoading = ref(true);
const selectedCategory = ref('all');
const searchQuery = ref('');

const showSettingsDialog = ref(false);
const showThemeDialog = ref(false);
const currentTheme = ref('default');

const sessionTimeout = ref<number | null>(null);
const inactivityTimeout = 1 * 60 * 60 * 1000;
const showSessionDialog = ref(false);
const sessionCountdown = ref(60);
const countdownInterval = ref<number | null>(null);

const showSnackbar = ref(false);
const snackBarText = ref('');
const snackBarColor = ref('');

const isCompactMode = ref(false);
const cardsPerRow = ref('auto');

function applySnackbar(text: string, color: string) {
  snackBarText.value = text;
  snackBarColor.value = color;
  showSnackbar.value = true;
}

const resetSessionTimer = () => {
  if (sessionTimeout.value !== null) {
    clearTimeout(sessionTimeout.value);
  }
  sessionTimeout.value = window.setTimeout(() => {
    showSessionWarning();
  }, inactivityTimeout);
};

const showSessionWarning = () => {
  showSessionDialog.value = true;
  sessionCountdown.value = 60;

  countdownInterval.value = window.setInterval(() => {
    sessionCountdown.value--;
    if (sessionCountdown.value <= 0) {
      if (countdownInterval.value !== null) {
        clearInterval(countdownInterval.value);
      }
      handleSessionExpired();
    }
  }, 1000);
};

const handleSessionExpired = async () => {
  showSessionDialog.value = false;
  if (countdownInterval.value !== null) {
    clearInterval(countdownInterval.value);
  }
  await userStore.logout();
  router.push('/login');
  applySnackbar('Session expired', 'error');
};

const continueSession = () => {
  showSessionDialog.value = false;
  if (countdownInterval.value !== null) {
    clearInterval(countdownInterval.value);
  }
  resetSessionTimer();
  applySnackbar('Session continued', 'success');
};

const loadUserPreferences = () => {
  try {
    const savedTheme = localStorage.getItem('dashboardTheme');
    const savedVisibility = localStorage.getItem('dashboardVisibility');
    const savedCompactMode = localStorage.getItem('dashboardCompactMode');
    const savedCardsPerRow = localStorage.getItem('dashboardCardsPerRow');

    if (savedTheme) {
      currentTheme.value = savedTheme;
    }

    if (savedVisibility) {
      const visibilitySettings = JSON.parse(savedVisibility);
      allTools.value.forEach(tool => {
        if (visibilitySettings[tool.title] !== undefined) {
          tool.visible = visibilitySettings[tool.title];
        }
      });
    }

    if (savedCompactMode) {
      isCompactMode.value = savedCompactMode === 'true';
    }

    if (savedCardsPerRow) {
      cardsPerRow.value = savedCardsPerRow;
    }
    applySnackbar('Preferences loaded', 'success');
  } catch (error) {
    console.error('[Dashboard] Error loading preferences:', error);
    applySnackbar('Error loading preferences', 'error');
  }
};

const applyTheme = () => {
  localStorage.setItem('dashboardTheme', currentTheme.value);
  showThemeDialog.value = false;
};

const saveSettings = () => {
  const visibilitySettings = {};
  allTools.value.forEach(tool => {
    visibilitySettings[tool.title] = tool.visible;
  });
  localStorage.setItem('dashboardVisibility', JSON.stringify(visibilitySettings));

  localStorage.setItem('dashboardCompactMode', isCompactMode.value.toString());
  localStorage.setItem('dashboardCardsPerRow', cardsPerRow.value);

  showSettingsDialog.value = false;
  applySnackbar('Settings saved', 'success');
};

interface ToolItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  disabled: boolean;
  category: string;
  isNew: boolean;
  visible: boolean;
}

const allTools = ref<ToolItem[]>([
  {
    title: 'CSS animations',
    description: 'Create and manage CSS animations for all your projects',
    icon: 'mdi-animation',
    color: 'primary',
    route: '/animations',
    disabled: false,
    category: 'design',
    isNew: false,
    visible: true
  },
  {
    title: 'Studio',
    description: 'Create components and visually user interfaces',
    icon: 'mdi-palette',
    color: 'secondary',
    route: '/studio',
    disabled: false,
    category: 'design',
    isNew: false,
    visible: true
  },
  {
    title: 'Database designer',
    description: 'Generate and visualize complex SQL schemas in just a few clicks',
    icon: 'mdi-database',
    color: 'info',
    route: '/database-designer',
    disabled: !userStore.user?.isPremium,
    category: 'development',
    isNew: false,
    visible: true
  },
  {
    title: 'API Testing',
    description: 'Test and document your APIs easily',
    icon: 'mdi-api',
    color: 'success',
    route: '/api-testing-hub',
    disabled: false,
    category: 'testing',
    isNew: true,
    visible: true
  },
  {
    title: 'Accessibility',
    description: 'Make your website accessible to all users',
    icon: 'mdi-access-point',
    color: 'warning',
    route: '/accessibility',
    disabled: false,
    category: 'analysis',
    isNew: false,
    visible: true
  },
  {
    title: 'Responsive',
    description: 'Test the display of your site on different devices',
    icon: 'mdi-responsive',
    color: 'error',
    route: '/responsive',
    disabled: false,
    category: 'testing',
    isNew: false,
    visible: true
  },
  {
    title: 'Performance',
    description: 'Analyze the performance of your website',
    icon: 'mdi-speedometer',
    color: 'primary',
    route: '/performance',
    disabled: false,
    category: 'analysis',
    isNew: true,
    visible: true
  },
  {
    title: 'Semantic',
    description: 'Check the semantic and ARIA attributes of your website',
    icon: 'mdi-semantic-web',
    color: 'tertiary',
    route: '/semantic',
    disabled: !userStore.user?.isPremium,
    category: 'analysis',
    isNew: false,
    visible: true
  },
  {
    title: 'Content',
    description: 'Check the content of your website',
    icon: 'mdi-file-document-outline',
    color: 'indigo',
    route: '/content',
    disabled: !userStore.user?.isPremium,
    category: 'analysis',
    isNew: false,
    visible: true
  },
  {
    title: 'User Engagement',
    description: 'Analyze and optimize the user engagement of your website',
    icon: 'mdi-account-group',
    color: 'primary',
    route: '/user-engagement',
    disabled: !userStore.user?.isPremium,
    category: 'analysis',
    isNew: true,
    visible: true
  },
  {
    title: 'Security',
    description: 'Check the security of your website',
    icon: 'mdi-security',
    color: 'secondary',
    route: '/security',
    disabled: !userStore.user?.isPremium,
    category: 'development',
    isNew: false,
    visible: true
  }
]);

const filteredItems = computed(() => {
  return allTools.value
    .filter(item => {
      const categoryMatch = selectedCategory.value === 'all' || item.category === selectedCategory.value;

      const searchMatch = searchQuery.value === '' ||
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.value.toLowerCase());

      const visibilityMatch = item.visible;

      return categoryMatch && searchMatch && visibilityMatch;
    });
});

const toggleCompactMode = () => {
  isCompactMode.value = !isCompactMode.value;
  localStorage.setItem('dashboardCompactMode', isCompactMode.value.toString());
  applySnackbar('Compact mode ' + (isCompactMode.value ? 'enabled' : 'disabled'), isCompactMode.value ? 'success' : 'error');
};

watch(cardsPerRow, (newValue) => {
  const gridContainer = document.querySelector('.launchpad-grid') as HTMLElement;
  if (!gridContainer) return;

  if (newValue === 'auto') {
    gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';

    if (window.matchMedia('(min-width: 1600px)').matches) {
      gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    } else if (window.matchMedia('(max-width: 1200px)').matches) {
      gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
    } else if (window.matchMedia('(max-width: 960px) and (orientation: landscape)').matches) {
      gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
    } else if (window.matchMedia('(max-width: 600px)').matches) {
      gridContainer.style.gridTemplateColumns = '1fr';
    }
  } else {
    gridContainer.style.gridTemplateColumns = `repeat(${newValue}, 1fr)`;
  }
});

const validateTokenIntegrity = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Security] Erreur de validation du token:', error);
    return false;
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const token = TokenUtils.retrieveToken();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!validateTokenIntegrity(token)) {
      console.error('[Security] Token invalide ou manipulé');
      await userStore.logout();
      router.push('/login?invalid=true');
      return;
    }

    try {
      const isAuthenticated = await userStore.checkAuthentication();
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      resetSessionTimer();

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

    loadUserPreferences();

  } catch (error) {
    console.error('[Dashboard] Erreur d\'initialisation:', error);
    router.push('/login');
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  if (sessionTimeout.value !== null) {
    clearTimeout(sessionTimeout.value);
  }
  if (countdownInterval.value !== null) {
    clearInterval(countdownInterval.value);
  }
});

</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
}

@media (min-width: 1600px) {
  .dashboard-container {
    max-width: 1600px;
  }

  .launchpad-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 32px;
  }

  .card-content {
    padding: 40px;
  }
}

@media (max-width: 1200px) {
  .launchpad-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 960px) {
  .welcome-section {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }

  .action-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .action-buttons button {
    margin-bottom: 8px;
  }
}

@media (max-width: 600px) {
  .dashboard-container {
    padding: 1rem;
  }

  .welcome-section h1 {
    font-size: 1.8rem !important;
  }

  .launchpad-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-content {
    padding: 20px;
  }

  .launchpad-card {
    min-height: 220px;
  }

  .filters-section .v-chip-group {
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: 8px;
  }

  .compact-mode .card-content {
    padding: 16px;
  }

  .compact-mode .launchpad-card {
    min-height: 180px;
  }

  .compact-mode .icon-pulse {
    font-size: 40px !important;
  }

  .compact-mode h2 {
    font-size: 1.2rem !important;
    margin-top: 12px !important;
  }

  .compact-mode p {
    font-size: 0.875rem !important;
    margin-top: 8px !important;
  }
}

@media (max-width: 960px) and (orientation: landscape) {
  .launchpad-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .card-content {
    padding: 16px;
  }
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

.premium-chip,
.new-chip {
  margin-top: 16px;
  font-weight: 500;
}

.icon-pulse {
  animation: pulse 4s infinite;
}

.theme-dark {
  background-color: #1E1E1E;
  color: #FFFFFF;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-left-width: 5px;
}

.theme-dark .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.8) !important;
}

.theme-vibrant {
  background: linear-gradient(135deg, #F8F9FA, #E8EAF6);
  border-width: 0;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(30, 144, 255, 0.15), 0 5px 15px rgba(0, 0, 255, 0.1);
  transform-origin: center bottom;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.theme-vibrant:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 20px 40px rgba(30, 144, 255, 0.2), 0 15px 20px rgba(0, 0, 255, 0.15);
}

.theme-vibrant .icon-pulse {
  filter: drop-shadow(0 0 5px rgba(33, 150, 243, 0.5));
}

.theme-vibrant .text-medium-emphasis {
  color: rgba(0, 0, 0, 0.7) !important;
}

.theme-minimal {
  background-color: #FFFFFF;
  border-width: 0;
  border-radius: 12px;
  border-bottom: 3px solid #E0E0E0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-out;
}

.theme-minimal:hover {
  background-color: #FFFFFF;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px);
}

.theme-minimal .card-content {
  padding: 28px 24px;
}

.theme-minimal .text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6) !important;
}

.theme-elegant {
  background-color: #FCFCFC;
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  backdrop-filter: blur(10px);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
}

.theme-elegant::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #5E35B1, #3949AB);
  opacity: 0.9;
}

.theme-elegant:hover {
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-7px);
}

.theme-elegant .card-content {
  padding: 30px 26px 26px;
}

.theme-elegant h2 {
  color: #303F9F;
  font-weight: 600;
}

.theme-elegant .text-medium-emphasis {
  color: rgba(0, 0, 0, 0.65) !important;
}

.theme-vibrant .v-btn {
  background-color: transparent;
  color: #3949AB;
  font-weight: 500;
}

.theme-minimal .v-btn {
  background-color: transparent;
  font-weight: 500;
}

.theme-elegant .v-btn {
  background-color: transparent;
  color: #3949AB;
  font-weight: 500;
}

.theme-dark .v-btn {
  color: #90CAF9;
}
</style>