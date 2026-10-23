import { createThemePart, css } from '@awdlab/jig-themes/api';
import { filterListBoxControlTemplate } from '@awdlab/jig-themes/templates/filter-list-box';

export const filterListBoxStyles = createThemePart({
  controlTemplate: filterListBoxControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      ${c('search-row')} {
        display: flex;
        align-items: center;
      }
      ${d('search-field')} {
        flex: 1;
        min-width: 0;
      }
      ${d('filter-trigger')} {
        flex: 0 0 auto;
      }
      ${c('chips')} {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      ${c('empty')} {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
      ${c('empty-actions')} {
        display: flex;
        justify-content: center;
      }
    `,
  },
});
