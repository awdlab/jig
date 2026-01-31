import { createThemePart, css } from '@ngneers/controls-themes/api';
import { spinnerControlTemplate } from '@ngneers/controls-themes/templates/spinner';

export const spinnerStyles = createThemePart({
  controlTemplate: spinnerControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => css`
      ${c('centered')} {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
      }
      *:has(> ${c('centered')}) {
        position: relative;
      }
      ${c('root')} {
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
