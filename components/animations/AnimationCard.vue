<template>
  <v-card class="animation-card pa-4 ">
    <v-card-title class="d-flex align-center justify-center">
      <v-icon :color="color" class="mr-2">{{ icon }}</v-icon>
      {{ name }}
    </v-card-title>
    <v-card-text>
      <div class="animated-box mb-4" :class="{ [animationClass]: playing }" ref="animationBox"></div>

      <v-expansion-panels variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon class="mr-2" size="small">mdi-code-tags</v-icon>
              Code CSS
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <pre class="language-css pa-2 bg-grey-darken-5"><code ref="codeElement">{{ cssCode }}</code></pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>

    <v-card-actions class="justify-space-between">
      <v-btn color="primary" @click="playAnimation" prepend-icon="mdi-play" size="small" aria-label="Play animation">
        Play
      </v-btn>

      <v-btn color="secondary" @click="copyCode" prepend-icon="mdi-content-copy" size="small"
        aria-label="Copy CSS code">
        Copy
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { ref, watch } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  cssCode: {
    type: String,
    required: true
  },
  animationClass: {
    type: String,
    required: true
  }
});

const playing = ref(false);
const animationBox = ref(null);
const codeElement = ref(null);

watch(codeElement, () => {
  if (codeElement.value) {
    hljs.highlightElement(codeElement.value);
  }
});

function playAnimation() {
  playing.value = false;

  setTimeout(() => {
    playing.value = true;

    if (!props.cssCode.includes('infinite')) {
      setTimeout(() => {
        playing.value = false;
      }, 1500);
    }
  }, 10);
}

function copyCode() {
  navigator.clipboard.writeText(props.cssCode)
    .then(() => {
      const event = new CustomEvent('animation:copied', {
        detail: {
          message: 'Code copied !'
        }
      });
      document.dispatchEvent(event);
    })
    .catch(() => {
      const event = new CustomEvent('animation:error', {
        detail: {
          message: 'Error while copying'
        }
      });
      document.dispatchEvent(event);
    });
}

</script>

<style scoped>
.animation-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.animation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.animated-box {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2196f3, #673ab7);
  margin: auto;
  border-radius: 8px;
}

.animation-icon {
  font-size: 1.5rem;
}

pre {
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  font-size: 0.85rem;
}

.v-card-actions {
  margin-top: auto;
}
</style>