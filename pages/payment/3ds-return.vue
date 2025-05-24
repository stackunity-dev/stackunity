<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 payment-card">
          <v-card-title class="text-h5 text-center pt-6">
            <v-icon color="secondary" size="large" class="mr-2">mdi-shield-check</v-icon>
            Verification 3D Secure
          </v-card-title>
          <v-card-text class="text-center">
            <div v-if="loading" class="loading-container">
              <v-progress-circular indeterminate color="primary" size="64" width="4" class="my-4" />
              <p class="text-body-1 mt-4">Verification of your payment in progress...</p>
              <p class="text-caption text-medium-emphasis">Please wait a few seconds</p>
            </div>
            <div v-else-if="error" class="error-container">
              <v-icon color="error" size="48" class="mb-4">mdi-alert-circle</v-icon>
              <p class="text-error text-h6 mb-2">{{ error }}</p>
              <p class="text-caption text-medium-emphasis">An error occurred during verification</p>
              <v-btn color="secondary" variant="outlined" class="mt-4" @click="retryVerification">
                Retry
              </v-btn>
            </div>
            <div v-else-if="success" class="success-container">
              <v-icon color="success" size="48" class="mb-4">mdi-check-circle</v-icon>
              <p class="text-success text-h6 mb-2">{{ success }}</p>
              <p class="text-caption text-medium-emphasis">Redirection en cours...</p>
            </div>
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
// @ts-ignore
import { useHead } from '#imports';

useHead({
  title: 'Stackunity - 3DS Return',
  meta: [
    { name: 'description', content: 'Stackunity - 3DS Return' },
  ],
});

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref('');
const success = ref('');
const userStore = useUserStore();

const retryVerification = () => {
  loading.value = true;
  error.value = '';
  verifyPayment();
};

const verifyPayment = async () => {
  const token = route.query.token as string;
  if (!token) {
    error.value = "Missing token in the return URL";
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
      success.value = 'Success !';
      await fetch('/api/payment/verify-3ds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.token}`
        }
      });

      setTimeout(() => {
        router.push('/payment/success');
      }, 2000);
    }
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  verifyPayment();
});
</script>

<style scoped>
.payment-card {
  background: #1e1e2f !important;
  color: #e0e0e0 !important;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.payment-card:hover {
  transform: translateY(-5px);
}

.loading-container,
.error-container,
.success-container {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.v-card-title {
  color: #e0e0e0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
}

.v-card-text {
  padding: 32px;
}

.text-caption {
  opacity: 0.7;
}
</style>
