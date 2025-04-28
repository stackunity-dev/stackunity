<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mobile-breakpoint="960" :permanent="!display.smAndDown.value"
      :temporary="display.smAndDown.value" location="left" class="dashboard-drawer" id="main-navigation">
      <div class="drawer-header pa-4">
        <div class="d-flex align-center mb-2">
          <div class="logo-container mr-3">
            <img src="/images/logo.png" alt="StackUnity" class="logo-devunity" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">StackUnity</div>
            <div class="text-caption text-medium-emphasis">v1.0.2</div>
          </div>
        </div>
      </div>

      <v-list density="compact" v-model:opened="open" nav class="px-2">
        <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard-outline" title="Dashboard" rounded="lg"
          class="mb-1" color="primary" nuxt @click="closeDrawer" data-plausible-feature="dashboard_menu">
        </v-list-item>

        <v-list-item v-if="userStore.user?.isPremium" to="/website" prepend-icon="mdi-web" title="Website" rounded="lg"
          class="mb-1" color="primary" nuxt @click="closeDrawer" data-plausible-feature="website_menu">
        </v-list-item>

        <PremiumFeature v-if="!userStore.user?.isPremium" type="list-item" title="Website" icon="mdi-web"
          feature-key="website" plan-type="premium" />

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

        <v-list-item v-if="!userStore.user.isPremium || !userStore.user.isStandard" to="/checkout"
          prepend-icon="mdi-credit-card-outline" title="Premium" rounded="lg" class="mb-1" color="primary" nuxt
          @click="closeDrawer" />

        <v-list-item
          v-if="userStore.user && userStore.user.daysLeft !== undefined && userStore.user.daysLeft > 0 && !userStore.user.isBuying"
          prepend-icon="mdi-clock-outline" :title="`Trial : ${userStore.user.daysLeft} days left`" rounded="lg"
          class="mb-1" :class="userStore.user.daysLeft <= 2 ? 'text-warning' : 'text-info'" />

        <v-list-item to="/settings" prepend-icon="mdi-cog-outline" title="Settings" rounded="lg" class="mb-1"
          color="primary" nuxt @click="closeDrawer" />

        <v-list-item @click="logout" prepend-icon="mdi-logout" title="Logout" rounded="lg" color="error" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="border-b page-header px-4" :color="getHeaderColor()" flat scroll-behavior="elevate" :elevation="0"
      id="dashboard-title">
      <v-app-bar-nav-icon v-if="display.smAndDown.value" @click="drawer = !drawer"
        color="on-surface"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-icon size="large" class="mr-3">{{ getCurrentPageIcon() }}</v-icon>
        <div class="text-h5 font-weight-bold">{{ currentPageTitle }}
          <v-chip v-if="currentPageTitle === 'API Testing Hub'" color="secondary" variant="elevated" size="small"
            class="ml-2">
            <v-icon start size="small">mdi-information</v-icon>
            beta version
          </v-chip>
          <v-menu v-if="currentPageTitle === 'Studio'" offset-y>
            <template v-slot:activator="{ props }">
              <v-chip v-bind="props" :color="studioMode === 'studio-seo' ? 'secondary' : 'primary'" variant="elevated"
                size="small" class="ml-2" :elevation="4">
                <v-icon start size="small">{{ studioMode === 'studio-seo' ? 'mdi-magnify' : 'mdi-palette' }}</v-icon>
                {{ studioMode === 'studio-seo' ? 'SEO' : 'Studio' }}
                <v-icon end size="x-small" class="ml-1">mdi-chevron-down</v-icon>
              </v-chip>
            </template>
            <v-list density="compact" width="180">
              <v-list-item @click="setStudioMode('studio')" :active="studioMode === 'studio'">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-palette</v-icon>
                </template>
                <v-list-item-title>Studio Mode</v-list-item-title>
                <template v-slot:append>
                  <v-icon v-if="studioMode === 'studio'" color="primary" size="small">mdi-check</v-icon>
                </template>
              </v-list-item>
              <v-list-item @click="setStudioMode('studio-seo')" :active="studioMode === 'studio-seo'">
                <template v-slot:prepend>
                  <v-icon color="secondary">mdi-magnify</v-icon>
                </template>
                <v-list-item-title>SEO Mode</v-list-item-title>
                <template v-slot:append>
                  <v-icon v-if="studioMode === 'studio-seo'" color="secondary" size="small">mdi-check</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

    </v-app-bar>

    <v-main class="pa-0">
      <div class="content-wrapper">
        <NuxtPage :studio-mode="studioMode" />
      </div>
    </v-main>

    <OnboardingTutorial :show-onboarding="showOnboarding" @close="showOnboarding = false" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, markRaw, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import OnboardingTutorial from '../components/OnboardingTutorial.vue';
