import { createThemePart, css } from '@ngneers/controls-themes/api';
import { paginatorControlTemplate } from '@ngneers/controls-themes/templates/paginator';

export const paginatorStyles = createThemePart({
  controlTemplate: paginatorControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c()} {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  },
});
