import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  base: baseStyles.table,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('table')} {
      }
      ${c('striped')} {
        ${c('even')} ${c('cell')} {
          background: ${v('color.surface.100')};
        }
      }
      ${c('cell')} {
        border-bottom: 1px solid ${v('color.surface.200')};
        padding: 0 ${v('size.padding.md')};
        text-align: left;
      }
      ${c('head')} ${c('cell')} {
        font-weight: ${v('font.weight.semibold')};
      }
      ${c('sortable-column')} {
        cursor: pointer;
        user-select: none;
        justify-content: space-between;
        gap: ${v('size.padding.sm')};
        ${d('icon')} {
          grid-column: 2 / span 1;
          color: ${v('color.surface.600')};
        }
        &${c('sorted-column')} ${d('icon')} {
          color: ${v('color.surface.800')};
        }
      }
    `,
  },
});