import premiumFeatures from '../components/PremiumFeature.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const open = ref([]);
const display = useDisplay();
const drawer = ref(!display.smAndDown.value);
const currentPageTitle = ref('Dashboard');
const studioMode = ref('studio');
const isSmall = computed(() => display.smAndDown.value);
const showOnboarding = ref(false);

provide('studioMode', {
  mode: studioMode,
  isDesignMode: computed(() => studioMode.value === 'studio'),
  isSEOMode: computed(() => studioMode.value === 'studio-seo'),
  setMode: (mode: string) => studioMode.value = mode,
  toggleMode: () => studioMode.value = studioMode.value === 'studio' ? 'studio-seo' : 'studio'
});

watch(() => route.path, () => {
  if (display.smAndDown.value) {
    drawer.value = false;
  }
  updatePageTitle();
});

watch(isSmall, (isSmall) => {
  if (!isSmall) {
    drawer.value = true;
  }
});

const updatePageTitle = () => {
  const path = route.path;

  if (path === '/dashboard') {
    currentPageTitle.value = 'Dashboard';
  } else if (path.includes('/website')) {
    currentPageTitle.value = 'Website';
  } else if (path.includes('/performance')) {
    currentPageTitle.value = 'Performance';
  } else if (path.includes('/animations')) {
    currentPageTitle.value = 'CSS playground';
  } else if (path.includes('/database-designer')) {
    currentPageTitle.value = 'Database Designer';
  } else if (path.includes('/semantic')) {
    currentPageTitle.value = 'Semantic';
  } else if (path.includes('/security')) {
    currentPageTitle.value = 'Security';
  } else if (path.includes('/content')) {
    currentPageTitle.value = 'Content';
  } else if (path.includes('/studio')) {
    currentPageTitle.value = 'Studio';
  } else if (path.includes('/responsive')) {
    currentPageTitle.value = 'Responsive';
  } else if (path.includes('/accessibility')) {
    currentPageTitle.value = 'Accessibility';
  } else if (path.includes('/robots')) {
    currentPageTitle.value = 'Robots & Schema';
  } else if (path.includes('/settings')) {
    currentPageTitle.value = 'Settings';
  } else if (path.includes('/newsletter-admin')) {
    currentPageTitle.value = 'Newsletter';
  } else if (path.includes('/api-testing-hub')) {
    currentPageTitle.value = 'API Testing Hub';
  } else {
    const routeName = path.split('/').pop() || 'Dashboard';
    currentPageTitle.value = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  }
};

