import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const fontTemplate = createVariableTemplate({
  scope: 'font',
  variables: {
    family: null,
    weight: {
      normal: null,
      medium: null,
      semibold: null,
      bold: null,
      extrabold: null,
      black: null,
    },
    size: {
      xs: null,
      sm: null,
      md: null,
      lg: null,
      xl: null,
      '2xl': null,
    },
  },
});

export const font = createThemePart({
  scope: 'font',
  variables: [fontTemplate],
  root: {
    values: {
      family: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      weight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      size: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
});
