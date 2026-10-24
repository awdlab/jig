import { getClassName } from './get-class-name.js';
import type { StyleScope } from './style-scope.js';
import { upsertThemeStyleElement } from './upsert-theme-style-element.js';
import type { Theme } from '../theme/theme.js';
import type { ThemePart } from '../theme/theme-part.js';
import { groupArrayUsing } from '../utils/group-array-using.js';

export type ApplyThemeOptions = {
  /**
   * The document to apply the theme to. Defaults to `window.document`.
   * This is useful for server-side rendering or when you want to apply the theme to a
   * specific document instance.
   * @default `window.document`
   */
  document: Document;
  /**
   * The CSS layer to apply the theme to.
   * If not provided, the theme will be applied to the default layer.
   * @default `undefined`
   */
  layer?: string;
  /**
   * Defines whether the theme should be applied globally or scoped to a specific element.
   * If not provided, the theme will be applied globally.
   * @default `undefined`
   */
  styleScope?: StyleScope;
  /**
   * A prefix to add to the class names and CSS variables of the theme parts.
   * This is useful for avoiding name collisions in the global scope.
   * @default `'jig-'`
   */
  namePrefix: string;
  /**
   * The CSP nonce to put on the generated `<style>` elements, for apps whose
   * `style-src` policy requires one.
   * @default `undefined`
   */
  nonce?: string;
};

export function applyTheme<T extends Theme>(
  theme: T,
  scopes: T['parts'][number]['scope'][],
  options: ApplyThemeOptions
) {
  const opt = {
    document: options.document ?? window.document,
    layer: options.layer,
    styleScope: options.styleScope,
    namePrefix: options.namePrefix ?? 'jig-',
    nonce: options.nonce,
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
        'style-scope': styleScopeToIdentifier(opt.styleScope),
      },
      css,
      opt.nonce
    );
  }

  // style element
  const allParts = scopes.map(scope => parts.get(scope) ?? scope);
  for (const part of allParts) {
    if (typeof part === 'string') {
      console.warn(`No theme parts found for scope '${part}'. Skipping style generation.`);
      continue;
    }
    const css = buildStyleCss(part, opt);
    upsertThemeStyleElement(
      opt.document,
      {
        kind: 'styles',
        'theme-scope': part[0]?.scope,
        'style-scope': styleScopeToIdentifier(opt.styleScope),
      },
      css,
      opt.nonce
    );
  }
}

