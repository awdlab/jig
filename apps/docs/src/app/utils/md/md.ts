import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  ViewContainerRef,
  DestroyRef,
  PendingTasks,
} from '@angular/core';
import { Router } from '@angular/router';

import { MdSnapshot } from './md-snapshot';
import { renderMd } from './render-md';

import type { MdCfg, TocEntry } from './types';

@Component({
  selector: 'ngn-md',
  template: '',
  styleUrl: 'md.scss',
  host: {
    ngSkipHydration: 'true',
    // Keys the server-rendered content so MdSnapshot can restore it on the client.
    '[attr.data-md-file]': 'cfg().mdFile',
  },
})
export class Md {
  private readonly _http = inject(HttpClient);
  private readonly _vcr = inject(ViewContainerRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _pendingTasks = inject(PendingTasks);
  private readonly _snapshot = inject(MdSnapshot);
  private readonly _host = inject(ElementRef).nativeElement as HTMLElement;
  private readonly _router = inject(Router);
  private readonly _location = inject(Location);

  public readonly cfg = input.required<MdCfg>();

  /** Content headings collected after each render, in document order. */
  public readonly headings = output<TocEntry[]>();

  /**
   * Routes clicks on in-app links inside the rendered markdown — they are plain
   * `<a href>`, which would otherwise reload the whole app. Same-page anchors
   * keep the browser's native scroll.
   */
  private routeLinkClick(event: MouseEvent): void {
    const link = (event.target as HTMLElement | null)?.closest('a');
    if (
      !link ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target
    ) {
      return;
    }
    const href = link.getAttribute('href');
    if (!href?.startsWith('/')) {
      return;
    }
    const [path, fragment] = href.split('#');
    if (path === this._location.path().split('?')[0]) {
      return;
    }
    event.preventDefault();
    void this._router.navigate([path], { fragment: fragment || undefined });
  }

  constructor() {
    this._host.addEventListener('click', event => this.routeLinkClick(event));

    effect(onCleanup => {
      const cfg = this.cfg();
      this._vcr.clear();
      // `ngSkipHydration` makes Angular re-create this element empty on the client,
      // and renderMd (below) is async — so the host would paint blank for ~150ms.
      // Restore the server-rendered HTML synchronously (this effect runs before the
      // browser paints); renderMd swaps in the live, interactive version once ready.
      if (this._host.innerHTML === '') {
        const ssrHtml = this._snapshot.take(cfg.mdFile);
        if (ssrHtml) {
          this._host.innerHTML = ssrHtml;
        }
      }
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
