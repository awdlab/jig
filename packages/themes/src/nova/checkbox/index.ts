import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  animationTemplate,
  colorsTemplate,
  controlRing,
  ringTemplate,
  sizesTemplate,
} from '@awdlab/jig-themes/nova/base';
import { checkboxControlTemplate } from '@awdlab/jig-themes/templates/checkbox';

export const checkboxStyles = createThemePart({
  controlTemplate: checkboxControlTemplate,
  base: baseStyles.checkbox,
  dependencies: [colorsTemplate, sizesTemplate, animationTemplate, ringTemplate],
  root: {
    css: ({ v, c, d }) => css`
      ${c('box')} {
        --box-size: 1.0625rem;
        width: var(--box-size);
        height: var(--box-size);
        /* The check/indeterminate glyphs are 1em icons, so this scales them down with the box. */
        font-size: 0.75rem;
        background-color: ${v('color.surface.50')};
        /* A hairline border loses the box against the page; the form control needs a real outline. */
        border: 1px solid ${v('color.surface.400')};
        /* Deliberately squarer than the board's ratio: at this box size the board value
           renders almost circular and reads as a radio. */
        border-radius: calc(${v('size.rounded.md')} / 2.5);
        transition:
          background-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')},
          border-color ${v('anim.time.snappyFade')} ${v('anim.ease.snappyFade')};
        color: ${v('color.primary.500-contrast')};
      }
      /* Checked and indeterminate read as a solid accent tile with a contrasting glyph. */
      ${c('box-checked')}, ${c('box-indeterminate')} {
        background-color: ${v('color.primary.500')};
        border-color: ${v('color.primary.500')};
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

      /* The glyph is only legible on a filled tile, so checked keeps its fill in the
         invalid and disabled states too — only the border/tone changes. */
      ${c('invalid')} ${c('box-checked')}, ${c('invalid')} ${c('box-indeterminate')} {
        background-color: ${v('color.error.500')};
        border-color: ${v('color.error.500')};
        color: ${v('color.error.500-contrast')};
      }
      ${c('root')}:has(${c('input')}[disabled]) ${c('box-checked')},
      ${c('root')}:has(${c('input')}[disabled]) ${c('box-indeterminate')} {
        background-color: ${v('color.disabled.border')};
        border-color: ${v('color.disabled.border')};
        color: ${v('color.disabled.text')};
      }

      ${c('root')}:has(${c('input')}:focus-visible) ${c('box')} {
        outline: 3px solid ${controlRing(v)};
        outline-offset: 2px;
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
