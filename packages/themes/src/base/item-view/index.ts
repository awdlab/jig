import { createThemePart, css } from '@awdlab/jig-themes/api';
import { itemViewControlTemplate } from '@awdlab/jig-themes/templates/item-view';

export const itemViewStyles = createThemePart({
  controlTemplate: itemViewControlTemplate,
  dependencies: [],
  root: {
    css: ({ v, c }) => css`
      :has(> ${c('root')}) {
        min-width: 0;
      }
      ${c('root')} {
        display: flex;
        /* Content width set by the component (see JigItemView host); max-width keeps
           overflow working when constrained. */
        width: var(--jig-item-view-content-width, 100%);
        max-width: 100%;
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
      ${c('more-items-default')} {
        /* Changing width in number chars might result in flickering behavior */
        font-variant-numeric: tabular-nums;
      }
      ${c('more-items-hidden')}, ${c('item-overflowing')} {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        top: -9999px;
        left: -9999px;
      }
      ${c('more-items-hidden')} {
        visibility: hidden;
      }
    `,
  },
});
