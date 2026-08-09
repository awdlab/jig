import { firstValueFrom } from 'rxjs';

import { getMarked } from './marked';
import { parseMarkdown } from './parse-md';
import { Api } from '../api/api';
import { NgnDocsDemo } from '../demo/demo';
import { renderComponent } from '../rendering/render-component';
import { safeRoutePath } from '../routing';

import type { MdCfg, TocEntry } from './types';
import type { HttpClient } from '@angular/common/http';
import type { DestroyRef, Type, ViewContainerRef } from '@angular/core';

type Result = string | { component: Type<unknown>; inputs?: Record<string, unknown>; id: string };

// Link-chain glyph shown next to a heading on hover; clicking it copies a
// deep link to that section.
const ANCHOR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
  '<path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

/** Absolute URL to a section, honoring the current path/query. */
function sectionUrl(view: Window, id: string): string {
  const { origin, pathname, search } = view.location;
  return `${origin}${pathname}${search}#${id}`;
}

/**
 * Appends the hover-reveal "copy link" affordance to a heading. Clicking it
 * copies a deep link to the clipboard and reflects the anchor in the URL
 * without scroll-jumping.
 */
function addHeadingAnchor(el: HTMLElement, id: string): void {
  const view = el.ownerDocument.defaultView;
  const anchor = el.ownerDocument.createElement('a');
  anchor.className = 'heading-anchor';
  // Keep the full path/query — a bare `#id` resolves against `<base href>`
  // and would overwrite the route.
  const hashPath = view ? `${view.location.pathname}${view.location.search}#${id}` : `#${id}`;
  anchor.href = hashPath;
  anchor.setAttribute('aria-label', 'Copy link to this section');
  anchor.innerHTML = ANCHOR_ICON;
  anchor.addEventListener('click', event => {
    event.preventDefault();
    if (!view) {
      return;
    }
    view.history.pushState(null, '', `${view.location.pathname}${view.location.search}#${id}`);
    void view.navigator.clipboard
      ?.writeText(sectionUrl(view, id))
      .then(() => {
        anchor.classList.add('copied');
        view.setTimeout(() => anchor.classList.remove('copied'), 1200);
      })
      .catch(() => {
        // Clipboard write can reject (unfocused document, permission denial) — the
        // URL is already in the address bar, so just swallow it.
      });
  });
  el.appendChild(anchor);
}

/**
 * Assigns a unique slug `id` to every content heading and returns them in
 * document order, so a table of contents can link to (and scroll to) each one.
 * Each heading also gets a hover-reveal "copy link" anchor.
 */
function collectHeadings(root: HTMLElement): TocEntry[] {
  const headings: TocEntry[] = [];
  const usedIds = new Set<string>();
  root.querySelectorAll<HTMLElement>('h1, h2, h3').forEach(el => {
    const text = el.textContent?.trim() ?? '';
    if (!text) {
      return;
    }
    const base = safeRoutePath(text) || 'section';
    let id = base;
    let n = 1;
    while (usedIds.has(id)) {
      id = `${base}-${n++}`;
    }
    usedIds.add(id);
    el.id = id;
    addHeadingAnchor(el, id);
    headings.push({ id, text, level: Number(el.tagName[1]) });
  });
  return headings;
}

/**
 * If the page was opened with a `#section` anchor, scroll that heading into
 * view once the content is laid out. Browser-only.
 */
function scrollToHash(root: HTMLElement): void {
  const view = root.ownerDocument.defaultView;
  const hash = view?.location.hash.slice(1);
  if (!view || !hash) {
    return;
  }
  const escaped = view.CSS.escape(hash);
  const target = root.querySelector(`#${escaped}`);
  target?.scrollIntoView({ block: 'start' });
}

