import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export const inputMaskStyles = createThemePart({
  controlTemplate: inputMaskControlTemplate,
  base: baseStyles.inputMask,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('mask-text')} {
        color: ${v('color.surface.400')};
      }
      ${c('root')}:has(${d('input', 'root')}${d('input-field', 'root')}) {
        ${c('mask')} {
          /* 1px for the top & left border of the input field */
          top: calc(1px + ${v('size.padding.sm')});
          left: calc(1px + ${v('size.padding.md')});
        }
      }
    `,
  },
});
