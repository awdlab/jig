import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  base: baseStyles.table,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      /* ── Layout ──────────────────────────────────────────────────────── */

      ${c('root')} {
        gap: ${v('size.padding.md')};
        ${d('popover', 'root')} {
          font-weight: ${v('font.weight.normal')};
          cursor: default;
        }
      }
      ${c('head')} {
        background: ${v('color.background')};
      }
      ${c('head')} ${c('cell')} {
        font-weight: ${v('font.weight.semibold')};
        gap: ${v('size.padding.sm')};
      }
      ${c('body')} {
        --ngn-cell-bg-base: transparent;
      }
      ${c('cell')} {
        --ngn-cell-bg: var(--ngn-cell-bg-base);
        background: var(--ngn-cell-bg);
        border-bottom: 1px solid ${v('color.surface.200')};
        padding: 0 ${v('size.padding.md')};
        text-align: left;
        transition:
          background 0.1s ease,
          box-shadow 0.15s ease;
        &:not(:has(*)) {
          line-height: var(--ngn-table-row-height);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      ${c('cell-text')} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 0;
      }
      ${c('spacer')} {
        order: 1;
        flex-grow: 1;
      }
      ${c('root')}:not(${c('virtual')}) ${c('cell')} {
        padding: ${v('size.padding.md')};
      }
      ${c('striped')} ${c('even')} {
        --ngn-cell-bg-base: ${v('color.surface.100')};
      }
      ${c('root')} ${d('paginator', 'root')} {
        width: 90%;
        max-width: 800px;
        align-self: center;
      }

      /* ── Selection ───────────────────────────────────────────────────── */

      ${c('selection-column')} {
        padding: 0 ${v('size.padding.sm')};
      }
      ${c('selected-row')} ${c('cell')} {
        --ngn-cell-bg: color-mix(in srgb, ${v('color.primary.500')} 10%, var(--ngn-cell-bg-base));
      }
      ${c('selectable')} ${c('body')} ${c('row')}:hover ${c('cell')} {
        --ngn-cell-bg: ${v('color.surface.100')};
      }
      ${c('selectable')} ${c('body')} ${c('selected-row')}:hover ${c('cell')} {
        --ngn-cell-bg: color-mix(in srgb, ${v('color.primary.500')} 15%, var(--ngn-cell-bg-base));
      }
      ${c('focused-row')}:not(:has(${c('focused-row-cell')})) ${c('cell')}:first-child {
        box-shadow: inset 3px 0 0 ${v('color.primary.500')};
      }
      ${c('focused-row-cell')} {
        box-shadow: inset 3px 0 0 ${v('color.primary.500')};
      }

      /* ── Sorting ─────────────────────────────────────────────────────── */

      ${c('sortable-column')} {
        cursor: pointer;
        user-select: none;
      }
      ${c('sort-control')} {
        order: 3;
        color: ${v('color.surface.600')};
      }
      ${c('sorted-column')} ${c('sort-control')} {
        color: ${v('color.surface.800')};
      }

      /* ── Filtering ───────────────────────────────────────────────────── */

      ${c('filter-control')} {
        order: 2;
        color: ${v('color.surface.600')};
      }

      /* ── Grouping ────────────────────────────────────────────────────── */

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

      /* ── Reordering ──────────────────────────────────────────────────── */

      ${c('drag-source')} {
        opacity: 0.4;
        transition: opacity 0.15s;
      }
      ${c('drop-indicator')} {
        width: 3px;
        background: ${v('color.primary.500')};
        box-shadow: 0 0 8px ${v('color.primary.500')}40;
      }

      /* ── Sticky Columns ──────────────────────────────────────────────── */

      ${c('sticky-column')} {
        --ngn-cell-bg-base: ${v('color.background')};
      }
      ${c('striped')} ${c('even')} ${c('sticky-column')} {
        --ngn-cell-bg-base: ${v('color.surface.100')};
      }
      ${c('root')}${c('sticky-scrolled-left')} ${c('sticky-left-last')} {
        box-shadow: 4px 0 8px -4px rgba(0, 0, 0, 0.15);
      }
      ${c('root')}${c('sticky-scrolled-right')} ${c('sticky-right-first')} {
        box-shadow: -4px 0 8px -4px rgba(0, 0, 0, 0.15);
      }

      /* ── Resizing ────────────────────────────────────────────────────── */

      ${c('resize-handle')} {
        width: 4px;
        background: transparent;
        transition: background 0.15s;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 100%;
        }
        &:hover,
        &:active {
          background: ${v('color.surface.300')};
        }
      }
      ${c('resizing')} ${c('resize-handle')} {
        background: ${v('color.surface.400')};
      }
    `,
  },
});
