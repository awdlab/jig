import { AwdDocsI18n } from './i18n-doc';

import type { AwdDocsPage } from '../page/types';
import type { Translations } from '@awdlab/jig/i18n';

/**
 * Deep, structural mirror of a translation subtree where every leaf `string`
 * becomes a required description. Because the shape is derived from
 * {@link Translations}, adding or removing a key in the source translations is
 * a **compile error** at the call site until the docs are updated to match —
 * an end-to-end type check that the i18n docs never drift from `en.ts`.
 */
export type I18nDescriptions<T> = {
  [K in keyof T]: T[K] extends string ? string : I18nDescriptions<T[K]>;
};

/** Discriminated payload the {@link AwdDocsI18n} component renders. */
export type I18nDoc =
  | {
      kind: 'keys';
      /** Top-level translations group this control owns (e.g. `'snackbar'`). */
      group: keyof Translations;
      /** Mirror of the group's shape; one description per leaf string. */
      descriptions: unknown;
      /** Slugs of controls whose translated UI this control also surfaces. */
      related?: readonly string[];
    }
  | { kind: 'text'; body: string }
  | { kind: 'none'; projection?: boolean };

/** The `kind: 'component'` variant of a docs page, used for i18n tabs. */
type I18nTab = Extract<AwdDocsPage, { kind: 'component' }>;

function tab(data: I18nDoc): I18nTab {
  return { kind: 'component', title: 'i18n', component: AwdDocsI18n, inputs: { data } };
}

/**
 * i18n tab for a control that ships built-in translatable strings. `descriptions`
 * is type-checked against the live shape of the `group` in {@link Translations},
 * so it must describe every key the source defines — no more, no less.
 *
 * @param group Top-level key of the translations object this control owns.
 * @param descriptions Deep mirror of that group; a sentence per leaf string.
 * @param related Slugs of composed controls whose strings this control surfaces.
 */
export function i18nKeys<G extends keyof Translations>(
  group: G,
  descriptions: I18nDescriptions<Translations[G]>,
  related?: readonly string[]
): I18nTab {
  return tab({ kind: 'keys', group, descriptions, related });
}

/**
 * i18n tab for a control with no built-in strings that nonetheless renders text
 * the consumer supplies. `body` is Markdown prose naming the text-bearing inputs.
 */
export function i18nText(body: string): I18nTab {
  return tab({ kind: 'text', body });
}

/**
 * i18n tab for a control with no i18n concerns at all. Pass `projection: true`
 * for layout/projection controls to note that any projected content is the
 * consumer's own markup.
 */
export function i18nNone(opts?: { projection?: boolean }): I18nTab {
  return tab({ kind: 'none', projection: opts?.projection });
}
