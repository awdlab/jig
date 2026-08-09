import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/material/base';
import { neutralColor as greyColor } from '@awdlab/jig-themes/material/colors';
import { toastControlTemplate } from '@awdlab/jig-themes/templates/toast';

// MD3 toasts (like snackbars) use a fixed dark "inverse surface" regardless of kind —
// the kind color is expressed as an accent (header icon), not a full-surface tint. We
// use the raw, non-reversed grey palette because `color.surface.*` inverts in dark mode
// (dark toast on light → light toast on dark), which is not what we want here. Mirrors
// `material/snackbar`.
const SURFACE = greyColor['900'];
const ON_SURFACE = greyColor['50'];
const BORDER = greyColor['700'];

export const toastStyles = createThemePart({
  controlTemplate: toastControlTemplate,
  base: baseStyles.toast,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('host')} {
        --toastGap: ${v('size.padding.md')};
        max-width: min(35rem, 100%);
        gap: var(--toastGap);
        background: transparent;
        top: ${v('size.padding.lg')};
        right: ${v('size.padding.lg')};
        margin-left: ${v('size.padding.lg')};
        overflow: visible;
      }

      ${c('root')} {
        background: ${SURFACE};
        color: ${ON_SURFACE};
        border: 1px solid ${BORDER};
        /* Icon color = the kind's accent by default; the neutral (surface) kind
           overrides it to the text color below. */
        --tst-icon-color: var(--theme-color-500);
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.sm')};
        box-shadow: ${v('shadow.lg')};
      }

      /* Neutral (surface) kind: icon uses the text color instead of the accent. */
      ${c('color-surface')} {
        --tst-icon-color: ${ON_SURFACE};
      }
      ${c('defaultHeaderText')} jig-icon {
        color: var(--tst-icon-color);
      }

      ${c('defaultHeaderText')} {
        font-weight: ${v('font.weight.medium')};
        display: flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }

      ${c('anim-enter')} {
        animation: ${c('anim-enter', 'animation')} ${v('anim.time.fade')} ${v('anim.ease.fade')};
      }

      @keyframes ${c('anim-enter', 'animation')} {
        from {
          transform: translateY(20%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      ${c('anim-leave')} {
        /* prettier-ignore */
        animation: ${c('anim-leave', 'animation')} ${v('anim.time.snappyFade')} ${v(
          'anim.ease.snappyFade'
        )};
        /*  Make sure that when one toast is removed, the toasts below it also move up */
        & ~ * {
          /* prettier-ignore */
          animation: ${c('anim-leave', 'animation')}-after ${v('anim.time.snappyFade')} ${v(
            'anim.ease.snappyFade'
          )};
        }
      }

      @keyframes ${c('anim-leave', 'animation')} {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        75% {
          opacity: 0;
        }
        100% {
          transform: translateY(calc(-100% - var(--toastGap)));
          opacity: 0;
        }
      }
      @keyframes ${c('anim-leave', 'animation')}-after {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(calc(-100% - var(--toastGap)));
        }
      }

      ${c('defaultContent')} {
        line-height: 1.5;
      }
    `,
  },
});
