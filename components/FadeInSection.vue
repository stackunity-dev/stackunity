<template>
  <div ref="fadeRef" class="fade-in-section"
    :class="{ 'is-visible': isVisible || initiallyVisible, 'no-transition': noTransition }" role="region"
    :aria-label="ariaLabel" :aria-hidden="!isVisible && !initiallyVisible">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  ariaLabel?: string;
  reduceMotion?: boolean;
  initiallyVisible?: boolean;
  threshold?: number;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Animated content section',
  reduceMotion: false,
  initiallyVisible: true,
  threshold: 0.1
});

const fadeRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const prefersReducedMotion = ref(false);
const noTransition = ref(true);

const pageReady = inject('pageReady', ref(true));

const observerOptions = {
  threshold: props.threshold
};

const observerCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible.value = true;
      if (observer) {
        observer.unobserve(entry.target);
      }
    }
  });
};

let observer: IntersectionObserver;

const checkReducedMotion = () => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

onMounted(() => {
  checkReducedMotion();
  isVisible.value = true;

  setTimeout(() => {
    noTransition.value = false;
  }, 300);

  if (prefersReducedMotion.value || props.reduceMotion) {
    isVisible.value = true;
    return;
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', checkReducedMotion);

  if (!props.initiallyVisible) {
    observer = new IntersectionObserver(observerCallback, observerOptions);

    if (fadeRef.value) {
      observer.observe(fadeRef.value);
    }

    if (fadeRef.value && fadeRef.value.getBoundingClientRect().top < window.innerHeight) {
      isVisible.value = true;
    }
  } else {
    isVisible.value = true;
  }
});

watch(() => pageReady.value, (newValue) => {
  if (newValue && fadeRef.value) {
    isVisible.value = true;
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.removeEventListener('change', checkReducedMotion);
});
</script>

<style scoped>
.fade-in-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  will-change: opacity, transform;
}

.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-section.no-transition {
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-section {
    transition: none;
    transform: none;
    opacity: 1;
  }

  .fade-in-section.is-visible {
    transform: none;
  }
}
</style>