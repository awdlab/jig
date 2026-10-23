import { createTheme } from '@awdlab/jig-themes';
import { describe, expect, it } from 'vitest';

import { customizeColors, customizeKinds } from './customize-kinds';

const theme = createTheme('test', [], {
  kinds: {
    button: ['primary', 'link'] as const,
    tag: ['default'] as const,
  },
  colors: ['primary', 'info'] as const,
});

describe('customizeKinds', () => {
  it('removes and adds kinds for the named control', () => {
    expect(customizeKinds(theme, { button: { remove: ['link'], add: ['fancy'] } }).button).toEqual([
      'primary',
      'fancy',
    ]);
  });

  it('omits controls the customization does not name, so they keep falling back to the theme', () => {
    expect(Object.keys(customizeKinds(theme, { button: { remove: ['link'] } }))).toEqual([
      'button',
    ]);
  });

  it('does not duplicate a value that is added while it still survives', () => {
    expect(customizeKinds(theme, { button: { add: ['primary'] } }).button).toEqual([
      'primary',
      'link',
    ]);
  });

  it('yields an empty list when every kind is removed', () => {
    expect(customizeKinds(theme, { button: { remove: ['primary', 'link'] } }).button).toEqual([]);
  });

  it('keeps a control the theme does not define', () => {
    expect(customizeKinds(theme, { custom: { add: ['only'] } }).custom).toEqual(['only']);
  });
});

describe('customizeColors', () => {
  it('removes and adds colors', () => {
    expect(customizeColors(theme, { remove: ['info'], add: ['brand'] })).toEqual([
      'primary',
      'brand',
    ]);
  });
});
