import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  slotColors,
} from '@awdlab/jig-themes/shade/base';
import { createShadeColors } from '@awdlab/jig-themes/shade/colors';
import { snackbarControlTemplate } from '@awdlab/jig-themes/templates/snackbar';

// The snackbar surface is a fixed dark in BOTH color schemes (like the spec,
// and like Material toasts). Shade's surface is white in light mode, so we use
// the dark-scheme surface directly instead of the scheme-adaptive token.
const shadeDark = createShadeColors().dark;
const SURFACE = shadeDark.surface;
const ON_SURFACE = shadeDark.surfaceForeground;

export const snackbarStyles = createThemePart({
  controlTemplate: snackbarControlTemplate,
  base: baseStyles.snackbar,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate, shadowTemplate],
  root: {
    css: ({ v, c }) => css`
      ${slotColors(c, v)}

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
           an accent (left stripe + icon), not a full tint. */
        background: ${SURFACE};
        color: ${ON_SURFACE};
        /* Icon color = the kind's accent by default; the neutral (surface) kind
           overrides it to the text color below. Set on the host so it inherits
           reliably, avoiding descendant-selector leaks. */
        --snk-icon-color: var(--theme-bg, ${ON_SURFACE});
        gap: ${v('size.padding.md')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        border-radius: ${v('size.rounded.lg')};
        font-size: ${v('font.size.sm')};
        box-shadow: ${v('shadow.xl')};
      }

      /* Colored accent stripe in the left gutter — carries the kind color via
         the slot's base color (subtle for the default surface kind). */
      ${c('root')}::before {
        content: '';
        position: absolute;
        left: ${v('size.padding.sm')};
        top: 50%;
        transform: translateY(-50%);
        height: 55%;
        width: 4px;
        border-radius: ${v('size.rounded.lg')};
        background: var(--theme-bg, ${ON_SURFACE});
      }

      ${c('defaultHeaderText')} {
        font-weight: ${v('font.weight.semibold')};
        display: flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }

      /* Neutral (surface) kind: icon uses the text color instead of the accent. */
      ${c('color-surface')} {
        --snk-icon-color: ${ON_SURFACE};
      }
      ${c('defaultHeaderText')} awd-icon {
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

      ${c('defaultContent')} {
        line-height: 1.5;
      }

      ${c('actions')} {
        gap: ${v('size.padding.sm')};
      }

      /* The close icon button has no themed color of its own, so it would fall
         back to the UA default (black). Pin it to the neutral surface foreground
         (the surface is always neutral now). Scoped to our own close button so
         caller action colors are never overridden. */
      ${c('closeButton')} {
        color: ${ON_SURFACE};
      }

      ${c('progressBar')} {
        height: 3px;
        left: ${v('size.padding.md')};
        right: ${v('size.padding.md')};
        width: auto;
        bottom: 4px;
        border-radius: ${v('size.rounded.lg')};
        background: color-mix(in srgb, ${ON_SURFACE} 55%, transparent);
      }
    `,
  },
});
