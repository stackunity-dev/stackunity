<template>
  <div ref="fadeRef" class="fade-in-section" :class="{ 'is-visible': isVisible }" role="region" :aria-label="ariaLabel"
    :aria-hidden="!isVisible">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  ariaLabel?: string;
  reduceMotion?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Animated content section',
  reduceMotion: false
});

const fadeRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const prefersReducedMotion = ref(false);

const observerOptions = {
  threshold: 0.2
};

const observerCallback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible.value = true;
    }
  });
};

let observer: IntersectionObserver;

const checkReducedMotion = () => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

onMounted(() => {
  checkReducedMotion();

  // Add listener for changes in reduced motion preference
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', checkReducedMotion);

  observer = new IntersectionObserver(observerCallback, observerOptions);
  if (fadeRef.value) {
    observer.observe(fadeRef.value);
  }

  // If reduced motion is preferred or explicitly set, show content immediately
  if (prefersReducedMotion.value || props.reduceMotion) {
    isVisible.value = true;
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }

  // Clean up media query listener
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.removeEventListener('change', checkReducedMotion);
});
</script>

<style scoped>
.fade-in-section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out;
  will-change: opacity, transform;
}

.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Disable animations when reduced motion is preferred */
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