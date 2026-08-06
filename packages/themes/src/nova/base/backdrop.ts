import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const backdropTemplate = createVariableTemplate({
  scope: 'backdrop',
  variables: {
    blur: {
      sm: null,
      md: null,
      lg: null,
    },
    scrim: null,
  },
});

// Scrim + blur behind modal surfaces (dialog, drawer, command palette). `blur.*` are complete
// `backdrop-filter` values; the slight desaturation pushes the page behind further back. The
// scrim is neutral black in both schemes, heavier in dark mode where the tint has less contrast.
export const backdrop = createThemePart({
  scope: 'backdrop',
  variables: [backdropTemplate],
  root: {
    values: {
      blur: {
        sm: 'blur(1.5px) saturate(.75)',
        md: 'blur(3px) saturate(.75)',
        lg: 'blur(6px) saturate(.75)',
      },
      scrim: 'rgba(0, 0, 0, .1)',
    },
  },
  dark: {
    values: {
      scrim: 'rgba(0, 0, 0, .25)',
    },
  },
});
