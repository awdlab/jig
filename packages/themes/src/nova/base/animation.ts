import { createThemePart, createVariableTemplate } from '@ngneers/controls-themes/api';

export const animationTemplate = createVariableTemplate({
  scope: 'anim',
  variables: {
    time: {
      fade: null,
      snappyFade: null,
    },
    ease: {
      fade: null,
      snappyFade: null,
    },
  },
});

export const animation = createThemePart({
  scope: 'anim',
  variables: [animationTemplate],
  root: {
    values: {
      time: {
        fade: '0.2s',
        snappyFade: '0.1s',
      },
      ease: {
        fade: 'ease',
        snappyFade: 'ease-out',
      },
    },
  },
});
