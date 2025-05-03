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

import animationAr from './animation/ar';
import animationEn from './animation/en';
import animationEs from './animation/es';
import animationFr from './animation/fr';
import animationZh from './animation/zh';

import robotsAr from './robots/ar';
import robotsEn from './robots/en';
import robotsEs from './robots/es';
import robotsFr from './robots/fr';
import robotsZh from './robots/zh';

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

import apiTestingHubAr from './api-testing-hub/ar';
import apiTestingHubEn from './api-testing-hub/en';
import apiTestingHubEs from './api-testing-hub/es';
import apiTestingHubFr from './api-testing-hub/fr';
import apiTestingHubZh from './api-testing-hub/zh';

import databaseDesignerAr from './database-designer/ar';
import databaseDesignerEn from './database-designer/en';
import databaseDesignerEs from './database-designer/es';
import databaseDesignerFr from './database-designer/fr';
import databaseDesignerZh from './database-designer/zh';

import responsiveAr from './responsive/ar';
import responsiveEn from './responsive/en';
import responsiveEs from './responsive/es';
import responsiveFr from './responsive/fr';
import responsiveZh from './responsive/zh';

import accessibilityAr from './accessibility/ar';
import accessibilityEn from './accessibility/en';
import accessibilityEs from './accessibility/es';
import accessibilityFr from './accessibility/fr';
import accessibilityZh from './accessibility/zh';

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

import studioAr from './studio/ar';
import studioEn from './studio/en';
import studioEs from './studio/es';
import studioFr from './studio/fr';
import studioZh from './studio/zh';

import studioCardTemplatesAr from './studio/card/ar';
import studioCardTemplatesEn from './studio/card/en';
import studioCardTemplatesEs from './studio/card/es';
import studioCardTemplatesFr from './studio/card/fr';
import studioCardTemplatesZh from './studio/card/zh';

import studioNavTemplatesAr from './studio/nav/ar';
import studioNavTemplatesEn from './studio/nav/en';
import studioNavTemplatesEs from './studio/nav/es';
import studioNavTemplatesFr from './studio/nav/fr';
import studioNavTemplatesZh from './studio/nav/zh';

import studioFormTemplatesAr from './studio/form/ar';
import studioFormTemplatesEn from './studio/form/en';
import studioFormTemplatesEs from './studio/form/es';
import studioFormTemplatesFr from './studio/form/fr';
import studioFormTemplatesZh from './studio/form/zh';

import studioTimelineTemplatesAr from './studio/timeline/ar';
import studioTimelineTemplatesEn from './studio/timeline/en';
import studioTimelineTemplatesEs from './studio/timeline/es';
import studioTimelineTemplatesFr from './studio/timeline/fr';
import studioTimelineTemplatesZh from './studio/timeline/zh';

import studioUtilsTemplatesAr from './studio/utils/ar';
import studioUtilsTemplatesEn from './studio/utils/en';
import studioUtilsTemplatesEs from './studio/utils/es';
import studioUtilsTemplatesFr from './studio/utils/fr';
import studioUtilsTemplatesZh from './studio/utils/zh';

import cardTemplatesAr from './cardTemplates/ar';
import cardTemplatesEn from './cardTemplates/en';
import cardTemplatesEs from './cardTemplates/es';
import cardTemplatesFr from './cardTemplates/fr';
import cardTemplatesZh from './cardTemplates/zh';


export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'es' | 'zh';

export interface TranslationsStore {
  index: typeof indexEn;
  login: typeof loginEn;
  signup: typeof signupEn;
  dashboard: typeof dashboardEn;
  layout: typeof layoutEn;
  settings: typeof settingsEn;
  animation: typeof animationEn;
  robots: typeof robotsEn;
  pricing: typeof pricingEn;
  faq: typeof faqEn;
  website: typeof websiteEn;
  apiTestingHub: typeof apiTestingHubEn;
  databaseDesigner: typeof databaseDesignerEn;
  responsive: typeof responsiveEn;
  accessibility: typeof accessibilityEn;
  about: typeof aboutEn;
  semantic: typeof semanticEn;
  performance: typeof performanceEn;
  content: typeof contentEn;
  userEngagement: typeof userEngagementEn;
  security: typeof securityEn;
  studio: typeof studioEn;
  studioCardTemplates: typeof studioCardTemplatesEn;
  studioNavTemplates: typeof studioNavTemplatesEn;
  studioFormTemplates: typeof studioFormTemplatesEn;
  studioTimelineTemplates: typeof studioTimelineTemplatesEn;
  studioUtilsTemplates: typeof studioUtilsTemplatesEn;
  cardTemplates: typeof cardTemplatesEn;
  privacy: typeof privacyEn;
}

