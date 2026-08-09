import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

export const sizesTemplate = createVariableTemplate({
  scope: 'size',
  variables: {
    rounded: {
      sm: null,
      md: null,
      lg: null,
      full: null,
    },
    padding: {
      sm: null,
      md: null,
      lg: null,
      xl: null,
    },
  },
});

export const sizes = createThemePart({
  scope: 'size',
  variables: [sizesTemplate],
  root: {
    values: {
      rounded: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
        full: '9999px',
      },
      padding: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
});
