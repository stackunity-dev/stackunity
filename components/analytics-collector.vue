<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts">
import { useCookieStore } from '@/stores/cookieStore';
import { useUserStore } from '@/stores/userStore';
import { onMounted, onUnmounted, watch } from 'vue';

const cookieStore = useCookieStore();
const userStore = useUserStore();

let sessionStartTime: number;
let lastPageViewTime: number;
let currentSessionId: string;
let visibilityListener: any = null;
let popstateListener: any = null;

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

const getLocation = async () => {
  try {
    const response = await fetch('/api/proxy/ipapi', {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city
    };
  } catch (error) {
    console.warn('Impossible de récupérer la localisation:', error);
    return {
      country: 'Unknown',
      city: 'Unknown'
    };
  }
};

// Fonction pour vérifier si le suivi analytique est activé
const isAnalyticsEnabled = () => {
  return cookieStore.hasGivenConsent && cookieStore.preferences.analytics;
};

// Fonction pour nettoyer les écouteurs d'événements
const cleanupEventListeners = () => {
  if (visibilityListener) {
    document.removeEventListener('visibilitychange', visibilityListener);
    visibilityListener = null;
  }

  if (popstateListener) {
    window.removeEventListener('popstate', popstateListener);
    popstateListener = null;
  }
};

// Démarrer le suivi
const startTracking = () => {
  if (!isAnalyticsEnabled()) return;

  console.log('Démarrage du suivi analytique');
  sessionStartTime = Date.now();
  lastPageViewTime = sessionStartTime;
  currentSessionId = crypto.randomUUID();

  // Envoyer la première vue de page
  sendPageView();

  // Configurer les écouteurs d'événements
  visibilityListener = handleVisibilityChange;
  document.addEventListener('visibilitychange', visibilityListener);

  popstateListener = sendPageView;
  window.addEventListener('popstate', popstateListener);
};

// Arrêter le suivi
const stopTracking = async () => {
  console.log('Arrêt du suivi analytique');

  // Nettoyer les écouteurs d'événements
  cleanupEventListeners();

  // Envoyer une dernière mise à jour de session si nécessaire
  if (sessionStartTime) {
    await sendSessionEnd();
  }
};

const sendPageView = async () => {
  if (!isAnalyticsEnabled()) {
    stopTracking();
    return;
  }

  const now = Date.now();
  const timeOnPage = lastPageViewTime ? now - lastPageViewTime : 0;
  lastPageViewTime = now;

  const location = await getLocation();

  try {
    const response = await fetch('/api/analytics/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'pageview',
        page_url: window.location.pathname,
        page_title: document.title,
        user_id: userStore.user?.id || 'anonymous',
        session_id: currentSessionId,
        device_type: getDeviceType(),
        country: location.country,
        city: location.city,
        referrer_url: document.referrer,
        visit_duration: Math.floor(timeOnPage / 1000),
        is_new_visitor: false,
        is_bounce: false,
        is_conversion: false,
        browser: navigator.userAgent.toLowerCase().includes('chrome') ? 'chrome' :
          navigator.userAgent.toLowerCase().includes('firefox') ? 'firefox' :
            navigator.userAgent.toLowerCase().includes('safari') ? 'safari' : 'other'
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données analytiques:', error);
  }
};

const handleVisibilityChange = async () => {
  if (!isAnalyticsEnabled()) {
    stopTracking();
    return;
  }

  if (document.hidden) {
    const timeOnSite = Date.now() - sessionStartTime;

    try {
      const timestamp = Date.now();

      const response = await fetch(`/api/analytics/collect?_=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'session_end',
          session_id: currentSessionId,
          user_id: userStore.user?.id || 'anonymous',
          visit_duration: Math.floor(timeOnSite / 1000),
          is_bounce: false,
          is_conversion: false,
          is_new_visitor: false,
          page_url: window.location.pathname,
          page_title: document.title,
          device_type: getDeviceType(),
          browser: 'unknown'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données de fin de session:', error);
    }
  }
};

const sendSessionEnd = async () => {
  const timeOnSite = Date.now() - sessionStartTime;

  try {
    const timestamp = Date.now();

    const response = await fetch(`/api/analytics/collect?_=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'session_end',
        session_id: currentSessionId,
        user_id: userStore.user?.id || 'anonymous',
        visit_duration: Math.floor(timeOnSite / 1000),
        is_bounce: false,
        is_conversion: false,
        is_new_visitor: false,
        page_url: window.location.pathname,
        page_title: document.title,
        device_type: getDeviceType(),
        browser: 'unknown'
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données de fin de session:', error);
  }
};

// Surveiller les changements dans les préférences de cookies
watch(
  () => cookieStore.preferences.analytics,
  (newValue) => {
    if (newValue) {
      startTracking();
    } else {
      stopTracking();
    }
  }
);

// Écouter les changements de préférence analytics via l'événement personnalisé
const setupAnalyticsPreferenceListener = () => {
  if (process.client) {
    window.addEventListener('analytics-preference-changed', ((event: CustomEvent) => {
      const isEnabled = event.detail?.enabled;
      console.log('Préférence analytics modifiée:', isEnabled);

      if (isEnabled) {
        startTracking();
      } else {
        stopTracking();
      }
    }) as EventListener);
  }
};

onMounted(() => {
  setupAnalyticsPreferenceListener();
  if (isAnalyticsEnabled()) {
    startTracking();
  }
});

onUnmounted(async () => {
  await stopTracking();
});
</script>