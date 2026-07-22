import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  base: baseStyles.checkbox,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('box')} {
        width: 1.125rem;
        height: 1.125rem;
        /* The check/indeterminate glyphs are 1em icons, so this scales them down with the box. */
        font-size: 0.875rem;
        border: 2px solid ${v('color.border')};
        border-radius: ${v('size.rounded.sm')};
        transition:
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('box-checked')} {
        background-color: ${v('color.primary.500')};
        border-color: ${v('color.primary.500')};
        color: ${v('color.primary.500-contrast')};
      }
      ${c('root')}:has(${c('input')}[disabled]) ${c('box')} {
        background-color: ${v('color.disabled.background')};
        border-color: ${v('color.disabled.border')};
        color: ${v('color.disabled.text')};
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

      /* MD3 state-layer halo: unchecked uses color.text, checked uses primary. */
      ${c('root')}:hover:not(:has(${c('input')}[disabled])) ${c('box')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 4%, transparent);
      }
      ${c('root')}:hover:not(:has(${c('input')}[disabled])) ${c('box-checked')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
      }
      ${c('root')}:has(${c('input')}:focus-visible) ${c('box')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 12%, transparent);
      }
      ${c('root')}:has(${c('input')}:focus-visible) ${c('box-checked')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
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
