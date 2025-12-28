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
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: ${v('size.padding.sm')};
      }
      ${c('match')} {
        width: 100%;
        min-width: 0;
      }

      ${c('footer')} {
        display: flex;
        gap: ${v('size.padding.sm')};
        width: 100%;
      }
      ${c('footer')} button {
        flex: 1 1 0;
      }
    `,
  },
});
