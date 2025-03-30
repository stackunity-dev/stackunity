<template>
  <section class="auth-screen">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex left-panel-checkout align-center justify-center">
          <div class="left-content text-center">
            <h1>
              <img src="/logo/devunity.png" alt="Devunity - Develop faster and better with DevUnity" class="logo mb-8"
                width="350" />
              <span class="sr-only">Devunity - Develop faster and better with DevUnity</span>
            </h1>

            <div class="features-list">
              <div v-for="(feature, index) in features" :key="index" class="feature-item d-flex align-center"
                :class="{ 'mb-6': index !== features.length - 1 }">
                <v-icon color="primary" size="x-large" class="mr-3">{{ feature.icon }}</v-icon>
                <div class="text-left">
                  <p class="text-body-1 font-weight-medium text-white mb-1">{{ feature.title }}</p>
                  <p class="text-body-2 text-white-darken-2">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="right-panel-checkout d-flex align-center justify-center">
          <v-card class="checkout-card pa-8 elevation-0" max-width="500" width="100%">
            <div class="d-flex justify-center d-md-none mb-8">
              <img src="/logo/devunity.png" alt="Devunity Logo" width="300" />
            </div>

            <h2 class="text-h5 font-weight-bold mb-2">Premium Payment</h2>
            <p class="text-subtitle-1 text-medium-emphasis mb-8">Lifetime access to all premium features</p>

            <div class="mb-6 px-3 py-4 bg-surface-variant rounded-lg">
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-subtitle-1 font-weight-medium">Lifetime Premium Access</span>
                <span class="text-h6 font-weight-bold">{{ taxDetails.baseAmount }}€</span>
              </div>
              <v-divider class="mb-3"></v-divider>
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 text-medium-emphasis">Subtotal</span>
                <span class="text-body-2">{{ taxDetails.baseAmount }}€</span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2 text-medium-emphasis">VAT ({{ taxDetails.taxPercentage }}%)</span>
                <span class="text-body-2">{{ taxDetails.taxAmount }}€</span>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-1 font-weight-medium">Total</span>
                <span class="text-h6 font-weight-bold">{{ taxDetails.totalAmount }}€</span>
              </div>
            </div>

            <v-form @submit.prevent="processPayment">
              <div class="credit-card-container mb-6">
                <div class="credit-card-wrapper">
                  <div class="credit-card-header d-flex justify-space-between align-center mb-4">
                    <div class="credit-card-chip"></div>
                    <div class="d-flex">
                      <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/visa.svg"
                        class="credit-card-brand-icon" alt="Visa" />
                      <img
                        src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/mastercard.svg"
                        class="credit-card-brand-icon" alt="Mastercard" />
                      <img src="https://cdn.jsdelivr.net/gh/aaronfagan/svg-credit-card-payment-icons/flat/amex.svg"
                        class="credit-card-brand-icon" alt="American Express" />
                    </div>
                  </div>

                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="cardholderName" label="Cardholder Name" variant="outlined"
                        prepend-inner-icon="mdi-account-outline" class="mb-4"
                        :rules="[(v: any) => !!v || 'Name required']" hide-details="auto"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-select v-model="billingCountry" :items="countries" item-title="name" item-value="code"
                        label="Billing Country" variant="outlined" prepend-inner-icon="mdi-earth"
                        @update:model-value="updateTaxRates" class="mb-4" hide-details="auto"></v-select>
                    </v-col>
                  </v-row>

                  <div ref="cardElement" class="stripe-card-element mb-2"></div>
                  <div v-if="cardError" class="text-error mb-4 text-body-2">{{ cardError }}</div>
                </div>
              </div>

              <v-btn block color="primary" type="submit" :loading="loading" min-height="52"
                class="text-none font-weight-medium rounded-lg">
                <v-icon start class="mr-2">mdi-credit-card-check-outline</v-icon>
                Pay {{ taxDetails.totalAmount }}€
                <template v-slot:loader>
                  <v-progress-circular indeterminate></v-progress-circular>
                </template>
              </v-btn>

              <div class="d-flex align-center justify-center mt-5">
                <v-icon icon="mdi-shield-check-outline" size="small" class="mr-2"></v-icon>
                <span class="text-caption text-medium-emphasis">Secure payment via Stripe</span>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn icon="mdi-close" @click="showSnackbar = false"></v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/userStore';
import { definePageMeta, useHead } from '#imports';
definePageMeta({
  layout: 'empty'
});

useHead({
  title: 'Payment - DevUnity',
  meta: [
    { name: 'author', content: 'Nûr' },
    { name: 'description', content: 'Pay to access premium features of DevUnity' },
    { name: 'robots', content: 'index,follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Payment - DevUnity' },
    { name: 'og:description', content: 'Pay to access premium features of DevUnity' },
    { name: 'og:image', content: '/logo/devunity-title.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://devunity.com/checkout' }
  ]
})

const router = useRouter();
const userStore = useUserStore();

const cardholderName = ref('');
const cardElement = ref<HTMLDivElement | null>(null);
const stripe = ref<any>(null);
const elements = ref<any>(null);
const loading = ref(false);
const cardError = ref('');
const showSnackbar = ref(false);
const snackbarColor = ref('');
const snackbarText = ref('');
const billingCountry = ref('FR');

