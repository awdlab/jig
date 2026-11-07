import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

export const backdropTemplate = createVariableTemplate({
  scope: 'backdrop',
  variables: {
    scrim: null,
  },
});

/** Scrim behind modal surfaces (dialog, drawer); MD3 doesn't blur, so it's a flat tint. */
export const backdrop = createThemePart({
  scope: 'backdrop',
  variables: [backdropTemplate],
  root: {
    values: {
      scrim: 'rgba(0, 0, 0, .1)',
    },
  },
  dark: {
    values: {
      scrim: 'rgba(0, 0, 0, .25)',
    },
  },
});
