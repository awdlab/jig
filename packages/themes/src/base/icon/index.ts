import { createThemePart, css } from '@awdlab/jig-themes/api';
import { iconControlTemplate } from '@awdlab/jig-themes/templates/icon';

export const iconStyles = createThemePart({
  controlTemplate: iconControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        width: 1em;
        height: 1em;
        display: flex;
        svg {
          fill: currentColor;
          width: 100%;
          height: 100%;
        }
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
