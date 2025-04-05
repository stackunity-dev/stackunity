import { defineStore } from 'pinia';

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
        .some(row => row.startsWith('stackunity_cookie_consent='));
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

      const consentCookie = this.getCookie('stackunity_cookie_consent');

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
        maxAge: 365 * 24 * 60 * 60,
        sameSite: 'Lax' as const,
        secure: process.env.NODE_ENV === 'production'
      };

      document.cookie = `stackunity_cookie_consent=${encodeURIComponent(cookieValue)}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; samesite=${cookieOptions.sameSite}${cookieOptions.secure ? '; secure' : ''}`;
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

      document.cookie = 'stackunity_cookie_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },

    applyPreferences() {
      if (!process.client) return;

      this.setEssentialCookies();
    },

    setEssentialCookies() {
      if (!process.client) return;

      const theme = 'light';

      const userPreferences = {
        theme: theme,
        language: 'EN'
      };

      const prefsExpiryDate = new Date();
      prefsExpiryDate.setMonth(prefsExpiryDate.getMonth() + 6);

      document.cookie = `stackunity_preferences=${encodeURIComponent(JSON.stringify(userPreferences))}; path=/; expires=${prefsExpiryDate.toUTCString()}; SameSite=Lax;`;
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

    debugCookieState() {
      if (!process.client) return;

      console.group('État des cookies StackUnity');
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

