import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export const inputMaskVariables = createVariableTemplate({
  scope: 'input-mask',
  variables: {
    maskTextColor: null,
  },
});

export const inputMaskStyles = createThemePart({
  controlTemplate: inputMaskControlTemplate,
  variables: [inputMaskVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    values: {
      maskTextColor: '{color.surface.400}',
    },
    css: ({ v, c }) => css`
      ${c()} {
        position: relative;
      }
      ${c('mask')} {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      ${c('mask-placeholder')} {
        opacity: 0;
      }
      ${c('mask-text')} {
        color: ${v('input-mask.maskTextColor')};
      }
    `,
  },
});
