import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  controlRing,
  fontTemplate,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  base: baseStyles.table,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, shadowTemplate, ringTemplate],
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
      /* The grid is the bordered card; the root also holds the paginator, which stays outside it. */
      ${c('table')} {
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
      }
      /* The grid itself is the tab stop and moves the current row with the arrow keys. */
      ${c('table')}:focus-visible {
        outline: 3px solid ${controlRing(v)};
        outline-offset: 0;
      }
      ${c('head')} {
        background: ${v('color.surface.50')};
      }
      ${c('head')} ${c('cell')} {
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.sm')};
        color: ${v('color.surface.600')};
        gap: ${v('size.padding.sm')};
        border-bottom: 1px solid ${v('color.border')};
      }
      ${c('body')} {
        /* Rows get the normal surface background by default (not transparent),
           so sticky columns and the inline row-actions bar sit on a solid,
           consistent surface rather than showing through to whatever is behind. */
        --ngn-cell-bg-base: ${v('color.background')};
      }
      ${c('cell')} {
        --ngn-cell-bg: var(--ngn-cell-bg-base);
        background: var(--ngn-cell-bg);
        border-bottom: 1px solid ${v('color.border')};
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
      ${c('root')} ${d('paginator')} {
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
        --ngn-cell-bg: ${v('color.surface.50')};
      }
      ${c('selectable')} ${c('body')} ${c('selected-row')}:hover ${c('cell')} {
        --ngn-cell-bg: color-mix(in srgb, ${v('color.primary.500')} 15%, var(--ngn-cell-bg-base));
      }
      ${c('focused-row')}:not(:has(${c('focused-row-cell')})) ${c('cell')}:first-child {
        box-shadow: inset 3px 0 0 ${v('color.primary.500')};
      }
      ${c('focused-row-cell')},
      ${c('focused-row')} ${c('group-header-cell')} {
        box-shadow: inset 3px 0 0 ${v('color.primary.500')};
      }

      /* ── Sorting ─────────────────────────────────────────────────────── */

      ${c('sortable-column')} {
        cursor: pointer;
        user-select: none;
        /* The text span is the sort button (role=button, tabbable). */
        ${c('cell-text')}:focus-visible {
          outline: 2px solid ${controlRing(v)};
          outline-offset: 2px;
          border-radius: ${v('size.rounded.sm')};
        }
      }
      ${c('sort-control')} {
        order: 3;
        color: ${v('color.surface.700')};
      }
      ${c('sorted-column')} ${c('sort-control')} {
        color: ${v('color.surface.800')};
      }

      /* ── Filtering ───────────────────────────────────────────────────── */

      ${c('filter-control')} {
        order: 2;
        color: ${v('color.surface.700')};
      }

      /* ── Grouping ────────────────────────────────────────────────────── */

      ${c('group-header-cell')} {
        gap: ${v('size.padding.sm')};
        cursor: pointer;
        user-select: none;
        background: ${v('color.surface.50')};
        font-weight: ${v('font.weight.semibold')};
        padding: 0 ${v('size.padding.md')};
        border-bottom: 1px solid ${v('color.border')};
        &:hover {
          background: ${v('color.surface.100')};
        }
      }
      ${c('root')}:not(${c('virtual')}) ${c('group-header-cell')} {
        padding: ${v('size.padding.md')};
      }
      ${c('group-toggle')} {
        color: ${v('color.surface.700')};
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
        /* nothing hovers on touch, so the grip needs to be visible to be findable at all —
           drawn as a pill on ::after so the ::before hit area keeps its full height */
        @media (hover: none) {
          &::after {
            content: '';
            position: absolute;
            inset: 25% 0;
            border-radius: 999px;
            background: ${v('color.surface.300')};
          }
        }
      }
      ${c('resizing')} ${c('resize-handle')} {
        background: ${v('color.surface.400')};
      }

      /* ── Sticky Columns ──────────────────────────────────────────── */

      ${c('sticky-start')}, ${c('sticky-end')}, ${c('selection-column')} {
        --ngn-cell-bg-base: ${v('color.background')};
      }
      ${c('head')} ${c('sticky-start')},
      ${c('head')} ${c('sticky-end')},
      ${c('head')} ${c('selection-column')} {
        background: ${v('color.surface.50')};
      }
      /* Scroll shadows anchored to the sticky-column edges (a table-specific placement the generic
         scroll-shadow overlay can't do — it's disabled here via ngnScrollShadowUnstyled). The tint
         is the shared --ngn-scroll-shadow-color so it stays identical to the generic overlay. */
      ${c('sticky-start-edge')},
      ${c('sticky-end-edge')},
      ${c('selection-column')} {
        overflow: visible;
      }
      ${d('scroll-shadow', 'scrolled-start')} ${c('sticky-start-edge')}::after,
      ${d('scroll-shadow', 'scrolled-start')} ${c('selection-column')}::after,
      ${d('scroll-shadow', 'scrolled-end')} ${c('sticky-end-edge')}::after {
        content: '';
        position: absolute;
        top: 0;
        height: 100%;
        width: 12px;
        pointer-events: none;
      }
      ${d('scroll-shadow', 'scrolled-start')} ${c('sticky-start-edge')}::after,
      ${d('scroll-shadow', 'scrolled-start')} ${c('selection-column')}::after {
        left: 100%;
        background: linear-gradient(to right, var(--ngn-scroll-shadow-color), transparent);
      }
      ${d('scroll-shadow', 'scrolled-end')} ${c('sticky-end-edge')}::after {
        right: 100%;
        background: linear-gradient(to left, var(--ngn-scroll-shadow-color), transparent);
      }

      /* ── Row Actions (inline) ────────────────────────────────────────── */

      ${c('row-actions')} {
        gap: ${v('size.padding.sm')};
        padding: 0 ${v('size.padding.sm')};
        background: ${v('color.background')};
        box-shadow: -8px 0 8px -4px ${v('color.background')};
        /* The bar stretches the full row height and would otherwise paint over
           the cell's bottom border. Redraw the same 1px line on the bar so the
           row separator stays continuous underneath the actions. */
        border-bottom: 1px solid ${v('color.border')};
      }

      /* ── Skeleton loading rows ───────────────────────────────────────── */

      /* Base theme owns layout/height; nova adds token padding + a shimmer. */
      ${c('skeleton-row')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
      }
      ${c('skeleton-cell')} {
        opacity: 1;
        background: linear-gradient(
          90deg,
          ${v('color.surface.200')} 25%,
          ${v('color.surface.100')} 37%,
          ${v('color.surface.200')} 63%
        );
        background-size: 400% 100%;
        animation: ${c('skeleton-cell', 'animation')} 1.4s ease infinite;
      }
      @keyframes ${c('skeleton-cell', 'animation')} {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }

      /* ── Error row ───────────────────────────────────────────────────── */

      ${c('error-row')} {
        color: ${v('color.error.500')};
      }
    `,
  },
});
