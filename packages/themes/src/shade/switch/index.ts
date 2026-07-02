import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { switchControlTemplate } from '@ngneers/controls-themes/templates/switch';

export const switchStyles = createThemePart({
  controlTemplate: switchControlTemplate,
  base: baseStyles.switch,
  dependencies: [animationTemplate, colorsTemplate, shadowTemplate, sizesTemplate],
  root: {
    // Geometry (track width/height, thumb travel) mirrors nova so the thumb lands correctly;
    // only the colors are restyled to shade tokens.
    css: ({ v, c }) => css`
      ${c('track')} {
        --height: 1.5rem;
        width: 3rem;
        height: var(--height);
        background-color: ${v('color.input')};
        border-radius: calc(var(--height) / 2);
        padding: 4px;
        transition:
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          padding ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }
      ${c('input')} {
        cursor: pointer;
      }
      ${c('input')}[disabled],
      ${c('input')}[aria-readonly] {
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
        background-color: ${v('color.primary.base')};
        padding: 2px;
      }
      ${c('track-checked')} ${c('thumb')} {
        transform: translateX(1.5rem);
      }

      ${c('invalid')} ${c('track')} {
        background-color: ${v('color.destructive.base')};
      }
      ${c('root')}:has(${c('input')}[aria-readonly]) ${c('thumb')} {
        background-color: ${v('color.muted.base')};
      }
      ${c('root')}:has(${c('input')}[disabled]) {
        opacity: 0.5;
      }

      /* focus lives on the hidden input; mirror the shared 3px ring onto the visible track */
      ${c('root')}:has(${c('input')}:focus-visible) ${c('track')} {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
      }
    `,
  },
});
