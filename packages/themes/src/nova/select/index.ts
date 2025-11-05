import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';

export const selectStyles = createThemePart({
  controlTemplate: selectControlTemplate,
  base: baseStyles.select,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        --icon-size: 14px;
      }
      ${c('input')} ${d('input-field')} {
        cursor: pointer;
        gap: ${v('size.padding.sm')};
      }
      ${c('icon')} {
        color: ${v('color.surface.500')};
        cursor: pointer;
      }
      ${c('filter-icon')} {
        color: ${v('color.surface.500')};
      }
      ${c('input-editable')} ${d('input-field')} {
        cursor: text;
      }
      ${c('filter')} {
        margin: ${v('size.padding.md')};
      }
    `,
  },
});
