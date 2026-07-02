import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  slotColors,
} from '@ngneers/controls-themes/shade/base';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

export const tagStyles = createThemePart({
  controlTemplate: tagControlTemplate,
  base: baseStyles.tag,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    // shadcn Badge: kind picks the variant; a color-* class recolors the filled kinds.
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
      }

      ${c('icon')} {
        color: inherit;
        font-size: inherit;
      }

      ${c('kind-default')} {
        --tag-bg: var(--theme-bg, ${v('color.primary.base')});
        background: var(--tag-bg);
        color: var(--theme-fg, ${v('color.primary.foreground')});
      }
      ${c('kind-secondary')} {
        --tag-bg: var(--theme-bg, ${v('color.secondary.base')});
        background: var(--tag-bg);
        color: var(--theme-fg, ${v('color.secondary.foreground')});
      }
      ${c('kind-destructive')} {
        --tag-bg: var(--theme-bg, ${v('color.destructive.base')});
        background: var(--tag-bg);
        color: var(--theme-fg, ${v('color.destructive.foreground')});
      }
      ${c('kind-outline')} {
        background: transparent;
        color: ${v('color.foreground')};
        border-color: ${v('color.border')};
      }
    `,
  },
});
