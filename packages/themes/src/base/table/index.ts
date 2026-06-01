import { createThemePart, css } from '@ngneers/controls-themes/api';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

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
        grid-template-rows: var(--ngn-table-row-height) auto;
        &:has(${c('foot')}) {
          grid-template-rows: var(--ngn-table-row-height) auto var(--ngn-table-row-height);
        }
        grid-template-columns: repeat(var(--ngn-table-column-count), 1fr);
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
      ${c('body')}${d('scroller', 'root')} {
        display: grid;
        grid-template-rows: repeat(auto, var(--ngn-table-row-height));
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        overflow: visible;
        height: auto;
        > ${d('scroller', 'item')} {
          display: grid;
          grid-template-columns: subgrid;
          grid-column: 1 / -1;
        }
        &::before,
        &::after {
          grid-column: 1 / -1;
        }
      }
      ${c('row')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        --row-index: calc(var(--ngn-table-row-index) - var(--ngn-table-item-start-index));
        grid-row-start: var(--row-index);
      }
      ${c('head')} ${c('row')} {
        grid-row-start: 1;
      }
      ${c('foot')} {
        display: contents;
      }
      ${c('cell')} {
        height: var(--ngn-table-row-height);
        min-width: 0;
        grid-column-start: calc(
          var(--ngn-table-column-index) + var(--ngn-table-selection-offset, 0)
        );
      }
      /* Non-virtual rows have no fixed row height, so each cell would size to
         its own content. Stretch every cell to the row's grid track and center
         content vertically — this keeps all cells in a row the same height
         regardless of whether they hold text or an element. */
      ${c('root')}:not(${c('virtual')}) ${c('cell')} {
        height: auto;
        align-self: stretch;
        display: flex;
        align-items: center;
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
        height: var(--ngn-table-row-height);
        min-width: 0;
      }
      ${c('root')}:not(${c('virtual')}) ${c('group-header-cell')} {
        height: auto;
        line-height: var(--ngn-table-row-height);
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
    `,
  },
});
