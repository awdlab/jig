import { createThemePart, css } from '@awdlab/jig-themes/api';
import { resizableDirectiveTemplate } from '@awdlab/jig-themes/templates/api';

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