const countries = [
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PT', name: 'Portugal' },
  { code: 'AT', name: 'Austria' },
  { code: 'DK', name: 'Denmark' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'FI', name: 'Finland' },
];

const taxDetails = ref({
  baseAmount: 300,
  taxAmount: 0,
  totalAmount: 300,
  taxPercentage: 0
});

const features = ref([
  {
    icon: 'mdi-database-outline',
    title: 'Database Designer',
    description: 'Create and visually manage your database schemas'
  },
  {
    icon: 'mdi-magnify',
    title: 'SEO Audit',
    description: 'Analyze and optimize your SEO performance'
  },
  {
    icon: 'mdi-robot',
    title: 'Robots & Schema',
    description: 'Generate robots.txt and schema.org data structures'
  },
  {
    icon: 'mdi-palette',
    title: 'Premium Components',
    description: 'Access all components and development tools'
  }
]);

const updateTaxRates = async () => {
  try {
    loading.value = true;

    const result = await userStore.checkout(cardholderName.value || 'Client', billingCountry.value);

    if (result.success && result.taxDetails) {
      taxDetails.value = result.taxDetails;
      console.log('Tax rates updated for', billingCountry.value, ':', taxDetails.value);
    } else {
      console.error('Error updating tax rates:', result.error);
      showSnackbar.value = true;
      snackbarColor.value = 'warning';
      snackbarText.value = 'Unable to update taxes for this country.';
    }
  } catch (error) {
    console.error('Error updating tax rates:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    updateTaxRates();

    stripe.value = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY || '');

    if (stripe.value) {
      elements.value = stripe.value.elements();

      const cardElementInstance = elements.value.create('card', {
        style: {
          base: {
            color: '#e0e0e0',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            fontWeight: '400',
            lineHeight: '1.5',
            '::placeholder': {
              color: '#9e9e9e'
            },
            iconColor: '#bb86fc',
            ':-webkit-autofill': {
              color: '#e0e0e0',
            },
          },
          invalid: {
            color: '#cf6679',
            iconColor: '#cf6679'
          }
        }
      });

      setTimeout(() => {
        if (cardElement.value) {
          cardElementInstance.mount(cardElement.value);
          cardElementInstance.on('change', (event: any) => {
            cardError.value = event.error ? event.error.message : '';
          });
        }
      }, 100);
    } else {
      showSnackbar.value = true;
      snackbarColor.value = 'error';
      snackbarText.value = 'Unable to load Stripe. Please try again.';
    }
  } catch (error) {
    console.error('Error during initial loading:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = 'Error during initial loading.';
  }
});

const processPayment = async () => {
  if (!stripe.value || !elements.value) {
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = 'Unable to connect to Stripe. Please try again.';
    return;
  }

  loading.value = true;

  try {
    const result = await userStore.checkout(cardholderName.value, billingCountry.value);

    if (!result.success || !result.clientSecret) {
      throw new Error(result.error || 'Error creating payment intent');
    }

    if (result.taxDetails) {
      taxDetails.value = result.taxDetails;
    }

    const { error, paymentIntent } = await stripe.value.confirmCardPayment(
      result.clientSecret,
      {
        payment_method: {
          card: elements.value.getElement('card'),
          billing_details: {
            name: cardholderName.value,
            address: {
              country: billingCountry.value
            }
          }
        }
      }
    );

    if (error) {
      throw new Error(error.message || 'Error confirming payment');
    }

    if (paymentIntent.status === 'succeeded') {
      await userStore.updatePremiumStatus(true);

      showSnackbar.value = true;
      snackbarColor.value = 'success';
      snackbarText.value = 'Payment successful! Premium access activated.';

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } else {
      throw new Error('Payment was not completed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = error instanceof Error ? error.message : 'An error occurred while processing payment.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-screen {
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.left-panel-checkout {
  background-color: rgb(var(--v-theme-surface));
  position: relative;
  overflow: hidden;
}

.left-panel-checkout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(125, 208, 255, 0.12), transparent 40%),
    radial-gradient(circle at 20% 70%, rgba(203, 190, 255, 0.12), transparent 35%);
  z-index: 0;
}

.left-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.right-panel-checkout {
  background-color: rgb(var(--v-theme-background));
  min-height: 100vh;
}

.checkout-card {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 16px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.credit-card-container {
  position: relative;
}

.credit-card-wrapper {
  position: relative;
  padding: 16px;
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(30, 30, 30, 0.6));
  border-radius: 12px;
  border: 1px solid rgba(187, 134, 252, 0.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.credit-card-wrapper:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.credit-card-chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(45deg, #deb887, #ffd700);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.credit-card-chip::before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  background: linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.2) 25%,
      rgba(255, 255, 255, 0.2) 50%, transparent 50%,
      transparent 75%, rgba(255, 255, 255, 0.2) 75%);
  background-size: 10px 10px;
}

.credit-card-brand-icon {
  width: 36px;
  height: 24px;
  margin-left: 8px;
  object-fit: contain;
}

.stripe-card-element {
  padding: 16px;
  border: 1px solid rgba(187, 134, 252, 0.3);
  border-radius: 6px;
  background-color: rgba(30, 30, 30, 0.8) !important;
  transition: all 0.3s ease;
}

.stripe-card-element:hover {
  border-color: rgba(187, 134, 252, 0.7);
}

@media (max-width: 959px) {
  .right-panel-checkout {
    padding: 2rem 1rem;
  }
}
</style>