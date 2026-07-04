import { createThemePart, css } from '@ngneers/controls-themes/api';
import { snackbarControlTemplate } from '@ngneers/controls-themes/templates/snackbar';

export const snackbarStyles = createThemePart({
  controlTemplate: snackbarControlTemplate,
  dependencies: [],
  root: {
    css: ({ c }) => css`
      ${c('host')} {
        display: none;
        /* Newest snackbar (first in DOM) sits at the bottom; leaving items reflow their
           following siblings toward the bottom anchor. */
        flex-direction: column-reverse;
        align-items: center;
        margin: unset;
        inset: unset;
        position: fixed;
        &:popover-open {
          display: flex;
        }
      }
      ${c('root')} {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      ${c('body')} {
        display: flex;
        flex-direction: column;
      }
      ${c('defaultHeader')} {
        display: flex;
        align-items: center;
      }
    `,
  },
});
