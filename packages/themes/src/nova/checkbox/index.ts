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
        width: 1.25rem;
        height: 1.25rem;
        /* The check/indeterminate glyphs are 1em icons, so this scales them down with the box. */
        font-size: 0.875rem;
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.sm')};
      }
      ${c('root')}:has(${c('input')}[disabled]) ${c('box')} {
        background-color: ${v('color.disabled.background')};
        border-color: ${v('color.disabled.border')};
      }
      ${c('root')}:has(${c('input')}[aria-readonly]) ${c('box')} {
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

      ${c('root')}:has(${c('input')}:focus-visible) ${c('box')} {
        outline: 2px solid ${v('color.text')};
      }

      ${c('box-icon')} {
        opacity: 0;
        transform: scale(0.8);
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('box-icon-visible')} {
        opacity: 1;
        transform: scale(1);
      }
    `,
  },
});
