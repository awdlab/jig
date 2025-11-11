import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  base: baseStyles.inplace,
  dependencies: [sizesTemplate, colorsTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('display')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        cursor: pointer;
        background-color: transparent;
        border: none;
        border-radius: ${v('size.rounded.lg')};
        &:hover {
          background-color: ${v('color.surface.100')};
        }
        &:active {
          background-color: ${v('color.surface.200')};
        }
        &:focus-visible {
          outline: 1px solid ${v('color.surface.400')};
        }
      }
    `,
  },
});
