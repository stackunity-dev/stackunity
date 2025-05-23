import { ref } from 'vue';

import indexAr from './index/ar';
import indexEn from './index/en';
import indexEs from './index/es';
import indexFr from './index/fr';
import indexZh from './index/zh';

import loginAr from './login/ar';
import loginEn from './login/en';
import loginEs from './login/es';
import loginFr from './login/fr';
import loginZh from './login/zh';

import signupAr from './signup/ar';
import signupEn from './signup/en';
import signupEs from './signup/es';
import signupFr from './signup/fr';
import signupZh from './signup/zh';

import checkoutAr from './checkout/ar';
import checkoutEn from './checkout/en';
import checkoutEs from './checkout/es';
import checkoutFr from './checkout/fr';
import checkoutZh from './checkout/zh';

import dashboardAr from './dashboard/ar';
import dashboardEn from './dashboard/en';
import dashboardEs from './dashboard/es';
import dashboardFr from './dashboard/fr';
import dashboardZh from './dashboard/zh';

import layoutAr from './layout/ar';
import layoutEn from './layout/en';
import layoutEs from './layout/es';
import layoutFr from './layout/fr';
import layoutZh from './layout/zh';

import settingsAr from './settings/ar';
import settingsEn from './settings/en';
import settingsEs from './settings/es';
import settingsFr from './settings/fr';
import settingsZh from './settings/zh';

import pricingAr from './pricing/ar';
import pricingEn from './pricing/en';
import pricingEs from './pricing/es';
import pricingFr from './pricing/fr';
import pricingZh from './pricing/zh';

import faqAr from './faq/ar';
import faqEn from './faq/en';
import faqEs from './faq/es';
import faqFr from './faq/fr';
import faqZh from './faq/zh';

import websiteAr from './website/ar';
import websiteEn from './website/en';
import websiteEs from './website/es';
import websiteFr from './website/fr';
import websiteZh from './website/zh';

import databaseManagementAr from './database-designer/ar';
import databaseManagementEn from './database-designer/en';
import databaseManagementEs from './database-designer/es';
import databaseManagementFr from './database-designer/fr';
import databaseManagementZh from './database-designer/zh';

import aboutAr from './about/ar';
import aboutEn from './about/en';
import aboutEs from './about/es';
import aboutFr from './about/fr';
import aboutZh from './about/zh';

import privacyAr from './legal/privacy/ar';
import privacyEn from './legal/privacy/en';
import privacyEs from './legal/privacy/es';
import privacyFr from './legal/privacy/fr';
import privacyZh from './legal/privacy/zh';

import semanticAr from './semantic/ar';
import semanticEn from './semantic/en';
import semanticEs from './semantic/es';
import semanticFr from './semantic/fr';
import semanticZh from './semantic/zh';

import performanceAr from './performance/ar';
import performanceEn from './performance/en';
import performanceEs from './performance/es';
import performanceFr from './performance/fr';
import performanceZh from './performance/zh';

import contentAr from './content/ar';
import contentEn from './content/en';
import contentEs from './content/es';
import contentFr from './content/fr';
import contentZh from './content/zh';

import userEngagementAr from './user-engagement/ar';
import userEngagementEn from './user-engagement/en';
import userEngagementEs from './user-engagement/es';
import userEngagementFr from './user-engagement/fr';
import userEngagementZh from './user-engagement/zh';

import securityAr from './security/ar';
import securityEn from './security/en';
import securityEs from './security/es';
import securityFr from './security/fr';
import securityZh from './security/zh';

import analyticsAr from './analytics/ar';
import analyticsEn from './analytics/en';
import analyticsEs from './analytics/es';
import analyticsFr from './analytics/fr';
import analyticsZh from './analytics/zh';


export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'es' | 'zh';

export interface TranslationsStore {
  index: typeof indexEn;
  login: typeof loginEn;
  signup: typeof signupEn;
  checkout: typeof checkoutEn;
  dashboard: typeof dashboardEn;
  layout: typeof layoutEn;
  settings: typeof settingsEn;
  pricing: typeof pricingEn;
  faq: typeof faqEn;
  website: typeof websiteEn;
  databaseManagement: typeof databaseManagementEn;
  about: typeof aboutEn;
  semantic: typeof semanticEn;
  performance: typeof performanceEn;
  content: typeof contentEn;
  userEngagement: typeof userEngagementEn;
  security: typeof securityEn;
  privacy: typeof privacyEn;
  analytics: typeof analyticsEn;
}

