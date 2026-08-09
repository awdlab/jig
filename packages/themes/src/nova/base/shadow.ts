import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

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
      sm: '0 1px 2px rgba(30, 36, 54, .06)',
      md: '0 4px 12px -2px rgba(30, 36, 54, .14)',
      lg: '0 12px 32px -8px rgba(30, 36, 54, .22)',
      xl: '0 20px 48px -12px rgba(30, 36, 54, .28)',
    },
  },
  dark: {
    values: {
      sm: '0 1px 2px rgba(0, 0, 0, .5)',
      md: '0 6px 18px -4px rgba(0, 0, 0, .6)',
      lg: '0 16px 40px -10px rgba(0, 0, 0, .7)',
      xl: '0 24px 56px -14px rgba(0, 0, 0, .75)',
    },
  },
});
