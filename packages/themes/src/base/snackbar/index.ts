import { createThemePart, css } from '@awdlab/jig-themes/api';
import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';

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
        position: relative;
        &:focus {
          outline: none;
        }
        &:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }
      }
      ${c('body')} {
        display: flex;
        flex-direction: column;
      }
      ${c('sr-only')} {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      ${c('defaultHeader')} {
        display: flex;
        align-items: center;
      }
      ${c('actions')} {
        display: flex;
        align-items: center;
      }
      ${c('progressBar')} {
        position: absolute;
        bottom: 0;
        inset-inline-start: 0;
        width: 100%;
        transform-origin: left center;
        animation-name: ${c('progressBar', 'animation')};
        animation-timing-function: linear;
        animation-fill-mode: forwards;
      }
      /* transform-origin has no logical keyword; the bar must drain from the inline-start edge. */
      ${c('progressBar')}:dir(rtl) {
        transform-origin: right center;
      }
      @keyframes ${c('progressBar', 'animation')} {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
    `,
  },
});
