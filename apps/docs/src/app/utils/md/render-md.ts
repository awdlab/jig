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

/**
 * Assigns a unique slug `id` to every content heading and returns them in
 * document order, so a table of contents can link to (and scroll to) each one.
 */
function collectHeadings(root: HTMLElement): TocEntry[] {
  const headings: TocEntry[] = [];
  const usedIds = new Set<string>();
  root.querySelectorAll('h1, h2, h3').forEach(el => {
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
    headings.push({ id, text, level: Number(el.tagName[1]) });
  });
  return headings;
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

  return headings;
}
