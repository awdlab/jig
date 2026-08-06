import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { kbdControlTemplate } from '@ngneers/controls-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.375rem;
        border: 1px solid ${v('color.surface.300')};
        border-bottom-width: 2px;
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.surface.100')};
        color: ${v('color.surface.700')};
        font-size: ${v('font.size.xs')};
        font-weight: ${v('font.weight.medium')};
        line-height: 1;
      }
    `,
  },
});
