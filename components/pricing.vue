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

        <v-chip-group v-model="selectedCurrency" class="d-flex justify-center text-center my-6"
          aria-label="Select currency">
          <v-chip v-for="currency in currencies" :key="currency.symbol" :value="currency.symbol" filter
            aria-label="Currency">
            {{ currency.symbol }} ({{ currency.code }})
          </v-chip>
        </v-chip-group>

      </div>

      <v-row justify="center" align="stretch">
        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="freePlan" :selected-currency="selectedCurrency" card-class="free-plan"
            :btn-text="t().plans.free.cta" btn-color="primary" btn-to="/signup" />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="standardPlan" :selected-currency="selectedCurrency" card-class="standard-plan"
            :btn-text="t().plans.standard.cta" btn-color="secondary" btn-to="/signup" />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="premiumPlan" :selected-currency="selectedCurrency" :is-popular="true"
            card-class="premium-plan" :btn-text="t().plans.premium.cta" btn-color="tertiary" btn-to="/signup"
            btn-icon="mdi-arrow-right" />
        </v-col>
      </v-row>

      <v-row class="mt-12" justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="guarantee-card" flat>
            <v-card-text class="text-center">
              <v-icon color="warning" size="32" class="mb-2">{{ guarantee.icon }}</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">{{ guarantee.title }}</h3>
              <p class="text-body-1 text-medium-emphasis">
                {{ guarantee.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-12 justify-center">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" variant="outlined" @click="showFeatureComparison = !showFeatureComparison"
            aria-label="Show full feature comparison">
            {{ showFeatureComparison ? t().comparison.hide : t().comparison.show }}
            <v-icon end>{{ showFeatureComparison ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-expand-transition>
        <v-row v-if="showFeatureComparison" class="mt-6">
          <v-col cols="12">
            <v-card>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">{{ t().comparison.table.feature }}</th>
                    <th class="text-center">{{ t().comparison.table.free }}</th>
                    <th class="text-center">{{ t().comparison.table.standard }}</th>
                    <th class="text-center">{{ t().comparison.table.premium }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="feature in comparisonFeatures" :key="feature.name">
                    <td>{{ feature.name }}</td>
                    <td class="text-center">
                      <v-icon v-if="feature.free" color="success">mdi-check</v-icon>
                      <v-icon v-else color="error">mdi-close</v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon v-if="feature.standard" color="success">mdi-check</v-icon>
                      <v-icon v-else color="error">mdi-close</v-icon>
                    </td>
                    <td class="text-center">
                      <v-icon v-if="feature.premium" color="success">mdi-check</v-icon>
                      <v-icon v-else color="error">mdi-close</v-icon>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-expand-transition>
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
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
  ]
}));

const standardPlan = ref({
  name: t().plans.standard.name,
  description: t().plans.standard.description,
  icon: 'mdi-star',
  avatarColor: 'info',
  price: {
    '€': '149.99',
    '$': (149.99 * 1.1).toFixed(2),
    '£': (149.99 * 0.85).toFixed(2),
    duration: 'month'
  },
  hasDiscount: true,
  freeTrialDays: 7,
  features: [
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
  ]
});

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
  hasDiscount: false,
  freeTrialDays: 7,
  features: [
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
    t().comparison.table.feature,
  ]
});

const guarantee = ref({
  icon: 'mdi-shield-check',
  title: t().guarantee.title,
  description: t().guarantee.description,
});

const comparisonFeatures = ref([
  { name: t().comparison.table.feature, free: true, standard: true, premium: true },
  { name: t().comparison.table.feature, free: true, standard: true, premium: true },
  { name: t().comparison.table.feature, free: true, standard: true, premium: true },
  { name: t().comparison.table.feature, free: true, standard: true, premium: true },
  { name: t().comparison.table.feature, free: true, standard: true, premium: true },
  { name: t().comparison.table.feature, free: false, standard: true, premium: true },
  { name: t().comparison.table.feature, free: false, standard: true, premium: true },
  { name: t().comparison.table.feature, free: false, standard: true, premium: true },
  { name: t().comparison.table.feature, free: false, standard: true, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true },
  { name: t().comparison.table.feature, free: false, standard: false, premium: true }
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
  background-color: rgba(var(--v-theme-secondary), 0.3);
}

.standard-plan {
  background-color: rgba(var(--v-theme-info), 0.2);
}

.free-plan {
  background-color: rgba(var(--v-theme-primary), 0.2);
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
  background: rgba(var(--v-theme-warning), 0.1);
  border: 1px solid rgba(var(--v-theme-warning), 0.2);
  transition: all 0.3s ease;
}

.guarantee-card:hover {
  background: rgba(var(--v-theme-warning), 0.15);
}

.section-subtitle {
  font-size: 0.85rem;
  letter-spacing: 1.5px;
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  background-color: rgba(var(--v-theme-primary), 0.1);
  margin-bottom: 10px;
}

.text-gradient {
  background: linear-gradient(90deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
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

/* Animation des icônes de fonctionnalités */
.v-list-item:hover .v-icon {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>