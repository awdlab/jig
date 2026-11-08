import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/nova/base';
import { greyColor } from '@awdlab/jig-themes/nova/colors';
import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';

// Fixed dark surface in both schemes, from the raw grey palette since `color.surface.*` inverts in dark mode.
const SURFACE = greyColor['900'];
const ON_SURFACE = greyColor['50'];
const BORDER = greyColor['700'];

export const snackbarStyles = createThemePart({
  controlTemplate: snackbarControlTemplate,
  base: baseStyles.snackbar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('host')} {
        --snackbarGap: ${v('size.padding.md')};
        max-width: min(35rem, 100%);
        gap: var(--snackbarGap);
        background: transparent;
        bottom: ${v('size.padding.lg')};
        left: 50%;
        transform: translateX(-50%);
        overflow: visible;
      }

      ${c('root')} {
        /* Fixed dark surface for every kind/scheme — the color is expressed as
           an accent (left stripe + icon), not a full tint. See the ::before
           stripe and the icon rule below. */
        background: ${SURFACE};
        color: ${ON_SURFACE};
        border: 1px solid ${BORDER};
        /* Kind accent by default, set on the host so it inherits without descendant selectors. */
        --snk-icon-color: var(--theme-color-500);
        gap: ${v('size.padding.md')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        border-radius: ${v('size.rounded.md')};
        /* Clip the flush-left accent stripe to the rounded corners. */
        overflow: hidden;
        font-size: ${v('font.size.sm')};
        box-shadow: ${v('shadow.lg')};
      }

      /* Colored accent stripe flush against the left edge, full height — carries
         the kind color (vivid for success/error/…, subtle grey for default). */
      ${c('root')}::before {
        content: '';
        position: absolute;
        inset-inline-start: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: var(--theme-color-500);
      }

      ${c('default-header-text')} {
        font-weight: ${v('font.weight.semibold')};
        display: flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }

      /* Neutral (surface) kind: icon uses the text color instead of the accent. */
      ${c('color-surface')} {
        --snk-icon-color: ${ON_SURFACE};
      }
      ${c('default-header-text')} jig-icon {
        color: var(--snk-icon-color);
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
        /*  Make sure that when one snackbar is removed, the snackbars around it also move */
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
          transform: translateY(calc(100% + var(--snackbarGap)));
          opacity: 0;
        }
      }
      @keyframes ${c('anim-leave', 'animation')}-after {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(calc(100% + var(--snackbarGap)));
        }
      }

      ${c('default-content')} {
        line-height: 1.5;
      }

      ${c('actions')} {
        gap: ${v('size.padding.sm')};
      }

      /* Pins the close button to the surface contrast color, scoped under root to beat the icon-button's light resting fill. */
      ${c('root')} ${c('close-button')} {
        color: ${ON_SURFACE};
        background: transparent;
        &:hover:not(:disabled) {
          background: color-mix(in srgb, ${ON_SURFACE} 16%, transparent);
        }
        &:active:not(:disabled) {
          background: color-mix(in srgb, ${ON_SURFACE} 24%, transparent);
        }
      }

      /* Flush along the bottom edge, full width — the root's overflow:hidden
         clips its corners to the border radius so it touches the border. */
      ${c('progress-bar')} {
        height: 3px;
        inset-inline-start: 0;
        inset-inline-end: 0;
        width: auto;
        bottom: 0;
        background: color-mix(in srgb, ${ON_SURFACE} 55%, transparent);
      }
    `,
  },
});
