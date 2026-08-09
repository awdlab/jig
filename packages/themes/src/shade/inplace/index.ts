import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { inplaceControlTemplate } from '@awdlab/jig-themes/templates/inplace';

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
        border-radius: ${v('size.rounded.md')};
        transition: background-color 0.15s ease;
        &:hover {
          background-color: ${v('color.accent.base')};
        }
        &:active {
          background-color: ${v('color.accent.base')};
        }
        &:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px color-mix(in srgb, ${v('color.ring')} 50%, transparent);
        }
      }
    `,
  },
});
