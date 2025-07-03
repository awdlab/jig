import { Theme } from './theme';
import { ThemePart, VariableDefinition } from './theme-part';
import { ThemePartTemplate } from './theme-part-template';
import { groupArrayUsing } from './utils';

export type StyleScope =
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
  scopes: T['parts'][number]['template']['scope'][],
  options?: Partial<ApplyThemeOptions>
) {
  const opt = {
    document: options?.document ?? window.document,
    layer: options?.layer,
    scope: options?.styleScope,
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

export function upsertThemeStyleElement(
  document: Document,
  identifiers: Record<string, string | undefined>,
  css: string
): HTMLStyleElement {
  let selector = '';
  for (const key in identifiers) {
    if (identifiers[key] === undefined) continue;
    selector += `[data-${key}="${identifiers[key]}"]`;
  }
  if (!selector) throw new Error('No identifiers provided for the style element');

  let styleElement = document.head.querySelector<HTMLStyleElement>(`style[ngn-style]${selector}`);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.setAttribute('ngn-style', '');
    for (const key in identifiers) {
      if (identifiers[key] === undefined) continue;
      styleElement.setAttribute(`data-${key}`, identifiers[key]);
    }
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = css;

  return styleElement;
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
  css += `${getScopeSelector(options.styleScope)} { `;

  const uniqueTemplates = parts
    .map(part => part.template)
    .filter((part, index, self) => self.indexOf(part) === index);
  for (const template of uniqueTemplates) {
    css += variableCssFromVariableDefinition(template.variables, options, template.scope);
  }

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
      c: (className?: string) =>
        `.${getClassName(options.namePrefix, part.template.scope, className)}`,
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

  const uniqueTemplates = parts
    .map(part => part.template)
    .filter((part, index, self) => self.indexOf(part) === index);
  for (const template of uniqueTemplates) {
    if (template.css) {
      css += template.css({
        v: varKeySelector,
        c: (className?: string) =>
          `.${getClassName(options.namePrefix, template.scope, className)}`,
      });
    }
  }

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

export function getClassName(prefix: string, scope: string, className?: string) {
  let result = `${prefix}${scope}`;
  if (className) result += `-${className}`;
  return result;
}
