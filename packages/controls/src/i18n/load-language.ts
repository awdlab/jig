import { JigError } from '@awdlab/jig/utils';

import { supportedLanguages } from './types';

import type { SupportedLanguage, Translations } from './types';

const customLanguages: Record<string, (() => Promise<Translations>) | undefined> = {};

/**
 * Built-ins plus every registered custom tag. Mutated in place — {@link I18n}
 * holds this exact array as its `availableLanguages`, so a language registered
 * after the service was created is still selectable.
 */
const languageTags: string[] = [...supportedLanguages];

export function registerCustomLanguage(
  language: string,
  translations: () => Promise<Translations>
): void {
  if (!customLanguages[language]) {
    languageTags.push(language);
  }
  customLanguages[language] = translations;
}

export function registerCustomLanguages(
  languages: Record<string, () => Promise<Translations>>
): void {
  Object.entries(languages).forEach(([lang, translations]) => {
    registerCustomLanguage(lang, translations);
  });
}

/** Every selectable language tag: the built-ins plus anything registered since. */
export function availableLanguageTags(): readonly string[] {
  return languageTags;
}

export async function loadLanguage(language: SupportedLanguage): Promise<Translations> {
  switch (language) {
    case 'en': {
      const m = await import('@awdlab/jig/i18n/translations/en');
      return m.en;
    }
    case 'de': {
      const m = await import('@awdlab/jig/i18n/translations/de');
      return m.de;
    }
    default:
      if (customLanguages[language]) {
        return customLanguages[language]();
      }
      return Promise.reject(new JigError('i18n', `Unsupported language: ${language}`));
  }
}
