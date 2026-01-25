import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  base: baseStyles.checkbox,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('box')} {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid ${v('color.border')};
        border-radius: ${v('size.rounded.sm')};
      }
      ${c()}:has(${c('input')}[disabled]) ${c('box')} {
        background-color: ${v('color.disabled.background')};
        border-color: ${v('color.disabled.border')};
      }
      ${c()}:has(${c('input')}[aria-readonly]) ${c('box')} {
        border-color: ${v('color.disabled.border')};
      }
      ${c('invalid')} ${c('box')} {
        background-color: ${v('color.invalid.background')};
        border-color: ${v('color.invalid.border')};
      }
      ${c('invalid')}:has(${c('input')}[disabled]) ${c('box')} {
        background-color: ${v('color.disabled.background')};
        border-color: ${v('color.error.300')};
      }
      ${c('invalid')}:has(${c('input')}[aria-readonly]) ${c('box')} {
        background-color: ${v('color.invalid.background')};
        border-color: ${v('color.error.300')};
      }

      ${c()}:has(${c('input')}:focus-visible) ${c('box')} {
        outline: 2px solid ${v('color.text')};
      }

      ${c('anim-box-icon-enter')} {
        /* prettier-ignore */
        animation: ${c('anim-box-icon-enter', 'animation')} ${v('anim.time.snappyFade')} ${v(
          'anim.ease.snappyFade'
        )};
        pointer-events: none;
      }
      ${c('anim-box-icon-leave')} {
        /* prettier-ignore */
        animation: ${c('anim-box-icon-enter', 'animation')} ${v('anim.time.snappyFade')} ${v(
          'anim.ease.snappyFade'
        )} reverse;
        pointer-events: none;
        position: absolute;
      }

      @keyframes ${c('anim-box-icon-enter', 'animation')} {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  },
});
