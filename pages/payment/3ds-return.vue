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
            <v-progress-circular v-if="loading" indeterminate color="primary" size="64"
              class="my-4"></v-progress-circular>
            <div v-else-if="error" class="text-error mt-4">
              {{ error }}
            </div>
            <div v-else-if="success" class="text-success mt-4">
              {{ success }}
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

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const loading = ref(true);
const error = ref('');
const success = ref('');

onMounted(async () => {
  try {
    const orderId = localStorage.getItem('pendingOrderId');
    if (!orderId) {
      throw new Error('Aucun ID de commande trouvé');
    }

    // Appeler l'API pour finaliser le paiement
    const response = await fetch('/api/payment/capture-after-3ds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erreur lors de la finalisation du paiement');
    }

    if (data.success) {
      success.value = 'Paiement confirmé avec succès !';
      // Nettoyer le localStorage
      localStorage.removeItem('pendingOrderId');
      // Rediriger vers la page de succès après 2 secondes
      setTimeout(() => {
        router.push('/payment/success');
      }, 2000);
    } else {
      throw new Error(data.error || 'Échec de la finalisation du paiement');
    }
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.v-card {
  background: #1e1e2f !important;
  color: #e0e0e0 !important;
  border-radius: 12px;
  overflow: hidden;
}

.v-card-title {
  color: #e0e0e0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
}

.v-card-text {
  padding: 24px;
}
</style>