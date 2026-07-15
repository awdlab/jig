import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Preserves the server-rendered markdown HTML across hydration.
 *
 * `Md` uses `ngSkipHydration`, so Angular discards each `ngn-md` element's
 * server-rendered content and re-renders it on the client. That re-render is
 * async (HTTP + dynamic marked/prism imports), so the host would paint empty for
 * ~150ms — a visible flicker. This service snapshots the server HTML before
 * hydration replaces it (see the app initializer in `app.config`), keyed by
 * markdown file, so `Md` can restore it synchronously and swap in the freshly
 * rendered content only once it's ready.
 */
@Injectable({ providedIn: 'root' })
export class MdSnapshot {
  private readonly _doc = inject(DOCUMENT);
  private readonly _byFile = new Map<string, string>();

  /** Snapshot every server-rendered `<ngn-md data-md-file>` in the document. */
  public capture(): void {
    this._doc.querySelectorAll<HTMLElement>('ngn-md[data-md-file]').forEach(el => {
      const file = el.getAttribute('data-md-file');
      if (file && el.innerHTML) {
        this._byFile.set(file, el.innerHTML);
      }
    });
  }

  /** Take (one-shot) the captured HTML for a markdown file, if any. */
  public take(file: string): string | undefined {
    const html = this._byFile.get(file);
    this._byFile.delete(file);
    return html;
  }
}
