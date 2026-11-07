import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

export const ringTemplate = createVariableTemplate({
  scope: 'ring',
  variables: {
    alpha: null,
    alphaNeutral: null,
    alphaStrong: null,
  },
});

/** Dark mode mixes in more ring color, since a translucent ring loses contrast on dark surfaces. */
export const ring = createThemePart({
  scope: 'ring',
  variables: [ringTemplate],
  root: {
    values: {
      alpha: '20%',
      alphaNeutral: '25%',
      alphaStrong: '30%',
    },
  },
  dark: {
    values: {
      alpha: '32%',
      alphaNeutral: '45%',
      alphaStrong: '42%',
    },
  },
});

/** Focus-ring color for every focusable nova part; `color` tints it (defaults to primary). */
export function controlRing(
  v: (name: 'color.primary.500' | 'ring.alphaStrong') => string,
  color = v('color.primary.500')
): string {
  return `color-mix(in oklab, ${color} ${v('ring.alphaStrong')}, transparent)`;
}
