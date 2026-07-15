import { NgnError } from '@ngneers/controls/utils';

import type { SupportedLanguage, Translations } from './types';

const customLanguages: Record<string, (() => Promise<Translations>) | undefined> = {};

export function registerCustomLanguage(
  language: string,
  translations: () => Promise<Translations>
): void {
  customLanguages[language] = translations;
}

export function registerCustomLanguages(
  languages: Record<string, () => Promise<Translations>>
): void {
  Object.entries(languages).forEach(([lang, translations]) => {
    registerCustomLanguage(lang, translations);
  });
}

export async function loadLanguage(language: SupportedLanguage): Promise<Translations> {
  switch (language) {
    case 'en': {
      const m = await import('@ngneers/controls/i18n/translations/en');
      return m.en;
    }
    case 'de': {
      const m = await import('@ngneers/controls/i18n/translations/de');
      return m.de;
    }
    default:
      if (customLanguages[language]) {
        return customLanguages[language]();
      }
      return Promise.reject(new NgnError('i18n', `Unsupported language: ${language}`));
  }
}
