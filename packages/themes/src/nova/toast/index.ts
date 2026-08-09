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
import { toastControlTemplate } from '@awdlab/jig-themes/templates/toast';

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
        background: ${v('color.background')};
        color: ${v('color.text')};
        padding: ${v('size.padding.md')} ${v('size.padding.lg')};
        border-radius: ${v('size.rounded.xl')};
        font-size: ${v('font.size.sm')};
        border: 1px solid ${v('color.border')};
        box-shadow: ${v('shadow.lg')};
      }

      ${c('defaultHeaderText')} {
        font-weight: ${v('font.weight.semibold')};
        display: flex;
        align-items: center;
        gap: ${v('size.padding.sm')};
      }
      ${c('defaultHeaderText')} jig-icon {
        color: var(--theme-color-500);
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
