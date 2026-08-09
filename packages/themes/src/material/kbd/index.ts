import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/material/base';
import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.5rem;
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.surface.200')};
        color: ${v('color.surface.700')};
        font-size: ${v('font.size.xs')};
        line-height: 1;
      }
    `,
  },
});
