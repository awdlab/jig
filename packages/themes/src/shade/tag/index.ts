import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  slotColors,
} from '@awdlab/jig-themes/shade/base';
import { tagControlTemplate } from '@awdlab/jig-themes/templates/tag';

export const tagStyles = createThemePart({
  controlTemplate: tagControlTemplate,
  base: baseStyles.tag,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // shadcn Badge: a filled label recolored by the color-* class; pill rounds it fully.
    css: ({ v, c }) => css`
      ${slotColors(c, v)}

      ${c('root')} {
        gap: ${v('size.padding.sm')};
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        line-height: 1;
        border: 1px solid transparent;
        border-radius: ${v('size.rounded.md')};
        font-weight: ${v('font.weight.medium')};
        font-size: ${v('font.size.xs')};
        background: var(--theme-bg, ${v('color.primary.base')});
        color: var(--theme-fg, ${v('color.primary.foreground')});
      }

      ${c('icon')} {
        color: inherit;
        font-size: inherit;
      }

      ${c('kind-pill')} {
        border-radius: ${v('size.rounded.full')};
      }
    `,
  },
});
