import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { Router } from '@angular/router';
import tablerFileText from '@iconify/icons-tabler/file-text';
import tablerPuzzle from '@iconify/icons-tabler/puzzle';
import tablerSearch from '@iconify/icons-tabler/search';
import tablerTag from '@iconify/icons-tabler/tag';
import { NgnCommand } from '@ngneers/controls/command';

import { DocsSearch } from './search';

import type { NgnActionItem } from '@ngneers/controls/api';

/** Below this there is nothing worth matching on. */
const MIN_QUERY_LENGTH = 2;

/** Extra detail the custom item template renders under each label. */
type ResultDetail = { breadcrumb: string; snippet: string; badge: string };

@Component({
  selector: 'ngn-docs-search-dialog',
  templateUrl: './search-dialog.html',
  imports: [NgnCommand],
})
export class NgnDocsSearchDialog {
  public readonly open = model(false);

  protected readonly iconSearch = tablerSearch;

  /** Bound two-way into the palette, which owns the search field. */
  protected readonly query = signal('');

  private readonly _search = inject(DocsSearch);
  private readonly _router = inject(Router);

  private readonly _activeQuery = computed(() => {
    const query = this.query().trim();
    return query.length >= MIN_QUERY_LENGTH ? query : '';
  });

  /** Ranked once per query — both {@link items} and {@link details} read this. */
  private readonly _ranked = computed(() => {
    const query = this._activeQuery();
    return query
      ? { results: this._search.search(query), names: this._search.names(query) }
      : { results: [], names: [] };
  });

  /**
   * Ranked results as palette items: one group per kind, each leaf navigating via
   * `callback` rather than `route` so it can carry the heading anchor — `route`
   * navigation drops the fragment.
   */
  protected readonly items = computed<NgnActionItem[]>(() => {
    const { results, names } = this._ranked();
    const groups: NgnActionItem[] = [];

    if (names.length > 0) {
      groups.push({
        id: 'group-names',
        label: 'Exact names',
        children: names.map(name => ({
          id: `name-${name.name}`,
          label: name.name,
          icon: tablerTag,
          callback: () => this._go(name.route, name.anchor),
        })),
      });
    }

    for (const [kind, label, icon] of [
      ['doc', 'Documentation', tablerFileText],
      ['api', 'API reference', tablerPuzzle],
    ] as const) {
      const matching = results.filter(result => result.kind === kind);
      if (matching.length === 0) {
        continue;
      }
      groups.push({
        id: `group-${kind}`,
        label,
        children: matching.map(result => ({
          id: `${kind}-${result.route}-${result.anchor}`,
          label: result.heading,
          icon,
          callback: () => this._go(result.route, result.anchor),
        })),
      });
    }

    return groups;
  });

  /** Keyed by item id — `NgnActionItem` has no room for this, the template reads it. */
  protected readonly details = computed<Record<string, ResultDetail>>(() => {
    const { results, names } = this._ranked();
    const detail: Record<string, ResultDetail> = {};
    for (const name of names) {
      detail[`name-${name.name}`] = { breadcrumb: '', snippet: '', badge: name.kind };
    }
    for (const result of results) {
      detail[`${result.kind}-${result.route}-${result.anchor}`] = {
        breadcrumb: [result.page, result.section].filter(Boolean).join(' › '),
        snippet: result.snippet,
        badge: '',
      };
    }
    return detail;
  });

  protected readonly emptyMessage = computed(() => {
    const state = this._search.state();
    if (state === 'failed') {
      return 'Search is unavailable — the index failed to load.';
    }
    if (this._activeQuery().length === 0) {
      return 'Describe what you need, or type a control name.';
    }
    if (state === 'lexical') {
      return 'Nothing matches that — searching titles and names only.';
    }
    return state === 'ready' ? 'Nothing matches that.' : 'Loading search…';
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        // Opening is the last useful moment to start the fetch, and unlike the
        // topbar's hover warm-up it loads regardless of the connection.
        void this._search.load();
      }
    });
  }

  private _go(route: string, anchor: string): void {
    void this._router.navigate([`/${route}`], { fragment: anchor || undefined });
  }
}
