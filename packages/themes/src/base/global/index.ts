import { createThemePart, css } from '@ngneers/controls-themes/api';
import { globalControlTemplate } from '@ngneers/controls-themes/templates/global';

export const globalStyles = createThemePart({
  controlTemplate: globalControlTemplate,
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        /** Global styles */
      }
    `,
  },
});
