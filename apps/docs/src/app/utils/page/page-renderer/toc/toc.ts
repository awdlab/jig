import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DOCUMENT,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import type { TocEntry } from '../../../md/types';

/**
 * Resolves a heading `id` to its currently-visible element. Cached, inactive
 * tabs keep their (identically-slugged) headings in the DOM, so prefer the one
 * that is actually laid out.
 */
function resolveHeading(doc: Document, id: string): HTMLElement | null {
  const escaped = doc.defaultView?.CSS.escape(id) ?? id;
  const matches = [...doc.querySelectorAll<HTMLElement>(`#${escaped}`)];
  return matches.find(el => el.offsetParent !== null) ?? matches[0] ?? null;
}

/** Walks up from `el` to the nearest vertically scrollable ancestor. */
function scrollParent(el: HTMLElement): HTMLElement | null {
  const view = el.ownerDocument.defaultView;
  let node = el.parentElement;
  while (node) {
    const overflowY = view?.getComputedStyle(node).overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Auto-generated "on this page" rail: one scroll-anchor link per content
 * heading, with the section currently in view highlighted. Fed by the
 * headings the markdown renderer collects.
 */
@Component({
  selector: 'ngn-docs-toc',
  templateUrl: 'toc.html',
  styleUrl: 'toc.scss',
  host: { class: 'block' },
})
export class NgnDocsToc {
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public readonly headings = input.required<TocEntry[]>();

  protected readonly activeId = signal('');

  /** Shallowest heading level present — the indentation baseline. */
  protected readonly minLevel = computed(() =>
    this.headings().reduce((min, h) => Math.min(min, h.level), 6)
  );

  constructor() {
    effect(onCleanup => {
      const headings = this.headings();
      this.activeId.set(headings[0]?.id ?? '');
      // DOM measurement / observation is browser-only (SSR has no layout).
      const view = this._document.defaultView;
      if (!this._isBrowser || !view || !headings.length) {
        return;
      }

      const elements = headings
        .map(h => resolveHeading(this._document, h.id))
        .filter((el): el is HTMLElement => el !== null);
      if (!elements.length) {
        return;
      }

      // Highlight the heading nearest the top of the scroll viewport.
      const root = scrollParent(elements[0]!);
      const observer = new view.IntersectionObserver(
        () => {
          const rootTop = root?.getBoundingClientRect().top ?? 0;
          let current = elements[0]!;
          for (const el of elements) {
            if (el.getBoundingClientRect().top - rootTop <= 1) {
              current = el;
            } else {
              break;
            }
          }
          this.activeId.set(current.id);
        },
        { root, rootMargin: '0px 0px -80% 0px', threshold: [0, 1] }
      );
      elements.forEach(el => observer.observe(el));
      onCleanup(() => observer.disconnect());
    });
  }

  protected scrollTo(id: string, event: Event) {
    event.preventDefault();
    resolveHeading(this._document, id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.activeId.set(id);
  }
}
