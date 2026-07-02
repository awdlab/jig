import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { movableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const movableStyles = createThemePart({
  controlTemplate: movableDirectiveTemplate,
  base: baseStyles.movable,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('drag-handle-grab')} {
        cursor: grab;
      }
      ${c('drag-handle-grabbing')} {
        cursor: grabbing;
      }
    `,
  },
});
