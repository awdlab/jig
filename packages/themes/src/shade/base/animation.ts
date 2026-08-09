import { createThemePart, createVariableTemplate } from '@awdlab/jig-themes/api';

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
        snappyFade: '0.15s',
      },
      ease: {
        fade: 'ease-out',
        snappyFade: 'ease-out',
      },
    },
  },
});
