import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { toastControlTemplate } from '@ngneers/controls-themes/templates/toast';

export const toastStyles = createThemePart({
  controlTemplate: toastControlTemplate,
  base: baseStyles.toast,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate, animationTemplate],
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
        overflow: visible;
      }

      ${c('')} {
        background: var(--theme-color-400);
        color: ${v('color.text')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.md')};
        font-size: ${v('font.size.sm')};
        border: 1px solid var(--theme-color-600);
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
