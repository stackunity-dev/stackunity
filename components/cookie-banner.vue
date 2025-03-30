<template>
  <div v-if="!cookieStore.hasGivenConsent">
    <v-snackbar v-model="showBanner" :timeout="-1" location="bottom" class="cookie-banner" elevation="4"
      color="secondary">
      <div class="d-flex flex-column">
        <div class="text-subtitle-1 font-weight-bold mb-2">
          Cookie consent
        </div>
        <div class="mb-4">
          We use cookies to improve your experience, personalize content, and analyze our traffic. You can choose to
          accept all cookies or customize them.
        </div>

        <div class="d-flex flex-wrap align-center justify-space-between">
          <div>
            <v-btn color="white" variant="text" class="mr-2 mb-2 mb-sm-0" @click="showSettings = true">
              Customize
            </v-btn>
            <v-btn color="white" variant="outlined" class="mr-2 mb-2 mb-sm-0" @click="rejectNonEssential">
              Reject
            </v-btn>
          </div>
          <v-btn color="white" variant="elevated" class="mb-2 mb-sm-0" @click="acceptAll">
            Accept all
          </v-btn>
        </div>
      </div>
    </v-snackbar>

    <CookieOptions v-model="showSettings" />
  </div>
</template>

<script lang="ts" setup>
import { useCookieStore } from '@/stores/cookieStore';
import { onMounted, ref } from 'vue';
import CookieOptions from './cookieOptions.vue';

const cookieStore = useCookieStore();
const showBanner = ref(true);
const showSettings = ref(false);
const showSettingsBtn = ref(false);
const customPreferences = ref({
  essential: true,
  functional: true,
  analytics: true,
  marketing: true
});
const dialog = ref(false);

onMounted(() => {
  if (typeof cookieStore.initCookieConsent === 'function') {
    cookieStore.initCookieConsent();
  }

  setTimeout(() => {
    showSettingsBtn.value = true;
  }, 2000);

  console.log('État des cookies au chargement:', {
    preferences: cookieStore.preferences,
    hasGivenConsent: cookieStore.hasGivenConsent,
    storedConsent: localStorage.getItem('cookie_consent')
  });
});

function acceptAll() {
  cookieStore.acceptAllCookies();
  showBanner.value = false;

  console.log('Après acceptAll:', {
    preferences: cookieStore.preferences,
    hasGivenConsent: cookieStore.hasGivenConsent,
    storedConsent: localStorage.getItem('cookie_consent')
  });
}

function rejectNonEssential() {
  cookieStore.rejectNonEssentialCookies();
  showBanner.value = false;

  console.log('Après rejectNonEssential:', {
    preferences: cookieStore.preferences,
    hasGivenConsent: cookieStore.hasGivenConsent,
    storedConsent: localStorage.getItem('cookie_consent')
  });
}

const submitPreferences = () => {
  const previousAnalytics = cookieStore.preferences.analytics;

  cookieStore.updatePreferences({
    essential: true,
    functional: customPreferences.value.functional,
    analytics: customPreferences.value.analytics,
    marketing: customPreferences.value.marketing
  });

  if (previousAnalytics && !customPreferences.value.analytics) {
    console.log('Le suivi analytique a été désactivé');
  }

  dialog.value = false;
};

</script>

<style scoped>
.cookie-banner {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px !important;
}

.cookie-settings-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.cookie-fab {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>