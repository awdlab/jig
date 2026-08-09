import { createThemePart, css } from '@awdlab/jig-themes/api';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';

export const listBoxStyles = createThemePart({
  controlTemplate: listBoxControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      /* The role host owns the scroll port: role="listbox" must be both the scrollable
         region (so the keyboard reaches it) and the direct parent of its options. */
      ${c('root')} {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        overflow-anchor: none;
      }
      ${c('root')} ${d('scroller')} {
        flex: 1;
        min-height: 0;
        overflow: visible;
        height: auto;
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
