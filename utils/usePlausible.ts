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

const impressionCounters: Record<string, number> = {
  login: 0,
  signup: 0,
  global: 0
};

const clickCounters: Record<string, number> = {
  login: 0,
  signup: 0,
  global: 0
};

export function trackAuthButtonClicks() {
  if (typeof window === 'undefined') {
    return {
      trackAuthButtonClick: () => ({ buttonCTR: 0, globalCTR: 0, clickCount: 0, impressionCount: 0 }),
      incrementImpressions: () => { },
      initAuthButtonsTracking: () => { },
      getButtonsStats: () => ({
        login: { clicks: 0, impressions: 0, ctr: 0 },
        signup: { clicks: 0, impressions: 0, ctr: 0 },
        global: { clicks: 0, impressions: 0, ctr: 0 }
      })
    };
  }

  const plausibleEvent = usePlausible();

  const incrementImpressions = (buttonType: 'login' | 'signup' | 'global') => {
    impressionCounters[buttonType]++;
    impressionCounters['global']++;
  };

  const trackAuthButtonClick = (buttonType: 'login' | 'signup', buttonLocation: string, buttonText: string) => {
    clickCounters[buttonType]++;
    clickCounters['global']++;

    const buttonCTR = impressionCounters[buttonType] > 0
      ? (clickCounters[buttonType] / impressionCounters[buttonType]) * 100
      : 0;

    const globalCTR = impressionCounters['global'] > 0
      ? (clickCounters['global'] / impressionCounters['global']) * 100
      : 0;

    plausibleEvent('auth_button_click', {
      props: {
        button_type: buttonType,
        button_location: buttonLocation,
        button_text: buttonText,
        button_ctr: buttonCTR.toFixed(2),
        global_ctr: globalCTR.toFixed(2),
        click_count: clickCounters[buttonType],
        impression_count: impressionCounters[buttonType]
      }
    });

    return {
      buttonCTR,
      globalCTR,
      clickCount: clickCounters[buttonType],
      impressionCount: impressionCounters[buttonType]
    };
  };

  const initAuthButtonsTracking = () => {
    const loginButtons = document.querySelectorAll('a[href="/login"], a[to="/login"], button[to="/login"]');
    const signupButtons = document.querySelectorAll('a[href="/signup"], a[to="/signup"], button[to="/signup"]');

    incrementImpressions('login');
    incrementImpressions('signup');

    loginButtons.forEach(button => {
      const buttonText = button.textContent?.trim() || 'Login';
      const buttonLocation = getButtonLocation(button);

      button.addEventListener('click', () => {
        trackAuthButtonClick('login', buttonLocation, buttonText);
      });
    });

    signupButtons.forEach(button => {
      const buttonText = button.textContent?.trim() || 'Signup';
      const buttonLocation = getButtonLocation(button);

      button.addEventListener('click', () => {
        trackAuthButtonClick('signup', buttonLocation, buttonText);
      });
    });

    plausibleEvent('auth_buttons_impression', {
      props: {
        login_buttons_count: loginButtons.length,
        signup_buttons_count: signupButtons.length,
        total_buttons_count: loginButtons.length + signupButtons.length
      }
    });
  };

  const getButtonLocation = (element: Element): string => {
    let currentElement: Element | null = element;
    const sections: string[] = [];

    while (currentElement && sections.length < 3) {
      if (currentElement.id) {
        sections.unshift(currentElement.id);
      } else if (currentElement.tagName === 'SECTION' ||
        currentElement.tagName === 'HEADER' ||
        currentElement.tagName === 'FOOTER' ||
        currentElement.tagName === 'NAV') {
        sections.unshift(currentElement.tagName.toLowerCase());
      }
      currentElement = currentElement.parentElement;
    }

    return sections.join('/') || 'unknown';
  };

  return {
    trackAuthButtonClick,
    incrementImpressions,
    initAuthButtonsTracking,
    getButtonsStats: () => ({
      login: {
        clicks: clickCounters.login,
        impressions: impressionCounters.login,
        ctr: impressionCounters.login > 0 ? (clickCounters.login / impressionCounters.login) * 100 : 0
      },
      signup: {
        clicks: clickCounters.signup,
        impressions: impressionCounters.signup,
        ctr: impressionCounters.signup > 0 ? (clickCounters.signup / impressionCounters.signup) * 100 : 0
      },
      global: {
        clicks: clickCounters.global,
        impressions: impressionCounters.global,
        ctr: impressionCounters.global > 0 ? (clickCounters.global / impressionCounters.global) * 100 : 0
      }
    })
  };
}

declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, any>) => void;
  }
} 