import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

import { decodePotion } from './potion';
import { mergeResults, rankEntries, rankLexical, rankNames } from './rank';

import type { PotionModel } from './potion';
import type { SearchResult } from './rank';
import type { SearchIndex, SearchName } from './types';

const BASE = '/search';

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Data Saver, or a 2g-class connection — ~9MB of index and model is not worth
 * spending before the user has asked for search. Opening the palette still loads.
 */
function spareTheData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !!connection?.saveData || /2g/.test(connection?.effectiveType ?? '');
}

export type SearchState = 'idle' | 'loading' | 'ready' | 'lexical' | 'failed';

/** Loads the generated index and the embedding model, then answers queries. */
@Injectable({ providedIn: 'root' })
export class DocsSearch {
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * `ready` covers semantic search, `lexical` means the index landed but the model
   * did not — titles and {@link names} still resolve, meaning is not matched.
   */
  public readonly state = signal<SearchState>('idle');

  /**
   * Signals, not fields: {@link names} and {@link search} are called from
   * `computed`s, so what they read has to be reactive. As plain fields they gave
   * a caller no dependency to track — a query typed while the index was still in
   * flight cached an empty result and stayed empty until the next keystroke.
   */
  private readonly _index = signal<SearchIndex | null>(null);
  private readonly _semantic = signal<{ model: PotionModel; vectors: Int8Array } | null>(null);

  private _loading: Promise<boolean> | null = null;

  /** Warms the ~9MB of index and model up front, so typing doesn't wait on it. */
  public prefetch(): void {
    if (this._isBrowser && spareTheData()) {
      return;
    }
    void this.load();
  }

  public load(): Promise<boolean> {
    this._loading ??= this._fetchAll();
    return this._loading;
  }

  public names(query: string): SearchName[] {
    const index = this._index();
    return index ? rankNames(index.names, query) : [];
  }

  /**
   * Title matches plus semantic matches. The lexical pass runs as soon as the
   * index lands, so partial words return results while the model is still in
   * flight — and keep returning them, since embeddings can't match a prefix.
   */
  public search(query: string): SearchResult[] {
    const index = this._index();
    if (!index || !query.trim()) {
      return [];
    }
    const semantic = this._semantic();
    return mergeResults(
      rankLexical(index.entries, query),
      semantic ? rankEntries(semantic.model, index, semantic.vectors, query) : []
    );
  }

  private async _fetchAll(): Promise<boolean> {
    if (!this._isBrowser) {
      return false;
    }
    this.state.set('loading');
    try {
      // All requests start together; the index is awaited first so exact-name
      // lookup works while the model is still in flight.
      // ponytail: relies on the HTTP cache for repeat visits — move to Cache
      // Storage if the model turns out to be refetched in practice.
      const [indexRes, vectorsRes, blobRes, vocabRes] = await Promise.all([
        fetch(`${BASE}/index.json`),
        fetch(`${BASE}/vectors.bin`),
        fetch(`${BASE}/model/potion.i8.bin`),
        fetch(`${BASE}/model/vocab.txt`),
      ]);

      if (!indexRes.ok) {
        throw new Error(`search index missing (${indexRes.status})`);
      }
      this._index.set((await indexRes.json()) as SearchIndex);

      // A missing model or vector file degrades to the lexical passes instead of
      // taking search down — and must not be read as a body, since a dev server
      // answers a missing asset with the app shell rather than an error.
      const missing = [vectorsRes, blobRes, vocabRes].find(res => !res.ok);
      if (missing) {
        throw new Error(`semantic assets missing (${missing.url} → ${missing.status})`);
      }
      this._semantic.set({
        vectors: new Int8Array(await vectorsRes.arrayBuffer()),
        model: decodePotion(await blobRes.arrayBuffer(), await vocabRes.text()),
      });
      this.state.set('ready');
      return true;
    } catch (error) {
      console.error('[search] failed to load', error);
      // Titles and exact names still work whenever the index itself landed.
      this.state.set(this._index() ? 'lexical' : 'failed');
      return this._index() !== null;
    }
  }
}
