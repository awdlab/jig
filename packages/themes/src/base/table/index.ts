import { createThemePart, css } from '@ngneers/controls-themes/api';
import { sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  dependencies: [sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: block;
      }
      ${c('table')} {
        display: grid;
        height: 100%;
        grid-template-rows: var(--ngn-table-row-height) auto var(--ngn-table-row-height);
        grid-template-columns: repeat(var(--ngn-table-column-count), minmax(100px, 1fr));
        ${d('scroller', 'item')} {
          display: contents;
        }
        ${d('scroller', 'spacer')} {
          grid-column: 1 / -1;
        }
      }
      ${c('body')}${d('scroller')} {
        display: grid;
        grid-template-rows: repeat(auto, var(--ngn-table-row-height));
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
      }
      ${c('row')}, ${c('head')}, ${c('foot')} {
        display: contents;
      }
      ${c('cell')} {
        height: var(--ngn-table-row-height);
        --row-index: calc(var(--ngn-table-row-index) - var(--ngn-table-item-start-index));
        grid-row-start: var(--row-index);
        grid-column-start: var(--ngn-table-column-index);
      }
    `,
  },
});
