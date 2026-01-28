import {
  createThemePart,
  createVariableTemplate,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import {
  bubblegumColor,
  inkColor,
  crimsonFlameColor,
  electricSkyColor,
  forestVerdantColor,
  mustardColor,
  solarMarigoldColor,
  greyColor,
} from '@ngneers/controls-themes/nova/colors';

export const colorsTemplate = createVariableTemplate({
  scope: 'color',
  variables: {
    ...repeatVariables(
      ['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success', 'surface'],
      {
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
      }
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

function reversePalette<T extends Record<string, string>>(palette: T): T {
  const keys = Object.keys(palette);
  const values = Object.values(palette).reverse();

  const newPalette: Record<string, string> = {};
  keys.forEach((key, i) => {
    const value = values[i];
    if (value != null) {
      newPalette[key] = value;
    }
  });

  return newPalette as T;
}

function getThemeColors(isDark: boolean) {
  const p = (palette: typeof inkColor) => (isDark ? reversePalette(palette) : palette);

  return {
    primary: p(inkColor),
    secondary: p(mustardColor),
    accent: p(bubblegumColor),
    error: p(crimsonFlameColor),
    warning: p(solarMarigoldColor),
    info: p(electricSkyColor),
    success: p(forestVerdantColor),
    surface: p(greyColor),
    background: p(greyColor)[50],
    border: p(greyColor)[400],
    text: p(greyColor)[950],
    disabled: {
      text: p(greyColor)[700],
      border: p(greyColor)[300],
      background: p(greyColor)[200],
    },
    invalid: {
      text: p(crimsonFlameColor)[500],
      border: p(crimsonFlameColor)[400],
      background: p(crimsonFlameColor)[50],
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

type ThemePaletteVarName = `color.${ThemePaletteColor}.${ThemePaletteShade}`;

export function themedColors(
  c: (className?: `color-${string}`) => string,
  v: (varName: ThemePaletteVarName) => string
): string {
  return (
    ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error', 'surface'] as const
  )
    .map(
      color => `
      ${color ? c(`color-${color}`) : c()} {
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
      }
      `
    )
    .join('\n');
}