export async function renderMd(
  destroyRef: DestroyRef,
  vcr: ViewContainerRef,
  http: HttpClient,
  cfg: MdCfg,
  isCancelled: () => boolean = () => false
): Promise<TocEntry[]> {
  // Track teardown: the async work below (HTTP + dynamic marked/prism imports)
  // can outlive this view on navigation-away. Touching a destroyed injector in
  // renderComponent throws NG0205, so bail out once destroyed.
  let destroyed = false;
  destroyRef.onDestroy(() => {
    destroyed = true;
  });

  const path = `/md/${cfg.mdFile}`;
  const res = await firstValueFrom(http.get(path, { responseType: 'text' }));

  const parsedMd = parseMarkdown(res);

  const marked = await getMarked();

  function getComponent(name: string): Type<unknown> {
    const res = cfg.components?.find(c => {
      return typeof c === 'function' && c.name === `_${name}`;
    });
    if (!res) {
      throw new Error(`Component ${name} not found among provided components.`);
    }
    return res;
  }

  const result: Result[] = await Promise.all(
    parsedMd.map(async block => {
      const kind = block.kind;
      if (kind === 'markdown') {
        const res = await marked.parse(block.content);
        return res;
      } else if (kind === 'component') {
        const compType = getComponent(block.content);
        return {
          component: compType,
          inputs: block.inputs,
          id: `__component_placeholder_${Math.random().toString(36).substring(2, 9)}`,
        };
      } else if (kind === 'demo') {
        const demoComponent = getComponent(block.component);
        return {
          component: NgnDocsDemo,
          inputs: { component: demoComponent },
          id: `__component_placeholder_${Math.random().toString(36).substring(2, 9)}`,
        };
      } else if (kind === 'include') {
        const path = `/md/${block.path}`;
        const text = await firstValueFrom(http.get(path, { responseType: 'text' }));
        const res = await marked.parse(text);
        return res;
      } else if (kind === 'api') {
        const { module, component } = block;
        return {
          component: Api,
          inputs: { moduleName: module, controlName: component },
          id: `__component_placeholder_${Math.random().toString(36).substring(2, 9)}`,
        };
      } else {
        throw new Error(`Unknown block kind: ${kind}`);
      }
    })
  );

  const groupedResult: Result[] = [];
  // Merge consecutive strings
  for (const item of result) {
    if (typeof item === 'string') {
      const last = groupedResult[groupedResult.length - 1];
      if (typeof last === 'string') {
        groupedResult[groupedResult.length - 1] = `${last}\n${item}`;
      } else {
        groupedResult.push(item);
      }
    } else {
      groupedResult.push(item);
    }
  }

  const resultHtml = groupedResult
    .map(x =>
      typeof x === 'string'
        ? `<span class="md">${x}</span>`
        : `<div id="${x.id}" class="component-host"></div>`
    )
    .join('\n');
  const resultComponents = result.filter(x => typeof x !== 'string');

  // Superseded by a newer render (or destroyed) while awaiting? Don't clobber
  // the fresh DOM the newer run already wrote.
  if (destroyed || isCancelled()) {
    return [];
  }

  // Render the Markdown HTML
  vcr.element.nativeElement.innerHTML = resultHtml;

  const headings = collectHeadings(vcr.element.nativeElement);

  // Destroyed/superseded while awaiting? Skip component instantiation — the
  // injector may already be gone and the DOM may belong to a newer render.
  if (destroyed || isCancelled()) {
    return headings;
  }

  // Render the components
  resultComponents.forEach(toRender => {
    const element = vcr.element.nativeElement.querySelector(`#${toRender.id}`);
    if (element) {
      // Create an instance of the component and insert it into the DOM

      const componentRef = renderComponent(toRender.component, vcr, destroyRef, { element });

      if (toRender.inputs) {
        Object.entries(toRender.inputs).forEach(([key, value]) => {
          componentRef.setInput(key, value);
        });
      }
    }
  });

  // Deep link on load: once laid out, scroll to the `#section` in the URL.
  const root = vcr.element.nativeElement as HTMLElement;
  root.ownerDocument.defaultView?.setTimeout(() => {
    if (!destroyed && !isCancelled()) {
      scrollToHash(root);
    }
  }, 0);

  return headings;
}