const getCurrentPageIcon = () => {
  const path = route.path;

  if (path === '/dashboard') {
    return 'mdi-view-dashboard-outline';
  } else if (path.includes('/website')) {
    return 'mdi-web';
  } else if (path.includes('/performance')) {
    return 'mdi-speedometer';
  } else if (path.includes('/animations')) {
    return 'mdi-animation';
  } else if (path.includes('/database-designer')) {
    return 'mdi-database-cog';
  } else if (path.includes('/api-testing-hub')) {
    return 'mdi-api';
  } else if (path.includes('/semantic')) {
    return 'mdi-semantic-web';
  } else if (path.includes('/security')) {
    return 'mdi-security';
  } else if (path.includes('/studio')) {
    return 'mdi-palette';
  } else if (path.includes('/responsive')) {
    return 'mdi-responsive';
  } else if (path.includes('/accessibility')) {
    return 'mdi-access-point';
  } else if (path.includes('/content')) {
    return 'mdi-file-document-outline';
  } else if (path.includes('/user-engagement')) {
    return 'mdi-account-group';
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

const getHeaderColor = () => {
  if (currentPageTitle.value === 'Studio') {
    return studioMode.value === 'studio-seo' ? 'secondary' : 'primary';
  } else if (currentPageTitle.value === 'API Testing Hub') {
    return 'info';
  } else {
    return 'primary';
  }
};

const setStudioMode = (mode) => {
  studioMode.value = mode;
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
  userStore.loadSQLSchemas();
  userStore.loadWebsiteData();
  updatePageTitle();

  // Vérifier si l'utilisateur vient de s'inscrire
  const fromSignup = localStorage.getItem('fromSignup') === 'true';

  if (fromSignup) {
    // Afficher le tutoriel et réinitialiser le flag
    showOnboarding.value = true;
    localStorage.removeItem('fromSignup');
  }

  // Vérifier si on veut forcer l'affichage du tutoriel via un paramètre d'URL
  if (route.query.showTutorial === 'true') {
    showOnboarding.value = true;
  }
});

function createPremiumMenuItem(title: string, link: string, icon: string, featureKey: string, planType: 'standard' | 'premium' = 'premium'): any {
  if (userStore.user?.isPremium) {
    return {
      title: title,
      link: link,
      icon: icon
    };
  } else if (userStore.user?.isStandard) {
    if (planType === 'standard') {
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
            featureKey: featureKey,
            planType: 'premium'
          }
        }
      };
    }
  } else {
    return {
      title: `${title} (${planType === 'premium' ? 'Premium' : 'Standard'})`,
      link: '#',
      icon: icon,
      component: {
        component: markRaw(premiumFeatures),
        props: {
          type: 'list-item' as 'list-item',
          title: title,
          icon: icon,
          featureKey: featureKey,
          planType: planType
        }
      }
    };
  }
}

const items = computed(() => [
  {
    title: 'Frontend',
    prependIcon: 'mdi-language-html5',
    link: true,
    children: [
      { title: 'CSS playground', link: '/animations', icon: 'mdi-animation' },
      { title: 'Studio', link: '/studio', icon: 'mdi-palette' },
      createPremiumMenuItem('Robots & Schema', '/robots', 'mdi-robot', 'robots', 'standard')
    ]
  },
  {
    title: 'Backend',
    prependIcon: 'mdi-database-outline',
    link: true,
    children: [
      createPremiumMenuItem('Database Designer', '/database-designer', 'mdi-database', 'databaseDesigner', 'standard'),
      { title: 'API Testing Hub', link: '/api-testing-hub', icon: 'mdi-api' }
    ]
  },
  {
    title: 'UI/UX',
    prependIcon: 'mdi-palette',
    link: true,
    children: [
      { title: 'Responsive', link: '/responsive', icon: 'mdi-responsive' },
      { title: 'Accessibility', link: '/accessibility', icon: 'mdi-access-point' },
    ]
  },
  {
    title: 'Analyzer',
    prependIcon: 'mdi-magnify',
    link: true,
    children: [
      createPremiumMenuItem('Performance', '/performance', 'mdi-speedometer', 'performance', 'premium'),
      createPremiumMenuItem('Semantic', '/semantic', 'mdi-semantic-web', 'semantic', 'premium'),
      createPremiumMenuItem('Content', '/content', 'mdi-file-document-outline', 'content', 'premium'),
      createPremiumMenuItem('User Engagement', '/user-engagement', 'mdi-account-group', 'userEngagement', 'premium'),
      createPremiumMenuItem('Security', '/security', 'mdi-security', 'security', 'premium')
    ]
  }
]);
</script>

<style scoped>
.dashboard-drawer {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
}

.drawer-header {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.drawer-header .text-h6 {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.drawer-header .text-caption {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

.page-header {
  position: relative;
  z-index: 4;
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-list-item {
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background: rgba(var(--v-theme-primary), var(--v-hover-opacity));
  transform: translateX(4px);
}

.v-list-item.v-list-item--active {
  background: rgba(var(--v-theme-primary), var(--v-selected-opacity));
  border-right: 3px solid rgb(var(--v-theme-primary));
}

.logo-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--v-theme-primary), var(--v-theme-secondary));
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.logo-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 0;
}

.logo-devunity {
  width: 40px;
  height: 40px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  margin-left: 256px;
  width: calc(100% - 256px);
  padding-top: 64px;
}

@media (max-width: 960px) {
  .content-wrapper {
    margin-left: 0;
    width: 100%;
    padding-top: 64px;
  }
}
</style>