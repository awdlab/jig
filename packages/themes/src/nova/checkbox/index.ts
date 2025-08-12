import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('')} {
        display: inline-flex;
        user-select: none;
        align-items: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
      }
      ${c('input')} {
        opacity: 0;
        position: absolute;
        inset: 0;
        cursor: pointer;
        margin: 0;
      }
      ${c('box')} {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid ${v('color.surface.400')};
        border-radius: ${v('size.rounded.sm')};
      }
      ${c('box-icon')} {
        display: block;
      }
    `,
  },
});
