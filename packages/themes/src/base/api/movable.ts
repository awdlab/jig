import { createThemePart, css } from '@ngneers/controls-themes/api';
import { movableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

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
