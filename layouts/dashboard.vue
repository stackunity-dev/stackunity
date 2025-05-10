<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mobile-breakpoint="960" :permanent="!display.smAndDown.value"
      :temporary="display.smAndDown.value" location="left" class="dashboard-drawer">
      <div class="drawer-header pa-4">
        <div class="d-flex align-center mb-2">
          <div class="logo-container mr-3">
            <img src="/images/logo.png" alt="StackUnity" class="logo-devunity" />
          </div>
          <div>
            <div class="text-h6 font-weight-bold">StackUnity</div>
            <div class="text-caption text-medium-emphasis">v1.1.0</div>
          </div>
        </div>
      </div>

      <v-list density="compact" v-model:opened="open" nav class="px-2">

        <v-list-item rounded="lg" class="mb-1" color="primary" nuxt @click="closeDrawer"
          data-plausible-feature="language_menu">
          <language-selector class="ml-auto" />
        </v-list-item>

        <v-list-item :to="localePath('/dashboard')" prepend-icon="mdi-view-dashboard-outline"
          :title="t().menu.dashboard" rounded="lg" class="mb-1" color="primary" nuxt @click="closeDrawer"
          data-plausible-feature="dashboard_menu">
        </v-list-item>

        <v-list-item v-if="userStore.user?.isPremium" :to="localePath('/website')" prepend-icon="mdi-web"
          :title="t().menu.website" rounded="lg" class="mb-1" color="primary" nuxt @click="closeDrawer"
          data-plausible-feature="website_menu">
        </v-list-item>

        <PremiumFeature v-if="!userStore.user?.isPremium" type="list-item" :title="t().menu.website" icon="mdi-web"
          feature-key="website" plan-type="premium" />

        <v-list-item v-if="userStore.user?.isPremium" :to="localePath('/user-analytics')"
          prepend-icon="mdi-chart-box-outline" :title="t().menu.uxAnalyzer" rounded="lg" class="mb-1" color="primary"
          nuxt @click="closeDrawer" data-plausible-feature="ux_analyzer_menu">
        </v-list-item>

        <PremiumFeature v-if="!userStore.user?.isPremium" type="list-item" :title="t().menu.uxAnalyzer"
          icon="mdi-chart-box-outline" feature-key="ux_analyzer" plan-type="premium" />

        <v-list-subheader class="mt-2 text-uppercase font-weight-bold text-caption">{{ t().menu.workflow
        }}</v-list-subheader>

        <v-list-group v-for="(item, index) in items" :key="index" :value="item.title" class="mb-1"
          :prepend-icon="item.prependIcon">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :title="item.title" rounded="lg" color="primary" />
          </template>

          <template v-for="(child, idx) in item.children" :key="idx">
            <component v-if="child.component" :is="child.component.component" v-bind="child.component.props"
              class="ml-4 my-1 premium-menu-item" />
            <v-list-item v-else :to="localePath(child.link)" :title="child.title"
              :prepend-icon="child.icon || 'mdi-circle-small'" class="ml-4" rounded="lg" color="primary" nuxt
              @click="closeDrawer" />
          </template>
        </v-list-group>

        <v-divider class="my-3"></v-divider>

        <v-list-subheader class="text-uppercase font-weight-bold text-caption">{{ t().menu.system }}</v-list-subheader>

        <v-list-item v-if="userStore.user?.isPremium || userStore.user?.isStandard"
          prepend-icon="mdi-comment-quote-outline" :title="t().menu.feedback" rounded="lg" class="mb-1" color="primary"
          @click="showFeedBackDialog = true" />

        <v-list-item v-if="!userStore.user.isPremium || !userStore.user.isStandard" :to="localePath('/checkout')"
          prepend-icon="mdi-credit-card-outline" :title="t().menu.premium" rounded="lg" class="mb-1" color="primary"
          nuxt @click="closeDrawer" />

        <v-list-item :to="localePath('/settings')" prepend-icon="mdi-cog-outline" :title="t().menu.settings"
          rounded="lg" class="mb-1" color="primary" nuxt @click="closeDrawer" />

        <v-list-item @click="logout" prepend-icon="mdi-logout" :title="t().menu.logout" rounded="lg" color="error" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar class="border-b page-header px-4" color="secondary" flat scroll-behavior="elevate" :elevation="0">
      <v-app-bar-nav-icon v-if="display.smAndDown.value" @click="drawer = !drawer"
        color="on-surface"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-icon size="large" class="mr-3">{{ getCurrentPageIcon() }}</v-icon>
        <div class="text-h5 font-weight-bold">{{ currentPageTitle }}
        </div>
      </div>

      <v-dialog v-model="showFeedBackDialog" max-width="600" transition="dialog-bottom-transition">
        <v-card class="feedback-dialog">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-message-text-outline" color="primary" class="mr-2"></v-icon>
              <span class="text-h6">{{ t().feedback.title }}</span>
            </div>
            <v-btn icon="mdi-close" variant="text" @click="showFeedBackDialog = false"></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <v-form @submit.prevent="submitFeedback">
              <div class="feedback-type-selector mb-6">
                <div class="text-subtitle-2 mb-2">{{ t().feedback.form.typeLabel }}</div>
                <v-btn-toggle v-model="feedback.type" mandatory class="d-flex flex-wrap justify-space-between"
                  color="primary">
                  <v-btn v-for="type in feedbackTypes" :key="type.value" :value="type.value" :color="type.color"
                    variant="outlined" class="ma-1 flex-grow-1" height="48" min-width="120" max-width="140">
                    <v-icon :icon="type.icon" class="mr-2"></v-icon>
                    {{ type.title }}
                  </v-btn>
                </v-btn-toggle>
              </div>

              <v-text-field v-model="feedback.title" :label="t().feedback.form.titleLabel"
                prepend-icon="mdi-format-title" required variant="outlined" class="mb-4"
                :color="getFeedbackTypeColor(feedback.type)"
                :rules="[(v) => !!v || 'Title is required']"></v-text-field>

              <v-textarea v-model="feedback.description" :label="t().feedback.form.descriptionLabel"
                prepend-icon="mdi-text" required rows="4" variant="outlined" class="mb-4"
                :color="getFeedbackTypeColor(feedback.type)" :hint="t().feedback.form.descriptionHint" persistent-hint
                :rules="[(v) => !!v || 'Description is required']"></v-textarea>

              <div class="rating-section mb-4">
                <div class="text-subtitle-2 mb-2">{{ feedback.type === 'suggestion' || feedback.type === 'improvement' ?
                  t().feedback.form.ratingLabel.feature : t().feedback.form.ratingLabel.bug }}</div>
                <v-rating v-model="feedback.rating" color="amber" density="comfortable" size="large" hover
                  half-increments :rules="[(v: any) => !!v || 'Rating is required']"></v-rating>
              </div>

              <v-text-field v-model="feedback.email" :label="t().feedback.form.emailLabel"
                prepend-icon="mdi-email-outline" type="email" variant="outlined" class="mb-4"
                :color="getFeedbackTypeColor(feedback.type)" :hint="t().feedback.form.emailHint"
                persistent-hint></v-text-field>

              <v-card-actions class="d-flex justify-end pa-0">
                <v-btn color="grey" variant="text" @click="showFeedBackDialog = false" class="mr-2">
                  {{ t().feedback.form.cancel }}
                </v-btn>
                <v-btn :color="getFeedbackTypeColor(feedback.type)" type="submit"
                  :disabled="!feedback.title || !feedback.description" :loading="false" class="px-4">
                  <v-icon icon="mdi-send" class="mr-2"></v-icon>
                  {{ t().feedback.form.submit }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>

      <Snackbar v-model="snackbar.show" :text="snackbar.text" :color="snackbar.color" :timeout="snackbar.timeout" />
    </v-app-bar>

    <v-main class="pa-0">
      <div class="content-wrapper">
        <NuxtPage :studio-mode="studioMode" />
      </div>
    </v-main>

    <LanguageChangeMonitor position="bottom-right" :duration="4000" />
  </v-app>
</template>

<script lang="ts" setup>
import { computed, markRaw, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay, useTheme } from 'vuetify';
import premiumFeatures from '../components/PremiumFeature.vue';
import Snackbar from '../components/snackbar.vue';
import { currentLanguage, SupportedLanguage, useTranslations } from '../languages';
import languageMonitorService from '../services/languageMonitorService';
import { useUserStore } from '../stores/userStore';

// @ts-ignore
import { useNuxtApp } from '#app';

const t = useTranslations('layout');

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const open = ref([]);
const display = useDisplay();
const drawer = ref(!display.smAndDown.value);
const currentPageTitle = computed(() => {
  const path = route.path;

  if (path === '/dashboard') {
    return t().menu.dashboard;
  } else if (path.includes('/website')) {
    return t().menu.website;
  } else if (path.includes('/performance')) {
    return t().menu.performance;
  } else if (path.includes('/animations')) {
    return t().menu.cssPlayground;
  } else if (path.includes('/database-designer')) {
    return t().menu.databaseDesigner;
  } else if (path.includes('/semantic')) {
    return t().menu.structureAccessibility;
  } else if (path.includes('/security')) {
    return t().menu.security;
  } else if (path.includes('/content')) {
    return t().menu.content;
  } else if (path.includes('/studio')) {
    return t().menu.studio;
  } else if (path.includes('/responsive')) {
    return t().menu.responsive;
  } else if (path.includes('/accessibility')) {
    return t().menu.accessibility;
  } else if (path.includes('/robots')) {
    return t().menu.robotsSchema;
  } else if (path.includes('/settings')) {
    return t().menu.settings;
  } else if (path.includes('/api-testing-hub')) {
    return t().menu.apiTestingHub;
  } else if (path.includes('/user-analytics')) {
    return t().menu.uxAnalyzer;
  } else {
    return t().menu.dashboard;
  }
});

const studioMode = ref('studio');
const isSmall = computed(() => display.smAndDown.value);
const vuetifyTheme = useTheme();
const showFeedBackDialog = ref(false);
const nuxtApp = useNuxtApp();
const localePath = nuxtApp.$localePath

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000
})
const feedback = ref({
  type: 'suggestion',
  rating: 5,
  title: '',
  description: '',
  email: userStore.user?.email || ''
});

