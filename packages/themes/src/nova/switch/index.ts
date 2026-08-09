import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  controlRing,
  ringTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { switchControlTemplate } from '@awdlab/jig-themes/templates/switch';

export const switchStyles = createThemePart({
  controlTemplate: switchControlTemplate,
  base: baseStyles.switch,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, ringTemplate, shadowTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('track')} {
        --height: 1.3125rem;
        width: 2.375rem;
        height: var(--height);
        background-color: ${v('color.surface.100')};
        border-radius: calc(var(--height) / 2);
        padding: 2px;
        transition: background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
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
        background-color: ${v('color.background')};
        box-shadow: ${v('shadow.sm')};
        transition: transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('track-checked')} {
        background-color: ${v('color.primary.500')};
      }
      /* track width - thumb - both insets */
      ${c('track-checked')} ${c('thumb')} {
        transform: translateX(1.0625rem);
      }

      ${c('root')}:has(${c('input')}[disabled]) ${c('track')} {
        background-color: ${v('color.disabled.background')};
      }
      ${c('invalid')} ${c('track')} {
        background-color: ${v('color.invalid.border')};
      }
      ${c('invalid')}:has(${c('input')}[disabled]) ${c('track')} {
        background-color: ${v('color.error.200')};
      }
      ${c('root')}:has(${c('input')}[aria-readonly]) ${c('thumb')} {
        background-color: ${v('color.surface.100')};
      }

      ${c('root')}:has(${c('input')}:focus-visible) ${c('track')} {
        outline: 3px solid ${controlRing(v)};
        outline-offset: 2px;
      }
    `,
  },
});
