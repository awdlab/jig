import { createThemePart, css } from '@ngneers/controls-themes/api';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        width: 100%;
        height: 100%;
        /* a column flex box gives the scroller a definite height to fill, which a percentage
           cannot resolve when the list box itself is sized by its own flex parent */
        display: flex;
        flex-direction: column;
      }
      ${c('root')} ${d('scroller')} {
        flex: 1;
        min-height: 0;
      }
      ${c('item')} {
        display: inline-block;
        width: 100%;
      }
      ${c('group')} {
        display: inline-block;
        width: 100%;
      }
      ${c('item-disabled')} {
        pointer-events: none;
        opacity: 0.5;
      }
      ${c('root')}:has(${c('empty')}) ${d('scroller')} {
        display: none;
      }
      ${c('root')} ${d('scroller', 'item')} {
        display: flex;
      }
    `,
  },
});
