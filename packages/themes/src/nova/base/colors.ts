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

export const coral = createThemePart({
  scope: 'color',
  variables: [colorsTemplate],
  root: {
    values: {
      primary: inkColor,
      secondary: mustardColor,
      accent: bubblegumColor,
      error: crimsonFlameColor,
      warning: solarMarigoldColor,
      info: electricSkyColor,
      success: forestVerdantColor,
      surface: greyColor,
      background: greyColor[50],
      border: greyColor[400],
      text: greyColor[950],
      disabled: {
        text: greyColor[700],
        border: greyColor[300],
        background: greyColor[200],
      },
      invalid: {
        text: crimsonFlameColor[500],
        border: crimsonFlameColor[400],
        background: crimsonFlameColor[50],
      },
    },
  },
});
