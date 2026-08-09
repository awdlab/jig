import { createThemePart, css } from '@awdlab/jig-themes/api';
import { paginatorControlTemplate } from '@awdlab/jig-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('root')} {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }
      /* Compact-mode current-page indicator between prev/next. */
      ${c('root')} [data-compact-page] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
      }
    `,
  },
});
