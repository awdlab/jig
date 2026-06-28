import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inputMaskControlTemplate } from '@ngneers/controls-themes/templates/input-mask';

export const inputMaskStyles = createThemePart({
  controlTemplate: inputMaskControlTemplate,
  base: baseStyles.inputMask,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('section-placeholder')} {
        color: ${v('color.surface.400')};
      }
      ${c('section-active')} {
        /* Highlight via background + a same-color box-shadow halo so the
         * highlight extends slightly beyond the text WITHOUT padding/margin —
         * padding would change the box size and reflow the field on focus. */
        background-color: ${v('color.accent.100')};
        box-shadow: 0 0 0 2px ${v('color.accent.100')};
        border-radius: ${v('size.rounded.sm')};
      }
    `,
  },
});
