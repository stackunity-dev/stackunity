import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieSettings {
  preferences: CookiePreferences;
  consentShown: boolean;
  consentVersion: number;
  lastUpdated: string;
}

export const useCookieStore = defineStore('cookie', {
  state: () => ({
    showBanner: false,
    consentGiven: false,
    preferences: {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    } as CookiePreferences
  }),

  persist: true,

  getters: {
    hasGivenConsent: (state) => state.consentGiven,
    acceptedCategories: (state) => {
      const accepted = ['essential'];
      if (state.preferences.functional) accepted.push('functional');
      if (state.preferences.analytics) accepted.push('analytics');
      if (state.preferences.marketing) accepted.push('marketing');
      return accepted;
    },
    hasCookieInBrowser: () => {
      if (typeof document === 'undefined' || !process.client) return false;
      return document.cookie
        .split('; ')
        .some(row => row.startsWith('devunity_cookie_consent='));
    },
    isMarketingEnabled: (state) => state.preferences.marketing
  },

  actions: {
    initializeCookies() {
      if (!process.client) return;
      this.initCookieConsent();
    },

    initCookieConsent() {
      if (!process.client) return;

      const consentCookie = this.getCookie('devunity_cookie_consent');

      if (consentCookie) {
        try {
          const savedPreferences = JSON.parse(decodeURIComponent(consentCookie));
          this.preferences = { ...this.preferences, ...savedPreferences };
          this.consentGiven = true;
          this.showBanner = false;

          this.applyPreferences();
        } catch (e) {
          console.error('Erreur lors de la lecture des préférences de cookies:', e);
          this.showBanner = true;
        }
      } else {
        this.showBanner = true;
      }

      this.setEssentialCookies();
    },

    acceptAllCookies() {
      this.preferences.functional = true;
      this.preferences.analytics = true;
      this.preferences.marketing = true;

      this.updatePreferences(this.preferences);
      this.showBanner = false;
    },

    rejectNonEssentialCookies() {
      this.preferences.functional = false;
      this.preferences.analytics = false;
      this.preferences.marketing = false;

      this.updatePreferences(this.preferences);
      this.showBanner = false;
    },

    updatePreferences(preferences: CookiePreferences) {
      const previousAnalytics = this.preferences.analytics;
      this.preferences = { ...this.preferences, ...preferences };
      this.consentGiven = true;

      this.saveCookiePreferences();
      this.applyPreferences();

      if (process.client && previousAnalytics !== this.preferences.analytics) {
        window.dispatchEvent(new CustomEvent('analytics-preference-changed', {
          detail: { enabled: this.preferences.analytics }
        }));
      }
    },

    saveCookiePreferences() {
      if (!process.client) return;

      const cookieValue = JSON.stringify(this.preferences);
      const cookieOptions = {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 an
        sameSite: 'Lax' as const,
        secure: process.env.NODE_ENV === 'production'
      };

      document.cookie = `devunity_cookie_consent=${encodeURIComponent(cookieValue)}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; samesite=${cookieOptions.sameSite}${cookieOptions.secure ? '; secure' : ''}`;
    },

    resetConsent() {
      if (!process.client) return;

      this.preferences = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false
      };
      this.consentGiven = false;
      this.showBanner = true;

      document.cookie = 'devunity_cookie_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    applyPreferences() {
      if (!process.client) return;

      this.setEssentialCookies();

      if (this.preferences.analytics) {
        this.setAnalyticsCookies();
      }

      if (this.preferences.marketing) {
        this.setMarketingCookies();
      }
    },

    setEssentialCookies() {
      if (!process.client) return;

      // Vérifiez que theme est défini ou utilisez une valeur par défaut
      const theme = 'light'; // Valeur par défaut

      const userPreferences = {
        theme: theme,
        language: 'EN'
      };

      const prefsExpiryDate = new Date();
      prefsExpiryDate.setMonth(prefsExpiryDate.getMonth() + 6);

      document.cookie = `devunity_preferences=${encodeURIComponent(JSON.stringify(userPreferences))}; path=/; expires=${prefsExpiryDate.toUTCString()}; SameSite=Lax;`;
    },

    setAnalyticsCookies() {
      if (!process.client) return;

      const analyticsData = {
        email: this.getCookie('devunity_email'),
        name: this.getCookie('devunity_name'),
        region: this.getCookie('devunity_region'),
        lastVisit: new Date().toISOString()
      };

      this.sendCookieDataToServer('analytics', analyticsData);
    },

    setMarketingCookies() {
      if (!process.client) return;

      const visitedPages = JSON.parse(this.getCookie('devunity_visited_pages') || '[]');

      if (window.location.pathname) {
        const currentPath = window.location.pathname;

        if (!visitedPages.includes(currentPath)) {
          visitedPages.push(currentPath);
          this.setCookie('devunity_visited_pages', JSON.stringify(visitedPages), 30);
        }

        // Tracker checkout page visits
        if (currentPath === '/checkout') {
          this.setCookie('devunity_checkout_visit', new Date().toISOString(), 30);
        }
      }

      // Track premium purchases
      const userStore = useUserStore();
      if (userStore.user?.isPremium) {
        this.setCookie('devunity_premium_user', 'true', 365);
      }

      // Track conversion rates
      let clickCount = parseInt(this.getCookie('devunity_click_count') || '0');
      clickCount++;
      this.setCookie('devunity_click_count', clickCount.toString(), 30);

      window.addEventListener('click', () => {
        let clickCount = parseInt(this.getCookie('devunity_click_count') || '0');
        clickCount++;
        this.setCookie('devunity_click_count', clickCount.toString(), 30);
      }, { once: true });

      const marketingData = {
        visitedPages: visitedPages,
        checkoutVisit: this.getCookie('devunity_checkout_visit'),
        premiumUser: this.getCookie('devunity_premium_user'),
        clickCount: clickCount,
        lastPurchase: this.getCookie('devunity_last_purchase'),
        interests: JSON.parse(this.getCookie('devunity_interests') || '[]'),
        conversionRate: this.calculateConversionRate()
      };

      this.sendCookieDataToServer('marketing', marketingData);
    },

    calculateConversionRate() {
      if (!process.client) return 0;

      const visitedCheckout = this.getCookie('devunity_checkout_visit') !== null;
      const isPremium = this.getCookie('devunity_premium_user') === 'true';
      const clickCount = parseInt(this.getCookie('devunity_click_count') || '0');

      if (clickCount === 0) return 0;

      if (isPremium) {
        return 100;
      }

      if (visitedCheckout) {
        return 50;
      }

      if (clickCount > 20) {
        return 25;
      } else if (clickCount > 10) {
        return 15;
      } else if (clickCount > 5) {
        return 5;
      }

      return 1;
    },

    setCookie(name: string, value: string, expiryDays: number = 30, options: { httpOnly?: boolean, secure?: boolean, sameSite?: 'Strict' | 'Lax' | 'None' } = {}) {
      if (!process.client) return;

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);

      const httpOnly = options.httpOnly ? '; HttpOnly' : '';
      const secure = options.secure || process.env.NODE_ENV === 'production' ? '; Secure' : '';
      const sameSite = options.sameSite ? `; SameSite=${options.sameSite}` : '; SameSite=Lax';

      document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expiryDate.toUTCString()}${sameSite}${secure}${httpOnly}`;
    },

    getCookie(name: string): string | null {
      if (!process.client) return null;

      const cookieString = decodeURIComponent(document.cookie);
      const cookies = cookieString.split('; ');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
          return cookieValue;
        }
      }

      return null;
    },

    async sendCookieDataToServer(type: 'analytics' | 'marketing', data: any) {
      if (!process.client) return;

      try {
        const userStore = useUserStore();
        const token = userStore.token || '';
        const userId = this.getCookie('devunity_user_id');

        if (!userId) {
          console.log(`Pas d'userId disponible pour envoyer les données de type ${type}`);
          return;
        }

        let endpoint = '/api/cookies';
        let payload: any = {
          userId: userId,
          cookiePreferences: {
            [type]: data
          }
        };

        if (type === 'marketing') {
          endpoint = '/api/marketing';
          payload = {
            userId: userId,
            marketingData: data
          };
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Failed to send ${type} data to server`);
        }

        console.log(`Cookie data of type ${type} sent successfully`);
      } catch (error) {
        console.error(`Error sending cookie data of type ${type}:`, error);
      }
    },

    debugCookieState() {
      if (!process.client) return;

      console.group('État des cookies DevUnity');
      console.log('Préférences:', this.preferences);
      console.log('Consentement donné:', this.hasGivenConsent);
      console.log('Cookie présent dans le navigateur:', this.hasCookieInBrowser);

      console.log('Tous les cookies du domaine:');
      document.cookie.split(';').forEach(cookie => {
        console.log('-', cookie.trim());
      });

      console.groupEnd();
    }
  }
});

