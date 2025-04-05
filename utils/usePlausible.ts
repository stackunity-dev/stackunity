/**
 * Hook pour utiliser Plausible Analytics avec des métadonnées enrichies
 * @returns Fonction pour suivre des événements
 */
export function usePlausible() {
  if (process.client) {
    // @ts-ignore
    const plausible = window.plausible;

    return (event: string, options?: { props?: Record<string, any> }) => {
      if (plausible && typeof plausible === 'function') {
        const enrichedOptions = {
          props: {
            url: window.location.href,
            referrer: document.referrer || '',
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            language: navigator.language,
            ...options?.props
          }
        };

        try {
          plausible(event, enrichedOptions);
          console.debug('[Plausible] Event tracked:', event, enrichedOptions);
        } catch (error) {
          console.error('[Plausible] Error tracking event:', error);
        }
      } else {
        console.warn('[Plausible] Analytics not available');
      }
    };
  }

  return (event: string, options?: { props?: Record<string, any> }) => {
  };
} 