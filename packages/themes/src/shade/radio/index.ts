import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/shade/base';
import { radioControlTemplate } from '@awdlab/jig-themes/templates/radio';

export const radioStyles = createThemePart({
  controlTemplate: radioControlTemplate,
  base: baseStyles.radio,
  dependencies: [animationTemplate, colorsTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('circle')} {
        width: 1rem;
        height: 1rem;
        border: 1px solid
          color-mix(in srgb, ${v('color.input')} 45%, ${v('color.muted.foreground')} 55%);
        border-radius: ${v('size.rounded.full')};
        box-shadow: ${v('shadow.sm')};
        transition:
          border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('dot')} {
        width: 0.5rem;
        height: 0.5rem;
        background-color: ${v('color.primary.base')};
        opacity: 0;
        transform: scale(0.4);
        transition:
          opacity ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          transform ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('circle-checked')} {
        border-color: ${v('color.primary.base')};
      }
      ${c('circle-checked')} ${c('dot')} {
        opacity: 1;
        transform: scale(1);
      }

      ${c('root')}[aria-disabled='true'] {
        opacity: 0.5;
      }

      ${c('root')}:focus-visible ${c('circle')} {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
      }
    `,
  },
});
