import { defineComponent, watch, mergeProps } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
import { bM as useCookieStore, S as useUserStore } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analytics-collector",
  __ssrInlineRender: true,
  setup(__props) {
    const cookieStore = useCookieStore();
    const userStore = useUserStore();
    let sessionStartTime;
    let lastPageViewTime;
    let currentSessionId;
    let visibilityListener = null;
    let popstateListener = null;
    const getDeviceType = () => {
      const ua = (void 0).userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
      }
      return "desktop";
    };
    const getLocation = async () => {
      try {
        const response = await fetch("/api/proxy/ipapi", {
          method: "GET",
          signal: AbortSignal.timeout(3e3)
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
        console.warn("Impossible de récupérer la localisation:", error);
        return {
          country: "Unknown",
          city: "Unknown"
        };
      }
    };
    const isAnalyticsEnabled = () => {
      return cookieStore.hasGivenConsent && cookieStore.preferences.analytics;
    };
    const cleanupEventListeners = () => {
      if (visibilityListener) {
        (void 0).removeEventListener("visibilitychange", visibilityListener);
        visibilityListener = null;
      }
      if (popstateListener) {
        (void 0).removeEventListener("popstate", popstateListener);
        popstateListener = null;
      }
    };
    const startTracking = () => {
      if (!isAnalyticsEnabled()) return;
      console.log("Démarrage du suivi analytique");
      sessionStartTime = Date.now();
      lastPageViewTime = sessionStartTime;
      currentSessionId = crypto.randomUUID();
      sendPageView();
      visibilityListener = handleVisibilityChange;
      (void 0).addEventListener("visibilitychange", visibilityListener);
      popstateListener = sendPageView;
      (void 0).addEventListener("popstate", popstateListener);
    };
    const stopTracking = async () => {
      console.log("Arrêt du suivi analytique");
      cleanupEventListeners();
      if (sessionStartTime) {
        await sendSessionEnd();
      }
    };
    const sendPageView = async () => {
      var _a;
      if (!isAnalyticsEnabled()) {
        stopTracking();
        return;
      }
      const now = Date.now();
      const timeOnPage = lastPageViewTime ? now - lastPageViewTime : 0;
      lastPageViewTime = now;
      const location = await getLocation();
      try {
        const response = await fetch("/api/analytics/collect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "pageview",
            page_url: (void 0).location.pathname,
            page_title: (void 0).title,
            user_id: ((_a = userStore.user) == null ? void 0 : _a.id) || "anonymous",
            session_id: currentSessionId,
            device_type: getDeviceType(),
            country: location.country,
            city: location.city,
            referrer_url: (void 0).referrer,
            visit_duration: Math.floor(timeOnPage / 1e3),
            is_new_visitor: false,
            is_bounce: false,
            is_conversion: false,
            browser: (void 0).userAgent.toLowerCase().includes("chrome") ? "chrome" : (void 0).userAgent.toLowerCase().includes("firefox") ? "firefox" : (void 0).userAgent.toLowerCase().includes("safari") ? "safari" : "other"
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi des données analytiques:", error);
      }
    };
    const handleVisibilityChange = async () => {
      var _a;
      if (!isAnalyticsEnabled()) {
        stopTracking();
        return;
      }
      if ((void 0).hidden) {
        const timeOnSite = Date.now() - sessionStartTime;
        try {
          const timestamp = Date.now();
          const response = await fetch(`/api/analytics/collect?_=${timestamp}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              type: "session_end",
              session_id: currentSessionId,
              user_id: ((_a = userStore.user) == null ? void 0 : _a.id) || "anonymous",
              visit_duration: Math.floor(timeOnSite / 1e3),
              is_bounce: false,
              is_conversion: false,
              is_new_visitor: false,
              page_url: (void 0).location.pathname,
              page_title: (void 0).title,
              device_type: getDeviceType(),
              browser: "unknown"
            })
          });
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
        } catch (error) {
          console.error("Erreur lors de l'envoi des données de fin de session:", error);
        }
      }
    };
    const sendSessionEnd = async () => {
      var _a;
      const timeOnSite = Date.now() - sessionStartTime;
      try {
        const timestamp = Date.now();
        const response = await fetch(`/api/analytics/collect?_=${timestamp}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type: "session_end",
            session_id: currentSessionId,
            user_id: ((_a = userStore.user) == null ? void 0 : _a.id) || "anonymous",
            visit_duration: Math.floor(timeOnSite / 1e3),
            is_bounce: false,
            is_conversion: false,
            is_new_visitor: false,
            page_url: (void 0).location.pathname,
            page_title: (void 0).title,
            device_type: getDeviceType(),
            browser: "unknown"
          })
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi des données de fin de session:", error);
      }
    };
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "display": "none" } }, _attrs))}></div>`);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=analytics-collector.vue2.mjs.map
