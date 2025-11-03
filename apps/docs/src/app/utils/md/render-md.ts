import { HttpClient } from '@angular/common/http';
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { marked } from 'marked';
import { firstValueFrom } from 'rxjs';

import { parseMarkdown } from './parse-md';
import { MdCfg } from './types';
import { Api } from '../api/api';
import { NgnDocsDemo } from '../demo/demo';

type Result = string | { component: Type<unknown>; inputs?: Record<string, unknown>; id: string };

export async function renderMd(vcr: ViewContainerRef, http: HttpClient, cfg: MdCfg) {
  const path = `/md/${cfg.mdFile}`;
  const res = await firstValueFrom(http.get(path, { responseType: 'text' }));

  const parsedMd = parseMarkdown(res);

  const result: Result[] = await Promise.all(
    parsedMd.map(async block => {
      const kind = block.kind;
      if (kind === 'markdown') {
        const res = await marked.parse(block.content);
        return res;
      } else if (kind === 'component') {
        const compType = cfg.components?.find(c => c.name === `_${block.content}`);
        if (!compType) {
          throw new Error(`Component ${block.content} not found among provided components.`);
        }
        return {
          component: compType,
          id: `__component_placeholder_${Math.random().toString(36).substring(2, 9)}`,
        };
      } else if (kind === 'demo') {
        const demoComponent = cfg.components?.find(c => c.name === `_${block.component}`);
        if (!demoComponent) {
          throw new Error(`Component ${block.component} not found among provided components.`);
        }
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
        const compType = Api;
        return {
          component: compType,
          inputs: { moduleName: module, controlName: component },
          id: `__component_placeholder_${Math.random().toString(36).substring(2, 9)}`,
        };
      } else {
        throw new Error(`Unknown block kind: ${kind}`);
      }
    })
  );

  const resultHtml = result
    .map(x => (typeof x === 'string' ? x : `<div id="${x.id}" class="component-host"></div>`))
    .join('\n');
  const resultComponents = result.filter(x => typeof x !== 'string');

  // Render the Markdown HTML
  vcr.element.nativeElement.innerHTML = resultHtml;

  // Render the components
  resultComponents.forEach(toRender => {
    const element = vcr.element.nativeElement.querySelector(`#${toRender.id}`);
    if (element) {
      // Create an instance of the component and insert it into the DOM

      const componentInstance = createComponent(toRender.component, {
        hostElement: element,
        environmentInjector: vcr.injector.get(EnvironmentInjector),
        elementInjector: vcr.injector,
      });

      if (toRender.inputs) {
        Object.entries(toRender.inputs).forEach(([key, value]) => {
          componentInstance.setInput(key, value);
        });
      }

      const appRef = vcr.injector.get(ApplicationRef);
      appRef.attachView(componentInstance.hostView);
    }
  });
}
