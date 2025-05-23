<template>
  <section class="auth-screen">
    <v-container fluid class="fill-height pa-0">
      <v-row class="fill-height ma-0">
        <v-col cols="12" md="6" class="d-none d-md-flex left-panel-checkout align-center justify-center">
          <div class="left-content text-center">
            <h1>
              <img src="/images/stackunity.png" alt="{{ t().meta.title }}" class="logo mb-8" width="350" />
              <span class="sr-only">{{ t().meta.title }}</span>
            </h1>

            <div class="premium-highlight mb-8">
              <v-chip color="primary" size="x-large" class="premium-badge">
                <v-icon start icon="mdi-crown" class="mr-2"></v-icon>
                {{ t().plans.bestChoice }}
              </v-chip>
              <h2 class="text-h4 font-weight-bold mt-4 text-white mb-2">{{ t().plans.premium.title }}</h2>
              <p class="text-subtitle-1 text-white-darken-2 premium-tagline">{{ t().plans.premium.description }}</p>
            </div>

            <div class="features-list ml-12">
              <div v-for="(feature, index) in features" :key="index" class="feature-item d-flex align-center"
                :class="{ 'mb-6': index !== features.length - 1 }">
                <v-icon color="primary" size="x-large" class="mr-3">{{ feature.icon }}</v-icon>
                <div class="text-left">
                  <p class="text-body-1 font-weight-medium text-white mb-1">{{ feature.title }}</p>
                  <p class="text-body-2 text-white-darken-2">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <div class="testimonial-section mt-8">
              <div class="testimonial-card pa-4">
                <div class="testimonial-stars mb-2 d-flex justify-center">
                  <v-icon color="amber" v-for="i in 5" :key="i">mdi-star</v-icon>
                </div>
                <p class="testimonial-text text-body-2 mb-3">{{ t().testimonials.premium.text }}</p>
                <div class="testimonial-author">
                  <span class="text-caption font-weight-medium">{{ t().testimonials.premium.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6" class="right-panel-checkout d-flex align-center justify-center">
          <v-card class="checkout-card pa-8 elevation-0" max-width="500" width="100%">
            <div class="d-flex justify-center d-md-none mb-8">
              <img src="/images/stackunity-title.png" alt="StackUnity Logo" width="300" />
            </div>

            <h2 class="text-h5 font-weight-bold text-center mb-4">{{ t().meta.title }}</h2>

            <div class="price-card mb-6">
              <v-card class="elevation-3 rounded-lg overflow-hidden">
                <div class="card-premium-banner">
                  <v-icon icon="mdi-crown" class="mr-1" size="small"></v-icon>
                  {{ t().plans.bestChoice }}
                </div>
                <v-card-text class="pa-6">
                  <div class="d-flex justify-space-between align-center mb-4">
                    <div>
                      <h3 class="text-h5 font-weight-bold mb-1">{{ t().plans.premium.title }}</h3>
                      <div class="text-subtitle-1 text-medium-emphasis">{{ t().plans.premium.description }}</div>
                    </div>
                    <v-chip color="primary" size="large" class="ml-2">
                      <v-icon start>mdi-crown</v-icon>
                      {{ t().plans.bestChoice }}
                    </v-chip>
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <div class="price-details">
                    <div class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1">{{ t().pricing.htPrice }}</span>
                      <span :class="{ 'text-decoration-line-through': (taxDetails.discountAmount ?? 0) > 0 }"
                        class="text-h6 font-weight-bold">
                        {{ taxDetails.baseAmount.toFixed(2) }}€
                      </span>
                    </div>
                    <div v-if="(taxDetails.discountAmount ?? 0) > 0"
                      class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1 success--text">{{ taxDetails.discountDescription }}</span>
                      <span class="text-h6 success--text">-{{ (taxDetails.discountAmount ?? 0).toFixed(2) }}€</span>
                    </div>
                    <div v-if="(taxDetails.discountAmount ?? 0) > 0"
                      class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1">{{ t().pricing.htPriceAfterDiscount }}</span>
                      <span class="text-h6 font-weight-bold">{{ (taxDetails.discountedBaseAmount ??
                        taxDetails.baseAmount).toFixed(2) }}€</span>
                    </div>
                    <div v-if="!taxDetails.isVatExempt && taxDetails.taxPercentage > 0"
                      class="d-flex justify-space-between align-center mb-2">
                      <span class="text-body-1">{{ t().pricing.vat }} ({{ taxDetails.taxPercentage }}%)</span>
                      <span class="text-h6">{{ taxDetails.taxAmount.toFixed(2) }}€</span>
                    </div>
                    <v-divider class="my-3"></v-divider>
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <span class="text-h5 font-weight-bold">{{ t().pricing.totalTTC }}</span>
                        <div class="text-caption text-medium-emphasis">{{ t().pricing.oneTimePayment }}</div>
                      </div>
                      <div class="text-right">
                        <span class="text-h4 font-weight-bold primary--text">{{ taxDetails.totalAmount.toFixed(2)
                        }}€</span>
                        <div v-if="(taxDetails.discountAmount ?? 0) > 0" class="text-caption success--text">
                          {{ t().pricing.youSave }} {{ Math.round((taxDetails.discountAmount ?? 0) /
                            taxDetails.baseAmount * 100) }}%
                        </div>
                        <div v-else class="text-caption success--text">{{ t().pricing.saveVsMonthly }}</div>
                      </div>
                    </div>
                  </div>

                  <div v-if="taxDetails.isVatExempt && taxDetails.vatNumber"
                    class="mt-3 text-caption text-medium-emphasis">
                    {{ t().vatInfo.selfAssessment }}
                    <div>{{ t().vatInfo.vatNumber }}: {{ taxDetails.vatNumber }}</div>
                  </div>
                  <div v-else-if="billingCountry !== 'FR' && !isInEU(billingCountry)"
                    class="mt-3 text-caption text-medium-emphasis">
                    {{ t().vatInfo.exportOutsideEU }}
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <v-form @submit.prevent="processPayment">
              <div class="payment-container mb-6">
                <div class="payment-section-title d-flex align-center mb-4">
                  <v-icon icon="mdi-credit-card-outline" class="mr-2" color="primary"></v-icon>
                  <h3 class="text-h6 font-weight-bold">{{ t().payment.paymentInformation }}</h3>
                </div>

                <div class="payment-wrapper">
                  <v-row dense>
                    <v-col cols="12">
                      <v-autocomplete v-model="billingCountry" :items="countries" item-title="name" item-value="code"
                        :label="t().payment.billingCountry" variant="outlined" @update:model-value="updateTaxRates"
                        auto-select-first clearable>
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <span class="text-subtitle-2 me-2">{{ item.raw.code }}</span>
                            </template>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="12">
                      <v-checkbox v-model="isBusinessCustomer" :label="t().payment.businessCustomer"
                        @update:model-value="updateTaxRates" hide-details></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row dense v-if="isBusinessCustomer" class="mb-4">
                    <v-col cols="12">
                      <v-text-field v-model="vatNumber" :label="t().payment.vatNumber.label" variant="outlined"
                        :placeholder="t().payment.vatNumber.placeholder" :hint="t().payment.vatNumber.hint"
                        persistent-hint @update:model-value="updateTaxRates"></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-4">
                    <v-col cols="12">
                      <v-text-field v-model="promoCode" :label="t().payment.promoCode.label" variant="outlined"
                        :placeholder="t().payment.promoCode.placeholder" append-inner-icon="mdi-check"
                        @click:append-inner="applyPromoCode" @keydown.enter="applyPromoCode"></v-text-field>
                      <div v-if="promoCodeMessage" :class="promoCodeSuccess ? 'text-success' : 'text-error'"
                        class="text-caption mt-1">
                        {{ promoCodeMessage }}
                      </div>
                    </v-col>
                  </v-row>

                  <div class="payment-methods">
                    <v-tabs v-model="activePaymentMethod" color="primary" class="mb-4">
                      <v-tab value="card">Credit Card</v-tab>
                      <v-tab value="paypal">PayPal</v-tab>
                    </v-tabs>

                    <v-window v-model="activePaymentMethod">
                      <v-window-item value="card">
                        <div id="card-form" class="card_container">
                          <v-text-field v-model="cardDetails.name" label="Cardholder Name" placeholder="Your name"
                            :rules="[v => !!v || 'Name is required']" variant="outlined" density="comfortable"
                            class="mb-4"></v-text-field>

                          <v-row>
                            <v-col cols="12" md="8">
                              <v-text-field v-model="cardDetails.number" label="Card Number"
                                placeholder="1234 5678 9012 3456" variant="outlined" density="comfortable" class="mb-4"
                                :rules="[v => !!v || 'Card number is required']" maxlength="19"
                                @input="formatCardNumber"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                              <v-text-field v-model="cardDetails.cvv" label="CVV" placeholder="123" variant="outlined"
                                density="comfortable" class="mb-4" :rules="[v => !!v || 'CVV is required']"
                                maxlength="4" type="password"></v-text-field>
                            </v-col>
                          </v-row>

                          <v-text-field v-model="cardDetails.expiry" label="Expiry Date (MM/YY)" placeholder="01/25"
                            variant="outlined" density="comfortable" class="mb-4"
                            :rules="[v => !!v || 'Expiry date is required']" maxlength="5"
                            @input="formatExpiryDate"></v-text-field>

                          <div class="billing-address">
                            <div class="text-subtitle-2 mb-4">Billing Address</div>
                            <v-text-field v-model="billingAddress.line1" label="Address" variant="outlined"
                              density="comfortable" class="mb-4"></v-text-field>
                            <v-text-field v-model="billingAddress.line2" label="Address Line 2 (Optional)"
                              variant="outlined" density="comfortable" class="mb-4"></v-text-field>
                            <v-row>
                              <v-col cols="6">
                                <v-text-field v-model="billingAddress.adminArea1" label="City" variant="outlined"
                                  density="comfortable" class="mb-4"></v-text-field>
                              </v-col>
                              <v-col cols="6">
                                <v-text-field v-model="billingAddress.postalCode" label="Postal Code" variant="outlined"
                                  density="comfortable" class="mb-4"></v-text-field>
                              </v-col>
                            </v-row>
                            <v-text-field v-model="billingAddress.countryCode" label="Country" variant="outlined"
                              density="comfortable" class="mb-4"></v-text-field>
                          </div>

                          <v-btn color="secondary" block class="mt-6" :loading="loading" @click="submitCardPayment"
                            :disabled="!isFormValid" size="large" elevation="2">
                            Pay Now
                          </v-btn>
                        </div>
                      </v-window-item>

                      <v-window-item value="paypal">
                        <div class="paypal-container">
                          <div id="paypal-button-container" class="mt-4" style="min-height: 150px;"></div>
                        </div>
                      </v-window-item>
                    </v-window>
                  </div>
                </div>
              </div>

              <div class="garanties-section mt-5">
                <div class="d-flex align-center justify-center mb-2">
                  <v-icon icon="mdi-shield-check-outline" size="small" class="mr-2" color="success"></v-icon>
                  <span class="text-caption text-medium-emphasis">{{ t().payment.securePayment }}</span>
                </div>
                <div class="d-flex align-center justify-center">
                  <v-icon icon="mdi-clock-outline" size="small" class="mr-2" color="info"></v-icon>
                  <span class="text-caption text-medium-emphasis">{{ t().payment.refundGuarantee }}</span>
                </div>
              </div>

              <div class="trust-indicators mt-5">
                <div class="text-center mb-3">
                  <span class="text-caption text-medium-emphasis">{{ t().trustIndicators.title }}</span>
                </div>
                <div class="d-flex justify-center align-center flex-wrap">
                  <v-chip size="small" class="ma-1" color="surface-variant" variant="outlined">
                    <v-icon size="x-small" start>mdi-shield-check</v-icon>
                    {{ t().trustIndicators.securePayment }}
                  </v-chip>
                  <v-chip size="small" class="ma-1" color="surface-variant" variant="outlined">
                    <v-icon size="x-small" start>mdi-check-decagram</v-icon>
                    {{ t().trustIndicators.satisfaction }}
                  </v-chip>
                  <v-chip size="small" class="ma-1" color="surface-variant" variant="outlined">
                    <v-icon size="x-small" start>mdi-update</v-icon>
                    {{ t().trustIndicators.updates }}
                  </v-chip>
                </div>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showCardDialog" max-width="500">
      <v-card class="card-dialog">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-credit-card</v-icon>
          Informations de paiement
          <v-spacer></v-spacer>
          <v-btn icon @click="showCardDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="card-details">
            <div class="card-info">
              <v-icon color="primary" size="large">mdi-shield-check</v-icon>
              <div class="text-body-1 mt-2">Paiement sécurisé</div>
              <div class="text-caption text-medium-emphasis">Vos informations sont cryptées et sécurisées</div>
            </div>
            <v-divider class="my-4"></v-divider>
            <div class="payment-methods">
              <div class="text-subtitle-1 mb-2">Méthodes de paiement acceptées</div>
              <div class="d-flex align-center flex-wrap gap-2">
                <v-icon>mdi-credit-card</v-icon>
                <v-icon>mdi-credit-card-multiple</v-icon>
                <v-icon>mdi-bank</v-icon>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup lang="ts">
// @ts-ignore
import { navigateTo } from '#imports';
// @ts-ignore
import { loadScript } from '@paypal/paypal-js';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useTranslations } from '../languages';
import { useUserStore } from '../stores/userStore';

const t = useTranslations('checkout');
const userStore = useUserStore();

const loading = ref(false);
const showSnackbar = ref(false);
const snackbarColor = ref('success');
const snackbarText = ref('');

const billingCountry = ref('FR');
const isBusinessCustomer = ref(false);
const vatNumber = ref('');
const promoCode = ref('');
const promoCodeMessage = ref('');
const promoCodeSuccess = ref(false);
const selectedPlan = ref('premium');
const taxDetails = ref<{
  baseAmount: number;
  discountAmount?: number;
  discountDescription?: string;
  discountedBaseAmount?: number;
  taxAmount: number;
  taxPercentage: number;
  totalAmount: number;
  isVatExempt?: boolean;
  vatNumber?: string;
}>({
  baseAmount: 0.99,
  discountAmount: 0,
  discountDescription: '',
  discountedBaseAmount: 0.99,
  taxAmount: 0,
  taxPercentage: 0,
  totalAmount: 0.99,
  isVatExempt: false,
  vatNumber: ''
});

const countries = [
  { name: 'France', code: 'FR' },
  { name: 'Belgium', code: 'BE' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Luxembourg', code: 'LU' },
  { name: 'Germany', code: 'DE' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Austria', code: 'AT' },
  { name: 'Denmark', code: 'DK' },
  { name: 'Sweden', code: 'SE' },
  { name: 'Norway', code: 'NO' },
  { name: 'Finland', code: 'FI' },
  { name: 'Poland', code: 'PL' },
  { name: 'Romania', code: 'RO' },
  { name: 'Slovakia', code: 'SK' },
  { name: 'Slovenia', code: 'SI' }
];

const features = ref([
  {
    icon: 'mdi-rocket-launch',
    title: t().features.advancedTools.title,
    description: t().features.advancedTools.description
  },
  {
    icon: 'mdi-chart-box',
    title: t().features.analytics.title,
    description: t().features.analytics.description
  },
  {
    icon: 'mdi-shield-check',
    title: t().features.prioritySupport.title,
    description: t().features.prioritySupport.description
  },
  {
    icon: 'mdi-update',
    title: t().features.regularUpdates.title,
    description: t().features.regularUpdates.description
  }
]);

const showCardDialog = ref(false);

const billingAddress = ref({
  line1: '',
  line2: '',
  adminArea1: '',
  adminArea2: '',
  countryCode: 'FR',
  postalCode: ''
});

const cardDetails = ref({
  name: '',
  number: '',
  cvv: '',
  expiry: '',
  type: '',
  expireMonth: '',
  expireYear: ''
});

const isFormValid = computed(() => {
  return cardDetails.value.name &&
    cardDetails.value.number &&
    cardDetails.value.cvv &&
    cardDetails.value.expiry &&
    billingAddress.value.line1 &&
    billingAddress.value.adminArea1 &&
    billingAddress.value.postalCode;
});

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  cardDetails.value.number = value;
};

const formatExpiryDate = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2);
  }
  cardDetails.value.expiry = value;
};

