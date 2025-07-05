import { getClassName } from './get-class-name';
import { StyleScope } from './style-scope';
import { upsertThemeStyleElement } from './upsert-theme-style-element';
import { Theme } from '../theme/theme';
import { ThemePart } from '../theme/theme-part';
import { groupArrayUsing } from '../utils/group-array-using';

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
  styleScope?: StyleScope;
  /**
   * A prefix to add to the class names and CSS variables of the theme parts.
   * This is useful for avoiding name collisions in the global scope.
   * @default 'ngn-'
   */
  namePrefix: string;
};

export function applyTheme<T extends Theme>(
  theme: T,
  scopes: T['parts'][number]['scope'][],
  options?: Partial<ApplyThemeOptions>
) {
  const opt = {
    document: options?.document ?? window.document,
    layer: options?.layer,
    scope: options?.styleScope,
    namePrefix: options?.namePrefix ?? 'ngn-',
  };
  const parts = groupArrayUsing(getThemePartsByScopes(theme, scopes), x => x.scope);

  // variable style elements
  for (const [scope, scopeParts] of parts) {
    const css = buildVariablesCss(scopeParts, opt);
    upsertThemeStyleElement(
      opt.document,
      {
        kind: 'variables',
        'theme-scope': scope,
        'style-scope': styleScopeToIdentifier(opt.scope),
      },
      css
    );
  }

  // style element
  for (const scope of scopes) {
    const part = parts.get(scope);
    if (!part) {
      console.warn(`No theme parts found for scope '${scope}'. Skipping style generation.`);
      continue;
    }
    const css = buildStyleCss(part, opt);
    upsertThemeStyleElement(
      opt.document,
      {
        kind: 'styles',
        'theme-scope': scope,
        'style-scope': styleScopeToIdentifier(opt.scope),
      },
      css
    );
  }
}

function styleScopeToIdentifier(scope: StyleScope | undefined): string | undefined {
  if (!scope) return undefined;
  switch (scope.kind) {
    case 'attribute':
      return `attr:${scope.name}${scope.value ? `:${scope.value}` : ''}`;
    case 'class':
      return `class:${scope.name}`;
    case 'id':
      return `id:${scope.name}`;
    case 'tag':
      return `tag:${scope.name}`;
  }
}

function getThemePartsByScopes(theme: Theme, scopes: string[]): ThemePart[] {
  const result = new Set<ThemePart>();
  for (const scope of scopes) {
    collectThemeParts(theme, scope, result);
  }
  return Array.from(result);
}

function collectThemeParts(
  theme: Theme,
  scope: string,
  result: Set<ThemePart> = new Set(),
  collectedScopes: Set<string> = new Set()
): Set<ThemePart> {
  if (collectedScopes.has(scope)) return result;
  for (const part of theme.parts) {
    if (part.scope !== scope || result.has(part)) {
      continue;
    }
    result.add(part);
    for (const dep of part.dependencies ?? []) {
      collectThemeParts(theme, dep.scope, result);
    }
  }
  return result;
}

function buildVariablesCss(parts: ThemePart[], options: ApplyThemeOptions): string {
  const cssParts = parts.map(part => ({
    root: variableCssFromVariableDefinition(part.root?.values, options, part.scope),
    light: variableCssFromVariableDefinition(part.light?.values, options, part.scope),
    dark: variableCssFromVariableDefinition(part.dark?.values, options, part.scope),
    highContrast: variableCssFromVariableDefinition(part.highContrast?.values, options, part.scope),
  }));

  let css = options.layer ? `@layer ${options.layer} { ` : '';
  css += `${getScopeSelector(options.styleScope)} { `;

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
  content: object | undefined,
  options: ApplyThemeOptions,
  scope: string
): string {
  if (typeof content !== 'object') return '';
  let result = '';
  for (const key in content) {
    const value = (content as any)[key];
    if (!value) continue;
    if (typeof value === 'object') {
      result += variableCssFromVariableDefinition(value, options, `${scope}-${key}`);
    } else if (typeof value === 'string') {
      const varName = getCssVar(options.namePrefix, `${scope}.${key}`);
      if (value.startsWith('{') && value.endsWith('}')) {
        result += `${varName}: var(${getCssVar(options.namePrefix, value.slice(1, -1))});`;
      } else {
        result += `${varName}: ${value};`;
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
      c: (className?: string) => `.${getClassName(options.namePrefix, part.scope, className)}`,
      d: (scope: string, className?: string) => {
        return `.${getClassName(options.namePrefix, part.scope)} .${getClassName(options.namePrefix, scope, className)}`;
      },
    };
    return {
      root: part.root?.css?.(args),
      light: part.light?.css?.(args),
      dark: part.dark?.css?.(args),
      highContrast: part.highContrast?.css?.(args),
    };
  });

  let css = options.layer ? `@layer ${options.layer} { ` : '';
  css += `${getScopeSelector(options.styleScope)} { `;

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

function getScopeSelector(scope: StyleScope | undefined): string | null {
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
