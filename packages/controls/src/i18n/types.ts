export const supportedLanguages = ['en', 'de'] as const;
// import type En from './translations/en.json';

export type SupportedLanguage = (typeof supportedLanguages)[number];

export type Translations = any;
