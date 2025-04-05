<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12" lg="3">
        <v-card class="rounded-lg mb-4" elevation="2">
          <v-list nav>
            <v-list-item prepend-icon="mdi-palette-outline" title="Appearance" value="appearance"
              @click="activeTab = 'appearance'" rounded="lg" :active="activeTab === 'appearance'" color="primary" />
            <v-list-item prepend-icon="mdi-shield-outline" title="Security" value="security"
              @click="activeTab = 'security'" rounded="lg" :active="activeTab === 'security'" color="primary" />
            <v-divider class="my-2"></v-divider>
            <v-list-item prepend-icon="mdi-cookie-settings-outline" title="Cookies" value="cookies"
              @click="activeTab = 'cookies'" rounded="lg" :active="activeTab === 'cookies'" color="primary" />
            <v-list-item prepend-icon="mdi-delete-outline" title="Data & Privacy" value="privacy"
              @click="activeTab = 'privacy'" rounded="lg" :active="activeTab === 'privacy'" color="primary" />
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" lg="9">
        <v-card class="rounded-lg" elevation="2">
          <div v-if="activeTab === 'appearance'">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-palette-outline</v-icon>
              Appearance
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row class="mb-4">
                <v-col cols="12">
                  <div class="text-subtitle-1 font-weight-bold mb-3">Theme</div>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-card :color="isActiveTheme('light') ? 'primary' : 'surface'" variant="outlined"
                        class="d-flex flex-column align-center pa-4" hover @click="changeTheme('light')">
                        <v-icon size="large"
                          :color="isActiveTheme('light') ? 'white' : 'primary'">mdi-weather-sunny</v-icon>
                        <span class="mt-2" :class="{ 'text-white': isActiveTheme('light') }">Light</span>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card :color="isActiveTheme('dark') ? 'primary' : 'surface'" variant="outlined"
                        class="d-flex flex-column align-center pa-4" hover @click="changeTheme('dark')">
                        <v-icon size="large"
                          :color="isActiveTheme('dark') ? 'white' : 'primary'">mdi-weather-night</v-icon>
                        <span class="mt-2" :class="{ 'text-white': isActiveTheme('dark') }">Dark</span>
                      </v-card>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <v-card :color="isActiveTheme('system') ? 'primary' : 'surface'" variant="outlined"
                        class="d-flex flex-column align-center pa-4" hover @click="changeTheme('system')">
                        <v-icon size="large"
                          :color="isActiveTheme('system') ? 'white' : 'primary'">mdi-theme-light-dark</v-icon>
                        <span class="mt-2" :class="{ 'text-white': isActiveTheme('system') }">System</span>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-end">
                <v-btn color="primary" variant="elevated" @click="saveAppearance">
                  <v-icon start>mdi-content-save</v-icon>
                  Save
                </v-btn>
              </div>
            </v-card-text>
          </div>

          <div v-if="activeTab === 'security'">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-shield-outline</v-icon>
              Security
            </v-card-title>
            <v-card-text class="pa-4">
              <v-alert type="info" variant="tonal" class="mb-4">
                Manage your account security settings. We recommend using a strong password and changing it regularly.
              </v-alert>

              <div class="text-subtitle-1 font-weight-bold mb-3">Change Password</div>

              <v-form class="mb-6">

                <v-text-field v-model="security.newPassword" label="New Password" variant="outlined" type="password"
                  class="mb-3"></v-text-field>

                <v-text-field v-model="security.confirmPassword" label="Confirm New Password" variant="outlined"
                  type="password" class="mb-3"></v-text-field>
              </v-form>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-end">
                <v-btn color="primary" variant="elevated" @click="saveSecurity">
                  <v-icon start>mdi-content-save</v-icon>
                  Update Password
                </v-btn>
              </div>
            </v-card-text>
          </div>

          <div v-if="activeTab === 'cookies'">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-cookie-settings-outline</v-icon>
              Cookie Preferences
            </v-card-title>
            <v-card-text class="pa-4">
              <v-alert type="info" variant="tonal" class="mb-4">
                Manage your cookie preferences. Essential cookies are necessary for the site to function and cannot be
                disabled.
              </v-alert>

              <v-card color="surface" variant="outlined" class="mb-6 pa-4">
                <h3 class="text-h6 font-weight-bold mb-3">Current Preferences Status</h3>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Essential cookies:</v-list-item-title>
                    <v-list-item-subtitle>Enabled</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Functional cookies:</v-list-item-title>
                    <v-list-item-subtitle>{{ cookies.functional ? 'Enabled' : 'Disabled' }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>

              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <v-switch v-model="cookies.essential" label="Essential cookies" color="primary" disabled
                      hide-details inset></v-switch>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption mt-1">
                    Required for the site to function, they cannot be disabled.
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <v-switch v-model="cookies.functional" label="Functional cookies" color="primary" hide-details
                      inset></v-switch>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption mt-1">
                    Allow us to remember your preferences and personalize your experience.
                  </v-list-item-subtitle>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item>
                  <v-list-item-title>
                    <v-switch v-model="cookies.analytics" label="Analytics cookies" color="primary" hide-details
                      inset></v-switch>
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption mt-1">
                    Help us understand how you use our site to improve it.
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-space-between">
                <v-btn color="error" variant="outlined" @click="resetCookies">
                  <v-icon start>mdi-cookie-remove</v-icon>
                  Delete all cookies
                </v-btn>
                <v-btn color="primary" variant="elevated" @click="saveCookies">
                  <v-icon start>mdi-content-save</v-icon>
                  Save
                </v-btn>
              </div>
            </v-card-text>
          </div>

          <div v-if="activeTab === 'privacy'">
            <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
              <v-icon color="white" class="mr-2">mdi-delete-outline</v-icon>
              Data & Privacy
            </v-card-title>
            <v-card-text class="pa-4">
              <v-alert type="warning" variant="tonal" class="mb-4">
                Warning: Actions on this page regarding your data are irreversible.
              </v-alert>

              <div class="text-subtitle-1 font-weight-bold mb-3">Data Export</div>
              <p class="mb-4">You can download all your personal data stored on our platform.</p>
              <v-btn color="primary" variant="outlined" prepend-icon="mdi-download" @click="exportUserData" class="mb-6"
                disabled>Export my data</v-btn>

              <v-divider class="my-4"></v-divider>

              <div class="text-subtitle-1 font-weight-bold mb-3 text-success">Premium Status</div>
              <p class="mb-4">
                Current status:
                <v-chip color="success" v-if="userStore.user?.isPremium">
                  Premium
                </v-chip>
                <v-chip color="error" v-else>
                  Free
                </v-chip>
              </p>

              <v-divider class="my-4"></v-divider>

              <div class="text-subtitle-1 font-weight-bold mb-3 text-error">Account Deletion</div>
              <p class="mb-4">Deleting your account will permanently erase all your personal data, including your
                projects, settings, and history.</p>

              <div v-if="showDeleteAccount">
                <v-text-field v-model="deleteAccountConfirmation" label="Type 'DELETE' to confirm" variant="outlined"
                  hint="This action is irreversible" persistent-hint class="mb-4"></v-text-field>

                <div class="d-flex">
                  <v-btn color="error" variant="tonal" :disabled="deleteAccountConfirmation !== 'DELETE'"
                    @click="confirmDeleteAccount" class="mr-2">
                    Confirm deletion
                  </v-btn>
                  <v-btn color="grey" variant="text" @click="showDeleteAccount = false">
                    Cancel
                  </v-btn>
                </div>
              </div>
              <v-btn v-else color="error" variant="outlined" prepend-icon="mdi-account-remove"
                @click="showDeleteAccount = true">
                Delete my account
              </v-btn>
            </v-card-text>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <Snackbar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="2000" />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';
import Snackbar from '../components/snackbar.vue';
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
  ]
});

