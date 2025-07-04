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
} from '@ngneers/controls-themes/nova/colors';

export const colorsTemplate = createVariableTemplate({
  scope: 'color',
  variables: {
    ...repeatVariables(['primary', 'secondary', 'accent', 'error', 'warning', 'info', 'success'], {
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
    }),
    background: null,
    text: null,
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
      background: '#fcf3f6',
      text: '#12070c',
    },
  },
});
