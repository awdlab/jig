import { createThemePart, css } from '@ngneers/controls-themes/api';
import { sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  dependencies: [sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
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
      ${c('body')}${d('scroller', 'root')} {
        display: grid;
        grid-template-rows: repeat(auto, var(--ngn-table-row-height));
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        overflow: visible;
        height: auto;
        > ${d('scroller', 'item')} {
          display: contents;
        }
        &::before,
        &::after {
          grid-column: 1 / -1;
        }
      }
      ${c('row')}, ${c('foot')} {
        display: contents;
      }
      ${c('head')} {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        position: sticky;
        top: 0;
        z-index: 2;
      }
      ${c('root')}:not(${c('virtual')}) {
        ${c('cell')} {
          &:not(:has(*)) {
            height: min-content;
          }
          &:has(*) {
            height: 100%;
          }
        }
      }
      ${c('cell')} {
        height: var(--ngn-table-row-height);
        min-width: 0;
        --row-index: calc(var(--ngn-table-row-index) - var(--ngn-table-item-start-index));
        grid-row-start: var(--row-index);
        grid-column-start: calc(
          var(--ngn-table-column-index) + var(--ngn-table-selection-offset, 0)
        );
        &:not(:has(*)) {
          line-height: var(--ngn-table-row-height);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      ${c('selection-column')} {
        grid-column-start: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        min-width: 0;
      }
      ${c('selection-column')} ${d('checkbox', 'root')} *,
      ${c('selection-column')} ${d('checkbox', 'root')} *::before,
      ${c('selection-column')} ${d('checkbox', 'root')} *::after {
        animation: none !important;
      }
      ${c('head')} ${c('cell')} {
        display: flex;
        align-items: center;
        grid-row: 1;
      }
      ${c('selectable')} ${c('body')} ${c('row')} {
        cursor: pointer;
      }
      ${c('sortable-column')} {
        ${c('sort-control')} {
          visibility: hidden;
        }
        &:hover ${c('sort-control')}, &${c('sorted-column')} ${c('sort-control')} {
          visibility: visible;
        }
      }
      ${c('head')} ${c('cell')}${c('resizable')} {
        position: relative;
      }
      ${c('group-header-row')} {
        display: contents;
      }
      ${c('group-header-cell')} {
        --row-index: calc(var(--ngn-table-row-index) - var(--ngn-table-item-start-index));
        grid-row-start: var(--row-index);
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
      ${c('root')}${c('reorderable')} ${c('head')} ${c('cell')} {
        cursor: grab;
        user-select: none;
      }
      ${c('root')}${c('reordering')} ${c('head')} ${c('cell')} {
        cursor: grabbing;
      }
      ${c('drag-source')} {
        opacity: 0.4;
      }
      ${c('drop-indicator')} {
        position: absolute;
        width: 3px;
        pointer-events: none;
        z-index: 3;
      }
      ${c('resize-handle')} {
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        z-index: 1;
        touch-action: none;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 100%;
        }
      }
    `,
  },
});
