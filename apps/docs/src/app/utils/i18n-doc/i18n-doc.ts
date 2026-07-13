import { Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { loadLanguage, type Translations } from '@ngneers/controls/i18n';

import { getMarked } from '../md/marked';

import type { I18nDoc } from './i18n-doc-config';

type I18nRow = { key: string; english: string; description: string };

/** Flattens a translations subtree and its description mirror into table rows. */
function flatten(prefix: string, values: unknown, descriptions: unknown): I18nRow[] {
  const rows: I18nRow[] = [];
  const valueObj = (values ?? {}) as Record<string, unknown>;
  const descObj = (descriptions ?? {}) as Record<string, unknown>;
  for (const key of Object.keys(valueObj)) {
    const path = `${prefix}.${key}`;
    const value = valueObj[key];
    const description = descObj[key];
    if (typeof value === 'string') {
      rows.push({ key: path, english: value, description: String(description ?? '') });
    } else {
      rows.push(...flatten(path, value, description));
    }
  }
  return rows;
}

/**
 * Renders the "i18n" tab of a control's docs page. Three modes (see {@link I18nDoc}):
 * a type-checked key table (`keys`), a prose note (`text`), or a "no concerns"
 * blurb (`none`). The `keys` table pulls its English column straight from the
 * library's `en` translations, so it can never drift from the source.
 */
@Component({
  selector: 'ngn-docs-i18n',
  templateUrl: './i18n-doc.html',
  // Reuse the shared markdown content styles verbatim — the template wraps its
  // output in a `.md` div so the same `:host ::ng-deep .md …` rules apply here.
  styleUrl: '../md/md.scss',
  imports: [RouterLink],
})
export class NgnDocsI18n {
  readonly data = input.required<I18nDoc>();

  private readonly _en = signal<Translations | null>(null);
  protected readonly bodyHtml = signal<string>('');

  protected readonly rows = computed<I18nRow[]>(() => {
    const data = this.data();
    const en = this._en();
    if (data.kind !== 'keys' || !en) {
      return [];
    }
    return flatten(data.group, en[data.group], data.descriptions);
  });

  protected readonly related = computed(() => {
    const data = this.data();
    return data.kind === 'keys' ? (data.related ?? []) : [];
  });

  protected readonly projection = computed(() => {
    const data = this.data();
    return data.kind === 'none' && data.projection === true;
  });

  constructor() {
    // The English column is read from the library's source translations — never
    // hand-maintained — so the table is always in sync with `en.ts`.
    void loadLanguage('en').then(t => this._en.set(t));

    effect(() => {
      const data = this.data();
      if (data.kind === 'text') {
        void getMarked()
          .then(marked => marked.parse(data.body))
          .then(html => this.bodyHtml.set(html as string));
      }
    });
  }
}
