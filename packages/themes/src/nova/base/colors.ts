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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPalette: any = {};
  keys.forEach((key, i) => {
    newPalette[key] = values[i];
  });
  return newPalette;
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
