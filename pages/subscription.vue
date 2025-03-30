<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-4">
        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-card class="rounded-lg" elevation="3">
              <v-card-title class="bg-primary text-white py-3 px-4 rounded-t-lg d-flex align-center">
                <v-icon color="white" class="mr-2">mdi-star</v-icon>
                Passez à la version Premium
              </v-card-title>

              <v-card-text class="pa-6">
                <div class="text-center mb-6">
                  <h1 class="text-h4 mb-2">Débloquez toutes les fonctionnalités</h1>
                  <p class="text-body-1 text-grey-darken-1">
                    Profitez d'un accès illimité à toutes nos fonctionnalités premium
                  </p>
                </div>

                <v-list class="mb-6">
                  <v-list-item prepend-icon="mdi-check-circle" color="success">
                    <v-list-item-title>Accès illimité aux fonctionnalités avancées</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-check-circle" color="success">
                    <v-list-item-title>Support prioritaire</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-check-circle" color="success">
                    <v-list-item-title>Analyses SEO avancées</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-check-circle" color="success">
                    <v-list-item-title>Export de données illimité</v-list-item-title>
                  </v-list-item>
                </v-list>

                <div class="text-center">
                  <v-btn color="primary" size="large" to="/checkout">
                    <v-icon start>mdi-credit-card</v-icon>
                    S'abonner maintenant
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';

const userStore = useUserStore();

const handleSubscription = async () => {
  // TODO: Implémenter la logique de paiement
  // Pour le moment, on simule juste une mise à jour du statut premium
  try {
    // Appel API pour mettre à jour le statut premium
    // await userStore.updatePremiumStatus(true);
    console.log('Abonnement en cours...');
  } catch (error) {
    console.error('Erreur lors de l\'abonnement:', error);
  }
};
</script>

<style scoped>
.v-list-item {
  min-height: 48px;
}
</style>