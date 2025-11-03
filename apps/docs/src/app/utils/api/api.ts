import { Component, computed, input } from '@angular/core';
import {
  ConsoleLogger,
  DeclarationReflection,
  Deserializer,
  FileRegistry,
  ProjectReflection,
  ReflectionKind,
} from 'typedoc/browser';

import { NgnDocsApiProperties } from './properties/properties';
import * as projectJson from '../../docs/_generated/typedoc.json';

@Component({
  selector: 'ngn-docs-api',
  templateUrl: 'api.html',
  imports: [NgnDocsApiProperties],
})
export class Api {
  public readonly moduleName = input('scroller/scroller');
  public readonly controlName = input('NgnScroller');

  private readonly _project: ProjectReflection;

  protected readonly props = computed(() => {
    const module = this._project.getChildByName(this.moduleName());
    const component = module?.getChildByName(this.controlName());
    if (component?.kind !== ReflectionKind.Class) {
      throw new Error(`API class not found: ${this.controlName()}`);
    }
    const groups = (component as DeclarationReflection).groups ?? [];
    const inputs = (groups.find(g => g.title === 'Inputs')?.children ??
      []) as DeclarationReflection[];
    const outputs = (groups.find(g => g.title === 'Outputs')?.children ??
      []) as DeclarationReflection[];
    const properties = (groups.find(g => g.title === 'Properties')?.children ??
      []) as DeclarationReflection[];

    return { inputs, outputs, properties };
  });

  public readonly propGroups = computed(() => {
    const props = this.props();
    return [
      ...(props.inputs.length > 0 ? [{ kind: 'Inputs', properties: props.inputs } as const] : []),
      ...(props.outputs.length > 0
        ? [{ kind: 'Outputs', properties: props.outputs } as const]
        : []),
      ...(props.properties.length > 0
        ? [{ kind: 'Properties', properties: props.properties } as const]
        : []),
    ];
  });

  constructor() {
    const logger = new ConsoleLogger();
    const deserializer = new Deserializer(logger);
    this._project = deserializer.reviveProject('API Docs', projectJson as any, {
      projectRoot: '/',
      registry: new FileRegistry(),
    });
  }
}
