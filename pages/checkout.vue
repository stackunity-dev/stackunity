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
                <span class="text-h6 font-weight-bold">{{ taxDetails.baseAmount }}€ HT</span>
              </div>
              <v-divider class="mb-3"></v-divider>
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 text-medium-emphasis">Subtotal</span>
                <span class="text-body-2">{{ taxDetails.baseAmount }}€ HT</span>
              </div>
              <div v-if="!taxDetails.isVatExempt && taxDetails.taxPercentage > 0"
                class="d-flex justify-space-between align-center">
                <span class="text-body-2 text-medium-emphasis">TVA ({{ taxDetails.taxPercentage }}%)</span>
                <span class="text-body-2">{{ taxDetails.taxAmount }}€</span>
              </div>
              <v-divider class="my-3"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-1 font-weight-medium">Total</span>
                <span class="text-h6 font-weight-bold">{{ taxDetails.totalAmount }}€
                  <template v-if="!taxDetails.isVatExempt && taxDetails.taxPercentage > 0">TTC</template>
                  <template v-else>HT</template>
                </span>
              </div>
              <div v-if="taxDetails.isVatExempt && taxDetails.vatNumber" class="mt-2 text-caption text-medium-emphasis">
                TVA non applicable, Art. 283-2 du CGI - Autoliquidation de la TVA
                <div>Numéro de TVA : {{ taxDetails.vatNumber }}</div>
              </div>
              <div v-else-if="billingCountry !== 'FR' && !isInEU(billingCountry)"
                class="mt-2 text-caption text-medium-emphasis">
                Exportation hors UE - TVA non applicable
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

                  <v-row dense class="mb-4">
                    <v-col cols="12">
                      <v-select v-model="billingCountry" :items="countries" item-title="name" item-value="code"
                        label="Billing Country" variant="outlined" @update:model-value="updateTaxRates"></v-select>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="12">
                      <v-checkbox v-model="isBusinessCustomer" label="I'm purchasing for a business"
                        @update:model-value="updateTaxRates" hide-details></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row dense v-if="isBusinessCustomer" class="mb-4">
                    <v-col cols="12">
                      <v-text-field v-model="vatNumber" label="VAT Number (for EU businesses)" variant="outlined"
                        placeholder="e.g. FR12345678901"
                        hint="Enter your VAT number to apply reverse charge if eligible" persistent-hint
                        @update:model-value="updateTaxRates"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="12">
                      <v-text-field v-model="cardholderName" label="Cardholder Name" variant="outlined"
                        placeholder="Name on card" required autofocus></v-text-field>
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
                <template v-if="!taxDetails.isVatExempt && taxDetails.taxPercentage > 0">TTC</template>
                <template v-else>HT</template>
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

    <snackbar v-model="showSnackbar" :color="snackbarColor" :text="snackbarText" :timeout="3000" />
  </section>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import snackbar from '../components/snackbar.vue';
import { useUserStore } from '../stores/userStore';
// @ts-ignore
import { definePageMeta, navigateTo, useHead } from '#imports';

definePageMeta({
  layout: 'empty'
});

