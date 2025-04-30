<template>
  <v-snackbar v-model="show" color="grey-darken-4" :timeout="computedTimeout" location="top right" elevation="4"
    :transition="'slide-x-reverse-transition'" data-plausible-feature="snackbar" role="alert" aria-live="polite">
    <div class="d-flex align-center">
      <v-icon :color="iconColor" :icon="icon" class="mr-2" :aria-label="getIconLabel" />
      <div>
        <span role="status">{{ text }}</span>
        <div v-if="showFeedbackLink" class="mt-1">
          <a href="#" class="text-primary text-decoration-none text-caption" @click.prevent="openFeedbackDialog">
            <span class="d-flex align-center">
              <v-icon size="small" class="mr-1">mdi-send-outline</v-icon>
              Report this issue
            </span>
          </a>
        </div>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="500">
      <v-card class="rounded-lg bg-surface">
        <v-card-title class="bg-secondary text-white py-3 px-4 rounded-t-lg">
          <v-icon color="white" class="mr-2">mdi-bug-outline</v-icon>
          Report this issue
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-2 mb-4">Please help us improve StackUnity. Please provide more details on the issue you
            encountered.</p>

          <v-form ref="feedbackForm" v-model="isFormValid">
            <v-text-field v-model="feedback.email" label="Your email (optional)" variant="outlined"
              density="comfortable" prepend-inner-icon="mdi-email-outline" class="mb-3"></v-text-field>

            <v-textarea v-model="feedback.additionalInfo" label="Additional information (optional)" variant="outlined"
              density="comfortable" prepend-inner-icon="mdi-text-box-outline"
              placeholder="Describe what you were doing when the error occurred" rows="3" class="mb-3"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn color="tertiary" :loading="sending" @click="sendErrorFeedback">
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useUserStore } from '../stores/userStore';

const props = defineProps<{
  modelValue: boolean;
  text: string;
  color?: string;
  timeout?: number;
}>();

const emit = defineEmits(['update:modelValue']);
const userStore = useUserStore();

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const iconColor = computed(() => props.color || 'info');
const showFeedbackLink = computed(() => props.color === 'error' || props.color === 'warning');

const computedTimeout = computed(() => {
  if (props.color === 'error' || props.color === 'warning') {
    return 300000;
  }
  return props.timeout || 3000;
});

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

const showDialog = ref(false);
const isFormValid = ref(true);
const sending = ref(false);
const feedbackForm = ref(null);

const feedback = ref({
  email: userStore.user?.email || '',
  additionalInfo: ''
});

function openFeedbackDialog() {
  showDialog.value = true;
}

function closeDialog() {
  showDialog.value = false;
  feedback.value.additionalInfo = '';
  emit('update:modelValue', false);
}

watch(showDialog, (newVal) => {
  if (newVal === false && !sending.value) {
    emit('update:modelValue', false);
  }
});

async function sendErrorFeedback() {
  sending.value = true;

  try {
    const response = await fetch('/api/feedback/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        errorMessage: props.text,
        errorStack: null,
        userEmail: feedback.value.email,
        userInfo: userStore.user ? `${userStore.user.name || 'Not provided'} (ID: ${userStore.user.id || 'Not available'})` : 'Not logged in',
        url: window.location.href,
        additionalInfo: feedback.value.additionalInfo || 'No additional information provided'
      })
    });

    const result = await response.json();

    if (result.success) {
      closeDialog();
      emit('update:modelValue', false);

      setTimeout(() => {
        alert('Thank you for your report! We will look into this issue.');
      }, 100);
    } else {
      alert('An error occurred while sending your report. Please try again.');
    }
  } catch (error) {
    console.error('Error sending feedback:', error);
    alert('An error occurred while sending your report. Please try again.');
  } finally {
    sending.value = false;
  }
}
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