import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  base: baseStyles.checkbox,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('input')} {
        cursor: pointer;
      }
      ${c('box')} {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid ${v('color.surface.400')};
        border-radius: ${v('size.rounded.sm')};
      }
    `,
  },
});
