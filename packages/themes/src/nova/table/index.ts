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
      ${c('root')} {
        gap: ${v('size.padding.md')};
        ${d('popover', 'root')} {
          font-weight: ${v('font.weight.normal')};
          cursor: default;
        }
      }
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
        gap: ${v('size.padding.sm')};
      }
      ${c('cell-text')} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }
      ${c('root')}:not(${c('virtual')}) ${c('cell')} {
        padding: ${v('size.padding.md')};
      }
      ${c('sortable-column')} {
        cursor: pointer;
        user-select: none;
      }
      ${c('spacer')} {
        order: 1;
        flex-grow: 1;
      }
      ${c('filter-control')} {
        order: 2;
        color: ${v('color.surface.600')};
      }
      ${c('sort-control')} {
        order: 3;
        color: ${v('color.surface.600')};
      }
      ${c('sorted-column')} ${c('sort-control')} {
        color: ${v('color.surface.800')};
      }
      ${c('group-header-cell')} {
        gap: ${v('size.padding.sm')};
        cursor: pointer;
        user-select: none;
        background: ${v('color.surface.50')};
        font-weight: ${v('font.weight.semibold')};
        padding: 0 ${v('size.padding.md')};
        border-bottom: 1px solid ${v('color.surface.200')};
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
      ${c('root')}:not(${c('virtual')}) ${c('group-header-cell')} {
        padding: ${v('size.padding.md')};
      }
      ${c('group-toggle')} {
        color: ${v('color.surface.600')};
        transition: transform 0.15s;
      }
      ${c('group-expanded')} ${c('group-toggle')} {
        transform: rotate(90deg);
      }
      ${c('drop-indicator')} {
        background: ${v('color.primary.500')};
        box-shadow: 0 0 8px ${v('color.primary.500')}40;
      }
      ${c('drag-source')} {
        transition: opacity 0.15s;
      }
      ${c('resize-handle')} {
        background: transparent;
        transition: background 0.15s;
        &:hover,
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('resizing')} ${c('resize-handle')} {
        background: ${v('color.surface.400')};
      }
      ${c('root')} ${d('paginator', 'root')} {
        width: 90%;
        max-width: 800px;
        align-self: center;
      }
    `,
  },
});
