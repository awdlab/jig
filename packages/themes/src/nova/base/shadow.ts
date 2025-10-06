import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const shadowTemplate = createVariableTemplate({
  scope: 'shadow',
  variables: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
});

export const shadow = createThemePart({
  scope: 'shadow',
  variables: [shadowTemplate],
  root: {
    values: {
      sm: '0px 3px 1px -2px rgba(0, 0, 0, .2), 0px 2px 2px 0px rgba(0, 0, 0, .14), 0px 1px 5px 0px rgba(0, 0, 0, .12)',
      md: '0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12)',
      lg: '0px 5px 5px -3px rgba(0, 0, 0, .2), 0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12)',
      xl: '0px 7px 8px -4px rgba(0, 0, 0, .2), 0px 12px 17px 2px rgba(0, 0, 0, .14), 0px 5px 22px 4px rgba(0, 0, 0, .12)',
    },
  },
});
