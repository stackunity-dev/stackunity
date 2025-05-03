<template>
  <div class="language-monitor-wrapper">
    <transition name="fade-up">
      <div v-if="showMonitor" class="language-monitor" :class="[monitorPosition, { 'rtl': isRTL }]">
        <v-alert density="compact" variant="tonal" :color="color" class="language-alert" :class="{ 'rtl-text': isRTL }"
          border="start" :icon="false" closable @click:close="hideMonitor">
          <template v-slot:prepend>
            <v-icon :icon="icon" size="small" class="mr-2"></v-icon>
          </template>
          <span class="language-monitor-text">{{ message }}</span>
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { availableLanguages, currentLanguage } from '../languages';

const props = defineProps({
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value: string) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const isRTL = computed(() => currentLanguage.value === 'ar');
const showMonitor = ref(false);
const message = ref('');
const monitorPosition = computed(() => props.position);
const color = ref('primary');
const icon = ref('mdi-translate');
const lastLanguageChange = ref(new Date());
const timer = ref<NodeJS.Timeout | null>(null);

const languageNameMap = computed(() => {
  const map: Record<string, string> = {};
  availableLanguages.forEach(lang => {
    map[lang.code] = lang.name;
  });
  return map;
});

const getLanguageChangeMessage = (newLang: string) => {
  switch (newLang) {
    case 'fr':
      return `Langue changée en Français`;
    case 'ar':
      return `تم تغيير اللغة إلى العربية`;
    case 'es':
      return `Idioma cambiado a Español`;
    case 'zh':
      return `语言已更改为中文`;
    default:
      return `Language changed to English`;
  }
};

const hideMonitor = () => {
  showMonitor.value = false;
};

const showLanguageChangedMonitor = (newLang: string) => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }

  message.value = getLanguageChangeMessage(newLang);
  showMonitor.value = true;

  lastLanguageChange.value = new Date();

  timer.value = setTimeout(() => {
    showMonitor.value = false;
    timer.value = null;
  }, props.duration);
};

watch(() => currentLanguage.value, (newLang, oldLang) => {
  if (newLang !== oldLang) {
    showLanguageChangedMonitor(newLang);
  }
});

onMounted(() => {
  return () => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
  };
});
</script>

<style scoped>
.language-monitor-wrapper {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.language-monitor {
  position: absolute;
  max-width: 300px;
  pointer-events: auto;
}

.language-monitor.top-left {
  top: 20px;
  left: 20px;
}

.language-monitor.top-right {
  top: 20px;
  right: 20px;
}

.language-monitor.bottom-left {
  bottom: 20px;
  left: 20px;
}

.language-monitor.bottom-right {
  bottom: 20px;
  right: 20px;
}

.language-monitor.rtl {
  direction: rtl;
}

.rtl-text {
  text-align: right;
}

.language-alert {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.language-monitor-text {
  font-size: 0.95rem;
  font-weight: 500;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>