/**
 * Focus-ring values shared by controls that draw their own field chrome.
 *
 * Most inputs get their chrome from `jig-input-field`, but controls that render several boxes
 * (otp) can't be wrapped by it and must repeat the treatment. Keeping the values here stops the
 * two from drifting apart.
 */

import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

export const ringTemplate = createVariableTemplate({
  scope: 'ring',
  variables: {
    alpha: null,
    alphaNeutral: null,
    alphaStrong: null,
  },
});

/**
 * A translucent ring loses more contrast against a dark surface than a light one, so dark mode
 * mixes in more of the ring colour. `alphaNeutral` runs higher because the neutral ring colour
 * sits much closer to the surface than an accent colour does. `alphaStrong` serves controls whose
 * ring sits on a small box (checkbox, switch) instead of a wide field, where it needs more weight
 * to read at all.
 */
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

/** Ring for a focused field. */
export function fieldRing(v: (name: 'color.primary.500' | 'ring.alpha') => string): string {
  return `color-mix(in oklab, ${v('color.primary.500')} ${v('ring.alpha')}, transparent)`;
}

/** Ring for a focused field in the invalid state — never a solid band. */
export function fieldInvalidRing(v: (name: 'color.error.500' | 'ring.alpha') => string): string {
  return `color-mix(in oklab, ${v('color.error.500')} ${v('ring.alpha')}, transparent)`;
}

/** Ring for a focused control that draws its own small box (checkbox, radio, switch, tabs, slider). */
export function controlRing(v: (name: 'color.primary.500' | 'ring.alphaStrong') => string): string {
  return `color-mix(in oklab, ${v('color.primary.500')} ${v('ring.alphaStrong')}, transparent)`;
}

/** Ring for a focused field that can't be edited (read-only) — neutral, same weight as the others. */
export function fieldNeutralRing(
  v: (name: 'color.disabled.border' | 'ring.alphaNeutral') => string
): string {
  return `color-mix(in oklab, ${v('color.disabled.border')} ${v('ring.alphaNeutral')}, transparent)`;
}
