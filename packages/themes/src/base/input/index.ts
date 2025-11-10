import { createThemePart, css } from '@ngneers/controls-themes/api';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';

export const inputStyles = createThemePart({
  controlTemplate: inputControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c()} {
        font-family: inherit;
        font-size: inherit;
      }
    `,
  },
});
