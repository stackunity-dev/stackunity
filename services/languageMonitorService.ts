import { ref } from 'vue';
import { SupportedLanguage } from '../languages';

export interface LanguageChangeEvent {
  timestamp: Date;
  fromLanguage: SupportedLanguage | null;
  toLanguage: SupportedLanguage;
  path: string;
  component: string;
}

const languageChangeHistory = ref<LanguageChangeEvent[]>([]);

const MAX_HISTORY_SIZE = 50;

export const recordLanguageChange = (
  fromLanguage: SupportedLanguage | null,
  toLanguage: SupportedLanguage,
  path: string,
  component: string = 'unknown'
): LanguageChangeEvent => {
  const event: LanguageChangeEvent = {
    timestamp: new Date(),
    fromLanguage,
    toLanguage,
    path,
    component
  };

  languageChangeHistory.value.unshift(event);

  if (languageChangeHistory.value.length > MAX_HISTORY_SIZE) {
    languageChangeHistory.value = languageChangeHistory.value.slice(0, MAX_HISTORY_SIZE);
  }

  if (typeof window !== 'undefined') {
    try {
      const storedHistory = JSON.parse(
        localStorage.getItem('language_change_history') || '[]'
      );

      const updatedHistory = [
        {
          timestamp: event.timestamp.toISOString(),
          fromLanguage: event.fromLanguage,
          toLanguage: event.toLanguage,
          path: event.path,
          component: event.component
        },
        ...storedHistory
      ].slice(0, MAX_HISTORY_SIZE);

      localStorage.setItem('language_change_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique des langues:', error);
    }
  }

  return event;
};

export const getLanguageChangeHistory = (): LanguageChangeEvent[] => {
  return languageChangeHistory.value;
};

export const loadLanguageChangeHistory = (): void => {
  if (typeof window !== 'undefined') {
    try {
      const storedHistory = JSON.parse(
        localStorage.getItem('language_change_history') || '[]'
      );

      languageChangeHistory.value = storedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des langues:', error);
    }
  }
};

export const clearLanguageChangeHistory = (): void => {
  languageChangeHistory.value = [];

  if (typeof window !== 'undefined') {
    localStorage.removeItem('language_change_history');
  }
};

export const analyzeLanguageUsage = (): Record<string, any> => {
  const history = languageChangeHistory.value;
  const languages: Record<string, number> = {};
  const pathChanges: Record<string, number> = {};
  const hourDistribution: Record<string, number> = {};

  history.forEach(event => {
    const lang = event.toLanguage;
    languages[lang] = (languages[lang] || 0) + 1;

    pathChanges[event.path] = (pathChanges[event.path] || 0) + 1;

    const hour = event.timestamp.getHours();
    hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;
  });

  return {
    languageCounts: languages,
    pathChanges,
    hourDistribution,
    totalChanges: history.length,
    firstChange: history.length ? history[history.length - 1].timestamp : null,
    lastChange: history.length ? history[0].timestamp : null
  };
};

if (typeof window !== 'undefined') {
  setTimeout(() => {
    loadLanguageChangeHistory();
  }, 0);
}

export default {
  recordLanguageChange,
  getLanguageChangeHistory,
  loadLanguageChangeHistory,
  clearLanguageChangeHistory,
  analyzeLanguageUsage
}; 