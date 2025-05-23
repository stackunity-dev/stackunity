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
      </div>

      <v-row justify="center" align="stretch">
        <v-col cols="12" md="6" lg="5">
          <price-card :plan="lifetimePlan" :selected-currency="selectedCurrency" :currencies="currencies"
            @update:currency="selectedCurrency = $event" :is-popular="true" card-class="lifetime-plan highlight-card"
            :btn-text="t().plans.lifetime.cta" btn-color="tertiary" btn-to="/signup" btn-icon="mdi-arrow-right" />
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
              <v-rating v-model="rating" color="warning" density="compact" readonly half-increments
                class="mt-3 justify-center"></v-rating>
            </v-card-text>
          </v-card>
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
  { symbol: 'MAD', code: 'MAD' },
  { symbol: 'SAR', code: 'SAR' },
  { symbol: 'TND', code: 'TND' },
  { symbol: '€', code: 'EUR' },
  { symbol: '£', code: 'GBP' },
  { symbol: '$', code: 'USD' },
  { symbol: '¥', code: 'JPY' }
]);

const basePrice = 249.99;

const conversionRates = {
  'MAD': 10.38,
  'SAR': 4.1,
  'TND': 3.4,
  '€': 1,
  '£': 0.85,
  '$': 1.1,
  '¥': 160
};

const convertPrice = (price, rate, decimals = 2) => {
  return (price * rate).toFixed(decimals);
};

const price = {
  'MAD': convertPrice(basePrice, conversionRates['MAD']),
  'SAR': convertPrice(basePrice, conversionRates['SAR']),
  'TND': convertPrice(basePrice, conversionRates['TND']),
  '€': basePrice.toFixed(2),
  '£': convertPrice(basePrice, conversionRates['£']),
  '$': convertPrice(basePrice, conversionRates['$']),
  '¥': convertPrice(basePrice, conversionRates['¥'], 0),
  duration: 'lifetime'
};

const lifetimePlan = computed(() => ({
  name: t().plans.lifetime.name,
  description: t().plans.lifetime.description,
  icon: 'mdi-crown',
  avatarColor: 'white',
  price: price,
  hasDiscount: true,
  features: [
    t().features.audit,
    t().features.stackql,
    t().features.analytics,
    t().features.futureUpdates,
    t().features.prioritySupport
  ]
}));

const guarantee = ref({
  icon: 'mdi-shield-check',
  title: t().guarantee.title,
  description: t().guarantee.description,
});
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

.lifetime-plan {
  background: linear-gradient(135deg, rgba(var(--v-theme-tertiary), 0.1), rgba(var(--v-theme-warning), 0.2));
  border: 2px solid rgba(var(--v-theme-warning), 0.3);
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
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-warning), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-warning), 0);
  }
}

.highlight-card {
  animation: highlight-pulse 2s infinite;
}
</style>