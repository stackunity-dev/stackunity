<template>
  <div class="onboarding-tutorial" v-if="show">
    <v-overlay v-model="show" scroll-strategy="none" class="onboarding-overlay">
      <div class="tutorial-container">
        <v-card v-if="currentStep < steps.length" class="tutorial-card" :style="getPositionStyle()" elevation="10"
          width="280" :color="getCardColor()" rounded="lg">
          <v-card-title class="pb-2 pt-4 px-4">
            <div class="d-flex align-center">
              <v-icon :icon="steps[currentStep].icon" class="mr-2" />
              {{ steps[currentStep].title }}
            </div>
            <div class="step-indicator text-caption">
              {{ currentStep + 1 }}/{{ steps.length }}
            </div>
          </v-card-title>
          <v-card-text class="pt-0 pb-4 px-4">
            {{ steps[currentStep].description }}
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-btn v-if="currentStep > 0" variant="text" size="small" @click="prevStep" aria-label="Previous step"
              class="px-2">
              <v-icon start>mdi-chevron-left</v-icon>
              Précédent
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="text" size="small" color="error" @click="skipTutorial" aria-label="Skip tutorial"
              class="px-2">
              <v-icon start>mdi-close</v-icon>
              Ignorer
            </v-btn>
            <v-btn v-if="currentStep < steps.length - 1" variant="text" size="small" color="primary" @click="nextStep"
              aria-label="Next step" class="px-2">
              Suivant
              <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn v-else variant="text" size="small" color="success" @click="completeTutorial"
              aria-label="Complete tutorial" class="px-2">
              Terminer
              <v-icon end>mdi-check</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  showOnboarding: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const show = ref(props.showOnboarding);
const currentStep = ref(0);
const router = useRouter();

// Définition des étapes du tutoriel
interface TutorialStep {
  title: string;
  description: string;
  target: string;
  icon: string;
  position: string;
  route?: string;
}

const steps: TutorialStep[] = [
  {
    title: 'Bienvenue sur StackUnity',
    description: 'Découvrez comment optimiser votre site web grâce à nos outils. Ce guide rapide vous aidera à vous familiariser avec notre tableau de bord.',
    target: 'dashboard-title',
    icon: 'mdi-star',
    position: 'center'
  },
  {
    title: 'Navigation principale',
    description: 'Accédez rapidement à toutes les fonctionnalités depuis cette barre de navigation. Cliquez sur les icônes pour explorer les différentes sections.',
    target: 'main-navigation',
    icon: 'mdi-menu',
    position: 'right'
  },
  {
    title: 'Analyser votre site web',
    description: 'Vérifiez les performances, la sécurité et la structure sémantique de votre site pour identifier les améliorations possibles.',
    target: 'website-metrics',
    icon: 'mdi-web',
    position: 'bottom-right'
  },
  {
    title: 'Studio de développement',
    description: 'Utilisez notre studio pour tester, concevoir et optimiser vos projets web en temps réel.',
    target: 'studio-link',
    icon: 'mdi-code-tags',
    position: 'left'
  },
  {
    title: 'Personnalisation',
    description: 'Adaptez votre espace de travail selon vos préférences dans les paramètres du compte.',
    target: 'user-settings',
    icon: 'mdi-cog',
    position: 'top-right'
  }
];

// Fonction pour calculer la position du tooltip en fonction de l'élément ciblé
function getPositionStyle() {
  const step = steps[currentStep.value];
  const target = document.getElementById(step.target);

  if (!target && step.position !== 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  if (step.position === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  const rect = target!.getBoundingClientRect();

  switch (step.position) {
    case 'top':
      return {
        top: `${rect.top - 200}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      };
    case 'right':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.right + 20}px`,
        transform: 'translateY(-50%)'
      };
    case 'bottom':
      return {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left + rect.width / 2}px`,
        transform: 'translateX(-50%)'
      };
    case 'left':
      return {
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left - 300}px`,
        transform: 'translateY(-50%)'
      };
    case 'top-right':
      return {
        top: `${rect.top - 200}px`,
        left: `${rect.right}px`,
        transform: 'translateX(-100%)'
      };
    case 'bottom-right':
      return {
        top: `${rect.bottom + 20}px`,
        left: `${rect.right}px`,
        transform: 'translateX(-100%)'
      };
    case 'bottom-left':
      return {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left}px`,
      };
    case 'top-left':
      return {
        top: `${rect.top - 200}px`,
        left: `${rect.left}px`,
      };
    default:
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
  }
}

function getCardColor() {
  const colors = ['primary', 'secondary', 'primary-lighten-1', 'secondary-lighten-1', 'info'];
  return colors[currentStep.value % colors.length];
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;

    // Si l'étape nécessite de naviguer vers une autre page
    if (steps[currentStep.value].route) {
      router.push(steps[currentStep.value].route as string);
    }
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;

    // Si l'étape nécessite de naviguer vers une autre page
    if (steps[currentStep.value].route) {
      router.push(steps[currentStep.value].route as string);
    }
  }
}

function skipTutorial() {
  show.value = false;
  localStorage.setItem('onboardingCompleted', 'true');
  emit('close');
}

function completeTutorial() {
  show.value = false;
  localStorage.setItem('onboardingCompleted', 'true');
  emit('close');
}

watch(() => props.showOnboarding, (newVal) => {
  show.value = newVal;
});

onMounted(() => {
  // Vérifier si l'utilisateur a déjà vu le tutoriel
  const completed = localStorage.getItem('onboardingCompleted') === 'true';

  if (completed && props.showOnboarding) {
    // L'utilisateur a déjà terminé le tutoriel mais on veut le montrer quand même
    show.value = true;
  } else if (completed) {
    // L'utilisateur a déjà terminé le tutoriel et on ne veut pas le montrer à nouveau
    show.value = false;
  } else {
    // Première fois, on montre le tutoriel
    show.value = props.showOnboarding;
  }
});
</script>

<style scoped>
.onboarding-overlay {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.tutorial-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.tutorial-card {
  position: absolute;
  pointer-events: auto;
  z-index: 1001;
  overflow: visible;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float 3s ease-in-out infinite;
}

.step-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0.7;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
  100% {
    transform: translateY(0px) translateX(-50%);
  }
}

.tutorial-card[style*="transform: translateX"] {
  animation: float-x 3s ease-in-out infinite;
}

.tutorial-card[style*="transform: translateY"] {
  animation: float-y 3s ease-in-out infinite;
}

.tutorial-card[style*="transform: translate(-50%, -50%)"] {
  animation: float-center 3s ease-in-out infinite;
}

@keyframes float-x {
  0% {
    transform: translateY(0px) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
  100% {
    transform: translateY(0px) translateX(-50%);
  }
}

@keyframes float-y {
  0% {
    transform: translateX(0px) translateY(-50%);
  }
  50% {
    transform: translateX(-10px) translateY(-50%);
  }
  100% {
    transform: translateX(0px) translateY(-50%);
  }
}

@keyframes float-center {
  0% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, -60%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
}
</style>