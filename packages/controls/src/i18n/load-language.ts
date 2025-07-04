import { NgnError } from '@ngneers/controls/utils';

import { SupportedLanguage, Translations } from './types';

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

export function loadLanguage(language: SupportedLanguage): Promise<Translations> {
  switch (language) {
    case 'en':
      return import('./translations/en.json').then(m => m.default);
    case 'de':
      return import('./translations/de.json').then(m => m.default);
    default:
      if (customLanguages[language]) {
        return customLanguages[language]();
      }
      return Promise.reject(new NgnError('i18n', `Unsupported language: ${language}`));
  }
}
