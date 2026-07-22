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
      // MD elevation 2/4/8, with xl set to the MD modal/overlay elevation (24).
      sm: '0px 3px 1px -2px rgba(0, 0, 0, .2), 0px 2px 2px 0px rgba(0, 0, 0, .14), 0px 1px 5px 0px rgba(0, 0, 0, .12)',
      md: '0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12)',
      lg: '0px 5px 5px -3px rgba(0, 0, 0, .2), 0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12)',
      xl: '0px 11px 15px -7px rgba(0, 0, 0, .2), 0px 24px 38px 3px rgba(0, 0, 0, .14), 0px 9px 46px 8px rgba(0, 0, 0, .12)',
    },
  },
});