const updateTaxRates = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/payment/calculate-tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        baseAmount: 0.99,
        billingCountry: billingCountry.value,
        isBusinessCustomer: isBusinessCustomer.value,
        vatNumber: vatNumber.value
      })
    });

    const data = await response.json();

    if (data.success && data.taxDetails) {
      taxDetails.value = data.taxDetails;
    } else {
      console.error('Failed to update tax rates:', data.error);
      showSnackbar.value = true;
      snackbarColor.value = 'error';
      snackbarText.value = data.error || t().messages.taxCalculationError;
    }
  } catch (error) {
    console.error('Error updating tax rates:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = t().messages.taxCalculationError;
  } finally {
    loading.value = false;
  }
};

const applyPromoCode = async () => {
  if (!promoCode.value) return;

  loading.value = true;
  try {
    const response = await userStore.checkout(
      userStore.user?.username || '',
      billingCountry.value,
      isBusinessCustomer.value,
      vatNumber.value,
      promoCode.value,
      selectedPlan.value
    );

    if (response.success && response.taxDetails) {
      taxDetails.value = response.taxDetails;
      promoCodeSuccess.value = true;
      promoCodeMessage.value = t().payment.promoCode.success;
    } else {
      promoCodeSuccess.value = false;
      promoCodeMessage.value = t().payment.promoCode.error;
    }
  } catch (error) {
    console.error('Error applying promo code:', error);
    promoCodeSuccess.value = false;
    promoCodeMessage.value = t().payment.promoCode.error;
  } finally {
    loading.value = false;
  }
};

