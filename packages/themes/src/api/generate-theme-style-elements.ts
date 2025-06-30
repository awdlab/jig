import { Theme } from './theme';
import { ThemePart, VariableDefinition } from './theme-part';
import { ThemePartTemplate } from './theme-part-template';
import { groupArrayUsing } from './utils';

export type CssScope =
  | {
      kind: 'attribute';
      name: string;
      value?: string;
    }
  | {
      kind: 'class';
      name: string;
    }
  | {
      kind: 'id';
      name: string;
    }
  | {
      kind: 'tag';
      name: string;
    };

export type ApplyThemeOptions = {
  /**
   * The document to apply the theme to. Defaults to `window.document`.
   * This is useful for server-side rendering or when you want to apply the theme to a
   * specific document instance.
   * @default window.document
   */
  document: Document;
  /**
   * The CSS layer to apply the theme to.
   * If not provided, the theme will be applied to the default layer.
   * @default undefined
   */
  layer?: string;
  /**
   * Defines whether the theme should be applied globally or scoped to a specific element.
   * If not provided, the theme will be applied globally.
   * @default undefined
   */
  scope?: CssScope;
  /**
   * A prefix to add to the class names and CSS variables of the theme parts.
   * This is useful for avoiding name collisions in the global scope.
   * @default 'ngn-'
   */
  namePrefix: string;
};

export function applyTheme<T extends Theme>(
  theme: T,
  scopes: T['parts'][number]['template']['scope'][],
  options?: Partial<ApplyThemeOptions>
) {
  const opt = {
    document: options?.document ?? window.document,
    layer: options?.layer,
    scope: options?.scope,
    namePrefix: options?.namePrefix ?? 'ngn-',
  };
  const parts = groupArrayUsing(
    Array.from(
      collectThemeParts(
        theme,
        theme.parts.filter(part => scopes.includes(part.template.scope)).map(part => part.template)
      )
    ),
    x => x.template.scope
  );

  // variable style elements
  for (const [scope, scopeParts] of parts) {
    const css = buildVariablesCss(scopeParts, opt);
    // TODO: Add css to document
  }

  // style element
  for (const scope of scopes) {
    const css = buildStyleCss(parts.get(scope) ?? [], opt);
    // TODO: Add css to document
  }
}

function collectThemeParts(
  theme: Theme,
  templates: ThemePartTemplate[],
  result: Set<ThemePart> = new Set()
): Set<ThemePart> {
  for (const part of theme.parts) {
    if (result.has(part) || !templates.includes(part.template)) {
      continue;
    }
    result.add(part);
    collectThemeParts(theme, part.dependencies, result);
  }
  return result;
}

function buildVariablesCss(parts: ThemePart[], options: ApplyThemeOptions): string {
  const cssParts = parts.map(part => ({
    root: variableCssFromVariableDefinition(part.root?.variables, options, part.template.scope),
    light: variableCssFromVariableDefinition(part.light?.variables, options, part.template.scope),
    dark: variableCssFromVariableDefinition(part.dark?.variables, options, part.template.scope),
    highContrast: variableCssFromVariableDefinition(
      part.highContrast?.variables,
      options,
      part.template.scope
    ),
  }));

  let css = options.layer ? `@layer ${options.layer} { ` : '';
  css += `${getScopeSelector(options.scope)} { `;

  for (const { root } of cssParts) {
    if (root) {
      css += root;
    }
  }

  // TODO: light, dark and highContrast themes
  // TODO: Special handling for @media, @container, ... for scoping

  css += ' }';
  if (options.layer) css += ' }';
  return css;
}

function variableCssFromVariableDefinition(
  content: VariableDefinition<any, any> | undefined,
  options: ApplyThemeOptions,
  scope: string
): string {
  if (typeof content !== 'object') return '';
  let result = '';
  for (const key in content) {
    const value = (content as any)[key];
    if (typeof value === 'object') {
      return variableCssFromVariableDefinition(value, options, `${scope}-${key}`);
    } else if (typeof value === 'string') {
      const varName = getCssVar(options.namePrefix, `${scope}.${key}`);
      if (value.startsWith('{') && value.endsWith('}')) {
        result += `--${varName}: var(${getCssVar(options.namePrefix, value.slice(1, -1))});`;
      } else {
        result += `--${varName}: ${value};`;
      }
    }
  }
  return result;
}

function buildStyleCss(parts: ThemePart[], options: ApplyThemeOptions): string {
  const varKeySelector = (key: string) => `var(${getCssVar(options.namePrefix, key)})`;
  const cssParts = parts.map(part => {
    if (!part.root?.css && !part.light?.css && !part.dark?.css && !part.highContrast?.css) {
      return {};
    }
    const args = {
      v: varKeySelector,
      c: (className?: string) => getClassName(options.namePrefix, part.template.scope, className),
    };
    return {
      root: part.root?.css?.(args),
      light: part.light?.css?.(args),
      dark: part.dark?.css?.(args),
      highContrast: part.highContrast?.css?.(args),
    };
  });

  let css = options.layer ? `@layer ${options.layer} { ` : '';
  css += `${getScopeSelector(options.scope)} { `;

  for (const { root } of cssParts) {
    if (root) {
      css += root;
    }
  }

  // TODO: light, dark and highContrast themes
  // TODO: Special handling for @media, @container, ... for scoping

  css += ' }';
  if (options.layer) css += ' }';
  return css;
}

function getScopeSelector(scope: CssScope | undefined): string | null {
  if (!scope) {
    return ':root';
  }
  switch (scope.kind) {
    case 'attribute':
      return `[${scope.name}${scope.value ? `="${scope.value}"` : ''}]`;
    case 'class':
      return `.${scope.name}`;
    case 'id':
      return `#${scope.name}`;
    case 'tag':
      return scope.name;
  }
}

function getCssVar(prefix: string, key: string): string {
  // Replace dots with dashes and convert camelCase to kebab-case
  const varName = key
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `--${prefix}${varName}`;
}

function getClassName(prefix: string, scope: string, className?: string) {
  let result = `${prefix}${scope}`;
  if (className) result += `-${className}`;
  return result;
}
