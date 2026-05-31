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
        display: block;
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
      ${c('root')}:has(${c('empty')}) ${c('scroller')} {
        display: none;
      }
      ${c('root')} ${d('scroller', 'item')} {
        display: flex;
      }
    `,
  },
});
