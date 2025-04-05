export interface PlausibleEventOptions {
  props?: Record<string, any>;
  callback?: () => void;
}

export interface PageViewEvent {
  page?: string;
  referrer?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  source?: string;
}

export interface ClickEvent {
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  targetUrl?: string;
  section?: string;
}

export interface ConversionEvent {
  value?: number;
  currency?: string;
  category?: string;
  actionType?: 'signup' | 'purchase' | 'download' | 'contact' | 'other';
}

export function usePlausible() {
  if (process.client) {
    // @ts-ignore - l'API Plausible est injectée globalement
    const plausible = window.plausible;

    const trackEvent = (event: string, options?: PlausibleEventOptions) => {
      if (plausible && typeof plausible === 'function') {
        plausible(event, { props: options?.props }, options?.callback);
      } else {
        console.warn('Plausible n\'est pas disponible');
      }
    };

    const trackPageView = (options?: PageViewEvent) => {
      const props = options || {};
      const currentPage = props.page || window.location.pathname;

      trackEvent('pageview', {
        props: {
          page: currentPage,
          referrer: props.referrer || document.referrer,
          deviceType: props.deviceType || detectDeviceType(),
          source: props.source || extractUtmSource()
        }
      });
    };

    const trackClick = (options: ClickEvent) => {
      trackEvent('click', {
        props: {
          ...options,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
        }
      });
    };

    const setupClickTracking = (selector: string, section?: string) => {
      if (typeof document !== 'undefined') {
        document.querySelectorAll(selector).forEach(element => {
          element.addEventListener('click', () => {
            const el = element as HTMLElement;
            trackClick({
              elementId: el.id,
              elementClass: Array.from(el.classList).join(' '),
              elementText: el.innerText?.substring(0, 50) || '',
              targetUrl: (el as HTMLAnchorElement).href || '',
              section: section || getElementSection(el)
            });
          });
        });
      }
    };

    const trackConversion = (event: string, options?: ConversionEvent) => {
      trackEvent(`conversion:${event}`, {
        props: options
      });
    };

    const detectDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
      }
      return 'desktop';
    };

    const extractUtmSource = (): string => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('utm_source') || 'direct';
    };

    const getElementSection = (element: HTMLElement): string => {
      let currentNode: HTMLElement | null = element;
      while (currentNode) {
        if (currentNode.dataset && currentNode.dataset.section) {
          return currentNode.dataset.section;
        }

        if (currentNode.id && currentNode.id.includes('section')) {
          return currentNode.id;
        }

        if (currentNode.tagName.toLowerCase() === 'section' && currentNode.id) {
          return currentNode.id;
        }

        currentNode = currentNode.parentElement;
      }
      return 'unknown';
    };

    return {
      trackEvent,
      trackPageView,
      trackClick,
      setupClickTracking,
      trackConversion
    };
  }

  return {
    trackEvent: (event: string, options?: PlausibleEventOptions) => { },
    trackPageView: (options?: PageViewEvent) => { },
    trackClick: (options: ClickEvent) => { },
    setupClickTracking: (selector: string, section?: string) => { },
    trackConversion: (event: string, options?: ConversionEvent) => { }
  };
} 