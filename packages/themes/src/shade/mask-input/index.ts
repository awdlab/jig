import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { maskInputControlTemplate } from '@awdlab/jig-themes/templates/mask-input';

export const maskInputStyles = createThemePart({
  controlTemplate: maskInputControlTemplate,
  base: baseStyles.maskInput,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('section-placeholder')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('separator')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('section')} + ${c('separator')},
      ${c('separator')}:has(+ ${c('section')}) {
        color: ${v('color.foreground')};
      }
      ${c('section-active')} {
        /* Highlight via background + a same-color box-shadow halo so the
         * highlight extends slightly beyond the text WITHOUT padding/margin —
         * padding would change the box size and reflow the field on focus. */
        background-color: ${v('color.accent.base')};
        box-shadow: 0 0 0 2px ${v('color.accent.base')};
        border-radius: ${v('size.rounded.sm')};
      }
      /* The field dims a disabled mask, so its parts drop their own contrast instead. */
      ${c('disabled')} ${c('section')},
      ${c('disabled')} ${c('section-placeholder')},
      ${c('disabled')} ${c('separator')} {
        color: inherit;
      }
    `,
  },
});
