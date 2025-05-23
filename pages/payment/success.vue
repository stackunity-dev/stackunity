<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-h5 text-center pt-6">
            <v-icon color="success" size="large" class="mr-2">mdi-check-circle</v-icon>
            Paiement Réussi !
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mb-4">
              Votre paiement a été traité avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <v-btn color="primary" @click="goToLogin" class="mt-4">
              Retour à la connexion
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  // Rediriger automatiquement après 5 secondes
  setTimeout(() => {
    router.push('/login');
  }, 5000);
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