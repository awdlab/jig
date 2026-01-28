import { HttpClient } from '@angular/common/http';
import { DestroyRef, Type, ViewContainerRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { marked } from './marked';
import { parseMarkdown } from './parse-md';
import { MdCfg } from './types';
import { Api } from '../api/api';
import { NgnDocsDemo } from '../demo/demo';
import { renderComponent } from '../rendering/render-component';

type Result = string | { component: Type<unknown>; inputs?: Record<string, unknown>; id: string };

export async function renderMd(
  destroyRef: DestroyRef,
  vcr: ViewContainerRef,
  http: HttpClient,
  cfg: MdCfg
) {
  const path = `/md/${cfg.mdFile}`;
  const res = await firstValueFrom(http.get(path, { responseType: 'text' }));

  const parsedMd = parseMarkdown(res);

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

  // Render the Markdown HTML
  vcr.element.nativeElement.innerHTML = resultHtml;

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
}
