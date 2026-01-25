import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { switchControlTemplate } from '@ngneers/controls-themes/templates/switch';

export const switchStyles = createThemePart({
  controlTemplate: switchControlTemplate,
  base: baseStyles.switch,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('track')} {
        --height: 1.5rem;
        width: 3rem;
        height: var(--height);
        background-color: ${v('color.surface.300')};
        border-radius: calc(var(--height) / 2);
        padding: 4px;
        transition:
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          padding ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('input')} {
        cursor: pointer;
      }
      ${c('input')}[disabled], ${c('input')}[aria-readonly] {
        cursor: default;
      }
      ${c('thumb')} {
        height: 100%;
        aspect-ratio: 1 / 1;
        border-radius: ${v('size.rounded.full')};
        background-color: ${v('color.surface.50')};
        transition: transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('track-checked')} {
        background-color: ${v('color.primary.500')};
        padding: 2px;
      }
      ${c('track-checked')} ${c('thumb')} {
        transform: translateX(1.5rem);
      }

      ${c()}:has(${c('input')}[disabled]) ${c('track')} {
        background-color: ${v('color.disabled.background')};
      }
      ${c('invalid')} ${c('track')} {
        background-color: ${v('color.invalid.border')};
      }
      ${c('invalid')}:has(${c('input')}[disabled]) ${c('track')} {
        background-color: ${v('color.error.200')};
      }
      ${c()}:has(${c('input')}[aria-readonly]) ${c('thumb')} {
        background-color: ${v('color.surface.100')};
      }

      ${c()}:has(${c('input')}:focus-visible) ${c('track')} {
        outline: 2px solid ${v('color.text')};
      }
    `,
  },
});
