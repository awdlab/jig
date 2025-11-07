import { createThemePart, css } from '@ngneers/controls-themes/api';
import { iconControlTemplate } from '@ngneers/controls-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        width: 1em;
        height: 1em;
        display: flex;
      }
      ${c('default')} {
        width: 1em;
        height: 1em;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        svg {
          fill: currentColor;
          width: 100%;
          height: 100%;
        }
      }
    `,
  },
});
