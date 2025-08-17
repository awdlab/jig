import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const animationTemplate = createVariableTemplate({
  scope: 'animation',
  variables: {
    duration: {
      fade: null,
    },
    easing: {
      fade: null,
    },
  },
});

export const animation = createThemePart({
  scope: 'animation',
  variables: [animationTemplate],
  root: {
    values: {
      duration: {
        fade: '0.2s',
      },
      easing: {
        fade: 'ease-in-out',
      },
    },
  },
});
