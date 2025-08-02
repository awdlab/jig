import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

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
    },
    gap: {
      sm: null,
      md: null,
      lg: null,
    },
  },
});

export const sizes = createThemePart({
  scope: 'size',
  variables: [sizesTemplate],
  root: {
    values: {
      rounded: {
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        full: '50%',
      },
      padding: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
      },
    },
  },
});
