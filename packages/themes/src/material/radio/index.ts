import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/material/base';
import { radioControlTemplate } from '@ngneers/controls-themes/templates/radio';

export const radioStyles = createThemePart({
  controlTemplate: radioControlTemplate,
  base: baseStyles.radio,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('circle')} {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid ${v('color.border')};
        border-radius: ${v('size.rounded.full')};
        transition: border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('dot')} {
        width: 0.625rem;
        height: 0.625rem;
        background-color: ${v('color.primary.500')};
        opacity: 0;
        transform: scale(0.4);
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('circle-checked')} {
        border-color: ${v('color.primary.500')};
      }
      ${c('circle-checked')} ${c('dot')} {
        opacity: 1;
        transform: scale(1);
      }

      ${c('root')}[aria-disabled='true'] ${c('circle')} {
        background-color: ${v('color.disabled.background')};
        border-color: ${v('color.disabled.border')};
      }
      ${c('root')}[aria-disabled='true'] ${c('dot')} {
        background-color: ${v('color.disabled.border')};
      }

      /* MD3 state-layer halo: unchecked uses color.text, checked uses primary. */
      ${c('root')}:not([aria-disabled='true']):hover ${c('circle')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 4%, transparent);
      }
      ${c('root')}:not([aria-disabled='true']):hover ${c('circle-checked')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 8%, transparent);
      }
      ${c('root')}:focus-visible ${c('circle')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.text')} 12%, transparent);
      }
      ${c('root')}:focus-visible ${c('circle-checked')} {
        box-shadow: 0 0 0 0.625rem color-mix(in srgb, ${v('color.primary.500')} 12%, transparent);
      }
    `,
  },
});
