import { Component, input, signal, computed } from '@angular/core';
import { notNullish } from '@awdlab/jig/utils';
import { ConsoleLogger, Deserializer, FileRegistry } from 'typedoc/browser';

import { JigDocsPlaygroundInput } from './input/input';
import { getTypedocProject } from '../../../typedoc';
import { getTypeMatrix } from '../../../type-matrix';

import type { AnyJigBase } from '@awdlab/jig/base';
import type { ControlTypes, TypeMatrix } from '../../type-model';
import type { DeclarationReflection, ProjectReflection } from 'typedoc/browser';

@Component({
  selector: 'jig-docs-playground-component-inputs',
  templateUrl: 'component-inputs.html',
  imports: [JigDocsPlaygroundInput],
})
export class JigDocsPlaygroundComponentInputs {
  private readonly _project = signal<ProjectReflection | null>(null);
  private readonly _matrix = signal<TypeMatrix | null>(null);

  public readonly component = input.required<AnyJigBase | readonly AnyJigBase[]>();
  public readonly componentName = input.required<string>();

  protected readonly singleComponent = computed(() => {
    const comp = this.component();
    return Array.isArray(comp) ? comp[0] : comp;
  });

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

  protected readonly inputNames = computed(() => this.componentInputs().map(input => input.name));

  protected readonly controlTypes = computed<ControlTypes | null>(
    () => this._matrix()?.[this.componentName()] ?? null
  );

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

    void getTypeMatrix().then(matrix => this._matrix.set(matrix));
  }
}
