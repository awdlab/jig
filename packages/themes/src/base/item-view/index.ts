import { createThemePart, css } from '@ngneers/controls-themes/api';
import { itemViewControlTemplate } from '@ngneers/controls-themes/templates/item-view';

export const itemViewStyles = createThemePart({
  controlTemplate: itemViewControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      ${c()} {
        display: flex;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
      }
      ${c('item')} {
        display: inline-block;
        &${c('hidden-separator')} {
          visibility: hidden;
        }
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
