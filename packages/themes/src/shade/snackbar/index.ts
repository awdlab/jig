import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  shadowTemplate,
  sizesTemplate,
  slotColors,
} from '@ngneers/controls-themes/shade/base';
import { snackbarControlTemplate } from '@ngneers/controls-themes/templates/snackbar';

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
        background: var(--theme-bg, ${v('color.foreground')});
        color: var(--theme-fg, ${v('color.background')});
        gap: ${v('size.padding.md')};
        padding: ${v('size.padding.md')} ${v('size.padding.xl')};
        border-radius: ${v('size.rounded.lg')};
        font-size: ${v('font.size.sm')};
        box-shadow: ${v('shadow.xl')};
      }

      ${c('defaultHeaderText')} {
        font-weight: ${v('font.weight.semibold')};
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
    `,
  },
});
