import { type ControlTemplate } from './control-template';
import { type Scoped } from './scoped';
import { type VariableValues } from './variable';
import { type VariableTemplate } from './variable-template';

type DepClasses<Deps> = Deps extends readonly (infer Dep)[]
  ? Dep extends { class: infer Cls extends string }
    ? Cls
    : never
  : never;

// Projected deps have no marker element to select via `c()` — only non-projected deps are
// valid `c()` targets. `d()` still accepts all deps (including projected ones) via `DepClasses`.
type NonProjectedDepClasses<Deps> = Deps extends readonly (infer Dep)[]
  ? Dep extends { projected: true }
    ? never
    : Dep extends { class: infer Cls extends string }
      ? Cls
      : never
  : never;

type DepTemplateFor<Deps, Cls> = Deps extends readonly (infer Dep)[]
  ? Dep extends { class: Cls; template: infer T extends ControlTemplate }
    ? T
    : never
  : never;

type ThemePartContent<V, K, C, Deps> = {
  readonly values?: V;
  readonly css?: (args: {
    v: (key: K) => string;
    c: (className: C, kind?: 'class' | 'animation') => string;
    d: {
      <const Cls extends DepClasses<Deps>>(depClass: Cls): string;
      <const Cls extends DepClasses<Deps>>(
        depClass: Cls,
        innerClassName: DepTemplateFor<Deps, Cls>['classNames'][number]
      ): string;
      <const Cls extends DepClasses<Deps>>(
        depClass: Cls,
        childScope: string,
        innerClassName: string
      ): string;
    };
  }) => string;
};

type _ThemePartContent<
  S extends string = string,
  C extends ControlTemplate = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
> = ThemePartContent<
  VariableValues<V[number]['variables'], V[number]['__varkeys'] | D[number]['__varkeys']>,
  V[number]['__varkeys'] | D[number]['__varkeys'],
  C['classNames'][number] | NonProjectedDepClasses<C['dependencies']>,
  C['dependencies']
>;

export type ThemePart<
  S extends string = string,
  C extends ControlTemplate<S> = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
> = Scoped<S> & {
  readonly controlTemplate?: C;
  readonly variables?: V;
  readonly base?: ThemePart<S, C, V, VariableTemplate[]>;
  readonly dependencies?: D;
  readonly root?: _ThemePartContent<S, C, V, D>;
  readonly light?: _ThemePartContent<S, C, V, D>;
  readonly dark?: _ThemePartContent<S, C, V, D>;
  readonly highContrast?: _ThemePartContent<S, C, V, D>;
};

export function createThemePart<
  C extends ControlTemplate = ControlTemplate,
  const V extends VariableTemplate<C['scope']>[] = VariableTemplate<C['scope']>[],
  const D extends VariableTemplate[] = VariableTemplate[],
>(
  init: Omit<ThemePart<C['scope'], C, V, D>, 'scope' | 'controlTemplate'> & {
    controlTemplate: C;
  }
): ThemePart<C['scope'], C, V, D>;
export function createThemePart<
  S extends string = string,
  const V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  const D extends VariableTemplate[] = VariableTemplate[],
>(init: ThemePart<S, never, V, D>): ThemePart<S, never, V, D>;
export function createThemePart(init: Partial<ThemePart>): ThemePart {
  return {
    scope: init.scope ?? init.controlTemplate?.scope ?? '',
    controlTemplate: init.controlTemplate,
    variables: init.variables,
    base: init.base,
    dependencies: init.dependencies,
    root: init.root,
    light: init.light,
    dark: init.dark,
    highContrast: init.highContrast,
  };
}
