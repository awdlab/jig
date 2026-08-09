export const supportedLanguages = ['en', 'de'] as const;
import type { en as En } from './translations/en';

export type SupportedLanguage = (typeof supportedLanguages)[number];

export type Translations = typeof En;
