import { createThemePart, css } from '@ngneers/controls-themes/api';
import { progressControlTemplate } from '@ngneers/controls-themes/templates/progress';

export const progressStyles = createThemePart({
  controlTemplate: progressControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c, d }) => {
      void v;
      void d;
      return css`
        ${c('root')} {
          width: 100%;
        }
        ${c('track')} {
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        ${c('fill')} {
          height: 100%;
          width: var(--progress);
        }
        /* Circular mode base styles */
        ${c('circular')} {
          width: auto;
          ${c('svg')} {
            display: block;
          }
        }
        ${c('indeterminate')} {
          ${c('fill')}, ${c('fill2')} {
            position: absolute;
          }
          ${c('track')} {
            position: relative;
          }
        }
      `;
    },
  },
});