const processPayment = async (event: any) => {
  loading.value = true;
  try {
    const response = await userStore.processPayPalPayment(event.orderID);

    if (response.success) {
      showSnackbar.value = true;
      snackbarColor.value = 'success';
      snackbarText.value = t().messages.paymentSuccess;

      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
    } else if (response.error && response.error.name === 'UNPROCESSABLE_ENTITY') {
      const payerActionLink = response.error.links?.find(link => link.rel === 'payer-action')?.href;
      if (payerActionLink) {
        localStorage.setItem('pendingOrderId', event.orderID);
        window.location.href = payerActionLink;
        return;
      } else {
        throw new Error('Lien de vérification 3D Secure non trouvé');
      }
    } else {
      throw new Error(response.error || 'Payment failed');
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

const cardStyle = {
  layout: 'vertical',
  style: {
    input: {
      fontSize: '16px',
      fontFamily: 'inherit',
      color: '#e0e0e0',
      backgroundColor: '#232323',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '12px 16px',
      transition: 'all 0.3s ease'
    },
    '.invalid': {
      borderColor: '#ff5252',
      color: '#ff5252'
    },
    '.valid': {
      borderColor: '#4caf50',
      color: '#4caf50'
    },
    ':focus': {
      borderColor: 'rgb(var(--v-theme-primary))',
      boxShadow: '0 0 0 2px rgba(var(--v-theme-primary), 0.2)'
    },
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)'
    }
  }
};

const activePaymentMethod = ref('card');

watch(activePaymentMethod, async (newValue) => {
  if (newValue === 'paypal') {
    await nextTick();
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
      const paypal = await loadScript({
        clientId: 'ASBf0oA-RI0eCLn5QRyo9GHGLe9KgfdfrkAHT6SAqk0m8AWPzVvIUbbxazk4fjZfGEiWVnucG9dtHMLf',
        currency: "EUR",
        intent: "capture",
        components: "buttons",
        'disable-funding': 'card'
      });

      if (paypal) {
        paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay'
          },
          createOrder: async () => {
            const response = await userStore.createPayPalOrder(
              userStore.user?.username || '',
              billingCountry.value,
              isBusinessCustomer.value,
              vatNumber.value,
              promoCode.value,
              selectedPlan.value
            );

            if (response.success && response.orderId) {
              return response.orderId;
            } else {
              throw new Error(response.error || 'Failed to create order');
            }
          },
          onApprove: async (data: any) => {
            try {
              const response = await userStore.processPayPalPayment(data.orderID);
              if (response.success) {
                showSnackbar.value = true;
                snackbarColor.value = 'success';
                snackbarText.value = t().messages.paymentSuccess;
                setTimeout(() => {
                  navigateTo('/login');
                }, 2000);
              } else {
                throw new Error(response.error || 'Payment failed');
              }
            } catch (error) {
              console.error('Error processing payment:', error);
              showSnackbar.value = true;
              snackbarColor.value = 'error';
              snackbarText.value = error instanceof Error ? error.message : 'An error occurred while processing payment.';
            }
          },
          onError: (err: any) => {
            console.error('PayPal Error:', err);
            showSnackbar.value = true;
            snackbarColor.value = 'error';
            snackbarText.value = 'An error occurred with PayPal. Please try again.';
          }
        }).render('#paypal-button-container');
      }
    }
  }
});

