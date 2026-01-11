import { createThemePart, css } from '@ngneers/controls-themes/api';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c()} {
        width: 100%;
        height: 100%;
      }
      ${c('item')} {
        display: inline-block;
        width: 100%;
      }
      ${c('group')} {
        display: inline-block;
        width: 100%;
      }
      ${c('')}:has(${c('empty')}) ${c('scroller')} {
        display: none;
      }
      ${c()} ${d('scroller', 'item')} {
        display: flex;
      }
    `,
  },
});