const feedbackTypes = computed(() => [
  { title: t().feedback.types.suggestion, value: 'suggestion', icon: 'mdi-lightbulb-outline', color: 'secondary' },
  { title: t().feedback.types.bug, value: 'bug', icon: 'mdi-bug-outline', color: 'error' },
  { title: t().feedback.types.improvement, value: 'improvement', icon: 'mdi-trending-up', color: 'success' },
  { title: t().feedback.types.other, value: 'other', icon: 'mdi-dots-horizontal', color: 'grey' }
]);

const getFeedbackTypeColor = (type: string) => {
  const foundType = feedbackTypes.value.find(t => t.value === type);
  return foundType?.color || 'secondary';
};

const previousLanguage = ref<SupportedLanguage | null>(null);

watch(() => currentLanguage.value, (newLang, oldLang) => {
  if (newLang !== oldLang) {
    const event = languageMonitorService.recordLanguageChange(
      oldLang as SupportedLanguage,
      newLang,
      route.path,
      'dashboard-layout'
    );

    previousLanguage.value = oldLang as SupportedLanguage;

    if (document && route) {
      const pageTitle = currentPageTitle.value;
      document.title = pageTitle ? `${pageTitle} - StackUnity` : 'StackUnity';
    }
  }
}, { immediate: true });

