import { HttpClient } from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  input,
  output,
  ViewContainerRef,
  DestroyRef,
  PendingTasks,
} from '@angular/core';

import { renderMd } from './render-md';

import type { MdCfg, TocEntry } from './types';

@Component({
  selector: 'ngn-md',
  template: '',
  styleUrl: 'md.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class Md {
  private readonly _http = inject(HttpClient);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _pendingTasks = inject(PendingTasks);

  public readonly cfg = input.required<MdCfg>();

  /** Content headings collected after each render, in document order. */
  public readonly headings = output<TocEntry[]>();

  constructor() {
    effect(onCleanup => {
      const cfg = this.cfg();
      this._vcr.clear();
      // A newer cfg() supersedes this render: mark it cancelled so a slow,
      // in-flight render neither clobbers the fresh DOM nor emits stale headings.
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      // Keep the app "unstable" for the whole render (incl. untracked dynamic
      // imports in getMarked/loadPrism) so SSR does not go stable and destroy
      // the injector mid-flight — that races into NG0205.
      this._pendingTasks.run(async () => {
        const headings = await renderMd(
          this._destroyRef,
          this._vcr,
          this._http,
          cfg,
          () => cancelled
        );
        if (!cancelled) {
          this.headings.emit(headings);
        }
      });
    });
  }
}