onMounted(async () => {
  try {
    const userLanguage = navigator.language || navigator.languages[0] || 'en-US';
    const countryCode = userLanguage.split('-')[1] || userLanguage.split('_')[1] || 'FR';

    const foundCountry = countries.find(country => country.code === countryCode);
    if (foundCountry) {
      billingCountry.value = foundCountry.code;
    }

    await updateTaxRates();

    await nextTick();

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
      return;
    }

    const paypal = await loadScript({
      clientId: 'ASBf0oA-RI0eCLn5QRyo9GHGLe9KgfdfrkAHT6SAqk0m8AWPzVvIUbbxazk4fjZfGEiWVnucG9dtHMLf',
      currency: "EUR",
      intent: "capture",
      components: "buttons"
    });

    if (paypal) {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        },
        createOrder: async () => {
          const response = await userStore.createPayPalOrder(
            userStore.user?.username || '',
            billingCountry.value,
            isBusinessCustomer.value,
            vatNumber.value,
            promoCode.value,
            selectedPlan.value
          );

          if (response.success && response.orderId) {
            return response.orderId;
          } else {
            throw new Error(response.error || 'Failed to create order');
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await userStore.processPayPalPayment(data.orderID);
            if (response.success) {
              showSnackbar.value = true;
              snackbarColor.value = 'success';
              snackbarText.value = t().messages.paymentSuccess;
              setTimeout(() => {
                navigateTo('/login');
              }, 2000);
            } else {
              throw new Error(response.error || 'Payment failed');
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            showSnackbar.value = true;
            snackbarColor.value = 'error';
            snackbarText.value = error instanceof Error ? error.message : 'An error occurred while processing payment.';
          }
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          showSnackbar.value = true;
          snackbarColor.value = 'error';
          snackbarText.value = 'An error occurred with PayPal. Please try again.';
        }
      }).render('#paypal-button-container');
    }
  } catch (error) {
    console.error('Error initializing payment form:', error);
    showSnackbar.value = true;
    snackbarColor.value = 'error';
    snackbarText.value = t().messages.initError;
  }
});

