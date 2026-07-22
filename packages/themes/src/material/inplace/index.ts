import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/material/base';
import { inplaceControlTemplate } from '@ngneers/controls-themes/templates/inplace';

export const inplaceStyles = createThemePart({
  controlTemplate: inplaceControlTemplate,
  base: baseStyles.inplace,
  dependencies: [sizesTemplate, colorsTemplate],
  root: {
    css: ({ v, c }) => css`
      /* No color axis here, so the state layer overlays plain on-surface text
         color rather than a --theme-color-*. */
      ${c('display')} {
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        cursor: pointer;
        background-color: transparent;
        border: none;
        border-radius: ${v('size.rounded.lg')};
        transition: background-color 0.15s ease;
        &:hover {
          background-color: color-mix(in srgb, ${v('color.text')} 8%, transparent);
        }
        &:active {
          background-color: color-mix(in srgb, ${v('color.text')} 12%, transparent);
        }
        &:focus-visible {
          background-color: transparent;
          outline: 2px solid color-mix(in srgb, ${v('color.primary.500')} 50%, transparent);
          outline-offset: 2px;
        }
      }
    `,
  },
});
