import { createThemePart, createVariableTemplate, repeatVariables } from '@awdlab/jig-themes/api';
import { createShadeColors, type ShadeSchemeColors } from '@awdlab/jig-themes/shade/colors';

// All color slots that get `.base`/`.foreground`/ramp CSS variables emitted. This is the set of
// tokens the theme PARTS read internally — `accent` (every hover state), `muted` (muted text +
// subtle backgrounds), `secondary` (chip/tag default) — plus the public ones. It is NOT the
// user-selectable color list; see PUBLIC_COLOR_SLOTS.
// When adding a slot, update all four touchpoints: ShadeSchemeColors, both scheme literals
// in createShadeColors, COLOR_SLOTS, and toTemplateValues.
export const COLOR_SLOTS = [
  'surface',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
] as const;

// The user-selectable colors (the `color="…"` input / `injectThemeColors`): just the neutral
// dark (`primary`), neutral light (`surface`) and `destructive`. The other slots above are
// internal styling tokens only — no control exposes them as a recolor option, so `slotColors`
// emits `color-*` remap classes for these three alone.
export const PUBLIC_COLOR_SLOTS = ['surface', 'primary', 'destructive'] as const;

// Numeric ramp levels, matching nova's `--jig-color-<slot>-<level>` contract. Shade is
// slot-based (its own parts read `.base`/`.foreground`), but the ramp is emitted too so that
// consumers and built-in controls that reference a specific level — e.g. the paginator's
// `var(--jig-color-secondary-500)` — resolve to a real tone instead of an undefined variable.
const RAMP_LEVELS = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975] as const;

type RampKey = `${(typeof RAMP_LEVELS)[number]}`;
type Ramp = Record<RampKey, string>;

// Designed lightness (%) per ramp level for the DARK scheme; the LIGHT scheme uses the
// complement (100 − value). It is intentionally non-linear rather than a plain lightness sweep:
// shade's palette is monochrome, so a linear ramp leaves the mid-high levels a flat mid-gray and
// nova-authored emphasis (`primary-700` headings, `-600` eyebrows) looks dimmer than body text.
// This curve keeps the low levels subtle (near the background), `500` mid (so the paginator's
// `secondary-500` highlight stays visible), and drives `600`+ toward the foreground so emphasis
// reads strong in both schemes.
const RAMP_DARK_LIGHTNESS: Record<(typeof RAMP_LEVELS)[number], number> = {
  25: 6,
  50: 9,
  100: 14,
  200: 22,
  300: 34,
  400: 48,
  500: 62,
  600: 80,
  700: 91,
  800: 96,
  900: 98,
  950: 99,
  975: 100,
};

// Keeps the base color's hue/sat (so configurable base colors ramp correctly) with the designed
// lightness curve above.
function ramp(baseColor: string, isDark: boolean): Ramp {
  return RAMP_LEVELS.reduce((acc, level) => {
    const darkL = RAMP_DARK_LIGHTNESS[level];
    const lightness = isDark ? darkL : 100 - darkL;
    acc[`${level}`] = `hsl(from ${baseColor} h s ${lightness})`;
    return acc;
  }, {} as Ramp);
}

const RAMP_SHAPE = RAMP_LEVELS.reduce(
  (acc, level) => {
    acc[`${level}`] = null;
    return acc;
  },
  {} as Record<RampKey, null>
);

export const colorsTemplate = createVariableTemplate({
  scope: 'color',
  variables: {
    ...repeatVariables(COLOR_SLOTS, {
      base: null,
      foreground: null,
      ...RAMP_SHAPE,
    }),
    background: null,
    foreground: null,
    // Alias of `foreground`. Nova exposes `color.text`; docs components authored against nova
    // reference `--jig-color-text`, so shade emits it too (otherwise that text is unstyled →
    // black-on-dark in dark mode).
    text: null,
    border: null,
    input: null,
    ring: null,
    // Nested like the slots so all paired bg/fg tokens read the same, but intentionally
    // not part of COLOR_SLOTS — popover is not a public recolorable slot.
    popover: {
      base: null,
      foreground: null,
    },
  },
});

function toTemplateValues(scheme: ShadeSchemeColors, isDark: boolean) {
  return {
    surface: {
      base: scheme.surface,
      foreground: scheme.surfaceForeground,
      ...ramp(scheme.surface, isDark),
    },
    primary: {
      base: scheme.primary,
      foreground: scheme.primaryForeground,
      ...ramp(scheme.primary, isDark),
    },
    secondary: {
      base: scheme.secondary,
      foreground: scheme.secondaryForeground,
      ...ramp(scheme.secondary, isDark),
    },
    muted: {
      base: scheme.muted,
      foreground: scheme.mutedForeground,
      ...ramp(scheme.muted, isDark),
    },
    accent: {
      base: scheme.accent,
      foreground: scheme.accentForeground,
      ...ramp(scheme.accent, isDark),
    },
    destructive: {
      base: scheme.destructive,
      foreground: scheme.destructiveForeground,
      ...ramp(scheme.destructive, isDark),
    },
    background: scheme.background,
    foreground: scheme.foreground,
    text: scheme.foreground,
    border: scheme.border,
    input: scheme.input,
    ring: scheme.ring,
  };
}

export function createShadeColorPart(baseColor?: string) {
  const colors = createShadeColors(baseColor);

  return createThemePart({
    scope: 'color',
    variables: [colorsTemplate],
    root: {
      values: toTemplateValues(colors.light, false),
    },
    dark: {
      values: toTemplateValues(colors.dark, true),
    },
  });
}

export const zinc = createShadeColorPart();

type ThemeSlotColor = (typeof COLOR_SLOTS)[number];

type ThemeSlotVarName = `color.${ThemeSlotColor}.${'base' | 'foreground'}`;

/**
 * Emits per-slot `--theme-bg` / `--theme-fg` custom properties so control CSS can be
 * written once against those two variables and recolored via `color-*` classes.
 */
export function slotColors(
  c: (className: `color-${string}`) => string,
  v: (varName: ThemeSlotVarName) => string
): string {
  return PUBLIC_COLOR_SLOTS.map(
    color => `
      ${c(`color-${color}`)} {
        --theme-bg: ${v(`color.${color}.base`)};
        --theme-fg: ${v(`color.${color}.foreground`)};
      }
      `
  ).join('\n');
}