const submitCardPayment = async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/payment/process-card', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cardDetails: {
          name: cardDetails.value.name,
          number: cardDetails.value.number.replace(/\s/g, ''),
          cvv: cardDetails.value.cvv,
          expiry: cardDetails.value.expiry
        },
        billingAddress: billingAddress.value,
        amount: taxDetails.value.totalAmount,
        currency: 'EUR',
        description: `StackUnity Premium - ${selectedPlan.value}`,
        username: userStore.user?.username,
        billingCountry: billingCountry.value,
        isBusinessCustomer: isBusinessCustomer.value,
        vatNumber: vatNumber.value,
        promoCode: promoCode.value
      })
    });

    const data = await response.json();

    if (data.success) {
      const payerActionLink = data.order?.links?.find((link: any) => link.rel === 'payer-action');

      if (payerActionLink?.href) {
        // Redirection vers 3D Secure
        console.log('🔁 Redirection 3DS:', payerActionLink.href);
        window.location.href = payerActionLink.href;
        return;
      }

      snackbarColor.value = 'success';
      snackbarText.value = 'Commande créée, aucun 3DS requis.';
      showSnackbar.value = true;
      loading.value = false;
    } else {
      throw new Error(data.error || 'Échec de création de commande');
    }


    if (data.success) {
      snackbarColor.value = 'success';
      snackbarText.value = 'Paiement effectué avec succès !';
      showSnackbar.value = true;

      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
    } else {
      throw new Error(data.error || 'Échec du paiement');
    }

  } catch (error: any) {
    console.error('Erreur lors du paiement:', error);
    snackbarColor.value = 'error';
    snackbarText.value = error.message || 'Échec du paiement';
    showSnackbar.value = true;
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
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
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

.payment-container {
  background: #1e1e2f;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0;
}

.payment-wrapper {
  background: #232323;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 0;
}

#paypal-button-container {
  min-height: auto;
  padding: 0;
  margin: 0;
  border-radius: 8px;
}

