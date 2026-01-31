import { createThemePart, css } from '@ngneers/controls-themes/api';
import { baseStyles } from '@ngneers/controls-themes/base';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const itemViewStyles = createThemePart({
  controlTemplate: itemViewControlTemplate,
  base: baseStyles.itemView,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c('root')} {
        gap: 4px;
      }
    `,
  },
});
