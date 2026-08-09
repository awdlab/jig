import { Component, computed, input, signal } from '@angular/core';
import { ConsoleLogger, Deserializer, FileRegistry, ReflectionKind } from 'typedoc/browser';

import { getTypedocProject } from '../typedoc';
import { JigDocsApiProperties } from './properties/properties';

import type { DeclarationReflection, ProjectReflection } from 'typedoc/browser';

@Component({
  selector: 'jig-docs-api',
  templateUrl: 'api.html',
  imports: [JigDocsApiProperties],
})
export class Api {
  public readonly moduleName = input('scroller/scroller');
  public readonly controlName = input('JigScroller');

  private readonly _project = signal<ProjectReflection | null>(null);

  private readonly _projectComponent = computed(() => {
    const module = this._project()?.getChildByName(this.moduleName());
    if (!module) {
      return null;
    }
    const component = module?.getChildByName(this.controlName());
    if (component?.kind !== ReflectionKind.Class) {
      throw new Error(`API class not found: ${this.controlName()}`);
    }
    return component;
  });

  protected readonly props = computed(() => {
    const component = this._projectComponent();

    if (!component) {
      return { inputs: [], outputs: [], properties: [] };
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

  protected readonly internalControlName = computed(() => {
    const comp = this._projectComponent();
    if (!comp) {
      return null;
    }
    const parentName = comp.parent?.name;
    if (!parentName) {
      console.error('Could not determine parent name of component', comp);
      return null;
    }
    const controlName = parentName.split('/').pop();
    if (!controlName) {
      console.error('Could not determine control name from parent name', parentName, comp);
      return null;
    }
    return controlName;
  });

  constructor() {
    const logger = new ConsoleLogger();
    const deserializer = new Deserializer(logger);

    void getTypedocProject().then(projectJson => {
      const project = deserializer.reviveProject('API Docs', projectJson as any, {
        projectRoot: '/',
        registry: new FileRegistry(),
      });
      this._project.set(project);
    });
  }
}
