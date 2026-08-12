import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/nova/base';
import { maskInputControlTemplate } from '@awdlab/jig-themes/templates/mask-input';

export const maskInputStyles = createThemePart({
  controlTemplate: maskInputControlTemplate,
  base: baseStyles.maskInput,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('section-placeholder')} {
        color: ${v('color.surface.500')};
      }
      ${c('separator')} {
        color: ${v('color.surface.500')};
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
      ${c('disabled')} {
        color: ${v('color.disabled.text')};
      }
      ${c('disabled')} ${c('section')},
      ${c('disabled')} ${c('section-placeholder')},
      ${c('disabled')} ${c('separator')} {
        color: inherit;
      }
    `,
  },
});
