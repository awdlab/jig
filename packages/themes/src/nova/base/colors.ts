import {
  createThemePart,
  createVariableTemplate,
  repeatVariables,
} from '@ngneers/controls-themes/api';
import {
  bubblegumColor,
  coralColor,
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
      }
    ),
    background: null,
    text: null,
    disabled: {
      text: null,
      background: null,
    },
    invalid: {
      text: null,
      background: null,
    },
  },
});

export const coral = createThemePart({
  scope: 'color',
  variables: [colorsTemplate],
  root: {
    values: {
      primary: coralColor,
      secondary: mustardColor,
      accent: bubblegumColor,
      error: crimsonFlameColor,
      warning: solarMarigoldColor,
      info: electricSkyColor,
      success: forestVerdantColor,
      surface: greyColor,
      background: '#ffffff',
      text: '#12070c',
      disabled: {
        text: greyColor[700],
        background: greyColor[200],
      },
      invalid: {
        text: crimsonFlameColor[500],
        background: crimsonFlameColor[50],
      },
    },
  },
});
