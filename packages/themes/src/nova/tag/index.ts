import { createThemePart, css } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import {
  colorsTemplate,
  fontTemplate,
  sizesTemplate,
  themedColors,
} from '@awdlab/jig-themes/nova/base';
import { tagControlTemplate } from '@awdlab/jig-themes/templates/tag';

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
