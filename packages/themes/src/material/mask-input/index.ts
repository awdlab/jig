import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/material/base';
import { maskInputControlTemplate } from '@ngneers/controls-themes/templates/mask-input';

export const maskInputStyles = createThemePart({
  controlTemplate: maskInputControlTemplate,
  base: baseStyles.maskInput,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('section-placeholder')} {
        color: ${v('color.surface.400')};
      }
      ${c('separator')} {
        color: ${v('color.surface.400')};
      }
      ${c('section')} + ${c('separator')},
      ${c('separator')}:has(+ ${c('section')}) {
        color: ${v('color.text')};
      }
      /* MD3 state layer: a tonal primary highlight instead of nova's opaque accent fill. */
      ${c('section-active')} {
        background-color: color-mix(in srgb, ${v('color.primary.500')} 24%, transparent);
        color: ${v('color.text')};
        border-radius: ${v('size.rounded.sm')};
      }
    `,
  },
});
