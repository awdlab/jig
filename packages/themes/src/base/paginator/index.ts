import { createThemePart, css } from '@ngneers/controls-themes/api';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

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
    `,
  },
});
