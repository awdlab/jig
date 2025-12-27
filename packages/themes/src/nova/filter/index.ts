import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { filterControlTemplate } from '@ngneers/controls-themes/templates/filter';

export const filterStyles = createThemePart({
  controlTemplate: filterControlTemplate,
  base: baseStyles.filter,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('icon')} {
        color: ${v('color.surface.500')};
        cursor: pointer;
      }
      ${c('popover-content')} {
        padding: ${v('size.padding.md')};
        gap: ${v('size.padding.md')};
      }
      ${c('rows')} {
        gap: ${v('size.padding.sm')};
      }
      ${c('row')} {
        align-items: center;
        gap: ${v('size.padding.sm')};
      }
      ${c('operator')} {
        flex: 1 1 180px;
      }
      ${c('value')} {
        flex: 2 1 240px;
      }
      ${c('row-actions')} {
        align-items: center;
      }
      ${c('actions')} {
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        gap: ${v('size.padding.sm')};
      }
      ${c('match')} {
        display: inline-flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
        flex: 0 1 auto;
      }

      ${c('match')} label {
        display: inline-flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }
    `,
  },
});
