import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  shadowTemplate,
  sizesTemplate,
} from '@ngneers/controls-themes/shade/base';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  base: baseStyles.checkbox,
  dependencies: [animationTemplate, colorsTemplate, shadowTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('box')} {
        width: 1rem;
        height: 1rem;
        border: 1px solid
          color-mix(in srgb, ${v('color.input')} 45%, ${v('color.muted.foreground')} 55%);
        border-radius: ${v('size.rounded.sm')};
        box-shadow: ${v('shadow.sm')};
        color: ${v('color.primary.foreground')};
        transition:
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          box-shadow ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
      }

      ${c('box-checked')},
      ${c('box-indeterminate')} {
        background-color: ${v('color.primary.base')};
        border-color: ${v('color.primary.base')};
      }

      ${c('invalid')} ${c('box')} {
        border-color: ${v('color.destructive.base')};
      }
      ${c('invalid')} ${c('box-checked')},
      ${c('invalid')} ${c('box-indeterminate')} {
        background-color: ${v('color.destructive.base')};
        color: ${v('color.destructive.foreground')};
      }

      /* readonly: muted fill, still readable, clearly non-editable */
      ${c('root')}:has(${c('input')}[aria-readonly]) ${c('box')} {
        background-color: ${v('color.muted.base')};
      }

      /* disabled dims the whole control; never recolor */
      ${c('root')}:has(${c('input')}[disabled]) {
        opacity: 0.5;
        cursor: default;
      }

      /* focus lives on the hidden input; mirror the shared 3px ring onto the visible box */
      ${c('root')}:has(${c('input')}:focus-visible) ${c('box')} {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
      }
      ${c('invalid')}:has(${c('input')}:focus-visible) ${c('box')} {
        box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.destructive.base')} 20%, transparent);
      }

      ${c('box-icon')} {
        /* This icon scales with font-size (not --icon-size); shrink it so the check/dash
         * sits inset within the box instead of filling it edge-to-edge. */
        font-size: 0.72rem;
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
