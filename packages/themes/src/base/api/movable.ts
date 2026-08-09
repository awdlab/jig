import { createThemePart, css } from '@awdlab/jig-themes/api';
import { movableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

export const movableStyles = createThemePart({
  controlTemplate: movableDirectiveTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('drag-handle-grab')} {
        user-select: none;
      }
    `,
  },
});
