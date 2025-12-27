/**
 * useLanguage Hook
 *
 * React hook for managing language preferences.
 */

import { useState, useCallback, useEffect } from 'react';
import { Language, getTranslations, Translations } from '../i18n';

interface UseLanguageResult {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const STORAGE_KEY = 'panchangam-language';

function getInitialLanguage(): Language {
  // Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ta') {
    return stored;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ta')) {
    return 'ta';
  }

  return 'en';
}

export function useLanguage(): UseLanguageResult {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [t, setT] = useState<Translations>(getTranslations(getInitialLanguage()));

  useEffect(() => {
    // Update body class for font styling
    document.body.classList.toggle('lang-tamil', language === 'ta');

    // Update translations
    setT(getTranslations(language));

    // Persist preference
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState(prev => prev === 'en' ? 'ta' : 'en');
  }, []);

  return { language, t, setLanguage, toggleLanguage };
}
