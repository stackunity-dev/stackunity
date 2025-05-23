<template>
  <v-card class="h-100 pricing-card" :class="cardClass" :elevation="isPopular ? 8 : 2">
    <div v-if="isPopular" class="popular-badge">{{ t().section.popular }}</div>
    <v-card-item>
      <div class="d-flex align-center mb-6" aria-label="Plan details">
        <div class="plan-icon-wrapper mr-3 premium-icon">
          <v-icon size="x-large" color="warning">
            {{ plan.icon }}
          </v-icon>
        </div>
        <div>
          <div class="text-h5 font-weight-bold text-gradient-gold">
            {{ plan.name }}
          </div>
          <div class="text-subtitle-2 text-medium-emphasis">{{ plan.description }}</div>
        </div>
      </div>

      <div class="price-container mb-6 text-center">
        <div class="d-flex align-center justify-center">
          <div class="text-h3 font-weight-bold">
            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="currency-selector">
                  <v-icon size="x-small" class="mr-1">mdi-chevron-down</v-icon>
                </span>
              </template>
              <v-list density="compact">
                <v-list-item v-for="currency in currencies" :key="currency.symbol" :value="currency.symbol"
                  @click="handleCurrencyChange(currency.symbol)" :active="selectedCurrency === currency.symbol">
                  <span class="currency-item">
                    <span class="currency-symbol">{{ currency.symbol }}</span>
                    <span class="currency-code">{{ currency.code }}</span>
                  </span>
                </v-list-item>
              </v-list>
            </v-menu>
            <span class="price-value">{{ displayPrice }}</span>
            <span class="currency-symbol ml-1">{{ selectedCurrency }}</span>
            <span class="text-subtitle-1 text-medium-emphasis" aria-label="Lifetime">
              /{{ t().plans.lifetime.name }}
            </span>
          </div>
        </div>
        <v-chip v-if="plan.hasDiscount" color="error" variant="flat" class="mt-2" size="small">
          -20%
        </v-chip>
      </div>

      <v-divider class="mb-6"></v-divider>

      <div class="features-list">
        <v-list density="compact" class="bg-transparent pa-0">
          <template v-for="feature in plan.features" :key="feature">
            <template v-if="feature === t().features.audit">
              <v-list-group>
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="text-body-1 feature-item">
                    <template v-slot:prepend>
                      <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                    </template>
                    {{ feature }}
                  </v-list-item>
                </template>
                <v-list-item v-for="detail in auditDetails" :key="detail" class="text-body-2 feature-item pl-8">
                  <template v-slot:prepend>
                    <v-icon class="mr-2" color="success" size="small">mdi-check</v-icon>
                  </template>
                  {{ detail }}
                </v-list-item>
              </v-list-group>
            </template>
            <template v-else-if="feature === t().features.stackql">
              <v-list-group>
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="text-body-1 feature-item">
                    <template v-slot:prepend>
                      <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                    </template>
                    {{ feature }}
                  </v-list-item>
                </template>
                <v-list-item v-for="detail in stackqlDetails" :key="detail" class="text-body-2 feature-item pl-8">
                  <template v-slot:prepend>
                    <v-icon class="mr-2" color="success" size="small">mdi-check</v-icon>
                  </template>
                  {{ detail }}
                </v-list-item>
              </v-list-group>
            </template>
            <template v-else-if="feature === t().features.analytics">
              <v-list-group>
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="text-body-1 feature-item">
                    <template v-slot:prepend>
                      <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
                    </template>
                    {{ feature }}
                  </v-list-item>
                </template>
                <v-list-item v-for="detail in analyticsDetails" :key="detail" class="text-body-2 feature-item pl-8">
                  <template v-slot:prepend>
                    <v-icon class="mr-2" color="success" size="small">mdi-check</v-icon>
                  </template>
                  {{ detail }}
                </v-list-item>
              </v-list-group>
            </template>
            <v-list-item v-else class="text-body-1 feature-item">
              <template v-slot:prepend>
                <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
              </template>
              {{ feature }}
            </v-list-item>
          </template>
        </v-list>
      </div>
    </v-card-item>

    <v-card-actions class="pa-6 pt-2">
      <v-btn block color="tertiary" variant="elevated" :to="btnTo" class="btn-action" aria-label="Get started"
        size="large" :height="48">
        {{ btnText }}
        <v-icon v-if="btnIcon" end>{{ btnIcon }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTranslations } from '../languages';

const t = useTranslations('pricing');

interface Currency {
  symbol: string;
  code: string;
}

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  selectedCurrency: {
    type: String,
    required: true
  },
  currencies: {
    type: Array as () => Currency[],
    required: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  cardClass: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    required: true
  },
  btnColor: {
    type: String,
    required: true
  },
  btnTo: {
    type: String,
    required: true
  },
  btnIcon: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:currency']);

const localCurrency = ref(props.selectedCurrency);

watch(() => props.selectedCurrency, (newValue) => {
  localCurrency.value = newValue;
});

const handleCurrencyChange = (value: string) => {
  localCurrency.value = value;
  emit('update:currency', value);
};

const displayPrice = computed(() => {
  return props.plan?.price[props.selectedCurrency];
});

const auditDetails = [
  t().features.auditDetails.performanceAnalysis,
  t().features.auditDetails.contentAnalysis,
  t().features.auditDetails.userEngagement,
  t().features.auditDetails.semanticAnalysis,
  t().features.auditDetails.securityAnalysis
];

const analyticsDetails = [
  t().features.analyticsDetails.pageviews,
  t().features.analyticsDetails.sessions,
  t().features.analyticsDetails.location,
  t().features.analyticsDetails.browserAndDevice,
  t().features.analyticsDetails.interaction,
  t().features.analyticsDetails.deadzones
];

const stackqlDetails = [
  t().features.stackqlDetails.workbench,
  t().features.stackqlDetails.queryAnalysis,
  t().features.stackqlDetails.queryVisualization,
  t().features.stackqlDetails.databaseUsage
];

const selectedCurrencyCode = computed(() => {
  const currency = props.currencies.find(c => c.symbol === localCurrency.value);
  return currency?.code || '';
});
</script>

<style scoped>
.pricing-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.btn-action {
  transition: all 0.2s ease;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.btn-action:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
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

.plan-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.premium-icon {
  background: linear-gradient(45deg, #FFC107, #FF9800);
  box-shadow: 0 4px 8px rgba(255, 193, 7, 0.3);
}

.text-gradient-gold {
  background-image: linear-gradient(45deg,
      #F59E0B,
      #FBBF24,
      #D97706);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: gradient 3s linear infinite;
}

.price-container {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
}

.feature-item {
  margin-bottom: 6px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.feature-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

:deep(.v-list-group__header) {
  padding: 0;
}

:deep(.v-list-group__items) {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 0 0 8px 8px;
  margin: 0 16px;
}

.currency-selector {
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  margin-right: 2px;
}

.currency-selector:hover {
  opacity: 1;
}

.currency-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-symbol {
  font-weight: 600;
}

.currency-code {
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.875rem;
}

.price-value {
  display: inline-block;
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