:deep(.paypal-button) {
  background-color: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-text) {
  color: #000 !important;
}

:deep(.paypal-button-container) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-row) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-logo) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-card) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-card-details) {
  margin: 0 !important;
  padding: 0 !important;
}

.price-card {
  background: linear-gradient(145deg, rgb(var(--v-theme-surface)) 0%, rgb(var(--v-theme-surface-variant)) 100%);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.price-card:hover {
  transform: translateY(-4px);
}

.price-card .v-card {
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.card-premium-banner {
  position: absolute;
  top: 10px;
  right: -30px;
  background: linear-gradient(45deg, rgba(var(--v-theme-primary), 1), rgba(var(--v-theme-info), 1));
  color: white;
  padding: 5px 30px;
  font-weight: bold;
  font-size: 12px;
  transform: rotate(45deg);
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.price-details {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 16px;
  border-radius: 8px;
}

.plan-switch {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  padding: 8px;
  border-radius: 8px;
}

.plan-switch .v-btn-toggle {
  width: 100%;
}

.plan-switch .v-btn {
  flex: 1;
  height: 48px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.plan-switch .v-btn:hover {
  transform: translateY(-2px);
}

.plan-switch .v-btn--active {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  color: white;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.benefits-section {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s ease;
}

.benefits-section:hover {
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.pay-button {
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.4);
}

.pay-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(var(--v-theme-primary), 0.5);
}

.premium-badge {
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-info)));
  font-weight: bold;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(var(--v-theme-primary), 0.3);
}

.premium-tagline {
  max-width: 80%;
  margin: 0 auto;
}

.testimonial-section {
  margin-top: 3rem;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 90%;
  margin: 0 auto;
}

.testimonial-text {
  font-style: italic;
  line-height: 1.6;
}

.garanties-section {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-success), 0.1);
}

