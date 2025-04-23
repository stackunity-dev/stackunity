<template>
  <v-container class="pa-md-12 pa-sm-6" fluid>
    <v-responsive class="text-center mx-auto mb-6 mb-md-12" max-width="700">
      <h2 class="text-h3 text-gradient font-weight-bold mb-4 ">
        Unlimited access for a unique price
      </h2>

      <p class="text-subtitle-1 text-medium-emphasis">
        Access all our premium development tools with a single payment.
        No monthly subscription, no hidden fees, just exceptional value.
      </p>
    </v-responsive>

    <v-sheet class="mx-auto pa-2 border-sm" max-width="1000" rounded="xl">
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="h-100 flex-column d-flex align-center justify-center pa-4 border-sm" color="primary"
            rounded="xl" variant="tonal">
            <div class="text-subtitle-1 font-weight-medium mb-3 opacity-70 text-high-emphasis">
              Pay once, access forever
            </div>

            <div class="text-h3 mb-8 text-high-emphasis font-weight-bold">
              199€
              <small class="text-overline">EUR</small>
            </div>

            <v-btn class="mb-5 text-none" color="secondary" max-height="36" max-width="256" rounded="lg"
              text="Get access now" to="/login" variant="elevated" width="100%" size="large"
              :elevation="getElevation('get-access-now', 4, 20)" @mouseenter="setHoverOn('get-access-now')"
              @mouseleave="setHoverOff('get-access-now')" />

            <div class="text-caption text-medium-emphasis w-75 text-center">
              Limited time offer - Normal price: 249€
            </div>
          </v-card>
        </v-col>

        <v-col class="pa-6" cols="12" md="8">
          <h2 class="text-h5 font-weight-bold mb-4">Lifetime subscription</h2>

          <p class="text-medium-emphasis mb-4">
            Maximize your productivity with StackUnity. This limited time offer will not be available
            in the future. Get access to all current and future features, including full access to all development
            components and tools forever.
          </p>

          <div class="d-flex align-center mb-8">
            <span class="text-primary text-no-wrap text-body-2 font-weight-medium me-4">What you get</span>

            <v-divider />
          </div>

          <v-row dense>
            <v-col v-for="feature in featuresPricing" :key="feature" cols="12" md="6">
              <v-icon color="tertiary" icon="$success" />

              <span class="text-caption ms-2"> {{ feature }} </span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getElevation, setHoverOff, setHoverOn } from '../utils/hover-state';

const featuresPricing = ref([
  'Unlimited access to snippets and design studio',
  'Unlimited SQL visualizer and analyzis tools',
  'Unlimited website audit and accessibility tools',
  'Lifetime access and updates',
]);
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
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
</style>