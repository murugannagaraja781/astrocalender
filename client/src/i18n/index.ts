/**
 * i18n Index - Language Management
 */

import { en, Translations } from './en';
import { ta } from './ta';

export type Language = 'en' | 'ta';

const translations: Record<Language, Translations> = {
  en,
  ta,
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function getText(lang: Language, key: keyof Translations): string {
  const t = translations[lang];
  const value = t[key];
  return typeof value === 'string' ? value : '';
}

export { en, ta, type Translations };
