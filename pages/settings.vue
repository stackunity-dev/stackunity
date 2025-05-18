<template>
  <main class="main-content">
    <v-container fluid class="pa-6">
      <v-row>
        <v-col cols="12" lg="3">
          <v-card class="rounded-lg mb-4" elevation="2">
            <v-list nav>
              <v-list-item prepend-icon="mdi-web" :title="t().navigation.website" value="website"
                @click="activeTab = 'website'" rounded="lg" :active="activeTab === 'website'" color="primary" />
              <v-list-item prepend-icon="mdi-palette-outline" :title="t().navigation.appearance" value="appearance"
                @click="activeTab = 'appearance'" rounded="lg" :active="activeTab === 'appearance'" color="primary" />
              <v-list-item prepend-icon="mdi-shield-outline" :title="t().navigation.security" value="security"
                @click="activeTab = 'security'" rounded="lg" :active="activeTab === 'security'" color="primary" />
              <v-divider class="my-2"></v-divider>
              <v-list-item prepend-icon="mdi-cookie-settings-outline" :title="t().navigation.cookies" value="cookies"
                @click="activeTab = 'cookies'" rounded="lg" :active="activeTab === 'cookies'" color="primary" />
              <v-list-item prepend-icon="mdi-delete-outline" :title="t().navigation.dataPrivacy" value="privacy"
                @click="activeTab = 'privacy'" rounded="lg" :active="activeTab === 'privacy'" color="primary" />
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" lg="9">
          <v-card class="rounded-lg" elevation="2">
            <div v-if="activeTab === 'website'">
              <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center"
                id="website-settings-title">
                <v-icon color="white" class="mr-2" aria-hidden="true">mdi-web</v-icon>
                <h2 class="text-h5 mb-0">{{ t().website.title }}</h2>
              </v-card-title>
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4" role="status">
                  {{ t().website.info }}
                </v-alert>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="website.name" :label="t().website.name.label" variant="outlined"
                      density="comfortable" prepend-icon="mdi-domain" class="mb-3" id="website-name"
                      :rules="[(v) => v.length > 0 || t().website.name.required]" aria-required="true"
                      aria-describedby="website-name-desc" />

                    <v-text-field v-model="website.url" :label="t().website.url.label" variant="outlined"
                      density="comfortable" prepend-icon="mdi-web" class="mb-3" id="website-url"
                      :rules="[(v) => v && v.includes('https://') || t().website.url.invalid]" aria-required="true"
                      aria-describedby="website-url-desc" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-card variant="outlined" class="mb-3 pa-3">
                      <v-card-title class="text-subtitle-1 font-weight-bold">{{ t().website.analysis.title
                      }}</v-card-title>
                      <v-card-text class="pa-0">
                        <p class="text-body-2 mb-3">{{ t().website.analysis.description }}</p>
                        <v-btn color="secondary" variant="outlined" prepend-icon="mdi-magnify"
                          @click="fetchAnalyzisUrls(website.url)" :loading="loading"
                          :disabled="!isValidUrl(website.url)" block aria-label="Analyze the website">
                          <span v-if="loading">{{ t().website.analysis.analyzing }}</span>
                          <span v-else>{{ t().website.analysis.button }}</span>
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <v-expand-transition>
                  <div v-if="analyzisUrls.length > 0" class="mt-4">
                    <v-divider class="my-4" role="separator"></v-divider>

                    <div class="d-flex justify-space-between align-center mb-3">
                      <h3 class="text-h6 font-weight-bold">{{ t().website.analysis.urlsDetected }} ({{
                        analyzisUrls.length
                      }})</h3>
                      <div>
                        <v-btn color="secondary" variant="outlined" density="comfortable" size="small"
                          prepend-icon="mdi-content-copy" @click="copyUrlsToClipboard" aria-label="Copy all URLs">
                          {{ t().website.analysis.copy }}
                        </v-btn>
                        <v-btn color="error" variant="text" density="comfortable" size="small" prepend-icon="mdi-close"
                          class="ml-2" @click="clearAnalyzisUrls" aria-label="Clear URL list">
                          {{ t().website.analysis.clear }}
                        </v-btn>
                      </div>
                    </div>

                    <v-card variant="outlined" class="rounded-lg">
                      <v-card-text class="pa-0">
                        <v-list density="compact" lines="one" class="urls-list" aria-label="List of detected URLs">
                          <v-list-item v-for="(url, index) in displayedUrls" :key="index" :title="url"
                            prepend-icon="mdi-link-variant" :aria-label="`URL ${index + 1}: ${url}`">
                            <template v-slot:append>
                              <v-btn icon size="small" variant="text" color="primary" @click="openUrl(url)"
                                :aria-label="`Open ${url} in a new tab`">
                                <v-icon aria-hidden="true">mdi-open-in-new</v-icon>
                              </v-btn>
                            </template>
                          </v-list-item>

                          <v-list-item v-if="analyzisUrls.length === 0" class="text-center py-4">
                            <v-list-item-title>{{ t().website.analysis.noUrls }}</v-list-item-title>
                          </v-list-item>
                        </v-list>

                        <div v-if="analyzisUrls.length > urlsPerPage" class="text-center py-2 bg-grey-lighten-4">
                          <v-pagination v-model="urlsPage" :length="Math.ceil(analyzisUrls.length / urlsPerPage)"
                            density="comfortable" aria-label="URL pagination" total-visible="7"></v-pagination>
                        </div>
                      </v-card-text>
                    </v-card>

                    <div v-if="analysisSummary" class="mt-6">
                      <h3 class="text-h6 font-weight-bold mb-3">{{ t().website.summary.title }}</h3>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-card variant="outlined" class="rounded-lg">
                            <v-card-text class="text-center">
                              <div class="text-overline mb-1">{{ t().website.summary.totalPages }}</div>
                              <div class="text-h4 font-weight-bold">{{ analysisSummary.totalPages }}</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-card variant="outlined" class="rounded-lg">
                            <v-card-text class="text-center">
                              <div class="text-overline mb-1">{{ t().website.summary.averageLoadTime }}</div>
                              <div class="text-h4 font-weight-bold">{{ Math.round(analysisSummary.averageLoadTime) }}ms
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-card variant="outlined" class="rounded-lg"
                            :color="analysisSummary.totalWarnings > 0 ? 'warning' : 'success'">
                            <v-card-text class="text-center">
                              <div class="text-overline mb-1">{{ t().website.summary.warnings }}</div>
                              <div class="text-h4 font-weight-bold">{{ analysisSummary.totalWarnings }}</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </div>

                    <div v-if="hasSitemap" class="mt-6">
                      <div class="d-flex justify-space-between align-center mb-3">
                        <h3 class="text-h6 font-weight-bold">{{ t().website.sitemap.title }}</h3>
                        <div>
                          <v-btn color="secondary" variant="outlined" density="comfortable" size="small"
                            prepend-icon="mdi-content-copy" @click="copySitemapToClipboard" aria-label="Copy sitemap">
                            {{ t().website.sitemap.copy }}
                          </v-btn>
                          <v-btn color="primary" variant="tonal" density="comfortable" size="small"
                            prepend-icon="mdi-download" class="ml-2" @click="downloadSitemap"
                            aria-label="Download sitemap">
                            {{ t().website.sitemap.download }}
                          </v-btn>
                        </div>
                      </div>

                      <v-card class="rounded-lg">
                        <v-card-text>
                          <pre class="code-block overflow-auto rounded" style="max-height: 300px"><code ref="codeBlock">{{
                            sitemapContent }}</code></pre>
                        </v-card-text>
                      </v-card>
                    </div>
                  </div>
                </v-expand-transition>

                <v-divider class="my-4" role="separator"></v-divider>

                <div class="d-flex justify-end">
                  <v-btn color="primary" variant="elevated" prepend-icon="mdi-content-save" @click="saveWebsiteData"
                    aria-label="Enregistrer les paramètres du site web"
                    :disabled="!isValidUrl(website.url) || !analyzisUrls.length">
                    {{ t().website.save }}
                  </v-btn>
                </div>
              </v-card-text>
            </div>

            <div v-if="activeTab === 'appearance'">
              <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-palette-outline</v-icon>
                {{ t().appearance.title }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row class="mb-4">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-card :color="isActiveTheme('greenAmbiance') ? 'primary' : 'surface'" variant="outlined"
                          class="d-flex flex-column align-center pa-4" hover @click="changeTheme('greenAmbiance')">
                          <v-icon size="large"
                            :color="isActiveTheme('greenAmbiance') ? 'white' : 'primary'">mdi-weather-sunny</v-icon>
                          <span class="mt-2" :class="{ 'text-white': isActiveTheme('greenAmbiance') }">{{
                            t().appearance.theme.greenAmbiance }}</span>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card :color="isActiveTheme('dark') ? 'primary' : 'surface'" variant="outlined"
                          class="d-flex flex-column align-center pa-4" hover @click="changeTheme('dark')">
                          <v-icon size="large"
                            :color="isActiveTheme('dark') ? 'white' : 'primary'">mdi-weather-night</v-icon>
                          <span class="mt-2" :class="{ 'text-white': isActiveTheme('dark') }">{{
                            t().appearance.theme.dark
                          }}</span>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <v-card :color="isActiveTheme('system') ? 'primary' : 'surface'" variant="outlined"
                          class="d-flex flex-column align-center pa-4" hover @click="changeTheme('system')">
                          <v-icon size="large"
                            :color="isActiveTheme('system') ? 'white' : 'primary'">mdi-theme-light-dark</v-icon>
                          <span class="mt-2" :class="{ 'text-white': isActiveTheme('system') }">{{
                            t().appearance.theme.system
                          }}</span>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex justify-end">
                  <v-btn color="primary" variant="elevated" @click="saveAppearance">
                    <v-icon start>mdi-content-save</v-icon>
                    {{ t().appearance.save }}
                  </v-btn>
                </div>
              </v-card-text>
            </div>

            <div v-if="activeTab === 'security'">
              <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-security</v-icon>
                {{ t().security.title }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4">
                  {{ t().security.info }}
                </v-alert>

                <v-form class="mb-6">

                  <v-text-field v-model="security.newPassword" :label="t().security.changePassword.newPassword"
                    variant="outlined" type="password" class="mb-3"></v-text-field>

                  <v-text-field v-model="security.confirmPassword" :label="t().security.changePassword.confirmPassword"
                    variant="outlined" type="password" class="mb-3"></v-text-field>
                </v-form>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex justify-end">
                  <v-btn color="primary" variant="elevated" @click="saveSecurity">
                    <v-icon start>mdi-content-save</v-icon>
                    {{ t().security.changePassword.update }}
                  </v-btn>
                </div>
              </v-card-text>
            </div>

            <div v-if="activeTab === 'cookies'">
              <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-cookie-settings-outline</v-icon>
                {{ t().cookies.title }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4">
                  {{ t().cookies.info }}
                </v-alert>

                <v-card color="surface" variant="outlined" class="mb-6 pa-4">
                  <h3 class="text-h6 font-weight-bold mb-3">{{ t().cookies.preferences.title }}</h3>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>{{ t().cookies.necessary.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ t().cookies.necessary.description }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t().cookies.preferences.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ t().cookies.preferences.description }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>

                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <v-switch v-model="cookies.essential" :label="t().cookies.necessary.title" color="primary"
                        disabled hide-details inset></v-switch>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption mt-1">
                      {{ t().cookies.necessary.description }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-divider class="my-2"></v-divider>

                  <v-list-item>
                    <v-list-item-title>
                      <v-switch v-model="cookies.functional" :label="t().cookies.statistics.title" color="primary"
                        hide-details inset></v-switch>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption mt-1">
                      {{ t().cookies.statistics.description }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <v-divider class="my-2"></v-divider>

                  <v-list-item>
                    <v-list-item-title>
                      <v-switch v-model="cookies.analytics" :label="t().cookies.marketing.title" color="primary"
                        hide-details inset></v-switch>
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption mt-1">
                      {{ t().cookies.marketing.description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex justify-space-between">
                  <v-btn color="error" variant="outlined" @click="resetCookies">
                    <v-icon start>mdi-cookie-remove</v-icon>
                    {{ t().cookies.deleteAll }}
                  </v-btn>
                  <v-btn color="primary" variant="elevated" @click="saveCookies">
                    <v-icon start>mdi-content-save</v-icon>
                    {{ t().cookies.save }}
                  </v-btn>
                </div>
              </v-card-text>
            </div>

            <div v-if="activeTab === 'privacy'">
              <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-delete-outline</v-icon>
                {{ t().privacy.title }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-alert type="warning" variant="tonal" class="mb-4">
                  {{ t().privacy.info }}
                </v-alert>

                <div class="text-subtitle-1 font-weight-bold mb-3">{{ t().privacy.exportData.title }}</div>
                <p class="mb-4">{{ t().privacy.exportData.description }}</p>
                <v-btn color="primary" variant="outlined" prepend-icon="mdi-download" @click="exportUserData"
                  class="mb-6" disabled>{{ t().privacy.exportData.button }}</v-btn>

                <v-divider class="my-4"></v-divider>

                <div class="text-subtitle-1 font-weight-bold mb-3 text-success">{{ t().privacy.premiumStatus.title }}
                </div>
                <p class="mb-4">
                  {{ t().privacy.premiumStatus.description }}
                  <v-chip color="success mr-1" v-if="userStore.user?.isPremium">
                    {{ t().privacy.premiumStatus.premium }}
                  </v-chip>
                  <v-chip color="info" v-if="userStore.user.isStandard && !userStore.user?.isPremium">
                    {{ t().privacy.premiumStatus.standard }}
                  </v-chip>
                  <v-chip color="warning"
                    v-else-if="userStore.user?.isTrial && !userStore.user?.isPremium && !userStore.user.isStandard">
                    {{ t().privacy.premiumStatus.trial }}
                  </v-chip>
                  <v-chip color="error" v-else-if="!userStore.user?.isPremium && !userStore.user.isStandard">
                    {{ t().privacy.premiumStatus.free }}
                  </v-chip>
                </p>

                <v-divider class="my-4"></v-divider>

                <div class="text-subtitle-1 font-weight-bold mb-3 text-error">{{ t().privacy.deleteAccount.title }}
                </div>
                <p class="mb-4">
                  {{ t().privacy.deleteAccount.description }}
                </p>

                <div v-if="showDeleteAccount">
                  <v-text-field v-model="deleteAccountConfirmation" :label="t().privacy.deleteAccount.confirmation"
                    variant="outlined" hint="This action is irreversible" persistent-hint class="mb-4"></v-text-field>

                  <div class="d-flex">
                    <v-btn color="error" variant="tonal" :disabled="deleteAccountConfirmation !== 'DELETE'"
                      @click="confirmDeleteAccount" class="mr-2">
                      {{ t().privacy.deleteAccount.confirm }}
                    </v-btn>
                    <v-btn color="grey" variant="text" @click="showDeleteAccount = false">
                      {{ t().privacy.deleteAccount.cancel }}
                    </v-btn>
                  </div>
                </div>
                <v-btn v-else color="error" variant="outlined" prepend-icon="mdi-account-remove"
                  @click="showDeleteAccount = true">
                  {{ t().privacy.deleteAccount.button }}
                </v-btn>
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <Snackbar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="2000" />
    </v-container>
  </main>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import Snackbar from '../components/snackbar.vue';
import { useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';

definePageMeta({
  layout: 'dashboard'
});

useHead({
  title: 'Settings - StackUnity',
  meta: [
    { name: 'description', content: 'Manage your account settings and preferences' },
    { name: 'keywords', content: 'StackUnity, settings, preferences, account, user settings' },
    { name: 'author', content: 'StackUnity' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Settings - StackUnity' },
    { name: 'og:description', content: 'Manage your account settings and preferences' },
    { name: 'og:image', content: '/logo/stackunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/settings' }
  ]
});

interface AnalysisSummary {
  totalPages: number;
  averageLoadTime: number;
  totalWarnings: number;
}

const vuetifyTheme = useTheme();
const userStore = useUserStore();
const t = useTranslations('settings');

const activeTab = ref('website');
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const showDeleteAccount = ref(false);
const deleteAccountConfirmation = ref('');
const loading = ref(false);
const analyzisUrls = ref([]);
const urlsPage = ref(1);
const urlsPerPage = ref(10);

const sitemapContent = ref('');
const hasSitemap = ref(false);
const analysisSummary = ref<AnalysisSummary | null>(null);
const codeBlock = ref<HTMLPreElement | null>(null);

const website = ref({
  name: '',
  url: '',
  urls: [],
  sitemap: ''
});


const isClient = typeof window !== 'undefined';

const theme = ref<string>(isClient ? localStorage.getItem('app_theme') || 'greenAmbiance' : 'greenAmbiance');

const changeTheme = (newTheme: string) => {
  if (['greenAmbiance', 'dark', 'system'].includes(newTheme)) {
    theme.value = newTheme;

    if (isClient) {
      if (newTheme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'greenAmbiance';
      } else {
        vuetifyTheme.global.name.value = newTheme;
      }

      localStorage.setItem('app_theme', newTheme);
    }
  }
};

const loadTheme = () => {
  if (isClient) {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme) {
      if (savedTheme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'greenAmbiance';
      } else {
        vuetifyTheme.global.name.value = savedTheme;
      }
      theme.value = savedTheme;
    }
  }
};

const security = ref({
  newPassword: '',
  confirmPassword: ''
});

const cookies = ref({
  essential: true,
  functional: isClient ? localStorage.getItem('cookies_functional') === 'true' : true,
  analytics: isClient ? localStorage.getItem('cookies_analytics') === 'true' : false,
  marketing: isClient ? localStorage.getItem('cookies_marketing') === 'true' : false
});


const saveAppearance = () => {
  if (isClient) {
    localStorage.setItem('app_theme', theme.value);
    if (theme.value === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'greenAmbiance';
    } else {
      vuetifyTheme.global.name.value = theme.value;
    }
  }
  setTimeout(() => {
    showSnackbar(t().notifications.appearanceUpdated, 'success');
  }, 500);
};

const saveSecurity = async () => {
  try {

    if (!security.value.newPassword || !security.value.confirmPassword) {
      snackbarText.value = t().notifications.passwordError;
      snackbarColor.value = 'error';
      snackbar.value = true;
      return;
    }

    if (security.value.newPassword !== security.value.confirmPassword) {
      snackbarText.value = t().notifications.passwordError;
      snackbarColor.value = 'error';
      snackbar.value = true;
      return;
    }

    await userStore.resetPassword(security.value.newPassword);
    snackbarText.value = t().notifications.passwordChanged;
    snackbarColor.value = 'success';
    snackbar.value = true;
  } catch (error) {
    snackbarText.value = t().notifications.passwordError;
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};

const saveCookies = () => {
  if (isClient) {
    localStorage.setItem('cookies_functional', cookies.value.functional.toString());
    localStorage.setItem('cookies_analytics', cookies.value.analytics.toString());
    localStorage.setItem('cookies_marketing', cookies.value.marketing.toString());
  }
  showSnackbar(t().cookies.save, 'success');
};

const resetCookies = () => {
  cookies.value.functional = false;
  cookies.value.analytics = false;
  cookies.value.marketing = false;

  if (isClient) {
    localStorage.setItem('cookies_functional', 'false');
    localStorage.setItem('cookies_analytics', 'false');
    localStorage.setItem('cookies_marketing', 'false');
  }

  showSnackbar(t().notifications.cookiesDeleted, 'success');
};

const exportUserData = () => {
  setTimeout(() => {
    snackbarText.value = t().notifications.dataCopied;
    snackbarColor.value = 'success';
    snackbar.value = true;
  }, 1000);
};

const confirmDeleteAccount = async () => {
  try {
    await userStore.deleteAccount();
    snackbarText.value = t().notifications.accountDeleted;
    snackbarColor.value = 'success';
    snackbar.value = true;
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } catch (error) {
    snackbarText.value = t().notifications.error;
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};


onMounted(() => {
  loadTheme();

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme.value === 'system') {
        vuetifyTheme.global.name.value = e.matches ? 'dark' : 'greenAmbiance';
      }
    });
  }

  const savedFunctional = localStorage.getItem('cookies_functional');
  const savedAnalytics = localStorage.getItem('cookies_analytics');
  const savedMarketing = localStorage.getItem('cookies_marketing');

  if (savedFunctional !== null) {
    cookies.value.functional = savedFunctional === 'true';
  }
  if (savedAnalytics !== null) {
    cookies.value.analytics = savedAnalytics === 'true';
  }
  if (savedMarketing !== null) {
    cookies.value.marketing = savedMarketing === 'true';
  }
  loadStoredWebsiteData();
});


const loadStoredWebsiteData = () => {
  if (userStore.websiteData) {

    website.value.name = userStore.websiteData.website_name || '';
    website.value.url = userStore.websiteData.main_url || '';
    if (userStore.websiteData.urls && Array.isArray(userStore.websiteData.urls) && userStore.websiteData.urls.length > 0) {
      analyzisUrls.value = userStore.websiteData.urls;
    }

    if (userStore.websiteData.generated_sitemap) {
      sitemapContent.value = userStore.websiteData.generated_sitemap;
      hasSitemap.value = true;

      nextTick(() => {
        if (codeBlock.value) {
          highlightCode(codeBlock.value);
        }
      });
    }
  }
};

const isActiveTheme = (themeName: string): boolean => {
  return theme.value === themeName;
};

const fetchAnalyzisUrls = async (url: string) => {
  if (!isValidUrl(url)) {
    showSnackbar(t().notifications.invalidUrl, 'error');
    return;
  }

  loading.value = true;
  try {
    analyzisUrls.value = [];
    sitemapContent.value = '';
    hasSitemap.value = false;
    analysisSummary.value = null;

    const response = await fetch('/api/analyze/website-analyzer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.urlMap && typeof data.urlMap === 'object') {
      const baseUrl = Object.keys(data.urlMap)[0];
      analyzisUrls.value = data.urlMap[baseUrl] || [];
    } else if (data.visitedURLs && Array.isArray(data.visitedURLs)) {
      analyzisUrls.value = data.visitedURLs;
    } else if (data.rankedUrls && Array.isArray(data.rankedUrls)) {
      analyzisUrls.value = data.rankedUrls;
    } else {
      analyzisUrls.value = [];
    }

    if (analyzisUrls.value.length === 0) {
      showSnackbar('No URLs found during analysis', 'info');
    } else {
      showSnackbar(`${analyzisUrls.value.length} URLs found`, 'success');
    }

    if (data.generatedSitemap) {
      sitemapContent.value = data.generatedSitemap;
      hasSitemap.value = true;

      nextTick(() => {
        if (codeBlock.value) {
          highlightCode(codeBlock.value);
        }
      });
    }

    if (data.summary) {
      analysisSummary.value = data.summary;
    }
  } catch (error) {
    console.error('Error during website analysis:', error);
    showSnackbar(`Error analyzing the website: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    analyzisUrls.value = [];
  } finally {
    loading.value = false;
  }
};

const isValidUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const copyUrlsToClipboard = () => {
  if (analyzisUrls.value.length > 0) {
    navigator.clipboard.writeText(analyzisUrls.value.join('\n'))
      .then(() => showSnackbar('URLs copied to clipboard', 'success'))
      .catch(() => showSnackbar('Unable to copy URLs', 'error'));
  }
};

const clearAnalyzisUrls = () => {
  analyzisUrls.value = [];
};

const openUrl = (url: string) => {
  window.open(url, '_blank');
};

const saveWebsiteData = async () => {
  try {
    if (!website.value.name) {
      showSnackbar('Website name is required', 'error');
      return;
    }

    if (!isValidUrl(website.value.url)) {
      showSnackbar('Please enter a valid URL starting with https://', 'error');
      return;
    }

    const websiteData = {
      name: website.value.name,
      url: website.value.url,
      urls: analyzisUrls.value || [],
      sitemap: sitemapContent.value || ''
    };

    const response = await userStore.insertWebsiteData(
      websiteData.name,
      websiteData.url,
      websiteData.urls,
      websiteData.sitemap
    );

    if (response && response.success) {
      showSnackbar('Website settings saved', 'success');
    } else {
      showSnackbar('An error occurred while saving the website settings', 'error');
    }
  } catch (error) {
    console.error('Error during saving website data:', error);
    showSnackbar('An error occurred while saving the website settings', 'error');
  }
};

const displayedUrls = computed(() => {
  const start = (urlsPage.value - 1) * urlsPerPage.value;
  const end = start + urlsPerPage.value;
  return analyzisUrls.value.slice(start, end);
});

const copySitemapToClipboard = () => {
  if (sitemapContent.value) {
    navigator.clipboard.writeText(sitemapContent.value)
      .then(() => showSnackbar('Sitemap copied to clipboard', 'success'))
      .catch(() => showSnackbar('Unable to copy sitemap', 'error'));
  }
};

const downloadSitemap = () => {
  if (sitemapContent.value) {
    const blob = new Blob([sitemapContent.value], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar('Sitemap downloaded', 'success');
  }
};

const highlightCode = (codeBlock: HTMLPreElement) => {
  if (codeBlock) {
    hljs.highlightElement(codeBlock);
  }
};

watch(sitemapContent, () => {
  nextTick(() => {
    if (codeBlock.value) {
      highlightCode(codeBlock.value);
    }
  });
});

</script>
<style scoped>
main {
  min-height: 100vh;
  background-color: var(--v-theme-background);
  position: relative;
  flex: 1;
  width: 100%;
}

.main-content {
  background-color: var(--v-theme-background);
  flex: 1;
  width: 100%;
}

.v-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.code-block {
  margin: 0;
  padding: 0;
  border-radius: 8px;
  background-color: #282c34;
  overflow: auto;
  max-height: 60vh;
}

.code-block code {
  display: block;
  padding: 1rem;
  font-family: "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
