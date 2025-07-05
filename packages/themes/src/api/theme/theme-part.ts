import { ControlTemplate } from './control-template';
import { Scoped } from './scoped';
import { VariableValues } from './variable';
import { VariableTemplate } from './variable-template';

type ChildrenScopes<Children extends ControlTemplate<any>[]> = Children extends (infer Child)[]
  ? Child extends ControlTemplate<any>
    ? Child['scope']
    : never
  : never;

type ClassnameForChildScope<
  Children extends ControlTemplate<any>[],
  Scope extends ChildrenScopes<Children>,
> = Children extends (infer Child)[]
  ? Child extends ControlTemplate<Scope>
    ? Child['classNames'][number]
    : never
  : never;

type ThemePartContent<V, K, C, Children extends ControlTemplate<any>[]> = {
  readonly values?: V;
  readonly css?: (args: {
    v: (key: K) => string;
    c: (className?: C | '') => string;
    d: <Scope extends ChildrenScopes<Children>>(
      scope: Scope,
      className?: ClassnameForChildScope<Children, Scope>
    ) => string;
  }) => string;
};

type _ThemePartContent<
  S extends string = string,
  C extends ControlTemplate = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
  Children extends ControlTemplate<any>[] = ControlTemplate<any>[],
> = ThemePartContent<
  VariableValues<V[number]['variables'], V[number]['__varkeys'] | D[number]['__varkeys']>,
  V[number]['__varkeys'] | D[number]['__varkeys'],
  C['classNames'][number],
  Children
>;

export type ThemePart<
  S extends string = string,
  C extends ControlTemplate<S> = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
  Children extends ControlTemplate<any>[] = ControlTemplate<any>[],
> = Scoped<S> & {
  readonly controlTemplate?: C;
  readonly variables?: V;
  readonly dependencies?: D;
  readonly childControls?: Children;
  readonly root?: _ThemePartContent<S, C, V, D, Children>;
  readonly light?: _ThemePartContent<S, C, V, D, Children>;
  readonly dark?: _ThemePartContent<S, C, V, D, Children>;
  readonly highContrast?: _ThemePartContent<S, C, V, D, Children>;
};

export function createThemePart<
  C extends ControlTemplate = ControlTemplate,
  const V extends VariableTemplate<C['scope']>[] = VariableTemplate<C['scope']>[],
  const D extends VariableTemplate[] = VariableTemplate[],
  const Children extends ControlTemplate<any>[] = ControlTemplate<any>[],
>(
  init: Omit<ThemePart<C['scope'], C, V, D, Children>, 'scope' | 'controlTemplate'> & {
    controlTemplate: C;
  }
): ThemePart<C['scope'], C, V, D, Children>;
export function createThemePart<
  S extends string = string,
  const V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  const D extends VariableTemplate[] = VariableTemplate[],
  const Children extends ControlTemplate<any>[] = ControlTemplate<any>[],
>(init: ThemePart<S, never, V, D, Children>): ThemePart<S, never, V, D, Children>;
export function createThemePart(init: Partial<ThemePart>): ThemePart {
  return {
    scope: init.scope ?? init.controlTemplate?.scope ?? '',
    controlTemplate: init.controlTemplate,
    variables: init.variables,
    dependencies: init.dependencies,
    root: init.root,
    light: init.light,
    dark: init.dark,
    highContrast: init.highContrast,
  };
}
