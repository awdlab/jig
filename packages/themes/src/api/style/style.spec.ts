import { describe, expect, it } from 'vitest';

import { getCssVar, scopeAtRule, splitScopableCss } from './apply-theme.js';
import { getClassName } from './get-class-name.js';

import type { StyleScope } from './style-scope.js';

const CLASS_SCOPE: StyleScope = { kind: 'class', name: 'my-app' };

describe('getClassName', () => {
  it('joins prefix and scope', () => {
    expect(getClassName('jig-', 'button')).toBe('jig-button');
  });

  it('appends the class name', () => {
    expect(getClassName('jig-', 'button', 'root')).toBe('jig-button-root');
  });

  it('adds the unstyled marker class', () => {
    expect(getClassName('jig-', 'button', 'root', true)).toBe('jig-button-root jig-unstyled');
  });
});

describe('getCssVar', () => {
  it('turns a dotted key into a dashed custom property', () => {
    expect(getCssVar('jig-', 'color.surface.500')).toBe('--jig-color-surface-500');
  });

  it('kebab-cases camelCase segments', () => {
    expect(getCssVar('jig-', 'size.paddingSmall')).toBe('--jig-size-padding-small');
  });
});

describe('splitScopableCss', () => {
  it('leaves plain rules scopable', () => {
    const css = '.a { color: red; }';
    expect(splitScopableCss(css, undefined)).toEqual({ scopable: css, unscopable: '' });
  });

  it('pulls a top-level at-rule out of the scopable part', () => {
    const { scopable, unscopable } = splitScopableCss(
      '.a { color: red; } @keyframes spin { from { opacity: 0; } }',
      undefined
    );
    expect(scopable).toContain('.a');
    expect(scopable).not.toContain('@keyframes');
    expect(unscopable).toContain('@keyframes spin');
  });

  it('keeps rules that follow an at-rule scopable', () => {
    const { scopable, unscopable } = splitScopableCss(
      '@keyframes spin { from { opacity: 0; } } .b { color: blue; }',
      undefined
    );
    expect(unscopable).toContain('@keyframes');
    expect(scopable).toContain('.b');
    expect(scopable).not.toContain('@keyframes');
  });

  it('does not split a nested at-rule out of its rule', () => {
    const css = '.a { @media (width > 10px) { color: red; } }';
    expect(splitScopableCss(css, undefined).unscopable).toBe('');
  });
});

describe('scopeAtRule', () => {
  it('wraps a media query body in the scope selector', () => {
    const scoped = scopeAtRule('@media (width > 10px) { .a { color: red; } }', CLASS_SCOPE);
    expect(scoped.replace(/\s+/g, ' ')).toBe(
      '@media (width > 10px) { .my-app { .a { color: red; } } }'
    );
  });

  it('leaves keyframes alone, since a scope selector inside them is invalid', () => {
    const css = '@keyframes spin { from { opacity: 0; } }';
    expect(scopeAtRule(css, CLASS_SCOPE)).toBe(css);
  });

  it('is a no-op without a scope', () => {
    const css = '@media print { .a { color: red; } }';
    expect(scopeAtRule(css, undefined)).toBe(css);
  });
});