const translations: Record<SupportedLanguage, TranslationsStore> = {
  en: {
    index: indexEn,
    login: loginEn,
    signup: signupEn,
    checkout: checkoutEn,
    dashboard: dashboardEn,
    layout: layoutEn,
    settings: settingsEn,
    pricing: pricingEn,
    faq: faqEn,
    website: websiteEn,
    databaseManagement: databaseManagementEn,
    about: aboutEn,
    semantic: semanticEn,
    performance: performanceEn,
    content: contentEn,
    userEngagement: userEngagementEn,
    security: securityEn,
    privacy: privacyEn,
    analytics: analyticsEn,
  },
  fr: {
    index: indexFr,
    login: loginFr,
    signup: signupFr,
    checkout: checkoutFr,
    dashboard: dashboardFr,
    layout: layoutFr,
    settings: settingsFr,
    pricing: pricingFr,
    faq: faqFr,
    website: websiteFr,
    databaseManagement: databaseManagementFr,
    about: aboutFr,
    semantic: semanticFr,
    performance: performanceFr,
    content: contentFr,
    userEngagement: userEngagementFr,
    security: securityFr,
    privacy: privacyFr,
    analytics: analyticsFr,
  },
  ar: {
    index: indexAr,
    login: loginAr,
    signup: signupAr,
    checkout: checkoutAr,
    dashboard: dashboardAr,
    layout: layoutAr,
    settings: settingsAr,
    pricing: pricingAr,
    faq: faqAr,
    website: websiteAr,
    databaseManagement: databaseManagementAr,
    about: aboutAr,
    semantic: semanticAr,
    performance: performanceAr,
    content: contentAr,
    userEngagement: userEngagementAr,
    security: securityAr,
    privacy: privacyAr,
    analytics: analyticsAr,
  },
  es: {
    index: indexEs,
    login: loginEs,
    signup: signupEs,
    checkout: checkoutEs,
    dashboard: dashboardEs,
    layout: layoutEs,
    settings: settingsEs,
    pricing: pricingEs,
    faq: faqEs,
    website: websiteEs,
    databaseManagement: databaseManagementEs,
    about: aboutEs,
    semantic: semanticEs,
    performance: performanceEs,
    content: contentEs,
    userEngagement: userEngagementEs,
    security: securityEs,
    privacy: privacyEs,
    analytics: analyticsEs,
  },
  zh: {
    index: indexZh,
    login: loginZh,
    signup: signupZh,
    checkout: checkoutZh,
    dashboard: dashboardZh,
    layout: layoutZh,
    settings: settingsZh,
    pricing: pricingZh,
    faq: faqZh,
    website: websiteZh,
    databaseManagement: databaseManagementZh,
    about: aboutZh,
    semantic: semanticZh,
    performance: performanceZh,
    content: contentZh,
    userEngagement: userEngagementZh,
    security: securityZh,
    privacy: privacyZh,
    analytics: analyticsZh,
  },
};

export const currentLanguage = ref<SupportedLanguage>('en');

export const changeLanguage = (lang: SupportedLanguage) => {
  if (currentLanguage.value !== lang) {
    currentLanguage.value = lang;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('preferred_language', lang);
        document.documentElement.lang = lang;

        const event = new CustomEvent('language-changed', { detail: { language: lang } });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('[languages] Error saving language preference:', error);
      }
    }
  }
};

export const setCurrentLanguage = changeLanguage;

export const useTranslations = <T extends keyof TranslationsStore>(
  page: T
): (() => TranslationsStore[T]) => {
  return () => translations[currentLanguage.value][page];
};

export const initLanguage = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const savedLanguage = localStorage.getItem('preferred_language') as SupportedLanguage | null;

      if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
        changeLanguage(savedLanguage);
        return;
      }
    } catch (error) {
      console.error('[languages] Error loading saved language:', error);
    }
  }
};

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]; 