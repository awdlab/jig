import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { animationTemplate, colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { switchControlTemplate } from '@awdlab/jig-themes/templates/switch';

export const switchStyles = createThemePart({
  controlTemplate: switchControlTemplate,
  base: baseStyles.switch,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('track')} {
        --height: 1.5rem;
        width: 2.75rem;
        height: var(--height);
        background-color: ${v('color.surface.300')};
        border-radius: calc(var(--height) / 2);
        padding: 0.1875rem;
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
        background-color: ${v('color.surface.600')};
        transition:
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('track-checked')} {
        background-color: ${v('color.primary.500')};
      }
      ${c('track-checked')} ${c('thumb')} {
        background-color: ${v('color.primary.500-contrast')};
        transform: translateX(1.25rem);
      }
      ${c('track-checked')}:dir(rtl) ${c('thumb')} {
        transform: translateX(-1.25rem);
      }

      ${c('root')}:has(${c('input')}[disabled]) ${c('track')} {
        background-color: ${v('color.disabled.background')};
      }
      ${c('root')}:has(${c('input')}[disabled]) ${c('thumb')} {
        background-color: ${v('color.disabled.border')};
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

      /* MD3 state-layer halo on the thumb: unchecked uses color.text, checked uses primary. */
      ${c('root')}:hover:not(:has(${c('input')}[disabled])) ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 4%, transparent);
      }
      ${c('root')}:hover:not(:has(${c('input')}[disabled])) ${c('track-checked')} ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
      }
      ${c('root')}:has(${c('input')}:focus-visible) ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 12%, transparent);
      }
      ${c('root')}:has(${c('input')}:focus-visible) ${c('track-checked')} ${c('thumb')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
      }
    `,
  },
});
