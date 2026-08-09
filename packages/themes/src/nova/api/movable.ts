import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { movableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

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
