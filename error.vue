<template>
  <div class="error-container">
    <div class="error-content">
      <img src="/logo/devunity.png" alt="DevUnity Logo" width="200" class="error-logo mb-8" />

      <h1 class="error-title">{{ error?.statusCode === 404 ? 'Page not found' : 'An error occurred' }}</h1>
      <p class="error-message mb-4">{{ 'We\'re sorry, but something went wrong.' }}</p>

      <div class="error-actions">
        <v-btn color="primary" @click="handleError" size="large">
          <v-icon start>mdi-refresh</v-icon>
          Try again
        </v-btn>

        <v-btn color="secondary" variant="outlined" to="/" size="large">
          <v-icon start>mdi-home</v-icon>
          Return to home
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

defineProps({
  error: Object
});

const router = useRouter();
const showDetails = process.env.NODE_ENV === 'development';

const handleError = () => {
  window.location.reload();
};
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