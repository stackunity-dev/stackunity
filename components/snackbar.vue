<template>
  <v-snackbar v-model="show" color="grey-darken-4" :timeout="timeout" location="top right" elevation="4"
    :transition="'slide-x-reverse-transition'" data-plausible-feature="snackbar" role="alert" aria-live="polite">
    <div class="d-flex align-center">
      <v-icon :color="iconColor" :icon="icon" class="mr-2" :aria-label="getIconLabel" />
      <span role="status">{{ text }}</span>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  text: string;
  color?: string;
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const iconColor = computed(() => props.color || 'info');

const icon = computed(() => {
  switch (props.color) {
    case 'success':
      return 'mdi-check-circle';
    case 'error':
      return 'mdi-alert-circle';
    case 'warning':
      return 'mdi-alert';
    case 'info':
      return 'mdi-information';
    default:
      return 'mdi-bell';
  }
});

const getIconLabel = computed(() => {
  switch (props.color) {
    case 'success':
      return 'Success notification';
    case 'error':
      return 'Error notification';
    case 'warning':
      return 'Warning notification';
    case 'info':
      return 'Information notification';
    default:
      return 'Notification';
  }
});
</script>

<style scoped>
.snackbar-custom {
  position: fixed !important;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>