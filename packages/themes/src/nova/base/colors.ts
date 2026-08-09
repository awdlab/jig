import {
  createThemePart,
  createVariableTemplate,
  repeatVariables,
  bestContrast,
  type RGB,
} from '@awdlab/jig-themes/api';
import {
  bubblegumColor,
  bubblegumColorRgb,
  getColorPalette,
  getColorPaletteRgb,
  inkColor,
  inkColorRgb,
  crimsonFlameColor,
  crimsonFlameColorRgb,
  electricSkyColor,
  electricSkyColorRgb,
  forestVerdantColor,
  forestVerdantColorRgb,
  mustardColor,
  mustardColorRgb,
  solarMarigoldColor,
  solarMarigoldColorRgb,
  greyColor,
  greyColorRgb,
} from '@awdlab/jig-themes/nova/colors';

const CONTRAST_SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

const CONTRAST_AA = 4.5;

/**
 * Tonal foreground pairs: an in-hue text shade sitting on a same-palette
 * background shade. Emitted as `${fg}-on-${bg}` — the mechanic keeps the tonal
 * shade when it clears AA against that background, flips to its mirror
 * (`1000 - fg`) when the mirror reads better, and falls back to the neutral
 * text/background pick when neither in-hue option clears AA.
 */
const TONAL_PAIRS = [
  { bg: '50', fg: '700' },
  { bg: '100', fg: '600' },
] as const;

const shadeVariables = {
  '50': null,
  '100': null,
  '200': null,
  '300': null,
  '400': null,
  '500': null,
  '600': null,
  '700': null,
  '800': null,
  '900': null,
  '950': null,
};

const contrastVariables = {
  '50-contrast': null,
  '100-contrast': null,
  '200-contrast': null,
  '300-contrast': null,
  '400-contrast': null,
  '500-contrast': null,
  '600-contrast': null,
  '700-contrast': null,
  '800-contrast': null,
  '900-contrast': null,
  '950-contrast': null,
};

const tonalVariables = {
  '700-on-50': null,
  '600-on-100': null,
};

export const colorsTemplate = createVariableTemplate({
  scope: 'color',
  variables: {
    ...repeatVariables(
      ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success', 'surface'],
      { ...shadeVariables, ...contrastVariables, ...tonalVariables }
    ),
    background: null,
    border: null,
    text: null,
    disabled: {
      text: null,
      border: null,
      background: null,
    },
    invalid: {
      text: null,
      border: null,
      background: null,
    },
  },
});

function reversePalette<T extends Record<string, unknown>>(palette: T): T {
  const keys = Object.keys(palette);
  const values = Object.values(palette).reverse();

  const newPalette: Record<string, unknown> = {};
  keys.forEach((key, i) => {
    const value = values[i];
    if (value != null) {
      newPalette[key] = value;
    }
  });

  return newPalette as T;
}

/**
 * For each shade, pick the best-contrasting foreground between the theme's
 * `text` and `background` tokens and emit it as a reference to the winning
 * token (e.g. `{color.text}`), so it self-heals within a mode. Computed once
 * per mode in pure JS — no DOM, no canvas.
 */
function contrastRefs(
  shades: Record<string, RGB>,
  textRgb: RGB,
  backgroundRgb: RGB
): Record<string, string> {
  const candidates = [
    { key: 'color.text', rgb: textRgb },
    { key: 'color.background', rgb: backgroundRgb },
  ];

  const refs: Record<string, string> = {};
  for (const shade of CONTRAST_SHADES) {
    const rgb = shades[shade];
    if (!rgb) {
      continue;
    }
    const winner = bestContrast(rgb, candidates);
    if (winner) {
      refs[`${shade}-contrast`] = `{${winner.key}}`;
    }
  }
  return refs;
}

/**
 * Emit tonal foreground refs (`${fg}-on-${bg}`). Prefer the in-hue shade (or
 * its mirror) when it clears AA against the paired background; otherwise fall
 * back to the neutral text/background pick so readability is always guaranteed.
 */
function tonalRefs(
  name: string,
  shades: Record<string, RGB>,
  textRgb: RGB,
  backgroundRgb: RGB
): Record<string, string> {
  const neutral = [
    { key: 'color.text', rgb: textRgb },
    { key: 'color.background', rgb: backgroundRgb },
  ];

  const refs: Record<string, string> = {};
  for (const { bg, fg } of TONAL_PAIRS) {
    const bgRgb = shades[bg];
    const fgRgb = shades[fg];
    const mirror = String(1000 - Number(fg));
    const mirrorRgb = shades[mirror];
    if (!bgRgb || !fgRgb || !mirrorRgb) {
      continue;
    }
    const tonal = bestContrast(bgRgb, [
      { key: `color.${name}.${fg}`, rgb: fgRgb },
      { key: `color.${name}.${mirror}`, rgb: mirrorRgb },
    ]);
    const winner = tonal && tonal.ratio >= CONTRAST_AA ? tonal : bestContrast(bgRgb, neutral);
    if (winner) {
      refs[`${fg}-on-${bg}`] = `{${winner.key}}`;
    }
  }
  return refs;
}

