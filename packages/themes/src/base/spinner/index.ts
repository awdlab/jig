import { createThemePart, css } from '@ngneers/controls-themes/api';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

export const spinnerStyles = createThemePart({
  controlTemplate: spinnerControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c()} {
        display: inline-block;
        width: calc(1px * var(--size));
        height: calc(1px * var(--size));
      }
      ${c('svg')} {
        width: 100%;
        height: 100%;
      }
    `,
  },
});
