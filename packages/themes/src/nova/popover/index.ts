import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

const TRANSITION_DURATION_MS = 200;

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        background: transparent;
        pointer-events: none;
        position: static;
        display: flex;
        flex-direction: column;
        /* Browser-Reset: */
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
        overflow: hidden;
        /* The 100 ms buffer is so that the animation of the content finishes before the popover closes (Animation doesn't get cancelled) */
        transition:
          display ${TRANSITION_DURATION_MS + 100}ms allow-discrete,
          overlay ${TRANSITION_DURATION_MS + 100}ms allow-discrete;
        /* Currently not supported by webkit & firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1971162 */

        &:not(:popover-open) {
          display: none;
          /* Due to the 100ms buffer, the child would reappear (for 100ms), because the closing class gets removed */
          ${c('content')}:not(${c('content-closing')}) {
            display: none;
          }
        }
      }
      ${c('content')} {
        max-height: 100%;
        flex-shrink: 0;
        pointer-events: auto;
        border-style: solid;
        background: ${v('color.background')};
        color: ${v('color.text')};
        border-color: ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        border-width: 1px;
        padding: ${v('size.padding.md')};
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        /* We add some delay that is larger than the 100ms buffer to not hide the content shortly during opening */
        transition: display ${TRANSITION_DURATION_MS / 2}ms allow-discrete;
        animation: ngnPopover_fadeIn ${TRANSITION_DURATION_MS}ms ease forwards;
        &${c('content-closing')} {
          animation: ngnPopover_fadeOut ${TRANSITION_DURATION_MS}ms ease forwards;
        }
      }
      @keyframes ngnPopover_fadeIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes ngnPopover_fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(6px);
          display: none;
        }
      }
    `,
  },
});
