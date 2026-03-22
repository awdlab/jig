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
        height: 100%;
        grid-template-rows: var(--ngn-table-row-height) auto;
        &:has(${c('foot')}) {
          grid-template-rows: var(--ngn-table-row-height) auto var(--ngn-table-row-height);
        }
        grid-template-columns: repeat(var(--ngn-table-column-count), 1fr);
        align-content: baseline;
      }
      ${c('body')}${d('scroller', 'root')} {
        display: grid;
        grid-template-rows: repeat(auto, var(--ngn-table-row-height));
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        > ${d('scroller', 'item')} {
          display: contents;
        }
        &::before,
        &::after {
          grid-column: 1 / -1;
        }
      }
      ${c('row')}, ${c('head')}, ${c('foot')} {
        display: contents;
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
        grid-column-start: var(--ngn-table-column-index);
        &:not(:has(*)) {
          line-height: var(--ngn-table-row-height);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      ${c('head')} ${c('cell')} {
        display: flex;
        align-items: center;
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
      ${c('resize-handle')} {
        position: absolute;
        top: 0;
        right: -2px;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        z-index: 1;
        touch-action: none;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -4px;
          width: 12px;
          height: 100%;
        }
      }
    `,
  },
});
