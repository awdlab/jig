import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@ngneers/controls-themes/nova/base';
import { tagControlTemplate } from '@ngneers/controls-themes/templates/tag';

export const tagStyles = createThemePart({
  controlTemplate: tagControlTemplate,
  base: baseStyles.tag,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${themedColors(c, v)}

      ${c('root')} {
        gap: ${v('size.padding.md')};
        background: var(--theme-color-100);
        color: var(--theme-color-600-on-100);
        padding: ${v('size.padding.sm')} ${v('size.padding.md')};
        line-height: 1;
        border-radius: ${v('size.rounded.md')};
        font-weight: ${v('font.weight.semibold')};
        font-size: ${v('font.size.xs')};
      }

      ${c('icon')} {
        color: var(--theme-color-600-on-100);
        font-size: inherit;
      }

      ${c('kind-pill')} {
        border-radius: ${v('size.rounded.full')};
      }
    `,
  },
});