watch(() => route.path, () => {
  if (display.smAndDown.value) {
    drawer.value = false;
  }

  if (document) {
    const pageTitle = currentPageTitle.value;
    document.title = pageTitle ? `${pageTitle} - StackUnity` : 'StackUnity';
  }
}, { immediate: true });

onMounted(() => {
  const theme = localStorage.getItem('app_theme');
  if (theme) {
    vuetifyTheme.global.name.value = theme;
  }
});

watch(isSmall, (isSmall) => {
  if (!isSmall) {
    drawer.value = true;
  }
});

const getCurrentPageIcon = () => {
  const path = route.path;

  if (path.includes('/dashboard')) {
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
  } else if (path.includes('/user-analytics')) {
    return 'mdi-chart-box';
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

const submitFeedback = async () => {
  try {
    if (!feedback.value.title || !feedback.value.description) {
      snackbar.value.show = true;
      snackbar.value.text = t().feedback.validationError;
      snackbar.value.color = 'error';
      return;
    }

    const response = await userStore.submitFeedback(feedback.value);

    if (response?.error) {
      throw new Error(response.error);
    }

    showFeedBackDialog.value = false;
    feedback.value = {
      type: 'suggestion',
      rating: 5,
      title: '',
      description: '',
      email: userStore.user?.email || ''
    };

    snackbar.value.show = true;
    snackbar.value.text = 'Feedback submitted successfully! Thank you for your input.';
    snackbar.value.color = 'success';
    snackbar.value.timeout = 4000;
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    snackbar.value.show = true;
    snackbar.value.text = error.message || 'An error occurred while submitting your feedback. Please try again later.';
    snackbar.value.color = 'error';
    snackbar.value.timeout = 5000;
  }
};

onMounted(() => {
  userStore.loadSQLSchemas();
  userStore.loadWebsiteData();
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
      { title: t().features.cssPlayground, link: '/animations', icon: 'mdi-animation' },
      { title: t().features.studio, link: '/studio', icon: 'mdi-palette' },
      createPremiumMenuItem(t().features.robotsSchema, '/robots', 'mdi-robot', 'robots', 'standard')
    ]
  },
  {
    title: 'Backend',
    prependIcon: 'mdi-database-outline',
    link: true,
    children: [
      createPremiumMenuItem(t().features.databaseDesigner, '/database-designer', 'mdi-database', 'databaseDesigner', 'standard'),
      { title: t().features.apiTestingHub, link: '/api-testing-hub', icon: 'mdi-api' }
    ]
  },
  {
    title: 'UI/UX',
    prependIcon: 'mdi-palette',
    link: true,
    children: [
      { title: t().features.responsive, link: '/responsive', icon: 'mdi-responsive' },
      { title: t().features.accessibility, link: '/accessibility', icon: 'mdi-access-point' },
    ]
  },
  {
    title: t().categories.analyzer,
    prependIcon: 'mdi-magnify',
    link: true,
    children: [
      createPremiumMenuItem(t().features.performance, '/performance', 'mdi-speedometer', 'performance', 'premium'),
      createPremiumMenuItem(t().features.structureAccessibility, '/semantic', 'mdi-semantic-web', 'semantic', 'premium'),
      createPremiumMenuItem(t().features.content, '/content', 'mdi-file-document-outline', 'content', 'premium'),
      createPremiumMenuItem(t().features.userEngagement, '/user-engagement', 'mdi-account-group', 'userEngagement', 'premium'),
      createPremiumMenuItem(t().features.security, '/security', 'mdi-security', 'security', 'premium')
    ]
  }
]);

const currentLocale = computed(() => {
  return currentLanguage.value;
});

</script>

<style scoped>
.dashboard-drawer {
  background: linear-gradient(180deg, rgba(var(--v-theme-surface), 0.95) 0%, rgba(var(--v-theme-surface), 0.98) 100%);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.drawer-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
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
  transition: transform 0.3s ease;
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

.logo-container:hover {
  transform: scale(1.05);
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

.feedback-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.feedback-type-selector {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 16px;
  border-radius: 8px;
}

.rating-section {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 16px;
  border-radius: 8px;
}

.v-btn-toggle {
  border-radius: 8px;
  gap: 8px;
}

.v-btn-toggle .v-btn {
  border-radius: 6px !important;
  flex: 1 1 calc(50% - 8px);
  min-width: 120px;
  max-width: 140px;
}
</style>