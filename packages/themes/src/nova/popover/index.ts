import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';

const TRANSITION_BUFFER = '50ms';
const MOVE_AMOUNT = 6; // in px

export const popoverStyles = createThemePart({
  controlTemplate: popoverControlTemplate,
  base: baseStyles.popover,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('wrapper')} {
        /** to make space for the animation (prevent overflow) */
        padding-bottom: ${MOVE_AMOUNT + 1}px;
        overflow: visible; /** so that box-shadow is not clipped */
        /* The 100 ms buffer is so that the animation of the content finishes before the popover closes (Animation doesn't get cancelled) */
        transition:
          display calc(${v('anim.time.fade')} + ${TRANSITION_BUFFER}) allow-discrete,
          overlay calc(${v('anim.time.fade')} + ${TRANSITION_BUFFER}) allow-discrete;
        /* Currently not supported by webkit & firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1971162 */
      }
      ${c('content')} {
        border-style: solid;
        background: ${v('color.background')};
        color: ${v('color.text')};
        border-color: ${v('color.border')};
        border-radius: ${v('size.rounded.lg')};
        border-width: 1px;
        padding: ${v('size.padding.md')};
        box-shadow: ${v('shadow.lg')};
        opacity: 0;
        transform: translateY(${MOVE_AMOUNT}px);
        transition:
          opacity ${v('anim.time.fade')} ${v('anim.ease.fade')},
          transform ${v('anim.time.fade')} ${v('anim.ease.fade')},
          display ${v('anim.time.fade')} allow-discrete;
      }
      ${c('wrapper')}:popover-open > ${c('content')}:not(${c('content-closing')}) {
        opacity: 1;
        transform: translateY(0);
        @starting-style {
          opacity: 0;
          transform: translateY(${MOVE_AMOUNT}px);
        }
      }
    `,
  },
});
