import { createThemePart, css } from '@ngneers/controls-themes/api';
import { treeControlTemplate } from '@ngneers/controls-themes/templates/tree';

export const treeStyles = createThemePart({
  controlTemplate: treeControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        width: 100%;
        height: 100%;
        display: block;
      }
      ${c('item')},
      ${c('group')} {
        display: inline-flex;
        align-items: center;
        width: 100%;
        padding-inline-start: calc(var(--ngn-tree-level, 0) * 1.5rem);
      }
      ${c('toggle')},
      ${c('toggle-placeholder')},
      ${c('item-checkbox-placeholder')} {
        flex: none;
        width: 1.5rem;
      }
      ${c('toggle')} {
        /* Full item height so the whole column expands/collapses instead of selecting. */
        align-self: stretch;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        background: transparent;
        cursor: pointer;
        padding: 0;
      }
      ${c('toggle-icon')} {
        /* Icon-button visual: a centred, fixed square that gets the hover affordance. */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        transition: background 0.15s ease;
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
      ${c('root')}:has(${c('empty')}) ${c('scroller')} {
        display: none;
      }
      ${c('root')} ${d('scroller', 'item')} {
        display: flex;
      }
    `,
  },
});
