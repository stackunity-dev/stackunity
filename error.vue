<template>
  <div class="error-container">
    <div class="error-content">
      <img src="/images/stackunity.png" alt="StackUnity Logo" width="200" class="error-logo mb-8" />

      <h1 class="error-title">
        <template v-if="error?.statusCode === 404">Page not found</template>
        <template v-else-if="isAuthError">Authentication error</template>
        <template v-else>An error occurred</template>
      </h1>

      <p class="error-message mb-4">
        <template v-if="isAuthError">Your session has expired or is no longer valid. Automatic reconnection attempt in
          progress...</template>
        <template v-else>{{ error?.message || "We're sorry, but something went wrong." }}</template>
      </p>

      <div v-if="isLoading" class="loading-section mb-4">
        <v-progress-circular indeterminate color="primary" class="mb-2"></v-progress-circular>
        <p class="loading-text">Attempting to restore your session... Please wait.</p>
      </div>

      <div class="error-actions">
        <v-btn color="primary" @click="handleError" size="large" :loading="isLoading">
          <v-icon start>mdi-refresh</v-icon>
          Try again
        </v-btn>

        <v-btn color="secondary" variant="outlined" to="/" size="large" :disabled="isLoading">
          <v-icon start>mdi-home</v-icon>
          Return to home
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { TokenUtils } from './utils/token';

const props = defineProps({
  error: Object
});

const isLoading = ref(false);
const isAuthError = computed(() => {
  if (!props.error) return false;
  return props.error.statusCode === 401 ||
    props.error.statusCode === 403 ||
    (props.error.message && props.error.message.toLowerCase().includes('premium')) ||
    (props.error.message && props.error.message.toLowerCase().includes('auth')) ||
    (props.error.message && props.error.message.toLowerCase().includes('null')) ||
    (props.error.message && props.error.message.toLowerCase().includes('undefined')) ||
    (props.error.message && props.error.message.toLowerCase().includes('properties'));
});

const handleError = () => {
  isLoading.value = true;
  setTimeout(() => {
    window.location.reload();
  }, 1500);
};

onMounted(() => {
  TokenUtils.retrieveToken();
});
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: rgb(var(--v-theme-background));
  background-image: radial-gradient(circle at 10% 20%, rgba(125, 208, 255, 0.05), transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(203, 190, 255, 0.05), transparent 40%);
}

.error-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
  padding: 3rem;
  border-radius: 16px;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.error-logo {
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: rgb(var(--v-theme-on-surface));
}

.error-message {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: rgb(var(--v-theme-on-surface));
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
}

.loading-text {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
}

.error-code {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: rgba(var(--v-theme-error), 0.1);
  color: rgb(var(--v-theme-error));
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.error-stack {
  margin-top: 1.5rem;
  text-align: left;
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  max-height: 200px;
}

.error-stack pre {
  font-family: monospace;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  white-space: pre-wrap;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

@media (min-width: 600px) {
  .error-actions {
    flex-direction: row;
  }
}
</style>