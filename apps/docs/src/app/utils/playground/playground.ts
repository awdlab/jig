import { Component, input, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { AnyNgnBase } from '@ngneers/controls/base';
import { notNullish } from '@ngneers/controls/utils';
import {
  ConsoleLogger,
  DeclarationReflection,
  Deserializer,
  FileRegistry,
  ProjectReflection,
} from 'typedoc/browser';

import { getTypedocProject } from '../typedoc';
import { NgnDocsPlaygroundInput } from './input/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngn-docs-playground',
  templateUrl: 'playground.html',
  styleUrl: 'playground.scss',
  imports: [NgnDocsPlaygroundInput],
})
export class NgnDocsPlayground {
  private readonly _project = signal<ProjectReflection | null>(null);

  public readonly component = input.required<AnyNgnBase>();
  public readonly componentName = input.required<string>();

  private readonly _projectComponent = computed(() => {
    const project = this._project();
    const componentName = this.componentName();
    // Component classes get prefixed with an underscore by the compiler

    if (!project || !componentName) {
      return null;
    }
    const controls = project.children?.filter(x =>
      x.categories?.some(cat => cat.title === 'control')
    );
    const control =
      controls?.map(x => x.children?.find(c => c.name === componentName)).filter(notNullish)[0] ??
      null;
    return control;
  });

  protected readonly componentInputs = computed(() => {
    const comp = this._projectComponent();
    if (!comp) {
      return [];
    }
    const groups = comp.groups ?? [];
    const inputs = (groups.find(g => g.title === 'Inputs')?.children ??
      []) as DeclarationReflection[];
    return inputs;
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

    getTypedocProject().then(projectJson => {
      const project = deserializer.reviveProject('API Docs', projectJson as any, {
        projectRoot: '/',
        registry: new FileRegistry(),
      });
      this._project.set(project);
    });
  }
}
