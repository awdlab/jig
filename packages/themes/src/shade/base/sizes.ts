import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

/** Single radius design token the whole rounded scale derives from. */
export const RADIUS = '0.625rem';

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
        sm: `calc(${RADIUS} - 4px)`,
        md: `calc(${RADIUS} - 2px)`,
        lg: RADIUS,
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
