import { createThemePart, css } from '@ngneers/controls-themes/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

export const buttonStyles = createThemePart({
  controlTemplate: buttonControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        font-family: inherit;
      }
    `,
  },
});
