import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
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
      ${c('section-active')} {
        background-color: ${v('color.accent.100')};
        color: ${v('color.accent.100-contrast')};
        box-shadow: 0 0 0 2px ${v('color.accent.100')};
        border-radius: ${v('size.rounded.sm')};
      }
    `,
  },
});
