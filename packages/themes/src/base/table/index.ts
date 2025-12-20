import { createThemePart, css } from '@ngneers/controls-themes/api';
import { sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { tableControlTemplate } from '@ngneers/controls-themes/templates/table';

export const tableStyles = createThemePart({
  controlTemplate: tableControlTemplate,
  dependencies: [sizesTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: repeat(4, minmax(100px, 1fr));
        ${d('scroller', 'item')} {
          display: grid;
          grid-template-rows: subgrid;
          grid-template-columns: subgrid;
          grid-column: 1 / -1;
        }
        div[role='rowgroup'] {
          display: grid;
          grid-template-columns: subgrid;
          grid-column: 1 / -1;
        }
        div[role='row'] {
          display: grid;
          grid-template-columns: subgrid;
          grid-column: 1 / -1;
        }
        div[role='cell'],
        div[role='columnheader'] {
          height: var(--ngn-table-row-height);
        }
      }
    `,
  },
});
