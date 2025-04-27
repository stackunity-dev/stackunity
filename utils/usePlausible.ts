export function usePlausible() {
  if (typeof window === 'undefined') return () => { };

  const plausible = window.plausible;

  const trackEvent = (event: string, options: Record<string, any> = {}) => {
    if (plausible && typeof plausible === 'function') {
      try {
        const enrichedOptions: Record<string, any> = {
          ...options,
          props: {
            ...options?.props,
            timestamp: new Date().toISOString(),
            path: window.location.pathname,
            referrer: document.referrer || 'direct'
          }
        };

        plausible(event, enrichedOptions);
        console.debug('[Plausible] Event tracked:', event, enrichedOptions);
      } catch (error) {
        console.error('[Plausible] Error tracking event:', error);
      }
    } else {
      console.warn('[Plausible] Analytics not available');
    }
  };

  return trackEvent;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, any>) => void;
  }
} 