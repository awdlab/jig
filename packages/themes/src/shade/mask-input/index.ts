import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { maskInputControlTemplate } from '@ngneers/controls-themes/templates/mask-input';

export const maskInputStyles = createThemePart({
  controlTemplate: maskInputControlTemplate,
  base: baseStyles.maskInput,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('section-placeholder')} {
        color: ${v('color.muted.foreground')};
      }
      ${c('section-active')} {
        /* Highlight via background + a same-color box-shadow halo so the
         * highlight extends slightly beyond the text WITHOUT padding/margin —
         * padding would change the box size and reflow the field on focus. */
        background-color: ${v('color.accent.base')};
        box-shadow: 0 0 0 2px ${v('color.accent.base')};
        border-radius: ${v('size.rounded.sm')};
      }
    `,
  },
});