export function applyGlobalStyles(globalStyles: ThemePart, options: ApplyThemeOptions) {
  const opt = {
    document: options.document ?? window.document,
    layer: options.layer,
    styleScope: options.styleScope,
    namePrefix: options.namePrefix ?? 'jig-',
    nonce: options.nonce,
  };
  const cssVariables = buildVariablesCss([globalStyles], opt);
  upsertThemeStyleElement(
    opt.document,
    {
      kind: 'variables',
      'theme-scope': globalStyles.scope,
      'style-scope': styleScopeToIdentifier(opt.styleScope),
    },
    cssVariables,
    opt.nonce
  );
  const cssStyles = buildStyleCss([globalStyles], opt);
  upsertThemeStyleElement(
    opt.document,
    {
      kind: 'styles',
      'theme-scope': globalStyles.scope,
      'style-scope': styleScopeToIdentifier(opt.styleScope),
    },
    cssStyles,
    opt.nonce
  );
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
  result: Set<ThemePart> = new Set()
): Set<ThemePart> {
  for (const part of theme.parts) {
    if (part.scope !== scope || result.has(part)) {
      continue;
    }
    result.add(part);
    for (const dep of part.dependencies ?? []) {
      collectThemeParts(theme, dep.scope, result);
    }
    if (part.base) {
      for (const dep of part.base.dependencies ?? []) {
        collectThemeParts(theme, dep.scope, result);
      }
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

  const darkSelector = getDarkSelector(options.styleScope);
  for (const { root, dark } of cssParts) {
    if (root) {
      css += root;
    }
    if (dark) {
      css += `${darkSelector} { ${dark} }`;
    }
  }

  // TODO: light and highContrast themes

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

function buildStyleCss(parts: ThemePart[], options: ApplyThemeOptions, isBase = false): string {
  const varKeySelector = (key: string) => `var(${getCssVar(options.namePrefix, key)})`;

  const cssParts = parts.map(part => {
    if (!part.root?.css && !part.light?.css && !part.dark?.css && !part.highContrast?.css) {
      return {};
    }

    // Create a selector for unstyled mode. To avoid specificity issues, we use a always-true selector
    // for when unstyled mode is active.
    const unstyledSelector = `:not(${isBase ? '.jig-css-specificity' : '.jig-unstyled'})`;

    const args = {
      v: (key: string) => varKeySelector(key),
      c: (className?: string, kind: 'class' | 'animation' = 'class') => {
        const prefix = kind === 'animation' ? '' : '.';
        const unstyledSuffix = kind === 'animation' ? '' : unstyledSelector;
        return `${prefix}${getClassName(options.namePrefix, part.scope, className)}${unstyledSuffix}`;
      },
      d: (depClass: string, arg2?: string, arg3?: string) => {
        const dep = part.controlTemplate?.dependencies?.find(d => d.class === depClass);

        // Projected dependencies (arrive via <ng-content>) have no host element the parent
        // can mark with [ptDep] — there is no marker to anchor on. Resolve directly to the
        // child's own raw class instead.
        if (dep?.projected === true) {
          // no inner class → the raw child scope class itself
          if (arg2 === undefined) {
            return `.${getClassName(options.namePrefix, dep.template.scope)}${unstyledSelector}`;
          }
          // 3-arg grandchild form: (depClass, childScope, innerClassName) — anchor under the
          // raw child class rather than a (nonexistent) marker.
          if (arg3 !== undefined) {
            return `.${getClassName(options.namePrefix, dep.template.scope)}${unstyledSelector} .${getClassName(options.namePrefix, arg2, arg3)}${unstyledSelector}`;
          }
          // 2-arg form: (depClass, innerClassName)
          return `.${getClassName(options.namePrefix, dep.template.scope, arg2)}${unstyledSelector}`;
        }

        const marker = `.${getClassName(options.namePrefix, part.scope, depClass)}${unstyledSelector}`;
        // no inner class → the child host (marker element)
        if (arg2 === undefined) {
          return marker;
        }
        // 3-arg grandchild form: (depClass, childScope, innerClassName)
        if (arg3 !== undefined) {
          return `${marker} .${getClassName(options.namePrefix, arg2, arg3)}${unstyledSelector}`;
        }
        // 2-arg form: (depClass, innerClassName) — resolve child scope from the dep template
        const childScope = dep?.template.scope ?? depClass;
        return `${marker} .${getClassName(options.namePrefix, childScope, arg2)}${unstyledSelector}`;
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

  const baseCss = parts
    .filter(p => p.base)
    .map(part => {
      const base = part.base!;
      return buildStyleCss([base], { ...options, layer: undefined }, true);
    });

  if (baseCss.length > 0) {
    css += baseCss.join('\n');
  }

  css += `${getScopeSelector(options.styleScope)} { `;

  const darkSelector = getDarkSelector(options.styleScope);
  let unscopableCss = '';
  for (const { root, dark } of cssParts) {
    if (root) {
      const { unscopable, scopable } = splitScopableCss(root, options.styleScope);
      css += scopable;
      unscopableCss += unscopable;
    }
    if (dark) {
      const { unscopable, scopable } = splitScopableCss(dark, options.styleScope);
      css += `${darkSelector} { ${scopable} }`;
      if (unscopable) {
        console.warn(
          'Unscopable CSS inside dark theme is not supported and will be ignored:',
          unscopable
        );
      }
    }
  }

  // TODO: light and highContrast themes

  css += ' }';
  css += unscopableCss;

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

/**
 * The `dark` class sits on the document element, so a scoped theme has to match it on an
 * ancestor instead of on the scope element itself.
 */
function getDarkSelector(scope: StyleScope | undefined): string {
  return scope ? ':root.dark &' : '&.dark';
}

/** At-rules whose body holds no style rules — wrapping their contents in a selector breaks them. */
const UNSCOPABLE_AT_RULES =
  /^\s*@(keyframes|font-face|property|counter-style|font-feature-values)\b/;

/** Wraps a top-level at-rule's body in the scope selector, so its rules stay scoped too. */
/** @internal Exported for tests. */
export function scopeAtRule(atRule: string, scope: StyleScope | undefined): string {
  if (!scope || UNSCOPABLE_AT_RULES.test(atRule)) return atRule;
  const open = atRule.indexOf('{');
  const close = atRule.lastIndexOf('}');
  if (open === -1 || close < open) return atRule;
  const body = atRule.slice(open + 1, close);
  return `${atRule.slice(0, open + 1)} ${getScopeSelector(scope)} { ${body} } }`;
}

/** @internal Exported for tests. */
export function getCssVar(prefix: string, key: string): string {
  // Replace dots with dashes and convert camelCase to kebab-case
  const varName = key
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
  return `--${prefix}${varName}`;
}

/** @internal Exported for tests. */
export function splitScopableCss(
  css: string,
  scope: StyleScope | undefined
): { unscopable: string; scopable: string } {
  let depth = 0;
  let result = {
    scopable: '',
    unscopable: '',
  };

  let start = 0;
  let kind: keyof typeof result = 'scopable';
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    // @MaSch0212 review the `!depth` condition here, some queries are allowed inside scopable css
    if (!depth && char === '@' && (!css[i - 1] || css[i - 1] === ' ') && kind === 'scopable') {
      // Up to `i`, not `i - 1`: at i === 0 that is slice(0, -1), which copies the
      // whole block into the scopable half and then emits the at-rule again.
      result.scopable += css.slice(start, i);
      start = i;
      kind = 'unscopable';
    } else if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && kind === 'unscopable') {
        result.unscopable += scopeAtRule(css.slice(start, i + 1), scope);
        start = i + 1;
        kind = 'scopable';
      }
    }
  }
  result[kind] += css.slice(start);
  return result;
}
