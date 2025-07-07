import { createThemePart, createVariableTemplate, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { textFieldControlTemplate } from '@ngneers/controls-themes/templates/text-field';

export const textFieldVariables = createVariableTemplate({
  scope: 'text-field',
  variables: {
    fontSize: null,
    fontWeight: null,
    fontFamily: null,
    color: null,
    maskTextColor: null,
  },
});

export const textFieldStyles = createThemePart({
  controlTemplate: textFieldControlTemplate,
  variables: [textFieldVariables],
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    values: {
      maskTextColor: '{color.surface.400}',
    },
    css: ({ v, c }) => css`
      ${c()} {
        position: relative;
      }
      ${c('input')} {
        font-size: ${v('text-field.fontSize')};
        font-weight: ${v('text-field.fontWeight')};
        font-family: ${v('text-field.fontFamily')};
        color: ${v('text-field.color')};
        width: 100%;
        background: transparent;
        border: none;
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
        color: ${v('text-field.maskTextColor')};
      }
    `,
  },
});
