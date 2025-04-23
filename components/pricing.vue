<template>
  <section id="pricing" class="py-16 pricing-section" aria-labelledby="pricing-heading">
    <v-container>
      <div class="text-center mb-12">
        <span class="section-subtitle text-uppercase font-weight-medium text-primary mb-2 d-block">Pricing</span>
        <h2 id="pricing-heading" class="text-h3 text-gradient font-weight-bold mb-3">Choose your plan</h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 700px">
          Start with a 7-day free trial. No credit card required.
        </p>

        <v-chip-group v-model="selectedCurrency" class="justify-center my-6">
          <v-chip v-for="currency in currencies" :key="currency.symbol" :value="currency.symbol" filter>
            {{ currency.symbol }} ({{ currency.code }})
          </v-chip>
        </v-chip-group>

      </div>

      <v-row justify="center" align="stretch">
        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="freePlan" :selected-currency="selectedCurrency" card-class="free-plan"
            btn-text="TRY FOR FREE" btn-color="primary" btn-to="/signup" />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="standardPlan" :selected-currency="selectedCurrency" card-class="standard-plan"
            btn-text="Start Free Trial" btn-color="secondary" btn-to="/signup" />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <price-card :plan="premiumPlan" :selected-currency="selectedCurrency" :is-popular="true"
            card-class="premium-plan" btn-text="Start Free Trial" btn-color="tertiary" btn-to="/signup"
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
          <v-btn color="primary" variant="outlined" @click="showFeatureComparison = !showFeatureComparison">
            {{ showFeatureComparison ? 'Hide' : 'Show' }} Full Feature Comparison
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
                    <th class="text-left">Feature</th>
                    <th class="text-center">Free</th>
                    <th class="text-center">Standard</th>
                    <th class="text-center">Premium</th>
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
import { ref } from 'vue';
import PriceCard from './PriceCard.vue';

const selectedCurrency = ref('€');
const showFeatureComparison = ref(false);

const currencies = ref([
  { symbol: '€', code: 'EUR' },
  { symbol: '$', code: 'USD' },
  { symbol: '£', code: 'GBP' }
]);

const freePlan = ref({
  name: 'Free',
  description: 'Perfect to start',
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
    'Basic snippets management',
    'Simple Studio features',
    'Basic API testing',
    'Contrast ratio checker',
    'Visual impairment simulation',
  ]
});

const standardPlan = ref({
  name: 'Standard',
  description: 'For growing teams',
  icon: 'mdi-star',
  avatarColor: 'info',
  price: {
    '€': '79.99',
    '$': '99.99',
    '£': '69.99',
    duration: 'month'
  },
  hasDiscount: true,
  freeTrialDays: 7,
  features: [
    'All Free features',
    'Complete Studio features',
    'Database Designer features',
    'All visual impairment simulation features',
    'Robots.txt and Schema.org Generator',
  ]
});

const premiumPlan = ref({
  name: 'Premium',
  description: 'Unlock all features',
  icon: 'mdi-crown',
  avatarColor: 'white',
  price: {
    '€': '179.99',
    '$': '199.99',
    '£': '159.99',
    duration: 'lifetime'
  },
  hasDiscount: false,
  freeTrialDays: 7,
  features: [
    'All Standard features',
    'Website analysis',
    'Semantic and ARIA analysis',
    'User Engagement tools',
    'Priority support',
    'Unlimited team members',
    'Access to all future updates'
  ]
});

const guarantee = ref({
  icon: 'mdi-shield-check',
  title: '30-Day Money Back Guarantee',
  description: 'If you\'re not satisfied with StackUnity, get a full refund within 30 days. No questions asked.',
});

const comparisonFeatures = ref([
  { name: 'Snippets Management', free: true, standard: true, premium: true },
  { name: 'Simple Studio Features', free: true, standard: true, premium: true },
  { name: 'API Testing', free: true, standard: true, premium: true },
  { name: 'Contrast Ratio Checker', free: true, standard: true, premium: true },
  { name: 'Basic Visual Impairment Simulation', free: true, standard: true, premium: true },
  { name: 'Complete Visual Impairment Simulation', free: false, standard: true, premium: true },
  { name: 'Complete Studio features', free: false, standard: true, premium: true },
  { name: 'Database Designer', free: false, standard: true, premium: true },
  { name: 'Robots.txt and Schema.org Generator', free: false, standard: true, premium: true },
  { name: 'User Engagement Tools', free: false, standard: false, premium: true },
  { name: 'Semantic and ARIA analysis', free: false, standard: false, premium: true },
  { name: 'Website analysis', free: false, standard: false, premium: true },
  { name: 'Access to all future updates', free: false, standard: false, premium: true },
  { name: 'Unlimited Team Members', free: false, standard: false, premium: true }
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