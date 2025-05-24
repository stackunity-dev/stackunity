<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 success-card">
          <div class="success-header">
            <v-icon color="success" size="64" class="success-icon">mdi-check-circle</v-icon>
          </div>
          <v-card-title class="text-h4 text-center pt-6">
            Payment Success !
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-h6 mb-4">
              Thank you for your trust
            </p>
            <p class="text-body-1 mb-6">
              Your payment has been processed successfully. An email confirmation has been sent to you.
            </p>
            <v-divider class="mb-6"></v-divider>
            <div class="d-flex justify-center align-center mb-6">
              <v-btn color="secondary" prepend-icon="mdi-login" @click="goToLogin">
                Back to login
              </v-btn>
            </div>
            <p class="text-caption text-medium-emphasis">
              Automatic redirection in {{ countdown }} seconds...
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const router = useRouter();
const countdown = ref(5);
const generatingInvoice = ref(false);
const userStore = useUserStore();

const generateInvoice = async () => {
  generatingInvoice.value = true;
  try {
    const response = await fetch('/api/payment/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token}`
      },
      body: JSON.stringify({
        type: 'generate_invoice'
      })
    });

    if (!response.ok) {
      console.error('Error generating invoice:', response);
      throw new Error('Error generating invoice');
    }

    const data = await response.json();
  } catch (error) {
    console.error('Error generating invoice:', error);
  } finally {
    generatingInvoice.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

onMounted(async () => {
  await generateInvoice();
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push('/login');
    }
  }, 5000);
});
</script>

<style scoped>
.success-card {
  background: #1e1e2f !important;
  color: #e0e0e0 !important;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.success-card:hover {
  transform: translateY(-5px);
}

.success-header {
  background: linear-gradient(45deg, #1e1e2f 0%, #2d2d44 100%);
  padding: 40px 0;
  text-align: center;
}

.success-icon {
  animation: scaleIn 0.5s ease-out;
}

.v-card-title {
  color: #e0e0e0 !important;
  padding: 20px;
}

.v-card-text {
  padding: 32px;
}

.text-caption {
  opacity: 0.7;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>