<template>
  <v-snackbar v-model="modelValue" :color="color" :timeout="timeout">
    {{ text }}
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="$emit('update:modelValue', false)"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  color: {
    type: String,
    default: 'info'
  },
  text: {
    type: String,
    required: true
  },
  timeout: {
    type: Number,
    default: 3000
  }
});

defineEmits(['update:modelValue']);
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