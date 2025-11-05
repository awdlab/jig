import { createThemePart, css } from '@ngneers/controls-themes/api';
import { resizableDirectiveTemplate } from '@ngneers/controls-themes/templates/api';

export const resizableStyles = createThemePart({
  controlTemplate: resizableDirectiveTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('resizable')} {
        resize: both;
      }
    `,
  },
});
