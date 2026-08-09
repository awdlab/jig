import { createThemePart, css } from '@awdlab/jig-themes/api';
import { commandControlTemplate } from '@awdlab/jig-themes/templates/command';

export const commandStyles = createThemePart({
  controlTemplate: commandControlTemplate,
  dependencies: [],
  root: {
    css: ({ c, d }) => css`
      ${c('root')} {
        display: contents;
      }
      ${c('root')} ${d('dialog', 'wrapper')} {
        padding: 0;
        overflow: hidden;
        /* sits high in the viewport, the way a palette is expected to appear */
        margin-block: 12vh auto;
      }
      ${c('root')} ${d('search', 'root')} {
        min-height: 3.25rem;
        flex: none;
        /* the search row reads as part of the palette, not as a nested control */
        border: none;
        /* the palette clips its overflow, so the field's focus ring is inset to stay visible */
        outline-offset: -3px;
      }
      /* flex-basis auto and no percentage height: the dialog is sized by fit-content, and
         Safari resolves both against that circular height as zero, collapsing the list away. */
      ${c('root')} ${d('list-box')} {
        flex: 1 1 auto;
        height: auto;
        min-height: 0;
        border: none;
        border-radius: 0;
      }
      ${c('root')} ${d('list-box', 'item')} {
        min-height: 2.375rem;
      }
      ${c('item')} {
        display: flex;
        align-items: center;
        width: 100%;
        min-width: 0;
      }
      ${c('item-icon')} {
        flex: none;
      }
      ${c('item-label')} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /* the keycap trails the label, pushed to the row's end */
      ${c('item-shortcut')} {
        margin-inline-start: auto;
      }
      ${c('hints')} {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
      ${c('hint')} {
        display: inline-flex;
        align-items: center;
      }
      /* hints place themselves: the first one holds the left edge, the rest ride the right */
      ${c('hint')}:first-of-type {
        margin-inline-end: auto;
      }
      ${c('empty')} {
        display: block;
        text-align: center;
      }
      /* a coarse pointer has no hardware keyboard, so the shortcut legend is dead weight */
      @media (hover: none) and (pointer: coarse) {
        ${c('root')} ${d('dialog', 'footer')} {
          display: none;
        }
      }
    `,
  },
});
