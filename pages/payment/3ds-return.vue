<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 text-center pt-6">
            <v-icon color="primary" size="large" class="mr-2">mdi-shield-check</v-icon>
            Vérification 3D Secure
          </v-card-title>
          <v-card-text class="text-center">
            <v-progress-circular v-if="loading" indeterminate color="primary" size="64" class="my-4" />
            <div v-else-if="error" class="text-error mt-4">{{ error }}</div>
            <div v-else-if="success" class="text-success mt-4">{{ success }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref('');
const success = ref('');
const userStore = useUserStore();

onMounted(async () => {
  const token = route.query.token as string;
  if (!token) {
    error.value = 'Token manquant dans l’URL de retour';
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(`/api/payment/3ds-return?token=${token}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Erreur lors du retour 3DS');
    }

    if (data.success) {
      await fetch('/api/payment/verify-3ds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.token}`
        }
      });
    }

    setTimeout(() => {
      router.push('/payment/success');
    }, 2000);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
