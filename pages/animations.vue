<template>
  <main class="main-content">
    <v-container fluid>

      <v-tabs v-model="activeTab" bg-color="secondary" slider-color="tertiary" density="comfortable"
        align-tabs="center">
        <v-tab value="presets">
          <v-icon start>mdi-palette-swatch</v-icon>
          {{ t().tabs.presets }}
        </v-tab>
        <v-tab value="custom">
          <v-icon start>mdi-creation</v-icon>
          {{ t().tabs.custom }}
        </v-tab>
        <v-tab value="transition">
          <v-icon start>mdi-transition</v-icon>
          {{ t().tabs.transition }}
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab" class="mt-4">
        <v-window-item value="presets">
          <v-row>
            <v-col cols="12" sm="6" md="4" v-for="(animation, index) in presetAnimations" :key="index">
              <animation-card :name="animation.name" :icon="animation.icon" :color="animation.color"
                :css-code="animation.cssCode" :animation-class="animation.class" />
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item value="custom">
          <v-card class="pa-4 mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-2">mdi-creation</v-icon>
              {{ t().custom.title }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="customAnimation.name" :label="t().custom.name" variant="outlined"
                    placeholder="fadeInUp" aria-label="Animation name" />

                  <v-select v-model="customAnimation.duration" :items="durationOptions" :label="t().custom.duration"
                    variant="outlined" aria-label="Animation duration" />

                  <v-select v-model="customAnimation.timingFunction" :items="timingOptions"
                    :label="t().custom.timingFunction" variant="outlined" aria-label="Timing function" />
                </v-col>

                <v-col cols="12" md="6">
                  <h3 class="text-subtitle-1 mb-2">{{ t().custom.fromToValues }}</h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select v-model="customAnimation.fromProps.opacity" :items="opacityOptions"
                        :label="t().custom.fromOpacity" variant="outlined" aria-label="Initial opacity" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="customAnimation.toProps.opacity" :items="opacityOptions"
                        :label="t().custom.toOpacity" variant="outlined" aria-label="Final opacity" />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select v-model="customAnimation.fromProps.transform" :items="transformOptions"
                        :label="t().custom.fromTransform" variant="outlined" aria-label="Initial transformation" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="customAnimation.toProps.transform" :items="transformOptions"
                        :label="t().custom.toTransform" variant="outlined" aria-label="Final transformation" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="my-3"></v-divider>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card class="preview-card">
                    <v-card-title>{{ t().custom.preview }}</v-card-title>
                    <v-card-text class="d-flex justify-center align-center">
                      <div class="animated-box" :style="customAnimationStyle" ref="customPreviewBox"></div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click="playCustomAnimation" prepend-icon="mdi-play"
                        aria-label="Play animation">
                        {{ t().custom.play }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="code-card h-100">
                    <v-card-title>{{ t().custom.generatedCode }}</v-card-title>
                    <v-card-text>
                      <pre class="language-css"><code>{{ generatedCssCode }}</code></pre>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="secondary" @click="copyCustomCode" prepend-icon="mdi-content-copy"
                        aria-label="Copy CSS code">
                        {{ t().custom.copy }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>

        <v-window-item value="transition">
          <v-card class="pa-4 mb-4">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" size="24" class="mr-2">mdi-transition</v-icon>
              {{ t().transition.title }}
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select v-model="transition.property" :items="transitionPropertyOptions"
                    :label="t().transition.property" variant="outlined" aria-label="Property to animate" />

                  <v-select v-model="transition.duration" :items="durationOptions" :label="t().transition.duration"
                    variant="outlined" aria-label="Transition duration" />

                  <v-select v-model="transition.delay" :items="delayOptions" :label="t().transition.delay"
                    variant="outlined" aria-label="Delay before the transition starts" />

                  <v-select v-model="transition.timingFunction" :items="timingOptions"
                    :label="t().transition.timingFunction" variant="outlined" aria-label="Transition timing function" />
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="transition-preview-card">
                    <v-card-title>{{ t().transition.preview }}</v-card-title>
                    <v-card-text class="d-flex justify-center align-center py-6">
                      <div class="transition-box" :style="transitionStyle" @mouseenter="hovering = true"
                        @mouseleave="hovering = false"></div>
                    </v-card-text>
                    <v-card-subtitle class="text-center">{{ t().transition.hoverHint }}</v-card-subtitle>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="my-3"></v-divider>

            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-card class="code-card">
                    <v-card-title>{{ t().transition.generatedCode }}</v-card-title>
                    <v-card-text>
                      <pre class="language-css" ref="transitionCodeElement">{{ transitionCssCode }}</pre>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="secondary" @click="copyTransitionCode" prepend-icon="mdi-content-copy"
                        aria-label="Copy transition CSS code">
                        {{ t().transition.copy }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-window-item>
      </v-window>

      <snackBar v-model="snackbar" :text="snackbarText" :color="snackbarColor" :timeout="3000" />
    </v-container>
  </main>
</template>

<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
// @ts-ignore
import AnimationCard from '../components/animations/AnimationCard.vue';
import snackBar from '../components/snackbar.vue';
import {
  generateAnimationCSS,
  generateTransitionCSS,
  getTransitionHoverStyles,
  timingFunctions,
  transformValues,
  transitionProperties
} from '../utils/animations';
// @ts-ignore
import { definePageMeta, useHead } from '#imports';
import { useTranslations } from '../languages';

const t = useTranslations('animation');

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'CSS Animations & Transitions Playground - StackUnity',
  meta: [
    { name: 'description', content: 'Create, test and copy CSS animations and transitions' },
    { name: 'keywords', content: 'CSS, animations, transitions, keyframes, effects, web design' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'CSS Animations & Transitions Playground - StackUnity' },
    { property: 'og:description', content: 'Create, test and copy CSS animations and transitions' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'canonical', href: 'https://stackunity.com/animations' }
  ]
})

const activeTab = ref('presets');
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const customPreviewBox = ref(null);
const hovering = ref(false);
const transitionCodeElement = ref(null);

const presetAnimations = [
  {
    name: t().presets.fadeIn.name,
    icon: 'mdi-fire',
    color: 'warning',
    class: 'fadeIn',
    cssCode: `.fadeIn {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`
  },
  {
    name: t().presets.slideRight.name,
    icon: 'mdi-arrow-right',
    color: 'info',
    class: 'slideRight',
    cssCode: `.slideRight {
  animation: slideRight 1s ease-out;
}

@keyframes slideRight {
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}`
  },
  {
    name: t().presets.bounce.name,
    icon: 'mdi-basketball',
    color: 'warning',
    class: 'bounce',
    cssCode: `.bounce {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
}`
  },
  {
    name: t().presets.pulse.name,
    icon: 'mdi-pulse',
    color: 'success',
    class: 'pulse',
    cssCode: `.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}`
  },
  {
    name: t().presets.shake.name,
    icon: 'mdi-vibrate',
    color: 'primary',
    class: 'shake',
    cssCode: `.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}`
  },
  {
    name: t().presets.rotate.name,
    icon: 'mdi-rotate-left',
    color: 'secondary',
    class: 'rotate',
    cssCode: `.rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`
  }
];

const durationOptions = ['0.3s', '0.5s', '1s', '1.5s', '2s', '3s', 'infinite'];
const delayOptions = ['0s', '0.1s', '0.3s', '0.5s', '1s'];
const timingOptions = timingFunctions.map(item => item.value);
const opacityOptions = ['0', '0.3', '0.5', '0.7', '1'];
const transformOptions = transformValues.map(item => item.value);
const transitionPropertyOptions = transitionProperties.map(item => item.value);

const customAnimation = ref({
  name: 'myAnimation',
  duration: '1s',
  timingFunction: 'ease-in-out',
  fromProps: {
    opacity: '0',
    transform: 'translateY(-50px)'
  },
  toProps: {
    opacity: '1',
    transform: 'none'
  }
});

const transition = ref({
  property: 'all',
  duration: '0.5s',
  delay: '0s',
  timingFunction: 'ease'
});

const generatedCssCode = computed(() => {
  const name = customAnimation.value.name || 'myAnimation';

  let duration = customAnimation.value.duration;
  let iterationCount = '';

  if (duration === 'infinite') {
    duration = '1s';
    iterationCount = 'infinite';
  }

  const css = generateAnimationCSS(
    name,
    duration,
    customAnimation.value.timingFunction,
    customAnimation.value.fromProps.opacity,
    customAnimation.value.fromProps.transform,
    customAnimation.value.toProps.opacity,
    customAnimation.value.toProps.transform,
    iterationCount
  );

  setTimeout(() => {
    applyAnimationStyles(name, css);
  }, 10);

  return css;
});

function applyAnimationStyles(name: string, css: string) {
  let styleEl = document.getElementById('custom-animation-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'custom-animation-style';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

const customAnimationStyle = computed(() => {
  return {
    animation: 'none'
  };
});

const transitionCssCode = computed(() => {
  return generateTransitionCSS(
    transition.value.property,
    transition.value.duration,
    transition.value.timingFunction,
    transition.value.delay
  );
});

const transitionStyle = computed(() => {
  const baseStyle = {
    transition: `${transition.value.property} ${transition.value.duration} ${transition.value.timingFunction} ${transition.value.delay}`
  };

  const hoverStyles = getTransitionHoverStyles(transition.value.property);

  return hovering.value
    ? { ...baseStyle, ...hoverStyles }
    : baseStyle;
});

function showSnackbar(message: string, color = 'success') {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showSnackbar(t().notifications.copied);
    })
    .catch(() => {
      showSnackbar(t().notifications.error, 'error');
    });
}

function copyCustomCode() {
  copyToClipboard(generatedCssCode.value);
}

function copyTransitionCode() {
  copyToClipboard(transitionCssCode.value);
}

function playCustomAnimation() {
  if (!customPreviewBox.value) return;

  const box = customPreviewBox.value as HTMLElement;
  const name = customAnimation.value.name || 'myAnimation';

  box.style.animation = 'none';

  void box.offsetWidth;

  let duration = customAnimation.value.duration;
  let iterationCount = '';

  if (duration === 'infinite') {
    duration = '1s';
    iterationCount = 'infinite';
  }

  box.style.animation = `${name} ${duration} ${customAnimation.value.timingFunction} ${iterationCount}`;
}

watch([activeTab], () => {
  setTimeout(() => {
    hljs.highlightAll();
  }, 10);
});

onMounted(() => {
  hljs.highlightAll();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      hljs.highlightAll();
    });
  });

  setTimeout(() => {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
      observer.observe(block, { childList: true, subtree: true, characterData: true });
    });
  }, 100);

  document.addEventListener('animation:copied', (e: Event) => {
    const event = e as CustomEvent;
    showSnackbar(event.detail.message);
  });

  document.addEventListener('animation:error', (e: Event) => {
    const event = e as CustomEvent;
    showSnackbar(event.detail.message, 'error');
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('animation:copied', (e: Event) => { });
  document.removeEventListener('animation:error', (e: Event) => { });
});
</script>

<style>
main {
  min-height: 100vh;
  background-color: var(--v-theme-background);
  position: relative;
  flex: 1;
  width: 100%;
}

.main-content {
  background-color: var(--v-theme-background);
  flex: 1;
  width: 100%;
}

.animated-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #2196f3, #673ab7);
  margin: auto;
  border-radius: 8px;
}

.transition-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #2196f3, #673ab7);
  border-radius: 8px;
}

.preview-card,
.code-card,
.transition-preview-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-card .v-card-text,
.transition-preview-card .v-card-text {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-card pre {
  background-color: #272822;
  border-radius: 4px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.fadeIn {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slideRight {
  animation: slideRight 1s ease-out;
}

@keyframes slideRight {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.bounce {
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.rotate {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>