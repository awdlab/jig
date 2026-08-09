import { createThemePart, css } from '@awdlab/jig-themes/api';
import { treeControlTemplate } from '@awdlab/jig-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      /* The role host owns the scroll port: role="tree" must be both the scrollable
         region (so the keyboard reaches it) and the direct parent of its treeitems. */
      ${c('root')} {
        width: 100%;
        height: 100%;
        display: block;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        overflow-anchor: none;
      }
      ${c('root')} ${d('scroller')} {
        overflow: visible;
        height: auto;
      }
      ${c('item')},
      ${c('group')} {
        display: inline-flex;
        align-items: center;
        /* Margin, not padding: the indent gutter stays outside the row box so row
           backgrounds (hover/selected) start at the item instead of at the row edge. */
        margin-inline-start: calc(var(--awd-tree-level, 0) * 1.5rem);
      }
      ${c('toggle')},
      ${c('toggle-placeholder')},
      ${c('item-checkbox-placeholder')} {
        flex: none;
        width: 1.5rem;
      }
      ${c('toggle')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: inherit;
      }
      ${c('toggle-icon')} {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      ${c('toggle-arrow')} {
        display: inline-block;
        transition: transform 0.15s ease;
      }
      ${c('item-expanded')} ${c('toggle-arrow')} {
        transform: rotate(90deg);
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
