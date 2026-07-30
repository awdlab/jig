import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  base: baseStyles.table,
  dependencies: [animationTemplate, colorsTemplate, fontTemplate, sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      /* ── Layout ──────────────────────────────────────────────────────── */

      ${c('root')} {
        gap: ${v('size.padding.md')};
        font-family: ${v('font.family')};
        font-size: ${v('font.size.sm')};
        color: ${v('color.foreground')};
        ${d('popover', 'root')} {
          font-weight: ${v('font.weight.normal')};
          cursor: default;
        }
      }
      ${c('head')} {
        background: ${v('color.background')};
      }
      ${c('head')} ${c('cell')} {
        color: ${v('color.muted.foreground')};
        font-weight: ${v('font.weight.medium')};
        gap: ${v('size.padding.sm')};
      }
      ${c('body')} {
        --ngn-cell-bg-base: ${v('color.background')};
      }
      ${c('cell')} {
        --ngn-cell-bg: var(--ngn-cell-bg-base);
        background: var(--ngn-cell-bg);
        /* shadcn table language: horizontal row borders only, no vertical borders */
        border-bottom: 1px solid ${v('color.border')};
        padding: 0 ${v('size.padding.lg')};
        text-align: left;
        transition-property: background, box-shadow;
        transition-duration: ${v('anim.time.snappyFade')};
        transition-timing-function: ${v('anim.ease.snappyFade')};
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
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
      }
      ${c('striped')} ${c('even')} {
        --ngn-cell-bg-base: color-mix(in srgb, ${v('color.muted.base')} 50%, transparent);
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
        --ngn-cell-bg: ${v('color.muted.base')};
      }
      ${c('selectable')} ${c('body')} ${c('row')}:hover ${c('cell')} {
        --ngn-cell-bg: color-mix(in srgb, ${v('color.muted.base')} 50%, var(--ngn-cell-bg-base));
      }
      ${c('selectable')} ${c('body')} ${c('selected-row')}:hover ${c('cell')} {
        /* shadcn keeps selected rows at bg-muted; hover does not restyle them */
        --ngn-cell-bg: ${v('color.muted.base')};
      }
      ${c('focused-row')}:not(:has(${c('focused-row-cell')})) ${c('cell')}:first-child {
        box-shadow: inset 3px 0 0 ${v('color.ring')};
      }
      ${c('focused-row-cell')},
      ${c('focused-row')} ${c('group-header-cell')} {
        box-shadow: inset 3px 0 0 ${v('color.ring')};
      }
      /* The grid is the tab stop; sortable header text is a button. */
      ${c('table')}:focus-visible,
      ${c('sortable-column')} ${c('cell-text')}:focus-visible {
        outline: 2px solid color-mix(in srgb, ${v('color.ring')} 50%, transparent);
        outline-offset: 2px;
      }

      /* ── Sorting ─────────────────────────────────────────────────────── */

      ${c('sortable-column')} {
        cursor: pointer;
        user-select: none;
        &:hover {
          color: ${v('color.foreground')};
        }
      }
      ${c('sort-control')} {
        order: 3;
        color: ${v('color.muted.foreground')};
      }
      ${c('sorted-column')} {
        color: ${v('color.foreground')};
        ${c('sort-control')} {
          color: ${v('color.foreground')};
        }
      }

      /* ── Filtering ───────────────────────────────────────────────────── */

      ${c('filter-control')} {
        order: 2;
        color: ${v('color.muted.foreground')};
      }

      /* ── Grouping ────────────────────────────────────────────────────── */

      ${c('group-header-cell')} {
        gap: ${v('size.padding.sm')};
        cursor: pointer;
        user-select: none;
        background: color-mix(in srgb, ${v('color.muted.base')} 50%, ${v('color.background')});
        font-weight: ${v('font.weight.medium')};
        padding: 0 ${v('size.padding.lg')};
        border-bottom: 1px solid ${v('color.border')};
        &:hover {
          background: ${v('color.muted.base')};
        }
      }
      ${c('root')}:not(${c('virtual')}) ${c('group-header-cell')} {
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
      }
      ${c('group-toggle')} {
        color: ${v('color.muted.foreground')};
        transition: transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('group-expanded')} ${c('group-toggle')} {
        transform: rotate(90deg);
      }

      /* ── Reordering ──────────────────────────────────────────────────── */

      ${c('drag-source')} {
        opacity: 0.4;
        transition: opacity ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('drop-indicator')} {
        width: 3px;
        background: ${v('color.primary.base')};
        box-shadow: 0 0 8px color-mix(in srgb, ${v('color.primary.base')} 25%, transparent);
      }

      /* ── Resizing ────────────────────────────────────────────────────── */

      ${c('resize-handle')} {
        width: 4px;
        background: transparent;
        transition: background ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
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
          background: ${v('color.border')};
        }
      }
      ${c('resizing')} ${c('resize-handle')} {
        background: ${v('color.ring')};
      }

      /* ── Sticky Columns ──────────────────────────────────────────── */

      ${c('sticky-start')}, ${c('sticky-end')}, ${c('selection-column')} {
        --ngn-cell-bg-base: ${v('color.background')};
      }
      ${c('head')} ${c('sticky-start')},
      ${c('head')} ${c('sticky-end')},
      ${c('head')} ${c('selection-column')} {
        background: ${v('color.background')};
      }
      /* Scroll shadows anchored to the sticky-column edges (a table-specific placement the generic
         scroll-shadow overlay can't do — it's disabled here via ngnScrollShadowUnstyled). The tint
         is the shared --ngn-scroll-shadow-color (dark mode included), so it stays identical to the
         generic overlay. */
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
    `,
  },
});
