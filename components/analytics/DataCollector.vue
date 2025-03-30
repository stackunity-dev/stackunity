<template>
  <!-- Composant invisible pour la collecte de données -->
</template>

<script setup lang="ts">
import { useCookieStore } from '@/stores/cookieStore';
import { v4 as uuidv4 } from 'uuid';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// Données collectées
const sessionId = ref('');
const startTime = ref(Date.now());
const userId = ref('');
const pageViews = ref(0);
const scrollDepth = ref(0);
const clickCount = ref(0);
const currentUrl = ref('');
const pageTitle = ref('');
const deviceType = ref('');
const visitDuration = ref(0);
const isActive = ref(false);

// Store et paramètres
const route = useRoute();
const cookieStore = useCookieStore();

// Timer pour la durée de visite
let durationTimer: number;

// Initialiser le tracking
onMounted(() => {
  if (!process.client) return;

  // Initialiser les IDs
  sessionId.value = localStorage.getItem('analytics_session_id') || uuidv4();
  userId.value = localStorage.getItem('user_id') || '';

  // Vérifie si le tracking est autorisé
  if (cookieStore.preferences.analytics) {
    isActive.value = true;
    initializeTracking();
    console.log('Tracking analytics activé');
  }
});

// Arrêter le tracking lors du démontage
onUnmounted(() => {
  if (!process.client) return;

  if (isActive.value) {
    clearInterval(durationTimer);
    sendAnalyticsData();
  }
});

// Surveiller les changements dans les préférences de cookies
watch(() => cookieStore.preferences.analytics, (newValue) => {
  if (!process.client) return;

  if (newValue && !isActive.value) {
    isActive.value = true;
    initializeTracking();
    console.log('Tracking analytics activé après changement de préférences');
  } else if (!newValue && isActive.value) {
    isActive.value = false;
    clearInterval(durationTimer);
    console.log('Tracking analytics désactivé après changement de préférences');
  }
});

// Initialiser l'ID de session et les écouteurs d'événements
function initializeTracking() {
  if (!process.client) return;

  // Stocker l'ID de session
  localStorage.setItem('analytics_session_id', sessionId.value);

  // Détecter le type d'appareil
  const width = window.innerWidth;
  if (width < 768) {
    deviceType.value = 'mobile';
  } else if (width < 1024) {
    deviceType.value = 'tablet';
  } else {
    deviceType.value = 'desktop';
  }

  // Définir l'URL et le titre actuels
  currentUrl.value = window.location.pathname;
  pageTitle.value = document.title;

  // Incrémenter le compteur de vues de page
  pageViews.value++;

  // Configurer les écouteurs d'événements
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('click', handleClick);

  // Démarrer le minuteur pour mesurer la durée de visite
  durationTimer = window.setInterval(() => {
    visitDuration.value = Math.round((Date.now() - startTime.value) / 1000);
  }, 1000);
}

// Mesurer la profondeur de défilement
function handleScroll() {
  if (!process.client) return;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;

  const currentScrollDepth = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
  scrollDepth.value = Math.max(scrollDepth.value, currentScrollDepth);
}

// Compter les clics
function handleClick() {
  clickCount.value++;
}

// Obtenir le navigateur utilisé
function getBrowser() {
  if (!process.client) return 'unknown';

  const userAgent = navigator.userAgent;
  let browser = "Unknown";

  if (userAgent.indexOf("Chrome") > -1) {
    browser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browser = "Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    browser = "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    browser = "Edge";
  }

  return browser;
}

// Envoyer les données au serveur
async function sendAnalyticsData() {
  if (!process.client || !isActive.value) return;

  try {
    const isBounce = pageViews.value === 1 && visitDuration.value < 30;
    const browser = getBrowser();
    const isNewVisitor = !localStorage.getItem('returning_visitor');

    // Les pages avec des actions spécifiques peuvent être considérées comme des conversions
    const conversionPages = ['/checkout', '/subscribe', '/download', '/contact'];
    const isConversion = conversionPages.includes(currentUrl.value) || visitDuration.value > 120;

    const data = {
      user_id: userId.value,
      session_id: sessionId.value,
      page_url: currentUrl.value,
      page_title: pageTitle.value,
      visit_duration: visitDuration.value,
      device_type: deviceType.value,
      browser: browser,
      is_new_visitor: isNewVisitor,
      is_bounce: isBounce,
      is_conversion: isConversion,
      referrer_url: document.referrer
    };

    console.log('Envoi des données analytics:', data);

    const response = await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Réponse du serveur:', result);

    // Marquer l'utilisateur comme visiteur de retour
    localStorage.setItem('returning_visitor', 'true');

  } catch (error) {
    console.error('Erreur lors de l\'envoi des données analytiques:', error);
  }
}
</script>

<style scoped>
/* Ce composant est invisible pour l'utilisateur */
</style>