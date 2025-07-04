import { ControlTemplate } from './control-template';
import { Scoped } from './scoped';
import { VariableValues } from './variable';
import { VariableTemplate } from './variable-template';

type ThemePartContent<V, K, C> = {
  readonly values?: V;
  readonly css?: (args: { v: (key: K) => string; c: (className?: C | '') => string }) => string;
};

type _ThemePartContent<
  S extends string = string,
  C extends ControlTemplate = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
> = ThemePartContent<
  VariableValues<V[number]['variables'], V[number]['__varkeys'] | D[number]['__varkeys']>,
  V[number]['__varkeys'] | D[number]['__varkeys'],
  C['classNames'][number]
>;

export type ThemePart<
  S extends string = string,
  C extends ControlTemplate<S> = ControlTemplate<S>,
  V extends VariableTemplate<S>[] = VariableTemplate<S>[],
  D extends VariableTemplate[] = VariableTemplate[],
> = Scoped<S> & {
  readonly controlTemplate?: C;
  readonly variables?: V;
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
  init: Omit<ThemePart<C['scope'], C, V, D>, 'scope' | 'controlTemplate'> & { controlTemplate: C }
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
    dependencies: init.dependencies,
    root: init.root,
    light: init.light,
    dark: init.dark,
    highContrast: init.highContrast,
  };
}
