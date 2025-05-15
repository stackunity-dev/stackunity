<template>
  <section id="pricing" class="py-16 pricing-section" aria-labelledby="pricing-heading">
    <v-container>
      <div class="text-center mb-12">
        <span class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 d-block">{{
          t().section.subtitle }}</span>
        <h2 id="pricing-heading" class="text-h3 text-gradient font-weight-bold mb-3">{{ t().section.title }}</h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
          {{ t().section.description }}
        </p>

        <v-chip-group v-model="selectedCurrency" class="d-flex flex-wrap text-center justify-center text-center my-6"
          aria-label="Select currency">
          <v-chip v-for="currency in currencies" :key="currency.symbol" :value="currency.symbol" filter
            aria-label="Currency">
            {{ currency.symbol }} ({{ currency.code }})
          </v-chip>
        </v-chip-group>
      </div>

      <v-row justify="center" align="stretch">
        <v-col cols="12" sm="6" md="5">
          <price-card :plan="freePlan" :selected-currency="selectedCurrency" card-class="free-plan"
            :btn-text="t().plans.free.cta" btn-color="primary" btn-to="/signup" />
        </v-col>

        <v-col cols="12" class="d-flex justify-center align-center d-sm-none py-4">
          <v-chip color="warning" size="large" label variant="elevated" class="compare-chip">
            <v-icon start>mdi-compare</v-icon>
            {{ t().section.compare || 'Comparer' }}
          </v-chip>
        </v-col>

        <v-col cols="12" sm="6" md="5">
          <price-card :plan="premiumPlan" :selected-currency="selectedCurrency" :is-popular="true"
            card-class="premium-plan highlight-card" :btn-text="t().plans.premium.cta" btn-color="tertiary" btn-to="/signup"
            btn-icon="mdi-arrow-right" />
        </v-col>
      </v-row>

      <v-row class="my-8 justify-center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="guarantee-card" elevation="2">
            <v-card-text class="text-center pa-6">
              <v-icon color="warning" size="42" class="mb-3">{{ guarantee.icon }}</v-icon>
              <h3 class="text-h5 font-weight-bold mb-3">{{ guarantee.title }}</h3>
              <p class="text-body-1 text-medium-emphasis">
                {{ guarantee.description }}
              </p>
              <v-rating
                v-model="rating"
                color="warning"
                density="compact"
                readonly
                half-increments
                class="mt-3 justify-center"
              ></v-rating>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-10 justify-center">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" size="large" variant="outlined" @click="showFeatureComparison = !showFeatureComparison"
            class="compare-features-btn" aria-label="Show full feature comparison">
            {{ showFeatureComparison ? t().comparison.hide : t().comparison.show }}
            <v-icon end>{{ showFeatureComparison ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-expand-transition>
        <v-row v-if="showFeatureComparison" class="mt-6">
          <v-col cols="12">
            <v-card class="comparison-table-card">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">{{ t().comparison.table.feature }}</th>
                    <th class="text-center">{{ t().comparison.table.free }}</th>
                    <th class="text-center">{{ t().comparison.table.premium }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="feature in comparisonFeatures" :key="feature.name">
                    <td>{{ feature.name }}</td>
                    <td class="text-center">
                      <v-icon v-if="feature.free" color="success" size="large">mdi-check-circle</v-icon>
                      <v-icon v-else color="error" size="small">mdi-close</v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon v-if="feature.premium" color="success" size="large">mdi-check-circle</v-icon>
                      <v-icon v-else color="error" size="small">mdi-close</v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-expand-transition>
      
      <v-row class="mt-12 justify-center" v-if="!showFeatureComparison">
        <v-col cols="12" sm="8" md="6" class="text-center">
          <v-alert
            color="info"
            border="start"
            variant="tonal"
            density="compact"
            icon="mdi-information-outline"
            class="limited-time-offer"
          >
            {{ t().section.limitedOffer || 'Offre à durée limitée !' }}
          </v-alert>
        </v-col>
      </v-row>
      
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTranslations } from '../languages';
import PriceCard from './PriceCard.vue';

const t = useTranslations('pricing');

const selectedCurrency = ref('€');
const showFeatureComparison = ref(false);
const rating = ref(5);

const currencies = ref([
  { symbol: '€', code: 'EUR' },
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' }
]);

const freePlan = computed(() => ({
  name: t().plans.free.name,
  description: t().plans.free.description,
  icon: 'mdi-rocket-launch-outline',
  avatarColor: 'primary',
  price: {
    '€': '0',
    '$': '0',
    '£': '0',
    duration: 'month'
  },
  hasDiscount: false,
  freeTrialDays: 0,
  features: [
    t().features.cssPlayground,
    t().features.simpleStudio,
    t().features.apiTesting,
    t().features.contrastChecker,
    t().features.visualImpairment,
  ]
}));

const premiumPlan = ref({
  name: t().plans.premium.name,
  description: t().plans.premium.description,
  icon: 'mdi-crown',
  avatarColor: 'white',
  price: {
    '€': '249.99',
    '$': (249.99 * 1.1).toFixed(2),
    '£': (249.99 * 0.85).toFixed(2),
    duration: 'lifetime'
  },
  hasDiscount: true,
  freeTrialDays: 7,
  features: [
    t().features.cssPlayground,
    t().features.simpleStudio,
    t().features.apiTesting,
    t().features.contrastChecker,
    t().features.visualImpairment,
    t().features.performanceAnalysis,
    t().features.contentAnalysis,
    t().features.userEngagement,
    t().features.semanticAnalysis,
    t().features.securityAnalysis,
    t().features.analytics,
    t().features.futureUpdates
  ]
});

const guarantee = ref({
  icon: 'mdi-shield-check',
  title: t().guarantee.title,
  description: t().guarantee.description,
});

const comparisonFeatures = ref([
  { name: t().features.cssPlayground, free: true, premium: true },
  { name: t().features.simpleStudio, free: true, premium: true },
  { name: t().features.apiTesting, free: true, premium: true },
  { name: t().features.contrastChecker, free: true, premium: true },
  { name: t().features.visualImpairment, free: true, premium: true },
  { name: t().features.completeVisualImpairment, free: false, premium: true },
  { name: t().features.completeStudio, free: false, premium: true },
  { name: t().features.databaseManagement, free: false, premium: true },
  { name: t().features.robots, free: false, premium: true },
  { name: t().features.performanceAnalysis, free: false, premium: true },
  { name: t().features.contentAnalysis, free: false, premium: true },
  { name: t().features.userEngagement, free: false, premium: true },
  { name: t().features.semanticAnalysis, free: false, premium: true },
  { name: t().features.securityAnalysis, free: false, premium: true },
  { name: t().features.analytics, free: false, premium: true },
  { name: t().features.futureUpdates, free: false, premium: true },
  { name: t().features.unlimitedMembers, free: false, premium: true },
  { name: t().features.prioritySupport, free: false, premium: true },
]);
</script>

<style scoped>
.pricing-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative;
  height: 100%;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.btn-action {
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.premium-plan {
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 0.1), rgba(var(--v-theme-warning), 0.2));
  border: 2px solid rgba(var(--v-theme-warning), 0.3);
}

.free-plan {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.highlight-card {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(var(--v-theme-warning), 0.15);
}

.highlight-card:hover {
  transform: scale(1.05) translateY(-8px);
  box-shadow: 0 16px 32px rgba(var(--v-theme-warning), 0.2);
}

.popular-badge {
  position: absolute;
  top: 15px;
  right: -40px;
  background: linear-gradient(90deg, rgb(var(--v-theme-warning)), rgb(var(--v-theme-error)));
  color: white;
  padding: 8px 50px;
  font-size: 12px;
  font-weight: bold;
  transform: rotate(45deg);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.guarantee-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05), rgba(var(--v-theme-warning), 0.15));
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
  transition: all 0.3s ease;
  border-radius: 16px;
}

.guarantee-card:hover {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.1), rgba(var(--v-theme-warning), 0.2));
  transform: translateY(-4px);
}

.compare-features-btn {
  padding: 0 32px;
  height: 48px;
  border-radius: 24px;
  font-weight: 500;
}

.comparison-table-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.limited-time-offer {
  border-width: 3px;
  font-weight: 500;
}

.compare-chip {
  padding: 0 20px;
  height: 40px;
}

@keyframes highlight-pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-warning), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0); }
}

.highlight-card {
  animation: highlight-pulse 2s infinite;
}
</style>