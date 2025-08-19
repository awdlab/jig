import { createThemePart, css } from '@ngneers/controls-themes/api';
import { colorsTemplate, sizesTemplate } from '@ngneers/controls-themes/nova/base';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const itemViewStyles = createThemePart({
  controlTemplate: itemViewControlTemplate,
  dependencies: [colorsTemplate, sizesTemplate],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        width: 100%;
        gap: 4px;
        white-space: nowrap;
        overflow: hidden;
      }
      ${c('item-overflowing')} {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        top: -9999px;
        left: -9999px;
      }
    `,
  },
});