const translations: Record<SupportedLanguage, TranslationsStore> = {
  en: {
    index: indexEn,
    login: loginEn,
    signup: signupEn,
    dashboard: dashboardEn,
    layout: layoutEn,
    settings: settingsEn,
    animation: animationEn,
    robots: robotsEn,
    pricing: pricingEn,
    faq: faqEn,
    website: websiteEn,
    apiTestingHub: apiTestingHubEn,
    databaseDesigner: databaseDesignerEn,
    responsive: responsiveEn,
    accessibility: accessibilityEn,
    about: aboutEn,
    semantic: semanticEn,
    performance: performanceEn,
    content: contentEn as any,
    userEngagement: userEngagementEn,
    security: securityEn,
    studioCardTemplates: studioCardTemplatesEn,
    studioNavTemplates: studioNavTemplatesEn,
    studioFormTemplates: studioFormTemplatesEn,
    studioTimelineTemplates: studioTimelineTemplatesEn,
    studioUtilsTemplates: studioUtilsTemplatesEn,
    studio: studioEn,
    cardTemplates: cardTemplatesEn,
    privacy: privacyEn,
  },
  fr: {
    index: indexFr,
    login: loginFr,
    signup: signupFr,
    dashboard: dashboardFr,
    layout: layoutFr,
    settings: settingsFr,
    animation: animationFr,
    robots: robotsFr,
    pricing: pricingFr,
    faq: faqFr,
    website: websiteFr,
    apiTestingHub: apiTestingHubFr,
    databaseDesigner: databaseDesignerFr,
    responsive: responsiveFr,
    accessibility: accessibilityFr,
    about: aboutFr,
    semantic: semanticFr,
    performance: performanceFr,
    content: contentFr as any,
    userEngagement: userEngagementFr,
    security: securityFr,
    studioCardTemplates: studioCardTemplatesFr,
    studioNavTemplates: studioNavTemplatesFr,
    studioFormTemplates: studioFormTemplatesFr,
    studioTimelineTemplates: studioTimelineTemplatesFr,
    studioUtilsTemplates: studioUtilsTemplatesFr,
    studio: studioFr,
    cardTemplates: cardTemplatesFr,
    privacy: privacyFr,
  },
  ar: {
    index: indexAr,
    login: loginAr,
    signup: signupAr,
    dashboard: dashboardAr,
    layout: layoutAr,
    settings: settingsAr,
    animation: animationAr,
    robots: robotsAr,
    pricing: pricingAr,
    faq: faqAr,
    website: websiteAr,
    apiTestingHub: apiTestingHubAr,
    databaseDesigner: databaseDesignerAr,
    responsive: responsiveAr,
    accessibility: accessibilityAr,
    about: aboutAr,
    semantic: semanticAr,
    performance: performanceAr,
    content: contentAr as any,
    userEngagement: userEngagementAr,
    security: securityAr,
    studioCardTemplates: studioCardTemplatesAr,
    studioNavTemplates: studioNavTemplatesAr,
    studioFormTemplates: studioFormTemplatesAr,
    studioTimelineTemplates: studioTimelineTemplatesAr,
    studioUtilsTemplates: studioUtilsTemplatesAr,
    studio: studioAr,
    cardTemplates: cardTemplatesAr,
    privacy: privacyAr,
  },
  es: {
    index: indexEs,
    login: loginEs,
    signup: signupEs,
    dashboard: dashboardEs,
    layout: layoutEs,
    settings: settingsEs,
    animation: animationEs,
    robots: robotsEs,
    pricing: pricingEs,
    faq: faqEs,
    website: websiteEs,
    apiTestingHub: apiTestingHubEs,
    databaseDesigner: databaseDesignerEs,
    responsive: responsiveEs,
    accessibility: accessibilityEs,
    about: aboutEs,
    semantic: semanticEs,
    performance: performanceEs,
    content: contentEs as any,
    userEngagement: userEngagementEs,
    security: securityEs,
    studioCardTemplates: studioCardTemplatesEs,
    studioNavTemplates: studioNavTemplatesEs,
    studioFormTemplates: studioFormTemplatesEs,
    studioTimelineTemplates: studioTimelineTemplatesEs,
    studioUtilsTemplates: studioUtilsTemplatesEs,
    studio: studioEs,
    cardTemplates: cardTemplatesEs,
    privacy: privacyEs,
  },
  zh: {
    index: indexZh,
    login: loginZh,
    signup: signupZh,
    dashboard: dashboardZh,
    layout: layoutZh,
    settings: settingsZh,
    animation: animationZh,
    robots: robotsZh,
    pricing: pricingZh,
    faq: faqZh,
    website: websiteZh,
    apiTestingHub: apiTestingHubZh,
    databaseDesigner: databaseDesignerZh,
    responsive: responsiveZh,
    accessibility: accessibilityZh,
    about: aboutZh,
    semantic: semanticZh,
    performance: performanceZh,
    content: contentZh as any,
    userEngagement: userEngagementZh,
    security: securityZh,
    studioCardTemplates: studioCardTemplatesZh,
    studioNavTemplates: studioNavTemplatesZh,
    studioFormTemplates: studioFormTemplatesZh,
    studioTimelineTemplates: studioTimelineTemplatesZh,
    studioUtilsTemplates: studioUtilsTemplatesZh,
    studio: studioZh,
    cardTemplates: cardTemplatesZh,
    privacy: privacyZh,
  },
};

export const currentLanguage = ref<SupportedLanguage>('en');

export const changeLanguage = (lang: SupportedLanguage) => {
  currentLanguage.value = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
};

export const setCurrentLanguage = changeLanguage;

export const useTranslations = <T extends keyof TranslationsStore>(
  page: T
): (() => TranslationsStore[T]) => {
  return () => translations[currentLanguage.value][page];
};

export const initLanguage = () => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage | null;

    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      changeLanguage(savedLanguage);
      return;
    }

    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;

    if (Object.keys(translations).includes(browserLang)) {
      changeLanguage(browserLang);
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