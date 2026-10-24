import { createThemePart, css } from '@awdlab/jig-themes/api';
import { filterBarControlTemplate } from '@awdlab/jig-themes/templates/filter-bar';

export const filterBarStyles = createThemePart({
  controlTemplate: filterBarControlTemplate,
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
      ${c('trigger')} {
        display: inline-flex;
        flex: 0 0 auto;
      }
      ${c('chips')} {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    `,
  },
});