function getThemeColors(
  isDark: boolean,
  primaryShades: Record<string, string> = inkColor,
  primaryRgb: Record<string, RGB> = inkColorRgb,
  neutralShades: typeof greyColor = greyColor,
  neutralRgb: typeof greyColorRgb = greyColorRgb
) {
  const p = <T extends Record<string, unknown>>(palette: T): T =>
    isDark ? reversePalette(palette) : palette;

  const grey = p(neutralShades);
  const greyRgb = p(neutralRgb);
  const backgroundRgb = greyRgb['25'];
  const textRgb = greyRgb['950'];

  const palette = (
    name: string,
    shades: Record<string, string>,
    shadesRgb: Record<string, RGB>
  ) => {
    const rgb = p(shadesRgb);
    return {
      ...p(shades),
      ...contrastRefs(rgb, textRgb, backgroundRgb),
      ...tonalRefs(name, rgb, textRgb, backgroundRgb),
    };
  };

  return {
    primary: palette('primary', primaryShades, primaryRgb),
    secondary: palette('secondary', mustardColor, mustardColorRgb),
    accent: palette('accent', bubblegumColor, bubblegumColorRgb),
    error: palette('error', crimsonFlameColor, crimsonFlameColorRgb),
    warning: palette('warning', solarMarigoldColor, solarMarigoldColorRgb),
    info: palette('info', electricSkyColor, electricSkyColorRgb),
    success: palette('success', forestVerdantColor, forestVerdantColorRgb),
    surface: palette('surface', neutralShades, neutralRgb),
    background: grey['25'],
    /* The palette reverses in dark mode, so a single level can't serve both: `100`
       is the right hairline on light but collapses into the background on dark. */
    border: isDark ? grey['200'] : grey['100'],
    text: grey['950'],
    disabled: {
      text: grey['700'],
      border: grey['300'],
      background: grey['200'],
    },
    invalid: {
      text: p(crimsonFlameColor)['500'],
      border: p(crimsonFlameColor)['300'],
      background: p(crimsonFlameColor)['50'],
    },
  };
}

export const coral = createThemePart({
  scope: 'color',
  variables: [colorsTemplate],
  root: {
    values: getThemeColors(false),
  },
  dark: {
    values: getThemeColors(true),
  },
});

/**
 * Full nova color-token values for a given primary base color — the same output
 * that backs the built-in {@link coral} part, but with the primary palette
 * swapped. Includes the computed `*-contrast` and tonal `*-on-*` refs, so a
 * custom-primary theme built from this behaves identically to the default (e.g.
 * neutral `surface` buttons keep their correct auto-contrast text). Pass `null`
 * for the built-in ink default.
 *
 * Consumers that let users pick a primary color at runtime should build their
 * color part from this rather than re-deriving palette values, which drops the
 * contrast refs and breaks auto-contrast on custom colors.
 *
 * `surfaceHex` recolors the neutral family (the `surface` palette plus the
 * `background`/`border`/`text`/`disabled` tokens all derived from it), so
 * picking a neutral tints the whole chrome cohesively. Only the hue/saturation
 * of the passed color matter — the lightness ramp is fixed. Pass `null` for the
 * built-in slate default.
 */
export function novaColorValues(
  primaryHex: string | null,
  isDark: boolean,
  surfaceHex: string | null = null
) {
  const primaryShades = primaryHex == null ? inkColor : getColorPalette(primaryHex);
  const primaryRgb = primaryHex == null ? inkColorRgb : getColorPaletteRgb(primaryHex);
  const neutralShades = surfaceHex == null ? greyColor : getColorPalette(surfaceHex);
  const neutralRgb = surfaceHex == null ? greyColorRgb : getColorPaletteRgb(surfaceHex);
  return getThemeColors(isDark, primaryShades, primaryRgb, neutralShades, neutralRgb);
}

type ThemePaletteColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'surface';

type ThemePaletteShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';

type ThemePaletteTonal = '700-on-50' | '600-on-100';

type ThemePaletteVarName =
  | `color.${ThemePaletteColor}.${ThemePaletteShade}`
  | `color.${ThemePaletteColor}.${ThemePaletteShade}-contrast`
  | `color.${ThemePaletteColor}.${ThemePaletteTonal}`;

export function themedColors(
  c: (className: `color-${string}`) => string,
  v: (varName: ThemePaletteVarName) => string
): string {
  return (
    ['surface', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const
  )
    .map(
      color => `
      ${c(`color-${color}`)} {
        --theme-color-950: ${v(`color.${color}.950`)};
        --theme-color-900: ${v(`color.${color}.900`)};
        --theme-color-800: ${v(`color.${color}.800`)};
        --theme-color-700: ${v(`color.${color}.700`)};
        --theme-color-600: ${v(`color.${color}.600`)};
        --theme-color-500: ${v(`color.${color}.500`)};
        --theme-color-400: ${v(`color.${color}.400`)};
        --theme-color-300: ${v(`color.${color}.300`)};
        --theme-color-200: ${v(`color.${color}.200`)};
        --theme-color-100: ${v(`color.${color}.100`)};
        --theme-color-50: ${v(`color.${color}.50`)};
        --theme-color-950-contrast: ${v(`color.${color}.950-contrast`)};
        --theme-color-900-contrast: ${v(`color.${color}.900-contrast`)};
        --theme-color-800-contrast: ${v(`color.${color}.800-contrast`)};
        --theme-color-700-contrast: ${v(`color.${color}.700-contrast`)};
        --theme-color-600-contrast: ${v(`color.${color}.600-contrast`)};
        --theme-color-500-contrast: ${v(`color.${color}.500-contrast`)};
        --theme-color-400-contrast: ${v(`color.${color}.400-contrast`)};
        --theme-color-300-contrast: ${v(`color.${color}.300-contrast`)};
        --theme-color-200-contrast: ${v(`color.${color}.200-contrast`)};
        --theme-color-100-contrast: ${v(`color.${color}.100-contrast`)};
        --theme-color-50-contrast: ${v(`color.${color}.50-contrast`)};
        --theme-color-700-on-50: ${v(`color.${color}.700-on-50`)};
        --theme-color-600-on-100: ${v(`color.${color}.600-on-100`)};
      }
      `
    )
    .join('\n');
}
