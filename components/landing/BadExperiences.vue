<template>
  <section class="py-16 bad-experiences-section" aria-labelledby="bad-experiences-heading">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-gradient font-weight-bold mb-4">{{ t().badExperiences.title }}</h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto">
          {{ t().badExperiences.description }}
        </p>
      </div>

      <v-row class="mx-0">
        <v-col cols="12" md="4" v-for="(badExperience, index) in badExperiences" :key="badExperience.title">
          <v-card class="bad-experience-card h-100" :class="`border-${badExperience.color}`" elevation="0"
            @mouseenter="startParticles(index)" @mouseleave="stopParticles(index)">
            <div class="particles-container" :id="`particles-${index}`"></div>
            <v-card-item>
              <v-avatar :color="badExperience.color" size="56" class="mb-4">
                <v-icon size="24">{{ badExperience.icon }}</v-icon>
              </v-avatar>
              <v-card-title class="text-h5 font-weight-bold pt-2">
                {{ badExperience.title }}
              </v-card-title>
              <v-card-subtitle class="pt-2 text-medium-emphasis d-flex flex-wrap">
                {{ badExperience.ctv }}
              </v-card-subtitle>
              <v-card-text class="text-body-1">
                {{ badExperience.text }}
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useTranslations } from '../../languages/';


const t = useTranslations('index')

const badExperiences = computed(() => [
  {
    title: t().badExperiences.accessibility.title,
    ctv: t().badExperiences.accessibility.subtitle,
    icon: 'mdi-contrast',
    color: 'primary',
    text: t().badExperiences.accessibility.description
  },
  {
    title: t().badExperiences.seo.title,
    ctv: t().badExperiences.seo.subtitle,
    icon: 'mdi-magnify',
    color: 'secondary',
    text: t().badExperiences.seo.description
  },
  {
    title: t().badExperiences.design.title,
    ctv: t().badExperiences.design.subtitle,
    icon: 'mdi-palette',
    color: 'tertiary',
    text: t().badExperiences.design.description
  }
]);

// Définir les types pour les particules et les frames d'animation
type Particle = HTMLDivElement;
type ParticlesArray = Particle[][];
type AnimationFramesArray = number[];

// Références pour les animations de particules avec les types corrects
const particles = ref<ParticlesArray>([]);
const animationFrames = ref<AnimationFramesArray>([]);

// Fonction pour créer une particule
const createParticle = (container: HTMLElement, color: string): Particle => {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.backgroundColor = color;

  // Position aléatoire
  const x = Math.random() * 100;
  const y = Math.random() * 100;

  // Taille aléatoire
  const size = Math.random() * 6 + 2;

  particle.style.left = `${x}%`;
  particle.style.top = `${y}%`;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  container.appendChild(particle);
  return particle;
};

// Fonction pour animer les particules
const animateParticles = (index: number): void => {
  const container = document.getElementById(`particles-${index}`);
  if (!container) return;

  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(`--v-theme-${badExperiences.value[index].color}`);

  // Créer de nouvelles particules
  if (particles.value[index] && particles.value[index].length < 20) {
    const particle = createParticle(container, color);
    particles.value[index].push(particle);
  }

  // Animer les particules existantes
  if (particles.value[index]) {
    particles.value[index].forEach((particle, i) => {
      const currentX = parseFloat(particle.style.left);
      const currentY = parseFloat(particle.style.top);

      // Mouvement aléatoire
      const newX = currentX + (Math.random() - 0.5) * 2;
      const newY = currentY + (Math.random() - 0.5) * 2;

      // Garder les particules dans les limites
      particle.style.left = `${Math.max(0, Math.min(100, newX))}%`;
      particle.style.top = `${Math.max(0, Math.min(100, newY))}%`;

      // Opacité pulsante
      const opacity = 0.3 + Math.sin(Date.now() / 500 + i) * 0.2;
      particle.style.opacity = opacity.toString();
    });
  }

  animationFrames.value[index] = requestAnimationFrame(() => animateParticles(index));
};

// Démarrer l'animation des particules
const startParticles = (index: number): void => {
  if (!particles.value[index]) {
    particles.value[index] = [];
  }
  animateParticles(index);
};

// Arrêter l'animation des particules
const stopParticles = (index: number): void => {
  if (animationFrames.value[index]) {
    cancelAnimationFrame(animationFrames.value[index]);
  }

  // Supprimer les particules
  const container = document.getElementById(`particles-${index}`);
  if (container) {
    container.innerHTML = '';
  }
  particles.value[index] = [];
};

onMounted(() => {
  // Initialiser les tableaux de particules
  badExperiences.value.forEach((_, index) => {
    particles.value[index] = [];
  });
});
</script>

<style scoped>
.bad-experience-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.bad-experience-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.border-primary {
  border-color: rgba(var(--v-theme-primary), 0.2) !important;
}

.border-secondary {
  border-color: rgba(var(--v-theme-secondary), 0.2) !important;
}

.border-tertiary {
  border-color: rgba(var(--v-theme-tertiary), 0.2) !important;
}
</style>