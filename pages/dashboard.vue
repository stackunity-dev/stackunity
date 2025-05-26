<template>
  <v-app>
    <main class="main-content">

      <div class="dashboard-container pa-6" :class="{ 'compact-mode': isCompactMode }">
        <div class="welcome-section text-center mb-8">
          <h1 class="text-h3 font-weight-bold text-gradient mb-2">
            Welcome {{ userStore.user?.username }}
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            What do you want to do today ?
          </p>
        </div>

        <div class="section-title mb-4">
          <h2 class="text-h5 font-weight-bold">Main Features</h2>
        </div>
        <v-row>
          <v-col v-for="card in mainCards" :key="card.title" cols="12" md="4">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" :to="card.disabled ? undefined : localePath(card.route)" :disabled="card.disabled"
                height="400" class="rounded-xl feature-card"
                :class="[`border-${card.color}`, isHovering ? 'card-hover' : '', card.disabled ? 'disabled-card' : '']"
                flat>
                <div class="card-content">
                  <div class="icon-wrapper mb-4">
                    <v-icon size="64" :color="card.color" class="icon-pulse">{{ card.icon }}</v-icon>
                  </div>
                  <h2 class="text-h5 font-weight-bold mb-4">{{ card.title }}</h2>
                  <p class="text-body-1 text-medium-emphasis mb-6">{{ card.description }}</p>

                  <v-chip v-if="card.disabled" color="amber" variant="flat" size="small" class="premium-chip mb-4">
                    <v-tooltip location="top" text="Available only for premium accounts">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="d-flex align-center">
                          <v-icon start size="small">mdi-crown</v-icon>
                          Premium
                        </div>
                      </template>
                    </v-tooltip>
                  </v-chip>

                  <v-btn :color="card.color" variant="text" :to="card.disabled ? undefined : localePath(card.route)"
                    :disabled="card.disabled" class="mt-auto explore-btn">
                    Explore
                    <v-icon end>mdi-arrow-right</v-icon>
                  </v-btn>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>

        <div class="section-title mb-4 mt-8">
          <h2 class="text-h5 font-weight-bold">Quick Actions</h2>
        </div>
        <v-row>
          <v-col v-for="action in quickActions" :key="action.title" cols="12" sm="6" md="3">
            <v-card :to="action.route" class="quick-action-card" flat>
              <v-card-text class="text-center">
                <v-icon :color="action.color" size="32" class="mb-2">{{ action.icon }}</v-icon>
                <div class="text-subtitle-1 font-weight-medium">{{ action.title }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <snackBar v-model="showSnackbar" :text="snackBarText" :color="snackBarColor" :timeout="3000" />
    </main>
  </v-app>
</template>

<script lang="ts" setup>
// @ts-ignore
import { definePageMeta, useHead, useNuxtApp } from '#imports';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import snackBar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
import { TokenUtils } from '../utils/token';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Dashboard - StackUnity',
  meta: [
    { name: 'description', content: 'StackUnity Dashboard - Your all-in-one web development platform' },
    { name: 'keywords', content: 'web development, stackunity, dashboard' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Dashboard - StackUnity' },
    { name: 'og:description', content: 'StackUnity Dashboard - Your all-in-one web development platform' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/dashboard' }
  ]
})

const userStore = useUserStore();
const router = useRouter();
const isLoading = ref(true);
const nuxtApp = useNuxtApp();
const localePath = nuxtApp.$localePath

const showNotificationDialog = ref(false);
const showSnackbar = ref(false);
const snackBarText = ref('');
const snackBarColor = ref('');

const isCompactMode = ref(false);

function applySnackbar(text: string, color: string) {
  snackBarText.value = text;
  snackBarColor.value = color;
  showSnackbar.value = true;
}

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

const mainCards = [
  {
    title: 'StackUnity Analytics',
    description: 'Analyze and optimize your website\'s user experience',
    icon: 'mdi-chart-box-outline',
    color: 'primary',
    route: '/stackunity-analytics',
    disabled: !userStore.user?.isPremium
  },
  {
    title: 'StackQL',
    description: 'Query and analyze your website\'s data with SQL-like syntax',
    icon: 'mdi-console',
    color: 'secondary',
    route: '/stackql',
    disabled: false
  },
  {
    title: 'StackAudit',
    description: 'Comprehensive website analysis and optimization suite',
    icon: 'mdi-magnify-scan',
    color: 'tertiary',
    route: '/website',
    disabled: false
  }
];

const quickActions = [
  {
    title: 'New Analysis',
    icon: 'mdi-magnify-scan',
    color: 'primary',
    route: '/website'
  },
  {
    title: 'Run SQL',
    icon: 'mdi-play-circle',
    color: 'secondary',
    route: '/stackql'
  },
  {
    title: 'View Analytics',
    icon: 'mdi-chart-box-outline',
    color: 'tertiary',
    route: '/stackunity-analytics'
  },
  {
    title: 'Settings',
    icon: 'mdi-cog',
    color: 'info',
    route: '/settings'
  }
];

interface Notification {
  title: string;
  message: string;
  type: string;
  priority: string;
  tags: string[];
  isSticky: boolean;
  requiresAction: boolean;
  actionText?: string;
  icon?: string;
  color?: string;
  created_at?: string;
  is_sticky?: boolean;
}

const notificationForm = ref();
const isSubmitting = ref(false);
const notifications = ref<Notification[]>([]);

const newNotification = ref<Notification>({
  title: '',
  message: '',
  type: 'info',
  priority: 'normal',
  tags: [],
  isSticky: false,
  requiresAction: false,
  actionText: ''
});

const notificationTypes = [
  { title: 'Information', value: 'info', icon: 'mdi-information', color: 'info' },
  { title: 'Success', value: 'success', icon: 'mdi-check-circle', color: 'success' },
  { title: 'Warning', value: 'warning', icon: 'mdi-alert', color: 'warning' },
  { title: 'Error', value: 'error', icon: 'mdi-alert-circle', color: 'error' },
  { title: 'Update', value: 'update', icon: 'mdi-update', color: 'primary' },
  { title: 'Security', value: 'security', icon: 'mdi-shield', color: 'secondary' }
];

const notificationPriorities = [
  { title: 'Low', value: 'low', color: 'grey' },
  { title: 'Normal', value: 'normal', color: 'primary' },
  { title: 'High', value: 'high', color: 'warning' },
  { title: 'Critical', value: 'critical', color: 'error' }
];

const availableTags = [
  'Performance',
  'Security',
  'Update',
  'Maintenance',
  'Feature',
  'Bug',
  'System',
  'User'
];

const submitNotification = async () => {
  const { valid } = await notificationForm.value.validate();

  if (!valid) return;

  isSubmitting.value = true;
  try {

    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify(newNotification.value)
    });

    if (!response.ok) {
      console.error('Failed to send notification', response);
      throw new Error('Failed to send notification');
    }

    const data = await response.json();

    notifications.value.unshift(data);

    showNotificationDialog.value = false;
    applySnackbar('Notification sent successfully', 'success');

    newNotification.value = {
      title: '',
      message: '',
      type: 'info',
      priority: 'normal',
      tags: [],
      isSticky: false,
      requiresAction: false,
      actionText: ''
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    applySnackbar('Error sending notification', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const fetchNotifications = async () => {
  try {
    const response = await fetch('/api/notifications', {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch notifications', response);
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    notifications.value = data.notifications || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    notifications.value = [];
  }
}

const getNotificationIcon = (type: string) => {
  const icons = {
    info: 'mdi-information',
    success: 'mdi-check-circle',
    warning: 'mdi-alert',
    error: 'mdi-alert-circle',
    update: 'mdi-update',
    security: 'mdi-shield'
  }
  return icons[type as keyof typeof icons] || 'mdi-bell'
}

const getNotificationColor = (type: string) => {
  const colors = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error',
    update: 'primary',
    security: 'secondary'
  }
  return colors[type as keyof typeof colors] || 'primary'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'grey',
    normal: 'primary',
    high: 'warning',
    critical: 'error'
  }
  return colors[priority as keyof typeof colors] || 'primary'
}
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

  } catch (error) {
    console.error('[Dashboard] Erreur d\'initialisation:', error);
    router.push('/login');
  } finally {
    isLoading.value = false;
  }

  fetchNotifications();
});
</script>

<style scoped>
main {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-background));
  position: relative;
  flex: 1;
  width: 100%;
}

.main-content {
  background-color: rgb(var(--v-theme-background));
  flex: 1;
  width: 100%;
}

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

.feature-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
      rgba(var(--v-theme-primary), 0.8),
      rgba(var(--v-theme-secondary), 0.8));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.card-content {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.card-hover .icon-wrapper {
  transform: scale(1.1);
}

.icon-pulse {
  animation: pulse 4s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.explore-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.explore-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.explore-btn:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.disabled-card {
  opacity: 0.7;
  filter: grayscale(0.5);
}

.premium-chip {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #000;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.card-hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stats-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
}

.section-title {
  position: relative;
  padding-left: 1rem;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(to bottom, var(--v-theme-primary), var(--v-theme-secondary));
  border-radius: 2px;
}

.activity-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  height: 100%;
}

.quick-action-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.notification-item {
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
}

.notification-item .v-list-item-title {
  font-weight: 500;
}

.notification-item .v-list-item-subtitle {
  margin-top: 4px;
  opacity: 0.8;
}
</style>