import { createThemePart, css } from '@awdlab/jig-themes/api';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        display: contents;
      }

      ${c('wrapper')} {
        background: transparent;
        pointer-events: none;
        /* Never in flow: Safari drops the element out of the top layer before the closing
           transition ends, and a static popover would then resize its anchor's layout.
           absolute matches the top-layer containing block floating-ui positions against. */
        position: absolute;
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
