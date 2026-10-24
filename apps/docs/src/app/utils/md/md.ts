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

import { MdSnapshot } from './md-snapshot';
import { renderMd } from './render-md';
import { JigDocsLoader } from '../loader/loader';
import { renderComponent } from '../rendering/render-component';
import { RouteLinks } from '../route-links';

import type { MdCfg, TocEntry } from './types';
import type { ComponentRef } from '@angular/core';

@Component({
  selector: 'jig-md',
  template: '',
  styleUrl: 'md.scss',
  hostDirectives: [RouteLinks],
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

  public readonly cfg = input.required<MdCfg>();

  /** Content headings collected after each render, in document order. */
  public readonly headings = output<TocEntry[]>();

  constructor() {
    effect(onCleanup => {
      const cfg = this.cfg();
      this._vcr.clear();
      // `ngSkipHydration` makes Angular re-create this element empty on the client,
      // and renderMd (below) is async — so the host would paint blank for ~150ms.
      // Restore the server-rendered HTML synchronously (this effect runs before the
      // browser paints); renderMd swaps in the live, interactive version once ready.
      let loader: ComponentRef<unknown> | undefined;
      if (this._host.innerHTML === '') {
        const ssrHtml = this._snapshot.take(cfg.mdFile);
        if (ssrHtml) {
          this._host.innerHTML = ssrHtml;
        } else {
          loader = this.showLoader();
        }
      }
      // A newer cfg() supersedes this render: mark it cancelled so a slow,
      // in-flight render neither clobbers the fresh DOM nor emits stale headings.
      let cancelled = false;
      onCleanup(() => {
        cancelled = true;
        loader?.destroy();
        loader = undefined;
      });
      // Keep the app "unstable" for the whole render (incl. untracked dynamic
      // imports in getMarked/loadPrism) so SSR does not go stable and destroy
      // the injector mid-flight — that races into NG0205.
      this._pendingTasks.run(async () => {
        try {
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
        } finally {
          // Also on a failed fetch — a spinner that never stops is worse than empty.
          loader?.destroy();
          loader = undefined;
        }
      });
    });
  }

  /** Centers the docs loader in the host until renderMd overwrites the content. */
  private showLoader(): ComponentRef<unknown> {
    const doc = this._host.ownerDocument;
    const slot = doc.createElement('div');
    // `overflow-hidden` keeps it out of sight in a cached, zero-width tab panel.
    slot.className = 'flex min-h-[50vh] w-full items-center justify-center overflow-hidden';
    // The loader mounts into its own child: as a component host it carries the
    // control's host classes, which would override the centering above.
    const mount = doc.createElement('div');
    slot.appendChild(mount);
    this._host.appendChild(slot);
    return renderComponent(JigDocsLoader, this._vcr, this._destroyRef, { element: mount });
  }
}
