import {
  Component,
  computed,
  inject,
  Injector,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { injectThemeColors, injectThemeControlKinds } from '@awdlab/jig/api/ng';
import { notNullish } from '@awdlab/jig/utils';
import { ConsoleLogger, Deserializer, FileRegistry } from 'typedoc/browser';

import { JigDocsPlaygroundInput } from './input/input';
import { collectParamValues, comboKey, hasParam, resolveParams } from '../../params';
import { getTypedocProject } from '../../../typedoc';
import { getTypeMatrix } from '../../../type-matrix';

import type { AnyJigBase } from '@awdlab/jig/base';
import type { ControlTypes, TypeDeclaration, TypeMatrix } from '../../type-model';
import type { DeclarationReflection, ProjectReflection } from 'typedoc/browser';

/** Inputs whose options come from the active theme rather than from their type. */
const THEME_DRIVEN_INPUTS = ['kind', 'color', 'labelKind'];

/** Renderable types, ordered so one-liners cluster above the tall editors. */
const KIND_ORDER = ['primitive-boolean', 'literalUnion', 'literal', 'primitive', 'array'];

function kindRank(type: TypeDeclaration): number {
  const key =
    type.kind === 'primitive' && type.type === 'boolean' ? 'primitive-boolean' : type.kind;
  const rank = KIND_ORDER.indexOf(key);
  return rank === -1 ? KIND_ORDER.length : rank;
}

function isRenderable(type: TypeDeclaration): boolean {
  switch (type.kind) {
    case 'primitive':
      return ['string', 'number', 'boolean', 'date'].includes(type.type);
    case 'literalUnion':
      return type.values.length > 0;
    case 'literal':
    case 'array':
    case 'tuple':
    case 'object':
    case 'union':
      return true;
    default:
      return false;
  }
}

export interface PlaygroundInputEntry {
  input: DeclarationReflection;
  type: TypeDeclaration;
}

@Component({
  selector: 'jig-docs-playground-component-inputs',
  templateUrl: 'component-inputs.html',
  imports: [JigDocsPlaygroundInput],
})
export class JigDocsPlaygroundComponentInputs {
  private readonly _injector = inject(Injector);
  private readonly _project = signal<ProjectReflection | null>(null);
  private readonly _matrix = signal<TypeMatrix | null>(null);

  public readonly component = input.required<AnyJigBase | readonly AnyJigBase[]>();
  public readonly componentName = input.required<string>();
  /** Substring the input names are filtered by. */
  public readonly filter = input('');

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

  /** Every input that resolves to a type the playground can render, with that type. */
  private readonly resolvedInputs = computed<PlaygroundInputEntry[]>(() => {
    const types = this.controlTypes();
    const instance = this.singleComponent();
    if (!instance) {
      return [];
    }

    const key = types ? comboKey(types.params, name => (instance as any)[name]?.()) : '';
    const combo = types?.combos[key];

    return this.componentInputs()
      .map(input => {
        const type = THEME_DRIVEN_INPUTS.includes(input.name)
          ? this.themeDrivenType(input.name)
          : this.fillParams(combo?.[input.name], input.name, instance);
        return type && isRenderable(type) ? { input, type } : null;
      })
      .filter(notNullish);
  });

  /**
   * Inputs split by the class that declares them, so a control's own inputs come
   * before the ones every control inherits. `value` leads regardless of where it
   * is declared, and within a group the one-line controls precede the tall ones.
   */
  protected readonly inputGroups = computed(() => {
    const owners = this.controlTypes()?.owners ?? {};
    const filter = this.filter().trim().toLowerCase();
    const entries = filter
      ? this.resolvedInputs().filter(entry => entry.input.name.toLowerCase().includes(filter))
      : this.resolvedInputs();

    const groups: { title: string; open: boolean; entries: PlaygroundInputEntry[] }[] = [
      { title: 'Control', open: true, entries: [] },
      { title: 'Value & validation', open: true, entries: [] },
      { title: 'Common', open: false, entries: [] },
    ];

    for (const entry of entries) {
      const owner = owners[entry.input.name];
      const index =
        entry.input.name === 'value' || !owner?.endsWith('Base') ? 0 : owner === 'JigBase' ? 2 : 1;
      groups[index]!.entries.push(entry);
    }

    for (const group of groups) {
      group.entries.sort((a, b) => {
        if (a.input.name === 'value' || b.input.name === 'value') {
          return Number(b.input.name === 'value') - Number(a.input.name === 'value');
        }
        return kindRank(a.type) - kindRank(b.type) || a.input.name.localeCompare(b.input.name);
      });
    }

    return groups.filter(group => group.entries.length);
  });

  private fillParams(
    type: TypeDeclaration | undefined,
    name: string,
    instance: AnyJigBase
  ): TypeDeclaration | undefined {
    if (!type || !hasParam(type)) {
      return type;
    }
    const siblingValues = this.inputNames()
      .filter(sibling => sibling !== name)
      .map(sibling => (instance as any)[sibling]?.() as unknown);
    return resolveParams(type, collectParamValues(siblingValues)) ?? undefined;
  }

  private themeDrivenType(name: string): TypeDeclaration | undefined {
    const control = this.internalControlName();
    if (!control) {
      return undefined;
    }
    const values = runInInjectionContext(this._injector, () =>
      name === 'color'
        ? injectThemeColors(control)()
        : injectThemeControlKinds(name === 'labelKind' ? 'inputFieldLabel' : control)()
    );
    if (!values.length || values.every(value => !value)) {
      return undefined;
    }
    return {
      kind: 'literalUnion',
      primitiveType: 'string',
      allowCustomValue: false,
      values: values.map(value =>
        value ? { label: value, value } : { label: '- none -', value: undefined }
      ),
    };
  }

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
