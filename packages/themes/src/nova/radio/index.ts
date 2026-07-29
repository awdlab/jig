import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  controlRing,
  ringTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/nova/base';
import { radioControlTemplate } from '@ngneers/controls-themes/templates/radio';

export const radioStyles = createThemePart({
  controlTemplate: radioControlTemplate,
  base: baseStyles.radio,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, ringTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('circle')} {
        --box-size: 1.0625rem;
        width: var(--box-size);
        height: var(--box-size);
        background-color: ${v('color.surface.50')};
        /* A hairline border loses the circle against the page; the form control needs a real outline. */
        border: 1px solid ${v('color.surface.400')};
        border-radius: ${v('size.rounded.full')};
        transition: border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('dot')} {
        /* The dot is flex-centred in the circle's 15px content box (17px − 2 × 1px border), so
           its size must leave an even remainder: 7px splits 4/4, 8px would split 3.5/3.5 and
           render one edge a pixel off. */
        width: 0.4375rem;
        height: 0.4375rem;
        background-color: ${v('color.primary.500')};
        opacity: 0;
        transform: scale(0.4);
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      /* Border width stays 1px: growing it on check shifts the flex-centred dot and reads as a jump. */
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

      ${c('root')}:focus-visible ${c('circle')} {
        outline: 3px solid ${controlRing(v)};
        outline-offset: 2px;
      }
    `,
  },
});