useHead({
  title: 'Payment - DevUnity',
  meta: [
    { name: 'author', content: 'Nûr' },
    { name: 'description', content: 'Pay to access premium features of DevUnity' },
    { name: 'robots', content: 'nofollow, noindex' },
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
const isBusinessCustomer = ref(false);
const vatNumber = ref('');

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
  taxPercentage: 0,
  isVatExempt: false,
  vatNumber: ''
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
    cardError.value = '';

    const response = await userStore.checkout(
      cardholderName.value,
      billingCountry.value,
      isBusinessCustomer.value,
      vatNumber.value
    );

    if (response.success && response.taxDetails) {
      taxDetails.value = {
        baseAmount: response.taxDetails.baseAmount,
        taxAmount: response.taxDetails.taxAmount,
        totalAmount: response.taxDetails.totalAmount,
        taxPercentage: response.taxDetails.taxPercentage,
        isVatExempt: response.taxDetails.isVatExempt || false,
        vatNumber: response.taxDetails.vatNumber || ''
      };

      if (taxDetails.value.isVatExempt) {
        showSnackbar.value = true;
        snackbarColor.value = 'success';
        snackbarText.value = 'VAT reverse charge applied (0% VAT)';
      }
    } else {
      console.error('Failed to update tax rates:', response.error);
      showSnackbar.value = true;
      snackbarColor.value = 'error';
      snackbarText.value = response.error || 'Failed to calculate taxes';
    }
  } catch (error) {
    console.error('Error updating tax rates:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = 'Failed to calculate taxes';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      console.warn('Warning: Stripe requires HTTPS for live integrations. Please use a secure connection.');
    }

    await updateTaxRates();

    const stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_51R8HEwL1ZwIYz99yojPngr0GNrqqLUQtGy1cYUWXVvjgeP7zKXCRwpKkCktaIQFOEskA3XnNbVuX60l2UwLP0SHv00o1udOfFO';

    if (!stripePublicKey) {
      console.error('Stripe public key is missing');
      showSnackbar.value = true;
      snackbarColor.value = 'error';
      snackbarText.value = 'Payment configuration error. Please contact support.';
      return;
    }

    stripe.value = await loadStripe(stripePublicKey);

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
              color: '#a0a0a0',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        },
      });

      cardElementInstance.mount(cardElement.value!);
      cardElementInstance.on('change', (event: any) => {
        if (event.error) {
          cardError.value = event.error.message;
        } else {
          cardError.value = '';
        }
      });
    } else {
      console.error('Failed to initialize Stripe');
      showSnackbar.value = true;
      snackbarColor.value = 'error';
      snackbarText.value = 'Payment system unavailable. Please try again later.';
    }
  } catch (error) {
    console.error('Error initializing payment form:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = 'Error initializing payment form. Please refresh the page.';
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
    const result = await userStore.checkout(
      cardholderName.value,
      billingCountry.value,
      isBusinessCustomer.value,
      vatNumber.value
    );

    if (!result.success || !result.clientSecret) {
      throw new Error(result.error || 'Error creating payment intent');
    }

    if (result.taxDetails) {
      taxDetails.value = {
        baseAmount: result.taxDetails.baseAmount,
        taxAmount: result.taxDetails.taxAmount,
        totalAmount: result.taxDetails.totalAmount,
        taxPercentage: result.taxDetails.taxPercentage,
        isVatExempt: result.taxDetails.isVatExempt || false,
        vatNumber: result.taxDetails.vatNumber || ''
      };
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
      try {
        const updateResult = await userStore.updatePremiumStatus();
        if (!updateResult.success) {
          console.error('Erreur lors de la mise à jour du statut premium:', updateResult.error);
          showSnackbar.value = true;
          snackbarColor.value = 'warning';
          snackbarText.value = 'Payment successful but premium status update failed. Please refresh the page.';
        }

        if (updateResult.requireRelogin) {
          console.log('Reconnexion requise suite à la mise à jour du statut premium');
          showSnackbar.value = true;
          snackbarColor.value = 'info';
          snackbarText.value = 'Your premium status has been updated. Please log in again to access your premium features.';

          setTimeout(() => {
            userStore.logout();
            window.location.href = '/login';
          }, 2000);
          return;
        }

        await userStore.loadData();
        console.log('Statut premium après paiement:', userStore.user?.isPremium);

        const response = await userStore.generateInvoice(
          paymentIntent.id,
          cardholderName.value,
          userStore.user?.email || '',
          vatNumber.value,
          billingCountry.value,
          isBusinessCustomer.value,
          taxDetails.value.baseAmount,
          taxDetails.value.taxAmount,
          taxDetails.value.totalAmount,
          taxDetails.value.taxPercentage,
          taxDetails.value.isVatExempt
        );

        if (response.success) {
          showSnackbar.value = true;
          snackbarColor.value = 'success';
          snackbarText.value = 'Payment successful! Premium access activated and invoice sent to your email.';
        } else {
          showSnackbar.value = true;
          snackbarColor.value = 'warning';
          snackbarText.value = 'Payment successful, but invoice generation failed. Contact support if needed.';
          console.error('Invoice generation error:', response.error);
        }

        setTimeout(() => {
          navigateTo('/login');
        }, 2000);
      } catch (error) {
        console.error('Error in post-payment process:', error);
        showSnackbar.value = true;
        snackbarColor.value = 'warning';
        snackbarText.value = 'Payment successful but some post-payment operations failed. Please refresh your page.';

        setTimeout(() => {
          navigateTo('/login');
        }, 2000);
      }
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

const isInEU = (countryCode: string): boolean => {
  return countryCode.match(/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE)$/) !== null;
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