const vuetifyTheme = useTheme();
const userStore = useUserStore();

const activeTab = ref('security');
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const showDeleteAccount = ref(false);
const deleteAccountConfirmation = ref('');

const theme = ref<string>(process.client ? localStorage.getItem('app_theme') || 'dark' : 'dark');

const changeTheme = (newTheme: string) => {
  if (['light', 'dark', 'system'].includes(newTheme)) {
    theme.value = newTheme;

    if (process.client) {
      if (newTheme === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        vuetifyTheme.global.name.value = prefersDark ? 'dark' : 'light';
      } else {
        vuetifyTheme.global.name.value = newTheme;
      }

      localStorage.setItem('app_theme', newTheme);
    }
  }
};

const security = ref({
  newPassword: '',
  confirmPassword: ''
});

const cookies = ref({
  essential: true,
  functional: process.client ? localStorage.getItem('cookies_functional') === 'true' : true,
  analytics: process.client ? localStorage.getItem('cookies_analytics') === 'true' : false,
  marketing: process.client ? localStorage.getItem('cookies_marketing') === 'true' : false
});


const saveAppearance = () => {
  setTimeout(() => {
    showSnackbar('Appearance settings updated', 'success');
  }, 500);
};

const saveSecurity = async () => {
  try {

    if (!security.value.newPassword || !security.value.confirmPassword) {
      snackbarText.value = 'New password and confirm password are required';
      snackbarColor.value = 'error';
      snackbar.value = true;
      return;
    }

    if (security.value.newPassword !== security.value.confirmPassword) {
      snackbarText.value = 'Passwords do not match';
      snackbarColor.value = 'error';
      snackbar.value = true;
      return;
    }

    await userStore.resetPassword(security.value.newPassword);
    snackbarText.value = 'Password updated successfully';
    snackbarColor.value = 'success';
    snackbar.value = true;
  } catch (error) {
    snackbarText.value = 'An error occurred while updating the password';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};

const saveCookies = () => {
  if (process.client) {
    localStorage.setItem('cookies_functional', cookies.value.functional.toString());
    localStorage.setItem('cookies_analytics', cookies.value.analytics.toString());
    localStorage.setItem('cookies_marketing', cookies.value.marketing.toString());
  }
  showSnackbar('Cookie preferences updated', 'success');
};

const resetCookies = () => {
  cookies.value.functional = false;
  cookies.value.analytics = false;
  cookies.value.marketing = false;

  if (process.client) {
    localStorage.setItem('cookies_functional', 'false');
    localStorage.setItem('cookies_analytics', 'false');
    localStorage.setItem('cookies_marketing', 'false');
  }

  showSnackbar('Cookies deleted successfully', 'success');
};

const exportUserData = () => {
  setTimeout(() => {
    snackbarText.value = 'Your data has been prepared for download';
    snackbarColor.value = 'success';
    snackbar.value = true;
  }, 1000);
};

const confirmDeleteAccount = async () => {
  try {
    await userStore.deleteAccount();
    snackbarText.value = 'Your account has been deleted successfully';
    snackbarColor.value = 'success';
    snackbar.value = true;
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } catch (error) {
    snackbarText.value = 'An error occurred while deleting your account';
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

  if (process.client) {
    const savedTheme = localStorage.getItem('app_theme');
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      theme.value = savedTheme;
      changeTheme(savedTheme);
    } else {
      changeTheme('dark');
    }

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (theme.value === 'system') {
          vuetifyTheme.global.name.value = e.matches ? 'dark' : 'light';
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
  }
});

const isActiveTheme = (themeName: string): boolean => {
  return theme.value === themeName;
};
</script>

<style scoped>
.v-card {
  transition: transform 0.3s, box-shadow 0.3s;
}
</style>
