import { createThemePart, css } from '@ngneers/controls-themes/api';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        background: transparent;
        pointer-events: none;
        position: static;
        display: flex;
        flex-direction: column;
        /* Browser & inheritance reset: */
        width: unset;
        height: unset;
        color: unset;
        background-color: unset;
        inset: unset;
        margin: unset;
        border-width: unset;
        border-style: unset;
        border-color: unset;
        border-image: unset;
        padding: unset;
        font-size: 1rem;
        cursor: default;

        &:not(:popover-open) {
          display: none;
          /* Due to the TRANSITION_BUFFER, the child would reappear (for TRANSITION_BUFFER), because the closing class gets removed */
          > ${c('content')}:not(${c('content-closing')}) {
            display: none;
          }
        }
      }
      ${c('content')} {
        max-height: 100%;
        flex-shrink: 0;
        pointer-events: auto;
        box-sizing: content-box;
      }
    `,
  },
});
