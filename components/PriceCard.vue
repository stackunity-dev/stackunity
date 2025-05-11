<template>
  <v-card class="h-100 pricing-card" :class="cardClass" :elevation="isPopular ? 8 : 2">
    <div v-if="isPopular" class="popular-badge">{{ t().section.popular }}</div>
    <v-card-item>
      <div class="d-flex align-center mb-4" aria-label="Plan details">
        <img src="/images/logo.png" alt="StackUnity Logo" class="rounded-pill mr-2" width="48" height="48" />
        <div>
          <div class="text-h5 font-weight-bold" :class="{
            'text-gradient-gold': plan.name === 'Premium',
            'text-gradient-standard': plan.name === 'Standard'
          }">
            {{ plan.name }}
          </div>
          <div class="text-subtitle-2 text-medium-emphasis">{{ plan.description }}</div>
        </div>
      </div>
      <div class="text-h3 font-weight-bold mb-4">
        {{ selectedCurrency }}{{ displayPrice }}
        <span class="text-subtitle-1 text-medium-emphasis" aria-label="Lifetime"> /{{ t().plans.lifetime.name }}</span>
      </div>
      <v-chip v-if="plan.freeTrialDays" color="success" variant="outlined" prepend-icon="mdi-timer-outline"
        class="mb-4">
        {{ t().plans.standard.trial.days.replace('{days}', plan.freeTrialDays) }}
      </v-chip>
      <v-divider class="mb-4"></v-divider>
      <v-list density="compact" class="bg-transparent">
        <v-list-item v-for="feature in plan.features" :key="feature" class="text-body-1">
          <template v-slot:prepend>
            <v-icon class="mr-2" color="success">mdi-check-circle</v-icon>
          </template>
          {{ feature }}
        </v-list-item>
      </v-list>
    </v-card-item>
    <v-card-actions class="pa-6 pt-0">
      <v-btn block :color="btnColor" variant="elevated" :to="btnTo" class="btn-action" aria-label="Get started"
        size="large">
        {{ btnText }}
        <v-icon v-if="btnIcon" end>{{ btnIcon }}</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslations } from '../languages';

const t = useTranslations('pricing');

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  selectedCurrency: {
    type: String,
    required: true
  },
  isAnnual: {
    type: Boolean,
    default: false
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

const displayPrice = computed(() => {
  const basePrice = props.plan?.price[props.selectedCurrency];
  if (props.isAnnual && props.plan?.hasDiscount) {
    return (basePrice * 0.8 * 12).toFixed(2);
  }
  return basePrice;
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

.text-gradient-standard {
  background-image: linear-gradient(45deg,
      #3B82F6,
      #60A5FA,
      #2563EB);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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