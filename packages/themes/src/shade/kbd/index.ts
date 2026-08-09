import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@awdlab/jig-themes/shade/base';
import { kbdControlTemplate } from '@awdlab/jig-themes/templates/kbd';

export const kbdStyles = createThemePart({
  controlTemplate: kbdControlTemplate,
  base: baseStyles.kbd,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('key')} {
        min-width: 1.5rem;
        height: 1.25rem;
        padding: 0 0.375rem;
        border: 1px solid ${v('color.border')};
        border-radius: ${v('size.rounded.sm')};
        background: ${v('color.muted.base')};
        color: ${v('color.muted.foreground')};
        font-size: ${v('font.size.xs')};
        line-height: 1;
      }
    `,
  },
});