.premium-features {
  background: rgba(var(--v-theme-primary), 0.08);
  border-radius: 8px;
  padding: 12px;
}

.special-offer-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.05), rgba(var(--v-theme-warning), 0.08));
  border: 1px solid rgba(var(--v-theme-error), 0.2);
  border-radius: 8px;
  position: relative;
}

.special-offer-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 20px 0;
  border-color: transparent rgba(var(--v-theme-error), 0.4) transparent transparent;
}

.trust-indicators {
  border-top: 1px dashed rgba(var(--v-theme-on-surface), 0.1);
  padding-top: 1rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(var(--v-theme-primary), 0.7);
  }
  100% {
    box-shadow: 0 4px 20px rgba(var(--v-theme-primary), 0.4);
  }
}

.pay-button {
  animation: pulse 2s infinite;
}

.card-dialog {
  background: #1e1e2f !important;
  color: #e0e0e0 !important;
}

.card-dialog :deep(.v-card-title) {
  color: #e0e0e0 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
}

.card-dialog :deep(.v-card-text) {
  padding: 24px;
}

.card-details {
  text-align: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.payment-methods {
  text-align: center;
}

.gap-2 {
  gap: 8px;
}

#paypal-button-container {
  min-height: auto;
  padding: 0;
  margin: 0;
}

:deep(.paypal-button) {
  background-color: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.paypal-button-text) {
  color: #000 !important;
}

.card_container {
  background: #1e1e2f;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.card_container:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.card_container :deep(.v-field) {
  background: #232323 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card_container :deep(.v-field:hover) {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}

.card_container :deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.1) !important;
}

.card_container :deep(.v-field__input) {
  color: #ffffff !important;
  font-size: 16px !important;
  padding: 12px 16px !important;
}

.card_container :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 14px !important;
  font-weight: 500;
}

.card_container :deep(.v-field--error) {
  border-color: #ff5252 !important;
}

.billing-address {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 32px;
  margin-top: 32px;
}

.card_container :deep(.v-btn) {
  background: rgb(var(--v-theme-secondary));
  color: white !important;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--v-theme-secondary), 0.3);
}

.card_container :deep(.v-btn:hover) {
  background: rgb(var(--v-theme-secondary)) !important;
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-secondary), 0.4);
}

.card_container :deep(.v-btn:active) {
  transform: translateY(1px);
}

.card_container :deep(.v-btn--disabled) {
  background: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: none !important;
}

.payment-section-title {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-section-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}
</style>