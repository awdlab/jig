import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, fontTemplate, sizesTemplate } from '@ngneers/controls-themes/shade/base';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const itemViewStyles = createThemePart({
  controlTemplate: itemViewControlTemplate,
  base: baseStyles.itemView,
  dependencies: [colorsTemplate, sizesTemplate, fontTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        font-size: ${v('font.size.sm')};
        gap: 4px;
      }
    `,
  },
});
