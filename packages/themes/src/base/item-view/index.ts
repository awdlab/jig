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
        display: flex;
        align-items: center;
        &${c('hidden-separator')} {
          visibility: hidden;
        }
      }
      ${c('more-items')} {
        display: flex;
        align-items: center;
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
