import { createThemePart, css } from '@ngneers/controls-themes/api';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';

const TRANSITION_BUFFER = '50ms';
const MOVE_AMOUNT = 6; // in px

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, shadowTemplate],
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
        padding-bottom: ${MOVE_AMOUNT}px; /** to make space for the animation (prevent overflow) */
        overflow: visible; /** so that box-shadow is not clipped */
        /* The 100 ms buffer is so that the animation of the content finishes before the popover closes (Animation doesn't get cancelled) */
        transition:
          display calc(${v('animation.duration.fade')} + ${TRANSITION_BUFFER}) allow-discrete,
          overlay calc(${v('animation.duration.fade')} + ${TRANSITION_BUFFER}) allow-discrete;
        /* Currently not supported by webkit & firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1971162 */

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
        border-style: solid;
        background: ${v('color.background')};
        color: ${v('color.text')};
        border-color: ${v('color.surface.300')};
        border-radius: ${v('size.rounded.md')};
        border-width: 1px;
        padding: ${v('size.padding.md')};
        opacity: 0;
        box-shadow: ${v('shadow.md')};
        /* We add some delay that is larger than the TRANSITION_BUFFER to not hide the content shortly during opening */
        transition: display ${v('animation.duration.fade')} allow-discrete;
        animation: ngnPopover_fadeIn ${v('animation.duration.fade')} ${v('animation.easing.fade')}
          forwards;
        &${c('content-closing')} {
          animation: ngnPopover_fadeOut ${v('animation.duration.fade')}
            ${v('animation.easing.fade')} forwards;
        }
      }
      @keyframes ngnPopover_fadeIn {
        from {
          opacity: 0;
          transform: translateY(${MOVE_AMOUNT}px);
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
          transform: translateY(${MOVE_AMOUNT}px);
          display: none;
        }
      }
    `,
  },
});
