<template>
  <v-dialog v-model="showSettings" width="500">
    <v-card>
      <v-card-title class="text-h5 pb-2">
        Cookie preferences
      </v-card-title>
      <v-card-subtitle>
        Customize your cookie preferences
      </v-card-subtitle>

      <v-card-text>
        <v-list>
          <template v-for="(cookie, key) in cookieOptions" :key="key">
            <v-list-item>
              <v-list-item-title>
                <v-switch v-model="cookiePreferences[key]" :label="cookie.label" color="primary"
                  :disabled="key === 'essential'" hide-details inset></v-switch>
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-1">
                {{ cookie.description }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-divider v-if="key !== 'marketing'" class="my-2"></v-divider>
          </template>
        </v-list>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn variant="tonal" color="error" @click="showSettings = false">
          Cancel
        </v-btn>
        <v-btn color="success" variant="tonal" @click="savePreferences">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCookieStore } from '@/stores/cookieStore';

const cookieStore = useCookieStore();
const showSettings = ref(false);
const cookiePreferences = ref({
  essential: true,
  functional: cookieStore.preferences.functional,
  analytics: cookieStore.preferences.analytics,
  marketing: cookieStore.preferences.marketing
});

const cookieOptions = {
  essential: {
    label: 'Cookies essentiels',
    description: 'Necessary for the site to function, they cannot be disabled.'
  },
  functional: {
    label: 'Cookies fonctionnels',
    description: 'Allow to remember your preferences and personalize your experience.'
  },
  analytics: {
    label: 'Cookies analytiques',
    description: 'Help us understand how you use our site to improve it.'
  },
  marketing: {
    label: 'Cookies marketing',
    description: 'Allow to display personalized ads based on your interests.'
  }
};

function savePreferences() {
  cookieStore.updatePreferences({
    essential: true,
    functional: cookiePreferences.value.functional,
    analytics: cookiePreferences.value.analytics,
    marketing: cookiePreferences.value.marketing
  });

  showSettings.value = false;

  console.log('Après savePreferences:', {
    preferences: cookieStore.preferences,
    hasGivenConsent: cookieStore.hasGivenConsent,
    storedConsent: localStorage.getItem('cookie_consent')
  });
}
</script>
