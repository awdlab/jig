import { createThemePart, css } from '@awdlab/jig-themes/api';
import { tableControlTemplate } from '@awdlab/jig-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      /* ── Layout ──────────────────────────────────────────────────────── */

      ${c('root')} {
        display: flex;
        flex-direction: column;
      }
      ${c('table')} {
        display: grid;
        grid-template-rows: var(--awd-table-row-height) auto;
        &:has(${c('foot')}) {
          grid-template-rows: var(--awd-table-row-height) auto var(--awd-table-row-height);
        }
        grid-template-columns: repeat(var(--awd-table-column-count), 1fr);
        align-content: baseline;
        position: relative;
        overflow: auto;
        flex: 1;
        min-height: 0;
      }
      ${c('head')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        position: sticky;
        top: 0;
        z-index: 2;
      }
      ${c('head')} ${c('cell')} {
        display: flex;
        align-items: center;
        grid-row: 1;
      }
      ${c('body')}${d('scroller')} {
        display: grid;
        /* auto tracks let the ::before/::after padding spacers take their true
           height (0 at top, full remainder below) so scrollHeight is correct;
           data rows are pinned to one row height by the virtual row rule below. */
        grid-auto-rows: auto;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        overflow: visible;
        height: auto;
        &::before,
        &::after {
          grid-column: 1 / -1;
        }
      }
      /* Top-level rule: the scroller marker sits on the tbody itself, so nesting
         this under the block above would never match. */
      ${d('scroller', 'item')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
      }
      ${c('row')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        --row-index: calc(var(--awd-table-row-index) - var(--awd-table-item-start-index));
        grid-row-start: var(--row-index);
      }
      ${c('head')} ${c('row')} {
        grid-row-start: 1;
      }
      /* Pin virtual data rows to one row height so tracks stay uniform for the
         scroll math. Non-virtual leaves the var unset, resolving to auto. */
      ${c('root')}${c('virtual')} ${c('body')} ${c('row')} {
        height: var(--awd-table-row-height);
      }
      ${c('foot')} {
        display: contents;
      }
      ${c('cell')} {
        height: var(--awd-table-row-height);
        min-width: 0;
        grid-column-start: calc(
          var(--awd-table-column-index) + var(--awd-table-selection-offset, 0)
        );
        /* Pin cells to the row's single track; a reordered cell would otherwise
           trip grid auto-placement onto an implicit extra row. */
        grid-row-start: 1;
      }
      /* Non-virtual rows have no fixed height — stretch cells to the track and
         center content so all cells in a row match height. */
      ${c('root')}:not(${c('virtual')}) ${c('cell')} {
        height: auto;
        align-self: stretch;
        display: flex;
        align-items: center;
      }
      /* Clip virtual cells so a too-tall child can't paint over rows below.
         Sticky-edge/selection cells are excluded — their scroll-shadow ::after
         sits outside the cell box. */
      ${c('root')}${c('virtual')} ${c('cell')}:not(${c('sticky-start-edge')}):not(${c(
        'sticky-end-edge'
      )}):not(${c('selection-column')}) {
        overflow: hidden;
      }

      /* ── Selection ───────────────────────────────────────────────────── */

      ${c('selection-column')} {
        grid-column-start: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        min-width: fit-content;
      }
      ${c('selectable')} ${c('body')} ${c('row')} {
        cursor: pointer;
      }

      /* ── Sorting ─────────────────────────────────────────────────────── */

      ${c('sortable-column')} {
        ${c('sort-control')} {
          visibility: hidden;
        }
        &:hover ${c('sort-control')}, &${c('sorted-column')} ${c('sort-control')} {
          visibility: visible;
        }
      }

      /* ── Grouping ────────────────────────────────────────────────────── */

      ${c('group-header-row')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
      }
      ${c('group-header-cell')} {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        height: var(--awd-table-row-height);
        min-width: 0;
      }
      ${c('root')}:not(${c('virtual')}) ${c('group-header-cell')} {
        height: auto;
        line-height: var(--awd-table-row-height);
      }
      ${c('group-toggle')} {
        flex-shrink: 0;
      }

      /* ── Reordering ──────────────────────────────────────────────────── */

      ${c('root')}${c('reorderable')} ${c('head')} ${c('cell')} {
        cursor: grab;
        user-select: none;
      }
      ${c('root')}${c('reordering')} ${c('head')} ${c('cell')} {
        cursor: grabbing;
      }
      ${c('drop-indicator')} {
        position: absolute;
        pointer-events: none;
        z-index: 3;
      }

      /* ── Resizing ────────────────────────────────────────────────────── */

      ${c('head')} ${c('cell')}${c('resizable')} {
        position: relative;
      }
      ${c('resize-handle')} {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        cursor: col-resize;
        z-index: 1;
        touch-action: none;
      }

      /* ── Sticky Columns ──────────────────────────────────────────── */

      ${c('sticky-start')}, ${c('sticky-end')} {
        z-index: 1;
      }
      ${c('head')} ${c('sticky-start')},
      ${c('head')} ${c('sticky-end')} {
        z-index: 3;
      }
      ${c('selection-column')} {
        position: sticky;
        left: 0;
        z-index: 1;
      }
      ${c('head')} ${c('selection-column')} {
        z-index: 3;
      }

      /* ── Row Actions (inline) ────────────────────────────────────────── */

      ${c('row-actions')} {
        grid-row: 1;
        grid-column: 1 / -1;
        justify-self: end;
        align-self: stretch;
        display: flex;
        align-items: center;
        position: sticky;
        right: 0;
        z-index: 2;
      }
      /* Hidden-until-hover only applies when the bar is mounted inline inside
         a table row; a standalone bar (outside ${c('row')}) stays visible. */
      ${c('row')} ${c('row-actions')} {
        visibility: hidden;
        pointer-events: none;
      }
      /* The current row shows its bar only while the grid has focus — otherwise a
         blurred table would keep one row's bar hanging open. */
      ${c('row')}:hover ${c('row-actions')},
      ${c('row')}${c('active-row')} ${c('row-actions')},
      ${c('table')}:focus-within ${c('row')}${c('focused-row')} ${c('row-actions')},
      ${c('row')}:focus-within ${c('row-actions')} {
        visibility: visible;
        pointer-events: auto;
      }

      /* ── Skeleton loading rows ───────────────────────────────────────── */

      /* Single ghost bar spanning all columns. Height falls back to line-height
         + padding when --awd-table-row-height is absent (non-virtual). */
      ${c('skeleton-row')} {
        box-sizing: border-box;
        display: flex;
        align-items: stretch;
        grid-column: 1 / -1;
        height: var(--awd-table-row-height, calc(1lh + 1rem));
        padding: 0.25rem 0.5rem;
      }
      ${c('skeleton-cell')} {
        flex: 1;
        border-radius: 0.25rem;
        background: currentColor;
        opacity: 0.1;
      }

      /* ── Error row ───────────────────────────────────────────────────── */

      ${c('error-row')} {
        grid-column: 1 / -1;
      }
      ${c('error-row')} td {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        padding: var(--awd-table-row-height) 0;
      }
    `,
  },
});
