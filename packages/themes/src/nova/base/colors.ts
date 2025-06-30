import {
  createThemePart,
  createThemePartTemplate,
  ThemePartTemplate,
} from '@ngneers/controls-themes/api';
import {
  bubblegumColor,
  coralColor,
  crimsonFlameColor,
  electricSkyColor,
  forestVerdantColor,
  mustardColor,
  solarMarigoldColor,
} from '@ngneers/controls-themes/nova/colors';

const colorTemplate = {
  default: null,
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

export const colorsTemplate = createThemePartTemplate({
  scope: 'color',
  variables: {
    primary: colorTemplate,
    secondary: colorTemplate,
    accent: colorTemplate,
    error: colorTemplate,
    warning: colorTemplate,
    info: colorTemplate,
    success: colorTemplate,
    background: null,
    text: null,
  },
  classNames: [],
});

export type BaseColors = {
  primary: `#${string}`;
  secondary: `#${string}`;
  error: `#${string}`;
  warning: `#${string}`;
  info: `#${string}`;
  success: `#${string}`;
};

export const coral = createThemePart({
  template: colorsTemplate,
  root: {
    variables: {
      primary: coralColor,
      secondary: mustardColor,
      accent: bubblegumColor,
      error: crimsonFlameColor,
      warning: solarMarigoldColor,
      info: electricSkyColor,
      success: forestVerdantColor,
      background: '#fcf3f6',
      text: '#12070c',
    },
  },
});
